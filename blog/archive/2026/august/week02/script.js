const stickers = document.querySelectorAll('.sticker');
const messages = document.getElementById('messages');

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
