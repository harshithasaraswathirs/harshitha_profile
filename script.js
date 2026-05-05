
document.addEventListener('DOMContentLoaded', function () {

  const navbar = document.getElementById('mainNav');
  // getElementById returns the ONE element with that id=""
  // We store it in a variable so we don't look it up every scroll event

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      // When scrolled > 60px: add class → CSS shows white background
    } else {
      navbar.classList.remove('scrolled');
      // Near top: remove class → CSS shows transparent background
    }
  }

  // 'scroll' event fires continuously as user scrolls
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Run once on load in case page is refreshed mid-scroll


 
  const sections = document.querySelectorAll('section[id]');
  // querySelectorAll returns a NodeList (like an array) of ALL matching elements

  const navLinks = document.querySelectorAll('.nav-link');

  // Create an observer — runs our callback when elements enter/exit view
  const sectionObserver = new IntersectionObserver(function (entries) {
    // entries = array of observed elements that changed visibility

    entries.forEach(function (entry) {
      // forEach loops through each changed element

      if (entry.isIntersecting) {
        // isIntersecting = true when element is visible in viewport

        const activeId = entry.target.id;
        // entry.target = the actual section element
        // .id = its HTML id attribute (e.g. "skills", "about")

        navLinks.forEach(function (link) {
          link.classList.remove('active');
          // Remove active from ALL links first

          // Check if this link's href matches the visible section
          if (link.getAttribute('href') === '#' + activeId) {
            link.classList.add('active');
            // Add active ONLY to the matching link
          }
        });
      }
    });
  }, {
    threshold: 0.4,
    // threshold: 0.4 = callback fires when 40% of section is visible
    rootMargin: '-80px 0px -40% 0px'
    // rootMargin shrinks the "visible area" — accounts for our fixed navbar
  });

  // Tell the observer to watch each section
  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });


  
  const animatedElements = document.querySelectorAll('[data-animate]');
  // [data-animate] = CSS attribute selector — matches any element 
  // that HAS the data-animate attribute (regardless of value)

  const animationObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Once animated, stop observing (no need to watch it anymore)
        animationObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,     // Trigger when 15% visible
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(function (el) {
    animationObserver.observe(el);
  });


 
  const progressBars = document.querySelectorAll('.progress-bar[data-width]');

  const skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.getAttribute('data-width');
        // Read the data-width="85" value from HTML

        // Small delay for visual effect — feels more satisfying
        setTimeout(function () {
          entry.target.style.width = targetWidth + '%';
          // Dynamically set inline CSS: style.width = "85%"
          // CSS transition in style.css handles the smooth animation
        }, 200);

        skillObserver.unobserve(entry.target);
        // Only animate once — unobserve after first trigger
      }
    });
  }, { threshold: 0.3 });

  progressBars.forEach(function (bar) {
    skillObserver.observe(bar);
  });


  const counters = document.querySelectorAll('.stat-num[data-count]');

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count'));
        // parseInt converts string "90" to number 90
        
        let current = 0;
        const increment = target / 40; // Divide into 40 steps
        
        const timer = setInterval(function () {
          current += increment;

          if (current >= target) {
            current = target;
            clearInterval(timer); // Stop the interval when done
          }

          entry.target.textContent = Math.round(current);
          // textContent = set the text inside the element
          // Math.round = removes decimals (so we show 85, not 84.7)
        }, 40); // Run every 40ms = ~1.6 seconds total

        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });


  
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      // preventDefault = "stop the default HTML form behaviour"
      // Without this, the page would reload and data would be lost

      // Read input values
      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const message = document.getElementById('message').value.trim();
      // .value = gets what the user typed
      // .trim() = removes leading/trailing whitespace

      // Basic validation — check nothing is empty
      if (!name || !email || !message) {
        // Shake the button to indicate error
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.style.animation = 'shake 0.4s ease';
        setTimeout(function () { submitBtn.style.animation = ''; }, 400);
        return; // Stop execution here — don't proceed if invalid
      }

      // Simulate sending (in real projects, you'd use fetch() to send to a server)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
      submitBtn.disabled = true; // Prevent double-clicks

      // Simulate network delay with setTimeout
      setTimeout(function () {
        // Show success message
        formSuccess.style.display = 'block';
        contactForm.reset(); // Clear all form inputs

        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Scroll to success message
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide success message after 5 seconds
        setTimeout(function () {
          formSuccess.style.display = 'none';
        }, 5000);

      }, 1500); // 1.5 second fake delay
    });
  }


  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    // a[href^="#"] = all <a> elements whose href STARTS WITH "#"

    anchor.addEventListener('click', function (event) {
      event.preventDefault();

      const targetId = this.getAttribute('href');
      // 'this' inside a regular function = the element that triggered the event
      // So this = the <a> tag that was clicked

      if (targetId === '#') return; // Skip if href is just "#"

      const targetElement = document.querySelector(targetId);
      // querySelector(targetId) finds the section with that id

      if (targetElement) {
        const navbarHeight = navbar.offsetHeight;
        // offsetHeight = element's height in pixels

        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
        // getBoundingClientRect().top = distance from top of viewport
        // + window.scrollY = convert to distance from page top
        // - navbarHeight = subtract navbar so section isn't hidden behind it
        // - 20 = extra breathing room

        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        // scrollTo with behavior:'smooth' animates the scroll

        // Close mobile navbar if it's open (Bootstrap collapses menu)
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
          // bootstrap.Collapse is a Bootstrap JS API to control the menu
        }
      }
    });
  });


  const typingEl = document.querySelector('.hero-subtitle');
  
  if (typingEl) {
    const roles = [
      'Future Cloud Infrastructure Engineer',
'Learning DevOps & Automation',
'Exploring AWS & Terraform',
'Cloud Computing Enthusiast'
    ];
    // Array = an ordered list of values, accessed by index [0], [1], etc.

    let roleIndex = 0;     // Which role we're currently showing
    let charIndex = 0;     // Which character within that role
    let isDeleting = false; // Are we typing or deleting?

    function type() {
      const currentRole = roles[roleIndex % roles.length];
      // % = modulo operator — wraps around when we reach the end
      // roleIndex % 4: 0→0, 1→1, 2→2, 3→3, 4→0, 5→1 (cycles)

      if (!isDeleting) {
        // TYPING: show one more character
        typingEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
          // Finished typing — pause then start deleting
          isDeleting = true;
          setTimeout(type, 1800); // Wait 1.8s before deleting
          return; // Don't schedule the regular interval
        }
      } else {
        // DELETING: remove one character
        typingEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          // Finished deleting — move to next role
          isDeleting = false;
          roleIndex++;
        }
      }

      // Schedule next character — typing is slower than deleting
      const speed = isDeleting ? 60 : 100;
      setTimeout(type, speed);
    }

    type(); // Start the animation
  }


  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  
  console.log('%c👋 Hi there!', 'font-size:20px; font-weight:bold; color:#1a365d;');
  console.log('%cThis page was built by Harshitha Saraswathi R S', 'color:#c8973a; font-size:14px;');
  console.log('%c🚀 Cloud & DevOps Engineer | SKCT 3rd Year IT', 'color:#6b7a8d;');

}); 