/* ============================================
   GDR Software Development — Interactive Layer
   ============================================ */

(function () {
    'use strict';

    /* -------------------------------------------
       Scroll-triggered Animations (Intersection Observer)
       ------------------------------------------- */
    function initScrollAnimations() {
        var elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* -------------------------------------------
       Navbar Scroll Behaviour
       ------------------------------------------- */
    function initNavbar() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;

        var scrollThreshold = 32;
        var ticking = false;

        function updateNavbar() {
            if (window.scrollY > scrollThreshold) {
                navbar.classList.add('is-scrolled');
            } else {
                navbar.classList.remove('is-scrolled');
            }
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }, { passive: true });

        updateNavbar();
    }

    /* -------------------------------------------
       Mobile Navigation
       ------------------------------------------- */
    function initMobileNav() {
        var toggle = document.getElementById('navToggle');
        var navLinks = document.getElementById('navLinks');
        if (!toggle || !navLinks) return;

        toggle.addEventListener('click', function () {
            toggle.classList.toggle('is-active');
            navLinks.classList.toggle('is-open');
            document.body.style.overflow = navLinks.classList.contains('is-open') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        var links = navLinks.querySelectorAll('.nav-link');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                toggle.classList.remove('is-active');
                navLinks.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });
    }

    /* -------------------------------------------
       Smooth Scroll for Anchor Links
       ------------------------------------------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                var navbarHeight = document.getElementById('navbar')
                    ? document.getElementById('navbar').offsetHeight
                    : 0;

                var targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* -------------------------------------------
       Counter Animation
       ------------------------------------------- */
    function initCounters() {
        var counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        var animated = new Set();

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !animated.has(entry.target)) {
                        animated.add(entry.target);
                        animateCounter(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(function (counter) {
            observer.observe(counter);
        });
    }

    function animateCounter(element) {
        var target = parseInt(element.getAttribute('data-count'), 10);
        var duration = 1800;
        var startTime = null;

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easeOutQuart(progress);
            var current = Math.round(easedProgress * target);
            element.textContent = current;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }

    /* -------------------------------------------
       Contact Form Handling
       ------------------------------------------- */
    function initContactForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate required fields
            var firstName = form.querySelector('#firstName');
            var lastName = form.querySelector('#lastName');
            var email = form.querySelector('#email');

            if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim()) {
                return;
            }

            // Basic email validation
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                email.focus();
                return;
            }

            // Show success state
            var formContainer = form.parentElement;
            form.style.opacity = '0';
            form.style.transform = 'translateY(10px)';
            form.style.transition = 'all 0.3s ease';

            setTimeout(function () {
                form.style.display = 'none';

                var successDiv = document.createElement('div');
                successDiv.className = 'form-success animate-on-scroll is-visible';
                successDiv.innerHTML =
                    '<div class="form-success-icon">' +
                    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
                    '</div>' +
                    '<h3>Message Sent</h3>' +
                    '<p>Thank you for reaching out. We\'ll get back to you within 24 hours.</p>';

                formContainer.appendChild(successDiv);
            }, 300);
        });
    }

    /* -------------------------------------------
       Active Navigation Link Highlighting
       ------------------------------------------- */
    function initActiveNavTracking() {
        var sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;

        var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        var ticking = false;

        function updateActiveLink() {
            var scrollPos = window.scrollY + 120;

            sections.forEach(function (section) {
                var top = section.offsetTop;
                var height = section.offsetHeight;
                var id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(function (link) {
                        link.classList.remove('is-active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('is-active');
                        }
                    });
                }
            });
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(updateActiveLink);
                ticking = true;
            }
        }, { passive: true });
    }

    /* -------------------------------------------
       Initialise Everything on DOM Ready
       ------------------------------------------- */
    function init() {
        initScrollAnimations();
        initNavbar();
        initMobileNav();
        initSmoothScroll();
        initCounters();
        initContactForm();
        initActiveNavTracking();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
