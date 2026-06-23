
(function(window) {
    'use strict';
    
    function waitForThree(callback) {
        if (window.THREE && typeof window.THREE.Scene !== 'undefined') {
            callback();
        } else {
            setTimeout(function() { waitForThree(callback); }, 50);
        }
    }
    
    waitForThree(function() {
        if (!window.THREE) {
            console.error('[WindSimulationCore] THREE is not loaded!');
            return;
        }
        
        var THREE = window.THREE;
        var OrbitControls = window.OrbitControls;
        
        var scene, camera, renderer, container, controls;
        var animationId = null;
        var objects = {};
        var effects = [];
        var isRunning = false;
        
        var state = {
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
            
            try {
                createScene();
                createCamera();
                createRenderer();
                createControls();
                addLights();
                if (state.showGrid) addGrid();
                
                container.appendChild(renderer.domElement);
                window.addEventListener('resize', onWindowResize);
                
                return true;
            } catch (e) {
                console.error('[WindSimulationCore] Failed to initialize:', e);
                return false;
            }
        }
        
        function createScene() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f4f8);
        }
        
        function createCamera() {
            var width = container.clientWidth || window.innerWidth;
            var height = container.clientHeight || window.innerHeight;
            var aspect = width / height;
            camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
            camera.position.set(10, 3, 10);
        }
        
        function createControls() {
            console.log('Creating controls...');
            
            if (OrbitControls) {
                try {
                    controls = new OrbitControls(camera, renderer.domElement);
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
                } catch (e) {
                    console.error('[WindSimulationCore] Failed to create controls:', e);
                }
            } else {
                console.warn('OrbitControls not available, using manual rotation');
            }
        }
        
        function createRenderer() {
            try {
                renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            } catch (e) {
                console.error('[WindSimulationCore] Failed to create WebGL renderer:', e);
                throw e;
            }
        }
        
        function handleWheelZoom(event) {
            event.preventDefault();
            
            if (!camera || !controls) return;
            
            var zoomSpeed = 0.001;
            var delta = -event.deltaY * zoomSpeed;
            
            var direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            
            var zoomAmount = direction.clone().multiplyScalar(delta * 10);
            
            var newPosition = camera.position.clone().add(zoomAmount);
            var distanceToTarget = newPosition.distanceTo(controls.target);
            
            if (distanceToTarget >= controls.minDistance && distanceToTarget <= controls.maxDistance) {
                camera.position.add(zoomAmount);
            }
        }
        
        function addLights() {
            var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 20, 10);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 1024;
            directionalLight.shadow.mapSize.height = 1024;
            directionalLight.shadow.camera.near = 0.5;
            directionalLight.shadow.camera.far = 100;
            directionalLight.shadow.camera.left = -20;
            directionalLight.shadow.camera.right = 20;
            directionalLight.shadow.camera.top = 20;
            directionalLight.shadow.camera.bottom = -20;
            scene.add(directionalLight);
            
            var fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
            fillLight.position.set(-5, 10, -5);
            scene.add(fillLight);
        }
        
        function addGrid() {
            var gridHelper = new THREE.GridHelper(20, 20, 0xcccccc, 0xeeeeee);
            gridHelper.position.y = 0;
            scene.add(gridHelper);
        }
        
        function addObject(name, object) {
            if (object) {
                objects[name] = object;
                scene.add(object);
                console.log('Object added:', name, 'Scene children:', scene.children.length);
            } else {
                console.error('Object is null or undefined:', name);
            }
        }
        
        function getObject(name) {
            return objects[name] || null;
        }
        
        function removeObject(name) {
            var object = objects[name];
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
            var index = effects.indexOf(effect);
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
            
            var time = Date.now() * 0.001;
            
            if (controls) {
                try {
                    controls.update();
                } catch (e) {
                    console.warn('[WindSimulationCore] Controls update error:', e);
                }
            }
            
            effects.forEach(function(effect) {
                try {
                    effect.update(state, time);
                } catch (e) {
                    console.warn('[WindSimulationCore] Effect update error:', e);
                }
            });
            
            try {
                renderer.render(scene, camera);
            } catch (e) {
                console.warn('[WindSimulationCore] Render error:', e);
            }
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
            
            var width = container.clientWidth || window.innerWidth;
            var height = container.clientHeight || window.innerHeight;
            
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
        
        function getScene() { return scene; }
        function getCamera() { return camera; }
        function getObjects() { return objects; }
        function getState() { return Object.assign({}, state, { objects: objects }); }
        
        window.WindSimulationCore = {
            init: init,
            start: start,
            stop: stop,
            destroy: destroy,
            addObject: addObject,
            getObject: getObject,
            removeObject: removeObject,
            addEffect: addEffect,
            removeEffect: removeEffect,
            setWindSpeed: setWindSpeed,
            getWindSpeed: getWindSpeed,
            setSolarPanelSize: setSolarPanelSize,
            getSolarPanelSize: getSolarPanelSize,
            toggleAutoRotate: toggleAutoRotate,
            getState: getState,
            getScene: getScene,
            getCamera: getCamera,
            getObjects: getObjects
        };
        
        console.log('[WindSimulationCore] Fallback version loaded');
    });
    
})(window);