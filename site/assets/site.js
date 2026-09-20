(() => {
  const root = document.documentElement;
  const store = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {}
    },
  };
  const cap = (word) => word[0].toUpperCase() + word.slice(1);

  // ---------- variant (?c=key, see variants.js) ----------
  const variants = window.VARIANTS;
  if (variants) {
    const param = new URLSearchParams(location.search).get("c");
    let code = param;
    try {
      if (param) sessionStorage.setItem("variant", param);
      else code = sessionStorage.getItem("variant");
    } catch (e) {}
    const v = code && Object.prototype.hasOwnProperty.call(variants, code) ? variants[code] : null;

    if (v) {
      // Text is built from pieces, never as HTML. [[..]] marks the blue words.
      const fill = (el, text) => {
        el.textContent = "";
        text.split(/\[\[|\]\]/).forEach((piece, i) => {
          if (!piece) return;
          if (i % 2 === 0) return el.append(piece);
          const span = document.createElement("span");
          span.className = "hl accent";
          span.textContent = piece;
          el.append(span);
        });
      };
      const reorder = (container, keys) => {
        if (!container || !keys) return;
        // Listed keys go first, in the order given. Anything not listed keeps its place after them.
        [...keys].reverse().forEach((key) => {
          const el = container.querySelector(':scope > [data-key="' + key + '"]');
          if (el) container.prepend(el);
        });
      };

      ["ko", "en"].forEach((lang) => {
        const h1 = document.querySelector('.hero [data-l="' + lang + '"] h1');
        if (h1 && v.hero && v.hero[lang]) {
          v.hero[lang].forEach((item, i) => {
            const text = typeof item === "string" ? item : item.text;
            let el = h1.querySelectorAll(".line")[i];
            if (!el) {
              el = document.createElement("span");
              el.className = "line minor";
              h1.append(el);
            }
            if (typeof item === "object" && item.small) el.classList.add("minor");
            fill(el, text);
          });
        }
        if (v.footer && v.footer[lang]) {
          document.querySelectorAll('.foot-quote[data-l="' + lang + '"]').forEach((el) => (el.textContent = v.footer[lang]));
        }
        if (v.title && v.title[lang]) root.dataset["title" + cap(lang)] = v.title[lang];
      });
      reorder(document.querySelector("#projects .stack"), v.projects);
      reorder(document.querySelector("#skills .stack"), v.skills);

      // Keep the version while the reader moves between pages, and keep it out of search results.
      document.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (/^(https?:|mailto:|tel:|#)/.test(href)) return;
        const url = new URL(href, location.href);
        url.searchParams.set("c", code);
        a.setAttribute("href", url.pathname + url.search + url.hash);
      });
      const robots = document.createElement("meta");
      robots.name = "robots";
      robots.content = "noindex,nofollow";
      document.head.append(robots);
    } else if (param) {
      try {
        sessionStorage.removeItem("variant");
      } catch (e) {}
    }
  }

  // ---------- language ----------
  const langButtons = document.querySelectorAll("[data-set-lang]");

  function setLang(lang, persist) {
    root.dataset.lang = lang;
    root.lang = lang;
    if (persist) store.set("lang", lang);
    langButtons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.setLang === lang)));
    const title = root.dataset["title" + cap(lang)];
    if (title) document.title = title;
    const desc = document.querySelector('meta[name="description"]');
    const descText = root.dataset["desc" + cap(lang)];
    if (desc && descText) desc.setAttribute("content", descText);
  }

  langButtons.forEach((btn) => btn.addEventListener("click", () => setLang(btn.dataset.setLang, true)));
  setLang(root.dataset.lang || "ko", false);

  // ---------- theme ----------
  const themeBtn = document.querySelector("[data-toggle-theme]");
  const dark = window.matchMedia("(prefers-color-scheme: dark)");

  function isDark() {
    return root.dataset.theme ? root.dataset.theme === "dark" : dark.matches;
  }
  function paintThemeLabel() {
    if (!themeBtn) return;
    themeBtn.querySelectorAll("[data-mode]").forEach((el) => {
      el.hidden = el.dataset.mode !== (isDark() ? "dark" : "light");
    });
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      store.set("theme", next);
      paintThemeLabel();
    });
    dark.addEventListener("change", paintThemeLabel);
    paintThemeLabel();
  }

  // ---------- menu: the pill grows into the menu ----------
  const nav = document.getElementById("nav");
  const menuBtn = nav && nav.querySelector(".menu-btn");
  const menu = document.getElementById("menu");
  if (nav && menuBtn && menu) {
    const setOpen = (open) => {
      nav.toggleAttribute("data-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menu.inert = !open; // keeps the closed menu out of the tab order
    };
    setOpen(false);
    menuBtn.addEventListener("click", () => setOpen(!nav.hasAttribute("data-open")));
    document.addEventListener("click", (e) => {
      if (nav.hasAttribute("data-open") && !nav.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.hasAttribute("data-open")) {
        setOpen(false);
        menuBtn.focus();
      }
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  }

  // "Contact" lives in the fixed footer, so it scrolls to the very bottom instead of jumping to an anchor.
  document.querySelectorAll("[data-scroll-end]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    })
  );

  // ---------- footer reveal ----------
  // The footer is fixed underneath the page. The page's bottom margin has to match its height,
  // and --reveal (0 to 1) tells the CSS how far the page has slid away.
  const footer = document.querySelector(".footer");
  const toc = document.querySelector(".toc");
  let tocLinks = [];
  let tocTargets = [];
  if (toc) {
    tocLinks = [...toc.querySelectorAll('a[href^="#"]')];
    tocTargets = tocLinks.map((a) => document.getElementById(a.getAttribute("href").slice(1)));
  }

  function fitFooter() {
    if (footer) root.style.setProperty("--footer-h", footer.offsetHeight + "px");
  }

  function onScroll() {
    if (footer) {
      const h = footer.offsetHeight;
      const max = root.scrollHeight - window.innerHeight;
      const p = h ? Math.min(1, Math.max(0, (window.scrollY - (max - h)) / h)) : 0;
      root.style.setProperty("--reveal", p.toFixed(3));
    }
    if (tocLinks.length) {
      const line = window.innerHeight * 0.35;
      let current = 0;
      tocTargets.forEach((target, i) => {
        if (target && target.getBoundingClientRect().top <= line) current = i;
      });
      tocLinks.forEach((a, i) => a.setAttribute("aria-current", String(i === current)));
    }
  }

  let ticking = false;
  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      onScroll();
    });
  };

  if (footer) {
    fitFooter();
    if ("ResizeObserver" in window) new ResizeObserver(() => { fitFooter(); schedule(); }).observe(footer);
    document.fonts && document.fonts.ready.then(() => { fitFooter(); schedule(); });
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", () => { fitFooter(); schedule(); });
  onScroll();

  // ---------- GitHub activity ----------
  // One square per day from window.CONTRIBUTIONS (see scripts/update-contributions.py).
  // Only as many weeks as fit the width are drawn, newest last.
  const cal = document.querySelector("[data-cal]");
  const data = window.CONTRIBUTIONS;
  if (cal && data) {
    const start = new Date(data.start + "T00:00:00Z");
    const lead = start.getUTCDay(); // empty squares so the first day lands on its weekday
    const total = lead + data.counts.length;
    const weeks = Math.ceil(total / 7);
    const fmt = (d) => d.toISOString().slice(0, 10).replace(/-/g, ".");

    const draw = () => {
      const cs = getComputedStyle(cal);
      const cell = parseFloat(cs.getPropertyValue("--cell"));
      const gap = parseFloat(cs.getPropertyValue("--gap"));
      const cols = Math.max(1, Math.min(weeks, Math.floor((cal.clientWidth + gap) / (cell + gap))));
      if (cal.dataset.cols === String(cols)) return;
      cal.dataset.cols = String(cols);
      const frag = document.createDocumentFragment();
      for (let i = (weeks - cols) * 7; i < total; i++) {
        const el = document.createElement("i");
        const n = i - lead;
        if (n < 0) {
          el.className = "pad";
        } else {
          const day = new Date(start.getTime() + n * 86400000);
          el.dataset.lv = data.levels[n];
          el.title = fmt(day) + ": " + data.counts[n];
        }
        frag.appendChild(el);
      }
      cal.replaceChildren(frag);
    };
    draw();
    if ("ResizeObserver" in window) new ResizeObserver(draw).observe(cal);

    document.querySelectorAll("[data-cal-total]").forEach((el) => (el.textContent = data.total.toLocaleString("en-US")));
    document.querySelectorAll("[data-cal-date]").forEach((el) => (el.textContent = data.updated.replace(/-/g, ".")));
  }

  // ---------- blog posts ----------
  // Latest posts from window.POSTS (see scripts/update-posts.py). A leading [Category] in a title becomes a tag.
  const blog = window.POSTS;
  const postList = document.querySelector("[data-posts]");
  if (blog && blog.posts.length) {
    const ARROW =
      '<svg class="ext-i" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 11.5l7-7M5.5 4.5h6v6"/></svg>';
    if (postList) {
      const shown = Number(postList.dataset.posts) || 8;
      postList.replaceChildren(
        ...blog.posts.slice(0, shown).map((p) => {
          const m = p.t.match(/^\[([^\]]+)\]\s*(.*)$/);
          const li = document.createElement("li");
          const time = document.createElement("time");
          time.dateTime = p.d;
          time.textContent = p.d.replace(/-/g, ".");
          const main = document.createElement("span");
          main.className = "post-main";
          const a = document.createElement("a");
          a.href = "https://velog.io/@" + blog.login + "/" + encodeURIComponent(p.s);
          a.target = "_blank";
          a.rel = "noopener";
          const title = document.createElement("span");
          title.textContent = m ? m[2] : p.t;
          a.append(title);
          a.insertAdjacentHTML("beforeend", ARROW);
          main.append(a);
          if (m) {
            const tag = document.createElement("span");
            tag.className = "post-tag";
            tag.textContent = m[1];
            main.append(tag);
          }
          li.append(time, main);
          return li;
        })
      );
    }
    const cutoff = new Date(blog.updated + "T00:00:00Z").getTime() - 365 * 86400000;
    const lastYear = blog.posts.filter((p) => new Date(p.d + "T00:00:00Z").getTime() >= cutoff).length;
    const set = (sel, text) => document.querySelectorAll(sel).forEach((el) => (el.textContent = text));
    set("[data-blog-total]", String(blog.total));
    set("[data-blog-year]", String(lastYear));
    set("[data-blog-since]", blog.posts[blog.posts.length - 1].d.slice(0, 7).replace("-", "."));
  }

  // ---------- figures ----------
  // The numbers come from the data files, so they change when the data does. They count up once when seen.
  const figures = document.querySelectorAll("[data-figure]");
  if (figures.length) {
    const value = {};
    if (window.CONTRIBUTIONS) {
      value.days = window.CONTRIBUTIONS.counts.slice(-365).filter((n) => n > 0).length;
      value.contrib = window.CONTRIBUTIONS.total;
    }
    value.projects = document.querySelectorAll("#projects .item[data-key]").length;
    if (window.POSTS) value.posts = window.POSTS.total;

    const show = (el, n) => (el.textContent = Math.round(n).toLocaleString("en-US"));
    const targets = new Map();
    figures.forEach((el) => {
      const shown = parseInt(el.textContent.replace(/,/g, ""), 10) || 0;
      const n = typeof value[el.dataset.figure] === "number" ? value[el.dataset.figure] : shown;
      targets.set(el, n);
      show(el, n);
    });

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!still && "IntersectionObserver" in window) {
      const count = (el) => {
        const end = targets.get(el);
        const t0 = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - t0) / 900);
          show(el, end * (1 - Math.pow(1 - p, 4))); // ease-out, as in the reference
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            io.unobserve(entry.target);
            count(entry.target);
          }),
        { threshold: 0.6 }
      );
      figures.forEach((el) => {
        show(el, 0);
        io.observe(el);
      });
    }
  }

  // ---------- copy email ----------
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const status = document.querySelector("[data-copy-status]");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
      } catch (e) {
        return;
      }
      btn.setAttribute("data-copied", "");
      if (status) status.textContent = root.lang === "ko" ? "복사했습니다" : "Copied";
      setTimeout(() => {
        btn.removeAttribute("data-copied");
        if (status) status.textContent = "";
      }, 1800);
    });
  });
})();
