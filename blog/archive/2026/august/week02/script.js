const stickers = document.querySelectorAll('.sticker');
const messages = document.getElementById('messages');
const chatBox = document.getElementById('chatBox');
const memoryBoard = document.querySelector('.memory-board');

stickers.forEach(sticker => {
  sticker.addEventListener('click', () => {
    // Convert escaped line breaks from the HTML data attribute
    // into real line breaks inside the chat bubble.
    const text = sticker.dataset.message.replace(/\\n/g, '\n');

    const bubble = document.createElement('div');
    bubble.className = 'message';
    bubble.innerText = text;
    messages.appendChild(bubble);

    sticker.classList.add('is-picked');
    setTimeout(() => sticker.classList.remove('is-picked'), 450);

    messages.scrollTop = messages.scrollHeight;
  });
});

// On mobile, let the chat follow the screen while the user browses the stickers.
function updateMobileChat() {
  if (window.innerWidth > 900) {
    chatBox.classList.remove('is-floating', 'is-docked');
    return;
  }

  const boardRect = memoryBoard.getBoundingClientRect();
  const chatHeight = chatBox.offsetHeight;
  const startTop = 12;
  const endGap = 20;

  chatBox.classList.remove('is-floating', 'is-docked');

  if (boardRect.top <= startTop && boardRect.bottom > chatHeight + endGap) {
    chatBox.classList.add('is-floating');
  } else if (boardRect.bottom <= chatHeight + endGap) {
    chatBox.classList.add('is-docked');
  }
}

window.addEventListener('scroll', updateMobileChat, { passive: true });
window.addEventListener('resize', updateMobileChat);
window.addEventListener('load', updateMobileChat);
updateMobileChat();
