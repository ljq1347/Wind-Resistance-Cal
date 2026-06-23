const Step3bApp = {
    components: [
        { name: 'Main Pole', area: 'area1', cf: 'cf1', height: 'height1', moment: 'moment1' },
        { name: 'Luminaire', area: 'area2', cf: 'cf2', height: 'height2', moment: 'moment2' },
        { name: 'Arm', area: 'area6', cf: 'cf6', height: 'height6', moment: 'moment6' },
        { name: 'LED Head', area: 'area3', cf: 'cf3', height: 'height3', moment: 'moment3' },
        { name: 'Solar Panel', area: 'area4', cf: 'cf4', height: 'height4', moment: 'moment4' },
        { name: 'Battery Box', area: 'area5', cf: 'cf5', height: 'height5', moment: 'moment5' }
    ],
    
    init() {
        const savedData = ModuleStorage.loadStep3B();
        if (savedData) {
            this.loadData(savedData);
        } else {
            this.initDefaults();
        }
        
        this.loadEPAData();
        this.loadPoleAreaFromStep2();
        this.initHeightConverters();
        
        this.updateFormulaDisplay();
    },
    
    loadPoleAreaFromStep2() {
        const step2 = ModuleStorage.loadStep2();
        if (!step2) return;
        
        const H = step2.poleHeightMm / 1000;
        const D = step2.bottomDiameterMm / 1000;
        const d = step2.topDiameterMm / 1000;
        
        if (!isNaN(H) && !isNaN(D) && !isNaN(d) && H > 0 && D > 0 && d > 0) {
            const poleArea = H * (D + d) / 2;
            const centerHeight = H / 3 * (2 * D + d) / (D + d);
            
            const areaInput = document.getElementById('step3-area1');
            if (areaInput) {
                areaInput.value = poleArea.toFixed(4);
                areaInput.disabled = true;
                areaInput.style.backgroundColor = '#f0f0f0';
                areaInput.style.cursor = 'not-allowed';
            }
            
            const cfElement = document.getElementById('step3-cf1');
            if (cfElement) {
                cfElement.disabled = true;
                cfElement.style.backgroundColor = '#f0f0f0';
                cfElement.style.cursor = 'not-allowed';
            }
            
            const heightElement = document.getElementById('step3-height1');
            if (heightElement) {
                heightElement.value = centerHeight.toFixed(3);
                heightElement.disabled = true;
                heightElement.style.backgroundColor = '#f0f0f0';
                heightElement.style.cursor = 'not-allowed';
            }
            
            const heightFtElement = document.getElementById('step3-height1-ft');
            if (heightFtElement) {
                heightFtElement.value = (centerHeight * 3.28084).toFixed(2);
                heightFtElement.disabled = true;
                heightFtElement.style.backgroundColor = '#f0f0f0';
                heightFtElement.style.cursor = 'not-allowed';
            }
        }
    },
    
    initDefaults() {
        const defaults = [
            { area: 0.9144, cf: 0.6, height: 2.395, heightFt: 7.86, index: 1 },
            { area: 0.2, cf: 0.6, height: 7.5, heightFt: 24.6, index: 2 },
            { area: 0.15, cf: 0.6, height: 7.32, heightFt: 24.0, index: 6 },
            { area: 0.8, cf: 1.0, height: 7.5, heightFt: 24.6, index: 3 },
            { area: 1.0, cf: 1.3, height: 8.2, heightFt: 26.9, index: 4 },
            { area: 0.4, cf: 1.2, height: 6.5, heightFt: 21.3, index: 5 }
        ];
        
        defaults.forEach((d) => {
            const idx = d.index;
            document.getElementById(`step3-area${idx}`).value = d.area;
            document.getElementById(`step3-cf${idx}`).value = d.cf;
            document.getElementById(`step3-height${idx}`).value = d.height;
            const heightFt = document.getElementById(`step3-height${idx}-ft`);
            if (heightFt) {
                heightFt.value = d.heightFt;
            }
        });
    },
    
    loadData(data) {
        if (!data || !data.components) return;
        
        data.components.forEach((comp, i) => {
            const idx = i + 1;
            document.getElementById(`step3-area${idx}`).value = comp.area || 0;
            document.getElementById(`step3-cf${idx}`).value = comp.cf || 0;
            document.getElementById(`step3-height${idx}`).value = comp.height || 0;
            const heightFt = document.getElementById(`step3-height${idx}-ft`);
            if (heightFt && comp.height) {
                heightFt.value = (comp.height * 3.28084).toFixed(1);
            }
        });
    },
    
    loadEPAData() {
        const step3a1 = ModuleStorage.loadStep3A1();
        const step3a2 = ModuleStorage.loadStep3A2();
        const step3a3 = ModuleStorage.loadStep3A3();
        const step3a4 = ModuleStorage.loadStep3A4();
        
        const epaMapping = [
            { data: step3a4, epaKey: 'epa', elementId: 'step3-area2' },
            { data: step3a2, epaKey: 'epa', elementId: 'step3-area3' },
            { data: step3a1, epaKey: 'epa', elementId: 'step3-area4' },
            { data: step3a3, epaKey: 'epa', elementId: 'step3-area5' }
        ];
        
        epaMapping.forEach(({ data, epaKey, elementId }) => {
            const element = document.getElementById(elementId);
            if (element && data && data[epaKey] !== undefined && data[epaKey] > 0) {
                element.value = data[epaKey].toFixed(4);
                element.disabled = true;
                element.style.backgroundColor = '#f0f0f0';
                element.style.cursor = 'not-allowed';
                
                const cfElement = document.getElementById(elementId.replace('area', 'cf'));
                if (cfElement) {
                    cfElement.disabled = true;
                    cfElement.style.backgroundColor = '#f0f0f0';
                    cfElement.style.cursor = 'not-allowed';
                }
            }
        });
    },
    
    getData() {
        const components = this.components.map((comp, i) => {
            const idx = i + 1;
            return {
                name: comp.name,
                area: parseFloat(document.getElementById(`step3-${comp.area}`).value) || 0,
                cf: parseFloat(document.getElementById(`step3-${comp.cf}`).value) || 0,
                height: parseFloat(document.getElementById(`step3-${comp.height}`).value) || 0
            };
        });
        
        return { components };
    },
    
    confirm() {
        const data = this.getData();
        ModuleStorage.saveStep3B(data);
        
        if (typeof onStepDataSaved === 'function') {
            onStepDataSaved('step3b', data);
        }
        
        const btn = document.querySelector('#modal-step3b .step3-btn-row button');
        if (btn) {
            btn.classList.add('confirmed');
            btn.textContent = 'Update';
        }
        
        if (typeof closeModal === 'function') {
            closeModal('modal-step3b');
        }

        this.updateDisplay();
    },
    
    updateDisplay() {
        if (typeof updateSettingsDisplay === 'function') {
            updateSettingsDisplay();
        }
    },
    
    convertHeight(type, index) {
        const meterInput = document.getElementById(`step3-height${index}`);
        const footInput = document.getElementById(`step3-height${index}-ft`);
        
        if (!meterInput || !footInput) return;
        
        if (type === 'meter') {
            const meters = parseFloat(meterInput.value);
            if (!isNaN(meters)) {
                footInput.value = (meters * 3.28084).toFixed(1);
            }
        } else {
            const feet = parseFloat(footInput.value);
            if (!isNaN(feet)) {
                meterInput.value = (feet * 0.3048).toFixed(2);
            }
        }
        
        this.updateFormulaDisplay();
    },
    
    initHeightConverters() {
        const indices = [1, 2, 6, 3, 4, 5];
        for (const i of indices) {
            const meterInput = document.getElementById(`step3-height${i}`);
            const footInput = document.getElementById(`step3-height${i}-ft`);
            const areaInput = document.getElementById(`step3-area${i}`);
            const cfInput = document.getElementById(`step3-cf${i}`);
            
            if (meterInput && !meterInput.disabled) {
                meterInput.addEventListener('input', () => this.updateFormulaDisplay());
            }
            if (footInput && !footInput.disabled) {
                footInput.addEventListener('input', () => this.updateFormulaDisplay());
            }
            if (areaInput && !areaInput.disabled) {
                areaInput.addEventListener('input', () => this.updateFormulaDisplay());
            }
            if (cfInput && !cfInput.disabled) {
                cfInput.addEventListener('input', () => this.updateFormulaDisplay());
            }
            
            if (meterInput && footInput && !meterInput.disabled) {
                meterInput.addEventListener('input', () => this.convertHeight('meter', i));
                footInput.addEventListener('input', () => this.convertHeight('foot', i));
                
                meterInput.addEventListener('click', () => {
                    meterInput.style.backgroundColor = '#fff';
                    meterInput.style.opacity = '1';
                    footInput.style.backgroundColor = '#f0f0f0';
                    footInput.style.opacity = '0.6';
                });
                
                footInput.addEventListener('click', () => {
                    footInput.style.backgroundColor = '#fff';
                    footInput.style.opacity = '1';
                    meterInput.style.backgroundColor = '#f0f0f0';
                    meterInput.style.opacity = '0.6';
                });
            }
        }
    },
    
    updateFormulaDisplay() {
        const step1 = ModuleStorage.loadStep1();
        const ms = step1?.ms || 0;
        const rho = step1?.airDensity || 1.225;
        const q = 0.5 * rho * Math.pow(ms, 2);
        
        const components = this.getData().components;
        let totalMoment = 0;
        let formulaDetails = [];
        
        components.forEach((comp, i) => {
            const Fi = q * comp.cf * comp.area;
            const Mi = Fi * comp.height;
            totalMoment += Mi;
            
            const momentCell = document.getElementById(`step3-moment${i + 1}`);
            if (momentCell) {
                momentCell.textContent = Mi.toFixed(2) + ' N·m';
            }
            
            formulaDetails.push(`${comp.name}: Fi = ${q.toFixed(2)} × ${comp.cf} × ${comp.area} = ${Fi.toFixed(2)} N, Mi = ${Fi.toFixed(2)} × ${comp.height} = ${Mi.toFixed(2)} N·m`);
        });
        
        const totalMomentCell = document.getElementById('step3-totalMoment');
        if (totalMomentCell) {
            totalMomentCell.textContent = totalMoment.toFixed(2) + ' N·m';
        }
        
        const resultEl = document.getElementById('step3b-result');
        if (resultEl) {
            resultEl.innerHTML = `
                Basic Wind Pressure q = ${q.toFixed(2)} N/m²<br>
                ${formulaDetails.join('<br>')}<br>
                <strong>Total Moment M_total = ${totalMoment.toFixed(2)} N·m</strong>
            `;
        }
    }
};

window.Step3bApp = Step3bApp;