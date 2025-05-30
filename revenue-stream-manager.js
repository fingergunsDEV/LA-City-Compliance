// Revenue stream management
import { setupNaicsSearch } from './naics-search.js';
import { calculateTax } from './tax-calculator.js';

let streamCount = 1;

export function initializeRevenueStreams() {
    attachEventListeners();
}

function attachEventListeners() {
    const revenueStreamsContainer = document.getElementById('revenue-streams');
    if (!revenueStreamsContainer) return;

    revenueStreamsContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('annual-revenue')) {
            calculateTax();
        }
    });

    revenueStreamsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-stream')) {
            const index = event.target.dataset.index;
            removeRevenueStream(index);
        }
    });

    const addStreamButton = document.getElementById('add-stream');
    if (addStreamButton) {
        addStreamButton.addEventListener('click', addRevenueStream);
    }
}

export function addRevenueStream() {
    const streamsContainer = document.getElementById('revenue-streams');
    if (!streamsContainer) return;

    const newStreamDiv = document.createElement('div');
    newStreamDiv.classList.add('revenue-stream');
    newStreamDiv.dataset.index = streamCount;
    newStreamDiv.innerHTML = `
        <label for="naics-search-${streamCount}">NAICS Code / Business Type:</label>
        <input type="text" id="naics-search-${streamCount}" class="naics-search-input" placeholder="Search NAICS code or description" data-index="${streamCount}">
        <input type="hidden" id="naics-code-${streamCount}" class="naics-code" data-index="${streamCount}">
        <div class="naics-results" id="naics-results-${streamCount}" data-index="${streamCount}"></div>
        <span class="rate-display" id="rate-${streamCount}"></span>

        <label for="revenue-${streamCount}">Annual Gross Receipts ($):</label>
        <input type="number" id="revenue-${streamCount}" class="annual-revenue" data-index="${streamCount}" value="0" min="0">
        <button type="button" class="remove-stream" data-index="${streamCount}">Remove</button>
    `;
    streamsContainer.appendChild(newStreamDiv);

    setupNaicsSearch(streamCount);
    streamCount++;
    calculateTax();
}

function removeRevenueStream(index) {
    const streamElement = document.querySelector(`.revenue-stream[data-index="${index}"]`);
    if (streamElement) {
        streamElement.remove();
        calculateTax();
    }
}

export function getStreamCount() {
    return streamCount;
}

export function incrementStreamCount() {
    streamCount++;
}
