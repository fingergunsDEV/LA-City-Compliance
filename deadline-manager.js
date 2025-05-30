// Deadline countdown and management
export function initializeDeadlineCountdown() {
    updateDeadlineCountdowns();
    setInterval(updateDeadlineCountdowns, 86400000); // Update daily
}

function updateDeadlineCountdowns() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Calculate next quarter deadline (simplified - assumes quarterly deadlines)
    let nextQuarter;
    if (currentMonth < 3) nextQuarter = new Date(currentYear, 3, 30); // April 30
    else if (currentMonth < 6) nextQuarter = new Date(currentYear, 6, 31); // July 31
    else if (currentMonth < 9) nextQuarter = new Date(currentYear, 9, 31); // October 31
    else nextQuarter = new Date(currentYear + 1, 0, 31); // January 31

    const cityDeadline = new Date(nextQuarter);
    const cdtfaDeadline = new Date(nextQuarter);
    cdtfaDeadline.setDate(cdtfaDeadline.getDate() + 30); // CDTFA typically 30 days later

    const cityDaysLeft = Math.ceil((cityDeadline - now) / (1000 * 60 * 60 * 24));
    const cdtfaDaysLeft = Math.ceil((cdtfaDeadline - now) / (1000 * 60 * 60 * 24));

    updateDeadlineDisplay('city', cityDeadline, cityDaysLeft);
    updateDeadlineDisplay('cdtfa', cdtfaDeadline, cdtfaDaysLeft);
}

function updateDeadlineDisplay(type, deadline, daysLeft) {
    const deadlineSpan = document.getElementById(`${type}-deadline`);
    const countdownSpan = document.getElementById(`${type}-countdown`);

    if (deadlineSpan && countdownSpan) {
        deadlineSpan.textContent = deadline.toLocaleDateString();
        countdownSpan.textContent = daysLeft;
        countdownSpan.className = daysLeft <= 7 ? 'deadline-warning' : daysLeft <= 15 ? 'deadline-caution' : 'deadline-safe';
    }
}
