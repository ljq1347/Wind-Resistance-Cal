import * as THREE from '../lib/three/three.module.js';

const WindEffects = (function() {
    let windParticles = null;
    let particleCount = 3000;
    let isVisible = true;
    
    function createWindSystem(scene) {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = -12 + Math.random() * 24;
            positions[i * 3 + 1] = 0.5 + Math.random() * 5;
            positions[i * 3 + 2] = -10 + Math.random() * 20;
            
            colors[i * 3] = 0.8;
            colors[i * 3 + 1] = 0.0;
            colors[i * 3 + 2] = 0.0;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.04,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true
        });
        
        windParticles = new THREE.Points(geometry, material);
        scene.add(windParticles);
        
        return { update: updateWindParticles };
    }
    
    function updateWindParticles(state, time) {
        if (!windParticles || !isVisible) return;
        
        const positions = windParticles.geometry.attributes.position.array;
        const baseSpeed = 0.15 + (state.windSpeed / 50) * 1.2;
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] -= baseSpeed * (0.5 + Math.random() * 0.5);
            
            if (positions[i * 3] < -14) {
                positions[i * 3] = 14;
                positions[i * 3 + 1] = 0.5 + Math.random() * 5;
                positions[i * 3 + 2] = -10 + Math.random() * 20;
            }
        }
        
        windParticles.geometry.attributes.position.needsUpdate = true;
    }
    
    function toggleWindParticles() {
        isVisible = !isVisible;
        if (windParticles) {
            windParticles.visible = isVisible;
        }
        return isVisible;
    }
    
    function showWindParticles() {
        isVisible = true;
        if (windParticles) {
            windParticles.visible = true;
        }
    }
    
    function hideWindParticles() {
        isVisible = false;
        if (windParticles) {
            windParticles.visible = false;
        }
    }
    
    function isParticlesVisible() {
        return isVisible;
    }
    
    function createWindIndicator(scene) {
        const group = new THREE.Group();
        
        const arrowGeometry = new THREE.ConeGeometry(0.15, 0.4, 8);
        const arrowMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6b6b,
            metalness: 0.3,
            roughness: 0.7
        });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.y = 0.3;
        group.add(arrow);
        
        const shaftGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
        const shaftMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.5,
            roughness: 0.5
        });
        const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
        shaft.position.y = -0.1;
        group.add(shaft);
        
        const baseGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.05, 16);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.3,
            roughness: 0.8
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.52;
        group.add(base);
        
        return {
            group: group,
            update: function(state, time) {
                const scale = 0.8 + (state.windSpeed / 50) * 0.6;
                arrow.scale.set(scale, scale, scale);
            }
        };
    }
    
    function applyWindToObjects(state, time) {
        const windStrength = state.windSpeed / 50;
        const objects = window.WindSimulationCore.getObjects ? window.WindSimulationCore.getObjects() : {};
        
        if (objects.solarPanel) {
            const swayAngle = Math.sin(time * 1.5) * windStrength * 0.08;
            objects.solarPanel.rotation.z = swayAngle;
        }
        
        if (objects.luminaire) {
            const swayAngle = Math.sin(time * 1.2) * windStrength * 0.06;
            objects.luminaire.rotation.z = swayAngle;
        }
        
        if (objects.batteryBox) {
            const swayAngle = Math.sin(time * 1.8) * windStrength * 0.05;
            objects.batteryBox.rotation.z = swayAngle;
        }
    }
    
    return {
        createWindSystem: createWindSystem,
        createWindIndicator: createWindIndicator,
        applyWindToObjects: applyWindToObjects,
        toggleWindParticles: toggleWindParticles,
        showWindParticles: showWindParticles,
        hideWindParticles: hideWindParticles,
        isParticlesVisible: isParticlesVisible
    };
})();

window.WindEffects = WindEffects;
export default WindEffects;