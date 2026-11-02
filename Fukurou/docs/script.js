/* Fukurou docs — theme toggle, nav, interactive component demos */
(function () {
  "use strict";

  const STORAGE_KEY = "fukurou-docs-theme";
  const root = document.documentElement;

  /* —— Theme —— */
  function getStoredTheme() {
    try {
      const t = localStorage.getItem(STORAGE_KEY);
      if (t === "light" || t === "dark") return t;
    } catch (_) {}
    return "light";
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {}
    document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
      const pressed = btn.getAttribute("data-theme-btn") === theme;
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    });
  }

  setTheme(getStoredTheme());

  document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTheme(btn.getAttribute("data-theme-btn"));
    });
  });

  /* —— Mobile nav —— */
  const body = document.body;
  const toggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".doc-sidebar");
  const links = Array.from(document.querySelectorAll(".doc-sidebar a[href^='#']"));

  if (toggle && sidebar) {
    toggle.addEventListener("click", function () {
      const open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
      if (!body.classList.contains("nav-open")) return;
      if (sidebar.contains(e.target) || toggle.contains(e.target)) return;
      body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("nav-open")) {
        body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      body.classList.remove("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  const sections = links
    .map(function (link) {
      const id = link.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  function setActive() {
    const y = window.scrollY + 96;
    let current = sections[0];
    for (const item of sections) {
      if (item.el.offsetTop <= y) current = item;
    }
    links.forEach(function (l) {
      l.classList.remove("is-active");
    });
    if (current) current.link.classList.add("is-active");
  }

  setActive();
  window.addEventListener("scroll", setActive, { passive: true });

  /* —— Search clear —— */
  document.querySelectorAll("[data-search]").forEach(function (field) {
    const input = field.querySelector("input");
    const clear = field.querySelector("[data-search-clear]");
    if (!input || !clear) return;

    function sync() {
      const has = input.value.length > 0;
      clear.classList.toggle("is-visible", has);
    }

    input.addEventListener("input", sync);
    clear.addEventListener("click", function () {
      input.value = "";
      sync();
      input.focus();
    });
    sync();
  });

  /* —— Input modality (keyboard vs pointer) for Focus Visible gating ——
     Browsers match :focus-visible on text inputs even after a mouse click. Track the last
     interaction so the Text Field shell ring only appears for keyboard-driven focus. */
  (function trackFocusModality() {
    const root = document.documentElement;
    function setPointer() {
      root.setAttribute("data-focus-modality", "pointer");
    }
    function setKeyboard(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      const typing =
        t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      // Typing inside a field is not focus navigation; only Tab/Escape count there.
      if (typing && e.key !== "Tab" && e.key !== "Escape") return;
      root.setAttribute("data-focus-modality", "keyboard");
    }
    window.addEventListener("pointerdown", setPointer, true);
    window.addEventListener("mousedown", setPointer, true);
    window.addEventListener("touchstart", setPointer, { capture: true, passive: true });
    window.addEventListener("keydown", setKeyboard, true);
  })();

  /* —— Text Field cancel (Active state) —— */
  document.querySelectorAll("[data-clearable]").forEach(function (field) {
    const input = field.querySelector("input");
    const clear = field.querySelector("[data-clear]");
    if (!input || !clear) return;
    clear.addEventListener("click", function () {
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    });
  });

  /* —— Switch —— */
  document.querySelectorAll("[data-switch]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.disabled) return;
      const on = btn.getAttribute("aria-checked") === "true";
      btn.setAttribute("aria-checked", on ? "false" : "true");
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  /* —— Jumbo select (radio group) —— */
  document.querySelectorAll("[data-jumbo-group]").forEach(function (group) {
    const items = Array.from(group.querySelectorAll("[data-jumbo]"));
    items.forEach(function (item) {
      item.addEventListener("click", function () {
        items.forEach(function (el) {
          el.setAttribute("aria-checked", "false");
        });
        item.setAttribute("aria-checked", "true");
      });
    });
  });

  /* —— Pagination —— */
  document.querySelectorAll("[data-pagination]").forEach(function (nav) {
    const pages = Array.from(nav.querySelectorAll("[data-page]"));
    const prev = nav.querySelector("[data-page-prev]");
    const next = nav.querySelector("[data-page-next]");
    const pageNums = pages
      .map(function (b) {
        return Number(b.getAttribute("data-page"));
      })
      .filter(function (n) {
        return !Number.isNaN(n);
      });
    const max = Math.max.apply(null, pageNums);
    let current = Number(nav.getAttribute("data-current") || "1");

    function render() {
      pages.forEach(function (btn) {
        const n = Number(btn.getAttribute("data-page"));
        const active = n === current;
        btn.classList.toggle("is-active", active);
        if (active) btn.setAttribute("aria-current", "page");
        else btn.removeAttribute("aria-current");
      });
      if (prev) prev.disabled = current <= 1;
      if (next) next.disabled = current >= max;
      nav.setAttribute("data-current", String(current));
    }

    pages.forEach(function (btn) {
      btn.addEventListener("click", function () {
        current = Number(btn.getAttribute("data-page"));
        render();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        if (current > 1) {
          current -= 1;
          render();
        }
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        if (current < max) {
          current += 1;
          render();
        }
      });
    }
    render();
  });

  /* —— Snackbar —— */
  document.querySelectorAll("[data-snackbar-demo]").forEach(function (demo) {
    const snackbar = demo.querySelector("[data-snackbar]");
    const showBtn = demo.querySelector("[data-snackbar-show]");
    const closeBtn = demo.querySelector("[data-snackbar-close]");
    const actionBtn = demo.querySelector("[data-snackbar-action]");

    function hide() {
      if (snackbar) snackbar.hidden = true;
    }
    function show() {
      if (snackbar) snackbar.hidden = false;
    }

    if (showBtn) showBtn.addEventListener("click", show);
    if (closeBtn) closeBtn.addEventListener("click", hide);
    if (actionBtn) {
      actionBtn.addEventListener("click", function () {
        hide();
      });
    }
  });

  /* —— Alert dismiss —— */
  document.querySelectorAll("[data-alert]").forEach(function (alert) {
    const close = alert.querySelector("[data-alert-close]");
    if (!close) return;
    close.addEventListener("click", function () {
      alert.hidden = true;
    });
  });

  document.querySelectorAll("[data-alert-reset]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = btn.getAttribute("data-alert-reset");
      const alert = document.getElementById(id);
      if (alert) alert.hidden = false;
    });
  });

  /* —— Modal —— */
  const backdrop = document.querySelector("[data-modal-backdrop]");
  const modal = document.querySelector("[data-modal]");
  const openBtns = document.querySelectorAll("[data-modal-open]");
  const closeBtns = document.querySelectorAll("[data-modal-close]");
  let lastFocus = null;

  function openModal() {
    if (!backdrop || !modal) return;
    lastFocus = document.activeElement;
    backdrop.hidden = false;
    body.classList.add("modal-open");
    const focusTarget = modal.querySelector("[data-modal-close]") || modal;
    focusTarget.focus();
  }

  function closeModal() {
    if (!backdrop) return;
    backdrop.hidden = true;
    body.classList.remove("modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });
  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });
  if (backdrop) {
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && backdrop && !backdrop.hidden) {
      closeModal();
    }
  });

  /* —— Dropdown (single-select listbox) ——
     Trigger: button[aria-haspopup=listbox]. Menu: ul[role=listbox][tabindex=-1] with li[role=option].
     Focus moves into the listbox while open; aria-activedescendant tracks the active option. */
  document.querySelectorAll("[data-dropdown]").forEach(function (dd) {
    const trigger = dd.querySelector("[data-dropdown-trigger]");
    const menu = dd.querySelector("[data-dropdown-menu]");
    const valueEl = dd.querySelector("[data-dropdown-value]");
    const options = Array.from(dd.querySelectorAll("[data-dropdown-option]"));
    if (!trigger || !menu || options.length === 0) return;

    let activeIndex = -1;

    function isEnabled(opt) {
      return opt.getAttribute("aria-disabled") !== "true";
    }

    function isOpen() {
      return menu.classList.contains("is-open");
    }

    function setActive(index) {
      options.forEach(function (o, i) {
        o.classList.toggle("is-active", i === index);
      });
      activeIndex = index;
      if (index >= 0) {
        menu.setAttribute("aria-activedescendant", options[index].id);
        if (typeof options[index].scrollIntoView === "function") {
          options[index].scrollIntoView({ block: "nearest" });
        }
      } else {
        menu.removeAttribute("aria-activedescendant");
      }
    }

    function moveActive(delta) {
      const n = options.length;
      let i = activeIndex;
      for (let step = 0; step < n; step += 1) {
        i = (i + delta + n) % n;
        if (isEnabled(options[i])) {
          setActive(i);
          return;
        }
      }
    }

    function firstEnabled(fromEnd) {
      const list = fromEnd ? options.slice().reverse() : options;
      const found = list.find(isEnabled);
      return found ? options.indexOf(found) : -1;
    }

    function close(returnFocus) {
      if (!isOpen()) return;
      menu.classList.remove("is-open");
      dd.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      setActive(-1);
      if (returnFocus) trigger.focus();
    }

    function open() {
      if (trigger.disabled || isOpen()) return;
      menu.classList.add("is-open");
      dd.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      const selected = options.findIndex(function (o) {
        return o.getAttribute("aria-selected") === "true";
      });
      setActive(selected >= 0 ? selected : firstEnabled(false));
      menu.focus({ preventScroll: true });
    }

    function select(index) {
      const opt = options[index];
      if (!opt || !isEnabled(opt)) return;
      options.forEach(function (o) {
        o.setAttribute("aria-selected", "false");
      });
      opt.setAttribute("aria-selected", "true");
      if (valueEl) {
        valueEl.textContent = opt.getAttribute("data-dropdown-option");
        valueEl.classList.remove("is-placeholder");
      }
      close(true);
    }

    trigger.addEventListener("click", function () {
      if (isOpen()) close(false);
      else open();
    });

    trigger.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        open();
      }
    });

    menu.addEventListener("keydown", function (e) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          moveActive(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          moveActive(-1);
          break;
        case "Home":
          e.preventDefault();
          setActive(firstEnabled(false));
          break;
        case "End":
          e.preventDefault();
          setActive(firstEnabled(true));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          select(activeIndex);
          break;
        case "Escape":
          e.preventDefault();
          close(true);
          break;
        case "Tab":
          close(false);
          break;
        default:
          break;
      }
    });

    options.forEach(function (opt, i) {
      opt.addEventListener("mousemove", function () {
        if (isEnabled(opt) && activeIndex !== i) setActive(i);
      });
      opt.addEventListener("click", function () {
        select(i);
      });
    });

    menu.addEventListener("focusout", function (e) {
      if (!dd.contains(e.relatedTarget)) close(false);
    });

    document.addEventListener("pointerdown", function (e) {
      if (!dd.contains(e.target)) close(false);
    });
  });

  /* —— Date Picker —— */
  document.querySelectorAll("[data-datepicker]").forEach(function (root) {
    const trigger = root.querySelector("[data-datepicker-trigger]");
    const calendar = root.querySelector("[data-datepicker-calendar]");
    const valueEl = root.querySelector("[data-datepicker-value]");
    const monthEl = root.querySelector("[data-datepicker-month]");
    const grid = root.querySelector("[data-datepicker-grid]");
    const prevBtn = root.querySelector("[data-datepicker-prev]");
    const nextBtn = root.querySelector("[data-datepicker-next]");
    const todayBtn = root.querySelector("[data-datepicker-today]");
    const clearBtn = root.querySelector("[data-datepicker-clear]");
    if (!trigger || !calendar || !grid) return;

    // Static demo dates mirror the Figma Calendar Popover example (July 2026).
    const demoToday = new Date(2026, 6, 26);
    const demoDisabled = [new Date(2026, 6, 28)];
    const demoUnavailable = [new Date(2026, 5, 30)];
    let view = new Date(2026, 6, 1);
    let selected = null;

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    function formatDisplay(d) {
      return monthNames[d.getMonth()].slice(0, 3) + " " + d.getDate() + ", " + d.getFullYear();
    }

    function sameDay(a, b) {
      return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    function inList(list, d) {
      return list.some(function (x) { return sameDay(x, d); });
    }

    function close() {
      calendar.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    function open() {
      calendar.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      render();
    }

    function render() {
      const year = view.getFullYear();
      const month = view.getMonth();
      if (monthEl) monthEl.textContent = monthNames[month] + " " + year;

      const first = new Date(year, month, 1);
      const startPad = first.getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const prevDays = new Date(year, month, 0).getDate();
      const today = demoToday;

      grid.innerHTML = "";
      const total = Math.ceil((startPad + daysInMonth) / 7) * 7;
      for (let i = 0; i < total; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fk-calendar__day";

        let dayNum;
        let cellDate;
        let outside = false;

        if (i < startPad) {
          dayNum = prevDays - startPad + i + 1;
          cellDate = new Date(year, month - 1, dayNum);
          outside = true;
        } else if (i >= startPad + daysInMonth) {
          dayNum = i - startPad - daysInMonth + 1;
          cellDate = new Date(year, month + 1, dayNum);
          outside = true;
        } else {
          dayNum = i - startPad + 1;
          cellDate = new Date(year, month, dayNum);
        }

        btn.textContent = String(dayNum);
        btn.setAttribute("role", "gridcell");
        btn.setAttribute("aria-label", formatDisplay(cellDate));

        if (outside) btn.classList.add("is-outside");
        if (sameDay(cellDate, today)) {
          btn.classList.add("is-today");
          btn.setAttribute("aria-current", "date");
        }
        if (inList(demoUnavailable, cellDate)) {
          btn.classList.add("is-unavailable");
          btn.disabled = true;
        }
        if (inList(demoDisabled, cellDate)) {
          btn.disabled = true;
        }

        btn.setAttribute("aria-selected", sameDay(cellDate, selected) ? "true" : "false");

        btn.addEventListener("click", function () {
          selected = cellDate;
          if (valueEl) {
            valueEl.textContent = formatDisplay(selected);
            valueEl.classList.remove("is-placeholder");
          }
          close();
          trigger.focus();
        });

        grid.appendChild(btn);
      }
    }

    trigger.addEventListener("click", function () {
      if (calendar.hidden) open();
      else close();
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
        render();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
        render();
      });
    }
    if (todayBtn) {
      todayBtn.addEventListener("click", function () {
        const t = demoToday;
        selected = t;
        view = new Date(t.getFullYear(), t.getMonth(), 1);
        if (valueEl) {
          valueEl.textContent = formatDisplay(selected);
          valueEl.classList.remove("is-placeholder");
        }
        render();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        selected = null;
        if (valueEl) {
          valueEl.textContent = "Select date";
          valueEl.classList.add("is-placeholder");
        }
        render();
      });
    }

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !calendar.hidden) {
        close();
        trigger.focus();
      }
    });

    render();
  });

  /* —— Progress slider —— */
  document.querySelectorAll("[data-progress-demo]").forEach(function (demo) {
    const range = demo.querySelector("[data-progress-range]");
    const fill = demo.querySelector("[data-progress-fill]");
    const bar = demo.querySelector("[role='progressbar']");
    const label = demo.querySelector("[data-progress-label]");
    if (!range || !fill) return;

    function sync() {
      const v = Number(range.value);
      fill.style.width = v + "%";
      if (bar) bar.setAttribute("aria-valuenow", String(v));
      if (label) label.textContent = v + "% complete";
    }

    range.addEventListener("input", sync);
    sync();
  });
})();
