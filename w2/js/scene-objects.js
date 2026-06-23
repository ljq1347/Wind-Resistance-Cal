import * as THREE from '../lib/three/three.module.js';

const SceneObjects = (function() {
    function createPole(options = {}) {
        const height = options.height || 6;
        const bottomDiameter = options.bottomDiameter || 0.14;
        const topDiameter = options.topDiameter || 0.10;
        
        const group = new THREE.Group();
        
        const poleGeometry = new THREE.CylinderGeometry(
            topDiameter / 2,
            bottomDiameter / 2,
            height,
            32
        );
        
        const poleMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            roughness: 0.8,
            metalness: 0.3
        });
        
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = height / 2;
        pole.castShadow = true;
        pole.receiveShadow = true;
        
        const baseGeometry = new THREE.CylinderGeometry(
            bottomDiameter,
            bottomDiameter * 1.5,
            0.08,
            32
        );
        
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.9,
            metalness: 0.2
        });
        
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.04;
        base.castShadow = true;
        
        group.add(pole);
        group.add(base);
        
        return group;
    }
    
    function createSolarPanel(options = {}) {
        const width = options.width || 1.2;
        const height = options.height || 0.8;
        const thickness = options.thickness || 0.02;
        
        const group = new THREE.Group();
        
        const panelGeometry = new THREE.BoxGeometry(width, height, thickness);
        
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e3d70,
            roughness: 0.3,
            metalness: 0.8
        });
        
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.z = thickness / 2;
        panel.castShadow = true;
        panel.receiveShadow = true;
        
        const frameGeometry = new THREE.BoxGeometry(width + 0.02, height + 0.02, 0.01);
        
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.4,
            metalness: 0.7
        });
        
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.z = thickness / 2 + 0.005;
        frame.castShadow = true;
        
        const cellRows = 6;
        const cellCols = 10;
        const cellWidth = (width - 0.06) / cellCols;
        const cellHeight = (height - 0.06) / cellRows;
        
        for (let row = 0; row < cellRows; row++) {
            for (let col = 0; col < cellCols; col++) {
                const cellGeometry = new THREE.BoxGeometry(cellWidth - 0.002, cellHeight - 0.002, 0.001);
                const cellMaterial = new THREE.MeshStandardMaterial({
                    color: 0x2a5a9a,
                    roughness: 0.2,
                    metalness: 0.6
                });
                
                const cell = new THREE.Mesh(cellGeometry, cellMaterial);
                cell.position.set(
                    -width / 2 + 0.03 + col * cellWidth + cellWidth / 2,
                    height / 2 - 0.03 - row * cellHeight - cellHeight / 2,
                    thickness / 2 + 0.002
                );
                panel.add(cell);
            }
        }
        
        group.add(panel);
        group.add(frame);
        
        return group;
    }
    
    function createLuminaire(options = {}) {
        const group = new THREE.Group();
        
        const housingGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.2);
        const housingMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.3,
            metalness: 0.3
        });
        
        const housing = new THREE.Mesh(housingGeometry, housingMaterial);
        housing.castShadow = true;
        housing.receiveShadow = true;
        
        const lensGeometry = new THREE.BoxGeometry(0.28, 0.02, 0.12);
        const lensMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffcc,
            roughness: 0.1,
            metalness: 0.1,
            transparent: true,
            opacity: 0.9
        });
        
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.position.set(0, -0.085, 0);
        lens.castShadow = true;
        
        const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff88,
            transparent: true,
            opacity: 0.15
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(0, -0.8, 0);
        
        group.add(housing);
        group.add(lens);
        group.add(glow);
        
        return group;
    }
    
    function createBatteryBox(options = {}) {
        const width = options.width || 0.4;
        const height = options.height || 0.3;
        const depth = options.depth || 0.25;
        
        const group = new THREE.Group();
        
        const boxGeometry = new THREE.BoxGeometry(width, height, depth);
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.7,
            metalness: 0.2
        });
        
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;
        box.receiveShadow = true;
        
        const lidGeometry = new THREE.BoxGeometry(width + 0.01, 0.03, depth + 0.01);
        const lidMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.6,
            metalness: 0.3
        });
        
        const lid = new THREE.Mesh(lidGeometry, lidMaterial);
        lid.position.y = height / 2 + 0.015;
        lid.castShadow = true;
        
        group.add(box);
        group.add(lid);
        
        return group;
    }
    
    function createArm(options = {}) {
        const length = options.length || 1.5;
        const diameter = options.diameter || 0.03;
        
        const group = new THREE.Group();
        
        const armGeometry = new THREE.CylinderGeometry(
            diameter / 2,
            diameter / 2,
            length,
            16
        );
        
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.7,
            metalness: 0.4
        });
        
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        arm.rotation.z = Math.PI / 2;
        arm.position.set(length / 2, 0, 0);
        arm.castShadow = true;
        arm.receiveShadow = true;
        
        const connectorGeometry = new THREE.CylinderGeometry(
            diameter * 1.2 / 2,
            diameter * 1.2 / 2,
            0.05,
            16
        );
        
        const connectorMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.6,
            metalness: 0.5
        });
        
        const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        connector.position.set(0, 0, 0);
        connector.castShadow = true;
        
        group.add(arm);
        group.add(connector);
        
        return group;
    }
    
    function createFoundation(options = {}) {
        const size = options.size || 1.5;
        const depth = options.depth || 0.5;
        
        const group = new THREE.Group();
        
        const foundationGeometry = new THREE.BoxGeometry(size, depth, size);
        const foundationMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
        foundation.position.y = -depth / 2;
        foundation.receiveShadow = true;
        
        const concreteGeometry = new THREE.BoxGeometry(size - 0.1, depth - 0.1, size - 0.1);
        const concreteMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const concrete = new THREE.Mesh(concreteGeometry, concreteMaterial);
        concrete.position.y = -depth / 2 + 0.05;
        
        const boltGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
        const boltMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.3,
            metalness: 0.8
        });
        
        const boltPositions = [
            [-size / 2 + 0.2, -depth / 2 + 0.1, -size / 2 + 0.2],
            [size / 2 - 0.2, -depth / 2 + 0.1, -size / 2 + 0.2],
            [-size / 2 + 0.2, -depth / 2 + 0.1, size / 2 - 0.2],
            [size / 2 - 0.2, -depth / 2 + 0.1, size / 2 - 0.2]
        ];
        
        boltPositions.forEach(pos => {
            const bolt = new THREE.Mesh(boltGeometry, boltMaterial);
            bolt.position.set(pos[0], pos[1], pos[2]);
            foundation.add(bolt);
        });
        
        group.add(foundation);
        group.add(concrete);
        
        return group;
    }
    
    return {
        createPole,
        createSolarPanel,
        createLuminaire,
        createBatteryBox,
        createArm,
        createFoundation
    };
})();

window.SceneObjects = SceneObjects;
export default SceneObjects;