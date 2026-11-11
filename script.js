/**
 * Abba Planejados - Main Script v2.0
 * Ambientes sonhados por você e realizados por nós!
 * Enhanced: particles, lightbox, testimonials, scroll progress, active nav, cursor glow
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. PRELOADER =====
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 600);
        });

        // Fallback in case load event already fired
        setTimeout(() => {
            if (!loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
            }
        }, 2500);
    }

    // ===== 2. HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ===== 3. MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on navigation link click
        mobileMenu.querySelectorAll('nav a:not(.mobile-dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Mobile dropdown toggle
        mobileMenu.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdown = toggle.nextElementSibling;
                if (dropdown) {
                    dropdown.classList.toggle('active');
                    const arrow = toggle.querySelector('.dropdown-arrow');
                    if (arrow) {
                        arrow.style.transform = dropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
                    }
                }
            });
        });
    }

    // ===== 4. HERO SLIDER =====
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval = null;

    function goToSlide(index) {
        if (!slides.length) return;
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function startSlider() {
        if (slides.length > 1) {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5500);
        }
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            goToSlide(idx);
            startSlider();
        });
    });

    if (slides.length > 1) {
        startSlider();

        // Touch swipe support for hero slider
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            let heroTouchStartX = 0;
            let heroTouchEndX = 0;

            heroSlider.addEventListener('touchstart', (e) => {
                heroTouchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            heroSlider.addEventListener('touchend', (e) => {
                heroTouchEndX = e.changedTouches[0].screenX;
                const diff = heroTouchStartX - heroTouchEndX;
                if (Math.abs(diff) > 45) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        goToSlide(currentSlide - 1);
                    }
                    startSlider();
                }
            }, { passive: true });
        }
    }

    // ===== 5. ANIMATED COUNTERS =====
    function animateCounters() {
        const counters = document.querySelectorAll('.counter-number');

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target, 10) || 0;
            const duration = 2200;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Smooth quad ease out
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                counter.textContent = current.toLocaleString('pt-BR');

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString('pt-BR');
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ===== 6. INTERSECTION OBSERVER FOR SCROLL REVEALS & COUNTERS =====
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Stagger animation delays for grid items
    document.querySelectorAll('.ambientes-grid .ambiente-card, .diferenciais-grid .diferencial-card, .workflow-grid .step-card, .regions-grid .region-card')
        .forEach((card, index) => {
            card.style.transitionDelay = `${(index % 4) * 0.1}s`;
        });

    // Counter observer
    const counterSection = document.getElementById('counters');
    let countersAnimated = false;

    if (counterSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(counterSection);
    }

    // ===== 7. BACK TO TOP BUTTON =====
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 450) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== 8. SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#modal')) return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== 9. INTERACTIVE BUDGET MODAL & WHATSAPP INTEGRATION =====
    const modal = document.getElementById('budget-modal');
    const modalClose = document.getElementById('modal-close');
    const budgetForm = document.getElementById('budget-form');
    const ambienteSelect = document.getElementById('form-ambiente');

    // Phone number configured for Abba Planejados (from official Instagram)
    const WHATSAPP_PHONE = '5583999567779'; // (83) 99956-7779

    function openModal(ambienteName = '') {
        if (!modal) return;
        if (ambienteName && ambienteSelect) {
            for (let i = 0; i < ambienteSelect.options.length; i++) {
                if (ambienteSelect.options[i].text.toLowerCase().includes(ambienteName.toLowerCase())) {
                    ambienteSelect.selectedIndex = i;
                    break;
                }
            }
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Open buttons
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const ambiente = btn.getAttribute('data-ambiente') || '';
            openModal(ambiente);
        });
    });

    // Clicking an ambiente card directly triggers the modal or WhatsApp
    document.querySelectorAll('.ambiente-card').forEach(card => {
        card.addEventListener('click', () => {
            const titleEl = card.querySelector('.ambiente-info h3');
            const ambienteName = titleEl ? titleEl.textContent.trim() : '';
            openModal(ambienteName);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Budget form submission directly sends to WhatsApp with formatted text
    if (budgetForm) {
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name')?.value.trim() || 'Cliente';
            const cidade = document.getElementById('form-cidade')?.value.trim() || 'Não informada';
            const ambiente = document.getElementById('form-ambiente')?.value || 'Ambientes Gerais';
            const mensagem = document.getElementById('form-mensagem')?.value.trim() || '';

            let text = `Olá, Abba Planejados! Meu nome é *${name}*.\n`;
            text += `Gostaria de solicitar um orçamento sob medida para *${ambiente}*.\n`;
            text += `📍 Cidade: *${cidade}*\n`;
            if (mensagem) {
                text += `Detalhes: ${mensagem}\n`;
            }
            text += `\nVi através do site da Abba Planejados!`;

            const encoded = encodeURIComponent(text);
            const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;

            window.open(waUrl, '_blank');
            closeModal();
        });
    }

    // ===== 10. SCROLL PROGRESS BAR =====
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = scrollPercent + '%';
        }, { passive: true });
    }

    // ===== 11. ACTIVE NAV INDICATOR ON SCROLL =====
    const navLinks = document.querySelectorAll('#nav-desktop ul > li > a[data-section]');
    const sections = [];
    navLinks.forEach(link => {
        const sectionId = link.dataset.section;
        const section = document.getElementById(sectionId);
        if (section) {
            sections.push({ el: section, link: link });
        }
    });

    function updateActiveNav() {
        const scrollPos = window.scrollY + (header ? header.offsetHeight + 100 : 100);

        let activeIndex = -1;
        sections.forEach((s, i) => {
            if (scrollPos >= s.el.offsetTop) {
                activeIndex = i;
            }
        });

        navLinks.forEach(l => l.classList.remove('nav-active'));
        if (activeIndex >= 0 && sections[activeIndex]) {
            sections[activeIndex].link.classList.add('nav-active');
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ===== 12. CURSOR GLOW EFFECT (Desktop Only) =====
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.matchMedia('(min-width: 1024px)').matches) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // ===== 13. HERO FLOATING GOLD PARTICLES =====
    const particleCanvas = document.getElementById('hero-particles');
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 35;

        function resizeCanvas() {
            const hero = document.getElementById('hero');
            if (hero) {
                particleCanvas.width = hero.offsetWidth;
                particleCanvas.height = hero.offsetHeight;
            }
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedY = -(Math.random() * 0.3 + 0.1);
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
                this.fadeSpeed = Math.random() * 0.008 + 0.002;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fadeDirection * this.fadeSpeed;

                if (this.opacity >= 0.6) this.fadeDirection = -1;
                if (this.opacity <= 0.05) this.fadeDirection = 1;

                if (this.y < -10 || this.x < -10 || this.x > particleCanvas.width + 10) {
                    this.reset();
                    this.y = particleCanvas.height + 10;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity * 0.15})`;
                ctx.fill();
            }
        }

        function initParticles() {
            resizeCanvas();
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resizeCanvas);
        initParticles();
        animateParticles();
    }

    // ===== 14. TESTIMONIALS SLIDER =====
    const testimonialsTrack = document.getElementById('testimonials-track');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    let currentTestimonial = 0;
    let testimonialInterval = null;

    function goToTestimonial(index) {
        if (!testimonialsTrack) return;
        const cards = testimonialsTrack.querySelectorAll('.testimonial-card');
        if (!cards.length) return;

        currentTestimonial = ((index % cards.length) + cards.length) % cards.length;
        testimonialsTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;

        testimonialDots.forEach(d => d.classList.remove('active'));
        if (testimonialDots[currentTestimonial]) {
            testimonialDots[currentTestimonial].classList.add('active');
        }
    }

    testimonialDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            goToTestimonial(idx);
            startTestimonialSlider();
        });
    });

    function startTestimonialSlider() {
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(() => {
            goToTestimonial(currentTestimonial + 1);
        }, 6000);
    }

    if (testimonialsTrack && testimonialDots.length > 0) {
        startTestimonialSlider();

        // Swipe support for touch devices
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialsTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialsTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToTestimonial(currentTestimonial + 1);
                } else {
                    goToTestimonial(currentTestimonial - 1);
                }
                startTestimonialSlider();
            }
        }, { passive: true });
    }

    // ===== 15. LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    function openLightbox(imgSrc, altText) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = imgSrc;
        lightboxImg.alt = altText;
        if (lightboxCaption) lightboxCaption.textContent = altText;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Clickable images with [data-lightbox] attribute
    document.querySelectorAll('[data-lightbox]').forEach(frame => {
        const img = frame.querySelector('img');
        if (img) {
            frame.style.cursor = 'zoom-in';
            frame.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(img.src, img.alt);
            });
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ===== 16. TILT EFFECT ON CARDS (desktop hover) =====
    if (window.matchMedia('(min-width: 1024px)').matches) {
        document.querySelectorAll('.diferencial-card, .region-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;
                card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

});
