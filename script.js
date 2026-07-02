const nav = document.getElementById('site-nav');

window.addEventListener('scroll', function() {

  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

});

const hamburger  = document.getElementById('hamburger');
const navMobile  = document.getElementById('nav-mobile');
const navClose   = document.getElementById('nav-close');

const mobileLinks = document.querySelectorAll('.nav-mobile a');

hamburger.addEventListener('click', function() {
  navMobile.classList.toggle('open');
  document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
});

function closeMobileNav() {
  navMobile.classList.remove('open');
  document.body.style.overflow = '';
}

navClose.addEventListener('click', closeMobileNav);

mobileLinks.forEach(function(link) {
  link.addEventListener('click', closeMobileNav);
});

const phrases = [
  'EdTech Companies',
  'Publishers & Authors',
  'Schools & Districts',
  'Education Startups',
  'Small Education Businesses'
];

let currentPhrase = 0;

const rotatingEl = document.getElementById('rotating-text');

function rotateText() {

  rotatingEl.classList.add('fade-out');

  setTimeout(function() {

    currentPhrase = (currentPhrase + 1) % phrases.length;

    rotatingEl.textContent = phrases[currentPhrase];

    rotatingEl.classList.remove('fade-out');

  }, 450);
}

// Run rotateText() every 3200 milliseconds (3.2 seconds)
setInterval(rotateText, 3200);

const track = document.getElementById('testimonials-track');
const dots   = document.querySelectorAll('.t-dot');

let currentSlide = 0;

function goToSlide(index) {

  // Update tracker
  currentSlide = index;

  track.style.transform = 'translateX(-' + index * 100 + '%)';

  dots.forEach(function(dot, i) {
    if (i === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

dots.forEach(function(dot) {
  dot.addEventListener('click', function() {

    // parseInt converts the text "0" to the number 0
    const index = parseInt(dot.getAttribute('data-index'));

    // Stop the auto-advance so clicking doesn't fight the timer
    clearInterval(autoSlide);

    // Go to that slide
    goToSlide(index);

    // Restart the auto-advance
    startAutoSlide();
  });
});

// Auto-advance: move to the next slide every 5 seconds
function startAutoSlide() {
  autoSlide = setInterval(function() {

    // % wraps back to 0 after the last slide
    const next = (currentSlide + 1) % dots.length;
    goToSlide(next);

  }, 5000);
}

// Declare autoSlide up here so both functions above can access it
var autoSlide;

// Start it running when the page loads
startAutoSlide();

// Find every link that starts with # (internal anchor links)
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {

    // Get the href value e.g. "#services"
    const href = this.getAttribute('href');

    // Find the section that href points to
    const target = document.querySelector(href);

    // If the target exists (skip if href is just "#")
    if (target) {

      // Prevent the default instant jump
      e.preventDefault();

      // Calculate where to scroll to:
      // How far the section is from the top of the page,
      // minus the nav height, minus a little breathing room
      const navHeight = nav.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const scrollTo  = targetTop - navHeight - 16;

      window.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });
    }
  });
});

// Check the URL for ?sent=true or ?sent=error after form submission
// window.location.search gives us the "?sent=true" part of the URL
const urlParams = new URLSearchParams(window.location.search);
const sentStatus = urlParams.get('sent');

if (sentStatus === 'true' || sentStatus === 'error') {

  // Create the notification box
  const toast = document.createElement('div');
  toast.className = 'form-toast ' + (sentStatus === 'true' ? 'toast-success' : 'toast-error');

  toast.textContent = sentStatus === 'true'
    ? '✓  Message sent! Lisa will be in touch within 2 business days.'
    : '✕  Something went wrong. Please email info@sageeducon.com directly.';

  // Add it to the page
  document.body.appendChild(toast);

  // Trigger the slide-in animation after a tiny delay
  // (the delay lets the browser register the element before animating it)
  setTimeout(function() {
    toast.classList.add('toast-visible');
  }, 100);

  // Remove it after 6 seconds
  setTimeout(function() {
    toast.classList.remove('toast-visible');
    // Remove from the DOM after the fade-out finishes
    setTimeout(function() {
      toast.remove();
    }, 400);
  }, 6000);

  // Also scroll down to the contact form so they can see their submission
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    setTimeout(function() {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  // Clean the URL so refreshing doesn't re-trigger the message
  // replaceState changes the URL without reloading the page
  window.history.replaceState({}, document.title, window.location.pathname);
}

// Blog filter — only runs if filter buttons exist on the page
const filterButtons = document.querySelectorAll('.filter-tag');
const blogCards     = document.querySelectorAll('.blog-card');

if (filterButtons.length > 0) {

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {

      // Move the active highlight to the clicked button
      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');

      // Read the button label e.g. "Leadership", "All"
      const filter = this.textContent.trim();

      // Loop every card and show or hide it
      blogCards.forEach(function(card) {
        const tag = card.querySelector('.blog-tag').textContent.trim();

        if (filter === 'All' || tag === filter) {
          card.style.display = '';     // Restore default display
        } else {
          card.style.display = 'none'; // Hide it
        }
      });

    });
  });

}