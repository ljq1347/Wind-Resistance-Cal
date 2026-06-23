const Step3a1App = {
    init() {
        const savedData = ModuleStorage.loadStep3A1();
        if (savedData) {
            this.loadData(savedData);
        } else {
            this.initDefaults();
        }
        this.updateEPA();
        this.initUnitToggle();
    },
    
    initDefaults() {
        document.getElementById('step3a1-length').value = 1.5;
        document.getElementById('step3a1-length-ft').value = (1.5 * 3.28084).toFixed(2);
        document.getElementById('step3a1-width').value = 0.7;
        document.getElementById('step3a1-width-ft').value = (0.7 * 3.28084).toFixed(2);
        document.getElementById('step3a1-angle').value = 60;
        document.getElementById('step3a1-shapeFactor').value = 1;
        document.getElementById('step3a1-count').value = 1;
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
        
        const meterId = `step3a1-${type}`;
        const footId = `step3a1-${type}-ft`;
        
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
        const length = parseFloat(document.getElementById('step3a1-length').value) || 0;
        const width = parseFloat(document.getElementById('step3a1-width').value) || 0;
        const angle = parseFloat(document.getElementById('step3a1-angle').value) || 60;
        const shapeFactor = parseFloat(document.getElementById('step3a1-shapeFactor').value) || 1;
        const count = parseFloat(document.getElementById('step3a1-count').value) || 1;
        
        const projectedWidth = width * Math.cos((angle * Math.PI) / 180);
        const epa = length * projectedWidth * shapeFactor * count;
        
        document.getElementById('step3a1-epa').textContent = epa.toFixed(4) + ' m²';
        document.getElementById('step3a1-epa-ft').textContent = '(' + (epa * 10.7639).toFixed(2) + ' ft²)';
        
        this.updateFormulaDisplay(length, width, angle, shapeFactor, count, epa);
    },
    
    updateFormulaDisplay(length, width, angle, shapeFactor, count, epa) {
        const formulaEl = document.getElementById('step3a1-epa-formula');
        const valuesEl = document.getElementById('step3a1-epa-values');
        const resultEl = document.getElementById('step3a1-epa-result');
        
        if (formulaEl && valuesEl && resultEl) {
            formulaEl.textContent = 'EPA = Length × (Width × cos(Tilt Angle)) × Shape Factor × Count';
            valuesEl.textContent = `EPA = ${length} × (${width} × cos(${angle}°)) × ${shapeFactor} × ${count}`;
            resultEl.textContent = `EPA = ${epa.toFixed(4)} m² (${(epa * 10.7639).toFixed(2)} ft²)`;
        }
    },
    
    loadData(data) {
        document.getElementById('step3a1-length').value = data.length || '';
        document.getElementById('step3a1-length-ft').value = data.lengthFt || '';
        document.getElementById('step3a1-width').value = data.width || '';
        document.getElementById('step3a1-width-ft').value = data.widthFt || '';
        document.getElementById('step3a1-angle').value = data.angle || 60;
        document.getElementById('step3a1-shapeFactor').value = data.shapeFactor || 1;
        document.getElementById('step3a1-count').value = data.count || 1;
    },
    
    getData() {
        const length = parseFloat(document.getElementById('step3a1-length').value) || 0;
        const width = parseFloat(document.getElementById('step3a1-width').value) || 0;
        const angle = parseFloat(document.getElementById('step3a1-angle').value) || 60;
        const shapeFactor = parseFloat(document.getElementById('step3a1-shapeFactor').value) || 1;
        const count = parseFloat(document.getElementById('step3a1-count').value) || 1;
        
        const projectedWidth = width * Math.cos((angle * Math.PI) / 180);
        const epa = length * projectedWidth * shapeFactor * count;
        
        return {
            length,
            lengthFt: (length * 3.28084).toFixed(2),
            width,
            widthFt: (width * 3.28084).toFixed(2),
            angle,
            shapeFactor,
            count,
            epa
        };
    },
    
    confirm() {
        const data = this.getData();
        ModuleStorage.saveStep3A1(data);
        
        if (typeof onStepDataSaved === 'function') {
            onStepDataSaved('step3a1', data);
        }
        
        const btn = document.querySelector('#modal-step3a1 .btn-row button');
        if (btn) {
            btn.classList.add('confirmed');
            btn.textContent = 'Update';
        }
        
        if (typeof closeModal === 'function') {
            closeModal('modal-step3a1');
        }
        
        this.updateDisplay();
    },
    
    updateDisplay() {
        if (typeof updateSettingsDisplay === 'function') {
            updateSettingsDisplay();
        }
    }
};

window.Step3a1App = Step3a1App;
