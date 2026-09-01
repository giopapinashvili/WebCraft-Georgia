/* ==========================================================================
   WebCraft Georgia — app.js
   No dependencies. Progressive enhancement only.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const PHONE_DIAL = "+995555533108";
  const PHONE_WA = "995555533108";
  const PHONE_TEXT = "555 53 31 08";

  /* --------------------------------------------------------- 0. LANGUAGE
     One shared script serves the Georgian, English and Russian pages, so
     every user-facing string lives here and is picked by the page's own
     lang attribute. Adding a language means adding a column below — no
     second copy of this file to keep in sync. */
  const LANG = (() => {
    const l = (document.documentElement.lang || "ka").slice(0, 2).toLowerCase();
    return ["ka", "en", "ru"].includes(l) ? l : "ka";
  })();

  const STRINGS = {
    copied:        { ka: "დაკოპირდა",              en: "Copied",              ru: "Скопировано" },
    numberIs:      { ka: "ნომერი",                 en: "Number",              ru: "Номер" },
    newRequest:    { ka: "ახალი მოთხოვნა — webcraftgeorgia.ge",
                     en: "New enquiry — webcraftgeorgia.ge",
                     ru: "Новая заявка — webcraftgeorgia.ge" },
    fName:         { ka: "სახელი",                 en: "Name",                ru: "Имя" },
    fContact:      { ka: "კონტაქტი",               en: "Contact",             ru: "Контакт" },
    fService:      { ka: "სერვისი",                en: "Service",             ru: "Услуга" },
    fBudget:       { ka: "ბიუჯეტი",                en: "Budget",              ru: "Бюджет" },
    fProject:      { ka: "პროექტი:",               en: "Project:",            ru: "Проект:" },
    errFields:     { ka: "შეავსე მონიშნული ველები.",
                     en: "Please fill in the marked fields.",
                     ru: "Заполните отмеченные поля." },
    okSent:        { ka: "გაიგზავნა. პასუხს 24 საათში მიიღებ.",
                     en: "Sent. You'll get a reply within 24 hours.",
                     ru: "Отправлено. Ответ получите в течение 24 часов." },
    okWhatsApp:    { ka: "WhatsApp გაიხსნა — დააჭირე გაგზავნას.",
                     en: "WhatsApp is open — press send.",
                     ru: "WhatsApp открыт — нажмите «отправить»." },
    errAuto:       { ka: "ავტომატური გაგზავნა ვერ მოხერხდა — WhatsApp გაიხსნა.",
                     en: "Automatic sending failed — WhatsApp is open instead.",
                     ru: "Автоматическая отправка не удалась — открыт WhatsApp." },
    customDesign:  { ka: "ინდივიდუალური დიზაინი",  en: "Custom design",       ru: "Индивидуальный дизайн" },
    calcHello:     { ka: "გამარჯობა! კალკულატორით დავითვალე:",
                     en: "Hello! I worked this out with the calculator:",
                     ru: "Здравствуйте! Я посчитал через калькулятор:" },
    calcTotal:     { ka: "სულ",                    en: "Total",               ru: "Итого" },
    calcTerm:      { ka: "ვადა",                   en: "timeline",            ru: "срок" },
    calcOutro:     { ka: "მაინტერესებს დეტალები.",
                     en: "I'd like to know more.",
                     ru: "Хотел бы узнать подробности." },
    business:      { ka: "ბიზნეს ვებსაიტი",        en: "Business Website",    ru: "Бизнес-сайт" },
    store:         { ka: "ონლაინ მაღაზია",         en: "Online Store",        ru: "Интернет-магазин" },
    addSeo:        { ka: "Advanced SEO & კონტენტი", en: "Advanced SEO & content", ru: "Advanced SEO и контент" },
    addLang:       { ka: "დამატებითი ენა",         en: "Additional language", ru: "Дополнительный язык" },
    addBlog:       { ka: "ბლოგი / სიახლეები",      en: "Blog / news",         ru: "Блог / новости" },
    addBook:       { ka: "ჯავშნის სისტემა",        en: "Booking system",      ru: "Система бронирования" },
    addPay:        { ka: "ონლაინ გადახდა",         en: "Online payment",      ru: "Онлайн-оплата" },
    /* matches the label printed next to the checkbox on the page — the two
       used to disagree, which looked like a bug in the quote the client sends */
    addAdmin:      { ka: "CRM / შიდა სისტემა",     en: "CRM / internal system", ru: "CRM / внутренняя система" },
  };

  const t = (key) => (STRINGS[key] && STRINGS[key][LANG]) || STRINGS[key]?.ka || "";

  /* Russian needs three forms for "day"; English two; Georgian one. Getting
     this wrong is the kind of thing a native speaker notices immediately. */
  const dayWord = (n) => {
    if (LANG === "ka") return "დღე";
    if (LANG === "en") return n === 1 ? "day" : "days";
    const a = Math.abs(n) % 100;
    const b = a % 10;
    if (a > 10 && a < 20) return "дней";
    if (b > 1 && b < 5) return "дня";
    if (b === 1) return "день";
    return "дней";
  };
  /* For ranges like "2-3" the last number governs the form. */
  const days = (n) => `${n} ${dayWord(Number(String(n).split("-").pop()))}`;

  /* ----------------------------------------------------------- 1. HEADER */
  const header = $(".site-header");
  if (header) {
    const onScroll = () => {
      header.dataset.stuck = String(window.scrollY > 8);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------- 2. MOBILE NAV */
  const burger = $(".burger");
  const drawer = $(".drawer");

  const setDrawer = (open) => {
    if (!burger || !drawer) return;
    burger.setAttribute("aria-expanded", String(open));
    drawer.dataset.open = String(open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  burger?.addEventListener("click", () => {
    setDrawer(burger.getAttribute("aria-expanded") !== "true");
  });

  drawer?.addEventListener("click", (e) => {
    if (e.target.closest("a")) setDrawer(false);
  });

  // Drawer accordion
  $$(".drawer-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
    });
  });

  // Desktop dropdown: click/keyboard support (hover handled in CSS)
  $$(".has-menu").forEach((wrap) => {
    const trigger = $(".nav-trigger", wrap);
    const menu = $(".nav-menu", wrap);
    if (!trigger || !menu) return;

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      menu.style.opacity = open ? "" : "1";
      menu.style.visibility = open ? "" : "visible";
      menu.style.translate = open ? "" : "-50% 0";
    });

    wrap.addEventListener("focusout", (e) => {
      if (!wrap.contains(e.relatedTarget)) {
        trigger.setAttribute("aria-expanded", "false");
        menu.removeAttribute("style");
      }
    });
  });

  addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    setDrawer(false);
    setDock(false);
    $$(".has-menu").forEach((w) => {
      $(".nav-trigger", w)?.setAttribute("aria-expanded", "false");
      $(".nav-menu", w)?.removeAttribute("style");
    });
  });

  addEventListener("resize", () => {
    if (innerWidth >= 980) setDrawer(false);
  });

  /* ------------------------------------------------------------- 3. DOCK */
  const dock = $(".dock");
  const dockToggle = $(".dock-toggle");

  function setDock(open) {
    if (!dock || !dockToggle) return;
    dock.dataset.open = String(open);
    dockToggle.setAttribute("aria-expanded", String(open));
  }

  dockToggle?.addEventListener("click", () => {
    setDock(dock.dataset.open !== "true");
  });

  document.addEventListener("click", (e) => {
    if (dock && dock.dataset.open === "true" && !e.target.closest(".dock")) {
      setDock(false);
    }
  });

  /* --------------------------------------------------------- 4. PHONE UI */
  const sheet = $("#phoneSheet");
  const copyNote = $("#copyNote");

  const isTouchPhone = () =>
    matchMedia("(pointer: coarse)").matches && innerWidth < 820;

  async function copyPhone() {
    try {
      if (navigator.clipboard && isSecureContext) {
        await navigator.clipboard.writeText(PHONE_DIAL);
      } else {
        const ta = document.createElement("textarea");
        ta.value = PHONE_DIAL;
        ta.style.cssText = "position:fixed;inset-block-start:-9999px";
        document.body.append(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      if (copyNote) copyNote.textContent = `${t("copied")} — ${PHONE_TEXT}`;
    } catch {
      if (copyNote) copyNote.textContent = `${t("numberIs")}: ${PHONE_TEXT}`;
    }
  }

  $$("[data-phone]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (isTouchPhone()) {
        location.href = `tel:${PHONE_DIAL}`;
        return;
      }
      e.preventDefault();
      if (copyNote) copyNote.textContent = "";
      if (typeof sheet?.showModal === "function") sheet.showModal();
      else copyPhone();
    });
  });

  $("#sheetCopy")?.addEventListener("click", copyPhone);
  $$("[data-close-sheet]").forEach((b) =>
    b.addEventListener("click", () => sheet?.close()),
  );
  sheet?.addEventListener("click", (e) => {
    const box = sheet.getBoundingClientRect();
    const inside =
      e.clientX >= box.left &&
      e.clientX <= box.right &&
      e.clientY >= box.top &&
      e.clientY <= box.bottom;
    if (!inside) sheet.close();
  });

  /* ------------------------------------------------- 5. REVEAL FALLBACK */
  const supportsSDA =
    CSS.supports?.("(animation-timeline: view()) and (animation-range: entry)") ??
    false;

  if (!supportsSDA && !reduced.matches) {
    const targets = $$(".reveal");
    if (targets.length) {
      targets.forEach((el) => (el.dataset.io = "out"));
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.dataset.io = "in";
            io.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
      );
      targets.forEach((el) => io.observe(el));
    }
  }

  /* ----------------------------------------------------- 6. STAT COUNTERS */
  const counters = $$("[data-count]");
  if (counters.length) {
    if (reduced.matches) {
      counters.forEach((el) => (el.textContent = el.dataset.count));
    } else {
      const run = (el) => {
        const target = Number(el.dataset.count);
        if (!Number.isFinite(target)) return;
        const dur = 1100;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            run(entry.target);
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.6 },
      );
      counters.forEach((el) => {
        el.textContent = "0";
        io.observe(el);
      });
    }
  }

  /* ------------------------------------------------------------- 7. FORM */
  const form = $("#briefForm");
  if (form) {
    const status = $("#formStatus");
    const submitBtn = $("#formSubmit");

    const say = (msg, tone) => {
      if (!status) return;
      status.textContent = msg;
      status.dataset.tone = tone;
    };

    const buildMessage = (data) => {
      const lines = [
        t("newRequest"),
        "",
        `${t("fName")}: ${data.name}`,
        `${t("fContact")}: ${data.contact}`,
        data.service ? `${t("fService")}: ${data.service}` : "",
        data.budget ? `${t("fBudget")}: ${data.budget}` : "",
        "",
        t("fProject"),
        data.message,
      ];
      return lines.filter(Boolean).join("\n");
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.reportValidity()) {
        say(t("errFields"), "err");
        return;
      }

      // Honeypot
      if (form.elements.company?.value) return;

      const fd = new FormData(form);
      const data = {
        name: (fd.get("name") || "").toString().trim(),
        contact: (fd.get("contact") || "").toString().trim(),
        service: (fd.get("service") || "").toString(),
        budget: (fd.get("budget") || "").toString(),
        message: (fd.get("message") || "").toString().trim(),
      };

      const endpoint = form.dataset.endpoint;
      submitBtn && (submitBtn.disabled = true);

      try {
        if (endpoint) {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: fd,
          });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          say(t("okSent"), "ok");
        } else {
          const text = encodeURIComponent(buildMessage(data));
          window.open(`https://wa.me/${PHONE_WA}?text=${text}`, "_blank", "noopener");
          say(t("okWhatsApp"), "ok");
        }
      } catch {
        const text = encodeURIComponent(buildMessage(data));
        window.open(`https://wa.me/${PHONE_WA}?text=${text}`, "_blank", "noopener");
        say(t("errAuto"), "err");
      } finally {
        submitBtn && (submitBtn.disabled = false);
      }
    });

    // Prefill service from ?service= or from a data attribute on the page
    const preset =
      new URLSearchParams(location.search).get("service") ||
      document.body.dataset.service;
    if (preset) {
      const select = form.elements.service;
      if (select) {
        const match = [...select.options].find(
          (o) => o.value === preset || o.textContent.trim() === preset,
        );
        if (match) select.value = match.value;
      }
    }
  }

  /* ------------------------------------------------ 7b. PRICE COMPARISON */
  const MARKET = {
    landing: { price: 1500, days: 14, ours: 249, oursDays: days("2-3"), d: 3 },
    business: { price: 5000, days: 30, ours: 999, oursDays: days(7), d: 7 },
    store: { price: 8000, days: 55, ours: 1499, oursDays: days(14), d: 14 },
  };
  const gel = (n) => `${Math.round(n).toLocaleString("en-US")}₾`;

  /* --- value simulator (bar diagram) --- */
  const sim = {
    oldDays: $("#simOldDays"),
    oldPrice: $("#simOldPrice"),
    newDays: $("#simNewDays"),
    newPrice: $("#simNewPrice"),
    oldDaysBar: $("#simOldDaysBar"),
    oldPriceBar: $("#simOldPriceBar"),
    newDaysBar: $("#simNewDaysBar"),
    newPriceBar: $("#simNewPriceBar"),
    save: $("#simSave"),
    saveDays: $("#simSaveDays"),
  };

  if (sim.oldDays) {
    const MIN_BAR = 12; // keep a short bar readable
    const pct = (a, b) => Math.max(MIN_BAR, Math.round((a / b) * 100)) + "%";

    const paintSim = (key) => {
      const m = MARKET[key];
      sim.oldDays.textContent = days(m.days);
      sim.oldPrice.textContent = `${m.price.toLocaleString("en-US")} ₾`;
      sim.newDays.textContent = m.oursDays;
      sim.newPrice.textContent = `${m.ours.toLocaleString("en-US")} ₾`;
      sim.oldDaysBar.style.setProperty("--w", "100%");
      sim.oldPriceBar.style.setProperty("--w", "100%");
      sim.newDaysBar.style.setProperty("--w", pct(m.d, m.days));
      sim.newPriceBar.style.setProperty("--w", pct(m.ours, m.price));
      sim.save.textContent = `+ ${gel(m.price - m.ours)}`;
      sim.saveDays.textContent = days(m.days - m.d);
    };

    $$('input[name="sim"]').forEach((r) =>
      r.addEventListener("change", () => paintSim(r.value)),
    );
    paintSim("landing");
  }

  /* ------------------------------------------------------ 7c. CALCULATOR */
  const calc = $("#calcForm");
  if (calc) {
    const BASE = {
      landing: { price: 249, days: 3, label: "Landing Page" },
      business: { price: 999, days: 7, label: t("business") },
      store: { price: 1499, days: 14, label: t("store") },
    };
    // Only the payment gateway adds real waiting time (bank approval).
    // Everything else is +1 day of work.
    const ADDONS = {
      seo: { label: t("addSeo"), price: 299, days: 1 },
      lang: { label: t("addLang"), pct: 0.4, days: 1 },
      blog: { label: t("addBlog"), price: 199, days: 1 },
      book: { label: t("addBook"), price: 399, days: 1 },
      pay: { label: t("addPay"), price: 499, days: 3 },
      admin: { label: t("addAdmin"), price: 599, days: 1 },
    };

    const out = {
      total: $("#calcTotal"),
      days: $("#calcDays"),
      market: $("#calcMarket"),
      saving: $("#calcSaving"),
      lines: $("#calcLines"),
      cta: $("#calcCta"),
    };

    const recalc = () => {
      const type = calc.elements.ctype.value;
      const base = BASE[type];
      const custom = calc.elements.cdesign.value === "custom";

      let price = base.price;
      let totalDays = base.days;
      const lines = [[base.label, gel(base.price)]];

      if (custom) {
        const add = base.price * 0.4;
        price += add;
        totalDays += 1;
        lines.push([t("customDesign"), `+${gel(add)}`]);
      }

      $$('input[name="addon"]:checked', calc).forEach((cb) => {
        const a = ADDONS[cb.value];
        if (!a) return;
        const add = a.pct ? base.price * a.pct : a.price;
        price += add;
        totalDays += a.days;
        lines.push([a.label, `+${gel(add)}`]);
      });

      const market = MARKET[type].price * (price / base.price);

      out.total.textContent = Math.round(price).toLocaleString("en-US");
      out.days.textContent = days(totalDays);
      out.market.textContent = gel(market);
      out.saving.textContent = gel(market - price);
      out.lines.innerHTML = lines
        .map(
          ([k, v]) =>
            `<li><span>${k}</span><span class="mono">${v}</span></li>`,
        )
        .join("");

      const msg =
        `${t("calcHello")}\n\n` +
        lines.map(([k, v]) => `• ${k} — ${v}`).join("\n") +
        `\n\n${t("calcTotal")}: ${gel(price)} · ${t("calcTerm")} ${days(totalDays)}\n\n${t("calcOutro")}`;
      out.cta.href = `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(msg)}`;
      out.cta.target = "_blank";
      out.cta.rel = "noopener";
    };

    calc.addEventListener("change", recalc);
    calc.addEventListener("submit", (e) => e.preventDefault());
    recalc();
  }

  /* --------------------------------------------------- 7e. PRICING TABS */
  const panes = $$("[data-pane]");
  if (panes.length) {
    const showPane = (name) => {
      panes.forEach((el) => (el.hidden = el.dataset.pane !== name));
    };
    $$('input[name="ptab"]').forEach((r) =>
      r.addEventListener("change", () => showPane(r.value)),
    );
    showPane($('input[name="ptab"]:checked')?.value || "sites");
  }

  /* ------------------------------------------- 7d. POINTER SPOTLIGHT */
  // One rAF-throttled listener writes --mx/--my on the element under the
  // cursor. Dark bands brighten, the bone band darkens (CSS decides).
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    // NOTE: elements whose ::before is already used (.hero grid, .ledger-row
    // accent bar) are deliberately excluded — the spotlight reuses ::before.
    const SPOT =
      ".plan, .why-grid > div, .project, .work-card, .process-step," +
      " .sim-panel, .calc-panel, .calc-out, .care, .callout, .form," +
      " .featurelist > div, .quote-metrics > div, .work-facts > div," +
      " .faq details, .direct a, .direct button, .opt label";

    $$(SPOT).forEach((el) => el.classList.add("spot"));
    $$("section.band").forEach((el) => el.classList.add("spot"));

    let pending = null;
    const paint = () => {
      pending = null;
      const { x, y, targets } = last;
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((x - r.left) / r.width) * 100}%`);
        el.style.setProperty("--my", `${((y - r.top) / r.height) * 100}%`);
      });
    };
    let last = { x: 0, y: 0, targets: [] };

    addEventListener(
      "pointermove",
      (e) => {
        if (e.pointerType !== "mouse") return;
        const card = e.target.closest?.(".spot:not(section)");
        const band = e.target.closest?.("section.band");
        const targets = [];
        if (card) targets.push(card);
        if (band && band !== card) targets.push(band);
        if (!targets.length) return;
        last = { x: e.clientX, y: e.clientY, targets };
        if (!pending) pending = requestAnimationFrame(paint);
      },
      { passive: true },
    );
  }

  /* ------------------------------------------------- 8. CURRENT NAV STATE */
  const here = location.pathname.split("/").pop() || "index.html";
  $$(".nav a[href], .drawer a[href], .nav-menu a[href]").forEach((a) => {
    const target = (a.getAttribute("href") || "").split("#")[0];
    if (target && target === here) a.setAttribute("aria-current", "page");
  });

  /* --------------------------------------------------------- 9. YEAR STAMP */
  $$("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
