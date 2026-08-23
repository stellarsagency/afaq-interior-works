document.addEventListener("DOMContentLoaded", () => {

  /* 0. IMAGE FALLBACK — use stock photo until owner adds real image */
  document.querySelectorAll("img[data-fallback]").forEach(img => {
    const swap = () => { if (img.naturalWidth === 0) img.src = img.dataset.fallback; };
    if (img.complete) swap();
    img.addEventListener("error", swap);
  });

  /* 1. PRELOADER */
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("hidden");
      setTimeout(() => preloader.remove(), 600);
    }, 2200);
  }

  /* 2. AOS */
  if (typeof AOS !== "undefined") AOS.init({ offset: 90, duration: 800, once: true });

  /* 3. HEADER + ACTIVE LINK */
  const header = document.getElementById("header");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links[href^="#"], .nav-links a[href^="#"]');
  function onScroll() {
    header?.classList.toggle("scrolled", window.scrollY > 50);
    let current = "";
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
    document.querySelectorAll(".nav-link").forEach(l => {
      l.classList.toggle("active", l.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id === "#") return;
      const t = document.querySelector(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
    });
  });

  /* 4. MOBILE MENU */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const openMenu = () => { mobileMenu?.classList.add("active"); mobileOverlay?.classList.add("active"); hamburger?.classList.add("active"); document.body.style.overflow = "hidden"; };
  const closeMenu = () => { mobileMenu?.classList.remove("active"); mobileOverlay?.classList.remove("active"); hamburger?.classList.remove("active"); document.body.style.overflow = ""; };
  hamburger?.addEventListener("click", () => mobileMenu?.classList.contains("active") ? closeMenu() : openMenu());
  document.getElementById("mobileClose")?.addEventListener("click", closeMenu);
  mobileOverlay?.addEventListener("click", closeMenu);
  document.querySelectorAll(".mobile-link").forEach(l => l.addEventListener("click", closeMenu));

  /* 5. HERO TYPING (Arabic) */
  const headline = document.getElementById("heroHeadline");
  if (headline) {
    const text = "فني ومعلم بلاط وسيراميك ورخام في جدة";
    let i = 0;
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    cursor.textContent = "|";
    headline.after(cursor);
    const timer = setInterval(() => {
      if (i < text.length) { headline.textContent += text[i]; i++; }
      else clearInterval(timer);
    }, 55);
  }

  /* 6. HERO PARTICLES — gold stars & diamonds */
  const pc = document.getElementById("heroParticles");
  if (pc) {
    for (let n = 0; n < 26; n++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 10 + 5;
      p.style.cssText = `width:${size}px;height:${size}px;right:${Math.random()*100}%;top:${100+Math.random()*40}%;background:${Math.random()>.4?"#c9a84c":"#e8c96e"};border-radius:${Math.random()>.5?"50%":"2px"};transform:rotate(45deg);animation-duration:${Math.random()*14+12}s;animation-delay:${Math.random()*10}s;opacity:.6`;
      pc.appendChild(p);
    }
  }

  /* 7. COUNT-UP STATS */
  function countUp(el) {
    const target = parseInt(el.dataset.target, 10);
    const step = target / 120;
    let cur = 0;
    (function tick() {
      cur += step;
      el.textContent = cur >= target ? target : Math.floor(cur);
      if (cur < target) requestAnimationFrame(tick);
    })();
  }
  const statsRow = document.querySelector(".stats-row");
  if (statsRow) {
    new IntersectionObserver((en, ob) => {
      if (en[0].isIntersecting) {
        statsRow.querySelectorAll(".stat-number").forEach(countUp);
        ob.disconnect();
      }
    }, { threshold: .35 }).observe(statsRow);
  }

  /* 8. SERVICE CARDS — pure CSS flip (JS tilt removed: it broke the flip) */

  /* 9. PORTFOLIO FILTER */
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      document.querySelectorAll(".portfolio-item").forEach(item => {
        const show = f === "all" || item.dataset.category === f;
        item.style.transition = "opacity .3s, transform .3s";
        item.style.opacity = "0"; item.style.transform = "scale(.9)";
        setTimeout(() => {
          item.style.display = show ? "" : "none";
          requestAnimationFrame(() => { item.style.opacity = "1"; item.style.transform = "scale(1)"; });
        }, 280);
      });
    });
  });

  /* 10. TESTIMONIAL CAROUSEL (RTL-aware) */
  const track = document.getElementById("testimonialTrack");
  const cards = track ? track.children : [];
  const dotsWrap = document.getElementById("testimonialDots");
  if (track && cards.length) {
    let idx = 0, auto;
    const total = cards.length;
    for (let i = 0; i < total; i++) {
      const d = document.createElement("button");
      d.className = "dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", () => { go(i); restart(); });
      dotsWrap.appendChild(d);
    }
    function go(n) {
      idx = (n + total) % total;
      track.style.transform = `translateX(${idx * 100}%)`; /* RTL: positive X */
      dotsWrap.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === idx));
    }
    const next = () => go(idx + 1), prev = () => go(idx - 1);
    const restart = () => { clearInterval(auto); auto = setInterval(next, 5500); };
    document.getElementById("testimonialNext")?.addEventListener("click", () => { next(); restart(); });
    document.getElementById("testimonialPrev")?.addEventListener("click", () => { prev(); restart(); });
    document.querySelector(".testimonial-carousel")?.addEventListener("mouseenter", () => clearInterval(auto));
    document.querySelector(".testimonial-carousel")?.addEventListener("mouseleave", restart);
    restart();
  }

  /* 11. NEWSLETTER */
  document.getElementById("newsletterForm")?.addEventListener("submit", e => {
    e.preventDefault();
    alert("تم تسجيل اشتراكك بنجاح! ستصلك أحدث العروض والنصائح قريباً.");
    e.target.reset();
  });

  /* 11b. FAQ ACCORDION */
  document.querySelectorAll(".faq-item").forEach(item => {
    item.querySelector(".faq-q")?.addEventListener("click", () => {
      const open = item.classList.contains("active");
      document.querySelectorAll(".faq-item").forEach(fi => {
        fi.classList.remove("active");
        const a = fi.querySelector(".faq-a");
        if (a) a.style.maxHeight = null;
      });
      if (!open) {
        item.classList.add("active");
        const a = item.querySelector(".faq-a");
        if (a) a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* 12. CONTACT FORM */
  document.getElementById("contactForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const form = e.target;
    let ok = true;
    form.querySelectorAll("[required]").forEach(f => {
      const bad = !f.value.trim();
      f.style.borderColor = bad ? "#e74c3c" : "";
      if (bad) ok = false;
    });
    if (!ok) return;
    alert("شكراً لتواصلك معنا! تم إرسال طلبك بنجاح وسنعاود الاتصال بك قريباً.");
    form.reset();
  });

  document.getElementById("popupForm")?.addEventListener("submit", e => {
    e.preventDefault();
    hidePopup();
    alert("تم استلام طلبك! سنتواصل معك خلال 24 ساعة بإذن الله.");
    e.target.reset();
  });

  /* 12. POPUP (exit intent / 9s delay, once per session) */
  const popup = document.getElementById("popupOverlay");
  const showPopup = () => { if (popup && !sessionStorage.getItem("aq_shown")) { popup.classList.add("active"); sessionStorage.setItem("aq_shown", "1"); } };
  const hidePopup = () => popup?.classList.remove("active");
  if (popup) {
    setTimeout(showPopup, 9000);
    document.addEventListener("mouseout", e => { if (!e.relatedTarget && e.clientY < 8) showPopup(); });
    document.getElementById("popupClose")?.addEventListener("click", hidePopup);
    popup.addEventListener("click", e => { if (e.target === popup) hidePopup(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") hidePopup(); });
  }

  /* 13. BACK TO TOP */
  const btt = document.getElementById("backToTop");
  window.addEventListener("scroll", () => btt?.classList.toggle("visible", window.scrollY > 500), { passive: true });
  btt?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});