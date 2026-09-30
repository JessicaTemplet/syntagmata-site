(function () {
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i % 6) * 0.06 + 's';
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  // Route "live" project links through a custom waking screen instead
  // of letting people land on Render's generic spin-up page.
  document.querySelectorAll("a.live-link").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const to = encodeURIComponent(this.href);
      const name = encodeURIComponent(this.dataset.name || this.textContent.trim());
      window.open("launch.html?to=" + to + "&name=" + name, "_blank");
    });
  });
})();
