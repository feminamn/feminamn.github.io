const navMenu = document.querySelector('.nav-menu');
const navToggle = document.querySelector('.nav-toggle');
const navBackdrop = document.querySelector('.nav-backdrop');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

function openNav() {
    navMenu?.classList.add('is-open');
    navBackdrop?.classList.add('is-open');
    navBackdrop && (navBackdrop.hidden = false);
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeNav() {
    navMenu?.classList.remove('is-open');
    navBackdrop?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (navBackdrop) {
        window.setTimeout(() => {
            if (!navMenu?.classList.contains('is-open')) {
                navBackdrop.hidden = true;
            }
        }, 250);
    }
}

if (navToggle && navMenu && navBackdrop) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('is-open');
        if (isOpen) {
            closeNav();
        } else {
            openNav();
        }
    });

    navBackdrop.addEventListener('click', closeNav);
    navLinks.forEach(link => link.addEventListener('click', closeNav));

    window.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeNav();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeNav();
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') {
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

function updateActiveNav() {
    let current = '';
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// Highlight active navigation item on scroll
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Form submission handler
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // Simple validation
    if (name.trim() && email.trim() && message.trim()) {
        // Create a simple email link (in production, this would be handled by a backend)
        const mailtoLink = `mailto:femina.mn@Email.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        this.reset();
    } else {
        alert('Please fill out all fields.');
    }
});

// Add scroll animation for card-like elements
const observerOptions = {
    threshold: 0.05,
    rootMargin: '120px 0px 120px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            if (entry.target.classList.contains('stat') && !entry.target.dataset.countAnimated) {
                animateStatNumber(entry.target);
            }
        }
    });
}, observerOptions);

function animateStatNumber(statElement) {
    const valueElement = statElement.querySelector('.stat-value');
    if (!valueElement) {
        statElement.dataset.countAnimated = 'true';
        return;
    }

    const target = Number(valueElement.dataset.target);
    if (Number.isNaN(target)) {
        statElement.dataset.countAnimated = 'true';
        return;
    }

    const prefix = valueElement.dataset.prefix || '';
    const suffix = valueElement.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        valueElement.textContent = `${prefix}${current}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            statElement.dataset.countAnimated = 'true';
        }
    }

    requestAnimationFrame(tick);
}

// Observe all card-like blocks across the page
document.querySelectorAll('.skill-card, .cert-card, .project-card, .stat, .education-item, .timeline-item').forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    element.style.transitionDelay = `${Math.min(index * 0.03, 0.15)}s`;
    observer.observe(element);
});

// Add typing effect to hero subtitle
function typeEffect(element, text, speed = 100) {
    let index = 0;
    element.textContent = '';
    
    const type = () => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
            setTimeout(type, speed);
        }
    };
    
    type();
}

// Optional: Uncomment to enable typing effect on page load
// window.addEventListener('load', () => {
//     const heroSubtitle = document.querySelector('.hero-subtitle');
//     const originalText = heroSubtitle.textContent;
//     typeEffect(heroSubtitle, originalText, 50);
// });
