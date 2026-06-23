import * as THREE from '../lib/three/three.module.js';
import { OrbitControls } from '../lib/three/three.addons/OrbitControls.js';

const WindSimulationCore = (function() {
    let scene, camera, renderer, container, controls;
    let animationId = null;
    let objects = {};
    let effects = [];
    let isRunning = false;
    
    const state = {
        windSpeed: 2,
        solarPanelSize: { width: 1.2, height: 0.8 },
        autoRotate: true,
        showGrid: true
    };
    
    function init(containerId) {
        container = document.getElementById(containerId);
        if (!container) {
            console.error('Container element not found');
            return false;
        }
        
        createScene();
        createCamera();
        createRenderer();
        createControls();
        addLights();
        if (state.showGrid) addGrid();
        
        container.appendChild(renderer.domElement);
        
        window.addEventListener('resize', onWindowResize);
        
        return true;
    }
    
    function createScene() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f4f8);
    }
    
    function createCamera() {
        const aspect = container.clientWidth / container.clientHeight;
        camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        camera.position.set(10, 3, 10);
    }
    
    function createControls() {
        console.log('Creating controls...');
        console.log('THREE exists:', typeof THREE !== 'undefined');
        
        const ControlsClass = OrbitControls;
        console.log('ControlsClass:', ControlsClass);
        if (ControlsClass) {
            controls = new ControlsClass(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 3;
            controls.maxDistance = 30;
            controls.maxPolarAngle = Math.PI / 2.1;
            controls.target.set(0.5, 3, 0.5);
            controls.autoRotate = state.autoRotate;
            controls.autoRotateSpeed = 2.0;
            controls.enableRotate = true;
            controls.enableZoom = false;
            
            renderer.domElement.addEventListener('wheel', handleWheelZoom, { passive: false });
            
            controls.addEventListener('end', function() {
                controls.autoRotate = true;
            });
            
            console.log('Controls created successfully');
            console.log('Auto-rotate enabled:', controls.autoRotate);
        } else {
            console.error('OrbitControls not found!');
        }
    }
    
    function createRenderer() {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    function handleWheelZoom(event) {
        event.preventDefault();
        
        if (!camera || !controls) return;
        
        const zoomSpeed = 0.001;
        const delta = -event.deltaY * zoomSpeed;
        
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        
        const zoomAmount = direction.multiplyScalar(delta * 10);
        
        const newPosition = camera.position.clone().add(zoomAmount);
        const distanceToTarget = newPosition.distanceTo(controls.target);
        
        if (distanceToTarget >= controls.minDistance && distanceToTarget <= controls.maxDistance) {
            camera.position.add(zoomAmount);
        }
    }
    
    function addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        scene.add(directionalLight);
        
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 10, -5);
        scene.add(fillLight);
    }
    
    function addGrid() {
        const gridHelper = new THREE.GridHelper(20, 20, 0xcccccc, 0xeeeeee);
        gridHelper.position.y = 0;
        scene.add(gridHelper);
        
        addAreaLabels();
    }
    
    function addAreaLabels() {
        const labelPositions = [
            { position: [0, 0.01, -10], text: '1', rotation: 0 },
            { position: [-10, 0.01, 0], text: '2', rotation: Math.PI / 2 },
            { position: [10, 0.01, 0], text: '3', rotation: -Math.PI / 2 },
            { position: [0, 0.01, 10], text: '4', rotation: Math.PI }
        ];
        
        labelPositions.forEach(({ position, text, rotation }) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 128;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = 'bold 80px Arial';
            ctx.fillStyle = '#2b579a';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.MeshBasicMaterial({ 
                map: texture, 
                transparent: true 
            });
            const geometry = new THREE.PlaneGeometry(2, 1);
            const label = new THREE.Mesh(geometry, material);
            
            label.position.set(position[0], position[1], position[2]);
            label.rotation.y = rotation;
            label.name = `label_${text}`;
            
            scene.add(label);
        });
    }
    
    function addObject(name, object) {
        if (object) {
            objects[name] = object;
            scene.add(object);
            console.log(`Object '${name}' added to scene. Scene children:`, scene.children.length);
        } else {
            console.error(`Object '${name}' is null or undefined!`);
        }
    }
    
    function getObject(name) {
        return objects[name] || null;
    }
    
    function removeObject(name) {
        const object = objects[name];
        if (object) {
            scene.remove(object);
            delete objects[name];
        }
    }
    
    function addEffect(effect) {
        if (effect && typeof effect.update === 'function') {
            effects.push(effect);
        }
    }
    
    function removeEffect(effect) {
        const index = effects.indexOf(effect);
        if (index > -1) {
            effects.splice(index, 1);
        }
    }
    
    function setWindSpeed(speed) {
        state.windSpeed = Math.max(0, Math.min(50, speed));
    }
    
    function getWindSpeed() {
        return state.windSpeed;
    }
    
    function setSolarPanelSize(width, height) {
        state.solarPanelSize = {
            width: Math.max(0.5, Math.min(2.0, width)),
            height: Math.max(0.3, Math.min(1.5, height))
        };
        
        if (objects.solarPanel) {
            objects.solarPanel.scale.set(
                state.solarPanelSize.width,
                state.solarPanelSize.height,
                0.02
            );
        }
    }
    
    function getSolarPanelSize() {
        return state.solarPanelSize;
    }
    
    function toggleAutoRotate() {
        state.autoRotate = !state.autoRotate;
        if (controls) {
            controls.autoRotate = state.autoRotate;
        }
        return state.autoRotate;
    }
    
    function animate() {
        if (!isRunning) return;
        
        animationId = requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        if (controls) {
            controls.update();
        }
        
        effects.forEach(effect => {
            effect.update(state, time);
        });
        
        renderer.render(scene, camera);
    }
    
    function start() {
        if (!isRunning) {
            isRunning = true;
            animate();
        }
    }
    
    function stop() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    
    function onWindowResize() {
        if (!container || !camera || !renderer) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    
    function destroy() {
        stop();
        window.removeEventListener('resize', onWindowResize);
        
        if (renderer) {
            renderer.dispose();
        }
        
        scene = null;
        camera = null;
        renderer = null;
        container = null;
        objects = {};
        effects = [];
    }
    
    return {
        init,
        start,
        stop,
        destroy,
        addObject,
        getObject,
        removeObject,
        addEffect,
        removeEffect,
        setWindSpeed,
        getWindSpeed,
        setSolarPanelSize,
        getSolarPanelSize,
        toggleAutoRotate,
        getState: () => ({ ...state, objects }),
        getScene: () => scene,
        getCamera: () => camera,
        getObjects: () => objects
    };
})();

window.WindSimulationCore = WindSimulationCore;
export default WindSimulationCore;