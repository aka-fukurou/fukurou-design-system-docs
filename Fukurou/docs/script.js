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

  /* —— Date Picker (WAI-ARIA APG Date Picker Dialog pattern; Figma Component/Date Picker 745:2579) —— */
  (function () {
    const MONTHS = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const WEEKDAYS = [
      ["Su", "Sunday"], ["Mo", "Monday"], ["Tu", "Tuesday"], ["We", "Wednesday"],
      ["Th", "Thursday"], ["Fr", "Friday"], ["Sa", "Saturday"]
    ];
    const ICON_PREV = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z"/></svg>';
    const ICON_NEXT = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"/></svg>';

    const pad2 = (n) => String(n).padStart(2, "0");
    // Local-time construction only: no Date.parse / toISOString, so a day never shifts across time zones.
    function parseISO(str) {
      if (!str) return null;
      const m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(String(str).trim());
      if (!m) return null;
      return new Date(Number(m[1]), Number(m[2]) - 1, m[3] ? Number(m[3]) : 1);
    }
    function parseList(str) {
      return String(str || "").split(",").map(parseISO).filter(Boolean);
    }
    function toISO(d) {
      return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
    }
    function sameDay(a, b) {
      return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }
    function inList(list, d) {
      return list.some((x) => sameDay(x, d));
    }
    function formatDisplay(d) {
      return MONTHS[d.getMonth()].slice(0, 3) + " " + d.getDate() + ", " + d.getFullYear();
    }
    function formatLong(d) {
      return WEEKDAYS[d.getDay()][1] + ", " + MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    }
    function addDays(d, n) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    }
    function addMonths(d, n) {
      const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
      const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
      return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
    }
    function startOfMonth(d) {
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }

    document.querySelectorAll("[data-datepicker]").forEach(function (root, index) {
      const trigger = root.querySelector("[data-datepicker-trigger]");
      const calendar = root.querySelector("[data-datepicker-calendar]");
      const valueEl = root.querySelector("[data-datepicker-value]");
      if (!trigger || !calendar) return;

      const wrap = trigger.closest(".fk-datepicker") || root;
      const isStatic = root.hasAttribute("data-datepicker-static");
      const baseId = calendar.id || "fk-dp-" + index;
      const placeholder = root.dataset.datepickerPlaceholder || "Select date";

      const realToday = new Date();
      realToday.setHours(0, 0, 0, 0);
      const today = parseISO(root.dataset.datepickerToday) || realToday;
      const disabledDates = parseList(root.dataset.datepickerDisabled);
      const unavailableDates = parseList(root.dataset.datepickerUnavailable);

      let selected = parseISO(root.dataset.datepickerSelected);
      let view = parseISO(root.dataset.datepickerView) || startOfMonth(selected || today);
      let focusDate = selected || today;

      /* Build the Calendar Popover once: header (nav + live month), grid table, footer. */
      calendar.innerHTML =
        '<div class="fk-calendar__header">' +
          '<button type="button" class="fk-calendar__nav" data-datepicker-prev aria-label="Previous month">' + ICON_PREV + "</button>" +
          '<h5 class="fk-calendar__month" id="' + baseId + '-month" data-datepicker-month aria-live="polite"></h5>' +
          '<button type="button" class="fk-calendar__nav" data-datepicker-next aria-label="Next month">' + ICON_NEXT + "</button>" +
        "</div>" +
        '<table class="fk-calendar__table" role="grid" aria-labelledby="' + baseId + '-month">' +
          '<thead role="rowgroup"><tr role="row">' +
            WEEKDAYS.map((w) => '<th role="columnheader" scope="col" class="fk-calendar__weekday" aria-label="' + w[1] + '">' + w[0] + "</th>").join("") +
          "</tr></thead>" +
          '<tbody role="rowgroup" data-datepicker-grid></tbody>' +
        "</table>" +
        '<div class="fk-calendar__footer">' +
          '<button type="button" class="fk-calendar__footer-btn" data-datepicker-today>Today</button>' +
          '<button type="button" class="fk-calendar__footer-btn" data-datepicker-clear>Clear</button>' +
        "</div>";

      const monthEl = calendar.querySelector("[data-datepicker-month]");
      const grid = calendar.querySelector("[data-datepicker-grid]");
      const prevBtn = calendar.querySelector("[data-datepicker-prev]");
      const nextBtn = calendar.querySelector("[data-datepicker-next]");
      const todayBtn = calendar.querySelector("[data-datepicker-today]");
      const clearBtn = calendar.querySelector("[data-datepicker-clear]");

      function isDisabledDate(d) {
        return inList(disabledDates, d) || inList(unavailableDates, d);
      }

      function isOpen() {
        return !calendar.hidden;
      }

      function setValue(d) {
        selected = d;
        if (valueEl) {
          valueEl.textContent = d ? formatDisplay(d) : placeholder;
          valueEl.classList.toggle("is-placeholder", !d);
        }
        root.classList.toggle("is-filled", !!d);
      }

      function render() {
        if (monthEl) monthEl.textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();

        const year = view.getFullYear();
        const month = view.getMonth();
        const startPad = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const totalCells = Math.ceil((startPad + daysInMonth) / 7) * 7;

        // Keep the roving tabindex on a day that is visible in this month.
        if (focusDate.getFullYear() !== year || focusDate.getMonth() !== month) {
          focusDate = new Date(year, month, Math.min(focusDate.getDate(), daysInMonth));
        }

        grid.innerHTML = "";
        let row = null;
        for (let i = 0; i < totalCells; i++) {
          if (i % 7 === 0) {
            row = document.createElement("tr");
            row.setAttribute("role", "row");
            grid.appendChild(row);
          }
          const cellDate = new Date(year, month, i - startPad + 1);
          const outside = cellDate.getMonth() !== month;
          const disabled = isDisabledDate(cellDate);
          const td = document.createElement("td");
          td.className = "fk-calendar__day";
          td.setAttribute("role", "gridcell");
          td.textContent = String(cellDate.getDate());
          td.dataset.date = toISO(cellDate);
          td.setAttribute("aria-label", formatLong(cellDate));
          td.setAttribute("aria-selected", sameDay(cellDate, selected) ? "true" : "false");
          td.setAttribute("tabindex", sameDay(cellDate, focusDate) ? "0" : "-1");
          if (outside) td.classList.add("is-outside");
          if (inList(unavailableDates, cellDate)) td.classList.add("is-unavailable");
          if (disabled) td.setAttribute("aria-disabled", "true");
          if (sameDay(cellDate, today)) {
            td.classList.add("is-today");
            td.setAttribute("aria-current", "date");
          }
          row.appendChild(td);
        }
      }

      function focusCell(d) {
        focusDate = d;
        if (d.getFullYear() !== view.getFullYear() || d.getMonth() !== view.getMonth()) {
          view = startOfMonth(d);
        }
        render();
        const cell = grid.querySelector('[data-date="' + toISO(d) + '"]');
        if (cell) cell.focus();
      }

      function position() {
        if (isStatic) return;
        calendar.classList.remove("is-above");
        const rect = trigger.getBoundingClientRect();
        const height = calendar.offsetHeight || 344;
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < height + 2 && rect.top > height + 2) calendar.classList.add("is-above");
      }

      function open(moveFocus) {
        if (trigger.disabled || isOpen()) return;
        view = startOfMonth(selected || today);
        focusDate = selected || today;
        calendar.hidden = false;
        calendar.classList.add("is-open");
        wrap.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        render();
        position();
        if (moveFocus) focusCell(focusDate);
      }

      function close(restoreFocus) {
        if (isStatic || !isOpen()) return;
        calendar.hidden = true;
        calendar.classList.remove("is-open", "is-above");
        wrap.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        if (restoreFocus) trigger.focus();
      }

      function select(d) {
        if (isDisabledDate(d)) return;
        setValue(d);
        if (isStatic) {
          focusCell(d);
          return;
        }
        close(true);
      }

      /* Trigger */
      trigger.addEventListener("click", function () {
        if (isStatic) return;
        if (isOpen()) close(false);
        else open(true);
      });

      trigger.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (isOpen()) focusCell(focusDate);
          else open(true);
        }
      });

      /* Day grid: pointer */
      grid.addEventListener("click", function (e) {
        const td = e.target.closest("td[data-date]");
        if (!td) return;
        const d = parseISO(td.dataset.date);
        if (!d || td.getAttribute("aria-disabled") === "true") return;
        select(d);
      });

      /* Dialog keyboard model */
      calendar.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          e.preventDefault();
          if (isStatic) {
            trigger.focus();
          } else {
            close(true);
          }
          return;
        }

        if (e.key === "Tab") {
          const activeDay = grid.querySelector('td[tabindex="0"]');
          const order = [prevBtn, nextBtn, activeDay, todayBtn, clearBtn].filter(Boolean);
          const i = order.indexOf(document.activeElement);
          if (i === -1) return;
          let next = i + (e.shiftKey ? -1 : 1);
          if (next < 0) next = order.length - 1;
          if (next >= order.length) next = 0;
          e.preventDefault();
          order[next].focus();
          return;
        }

        const td = e.target.closest && e.target.closest("td[data-date]");
        if (!td) return;
        const current = parseISO(td.dataset.date);
        if (!current) return;
        let target = null;
        switch (e.key) {
          case "ArrowRight": target = addDays(current, 1); break;
          case "ArrowLeft": target = addDays(current, -1); break;
          case "ArrowDown": target = addDays(current, 7); break;
          case "ArrowUp": target = addDays(current, -7); break;
          case "Home": target = addDays(current, -current.getDay()); break;
          case "End": target = addDays(current, 6 - current.getDay()); break;
          case "PageUp": target = e.shiftKey ? addMonths(current, -12) : addMonths(current, -1); break;
          case "PageDown": target = e.shiftKey ? addMonths(current, 12) : addMonths(current, 1); break;
          case "Enter":
          case " ":
            e.preventDefault();
            select(current);
            return;
          default:
            return;
        }
        e.preventDefault();
        focusCell(target);
      });

      /* Month navigation */
      prevBtn.addEventListener("click", function () {
        view = addMonths(view, -1);
        render();
      });
      nextBtn.addEventListener("click", function () {
        view = addMonths(view, 1);
        render();
      });

      /* Footer */
      todayBtn.addEventListener("click", function () {
        select(today);
      });
      clearBtn.addEventListener("click", function () {
        setValue(null);
        render();
      });

      /* Dismissal */
      document.addEventListener("pointerdown", function (e) {
        if (!isStatic && isOpen() && !root.contains(e.target)) close(false);
      });
      window.addEventListener("resize", function () {
        if (isOpen()) position();
      });

      /* Initial state */
      setValue(selected);
      render();
      if (isStatic) {
        calendar.hidden = false;
        calendar.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  })();

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
