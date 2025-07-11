// 1) Slider
const slides = document.querySelectorAll('.slide'),
      navDots = document.querySelectorAll('.dot');
let current = 0;

function showSlide(n) {
  slides[current].classList.remove('active');
  navDots[current].classList.remove('active');

  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  navDots[current].classList.add('active');

  document.querySelectorAll('.hero-content.fade-in').forEach(el => {
    el.classList.remove('visible');
  });

  const content = slides[current].querySelector('.hero-content.fade-in');
  if (content) {
    void content.offsetWidth;
    content.classList.add('visible');
  }
}

document.querySelector('.nav.next').addEventListener('click', () => showSlide(current + 1));
document.querySelector('.nav.prev').addEventListener('click', () => showSlide(current - 1));

navDots.forEach(dot =>
  dot.addEventListener('click', e => showSlide(+e.target.dataset.slide))
);

// 2) Interactive-dots
const iDots = document.querySelectorAll('.i-dot');
const popup = document.getElementById('dot-popup');
const cardImg = popup.querySelector('img');
const cardTitle = popup.querySelector('h5');

iDots.forEach(dot => {
  dot.addEventListener('mouseenter', () => {
    const name = dot.dataset.serviceName || dot.dataset.productName;
    const src  = dot.dataset.serviceImg   || dot.dataset.productImg;

    cardTitle.textContent = name;
    cardImg.src           = src;
    cardImg.alt           = name;

    const r = dot.getBoundingClientRect();
    popup.style.top     = (r.top + r.height / 2) + 'px';
    popup.style.left    = (r.left + r.width / 2) + 'px';
    popup.style.display = 'block';
  });

  dot.addEventListener('mouseleave', () => {
    popup.style.display = 'none';
  });
});

// 3) Menú móvil
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu   = document.getElementById('mobile-menu');

hamburgerBtn.addEventListener('click', () => {
  const isVisible = mobileMenu.style.display === 'block';
  mobileMenu.style.display = isVisible ? 'none' : 'block';
});

// 4) Animación de fade-in
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// 5) Contacto
document.querySelectorAll('a[href="#contacto"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('.hero-slider').style.display = 'none';
    const contactSection = document.getElementById('contacto');
    contactSection.classList.add('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// 6) Formulario de contacto
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyaC--r2gOv07C_rzjJx8ecsxQ_EOS91ef6fUfetFNdfFLzB3ZRJzfonbICvzjc56h3nw/exec';

document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const form = e.target;
  const fd = new FormData();
  const nombre = form.querySelector('#name').value;
  const correo = form.querySelector('#email').value;
  const nota   = form.querySelector('#message').value;
  const btn    = form.querySelector('button[type="submit"]');
  btn.disabled = true;

  fd.append('nombre', nombre);
  fd.append('correo', correo);
  fd.append('notas', nota);

  fetch(SCRIPT_URL, {
    method: 'POST',
    body: fd
  })
  .then(res => res.json())
  .then(data => {
    if (data.status !== 'ok') throw new Error(data.error || 'Error inesperado');
    alert("¡Gracias! Tu mensaje fue enviado.");
    form.reset();
  })
  .catch(err => {
    console.error('Error al enviar:', err);
    alert("Hubo un error al enviar el mensaje.");
  })
  .finally(() => {
    btn.disabled = false;
  });
});
