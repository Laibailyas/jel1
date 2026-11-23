const nav = document.querySelector("#main-nav");
const menuToggle = document.querySelector("#menu-toggle");
const searchToggle = document.querySelector("#search-toggle");
const searchPanel = document.querySelector("#search-panel");

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  nav.classList.toggle("open", open);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.querySelectorAll(".nav-entry").forEach((entry) => {
    entry.classList.remove("is-open");
    entry.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}));

const dropdownEntries = [...nav.querySelectorAll(".nav-entry")];
function closeDropdowns(except = null) {
  dropdownEntries.forEach((entry) => {
    if (entry === except) return;
    entry.classList.remove("is-open");
    entry.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
}
dropdownEntries.forEach((entry) => {
  const trigger = entry.querySelector(".nav-dropdown-toggle");
  trigger.addEventListener("click", () => {
    const open = !entry.classList.contains("is-open");
    closeDropdowns(entry);
    entry.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
  });
});
document.addEventListener("click", (event) => {
  if (!nav.contains(event.target)) closeDropdowns();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openEntry = dropdownEntries.find((entry) => entry.classList.contains("is-open"));
  const menuWasOpen = nav.classList.contains("open");
  if (!openEntry && !menuWasOpen) return;
  closeDropdowns();
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  if (openEntry) openEntry.querySelector(".nav-dropdown-toggle")?.focus();
  else menuToggle.focus();
});

searchToggle.addEventListener("click", () => {
  const open = searchToggle.getAttribute("aria-expanded") !== "true";
  searchToggle.setAttribute("aria-expanded", String(open));
  searchToggle.setAttribute("aria-label", open ? "Close search" : "Open search");
  searchPanel.hidden = !open;
  if (open) document.querySelector("#site-search").focus();
});

searchPanel.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.querySelector("#site-search").value.trim().toLowerCase();
  if (!query) return;
  const target = [...document.querySelectorAll("main section")].find((section) => section.textContent.toLowerCase().includes(query));
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    searchPanel.hidden = true;
    searchToggle.setAttribute("aria-expanded", "false");
  } else {
    document.querySelector("#site-search").setCustomValidity("No matching section found. Try “flavour”, “fibre” or “routine”.");
    document.querySelector("#site-search").reportValidity();
    document.querySelector("#site-search").setCustomValidity("");
  }
});

const waitlistForm = document.querySelector("#waitlist-form");
if (waitlistForm) {
  waitlistForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#waitlist-email").value.trim();
    if (!email) return;
    const subject = encodeURIComponent("JEL1 Gut & Glow early access");
    const body = encodeURIComponent(`Please add me to the JEL1 Gut & Glow early-access list.\n\nMy email address: ${email}`);
    document.querySelector("#waitlist-note").textContent = "Your email app is opening to finish your request.";
    window.location.href = `mailto:contact@jel1.com?subject=${subject}&body=${body}`;
  });
}

const entranceItems = [...document.querySelectorAll(
  ".intro-copy,.stats article,.section-heading,.formula-world-stage,.ingredient-card,.table-scroll,.flavour-card,.protocol-panel,.audience-copy,.expert-heading,.research-panel,.journal-card,.contact-card,.footer-top,.footer-brand"
)];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  entranceItems.forEach((el, index) => {
    el.classList.add("reveal");
    el.style.setProperty("--reveal-delay", `${(index % 5) * 65}ms`);
    observer.observe(el);
  });
} else {
  entranceItems.forEach((el) => el.classList.add("visible"));
}

const flavourTrack = document.querySelector("#flavour-track");
if (flavourTrack) {
  const previous = document.querySelector("#flavour-prev");
  const next = document.querySelector("#flavour-next");
  const updateFlavourArrows = () => {
    previous.hidden = flavourTrack.scrollLeft <= 2;
    next.hidden = flavourTrack.scrollLeft + flavourTrack.clientWidth >= flavourTrack.scrollWidth - 3;
  };
  const scrollFlavours = (direction) => {
    const card = flavourTrack.querySelector(".flavour-card");
    const gap = parseFloat(getComputedStyle(flavourTrack).columnGap) || 0;
    flavourTrack.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };
  previous.addEventListener("click", () => scrollFlavours(-1));
  next.addEventListener("click", () => scrollFlavours(1));
  flavourTrack.addEventListener("scroll", () => requestAnimationFrame(updateFlavourArrows), { passive: true });
  window.addEventListener("resize", updateFlavourArrows);
  updateFlavourArrows();
}

const journalTrack = document.querySelector("#journal-track");
if (journalTrack) {
  const previous = document.querySelector("#journal-prev");
  const next = document.querySelector("#journal-next");
  const updateJournalArrows = () => {
    previous.hidden = journalTrack.scrollLeft <= 2;
    next.hidden = journalTrack.scrollLeft + journalTrack.clientWidth >= journalTrack.scrollWidth - 3;
  };
  const scrollArticles = (direction) => {
    const card = journalTrack.querySelector(".journal-card");
    const gap = parseFloat(getComputedStyle(journalTrack).columnGap) || 0;
    journalTrack.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };
  previous.addEventListener("click", () => scrollArticles(-1));
  next.addEventListener("click", () => scrollArticles(1));
  journalTrack.addEventListener("scroll", () => requestAnimationFrame(updateJournalArrows), { passive: true });
  window.addEventListener("resize", updateJournalArrows);
  updateJournalArrows();
}

const audienceSection = document.querySelector("#audience");
const audienceColumns = Array.from(audienceSection?.querySelectorAll(".audience-column") || []);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let audienceFrame = 0;
if (audienceSection && audienceColumns.length) {
  audienceColumns.forEach((column) => {
    const track = column.querySelector(".audience-column-track");
    if (!track || track.dataset.looped === "true") return;
    Array.from(track.children).forEach((tile) => {
      const duplicate = tile.cloneNode(true);
      duplicate.setAttribute("aria-hidden", "true");
      duplicate.querySelectorAll("img").forEach((image) => image.setAttribute("alt", ""));
      track.appendChild(duplicate);
    });
    track.dataset.looped = "true";
  });
  const audienceTravel = (track) => {
    const firstDuplicate = track?.children[3];
    if (!firstDuplicate) return 0;
    return Math.max(0, firstDuplicate.getBoundingClientRect().top - track.getBoundingClientRect().top);
  };
  const updateAudiencePin = () => {
    const mobileLayout = window.matchMedia("(max-width: 680px)").matches;
    if (mobileLayout || reducedMotion.matches) {
      audienceSection.classList.remove("is-pinned");
      audienceSection.style.height = "";
      audienceColumns.forEach((column) => {
        const track = column.querySelector(".audience-column-track");
        if (track) track.style.transform = "";
      });
      return;
    }
    const travel = Math.max(...audienceColumns.map((column) => audienceTravel(column.querySelector(".audience-column-track"))));
    if (travel < 24) {
      audienceSection.classList.remove("is-pinned");
      audienceSection.style.height = "";
      audienceColumns.forEach((column) => {
        const track = column.querySelector(".audience-column-track");
        if (track) track.style.transform = "";
      });
      return;
    }
    audienceSection.classList.add("is-pinned");
    audienceSection.style.height = `${window.innerHeight + travel}px`;
    updateAudiencePosition();
  };
  const updateAudiencePosition = () => {
    if (!audienceSection.classList.contains("is-pinned")) return;
    const range = audienceSection.offsetHeight - window.innerHeight;
    const sectionTop = window.scrollY + audienceSection.getBoundingClientRect().top;
    const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / Math.max(1, range)));
    audienceColumns.forEach((column) => {
      const track = column.querySelector(".audience-column-track");
      if (!track) return;
      const travel = audienceTravel(track);
      const direction = column.dataset.direction === "down" ? 1 : -1;
      const offset = direction > 0 ? -travel + travel * progress : -travel * progress;
      track.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };
  const requestAudiencePosition = () => {
    if (audienceFrame) return;
    audienceFrame = requestAnimationFrame(() => {
      audienceFrame = 0;
      updateAudiencePosition();
    });
  };
  window.addEventListener("scroll", requestAudiencePosition, { passive: true });
  window.addEventListener("resize", updateAudiencePin);
  reducedMotion.addEventListener?.("change", updateAudiencePin);
  document.fonts?.ready.then(updateAudiencePin);
  updateAudiencePin();
}

const expertTrack = document.querySelector("#expert-track");
if (expertTrack) {
  const previous = document.querySelector(".expert-prev");
  const next = document.querySelector(".expert-next");
  const cards = [...expertTrack.querySelectorAll(".expert-card")];
  let activeIndex = 0;
  let resizeFrame = 0;
  let pointerStart = null;
  const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  const placeReviewsOnOrbit = () => {
    // offsetWidth excludes the card's current transform scale. Using a transformed
    // bounding box here made the whole orbit contract as the first card moved outward.
    const cardWidth = cards[0]?.offsetWidth || 320;
    const isSmall = window.matchMedia("(max-width: 680px)").matches;
    const isMedium = window.matchMedia("(max-width: 1024px)").matches;
    const xPositions = isSmall
      ? [0, 0.66, 1.22]
      : [0, 0.5, 0.94, 1.34, 1.72];
    const yPositions = isSmall ? [0, 25, 70] : [0, 34, 80, 132, 182];
    const scales = isSmall ? [1, 0.88, 0.72] : [1, 0.96, 0.84, 0.72, 0.58];
    const opacities = isSmall ? [1, 0.9, 0.7] : [1, 0.98, 0.94, 0.84, 0.68];
    const blurs = isSmall ? [0, 0.15, 0.55] : [0, 0, 0.15, 0.4, 0.75];
    const maxDistance = isSmall ? 2 : isMedium ? 3 : 4;

    cards.forEach((card, index) => {
      let offset = (index - activeIndex + cards.length) % cards.length;
      if (offset >= cards.length / 2) offset -= cards.length;
      const distance = Math.abs(offset);
      const direction = Math.sign(offset);
      const slot = Math.min(distance, maxDistance);
      const hidden = distance > maxDistance;
      const xSlot = xPositions[slot] ?? xPositions[xPositions.length - 1];
      const x = direction * cardWidth * (xSlot + (hidden ? 0.36 : 0));

      card.style.setProperty("--orbit-x", `${x}px`);
      card.style.setProperty("--orbit-y", `${yPositions[slot]}px`);
      card.style.setProperty("--orbit-scale", String(hidden ? scales[slot] * 0.88 : scales[slot]));
      card.style.setProperty("--orbit-opacity", String(hidden ? 0 : opacities[slot]));
      card.style.setProperty("--orbit-blur", `${hidden ? 1.2 : blurs[slot]}px`);
      card.style.setProperty("--orbit-z", String(10 - distance));
      card.setAttribute("aria-hidden", String(hidden));
      card.dataset.orbitSlot = hidden ? (direction < 0 ? "left" : "right") : String(offset);
    });
  };

  const moveReviews = (direction) => {
    activeIndex = (activeIndex + direction + cards.length) % cards.length;
    placeReviewsOnOrbit();
  };

  previous.removeAttribute("disabled");
  next.removeAttribute("disabled");
  previous.addEventListener("click", () => moveReviews(-1));
  next.addEventListener("click", () => moveReviews(1));
  expertTrack.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveReviews(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  expertTrack.addEventListener("pointerdown", (event) => {
    pointerStart = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  expertTrack.addEventListener("pointerup", (event) => {
    if (!pointerStart) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      moveReviews(deltaX < 0 ? 1 : -1);
    }
  }, { passive: true });
  expertTrack.addEventListener("pointercancel", () => { pointerStart = null; }, { passive: true });
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(placeReviewsOnOrbit);
  });
  reducedMotionPreference.addEventListener?.("change", placeReviewsOnOrbit);
  placeReviewsOnOrbit();
}

const expertFeature = document.querySelector("#expert-insights");
if (expertFeature) {
  const gallery = expertFeature.querySelector(".expert-feature-gallery");
  const photos = [...(gallery?.querySelectorAll(".expert-feature-image") || [])];
  const quote = expertFeature.querySelector("#expert-feature-quote");
  const pages = [...expertFeature.querySelectorAll(".expert-feature-page")];
  const previous = expertFeature.querySelector(".expert-feature-prev");
  const next = expertFeature.querySelector(".expert-feature-next");
  const quoteLines = [
    "Nutrition support works best when it fits real life.",
    "Food belongs in a varied diet, not a rigid routine.",
    "Small habits are easier to return to when they feel manageable.",
    "Thoughtful nutrition advice leaves room for individual needs.",
    "A simple routine can make everyday choices feel more achievable."
  ];
  let activeIndex = 0;
  let pointerStart = null;

  const renderExpertFeature = () => {
    photos.forEach((photo, index) => {
      let offset = (index - activeIndex + photos.length) % photos.length;
      if (offset > photos.length / 2) offset -= photos.length;
      const oldPosition = photo.dataset.position;
      const newPosition = offset === 0 ? "center" : offset === -1 ? "left" : offset === 1 ? "right" : offset < 0 ? "off-left" : "off-right";
      const wasOffscreen = oldPosition === "off-left" || oldPosition === "off-right";
      const isOffscreen = newPosition === "off-left" || newPosition === "off-right";

      if (wasOffscreen && isOffscreen && oldPosition !== newPosition) {
        photo.classList.add("is-teleporting");
      } else if (!isOffscreen) {
        photo.classList.remove("is-teleporting");
      }

      photo.dataset.position = newPosition;
      photo.setAttribute("aria-hidden", String(isOffscreen));
    });

    if (quote) quote.textContent = `“${quoteLines[activeIndex]}”`;
    pages.forEach((page, index) => {
      const isActive = index === activeIndex;
      page.classList.toggle("is-active", isActive);
      if (isActive) page.setAttribute("aria-current", "true");
      else page.removeAttribute("aria-current");
    });
  };

  const goToExpertFeature = (index) => {
    activeIndex = (index + photos.length) % photos.length;
    renderExpertFeature();
  };

  previous?.addEventListener("click", () => goToExpertFeature(activeIndex - 1));
  next?.addEventListener("click", () => goToExpertFeature(activeIndex + 1));
  pages.forEach((page, index) => page.addEventListener("click", () => goToExpertFeature(index)));
  gallery?.addEventListener("pointerdown", (event) => { pointerStart = event.clientX; }, { passive: true });
  gallery?.addEventListener("pointerup", (event) => {
    if (pointerStart === null) return;
    const delta = event.clientX - pointerStart;
    pointerStart = null;
    if (Math.abs(delta) > 45) goToExpertFeature(activeIndex + (delta < 0 ? 1 : -1));
  }, { passive: true });
  gallery?.addEventListener("pointercancel", () => { pointerStart = null; }, { passive: true });
  renderExpertFeature();
}

const ingredientCards = Array.from(document.querySelectorAll("#routine .protocol-ingredient-card"));
if (ingredientCards.length) {
  const ingredientGrid = document.querySelector("#routine .protocol-ingredient-grid");
  const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  ingredientCards.forEach((card, index) => {
    card.classList.add("ingredient-stagger-pending");
    card.style.setProperty("--ingredient-stagger", `${index * 150}ms`);
  });
  const revealIngredientCards = () => ingredientCards.forEach((card, index) => {
    window.setTimeout(() => card.classList.add("ingredient-stagger-in"), reducedMotionPreference.matches ? 0 : index * 150);
  });
  if (reducedMotionPreference.matches || !("IntersectionObserver" in window) || !ingredientGrid) {
    revealIngredientCards();
  } else {
    const ingredientObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        revealIngredientCards();
        ingredientObserver.disconnect();
      }
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    ingredientObserver.observe(ingredientGrid);
  }
  const setIngredientCard = (card, isOpen) => {
    card.classList.toggle("is-open", isOpen);
    const toggle = card.querySelector(".ingredient-reveal-toggle");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? toggle.dataset.closeLabel : toggle.getAttribute("aria-label").replace(/^Hide /, "Show "));
    card.querySelector(".ingredient-reveal").setAttribute("aria-hidden", String(!isOpen));
  };

  ingredientCards.forEach((card) => {
    const toggle = card.querySelector(".ingredient-reveal-toggle");
    toggle.addEventListener("click", () => {
      const willOpen = !card.classList.contains("is-open");
      ingredientCards.forEach((otherCard) => setIngredientCard(otherCard, otherCard === card && willOpen));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    ingredientCards.forEach((card) => setIngredientCard(card, false));
  });
}

const blogImageGrids = Array.from(document.querySelectorAll(".blog-image-grid"));
if (blogImageGrids.length) {
  const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotionPreference.matches || !("IntersectionObserver" in window)) {
    blogImageGrids.forEach((grid) => grid.classList.add("is-visible"));
  } else {
    const blogImageObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        blogImageObserver.unobserve(entry.target);
      }
    }), { threshold: 0.15 });
    blogImageGrids.forEach((grid) => blogImageObserver.observe(grid));
  }
}

// Move the letters along a fixed oval path; the path and badge stay still.
const protocolRing = document.querySelector("#routine .protocol-ring");
if (protocolRing) {
  const ringPath = protocolRing.querySelector("#protocol-ring-path");
  const fallbackText = protocolRing.querySelector(".protocol-ring-fallback textPath");
  const glyphLayer = protocolRing.querySelector(".protocol-ring-letters");
  const ringMessage = fallbackText?.textContent.trim();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const svgNS = "http://www.w3.org/2000/svg";

  const startProtocolRing = () => {
    if (!ringPath || !glyphLayer || !ringMessage || glyphLayer.childElementCount) return;
    const pathLength = ringPath.getTotalLength();
    const characters = Array.from(ringMessage);
    if (!Number.isFinite(pathLength) || pathLength <= 0 || !characters.length) return;

    const measure = document.createElementNS(svgNS, "text");
    measure.setAttribute("class", "protocol-ring-measure");
    measure.setAttribute("visibility", "hidden");
    measure.textContent = ringMessage;
    protocolRing.appendChild(measure);

    let widths;
    try {
      widths = characters.map((_, index) => measure.getSubStringLength(index, 1));
    } catch {
      measure.remove();
      return;
    }
    const measuredLength = widths.reduce((sum, width) => sum + width, 0);
    measure.remove();
    if (!Number.isFinite(measuredLength) || measuredLength <= 0) return;

    const targetLength = Math.min(1687, pathLength * 0.99);
    const extraSpacing = (targetLength - measuredLength) / characters.length;
    const advances = widths.map((width) => Math.max(1, width + extraSpacing));
    const glyphs = characters.map((character) => {
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("class", "protocol-ring-glyph");
      const textPath = document.createElementNS(svgNS, "textPath");
      textPath.setAttribute("href", "#protocol-ring-path");
      textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#protocol-ring-path");
      textPath.setAttribute("text-anchor", "middle");
      textPath.textContent = character;
      text.appendChild(textPath);
      glyphLayer.appendChild(text);
      return textPath;
    });

    protocolRing.classList.add("has-moving-ring-text");
    const hoverSurface = protocolRing.closest(".protocol-product-panel") || protocolRing;
    let startTime = null;
    let pausedAt = null;
    let paused = false;
    let animationFrame = 0;

    const render = (timestamp) => {
      animationFrame = 0;
      if (paused) return;
      if (startTime === null) startTime = timestamp;
      const travel = reducedMotion.matches ? 0 : ((timestamp - startTime) / 76000 * pathLength) % pathLength;
      let cursor = 0;
      glyphs.forEach((glyph, index) => {
        const center = (travel + cursor + advances[index] / 2) % pathLength;
        glyph.setAttribute("startOffset", center.toFixed(2));
        cursor += advances[index];
      });
      if (!reducedMotion.matches && !paused) animationFrame = window.requestAnimationFrame(render);
    };

    const pauseRing = () => {
      if (paused) return;
      paused = true;
      pausedAt = performance.now();
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };
    const resumeRing = () => {
      if (!paused) return;
      const resumedAt = performance.now();
      if (startTime !== null && pausedAt !== null) startTime += resumedAt - pausedAt;
      pausedAt = null;
      paused = false;
      if (!reducedMotion.matches) animationFrame = window.requestAnimationFrame(render);
    };
    const onPointerEnter = (event) => {
      if (event.pointerType !== "touch") pauseRing();
    };
    const onPointerLeave = (event) => {
      if (event.pointerType !== "touch") resumeRing();
    };

    hoverSurface.addEventListener("pointerenter", onPointerEnter);
    hoverSurface.addEventListener("pointerleave", onPointerLeave);
    hoverSurface.addEventListener("focusin", pauseRing);
    hoverSurface.addEventListener("focusout", (event) => {
      if (!hoverSurface.contains(event.relatedTarget)) resumeRing();
    });

    animationFrame = window.requestAnimationFrame(render);
  };

  if (document.fonts?.ready) document.fonts.ready.then(startProtocolRing);
  else startProtocolRing();
}

// Animate the outcome bars when they enter view and reveal the page return control.
const outcomesChart = document.querySelector(".research-chart-visual");
if (outcomesChart) {
  if (reducedMotion.matches) {
    outcomesChart.classList.add("is-visible");
  } else if ("IntersectionObserver" in window) {
    outcomesChart.classList.add("is-animated");
    const outcomesObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          outcomesChart.classList.add("is-visible");
          outcomesObserver.disconnect();
        }
      });
    }, { threshold: 0.25 });
    outcomesObserver.observe(outcomesChart);
  } else {
    outcomesChart.classList.add("is-visible");
  }
}

const backToTop = document.querySelector("#back-to-top");
if (backToTop) {
  let backToTopFrame = 0;
  const updateBackToTop = () => {
    if (backToTopFrame) return;
    backToTopFrame = window.requestAnimationFrame(() => {
      backToTopFrame = 0;
      backToTop.classList.toggle("is-visible", window.scrollY > 520);
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0;
      backToTop.style.setProperty("--scroll-progress", `${progress * 360}deg`);
    });
  };
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
}
