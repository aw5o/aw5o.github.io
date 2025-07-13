// Helper function to format counter values
function formatCounterValue(value) {
    if (value < 1000) {
        return value.toString();
    } else {
        let integerPart = Math.floor(value / 1000);
        let remainder = value % 1000;
        let fractional = Math.floor(remainder / 100);   // hundreds digit

        if (fractional === 0) {
            return integerPart + 'K';
        } else {
            return integerPart + '.' + fractional + 'K';
        }
    }
}

// Counter animation function
function animateCounter(elementId, finalValue, duration = 2000) {
    const element = document.getElementById(elementId);
    let startTime = null;
    const startValue = 0;
    
    function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.floor(progress * finalValue);
        element.textContent = formatCounterValue(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatCounterValue(finalValue);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Initialize counters when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        animateCounter('total-wins', 3545);
        animateCounter('crowns', 2468);
        animateCounter('matches', 3666);
    }, 800);
});

// Add hover effect to stat cards
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('floating');
    });
    
    card.addEventListener('mouseleave', () => {
        card.classList.remove('floating');
    });
});