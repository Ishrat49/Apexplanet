// Wait for DOM setup
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const preloader = document.getElementById("preloader");
  const themeToggleBtn = document.querySelector("[data-theme-toggle]");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
  const sidebarClose = document.querySelector("[data-sidebar-close]");
  const filterButtons = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    if (!preloader) return;
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 700);
  });

  /* ---------- Theme handling ---------- */
  const THEME_KEY = "portfolio-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.add("light-theme");
      body.classList.remove("dark-theme");
    } else {
      body.classList.add("dark-theme");
      body.classList.remove("light-theme");
    }
    updateThemeIcon();
  }

  function updateThemeIcon() {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector("ion-icon");
    if (!icon) return;
    const isLight = body.classList.contains("light-theme");
    icon.setAttribute("name", isLight ? "moon-outline" : "sunny-outline");
  }

  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    applyTheme(storedTheme);
  } else {
    applyTheme("dark");
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isLight = body.classList.contains("light-theme");
      const next = isLight ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------- SPA navigation ---------- */
  function setActivePage(targetName) {
    pages.forEach((page) => {
      const pageName = page.getAttribute("data-page");
      if (pageName === targetName) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-nav-link");
      if (!target) return;

      navLinks.forEach((btn) => btn.classList.remove("active"));
      link.classList.add("active");
      setActivePage(target);

      if (window.innerWidth <= 900 && sidebar) {
        sidebar.classList.remove("open");
      }
    });
  });

  /* ---------- Sidebar toggle for mobile ---------- */
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

  /* ---------- Project filter ---------- */
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-filter-btn") || "all";

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      filterItems.forEach((item) => {
        const category = item.getAttribute("data-category") || "";
        const matches =
          selected === "all" ||
          category.toLowerCase() === selected.toLowerCase();
        if (matches) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    });
  });

  /* ---------- Download resume ---------- */
  const downloadBtn = document.getElementById("download-resume-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", (e) => {
      const RESUME_URL = "https://drive.google.com/uc?export=download&id=1u8DqN9tmgcNtx0I6I-HmLd00y6qKm3ap";      e.preventDefault();
      window.open(RESUME_URL, "_blank");
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ---------- Particle background ---------- */
  initParticles();
});

/* Particle animation using canvas, gold theme, no external libraries */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const particles = [];
  const PARTICLE_COUNT = width < 768 ? 40 : 70;

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: randomRange(0.6, 1.8),
        speedX: randomRange(-0.2, 0.2),
        speedY: randomRange(-0.15, 0.25),
        offset: Math.random() * 360,
        colorMix: Math.random(),
      });
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    createParticles();
  }

  window.addEventListener("resize", () => {
    window.requestAnimationFrame(resize);
  });

  createParticles();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.speedX;
      p.y += p.speedY + Math.sin((p.offset + p.y) * 0.003) * 0.03;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const gold1 = "rgba(219,185,75,0.20)";
      const gold2 = "rgba(245,228,144,0.14)";

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      const t = p.colorMix;
      const color = mixColors(gold1, gold2, t);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // subtle lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 100;

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.14;
          ctx.strokeStyle = "rgba(219,185,75," + alpha.toFixed(3) + ")";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* Mix two rgba colors given as strings "rgba(r,g,b,a)" with factor t in [0,1]. */
function mixColors(colorA, colorB, t) {
  const parse = (c) => {
    const nums = c
      .replace(/[^\d.,]/g, "")
      .split(",")
      .map((v) => parseFloat(v.trim()));
    return { r: nums[0], g: nums[1], b: nums[2], a: nums[3] };
  };
  const a = parse(colorA);
  const b = parse(colorB);

  const r = a.r + (b.r - a.r) * t;
  const g = a.g + (b.g - a.g) * t;
  const bCh = a.b + (b.b - a.b) * t;
  const alpha = a.a + (b.a - a.a) * t;

  return (
    "rgba(" +
    r.toFixed(0) +
    "," +
    g.toFixed(0) +
    "," +
    bCh.toFixed(0) +
    "," +
    alpha.toFixed(3) +
    ")"
  );
}

