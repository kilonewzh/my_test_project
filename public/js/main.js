// 平滑滚动
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// 导航栏滚动效果
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(0,0,0,0.6)';
  } else {
    nav.style.background = 'rgba(0,0,0,0.3)';
  }
});