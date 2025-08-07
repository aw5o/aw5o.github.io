const btn = document.getElementById('discordBtn');
const discordInviteURL = "https://discord.gg/7QWfj9473B";

btn.addEventListener('click', () => {
  let countdown = 5;
  btn.disabled = true;

  const intervalId = setInterval(() => {
    if (countdown > 0) {
      btn.innerHTML = `Please wait.. Redirecting to <i class="fa-brands fa-discord"></i> Discord in ${countdown}..`;
      countdown--;
    } else {
      clearInterval(intervalId);
      window.location.href = discordInviteURL;
    }
  }, 1000);
});
