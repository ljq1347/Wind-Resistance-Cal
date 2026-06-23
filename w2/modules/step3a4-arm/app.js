const Step3a4App = {
    init() {
        const savedData = ModuleStorage.loadStep3A4();
        if (savedData) {
            this.loadData(savedData);
        } else {
            this.initDefaults();
        }
        this.updateEPA();
        this.initUnitToggle();
    },
    
    initDefaults() {
        document.getElementById('step3a4-length').value = 1.0;
        document.getElementById('step3a4-length-ft').value = (1.0 * 3.28084).toFixed(2);
        document.getElementById('step3a4-width').value = 0.1;
        document.getElementById('step3a4-width-ft').value = (0.1 * 3.28084).toFixed(2);
        document.getElementById('step3a4-shapeFactor').value = 1;
        document.getElementById('step3a4-count').value = 1;
    },
    
    initUnitToggle() {
        this.selectInput('length', 'm');
        this.selectInput('width', 'm');
    },
    
    selectInput(type, unit) {
        const units = ['m', 'ft'];
        
        units.forEach(u => {
            const group = document.getElementById(`group-${type}-${u}`);
            if (group) {
                if (u === unit) {
                    group.classList.add('active');
                } else {
                    group.classList.remove('active');
                }
            }
        });
    },
    
    convertUnit(type, from) {
        this.selectInput(type, from === 'meter' ? 'm' : 'ft');
        
        const meterId = `step3a4-${type}`;
        const footId = `step3a4-${type}-ft`;
        
        const meterInput = document.getElementById(meterId);
        const footInput = document.getElementById(footId);
        
        if (!meterInput || !footInput) return;
        
        if (from === 'meter') {
            const meters = parseFloat(meterInput.value);
            if (!isNaN(meters)) {
                footInput.value = (meters * 3.28084).toFixed(2);
            }
        } else {
            const feet = parseFloat(footInput.value);
            if (!isNaN(feet)) {
                meterInput.value = (feet * 0.3048).toFixed(2);
            }
        }
        this.updateEPA();
    },
    
    updateEPA() {
        const length = parseFloat(document.getElementById('step3a4-length').value) || 0;
        const width = parseFloat(document.getElementById('step3a4-width').value) || 0;
        const shapeFactor = parseFloat(document.getElementById('step3a4-shapeFactor').value) || 1;
        const count = parseFloat(document.getElementById('step3a4-count').value) || 1;
        
        const epa = length * width * shapeFactor * count;
        
        document.getElementById('step3a4-epa').textContent = epa.toFixed(4) + ' m²';
        document.getElementById('step3a4-epa-ft').textContent = '(' + (epa * 10.7639).toFixed(2) + ' ft²)';
        
        this.updateFormulaDisplay(length, width, shapeFactor, count, epa);
    },
    
    updateFormulaDisplay(length, width, shapeFactor, count, epa) {
        const formulaEl = document.getElementById('step3a4-epa-formula');
        const valuesEl = document.getElementById('step3a4-epa-values');
        const resultEl = document.getElementById('step3a4-epa-result');
        
        if (formulaEl && valuesEl && resultEl) {
            formulaEl.textContent = 'EPA = Length × Width × Shape Factor × Count';
            valuesEl.textContent = `EPA = ${length} × ${width} × ${shapeFactor} × ${count}`;
            resultEl.textContent = `EPA = ${epa.toFixed(4)} m² (${(epa * 10.7639).toFixed(2)} ft²)`;
        }
    },
    
    loadData(data) {
        document.getElementById('step3a4-length').value = data.length || '';
        document.getElementById('step3a4-length-ft').value = data.lengthFt || '';
        document.getElementById('step3a4-width').value = data.width || '';
        document.getElementById('step3a4-width-ft').value = data.widthFt || '';
        document.getElementById('step3a4-shapeFactor').value = data.shapeFactor || 1;
        document.getElementById('step3a4-count').value = data.count || 1;
    },
    
    getData() {
        const length = parseFloat(document.getElementById('step3a4-length').value) || 0;
        const width = parseFloat(document.getElementById('step3a4-width').value) || 0;
        const shapeFactor = parseFloat(document.getElementById('step3a4-shapeFactor').value) || 1;
        const count = parseFloat(document.getElementById('step3a4-count').value) || 1;
        
        const epa = length * width * shapeFactor * count;
        
        return {
            length,
            lengthFt: (length * 3.28084).toFixed(2),
            width,
            widthFt: (width * 3.28084).toFixed(2),
            shapeFactor,
            count,
            epa
        };
    },
    
    confirm() {
        const data = this.getData();
        ModuleStorage.saveStep3A4(data);
        
        if (typeof onStepDataSaved === 'function') {
            onStepDataSaved('step3a4', data);
        }
        
        const btn = document.querySelector('#modal-step3a4 .btn-row button');
        if (btn) {
            btn.classList.add('confirmed');
            btn.textContent = 'Update';
        }
        
        if (typeof closeModal === 'function') {
            closeModal('modal-step3a4');
        }
        
        this.updateDisplay();
    },
    
    updateDisplay() {
        if (typeof updateSettingsDisplay === 'function') {
            updateSettingsDisplay();
        }
    }
};

window.Step3a4App = Step3a4App;
