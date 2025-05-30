// Tax rates and calculation logic
const taxRates = new Map([
    ['541000', { description: 'Professional, Scientific, Technical Services', ratePer1k: 4.25 }],
    ['722000', { description: 'Food Services and Drinking Places', ratePer1k: 1.25 }],
    ['511000', { description: 'Publishing Industries (except Internet)', ratePer1k: 0.85 }],
    ['621000', { description: 'Ambulatory Health Care Services', ratePer1k: 2.15 }],
    ['811000', { description: 'Repair and Maintenance', ratePer1k: 3.00 }],
    ['GENERAL', { description: 'General Business Rate (Example)', ratePer1k: 3.50 }]
]);

export function updateRateDisplay(index, selectedCode) {
    const rateSpan = document.getElementById(`rate-${index}`);
    if (!rateSpan) return;

    let rateData = null;
    const codePrefix = selectedCode.substring(0, 3) + '000';
    
    if (taxRates.has(codePrefix)) {
        rateData = taxRates.get(codePrefix);
    } else if (taxRates.has('GENERAL')) {
        rateData = taxRates.get('GENERAL');
    }

    if (rateData) {
        rateSpan.textContent = `Rate: $${rateData.ratePer1k.toFixed(2)} per $1k gross receipts`;
    } else {
        rateSpan.textContent = '';
    }
}

export function calculateTax() {
    let totalAnnualTax = 0;
    const streams = document.querySelectorAll('#revenue-streams .revenue-stream');

    streams.forEach((stream) => {
        const index = stream.dataset.index;
        const naicsCodeInput = stream.querySelector(`#naics-code-${index}`);
        const revenueInput = stream.querySelector(`#revenue-${index}`);

        if (!naicsCodeInput || !revenueInput) return;

        const selectedCode = naicsCodeInput.value;
        const annualRevenue = parseFloat(revenueInput.value) || 0;

        if (selectedCode && annualRevenue > 0) {
            const codePrefix = selectedCode.substring(0, 3) + '000';
            let rateData = taxRates.get(codePrefix) || taxRates.get('GENERAL');

            if (rateData) {
                const ratePer1k = rateData.ratePer1k;
                const streamTax = (annualRevenue / 1000) * ratePer1k;
                totalAnnualTax += streamTax;
            }
        }
    });

    updateTaxDisplay(totalAnnualTax);
}

function updateTaxDisplay(totalAnnualTax) {
    const annualTaxSpan = document.getElementById('annual-tax');
    const quarterlyTaxSpan = document.getElementById('quarterly-tax');
    const monthlyEscrowSpan = document.getElementById('monthly-escrow');

    if (annualTaxSpan) annualTaxSpan.textContent = `$${totalAnnualTax.toFixed(2)}`;
    if (quarterlyTaxSpan) quarterlyTaxSpan.textContent = `$${(totalAnnualTax / 4).toFixed(2)}`;
    if (monthlyEscrowSpan) monthlyEscrowSpan.textContent = `$${(totalAnnualTax / 12).toFixed(2)}`;
}
