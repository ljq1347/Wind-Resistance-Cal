import * as THREE from '../lib/three/three.module.js';

const StressVisualization = (function() {
    let stressData = {};
    let originalMaterials = {};
    let isActive = false;
    let legendMesh = null;
    let stressLabels = [];

    function getStressColor(stress, minStress, maxStress) {
        const normalized = (stress - minStress) / (maxStress - minStress || 1);
        
        let r, g, b;
        if (normalized < 0.25) {
            r = 0;
            g = normalized * 4;
            b = 1;
        } else if (normalized < 0.5) {
            r = 0;
            g = 1;
            b = 1 - (normalized - 0.25) * 4;
        } else if (normalized < 0.75) {
            r = (normalized - 0.5) * 4;
            g = 1;
            b = 0;
        } else {
            r = 1;
            g = 1 - (normalized - 0.75) * 4;
            b = 0;
        }
        
        return new THREE.Color(r, g, b);
    }

    function applyStressToObject(objectName, stressValues) {
        const obj = window.WindSimulationCore.getObject(objectName);
        if (!obj) return;

        if (!originalMaterials[objectName]) {
            originalMaterials[objectName] = {};
            obj.traverse((child) => {
                if (child.isMesh && child.material) {
                    originalMaterials[objectName][child.uuid] = child.material.clone();
                }
            });
        }

        const minStress = Math.min(...stressValues);
        const maxStress = Math.max(...stressValues);

        obj.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const geometry = child.geometry;
                const positions = geometry.attributes.position;
                const colors = new Float32Array(positions.count * 3);

                for (let i = 0; i < positions.count; i++) {
                    const y = positions.getY(i);
                    const normalizedY = y / 6;
                    const stressIndex = Math.floor(normalizedY * (stressValues.length - 1));
                    const stress = stressValues[Math.min(stressIndex, stressValues.length - 1)];
                    
                    const color = getStressColor(stress, minStress, maxStress);
                    colors[i * 3] = color.r;
                    colors[i * 3 + 1] = color.g;
                    colors[i * 3 + 2] = color.b;
                }

                geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                
                const stressMaterial = new THREE.MeshStandardMaterial({
                    vertexColors: true,
                    roughness: 0.4,
                    metalness: 0.6,
                    transparent: true,
                    opacity: 0.95
                });
                child.material = stressMaterial;
            }
        });
    }

    function createStressLabels(scene) {
        removeStressLabels(scene);
        
        const labelConfig = [
            { name: 'pole_bottom', position: [0, 0.5, 0.3], stress: 50 },
            { name: 'pole_middle', position: [0, 3, 0.3], stress: 180 },
            { name: 'pole_top', position: [0, 5.5, 0.3], stress: 320 },
            { name: 'arm_root', position: [0.1, 5.5, 0.1], stress: 150 },
            { name: 'arm_end', position: [1.2, 5.5, -1.2], stress: 350 },
            { name: 'solar_center', position: [0, 6.1, 0], stress: 100 },
            { name: 'battery_center', position: [-0.2, 3.5, 0.2], stress: 80 }
        ];
        
        labelConfig.forEach(config => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 80;
            canvas.height = 40;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#333';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(config.stress + ' MPa', canvas.width / 2, 22);
            
            const color = getStressColor(config.stress, 50, 350);
            ctx.fillStyle = color.getStyle();
            ctx.fillRect(canvas.width - 15, 5, 10, 30);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true
            });
            const geometry = new THREE.PlaneGeometry(0.8, 0.4);
            const label = new THREE.Mesh(geometry, material);
            
            label.position.set(config.position[0], config.position[1], config.position[2]);
            label.lookAt(new THREE.Vector3(0, 3, 0));
            label.name = 'stress_label_' + config.name;
            
            scene.add(label);
            stressLabels.push(label);
        });
    }
    
    function removeStressLabels(scene) {
        stressLabels.forEach(label => {
            scene.remove(label);
        });
        stressLabels = [];
    }
    
    function createLegend(scene) {
        if (legendMesh) {
            scene.remove(legendMesh);
            legendMesh = null;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 180;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#333';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Stress Contour - Stress Distribution', canvas.width / 2, 28);

        const gradient = ctx.createLinearGradient(30, 50, canvas.width - 30, 50);
        gradient.addColorStop(0, '#0000ff');
        gradient.addColorStop(0.25, '#00ffff');
        gradient.addColorStop(0.5, '#00ff00');
        gradient.addColorStop(0.75, '#ffff00');
        gradient.addColorStop(1, '#ff0000');
        ctx.fillStyle = gradient;
        ctx.fillRect(30, 50, canvas.width - 60, 30);

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 50, canvas.width - 60, 30);

        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        
        const stressValues = [50, 125, 200, 275, 350];
        for (let i = 0; i < stressValues.length; i++) {
            const x = 30 + (canvas.width - 60) * (i / (stressValues.length - 1));
            ctx.fillText(stressValues[i] + ' MPa', x, 100);
        }

        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(30, 120, 20, 15);
        ctx.fillStyle = '#333';
        ctx.fillText('Safe (< 125 MPa)', 55, 133);
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(30, 145, 20, 15);
        ctx.fillStyle = '#333';
        ctx.fillText('Caution (125-200 MPa)', 55, 158);
        
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(180, 120, 20, 15);
        ctx.fillStyle = '#333';
        ctx.fillText('Warning (200-275 MPa)', 205, 133);
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(180, 145, 20, 15);
        ctx.fillStyle = '#333';
        ctx.fillText('Danger (> 275 MPa)', 205, 158);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        
        const geometry = new THREE.PlaneGeometry(4, 1.8);
        legendMesh = new THREE.Mesh(geometry, material);

        legendMesh.position.set(6.5, 4.5, 6.5);
        legendMesh.name = 'stress_legend';

        scene.add(legendMesh);
    }

    function updateLegendPosition(camera) {
        if (legendMesh && camera) {
            legendMesh.lookAt(camera.position);
        }
    }

    function setStressData(data) {
        stressData = data;
        console.log('Stress data set:', data);
    }

    function show(stressDataInput) {
        if (stressDataInput) {
            setStressData(stressDataInput);
        }

        const scene = window.WindSimulationCore.getScene();
        if (!scene) {
            console.error('Scene not found');
            return;
        }

        const poleStress = [50, 80, 120, 180, 250, 320];
        applyStressToObject('pole', poleStress);

        const armStress = [100, 150, 200, 280, 350];
        applyStressToObject('arm', armStress);

        const batteryStress = [60, 70, 80, 90];
        applyStressToObject('batteryBox', batteryStress);

        createLegend(scene);
        createStressLabels(scene);

        window.WindSimulationCore.addEffect({
            update: (state, time) => {
                updateLegendPosition(window.WindSimulationCore.getCamera());
            }
        });

        isActive = true;
        console.log('Stress visualization activated');
    }

    function hide() {
        Object.keys(originalMaterials).forEach(objectName => {
            const obj = window.WindSimulationCore.getObject(objectName);
            if (obj) {
                obj.traverse((child) => {
                    if (child.isMesh && originalMaterials[objectName][child.uuid]) {
                        child.material = originalMaterials[objectName][child.uuid];
                    }
                });
            }
        });

        const scene = window.WindSimulationCore.getScene();
        if (legendMesh && scene) {
            scene.remove(legendMesh);
            legendMesh = null;
        }
        
        removeStressLabels(scene);

        isActive = false;
        console.log('Stress visualization deactivated');
    }

    function toggle(stressDataInput) {
        if (isActive) {
            hide();
        } else {
            show(stressDataInput);
        }
        return isActive;
    }

    function getIsActive() {
        return isActive;
    }

    return {
        setStressData,
        show,
        hide,
        toggle,
        getIsActive
    };
})();

window.StressVisualization = StressVisualization;
export default StressVisualization;