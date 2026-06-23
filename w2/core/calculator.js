window.Calculator = {
    steelProperties: {
        'GR65': { yieldStress: 450, elasticityModulus: 200 },
        'Q345': { yieldStress: 345, elasticityModulus: 206 },
        'Q235': { yieldStress: 235, elasticityModulus: 206 },
        'S355': { yieldStress: 355, elasticityModulus: 210 },
        'S275': { yieldStress: 275, elasticityModulus: 210 }
    },
    
    getSteelProperties(grade) {
        return this.steelProperties[grade] || this.steelProperties['Q235'];
    },
    
    calcWindPressure(ms, rho) {
        return 0.5 * rho * Math.pow(ms, 2);
    },
    
    calcSectionModulus(D, d) {
        return (Math.PI * (Math.pow(D, 4) - Math.pow(d, 4))) / (32 * D);
    },
    
    calcMoment(force, height) {
        return force * height;
    },
    
    calcWindLoad(q, cf, area) {
        return q * cf * area;
    },
    
    calcStress(moment, W) {
        return moment / W;
    },
    
    calcSafetyFactor(yieldStress, stress) {
        return yieldStress / stress;
    },
    
    calcEquivalentDiameter(D, d) {
        return (D + d) / 2;
    },
    
    calcMomentOfInertia(De, t) {
        return (Math.PI * (Math.pow(De, 4) - Math.pow(De - 2 * t, 4))) / 64;
    },
    
    calcDeflection(M, H, E, I) {
        return (M * Math.pow(H, 2)) / (3 * E * I);
    },
    
    calcDeflectionRatio(delta, H) {
        return (delta / H) * 100;
    },
    
    calcPipeStress(pipeD, pipeT, pipeL, solarForce, sigma_y) {
        const pipeW = (Math.PI * (Math.pow(pipeD, 4) - Math.pow(pipeD - 2 * pipeT, 4))) / (32 * pipeD);
        const pipeMoment = solarForce * pipeL;
        const pipeStress = pipeMoment / pipeW;
        const pipeSF = sigma_y / pipeStress;
        return {
            pipeW,
            pipeMoment,
            pipeStress,
            pipeSF
        };
    },
    
    convertSpeed(value, fromUnit, toUnit) {
        const conversions = {
            'mph->m/s': 0.44704,
            'mph->km/h': 1.60934,
            'm/s->mph': 2.23694,
            'm/s->km/h': 3.6,
            'km/h->mph': 0.621371,
            'km/h->m/s': 0.277778
        };
        
        const key = `${fromUnit}->${toUnit}`;
        if (conversions[key]) {
            return value * conversions[key];
        }
        return value;
    },
    
    convertLength(value, fromUnit, toUnit) {
        const conversions = {
            'ft->mm': 304.8,
            'ft->cm': 30.48,
            'ft->m': 0.3048,
            'mm->ft': 0.00328084,
            'cm->ft': 0.0328084,
            'm->ft': 3.28084,
            'mm->in': 0.0393701,
            'in->mm': 25.4,
            'cm->in': 0.393701,
            'in->cm': 2.54
        };
        
        const key = `${fromUnit}->${toUnit}`;
        if (conversions[key]) {
            return value * conversions[key];
        }
        return value;
    }
};

window.exportToReport = function() {
    try {
        var step1 = ModuleStorage.loadStep1();
        
        var step2 = ModuleStorage.loadStep2();
        
        var step3b = ModuleStorage.loadStep3B();
        
        var totalMomentEl = document.getElementById('totalMomentResult');
        var stressEl = document.getElementById('stressResult');
        var safetyFactorEl = document.getElementById('safetyFactorResult');
        var deEl = document.getElementById('deResult');
        var iEl = document.getElementById('iResult');
        var poleDeflectionEl = document.getElementById('poleDeflectionResult');
        var poleDeflectionRatioEl = document.getElementById('poleDeflectionRatioResult');
        var deflectionEl = document.getElementById('deflectionResult');
        var deflectionRatioEl = document.getElementById('deflectionRatioResult');
        var formulaEl = document.getElementById('step5-result');
        
        var results = {
            totalMoment: totalMomentEl ? totalMomentEl.textContent : '-',
            stress: stressEl ? stressEl.textContent : '-',
            safetyFactor: safetyFactorEl ? safetyFactorEl.textContent : '-',
            de: deEl ? deEl.textContent : '-',
            i: iEl ? iEl.textContent : '-',
            poleDeflection: poleDeflectionEl ? poleDeflectionEl.textContent : '-',
            poleDeflectionRatio: poleDeflectionRatioEl ? poleDeflectionRatioEl.textContent : '-',
            deflection: deflectionEl ? deflectionEl.textContent : '-',
            deflectionRatio: deflectionRatioEl ? deflectionRatioEl.textContent : '-',
            formula: formulaEl ? formulaEl.innerHTML : '<p>Calculation process not available</p>'
        };
        
        var reportData = {
            generatedDate: new Date().toLocaleString('zh-CN'),
            env: step1,
            pole: step2,
            components: step3b && step3b.components ? step3b.components : [],
            results: results
        };
        
        localStorage.setItem('windReportData', JSON.stringify(reportData));
        
        window.open('report.html', '_blank');
        
    } catch (error) {
        console.error('Report generation error:', error);
        alert('Failed to generate report: ' + error.message);
    }
};
