// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Highlight active navigation item on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
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
});

// Add active link styling
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: #667eea !important;
        border-bottom: 3px solid #0c0c0c;
        padding-bottom: 0.3rem;
    }
`;
document.head.appendChild(style);

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
        }
    });
}, observerOptions);

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
