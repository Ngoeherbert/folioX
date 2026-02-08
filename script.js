const menuBtn = document.getElementById("menu-toggle");
const mobileNav = document.getElementById("mobile-nav");
const bodyTag = document.body;
const mobileLinks = document.querySelectorAll(".mobile-link");

function toggleMobileMenu() {
  menuBtn.classList.toggle("active");
  mobileNav.classList.toggle("open");
  bodyTag.classList.toggle("no-scroll");
}

menuBtn.addEventListener("click", toggleMobileMenu);

// Close menu when a link is clicked (navigating to a section)
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileNav.classList.contains("open")) {
      toggleMobileMenu();
    }
  });
});
gsap.registerPlugin(ScrollTrigger, Draggable);

// Entrance
window.addEventListener("load", () => {
  gsap.to(".content > *, .hero-visuals, .item", {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power4.out",
  });

  // Tech Pills Floating
  document.querySelectorAll(".draggable").forEach((pill, i) => {
    let float = gsap.to(pill, {
      y: "random(-15, 15)",
      x: "random(-10, 10)",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    Draggable.create(pill, {
      bounds: "#hero",
      onPress: () => float.pause(),
      onRelease: () => float.resume(),
    });
  });
});

// Scroll Animations
document.querySelectorAll("section").forEach((section) => {
  const elements = section.querySelectorAll(".content > *, .item");
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    onEnter: () => {
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
      });
    },
  });
});

/**
 * Synchronizes dot indicators with a horizontal slider
 * @param {string} sliderId - ID of the scroll container
 * @param {string} dotSelector - CSS selector for the indicator dots
 */
const syncSliderIndicators = (sliderId, dotSelector) => {
  const slider = document.getElementById(sliderId);
  const dots = document.querySelectorAll(dotSelector);

  if (!slider || dots.length === 0) return;

  slider.addEventListener("scroll", () => {
    const scrollLeft = slider.scrollLeft;
    // We use the first item's width to determine index
    const cardWidth = slider.querySelector(".item").offsetWidth;
    const activeIndex = Math.round(scrollLeft / cardWidth);

    dots.forEach((dot, i) => {
      if (i === activeIndex) {
        dot.classList.add("bg-[#00FF41]", "w-8");
        dot.classList.remove("bg-white/20", "w-4");
      } else {
        dot.classList.remove("bg-[#00FF41]", "w-8");
        dot.classList.add("bg-white/20", "w-4");
      }
    });
  });
};

// Initialize both sliders
document.addEventListener("DOMContentLoaded", () => {
  syncSliderIndicators(
    "testimonial-slider",
    "#testimonial-indicators .indicator-dot",
  );
  syncSliderIndicators(
    "portfolio-slider",
    "#portfolio-indicators .portfolio-dot",
  );
});

function toggleContactModal(isOpen) {
  const modal = document.getElementById("contact-modal");
  const container = document.getElementById("modal-container");

  if (isOpen) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      container.classList.remove("translate-y-full");
      container.classList.add("translate-y-0");
    }, 10);
  } else {
    container.classList.add("translate-y-full");
    container.classList.remove("translate-y-0");

    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "auto";
    }, 450);
  }
}

// Fixed: Intelligent Scroll into view for mobile inputs
function handleInputFocus(el) {
  const container = document.getElementById("modal-container");

  // Use a slightly longer timeout to allow the mobile keyboard
  // to fully displace the viewport height
  setTimeout(() => {
    // Calculate the distance from the top of the container to the input
    const elementRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const relativeTop = elementRect.top - containerRect.top;

    // Scroll the container so the input is roughly in the top-third
    // This leaves room for the label above and keyboard below
    const scrollTarget = container.scrollTop + relativeTop - 40;

    container.scrollTo({
      top: scrollTarget,
      behavior: "smooth",
    });
  }, 400);
}

// Optional: Fix for some browsers that don't reset scroll after keyboard closes
window.visualViewport.addEventListener("resize", () => {
  if (window.visualViewport.height > window.innerHeight * 0.8) {
    // Keyboard is likely closed, ensure modal didn't get stuck in a weird scroll
    const container = document.getElementById("modal-container");
    if (container.scrollTop < 50) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
});

const line1 = document.getElementById("line-1");
const line2 = document.getElementById("line-2");
const navLinks = document.querySelectorAll(".nav-link, .mobile-link");
const sections = document.querySelectorAll("section");

// Menu Open/Close Logic
menuBtn.addEventListener("click", () => {
  const isOpened = mobileNav.classList.toggle("translate-y-0");
  mobileNav.classList.toggle("-translate-y-full");

  if (isOpened) {
    line1.style.transform = "translateY(4px) rotate(45deg)";
    line1.style.backgroundColor = "#00FF41";
    line2.style.transform = "translateY(-4px) rotate(-45deg)";
    line2.style.backgroundColor = "#00FF41";
    document.body.style.overflow = "hidden"; // Prevent background scroll
  } else {
    line1.style.transform = "translateY(0) rotate(0)";
    line1.style.backgroundColor = "";
    line2.style.transform = "translateY(0) rotate(0)";
    line2.style.backgroundColor = "";
    document.body.style.overflow = "";
  }
});

// Active State on Scroll
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 250) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// Auto-close menu on click
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.add("-translate-y-full");
    mobileNav.classList.remove("translate-y-0");
    line1.style.transform = "translateY(0) rotate(0)";
    line2.style.transform = "translateY(0) rotate(0)";
    document.body.style.overflow = "";
  });
});

document.querySelectorAll(".draggable-window").forEach((win) => {
  const header = win.querySelector(".window-header");
  let isDragging = false;
  let xOffset = 0;
  let yOffset = 0;
  let startX, startY;

  header.addEventListener("mousedown", (e) => {
    document
      .querySelectorAll(".draggable-window")
      .forEach((w) => (w.style.zIndex = "10"));
    win.style.zIndex = "50";

    isDragging = true;
    startX = e.clientX - xOffset;
    startY = e.clientY - yOffset;

    win.style.transition = "none";

    // ADDED: Add glowing state
    win.classList.add("dragging-glow");
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    xOffset = e.clientX - startX;
    yOffset = e.clientY - startY;
    win.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;

    // ADDED: Remove glowing state
    win.classList.remove("dragging-glow");

    win.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
  });
});

const form = document.getElementById("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);
  result.innerHTML = "Please wait...";

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        result.innerHTML = json.message;
      } else {
        console.log(response);
        result.innerHTML = json.message;
      }
    })
    .catch((error) => {
      console.log(error);
      result.innerHTML = "Something went wrong!";
    })
    .then(function () {
      form.reset();
      setTimeout(() => {
        result.style.display = "none";
      }, 3000);
    });
    
});