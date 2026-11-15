(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Lightweight YouTube embeds (load iframe on click) ---------- */
  function fmt(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  document.querySelectorAll(".video[data-yt]").forEach(function (el) {
    var id = el.dataset.yt;
    var start = parseInt(el.dataset.start || "0", 10);
    var title = el.dataset.title || "YouTube video";
    el.style.backgroundImage = "url('https://i.ytimg.com/vi/" + id + "/hqdefault.jpg')";

    var btn = document.createElement("button");
    btn.className = "play";
    btn.setAttribute("aria-label", "Play: " + title);
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    el.appendChild(btn);

    var badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = start ? "360° · from " + fmt(start) : "360°";
    el.appendChild(badge);

    el.addEventListener("click", function () {
      if (el.classList.contains("loaded")) return;
      var params = "autoplay=1&rel=0&playsinline=1" + (start ? "&start=" + start : "");
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + id + "?" + params;
      iframe.title = title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      el.innerHTML = "";
      el.appendChild(iframe);
      el.classList.add("loaded");
    });
  });

  /* ---------- Location numbers + search ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".loc-list li"));
  items.forEach(function (li) {
    var a = li.querySelector("a");
    a.dataset.n = li.getAttribute("value");
    a.dataset.label = a.textContent;
  });

  var input = document.getElementById("loc-search");
  var noResults = document.querySelector(".no-results");
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }
  input.addEventListener("input", function () {
    var q = norm(input.value.trim());
    var any = false;
    items.forEach(function (li) {
      var a = li.querySelector("a");
      var label = a.dataset.label;
      var idx = q ? norm(label).indexOf(q) : -1;
      var match = !q || idx !== -1 || li.getAttribute("value") === q;
      li.classList.toggle("hidden", !match);
      if (match) any = true;
      if (q && idx !== -1) {
        a.innerHTML = escapeHtml(label.slice(0, idx)) + "<mark>" + escapeHtml(label.slice(idx, idx + q.length)) + "</mark>" + escapeHtml(label.slice(idx + q.length));
      } else {
        a.textContent = label;
      }
    });
    document.querySelectorAll(".leg").forEach(function (leg) {
      leg.classList.toggle("hidden", !leg.querySelector("li:not(.hidden)"));
    });
    noResults.hidden = any;
  });

  /* ---------- Active nav link on scroll ---------- */
  var links = {};
  document.querySelectorAll(".nav-links a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.toggle("active", k === e.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });

    /* Reveal-on-scroll */
    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); rev.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".intro-card, .photo, .section-head, .leg, .video-card, .video.featured, .chips, .note").forEach(function (el) {
      el.classList.add("reveal");
      rev.observe(el);
    });
  }
})();
