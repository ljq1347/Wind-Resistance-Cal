
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
            console.error('[SceneObjects] THREE is not loaded!');
            return;
        }
        
        var THREE = window.THREE;
        
        function createPole(options) {
            options = options || {};
            var height = options.height || 6;
            var bottomDiameter = options.bottomDiameter || 0.14;
            var topDiameter = options.topDiameter || 0.10;
            
            var group = new THREE.Group();
            
            var poleGeometry = new THREE.CylinderGeometry(
                topDiameter / 2,
                bottomDiameter / 2,
                height,
                32
            );
            
            var poleMaterial = new THREE.MeshStandardMaterial({
                color: 0x4a4a4a,
                roughness: 0.8,
                metalness: 0.3
            });
            
            var pole = new THREE.Mesh(poleGeometry, poleMaterial);
            pole.position.y = height / 2;
            pole.castShadow = true;
            pole.receiveShadow = true;
            
            var baseGeometry = new THREE.CylinderGeometry(
                bottomDiameter,
                bottomDiameter * 1.5,
                0.08,
                32
            );
            
            var baseMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                roughness: 0.9,
                metalness: 0.2
            });
            
            var base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.y = 0.04;
            base.castShadow = true;
            
            group.add(pole);
            group.add(base);
            
            return group;
        }
        
        function createSolarPanel(options) {
            options = options || {};
            var width = options.width || 1.2;
            var height = options.height || 0.8;
            var thickness = options.thickness || 0.02;
            
            var group = new THREE.Group();
            
            var panelGeometry = new THREE.BoxGeometry(width, height, thickness);
            
            var panelMaterial = new THREE.MeshStandardMaterial({
                color: 0x1e3d70,
                roughness: 0.3,
                metalness: 0.8
            });
            
            var panel = new THREE.Mesh(panelGeometry, panelMaterial);
            panel.position.z = thickness / 2;
            panel.castShadow = true;
            panel.receiveShadow = true;
            
            var frameGeometry = new THREE.BoxGeometry(width + 0.02, height + 0.02, 0.01);
            
            var frameMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                roughness: 0.4,
                metalness: 0.7
            });
            
            var frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.z = thickness / 2 + 0.005;
            frame.castShadow = true;
            
            group.add(panel);
            group.add(frame);
            
            return group;
        }
        
        function createLuminaire(options) {
            options = options || {};
            var group = new THREE.Group();
            
            var housingGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.2);
            var housingMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                roughness: 0.3,
                metalness: 0.3
            });
            
            var housing = new THREE.Mesh(housingGeometry, housingMaterial);
            housing.castShadow = true;
            housing.receiveShadow = true;
            
            var lensGeometry = new THREE.BoxGeometry(0.28, 0.02, 0.12);
            var lensMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffcc,
                roughness: 0.1,
                metalness: 0.1,
                transparent: true,
                opacity: 0.9
            });
            
            var lens = new THREE.Mesh(lensGeometry, lensMaterial);
            lens.position.set(0, -0.085, 0);
            lens.castShadow = true;
            
            group.add(housing);
            group.add(lens);
            
            return group;
        }
        
        function createBatteryBox(options) {
            options = options || {};
            var width = options.width || 0.4;
            var height = options.height || 0.3;
            var depth = options.depth || 0.25;
            
            var group = new THREE.Group();
            
            var boxGeometry = new THREE.BoxGeometry(width, height, depth);
            var boxMaterial = new THREE.MeshStandardMaterial({
                color: 0x222222,
                roughness: 0.7,
                metalness: 0.2
            });
            
            var box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.castShadow = true;
            box.receiveShadow = true;
            
            var lidGeometry = new THREE.BoxGeometry(width + 0.01, 0.03, depth + 0.01);
            var lidMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                roughness: 0.6,
                metalness: 0.3
            });
            
            var lid = new THREE.Mesh(lidGeometry, lidMaterial);
            lid.position.y = height / 2 + 0.015;
            lid.castShadow = true;
            
            group.add(box);
            group.add(lid);
            
            return group;
        }
        
        function createArm(options) {
            options = options || {};
            var length = options.length || 1.5;
            var diameter = options.diameter || 0.03;
            
            var group = new THREE.Group();
            
            var armGeometry = new THREE.CylinderGeometry(
                diameter / 2,
                diameter / 2,
                length,
                16
            );
            
            var armMaterial = new THREE.MeshStandardMaterial({
                color: 0x555555,
                roughness: 0.7,
                metalness: 0.4
            });
            
            var arm = new THREE.Mesh(armGeometry, armMaterial);
            arm.rotation.z = Math.PI / 2;
            arm.position.set(length / 2, 0, 0);
            arm.castShadow = true;
            arm.receiveShadow = true;
            
            group.add(arm);
            
            return group;
        }
        
        function createFoundation(options) {
            options = options || {};
            var size = options.size || 1.5;
            var depth = options.depth || 0.5;
            
            var group = new THREE.Group();
            
            var foundationGeometry = new THREE.BoxGeometry(size, depth, size);
            var foundationMaterial = new THREE.MeshStandardMaterial({
                color: 0x666666,
                roughness: 0.9,
                metalness: 0.1
            });
            
            var foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
            foundation.position.y = -depth / 2;
            foundation.receiveShadow = true;
            
            group.add(foundation);
            
            return group;
        }
        
        window.SceneObjects = {
            createPole: createPole,
            createSolarPanel: createSolarPanel,
            createLuminaire: createLuminaire,
            createBatteryBox: createBatteryBox,
            createArm: createArm,
            createFoundation: createFoundation
        };
        
        console.log('[SceneObjects] Fallback version loaded');
    });
    
})(window);