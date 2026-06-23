const ModuleConfig = {
    modules: {
        step1: {
            id: 'step1',
            name: 'Step 1',
            title: 'Global Environment Parameters',
            position: 'modal',
            storageKey: 'step1_env',
            icon: '🌬️',
            path: 'modules/step1-env/'
        },
        step2: {
            id: 'step2',
            name: 'Step 2',
            title: 'Pole Geometry Parameters',
            position: 'modal',
            storageKey: 'step2_geometry',
            icon: '📐',
            path: 'modules/step2-geometry/'
        },
        step3a1: {
            id: 'step3a1',
            name: 'Step 3A1',
            title: 'Solar Panel EPA',
            position: 'modal',
            storageKey: 'step3a1_solar',
            icon: '☀️',
            path: 'modules/step3a1-solar/'
        },
        step3a2: {
            id: 'step3a2',
            name: 'Step 3A2',
            title: 'Luminaire EPA',
            position: 'modal',
            storageKey: 'step3a2_luminaire',
            icon: '💡',
            path: 'modules/step3a2-luminaire/'
        },
        step3a3: {
            id: 'step3a3',
            name: 'Step 3A3',
            title: 'Battery Box EPA',
            position: 'modal',
            storageKey: 'step3a3_battery',
            icon: '🔋',
            path: 'modules/step3a3-battery/'
        },
        step3a4: {
            id: 'step3a4',
            name: 'Step 3A4',
            title: 'Arm EPA',
            position: 'modal',
            storageKey: 'step3a4_arm',
            icon: '🦾',
            path: 'modules/step3a4-arm/'
        },
        step3a: {
            id: 'step3a',
            name: 'Step 3A',
            title: 'EPA Summary',
            position: 'modal',
            storageKey: 'step3a_epa',
            icon: '📊',
            path: 'modules/step3a-epa/'
        },
        step3b: {
            id: 'step3b',
            name: 'Step 3B',
            title: '5 Components Parameters',
            position: 'modal',
            storageKey: 'step3b_components',
            icon: '⚙️',
            path: 'modules/step3b-components/'
        },
        step5: {
            id: 'step5',
            name: 'Step 5',
            title: 'Strength & Deflection Check Results',
            position: 'modal',
            storageKey: 'step5_result',
            icon: '📊',
            path: 'modules/step5-result/'
        }
    },
    
    getModule(id) {
        return this.modules[id];
    },
    
    getAllModules() {
        return Object.values(this.modules);
    },
    
    getModalModules() {
        return Object.values(this.modules).filter(m => m.position === 'modal');
    },
    
    getFixedModules() {
        return Object.values(this.modules).filter(m => m.position.startsWith('fixed'));
    }
};

window.ModuleConfig = ModuleConfig;
