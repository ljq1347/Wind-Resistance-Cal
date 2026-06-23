const Step5App = {
    init() {
        this.resetResults();
    },
    
    resetResults() {
        const resultIds = [
            'totalMomentResult',
            'stressResult',
            'safetyFactorResult',
            'deResult',
            'iResult',
            'deflectionResult',
            'deflectionRatioResult'
        ];
        
        resultIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '-';
        });
        
        const localStressEl = document.getElementById('localStressResult');
        if (localStressEl) localStressEl.innerHTML = '';
        
        const exportBtn = document.getElementById('exportPdfBtn');
        if (exportBtn) exportBtn.style.display = 'none';
    }
};

window.Step5App = Step5App;