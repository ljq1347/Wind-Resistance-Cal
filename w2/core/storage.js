const Storage = {
    PREFIX: 'wind_',
    
    save(key, value) {
        try {
            localStorage.setItem(this.PREFIX + key, JSON.stringify({
                data: value,
                timestamp: Date.now()
            }));
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    },
    
    load(key) {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            if (!item) return null;
            const parsed = JSON.parse(item);
            return parsed.data;
        } catch (e) {
            console.error('Storage load error:', e);
            return null;
        }
    },
    
    loadWithMeta(key) {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            if (!item) return null;
            return JSON.parse(item);
        } catch (e) {
            console.error('Storage load error:', e);
            return null;
        }
    },
    
    remove(key) {
        localStorage.removeItem(this.PREFIX + key);
    },
    
    clear() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(this.PREFIX));
        keys.forEach(k => localStorage.removeItem(k));
    },
    
    hasData(key) {
        return localStorage.getItem(this.PREFIX + key) !== null;
    },
    
    getAllKeys() {
        return Object.keys(localStorage)
            .filter(k => k.startsWith(this.PREFIX))
            .map(k => k.replace(this.PREFIX, ''));
    }
};

const ModuleStorage = {
    STEP1_KEY: 'step1_env',
    STEP2_KEY: 'step2_geometry',
    STEP3A1_KEY: 'step3a1_solar',
    STEP3A2_KEY: 'step3a2_luminaire',
    STEP3A3_KEY: 'step3a3_battery',
    STEP3A4_KEY: 'step3a4_arm',
    STEP3B_KEY: 'step3b_components',
    STEP4_KEY: 'step4_local',
    
    saveStep1(data) {
        return Storage.save(this.STEP1_KEY, data);
    },
    
    loadStep1() {
        return Storage.load(this.STEP1_KEY);
    },
    
    saveStep2(data) {
        return Storage.save(this.STEP2_KEY, data);
    },
    
    loadStep2() {
        return Storage.load(this.STEP2_KEY);
    },
    
    saveStep3A1(data) {
        return Storage.save(this.STEP3A1_KEY, data);
    },
    
    loadStep3A1() {
        return Storage.load(this.STEP3A1_KEY);
    },
    
    saveStep3A2(data) {
        return Storage.save(this.STEP3A2_KEY, data);
    },
    
    loadStep3A2() {
        return Storage.load(this.STEP3A2_KEY);
    },
    
    saveStep3A3(data) {
        return Storage.save(this.STEP3A3_KEY, data);
    },
    
    loadStep3A3() {
        return Storage.load(this.STEP3A3_KEY);
    },
    
    saveStep3A4(data) {
        return Storage.save(this.STEP3A4_KEY, data);
    },
    
    loadStep3A4() {
        return Storage.load(this.STEP3A4_KEY);
    },
    
    saveStep3B(data) {
        return Storage.save(this.STEP3B_KEY, data);
    },
    
    loadStep3B() {
        return Storage.load(this.STEP3B_KEY);
    },
    
    saveStep4(data) {
        return Storage.save(this.STEP4_KEY, data);
    },
    
    loadStep4() {
        return Storage.load(this.STEP4_KEY);
    },
    
    getAllSavedData() {
        return {
            step1: this.loadStep1(),
            step2: this.loadStep2(),
            step3a1: this.loadStep3A1(),
            step3a2: this.loadStep3A2(),
            step3a3: this.loadStep3A3(),
            step3a4: this.loadStep3A4(),
            step3b: this.loadStep3B(),
            step4: this.loadStep4()
        };
    },
    
    clearAll() {
        Storage.clear();
    }
};

window.Storage = Storage;
window.ModuleStorage = ModuleStorage;