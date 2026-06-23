const Step2App = {
    steelProperties: {
        'GR65': { yieldStress: 450, elasticityModulus: 200 },
        'Q345': { yieldStress: 345, elasticityModulus: 206 },
        'Q235': { yieldStress: 235, elasticityModulus: 206 },
        'S355': { yieldStress: 355, elasticityModulus: 210 },
        'S275': { yieldStress: 275, elasticityModulus: 210 }
    },
    
    init() {
        const savedData = ModuleStorage.loadStep2();
        if (savedData) {
            this.loadData(savedData);
        } else {
            this.initDefaults();
        }
        this.updateSectionModulus();
        this.updateSteelProperties();
        this.initUnitToggle();
    },
    
    initUnitToggle() {
        this.selectInput('poleHeight', 'mm');
        this.selectInput('topDiameter', 'mm');
        this.selectInput('bottomDiameter', 'mm');
    },
    
    selectInput(type, unit) {
        const units = type === 'poleHeight' ? ['mm', 'ft'] : ['mm', 'in'];
        
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
    
    initDefaults() {
        const foot = 20;
        document.getElementById('step2-poleHeightMm').value = Math.round(foot * 304.8);
        
        const topMm = 100;
        document.getElementById('step2-topDiameterIn').value = (topMm / 25.4).toFixed(2);
        
        const bottomMm = 140;
        document.getElementById('step2-bottomDiameterIn').value = (bottomMm / 25.4).toFixed(2);
    },
    
    loadData(data) {
        document.getElementById('step2-poleHeightFoot').value = data.poleHeightFoot || 20;
        document.getElementById('step2-poleHeightMm').value = data.poleHeightMm || '';
        document.getElementById('step2-topDiameterMm').value = data.topDiameterMm || 100;
        document.getElementById('step2-topDiameterIn').value = data.topDiameterIn || '';
        document.getElementById('step2-bottomDiameterMm').value = data.bottomDiameterMm || 140;
        document.getElementById('step2-bottomDiameterIn').value = data.bottomDiameterIn || '';
        document.getElementById('step2-wallThickness').value = data.wallThickness || 4.0;
        document.getElementById('step2-steelGrade').value = data.steelGrade || 'Q235';
    },
    
    convertLength(type, from) {
        this.selectInput(type, from);
        
        if (type === 'poleHeight') {
            if (from === 'foot') {
                document.getElementById('step2-poleHeightMm').value = 
                    Math.round(parseFloat(document.getElementById('step2-poleHeightFoot').value) * 304.8);
            } else {
                document.getElementById('step2-poleHeightFoot').value = 
                    (parseFloat(document.getElementById('step2-poleHeightMm').value) / 304.8).toFixed(2);
            }
        } else if (type === 'topDiameter') {
            if (from === 'mm') {
                document.getElementById('step2-topDiameterIn').value = 
                    (parseFloat(document.getElementById('step2-topDiameterMm').value) / 25.4).toFixed(2);
            } else {
                document.getElementById('step2-topDiameterMm').value = 
                    Math.round(parseFloat(document.getElementById('step2-topDiameterIn').value) * 25.4);
            }
        } else if (type === 'bottomDiameter') {
            if (from === 'mm') {
                document.getElementById('step2-bottomDiameterIn').value = 
                    (parseFloat(document.getElementById('step2-bottomDiameterMm').value) / 25.4).toFixed(2);
            } else {
                document.getElementById('step2-bottomDiameterMm').value = 
                    Math.round(parseFloat(document.getElementById('step2-bottomDiameterIn').value) * 25.4);
            }
        }
        this.updateSectionModulus();
    },
    
    updateSectionModulus() {
        const D = parseFloat(document.getElementById('step2-bottomDiameterMm').value) / 1000;
        const d = parseFloat(document.getElementById('step2-topDiameterMm').value) / 1000;
        const t = parseFloat(document.getElementById('step2-wallThickness').value) / 1000;
        
        if (!isNaN(D) && !isNaN(d) && !isNaN(t) && D > 0 && d > 0) {
            const W = (Math.PI * (Math.pow(D, 4) - Math.pow(d, 4))) / (32 * D);
            document.getElementById('step2-sectionModulusDisplay').innerHTML = 
                `<strong>Section Modulus W:</strong> <span class="highlight">${(W * 1000000).toFixed(2)} cm³</span> (${W.toFixed(8)} m³)`;
            
            this.updateFormulaDisplay(D, d, W);
        }
    },
    
    updateFormulaDisplay(D, d, W) {
        const formulaEl = document.getElementById('step2-section-formula');
        const valuesEl = document.getElementById('step2-section-values');
        const resultEl = document.getElementById('step2-section-result');
        
        if (formulaEl && valuesEl && resultEl) {
            formulaEl.textContent = 'W = π × (D⁴ - d⁴) / (32 × D)';
            valuesEl.textContent = `W = π × (${D}⁴ - ${d}⁴) / (32 × ${D})`;
            resultEl.textContent = `W = ${(W * 1000000).toFixed(2)} cm³ (${W.toFixed(8)} m³)`;
        }
    },
    
    updateSteelProperties() {
        const grade = document.getElementById('step2-steelGrade').value;
        const props = this.steelProperties[grade];
        document.getElementById('step2-yieldStress').textContent = props.yieldStress;
        document.getElementById('step2-elasticityModulus').textContent = props.elasticityModulus;
    },
    
    getData() {
        return {
            poleHeightFoot: parseFloat(document.getElementById('step2-poleHeightFoot').value),
            poleHeightMm: parseFloat(document.getElementById('step2-poleHeightMm').value),
            topDiameterMm: parseFloat(document.getElementById('step2-topDiameterMm').value),
            topDiameterIn: parseFloat(document.getElementById('step2-topDiameterIn').value),
            bottomDiameterMm: parseFloat(document.getElementById('step2-bottomDiameterMm').value),
            bottomDiameterIn: parseFloat(document.getElementById('step2-bottomDiameterIn').value),
            wallThickness: parseFloat(document.getElementById('step2-wallThickness').value),
            yieldStrength: parseFloat(document.getElementById('step2-yieldStress').textContent),
            steelGrade: document.getElementById('step2-steelGrade').value,
            elasticityModulus: parseFloat(document.getElementById('step2-elasticityModulus').textContent)
        };
    },
    
    confirm() {
        const data = this.getData();
        ModuleStorage.saveStep2(data);
        
        if (typeof onStepDataSaved === 'function') {
            onStepDataSaved('step2', data);
        }
        
        const btn = document.querySelector('#modal-step2 .step2-btn-row button');
        if (btn) {
            btn.classList.add('confirmed');
            btn.textContent = 'Update';
        }
        
        if (typeof closeModal === 'function') {
            closeModal('modal-step2');
        }

        this.updateDisplay();
    },
    
    updateDisplay() {
        if (typeof updateSettingsDisplay === 'function') {
            updateSettingsDisplay();
        }
    }
};

window.Step2App = Step2App;
