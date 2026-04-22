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

function initAppreciationCarousel() {
    const carousel = document.querySelector('[data-appreciation-carousel]');
    if (!carousel) {
        return;
    }

    const track = carousel.querySelector('[data-carousel-track]');
    const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
    const prevButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const dotsContainer = carousel.querySelector('[data-carousel-dots]');

    if (!track || slides.length === 0) {
        return;
    }

    if (slides.length === 1) {
        carousel.classList.add('is-single');
        return;
    }

    let currentIndex = 0;
    let autoPlayId = null;
    const autoplayDelay = 8000;

    const dots = slides.map((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Go to appreciation ${index + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoplay();
        });
        dotsContainer?.appendChild(dot);
        return dot;
    });

    function updateView() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, index) => {
            slide.classList.toggle('is-active', index === currentIndex);
            slide.setAttribute('aria-hidden', index === currentIndex ? 'false' : 'true');
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === currentIndex);
            dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
        });
    }

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        updateView();
    }

    function scheduleNextAutoplay() {
        autoPlayId = window.setTimeout(() => {
            goToSlide(currentIndex + 1);
            scheduleNextAutoplay();
        }, autoplayDelay);
    }

    function startAutoplay() {
        if (autoPlayId !== null) {
            return;
        }

        scheduleNextAutoplay();
    }

    function stopAutoplay() {
        if (autoPlayId !== null) {
            window.clearTimeout(autoPlayId);
            autoPlayId = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    prevButton?.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoplay();
    });

    nextButton?.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoplay();
    });

    carousel.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
            resetAutoplay();
        }

        if (event.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
            resetAutoplay();
        }
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', resetAutoplay);

    updateView();
    startAutoplay();
}

initAppreciationCarousel();

function initAppreciationPopup() {
    const modal = document.querySelector('[data-appreciation-modal]');
    const modalImage = document.querySelector('[data-appreciation-modal-image]');
    const modalCloseButton = document.querySelector('[data-appreciation-modal-close]');
    const appreciationImages = Array.from(document.querySelectorAll('.appreciation-card img'));

    if (!modal || !modalImage || appreciationImages.length === 0) {
        return;
    }

    function openModal(sourceImage) {
        modalImage.src = sourceImage.currentSrc || sourceImage.src;
        modalImage.alt = sourceImage.alt || 'Client appreciation image';
        modal.hidden = false;
        requestAnimationFrame(() => modal.classList.add('is-open'));
        modal.dataset.previousOverflow = document.body.style.overflow || '';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.hidden = true;
        modalImage.src = '';
        modalImage.alt = '';
        document.body.style.overflow = modal.dataset.previousOverflow || '';
    }

    appreciationImages.forEach(image => {
        image.setAttribute('tabindex', '0');
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', `Open image preview: ${image.alt || 'Client appreciation'}`);

        image.addEventListener('click', () => openModal(image));
        image.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(image);
            }
        });
    });

    modalCloseButton?.addEventListener('click', closeModal);

    modal.addEventListener('click', event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });
}

initAppreciationPopup();

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
document.querySelectorAll('.skill-card, .cert-card, .project-card, .appreciation-card, .stat, .timeline-item').forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    element.style.transitionDelay = `${Math.min(index * 0.03, 0.15)}s`;
    observer.observe(element);
});

