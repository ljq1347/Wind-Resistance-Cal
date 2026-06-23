
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
            console.error('[WindEffects] THREE is not loaded!');
            return;
        }
        
        var THREE = window.THREE;
        
        function createWindSystem(scene) {
            var particleCount = 3000;
            var windParticles = null;
            
            var geometry = new THREE.BufferGeometry();
            var positions = new Float32Array(particleCount * 3);
            var colors = new Float32Array(particleCount * 3);
            
            for (var i = 0; i < particleCount; i++) {
                positions[i * 3] = -12 + Math.random() * 24;
                positions[i * 3 + 1] = 0.5 + Math.random() * 5;
                positions[i * 3 + 2] = -10 + Math.random() * 20;
                
                colors[i * 3] = 0.8;
                colors[i * 3 + 1] = 0.0;
                colors[i * 3 + 2] = 0.0;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            var material = new THREE.PointsMaterial({
                size: 0.04,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                sizeAttenuation: true
            });
            
            windParticles = new THREE.Points(geometry, material);
            scene.add(windParticles);
            
            function updateWindParticles(state, time) {
                if (!windParticles) return;
                
                var positions = windParticles.geometry.attributes.position.array;
                var baseSpeed = 0.15 + (state.windSpeed / 50) * 1.2;
                
                for (var i = 0; i < particleCount; i++) {
                    positions[i * 3] -= baseSpeed * (0.5 + Math.random() * 0.5);
                    
                    if (positions[i * 3] < -14) {
                        positions[i * 3] = 14;
                        positions[i * 3 + 1] = 0.5 + Math.random() * 5;
                        positions[i * 3 + 2] = -10 + Math.random() * 20;
                    }
                }
                
                windParticles.geometry.attributes.position.needsUpdate = true;
            }
            
            return { update: updateWindParticles };
        }
        
        function createWindIndicator(scene) {
            var group = new THREE.Group();
            
            var arrowGeometry = new THREE.ConeGeometry(0.3, 1, 8);
            var arrowMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6600,
                roughness: 0.3,
                metalness: 0.5
            });
            var arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
            arrow.rotation.z = -Math.PI / 2;
            arrow.position.y = 1;
            
            var baseGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.1, 16);
            var baseMaterial = new THREE.MeshStandardMaterial({
                color: 0x444444,
                roughness: 0.8,
                metalness: 0.2
            });
            var base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.y = 0.05;
            
            group.add(base);
            group.add(arrow);
            
            return {
                group: group,
                update: function(state, time) {
                    var speed = state.windSpeed || 2;
                    arrow.scale.y = 0.5 + speed * 0.1;
                    arrow.position.y = 0.5 + arrow.scale.y * 0.5;
                    base.position.y = arrow.scale.y * 0.3;
                }
            };
        }
        
        function applyWindToObjects(state, time) {
            var speed = state.windSpeed || 2;
            var WindSimulationCore = window.WindSimulationCore;
            
            if (WindSimulationCore && WindSimulationCore.getObjects) {
                var objects = WindSimulationCore.getObjects();
                
                if (objects.solarPanel) {
                    var sway = Math.sin(time * 2) * speed * 0.02;
                    objects.solarPanel.rotation.z = sway;
                }
                
                if (objects.arm) {
                    var armSway = Math.sin(time * 1.5) * speed * 0.01;
                    objects.arm.rotation.z = armSway;
                }
                
                if (objects.luminaire) {
                    var lightSway = Math.sin(time * 2.5) * speed * 0.015;
                    objects.luminaire.rotation.z = lightSway;
                }
            }
        }
        
        window.WindEffects = {
            createWindSystem: createWindSystem,
            createWindIndicator: createWindIndicator,
            applyWindToObjects: applyWindToObjects
        };
        
        console.log('[WindEffects] Fallback version loaded');
    });
    
})(window);