const steelProperties = {
    'GR65': { yieldStress: 450, elasticityModulus: 200 },
    'Q345': { yieldStress: 345, elasticityModulus: 206 },
    'Q235': { yieldStress: 235, elasticityModulus: 206 },
    'S355': { yieldStress: 355, elasticityModulus: 210 },
    'S275': { yieldStress: 275, elasticityModulus: 210 }
};

document.addEventListener('DOMContentLoaded', function() {
    const mph = 150;
    document.getElementById('ms').value = (mph * 0.44704).toFixed(2);
    document.getElementById('kmh').value = (mph * 1.60934).toFixed(2);
    
    const foot = 20;
    document.getElementById('poleHeightMm').value = Math.round(foot * 304.8);
    
    const topMm = 100;
    document.getElementById('topDiameterIn').value = (topMm / 25.4).toFixed(2);
    
    const bottomMm = 140;
    document.getElementById('bottomDiameterIn').value = (bottomMm / 25.4).toFixed(2);
    
    calculateWindPressure();
    calculateSectionModulus();
});

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

function showSettingsInfo() {
    const mph = document.getElementById('mph').value;
    const ms = document.getElementById('ms').value;
    const kmh = document.getElementById('kmh').value;
    const airDensity = document.getElementById('airDensity').value;
    const steelGrade = document.getElementById('steelGrade').value;
    const yieldStress = document.getElementById('yieldStress').textContent;
    const elasticityModulus = document.getElementById('elasticityModulus').textContent;
    
    const content = `
        <strong>Wind Speed:</strong> ${mph} mph = ${ms} m/s = ${kmh} km/h<br>
        <strong>Air Density:</strong> ${airDensity} kg/m³<br>
        <strong>Steel Grade:</strong> ${steelGrade}<br>
        <strong>Yield Strength:</strong> ${yieldStress} MPa<br>
        <strong>Elastic Modulus:</strong> ${elasticityModulus} GPa
    `;
    
    document.getElementById('settingsContent').innerHTML = content;
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

function convertSpeed(from) {
    const v = parseFloat(document.getElementById(from).value);
    if (from === 'mph') {
        document.getElementById('ms').value = (v * 0.44704).toFixed(2);
        document.getElementById('kmh').value = (v * 1.60934).toFixed(2);
    } else if (from === 'ms') {
        document.getElementById('mph').value = (v / 0.44704).toFixed(2);
        document.getElementById('kmh').value = (v * 3.6).toFixed(2);
    } else if (from === 'kmh') {
        document.getElementById('mph').value = (v / 1.60934).toFixed(2);
        document.getElementById('ms').value = (v / 3.6).toFixed(2);
    }
    calculateWindPressure();
}

function convertLength(type, from) {
    if (type === 'poleHeight') {
        if (from === 'foot') {
            document.getElementById('poleHeightMm').value = Math.round(parseFloat(document.getElementById('poleHeightFoot').value) * 304.8);
        } else {
            document.getElementById('poleHeightFoot').value = (parseFloat(document.getElementById('poleHeightMm').value) / 304.8).toFixed(2);
        }
    } else if (type === 'topDiameter') {
        if (from === 'mm') {
            document.getElementById('topDiameterIn').value = (parseFloat(document.getElementById('topDiameterMm').value) / 25.4).toFixed(2);
        } else {
            document.getElementById('topDiameterMm').value = Math.round(parseFloat(document.getElementById('topDiameterIn').value) * 25.4);
        }
    } else if (type === 'bottomDiameter') {
        if (from === 'mm') {
            document.getElementById('bottomDiameterIn').value = (parseFloat(document.getElementById('bottomDiameterMm').value) / 25.4).toFixed(2);
        } else {
            document.getElementById('bottomDiameterMm').value = Math.round(parseFloat(document.getElementById('bottomDiameterIn').value) * 25.4);
        }
    }
    calculateSectionModulus();
}

function updateSteelProperties() {
    const grade = document.getElementById('steelGrade').value;
    document.getElementById('yieldStress').textContent = steelProperties[grade].yieldStress;
    document.getElementById('elasticityModulus').textContent = steelProperties[grade].elasticityModulus;
    document.getElementById('yieldStrength').value = steelProperties[grade].yieldStress;
}

function calculateWindPressure() {
    const ms = parseFloat(document.getElementById('ms').value);
    const rho = parseFloat(document.getElementById('airDensity').value);
    if (!isNaN(ms) && !isNaN(rho)) {
        const q = (0.5 * rho * Math.pow(ms, 2)).toFixed(2);
        document.getElementById('windPressureDisplay').innerHTML = `<strong>Basic Wind Pressure q:</strong> <span class="highlight">${q} N/m²</span> ≈ ${(q/9.8).toFixed(1)} kg/m²`;
    }
}

function calculateSectionModulus() {
    const D = parseFloat(document.getElementById('bottomDiameterMm').value) / 1000;
    const d = parseFloat(document.getElementById('topDiameterMm').value) / 1000;
    const t = parseFloat(document.getElementById('wallThickness').value) / 1000;
    
    if (!isNaN(D) && !isNaN(d) && !isNaN(t)) {
        const W = (Math.PI * (Math.pow(D, 4) - Math.pow(d, 4))) / (32 * D);
        document.getElementById('sectionModulusDisplay').innerHTML = `<strong>Section Modulus W:</strong> <span class="highlight">${(W * 1000000).toFixed(2)} cm³</span> (${W.toFixed(8)} m³)`;
    }
}

function calculateAll() {
    const ms = parseFloat(document.getElementById('ms').value);
    const rho = parseFloat(document.getElementById('airDensity').value);
    const q = 0.5 * rho * Math.pow(ms, 2);

    const areas = [
        parseFloat(document.getElementById('area1').value),
        parseFloat(document.getElementById('area2').value),
        parseFloat(document.getElementById('area3').value),
        parseFloat(document.getElementById('area4').value),
        parseFloat(document.getElementById('area5').value)
    ];
    const cfs = [
        parseFloat(document.getElementById('cf1').value),
        parseFloat(document.getElementById('cf2').value),
        parseFloat(document.getElementById('cf3').value),
        parseFloat(document.getElementById('cf4').value),
        parseFloat(document.getElementById('cf5').value)
    ];
    const heights = [
        parseFloat(document.getElementById('height1').value),
        parseFloat(document.getElementById('height2').value),
        parseFloat(document.getElementById('height3').value),
        parseFloat(document.getElementById('height4').value),
        parseFloat(document.getElementById('height5').value)
    ];

    let totalMoment = 0;
    const moments = [];
    for (let i = 0; i < 5; i++) {
        const Fi = q * cfs[i] * areas[i];
        const Mi = Fi * heights[i];
        moments.push(Mi);
        totalMoment += Mi;
        document.getElementById(`moment${i+1}`).textContent = Mi.toFixed(2) + ' N·m';
    }
    document.getElementById('totalMoment').textContent = totalMoment.toFixed(2) + ' N·m';
    document.getElementById('totalMomentResult').textContent = totalMoment.toFixed(2) + ' N·m';

    const D = parseFloat(document.getElementById('bottomDiameterMm').value) / 1000;
    const d = parseFloat(document.getElementById('topDiameterMm').value) / 1000;
    const t = parseFloat(document.getElementById('wallThickness').value) / 1000;
    const sigma_y = parseFloat(document.getElementById('yieldStrength').value) * 1e6;

    const W = (Math.PI * (Math.pow(D, 4) - Math.pow(d, 4))) / (32 * D);
    const sigma = totalMoment / W;
    const SF = sigma_y / sigma;

    document.getElementById('stressResult').textContent = (sigma / 1e6).toFixed(2) + ' MPa';
    document.getElementById('safetyFactorResult').textContent = SF.toFixed(2) + (SF >= 1.5 ? ' ✓' : ' ✗');

    const E = parseFloat(document.getElementById('elasticityModulus').textContent) * 1e9;
    const H = parseFloat(document.getElementById('poleHeightMm').value) / 1000;
    const De = (D + d) / 2;
    const I = (Math.PI * (Math.pow(De, 4) - Math.pow(De - 2 * t, 4))) / 64;
    const delta = (totalMoment * Math.pow(H, 2)) / (3 * E * I);
    const deltaRatio = (delta / H) * 100;

    document.getElementById('deResult').textContent = (De * 1000).toFixed(1) + ' mm';
    document.getElementById('iResult').textContent = (I * 1e12).toFixed(2) + ' mm⁴';
    document.getElementById('deflectionResult').textContent = (delta * 1000).toFixed(2) + ' mm';
    document.getElementById('deflectionRatioResult').textContent = deltaRatio.toFixed(2) + '%' + (deltaRatio <= 5 ? ' ✓' : ' ✗');

    const pipeD = parseFloat(document.getElementById('pipeD').value) / 1000;
    const pipeT = parseFloat(document.getElementById('pipeT').value) / 1000;
    const pipeL = parseFloat(document.getElementById('pipeL').value);
    
    const solarForce = q * cfs[3] * areas[3];
    const pipeW = (Math.PI * (Math.pow(pipeD, 4) - Math.pow(pipeD - 2 * pipeT, 4))) / (32 * pipeD);
    const pipeMoment = solarForce * pipeL;
    const pipeStress = pipeMoment / pipeW;
    const pipeSF = sigma_y / pipeStress;

    document.getElementById('localStressResult').innerHTML = `Solar Panel Force: <strong>${solarForce.toFixed(2)} N</strong><br>
Cantilever Moment: <strong>${pipeMoment.toFixed(2)} N·m</strong><br>
Connection Pipe Stress: <strong>${(pipeStress / 1e6).toFixed(2)} MPa</strong><br>
Local Safety Factor: <strong>${pipeSF.toFixed(2)}</strong> ${pipeSF >= 1.5 ? '<span class="local-stress-result-success">✓</span>' : '<span class="local-stress-result-danger">✗</span>'}`;
}