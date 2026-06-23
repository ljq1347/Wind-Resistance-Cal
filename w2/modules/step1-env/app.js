const Step1App = {
    init() {
        const savedData = ModuleStorage.loadStep1();
        if (savedData) {
            this.loadData(savedData);
        } else {
            this.initDefaults();
        }
        this.updateWindPressure();
        this.initUnitToggle();
    },
    
    initUnitToggle() {
        this.selectInput('mph');
    },
    
    selectInput(unit) {
        const units = ['mph', 'ms', 'kmh'];
        
        units.forEach(u => {
            const group = document.getElementById(`group-${u}`);
            if (group) {
                if (u === unit) {
                    group.classList.add('active');
                } else {
                    group.classList.remove('active');
                }
            }
        });
    },
    
    initDefaults() {
        const mph = 150;
        document.getElementById('step1-ms').value = (mph * 0.44704).toFixed(2);
        document.getElementById('step1-kmh').value = (mph * 1.60934).toFixed(2);
    },
    
    loadData(data) {
        document.getElementById('step1-mph').value = data.mph || 150;
        document.getElementById('step1-ms').value = data.ms || '';
        document.getElementById('step1-kmh').value = data.kmh || '';
        document.getElementById('step1-airDensity').value = data.airDensity || 1.225;
    },
    
    convertSpeed(from) {
        this.selectInput(from);
        
        const v = parseFloat(document.getElementById(`step1-${from}`).value);
        if (from === 'mph') {
            document.getElementById('step1-ms').value = (v * 0.44704).toFixed(2);
            document.getElementById('step1-kmh').value = (v * 1.60934).toFixed(2);
        } else if (from === 'ms') {
            document.getElementById('step1-mph').value = (v / 0.44704).toFixed(2);
            document.getElementById('step1-kmh').value = (v * 3.6).toFixed(2);
        } else if (from === 'kmh') {
            document.getElementById('step1-mph').value = (v / 1.60934).toFixed(2);
            document.getElementById('step1-ms').value = (v / 3.6).toFixed(2);
        }
        this.updateWindPressure();
    },
    
    updateWindPressure() {
        const ms = parseFloat(document.getElementById('step1-ms').value);
        const rho = parseFloat(document.getElementById('step1-airDensity').value);
        if (!isNaN(ms) && !isNaN(rho) && ms > 0) {
            const q = (0.5 * rho * Math.pow(ms, 2)).toFixed(2);
            document.getElementById('step1-windPressureDisplay').innerHTML = 
                `<strong>Basic Wind Pressure q:</strong> <span class="highlight">${q} N/m²</span> ≈ ${(q/9.8).toFixed(1)} kg/m²`;
            
            this.updateFormulaDisplay(ms, rho, q);
        }
    },
    
    updateFormulaDisplay(ms, rho, q) {
        const formulaEl = document.getElementById('step1-wind-formula');
        const valuesEl = document.getElementById('step1-wind-values');
        const resultEl = document.getElementById('step1-wind-result');
        
        if (formulaEl && valuesEl && resultEl) {
            formulaEl.textContent = 'q = 0.5 × ρ × v²';
            valuesEl.textContent = `q = 0.5 × ${rho} kg/m³ × (${ms} m/s)²`;
            resultEl.textContent = `q = ${q} N/m² ≈ ${(q/9.8).toFixed(1)} kg/m²`;
        }
    },
    
    getData() {
        return {
            mph: parseFloat(document.getElementById('step1-mph').value),
            ms: parseFloat(document.getElementById('step1-ms').value),
            kmh: parseFloat(document.getElementById('step1-kmh').value),
            airDensity: parseFloat(document.getElementById('step1-airDensity').value)
        };
    },
    
    confirm() {
        const data = this.getData();
        ModuleStorage.saveStep1(data);
        
        if (typeof onStepDataSaved === 'function') {
            onStepDataSaved('step1', data);
        }
        
        const btn = document.querySelector('#modal-step1 .step1-btn-row button');
        if (btn) {
            btn.classList.add('confirmed');
            btn.textContent = 'Update';
        }
        
        if (typeof closeModal === 'function') {
            closeModal('modal-step1');
        }
        
        this.updateDisplay();
    },
    
    updateDisplay() {
        if (typeof updateSettingsDisplay === 'function') {
            updateSettingsDisplay();
        }
    }
};

window.Step1App = Step1App;