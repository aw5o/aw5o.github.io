const btn = document.getElementById('discordBtn');
const discordInviteURL = "https://discord.gg/wXNNxd7cAb";

btn.addEventListener('click', () => {
  let countdown = 3;
  btn.disabled = true;

  const intervalId = setInterval(() => {
    if (countdown > 0) {
      btn.innerHTML = `Please wait.. Redirecting to  Discord in ${countdown}..`;
      countdown--;
    } else {
      clearInterval(intervalId);
      window.location.href = discordInviteURL;
    }
  }, 1000);
});



document.addEventListener('DOMContentLoaded', function() {
    // Language management
    const langDropdown = document.getElementById('languageDropdown');
    const langItems = document.querySelectorAll('.dropdown-item[data-lang]');
    
    // Load saved language
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    updateLanguage(savedLang);
    
    // Set up event listeners
    langItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            localStorage.setItem('preferredLanguage', lang);
            updateLanguage(lang);
        });
    });
    
    function updateLanguage(lang) {
        // Update dropdown text
        const langNames = {
            en: 'English',
            de: 'Deutsch',
            pl: 'Polski',
            es: 'Español',
            ko: '한국어',
            ja: '日本語'
        };
        langDropdown.innerHTML = `<i class="fa-solid fa-language me-1"></i> ${langNames[lang]}`;
        
        // Update html lang attribute
        document.documentElement.lang = lang;
        
        // Add actual translation implementation here
        // This would involve replacing text content based on language
        console.log(`Switched to ${langNames[lang]}`);
    }
    
    // Existing Discord button functionality
    const btn = document.getElementById('discordBtn');
    if(btn) {
        btn.addEventListener('click', () => {
            let countdown = 3;
            btn.disabled = true;
            
            const intervalId = setInterval(() => {
                if (countdown > 0) {
                    btn.innerHTML = `Please wait.. Redirecting to Discord in ${countdown}..`;
                    countdown--;
                } else {
                    clearInterval(intervalId);
                    window.location.href = "https://discord.gg/wXNNxd7cAb";
                }
            }, 1000);
        });
    }
});