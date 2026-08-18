document.addEventListener('DOMContentLoaded', () => {
  const dateEl = document.getElementById('today-date');
  const notifications = document.querySelectorAll('.notification');

  if (dateEl) {
    const today = new Date();
    dateEl.textContent = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric'
    }).format(today).toUpperCase();
  }

  notifications.forEach((notification, index) => {
    window.setTimeout(() => {
      notification.classList.add('show');
    }, 500 + index * 220);
  });
});
