
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
            console.error('[StressVisualization] THREE is not loaded!');
            return;
        }
        
        var THREE = window.THREE;
        
        function createStressOverlay(scene) {
            var overlayGroup = new THREE.Group();
            scene.add(overlayGroup);
            
            return {
                group: overlayGroup,
                update: function(stressData) {
                    while (overlayGroup.children.length > 0) {
                        overlayGroup.remove(overlayGroup.children[0]);
                    }
                    
                    if (!stressData || !stressData.maxStress) return;
                    
                    var WindSimulationCore = window.WindSimulationCore;
                    if (!WindSimulationCore || !WindSimulationCore.getObjects) return;
                    
                    var pole = WindSimulationCore.getObjects().pole;
                    if (!pole) return;
                    
                    var poleHeight = 6;
                    var segments = 10;
                    
                    for (var i = 0; i < segments; i++) {
                        var height = (i + 0.5) * (poleHeight / segments);
                        var stressRatio = Math.sin((i / segments) * Math.PI);
                        var stressValue = stressRatio * stressData.maxStress;
                        
                        var color = getStressColor(stressValue, stressData.maxStress);
                        
                        var ringGeometry = new THREE.RingGeometry(0.06, 0.08, 32);
                        var ringMaterial = new THREE.MeshBasicMaterial({
                            color: color,
                            transparent: true,
                            opacity: 0.8,
                            side: THREE.DoubleSide
                        });
                        
                        var ring = new THREE.Mesh(ringGeometry, ringMaterial);
                        ring.position.y = height;
                        ring.rotation.x = Math.PI / 2;
                        
                        overlayGroup.add(ring);
                    }
                }
            };
        }
        
        function getStressColor(stress, maxStress) {
            var ratio = stress / maxStress;
            
            if (ratio < 0.3) {
                return new THREE.Color().setHSL(0.67, 1, 0.5);
            } else if (ratio < 0.6) {
                return new THREE.Color().setHSL(0.5, 1, 0.5);
            } else if (ratio < 0.8) {
                return new THREE.Color().setHSL(0.17, 1, 0.5);
            } else {
                return new THREE.Color().setHSL(0, 1, 0.5);
            }
        }
        
        function createForceVectors(scene) {
            var vectorsGroup = new THREE.Group();
            scene.add(vectorsGroup);
            
            return {
                group: vectorsGroup,
                update: function(forces) {
                    while (vectorsGroup.children.length > 0) {
                        vectorsGroup.remove(vectorsGroup.children[0]);
                    }
                    
                    if (!forces || !forces.length) return;
                    
                    forces.forEach(function(force) {
                        var direction = new THREE.Vector3(force.x || 1, force.y || 0, force.z || 0);
                        var length = direction.length() * 0.1;
                        direction.normalize();
                        
                        var arrowHelper = new THREE.ArrowHelper(
                            direction,
                            new THREE.Vector3(force.originX || 0, force.originY || 3, force.originZ || 0),
                            length,
                            force.color || 0xff0000
                        );
                        
                        vectorsGroup.add(arrowHelper);
                    });
                }
            };
        }
        
        window.StressVisualization = {
            createStressOverlay: createStressOverlay,
            createForceVectors: createForceVectors,
            getStressColor: getStressColor
        };
        
        console.log('[StressVisualization] Fallback version loaded');
    });
    
})(window);