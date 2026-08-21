const stickers = document.querySelectorAll('.sticker');
const messages = document.getElementById('messages');
const chatBox = document.getElementById('chatBox');

stickers.forEach(sticker => {
  sticker.addEventListener('click', () => {
    const text = sticker.dataset.message;
    const bubble = document.createElement('div');
    bubble.className = 'message';
    bubble.innerText = text;
    messages.appendChild(bubble);
    chatBox.classList.add('has-message');
    sticker.classList.add('is-picked');
    setTimeout(() => sticker.classList.remove('is-picked'), 450);
  });
});
