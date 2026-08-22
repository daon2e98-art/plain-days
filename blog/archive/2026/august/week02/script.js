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

/* Plain Days legal footer */
(function addPlainDaysFooter(){
  if(document.querySelector('.pd-site-footer')) return;
  const footer=document.createElement('footer');
  footer.className='pd-site-footer';
  footer.innerHTML=`
    <div class="pd-site-footer-brand">PLAIN DAYS</div>
    <div class="pd-site-footer-note">ordinary days, saved slowly.</div>
    <nav class="pd-site-footer-links" aria-label="Plain Days information">
      <a href="https://plain-days.com/about/">ABOUT</a>
      <a href="https://plain-days.com/privacy-notice/">PRIVACY</a>
      <a href="https://plain-days.com/terms-of-use/">TERMS</a>
      <a href="https://plain-days.com/refunds/">REFUNDS</a>
    </nav>
    <div class="pd-site-footer-copy">© 2026</div>
  `;
  document.body.appendChild(footer);

  const style=document.createElement('style');
  style.textContent=`
    .pd-site-footer{width:min(1220px,calc(100% - 84px));margin:42px auto 0;padding:28px 8px 34px;border-top:1px solid rgba(80,84,86,.14);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;color:#85818b;font-size:9px;letter-spacing:.16em}.pd-site-footer-brand{color:#4a474e;letter-spacing:.24em}.pd-site-footer-note{text-align:center;letter-spacing:.12em;color:#aaa6ad}.pd-site-footer-links{display:flex;justify-content:flex-end;gap:20px}.pd-site-footer-links a{color:#85818b;text-decoration:none;transition:opacity .2s ease}.pd-site-footer-links a:hover{opacity:.45}.pd-site-footer-copy{text-align:right;color:#aaa6ad;grid-column:3}.pd-site-footer-links{grid-column:2;grid-row:1}.pd-site-footer-copy{grid-row:2}.pd-site-footer-note{grid-row:2;grid-column:1 / 3;text-align:left}@media(max-width:700px){.pd-site-footer{width:calc(100% - 28px);grid-template-columns:1fr;gap:14px;padding:24px 4px 28px}.pd-site-footer-links{grid-column:1;grid-row:auto;justify-content:flex-start;flex-wrap:wrap;gap:14px}.pd-site-footer-note{grid-column:1;grid-row:auto;text-align:left}.pd-site-footer-copy{grid-column:1;grid-row:auto;text-align:left}}
  `;
  document.head.appendChild(style);
})();
