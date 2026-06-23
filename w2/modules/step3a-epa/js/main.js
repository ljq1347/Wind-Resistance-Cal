function calculateAndConvert(tableId, fromId, toId, isMetricConversion) {
    const fromValue = parseFloat(document.getElementById(tableId + fromId).value);
    if (!isNaN(fromValue)) {
        if (isMetricConversion) {
            if (fromId.startsWith('b')) {
                document.getElementById(tableId + toId).value = (fromValue * 3.28084).toFixed(2);
            } else {
                document.getElementById(tableId + toId).value = (fromValue / 3.28084).toFixed(2);
            }
        } else {
            document.getElementById(tableId + toId).value = fromValue.toFixed(2);
        }
    } else {
        document.getElementById(tableId + toId).value = '';
    }
    if (tableId === 'table0') {
        calculateProjectedValues();
    }
    calculateEPATotals();
}

function calculateProjectedValues() {
    const panelLength = parseFloat(document.getElementById('table0b2').value) || 0;
    const panelWidth = parseFloat(document.getElementById('table0b3').value) || 0;
    const angle = parseFloat(document.getElementById('table0b4').value) || 0;
    const projectedLength = panelLength * Math.sin(angle * Math.PI / 180);
    const projectedWidth = panelWidth;
    document.getElementById('table0b6').textContent = projectedLength.toFixed(2);
    document.getElementById('table0c6').textContent = (projectedLength * 3.28084).toFixed(2);
    document.getElementById('table0b7').textContent = projectedWidth.toFixed(2);
    document.getElementById('table0c7').textContent = (projectedWidth * 3.28084).toFixed(2);
}

function calculateTable(tableId) {
    if (tableId === 'table0') {
        const shapeFactor = parseFloat(document.getElementById(tableId + 'b5').value) || 1;
        const projectedLength = parseFloat(document.getElementById(tableId + 'b6').textContent) || 1;
        const projectedWidth = parseFloat(document.getElementById(tableId + 'b7').textContent) || 1;
        const numberOfPanels = parseFloat(document.getElementById(tableId + 'b8').value) || 0;
        const productB = numberOfPanels === 0 ? 0 : shapeFactor * projectedLength * projectedWidth * numberOfPanels;
        document.getElementById(tableId + 'b9').textContent = productB.toFixed(2);
        const projectedLengthFt = parseFloat(document.getElementById(tableId + 'c6').textContent) || 1;
        const projectedWidthFt = parseFloat(document.getElementById(tableId + 'c7').textContent) || 1;
        const productC = numberOfPanels === 0 ? 0 : shapeFactor * projectedLengthFt * projectedWidthFt * numberOfPanels;
        document.getElementById(tableId + 'c9').textContent = productC.toFixed(2);
        return { b: productB, c: productC };
    } else if (tableId === 'table1') {
        const lengthB = parseFloat(document.getElementById(tableId + 'b2')?.value) || 0;
        const widthB = parseFloat(document.getElementById(tableId + 'b3')?.value) || 0;
        const shapeFactor = parseFloat(document.getElementById(tableId + 'b4')?.value) || 1;
        const numberOfComponents = parseFloat(document.getElementById(tableId + 'b5')?.value) || 0;
        const lengthC = parseFloat(document.getElementById(tableId + 'c2')?.value) || 0;
        const widthC = parseFloat(document.getElementById(tableId + 'c3')?.value) || 0;
        const productB = numberOfComponents === 0 ? 0 : lengthB * widthB * shapeFactor * numberOfComponents;
        const productC = numberOfComponents === 0 ? 0 : lengthC * widthC * shapeFactor * numberOfComponents;
        document.getElementById(tableId + 'b6').textContent = productB.toFixed(2);
        document.getElementById(tableId + 'c6').textContent = productC.toFixed(2);
        return { b: productB, c: productC };
    } else if (tableId === 'table2') {
        const lengthB = parseFloat(document.getElementById(tableId + 'b2')?.value) || 0;
        const widthB = parseFloat(document.getElementById(tableId + 'b3')?.value) || 0;
        const shapeFactor = parseFloat(document.getElementById(tableId + 'b4')?.value) || 1;
        const numberOfComponents = parseFloat(document.getElementById(tableId + 'b5')?.value) || 0;
        const lengthC = parseFloat(document.getElementById(tableId + 'c2')?.value) || 0;
        const widthC = parseFloat(document.getElementById(tableId + 'c3')?.value) || 0;
        const productB = numberOfComponents === 0 ? 0 : lengthB * widthB * shapeFactor * numberOfComponents;
        const productC = numberOfComponents === 0 ? 0 : lengthC * widthC * shapeFactor * numberOfComponents;
        document.getElementById(tableId + 'b6').textContent = productB.toFixed(2);
        document.getElementById(tableId + 'c6').textContent = productC.toFixed(2);
        return { b: productB, c: productC };
    } else if (tableId === 'table3') {
        const lengthB = parseFloat(document.getElementById(tableId + 'b2')?.value) || 0;
        const widthB = parseFloat(document.getElementById(tableId + 'b3')?.value) || 0;
        const shapeFactor = parseFloat(document.getElementById(tableId + 'b4')?.value) || 1;
        const numberOfComponents = parseFloat(document.getElementById(tableId + 'b5')?.value) || 0;
        const lengthC = parseFloat(document.getElementById(tableId + 'c2')?.value) || 0;
        const widthC = parseFloat(document.getElementById(tableId + 'c3')?.value) || 0;
        const productB = numberOfComponents === 0 ? 0 : lengthB * widthB * shapeFactor * numberOfComponents;
        const productC = numberOfComponents === 0 ? 0 : lengthC * widthC * shapeFactor * numberOfComponents;
        document.getElementById(tableId + 'b6').textContent = productB.toFixed(2);
        document.getElementById(tableId + 'c6').textContent = productC.toFixed(2);
        return { b: productB, c: productC };
    }
}

function calculateEPATotals() {
    const result0 = calculateTable('table0');
    const result1 = calculateTable('table1');
    const result2 = calculateTable('table2');
    const result3 = calculateTable('table3');
    const totalB = result0.b + result1.b + result2.b + result3.b;
    const totalC = result0.c + result1.c + result2.c + result3.c;
    document.getElementById('totalB').textContent = totalB.toFixed(2);
    document.getElementById('totalC').textContent = totalC.toFixed(2);
}

function setupPanelNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.panel');
    const closeButtons = document.querySelectorAll('.close-btn');

    function closeAllPanels() {
        panels.forEach(panel => panel.classList.remove('active'));
        tabButtons.forEach(btn => btn.classList.remove('active'));
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetPanelId = button.getAttribute('data-tab');
            const targetPanel = document.getElementById(targetPanelId);
            
            if (targetPanel.classList.contains('active')) {
                closeAllPanels();
            } else {
                closeAllPanels();
                targetPanel.classList.add('active');
                button.classList.add('active');
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPanels();
        });
    });

    document.addEventListener('click', (e) => {
        const isClickInsidePanel = e.target.closest('.panel');
        const isClickInsideTab = e.target.closest('.tab-button');
        
        if (!isClickInsidePanel && !isClickInsideTab) {
            closeAllPanels();
        }
    });

    const panelContents = document.querySelectorAll('.panel-content');
    panelContents.forEach(content => {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

function setupConfirmButtons() {
    const confirmButtons = document.querySelectorAll('.confirm-btn');
    const panelNames = ['Solar Panel', 'Luminaire', 'Battery Box', 'Fixture Arm'];
    
    confirmButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const panelId = button.getAttribute('data-panel');
            const tableIndex = panelId.replace('panel', '');
            const tableId = 'table' + tableIndex;
            const panelName = panelNames[parseInt(tableIndex)];
            
            const confirmedData = collectPanelData(tableId, panelName);
            addConfirmedItem(confirmedData);
            
            saveEPADataToStorage();
            
            closeAllPanels();
        });
    });
}

function collectPanelData(tableId, panelName) {
    const data = {
        name: panelName,
        tableId: tableId,
        values: {}
    };
    
    if (tableId === 'table0') {
        data.values = {
            panelLength: document.getElementById('table0b2').value || '0',
            panelWidth: document.getElementById('table0b3').value || '0',
            angle: document.getElementById('table0b4').value || '0',
            shapeFactor: document.getElementById('table0b5').value || '0',
            numberOfPanels: document.getElementById('table0b8').value || '0',
            epaMeter: document.getElementById('table0b9').textContent || '0',
            epaFoot: document.getElementById('table0c9').textContent || '0'
        };
    } else if (tableId === 'table1') {
        data.values = {
            length: document.getElementById('table1b2').value || '0',
            width: document.getElementById('table1b3').value || '0',
            shapeFactor: document.getElementById('table1b4').value || '0',
            numberOfItems: document.getElementById('table1b5').value || '0',
            epaMeter: document.getElementById('table1b6').textContent || '0',
            epaFoot: document.getElementById('table1c6').textContent || '0'
        };
    } else if (tableId === 'table2') {
        data.values = {
            length: document.getElementById('table2b2').value || '0',
            width: document.getElementById('table2b3').value || '0',
            shapeFactor: document.getElementById('table2b4').value || '0',
            numberOfItems: document.getElementById('table2b5').value || '0',
            epaMeter: document.getElementById('table2b6').textContent || '0',
            epaFoot: document.getElementById('table2c6').textContent || '0'
        };
    } else if (tableId === 'table3') {
        data.values = {
            length: document.getElementById('table3b2').value || '0',
            width: document.getElementById('table3b3').value || '0',
            shapeFactor: document.getElementById('table3b4').value || '0',
            numberOfItems: document.getElementById('table3b5').value || '0',
            epaMeter: document.getElementById('table3b6').textContent || '0',
            epaFoot: document.getElementById('table3c6').textContent || '0'
        };
    }
    
    return data;
}

function saveEPADataToStorage() {
    const epaData = {
        solarPanelEPA: parseFloat(document.getElementById('table0b9').textContent) || 0,
        luminaireEPA: parseFloat(document.getElementById('table1b6').textContent) || 0,
        batteryBoxEPA: parseFloat(document.getElementById('table2b6').textContent) || 0,
        fixtureArmEPA: parseFloat(document.getElementById('table3b6').textContent) || 0,
        totalEPAMeter: parseFloat(document.getElementById('totalB').textContent) || 0,
        totalEPAFoot: parseFloat(document.getElementById('totalC').textContent) || 0
    };
    
    if (typeof ModuleStorage !== 'undefined') {
        ModuleStorage.saveStep3A(epaData);
    }
    if (typeof onStepDataSaved === 'function') {
        onStepDataSaved('step3a', epaData);
    }
    console.log('EPA data saved to storage:', epaData);
}

function addConfirmedItem(data) {
    const container = document.getElementById('confirmedItems');
    const existingItem = container.querySelector(`.confirmed-item[data-panel-name="${data.name}"]`);
    
    let details = '';
    if (data.tableId === 'table0') {
        details = `Length: ${data.values.panelLength}m, Width: ${data.values.panelWidth}m<br>Angle: ${data.values.angle}°, Shape Factor: ${data.values.shapeFactor}<br>Number of Panels: ${data.values.numberOfPanels}`;
    } else {
        details = `Length: ${data.values.length}m, Width: ${data.values.width}m<br>Shape Factor: ${data.values.shapeFactor}<br>Number: ${data.values.numberOfItems}`;
    }
    
    const itemContent = `
        <div class="confirmed-item-title">${data.name}</div>
        <div class="confirmed-item-details">${details}</div>
        <div class="confirmed-item-epa">EPA: ${data.values.epaMeter} m² / ${data.values.epaFoot} ft²</div>
    `;
    
    if (existingItem) {
        existingItem.innerHTML = itemContent;
    } else {
        const item = document.createElement('div');
        item.className = 'confirmed-item';
        item.setAttribute('data-panel-name', data.name);
        item.innerHTML = itemContent;
        container.appendChild(item);
    }
}

function closeAllPanels() {
    const panels = document.querySelectorAll('.panel');
    const tabButtons = document.querySelectorAll('.tab-button');
    panels.forEach(panel => panel.classList.remove('active'));
    tabButtons.forEach(btn => btn.classList.remove('active'));
}

function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarHeader = document.querySelector('.sidebar-header');
    
    sidebarHeader.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        sidebarToggle.textContent = sidebar.classList.contains('collapsed') ? '▲' : '▼';
    });
}

function setupConfirmedPanelToggle() {
    const confirmedPanel = document.getElementById('confirmedPanel');
    const confirmedPanelToggle = document.getElementById('confirmedPanelToggle');
    const confirmedPanelHeader = document.querySelector('.confirmed-panel-header');
    
    confirmedPanelHeader.addEventListener('click', () => {
        confirmedPanel.classList.toggle('collapsed');
        confirmedPanelToggle.textContent = confirmedPanel.classList.contains('collapsed') ? '▲' : '▼';
    });
}

function setupSpecialFieldListeners() {
    const table0b5 = document.getElementById('table0b5');
    const table0b8 = document.getElementById('table0b8');
    const table1b4 = document.getElementById('table1b4');
    const table1b5 = document.getElementById('table1b5');
    const table2b4 = document.getElementById('table2b4');
    const table2b5 = document.getElementById('table2b5');
    const table3b4 = document.getElementById('table3b4');
    const table3b5 = document.getElementById('table3b5');
    
    table0b5.addEventListener('input', calculateEPATotals);
    table0b8.addEventListener('input', calculateEPATotals);
    table1b4.addEventListener('input', calculateEPATotals);
    table1b5.addEventListener('input', calculateEPATotals);
    table2b4.addEventListener('input', calculateEPATotals);
    table2b5.addEventListener('input', calculateEPATotals);
    table3b4.addEventListener('input', calculateEPATotals);
    table3b5.addEventListener('input', calculateEPATotals);
}

const Step3aApp = {
    init() {
        const defaultValues = [
            {id: 'table0b2', value: '3.00'},
            {id: 'table0b3', value: '2.00'},
            {id: 'table0b4', value: '60.00'},
            {id: 'table0b5', value: '1.00'},
            {id: 'table0b8', value: '1.00'},
            {id: 'table1b2', value: '0.70'},
            {id: 'table1b3', value: '0.50'},
            {id: 'table1b4', value: '1.00'},
            {id: 'table1b5', value: '1.00'},
            {id: 'table2b2', value: '0.80'},
            {id: 'table2b3', value: '0.60'},
            {id: 'table2b4', value: '1.00'},
            {id: 'table2b5', value: '1.00'},
            {id: 'table3b2', value: '0.90'},
            {id: 'table3b3', value: '0.10'},
            {id: 'table3b4', value: '1.00'},
            {id: 'table3b5', value: '1.00'}
        ];
        defaultValues.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                element.value = parseFloat(item.value).toFixed(2);
                const tableId = item.id.substring(0, 6);
                const fieldId = item.id.substring(6);
                const isMetricConversion = ['b2', 'b3'].includes(fieldId);
                const skipConversion = (tableId === 'table0' && ['b5', 'b8'].includes(fieldId)) ||
                                      (tableId === 'table1' && ['b4', 'b5'].includes(fieldId)) ||
                                      (tableId === 'table2' && ['b4', 'b5'].includes(fieldId)) ||
                                      (tableId === 'table3' && ['b4', 'b5'].includes(fieldId));
                if (!skipConversion) {
                    calculateAndConvert(tableId, fieldId, fieldId.replace('b', 'c'), isMetricConversion);
                }
            }
        });
        calculateEPATotals();
        setupPanelNavigation();
        setupConfirmButtons();
        setupSpecialFieldListeners();
        setupSidebarToggle();
        setupConfirmedPanelToggle();
    }
};

window.Step3aApp = Step3aApp;