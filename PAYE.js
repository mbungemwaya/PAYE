function formatCurrency(amount) {
    return new Intl.NumberFormat('en-TZ', { 
        style: 'currency', 
        currency: 'TZS',
        minimumFractionDigits: 0 
    }).format(Math.round(amount));
}

function calculateTax(taxable) {
    if (taxable <= 270000) return 0;
    
    let tax = 0;
    
    if (taxable > 1000000) {
        tax = 128000 + (taxable - 1000000) * 0.30;
    } else if (taxable > 760000) {
        tax = 68000 + (taxable - 760000) * 0.25;
    } else if (taxable > 520000) {
        tax = 20000 + (taxable - 520000) * 0.20;
    } else if (taxable > 270000) {
        tax = (taxable - 270000) * 0.08;
    }
    
    return Math.max(0, tax);
}

function calculatePAYE() {
    const gross = parseFloat(document.getElementById('gross').value) || 0;
    const benefits = parseFloat(document.getElementById('benefits').value) || 0;
    const nssfRate = parseFloat(document.getElementById('nssf').value) / 100 || 0.10;
    let nhif = parseFloat(document.getElementById('nhif').value) || 0;
    
    const totalGross = gross + benefits;
    const nssfDeduction = Math.round(totalGross * nssfRate);
    
    // Auto NHIF estimate (3%) if zero
    if (nhif === 0) {
        nhif = Math.round(totalGross * 0.03);
    }
    
    const taxableIncome = totalGross - nssfDeduction;
    const payeTax = calculateTax(taxableIncome);
    
    const netPay = totalGross - nssfDeduction - payeTax - nhif;
    
    // Employer costs
    const nssfEmployer = Math.round(totalGross * 0.10);
    const sdl = Math.round(totalGross * 0.035);
    const wcf = Math.round(totalGross * 0.005);
    const totalEmployerCost = totalGross + nssfEmployer + sdl + wcf;
    
    // Update DOM
    document.getElementById('placeholder').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    document.getElementById('grossOut').textContent = formatCurrency(totalGross);
    document.getElementById('nssfOut').textContent = formatCurrency(nssfDeduction);
    document.getElementById('taxableOut').textContent = formatCurrency(taxableIncome);
    document.getElementById('payeOut').textContent = formatCurrency(payeTax);
    document.getElementById('nhifOut').textContent = formatCurrency(nhif);
    document.getElementById('netOut').textContent = formatCurrency(netPay);
    
    document.getElementById('nssfEmployer').textContent = formatCurrency(nssfEmployer);
    document.getElementById('sdlOut').textContent = formatCurrency(sdl);
    document.getElementById('wcfOut').textContent = formatCurrency(wcf);
    document.getElementById('totalEmployer').textContent = formatCurrency(totalEmployerCost);
}

// Auto-calculate when inputs change
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculatePAYE);
});

// Initial calculation
window.onload = calculatePAYE;