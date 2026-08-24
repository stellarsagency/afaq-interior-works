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

  /* 12. CONTACT FORM → WhatsApp */
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
    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("serviceType").value;
    const message = document.getElementById("message").value.trim();
    const serviceMap = { floor: "تركيب بلاط الأرضيات", wall: "تركيب بلاط الجدران", kitchen: "بلاط الحمامات والمطابخ" };
    const serviceLabel = serviceMap[service] || service;
    const text = encodeURIComponent(
      "مرحباً آفاق أعمال داخلية\n" +
      "أريد الاستفسار عن خدمة: " + serviceLabel + "\n\n" +
      "الاسم: " + name + "\n" +
      "الجوال: " + phone + "\n" +
      "تفاصيل: " + message
    );
    window.open("https://wa.me/966539815421?text=" + text, "_blank");
    alert("شكراً لتواصلك معنا! جارٍ فتح واتساب لإرسال طلبك.");
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

  /* 14. LANGUAGE SWITCHER */
  const langBtn = document.getElementById("langSwitch");
  const htmlEl = document.documentElement;
  const translations = {
    en: {
      logo: "Afaq <span>Interior Works</span>",
      navHome: "Home", navServices: "Services", navPortfolio: "Our Work", navAbout: "About Us", navContact: "Contact Us",
      cta: "Get a Free Quote", topbarHours: "Sat - Thu: 8 AM - 8 PM", topbarAddr: "Jeddah, Saudi Arabia",
      heroKicker: "Certified Finishing Company in Jeddah",
      heroHeadline: "Professional Tile Installer & Tiler in Jeddah",
      heroSub: "Floors ◆ Walls ◆ Marble ◆ Renovation",
      heroDesc: "More than 500 successful projects — a team of certified tile installers, ceramic and marble technicians. We transform your spaces with precision, craftsmanship, and premium quality.",
      heroCta1: "Get a Free Quote", heroCta2: "View Our Work",
      statExp: "Years Experience", statProj: "Projects Done", statClient: "Happy Clients",
      scrollDown: "Scroll Down",
      servicesEyebrow: "What We Offer", servicesTitle: "Our Services",
      servicesSub: "We provide a complete range of tile installation and interior finishing services with high professionalism",
      svc1Title: "Floor Tile Installation", svc1Front: "Professional floor tiles for all spaces", svc1Back: "Expert ceramic and porcelain tile installation for villas, offices, and commercial buildings, ensuring perfect leveling, precise alignment, and flawless grouting.",
      svc2Title: "Wall Tile Installation", svc2Front: "Precise wall tile installation with perfect finishes", svc2Back: "Clean, coordinated finishes for halls, entrances, and feature walls, with precise cutting and installation techniques for a flawless appearance.",
      svc3Title: "Bathroom & Kitchen Tiles", svc3Front: "Waterproof solutions with elegant designs", svc3Back: "Complete waterproofing and tile installation for bathrooms and kitchens, including kitchen countertops, wet areas, and custom designs.",
      svc4Title: "Marble & Ceramic Works", svc4Front: "Premium marble and ceramic finishes", svc4Back: "Luxury marble flooring and wall cladding, premium ceramic tiling. We work with all types of natural stone and luxury ceramics.",
      svc5Title: "Maintenance & Renovation", svc5Front: "Comprehensive maintenance and renovation services", svc5Back: "Tile replacement, crack repair, and complete space renovation. We transform old spaces into modern, beautiful areas.",
      svcCtaTitle: "Didn't find what you're looking for?", svcCtaSub: "Contact us for a free consultation", svcCtaBtn: "Contact via WhatsApp",
      portEyebrow: "Our Portfolio", portTitle: "Our Work",
      portSub: "A curated selection of tile installation and renovation projects we've completed across Jeddah",
      filterAll: "All", filterFloor: "Floors", filterWall: "Walls", filterKitchen: "Kitchens",
      portItem1: "Luxury Villa Flooring", portItem1Loc: "Al-Nahda, Jeddah", portItem2: "Hotel Lobby Flooring", portItem2Loc: "Corniche, Jeddah", portItem3: "Residential Apartment Flooring", portItem3Loc: "Al-Salama, Jeddah", portItem4: "Commercial Office Flooring", portItem4Loc: "Al-Madinah Rd, Jeddah",
      portItem5: "Office Wall Tiles", portItem5Loc: "Al-Madinah Rd, Jeddah", portItem6: "Hospital Wall Tiles", portItem6Loc: "Al-Aziziya, Jeddah", portItem7: "Luxury Bathroom Wall Tiles", portItem7Loc: "Al-Hamra, Jeddah", portItem8: "Kitchen Wall Tiles", portItem8Loc: "Al-Faisaliya, Jeddah",
      portItem9: "Modern Kitchen Backsplash", portItem9Loc: "Al-Salama, Jeddah", portItem10: "Restaurant Flooring", portItem10Loc: "Al-Balad, Jeddah", portItem11: "Modern Tiled Kitchen", portItem11Loc: "Al-Faisaliya, Jeddah", portItem12: "Kitchen Floor Tiles", portItem12Loc: "Al-Rawda, Jeddah",
      aboutEyebrow: "About Us", aboutTitle: "About Afaq Interior Works",
      aboutP1: "Afaq Interior Works is a trusted name in Jeddah for tile, marble, and interior renovation services. As a professional tile installer and tiler in Jeddah with over ten years of experience, our team consists of elite tile installers, ceramic and marble technicians specializing in flooring and wall tiling for villas and homes, bathroom and kitchen tiles with full waterproofing.",
      aboutP2: "Every marble and ceramic technician on our team is certified and trained on the latest installation and grouting techniques. We take pride in attention to detail, using premium materials, and our commitment to customer satisfaction.",
      missionTitle: "Our Mission", missionText: "To deliver exceptional tile and ceramic solutions that combine beauty, durability, and function.",
      visionTitle: "Our Vision", visionText: "To be the leading interior finishing company in the Kingdom of Saudi Arabia.",
      expBadge: "Years of Excellence",
      testEyebrow: "Testimonials", testTitle: "Our Clients Say",
      test1: '"Afaq Interior Works did an amazing job on our villa flooring. Professional, punctual team, and the quality was outstanding. Very happy with the results."',
      test1Name: "Ahmed Al-Faisal", test1Role: "Villa Owner, Jeddah",
      test2: '"They transformed our old bathroom into a modern, luxurious space. The attention to detail was impressive. Highly recommend their services!"',
      test2Name: "Sarah Al-Ghamdi", test2Role: "Homeowner, Jeddah",
      test3: '"We hired them for marble work in our showroom. The finishing was impeccable and they completed ahead of schedule. Very reliable team."',
      test3Name: "Mohammed Al-Harbi", test3Role: "Showroom Owner, Jeddah",
      test4: '"Honest and trustworthy team. They gave us excellent advice on tile selection and the installation was perfect. We will use them again."',
      test4Name: "Fatima Al-Zahrani", test4Role: "Property Manager, Jeddah",
      contactEyebrow: "Contact Us", contactTitle: "Get in Touch",
      contactSub: "Have a project? Message us today and get a free quote within 24 hours",
      formName: "Full Name", formPhone: "Phone Number", formService: "Select Service",
      formSvcFloor: "Floor Tile Installation", formSvcWall: "Wall Tile Installation", formSvcKitchen: "Bathroom & Kitchen Tiles",
      formMsg: "Project Details", formSubmit: "Send Request",
      infoHours: "Working Hours", infoHoursVal: "Sat - Thu: 8 AM - 8 PM",
      serviceAreasTitle: "Tile Installer Service Areas in Jeddah:",
      newsletterTitle: "Subscribe to Our Newsletter", newsletterSub: "Get the latest tile and marble tips and exclusive offers delivered to your inbox",
      newsletterPlaceholder: "Enter your email", newsletterBtn: "Subscribe Now", newsletterNote: "We respect your privacy",
      footerDesc: "Certified tile installer, ceramic and marble technician in all Jeddah neighborhoods — flooring, walls, bathrooms, kitchens, maintenance, and renovation.",
      footerQuick: "Quick Links", footerServices: "Our Services", footerContact: "Contact Info",
      fSvc1: "Floor Tile Installer", fSvc2: "Wall Tile Installer", fSvc3: "Bathroom & Kitchen Tiles", fSvc4: "Marble & Ceramic Installer", fSvc5: "Maintenance & Renovation",
      footerCopyright: "© 2026 Afaq Interior Works — All Rights Reserved",
      alertNewsletter: "Your subscription has been successfully registered! You will receive the latest offers and tips soon.",
      alertContact: "Thank you for contacting us! Your request has been sent successfully and we will call you back soon.",
      alertPopup: "Your request has been received! We will contact you within 24 hours, God willing."
    }
  };
  let currentLang = "ar";

  function setLang(lang) {
    currentLang = lang;
    const en = translations.en;
    if (lang === "en") {
      htmlEl.setAttribute("dir", "ltr");
      htmlEl.classList.add("dir-ltr");
      langBtn.textContent = "عربي";
    } else {
      htmlEl.setAttribute("dir", "rtl");
      htmlEl.classList.remove("dir-ltr");
      langBtn.textContent = "EN";
    }
    document.querySelectorAll("[data-en]").forEach(el => {
      el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.ar || el.innerHTML;
    });
    document.querySelectorAll("[data-en-placeholder]").forEach(el => {
      el.placeholder = lang === "en" ? el.dataset.enPlaceholder : el.dataset.arPlaceholder || el.placeholder;
    });
    document.querySelectorAll("[data-en-value]").forEach(el => {
      el.value = lang === "en" ? el.dataset.enValue : el.dataset.arValue || el.value;
    });
    document.querySelectorAll(".portfolio-overlay h4").forEach((el, i) => {
      const keys = ["portItem1","portItem2","portItem3","portItem4","portItem5","portItem6","portItem7","portItem8","portItem9","portItem10","portItem11","portItem12"];
      if (keys[i] && en[keys[i]]) el.textContent = lang === "en" ? en[keys[i]] : el.dataset.ar;
    });
    document.querySelectorAll(".portfolio-overlay p").forEach((el, i) => {
      const keys = ["portItem1Loc","portItem2Loc","portItem3Loc","portItem4Loc","portItem5Loc","portItem6Loc","portItem7Loc","portItem8Loc","portItem9Loc","portItem10Loc","portItem11Loc","portItem12Loc"];
      if (keys[i] && en[keys[i]]) el.textContent = lang === "en" ? en[keys[i]] : el.dataset.ar;
    });
    document.title = lang === "en" ? "Professional Tile Installer in Jeddah | Afaq Interior Works" : "فني ومعلم بلاط في جدة | تركيب بلاط سيراميك ورخام - آفاق أعمال داخلية";
  }

  langBtn?.addEventListener("click", () => setLang(currentLang === "ar" ? "en" : "ar"));
});