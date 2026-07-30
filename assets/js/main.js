const progress = document.querySelector('.scroll-progress span');
const glow = document.querySelector('.cursor-glow');
const reveals = document.querySelectorAll('.reveal');
const parallaxItems = document.querySelectorAll('.parallax');
const magneticItems = document.querySelectorAll('.magnetic');

function updateProgress(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}

window.addEventListener('scroll', () => {
  updateProgress();
  parallaxItems.forEach(item => {
    const speed = Number(item.dataset.speed || 0.12);
    item.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
  });
}, { passive: true });

window.addEventListener('pointermove', event => {
  if (glow) glow.style.transform = `translate(${event.clientX - 170}px, ${event.clientY - 170}px)`;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });
reveals.forEach(element => observer.observe(element));

magneticItems.forEach(item => {
  item.addEventListener('pointermove', event => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
    item.style.transform = `translate(${x}px, ${y}px)`;
  });
  item.addEventListener('pointerleave', () => {
    item.style.transform = '';
  });
});

updateProgress();
