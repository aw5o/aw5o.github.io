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
