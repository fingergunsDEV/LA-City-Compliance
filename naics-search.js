import Fuse from 'fuse.js';

// NAICS data and search functionality
const simulatedNaicsData = [
    { code: '541211', description: 'Offices of Certified Public Accountants' },
    { code: '541214', description: 'Payroll Services' },
    { code: '541310', description: 'Architectural Services' },
    { code: '541410', description: 'Interior Design Services' },
    { code: '541511', description: 'Custom Computer Programming Services' },
    { code: '541512', description: 'Computer Systems Design Services' },
    { code: '541611', description: 'Administrative Management and General Management Consulting Services' },
    { code: '541810', description: 'Advertising Agencies' },
    { code: '541910', description: 'Marketing Research and Public Opinion Polling' },
    { code: '541922', description: 'Commercial Photography' },
    { code: '722511', description: 'Full-Service Restaurants' },
    { code: '722513', description: 'Limited-Service Restaurants' },
    { code: '722410', description: 'Drinking Places (Alcoholic Beverages)' },
    { code: '511130', description: 'Book Publishers' },
    { code: '511140', description: 'Directory and Mailing List Publishers' },
    { code: '511199', description: 'All Other Publishers' },
    { code: '621111', description: 'Offices of Physicians (except Mental Health)' },
    { code: '621210', description: 'Offices of Dentists' },
    { code: '621310', description: 'Offices of Chiropractors' },
    { code: '621340', description: 'Offices of Physical, Occupational and Speech Therapists, and Audiologists' },
    { code: '811111', description: 'General Automotive Repair' },
    { code: '811212', description: 'Computer and Office Machine Repair and Maintenance' },
    { code: '811310', description: 'Commercial and Industrial Machinery and Equipment (except Automotive and Electronic) Repair and Maintenance' },
    { code: 'GENERAL', description: 'General Business Operations (Simulated Fallback)' },
    { code: '236118', description: 'Residential Remodelers' },
    { code: '238350', description: 'Finish Carpentry Contractors' },
    { code: '444110', description: 'Home Centers' },
    { code: '444190', description: 'Other Building Material Dealers' },
    { code: '451110', description: 'Sporting Goods Stores' },
    { code: '451120', description: 'Hobby, Toy, and Game Stores' },
    { code: '451130', description: 'Sewing, Needlework, and Piece Goods Stores' },
    { code: '451140', description: 'Musical Instrument and Supplies Stores' },
    { code: '458110', description: 'Clothing Accessories Stores' },
    { code: '458120', description: 'Jewelry Stores' },
    { code: '458210', description: 'Shoe Stores' },
    { code: '458310', description: 'Book Stores' },
    { code: '458320', description: 'Department Stores' },
    { code: '458330', description: 'General Merchandise Stores, including Warehouse Clubs and Supercenters' },
    { code: '458390', description: 'Other Miscellaneous Store Retailers' },
    { code: '459110', description: 'Electronic and Appliance Retailers' },
    { code: '459210', description: 'Furniture and Home Furnishings Retailers' },
    { code: '459310', description: 'Computer and Software Retailers' },
    { code: '459410', description: 'Office Supplies and Stationery Retailers' },
    { code: '459420', description: 'Used Merchandise Retailers' },
    { code: '459510', description: 'Florists' },
    { code: '459910', description: 'Pet and Pet Supplies Retailers' },
    { code: '459990', description: 'Other Miscellaneous Store Retailers (except Tobacco Stores)' }
];

const fuse = new Fuse(simulatedNaicsData, {
    keys: ['code', 'description']
});

export function setupNaicsSearch(index) {
    const searchInput = document.getElementById(`naics-search-${index}`);
    const resultsDiv = document.getElementById(`naics-results-${index}`);

    if (!searchInput || !resultsDiv) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            resultsDiv.style.display = 'none';
            return;
        }

        const results = fuse.search(query, { limit: 10 });
        displaySearchResults(results, resultsDiv, index);
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            resultsDiv.style.display = 'none';
        }, 200);
    });
}

function displaySearchResults(results, resultsDiv, index) {
    resultsDiv.innerHTML = '';
    
    if (results.length === 0) {
        resultsDiv.style.display = 'none';
        return;
    }

    results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'naics-result-item';
        item.textContent = `${result.item.code} - ${result.item.description}`;
        item.addEventListener('click', () => {
            selectNaicsCode(result.item, index);
        });
        resultsDiv.appendChild(item);
    });

    resultsDiv.style.display = 'block';
}

export function selectNaicsCode(naicsItem, index) {
    const searchInput = document.getElementById(`naics-search-${index}`);
    const hiddenInput = document.getElementById(`naics-code-${index}`);
    const resultsDiv = document.getElementById(`naics-results-${index}`);

    if (!searchInput || !hiddenInput || !resultsDiv) return;

    searchInput.value = `${naicsItem.code} - ${naicsItem.description}`;
    hiddenInput.value = naicsItem.code;
    resultsDiv.style.display = 'none';

    // Import and call tax calculation functions
    import('./tax-calculator.js').then(module => {
        module.updateRateDisplay(index, naicsItem.code);
        module.calculateTax();
    });
}

export function initializeNaicsSearch() {
    document.querySelectorAll('.naics-search-input').forEach(input => {
        if (input.dataset.index) {
            setupNaicsSearch(input.dataset.index);
        }
    });
}
