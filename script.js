// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navbar scroll effect
        const nav = document.querySelector('.main-nav');
        if (nav) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    nav.style.background = 'rgba(255, 255, 255, 0.98)';
                    nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                } else {
                    nav.style.background = 'rgba(255, 255, 255, 0.95)';
                    nav.style.boxShadow = 'none';
                }
            });
        }

        // Stats animation
        const stats = document.querySelectorAll('.stat-item h3');
        let hasAnimated = false;

        function animateStats() {
            stats.forEach(stat => {
                const targetText = stat.textContent;
                const target = parseFloat(targetText.replace('+', ''));
                if (isNaN(target)) return;

                let current = 0;
                const increment = target / 50;
                const duration = 2000;
                const step = duration / 50;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = targetText;
                        clearInterval(counter);
                    } else {
                        stat.textContent = Math.floor(current) + (targetText.includes('+') ? '+' : '');
                    }
                }, step);
            });
        }

        // Intersection Observer for animations
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('stats-section') && !hasAnimated) {
                        animateStats();
                        hasAnimated = true;
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.1
        });

        // Observe elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }

        // Contact form handling
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitButton = contactForm.querySelector('.submit-button');
                if (submitButton) {
                    submitButton.textContent = 'Sending...';
                    submitButton.disabled = true;

                    // Simulate form submission
                    setTimeout(() => {
                        alert('Thank you for your message! We will get back to you soon.');
                        contactForm.reset();
                        submitButton.textContent = 'Send Message';
                        submitButton.disabled = false;
                    }, 1500);
                }
            });
        }

    } catch (error) {
        console.error('An error occurred:', error);
    }
});

// Navbar visibility control
const navbar = document.querySelector('.main-nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) { // Show after 100px scroll
        navbar.classList.add('visible');
    } else {
        navbar.classList.remove('visible');
    }
    
    lastScroll = currentScroll;
});