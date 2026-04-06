document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. ANIMACIONES INICIALES (LOAD) CON ANIME.JS
       ======================================================== */
    anime({
        targets: '.anime-nav > *',
        translateY: [-30, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1200,
        delay: anime.stagger(150)
    });

    anime({
        targets: '.anime-hero-text > *',
        translateX: [-50, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1200,
        delay: anime.stagger(200, { start: 300 })
    });

    anime({
        targets: '.anime-hero-img',
        scale: [0.8, 1],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .6)',
        duration: 2000,
        delay: 800
    });

    /* ========================================================
       2. SCROLL REVEAL (INTERSECTION OBSERVER)
       ======================================================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.anime-item');

                anime({
                    targets: items,
                    translateY: [50, 0],
                    scale: [0.95, 1],
                    opacity: [0, 1],
                    easing: 'easeOutElastic(1, .8)',
                    duration: 1000,
                    delay: anime.stagger(150)
                });

                if (entry.target.id === 'planes') {
                    animateActiveTabCards();
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.scroll-trigger').forEach(section => {
        observer.observe(section);
    });

    /* ========================================================
       3. LÓGICA DE TABS CON ANIME.JS
       ======================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function animateActiveTabCards() {
        const activeContent = document.querySelector('.tab-content.block');
        if (activeContent) {
            anime({
                targets: activeContent.querySelectorAll('.tab-anim-item'),
                translateY: [30, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 800,
                delay: anime.stagger(150)
            });
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('bg-accent2', 'text-deep');
                b.classList.add('text-gray-400');
            });
            btn.classList.add('bg-accent2', 'text-deep');
            btn.classList.remove('text-gray-400');

            tabContents.forEach(c => {
                c.classList.replace('block', 'hidden');
                c.querySelectorAll('.tab-anim-item').forEach(item => item.style.opacity = 0);
            });

            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.replace('hidden', 'block');

            animateActiveTabCards();
        });
    });

    /* ========================================================
       4. ACORDEÓN FAQ CON ANIME.JS
       ======================================================== */
    const faqContainers = document.querySelectorAll('.faq-container');

    faqContainers.forEach(container => {
        const btn = container.querySelector('.faq-btn');
        const content = container.querySelector('.faq-content');
        const icon = container.querySelector('.faq-icon');
        let isOpen = false;

        btn.addEventListener('click', () => {
            isOpen = !isOpen;

            anime({
                targets: icon,
                rotate: isOpen ? 180 : 0,
                duration: 300,
                easing: 'easeInOutQuad'
            });

            if (isOpen) {
                const realHeight = content.scrollHeight;
                anime({
                    targets: content,
                    height: [0, realHeight],
                    duration: 400,
                    easing: 'easeOutExpo'
                });
            } else {
                anime({
                    targets: content,
                    height: [content.scrollHeight, 0],
                    duration: 400,
                    easing: 'easeOutExpo'
                });
            }
        });
    });

    /* ========================================================
       5. SISTEMA DE PARTÍCULAS CONTINUO (TODA LA WEB)
       ======================================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    let mouse = { x: undefined, y: undefined, radius: 150 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        initParticles();
    }

    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.size = Math.random() * 2.5 + 0.5;
            this.color = Math.random() > 0.5 ? 'rgba(39, 81, 128, 0.7)' : 'rgba(87, 186, 158, 0.7)';
            this.density = (Math.random() * 25) + 5;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) { this.x -= (this.x - this.baseX) / 15; }
                if (this.y !== this.baseY) { this.y -= (this.y - this.baseY) / 15; }
            }
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numParticles = (canvas.width * canvas.height) / 8000;
        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        requestAnimationFrame(animateParticles);
    }

    setTimeout(() => {
        resizeCanvas();
        animateParticles();
    }, 100);

    document.querySelectorAll('.faq-btn, .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(resizeCanvas, 450);
        });
    });

    /* ========================================================
       6. LÓGICA DEL TOGGLE DE DESCUENTOS (15% OFF)
       ======================================================== */
    const discountToggle = document.getElementById('discount-toggle');
    const toggleCircle = document.getElementById('toggle-circle');
    const labelNormal = document.getElementById('label-normal');
    const labelDiscount = document.getElementById('label-discount');
    const planBtns = document.querySelectorAll('.plan-btn');

    // Convertimos isDiscounted a global para que otras funciones la lean
    window.isDiscounted = false;

    if (discountToggle) {
        discountToggle.addEventListener('click', () => {
            window.isDiscounted = !window.isDiscounted;

            if (window.isDiscounted) {
                discountToggle.classList.replace('bg-gray-700', 'bg-accent2');
                toggleCircle.classList.add('translate-x-7');
                labelNormal.classList.replace('text-accent2', 'text-gray-500');
                labelDiscount.classList.replace('text-gray-500', 'text-accent2');
            } else {
                discountToggle.classList.replace('bg-accent2', 'bg-gray-700');
                toggleCircle.classList.remove('translate-x-7');
                labelNormal.classList.replace('text-gray-500', 'text-accent2');
                labelDiscount.classList.replace('text-accent2', 'text-gray-500');
            }

            // Llamamos a la función global para actualizar la visualización
            if (typeof updatePricesDisplay === 'function') {
                updatePricesDisplay();
            }

            // Actualizamos los enlaces de WhatsApp
            planBtns.forEach(btn => {
                const planName = btn.getAttribute('data-plan-name');
                let message = '';

                // Usamos el idioma actual si está disponible
                const isEnglish = (window.currentLang === 'en');

                if (window.isDiscounted) {
                    message = isEnglish
                        ? `Hi, I am interested in the ${planName} plan with the 15% discount offer and would like to schedule a meeting.`
                        : `Hola estoy interesado en el plan ${planName} con la oferta del 15% de descuento y quisiera concretar una reunión`;
                } else {
                    message = isEnglish
                        ? `Hi, I am interested in the ${planName} plan and would like to schedule a meeting.`
                        : `Hola estoy interesado en el plan ${planName} y quisiera concretar una reunión`;
                }

                btn.href = `https://wa.me/51913330912?text=${encodeURIComponent(message)}`;
            });
        });
    }

    /* ========================================================
       7. LÓGICA DEL MODAL DE PROYECTOS DINÁMICO
       ======================================================== */
    const projectsData = {
        'instituto': {
            title: 'Instituto Peruano de Compliance',
            icon: 'img/ciudad-icono-modal.svg',
            subtitle: 'Evolucionando la cultura de cumplimiento corporativo.',
            description: 'Para el Instituto Peruano de Compliance desarrollamos una plataforma web integral. Creamos una identidad visual que transmite rigor institucional combinado con una experiencia digital fluida y moderna enfocada en el usuario.',
            url: 'https://icompliancepe.com/',
            imgMain: '<img src="img/ipdc-compliance-4.png" class="w-full h-full object-cover object-top" alt="Instituto Main">',
            img1: '<img src="img/ipdc-compliance-2.png" class="w-full h-full object-cover" alt="Instituto App 1">',
            img2: '<img src="img/ipdc-compliance-3.png" class="w-full h-full object-cover" alt="Instituto App 2">',
            img3: '<img src="img/ipdc-compliance-1.png" class="w-full h-full object-cover" alt="Instituto Detalle 1">',
            img4: '<img src="img/ipdc-compliance-5.png" class="w-full h-full object-cover" alt="Instituto Detalle 2">'
        },
        'terminal': {
            title: 'Terminal SS',
            icon: 'img/ciudad-icono-modal.svg',
            subtitle: 'Sistema logístico y gestión operativa a medida.',
            description: 'Terminal SS requería una solución tecnológica compleja para optimizar sus operaciones. Desarrollamos un sistema a medida, escalable y eficiente que permite controlar procesos logísticos en tiempo real con total seguridad.',
            url: 'https://terminal-ss.com/',
            imgMain: '<img src="img/terminal-ss-5.png" class="w-full h-full object-cover object-top" alt="Terminal SS Main">',
            img1: '<img src="img/terminal-ss-2.png" class="w-full h-full object-cover" alt="Terminal SS App 1">',
            img2: '<img src="img/terminal-ss-3.png" class="w-full h-full object-cover" alt="Terminal SS App 2">',
            img3: '<img src="img/terminal-ss-4.png" class="w-full h-full object-cover" alt="Terminal SS Detalle 1">',
            img4: '<img src="img/terminal-ss-1.png" class="w-full h-full object-cover" alt="Terminal SS Detalle 2">'
        }
    };

    const modal = document.getElementById('project-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.getElementById('close-modal');
    const projectCards = document.querySelectorAll('.project-card');

    const modalTitle = document.getElementById('modal-title');
    const modalIconContainer = document.getElementById('modal-icon-container');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalDesc = document.getElementById('modal-description');

    const modalWebsiteBtn = document.getElementById('modal-website-btn');

    const modalImgMain = document.getElementById('modal-img-main');
    const modalImg1 = document.getElementById('modal-img-1');
    const modalImg2 = document.getElementById('modal-img-2');
    const modalImg3 = document.getElementById('modal-img-3');
    const modalImg4 = document.getElementById('modal-img-4');

    function openModal(event) {
        const projectId = event.currentTarget.getAttribute('data-project-id');
        const data = projectsData[projectId];

        if (data) {
            if (modalTitle) modalTitle.textContent = data.title;
            if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
            if (modalDesc) modalDesc.textContent = data.description;

            if (modalWebsiteBtn && data.url) {
                modalWebsiteBtn.href = data.url;
            }

            if (modalIconContainer) {
                modalIconContainer.innerHTML = `<img src="${data.icon}" alt="${data.title}" class="w-[20px] h-[20px] object-contain" style="filter: brightness(0) saturate(100%) invert(6%) sepia(21%) saturate(2102%) hue-rotate(170deg) brightness(97%) contrast(93%); display: block;">`;
            }

            if (modalImgMain) modalImgMain.innerHTML = data.imgMain;
            if (modalImg1) modalImg1.innerHTML = data.img1;
            if (modalImg2) modalImg2.innerHTML = data.img2;
            if (modalImg3) modalImg3.innerHTML = data.img3;
            if (modalImg4) modalImg4.innerHTML = data.img4;
        }

        modal.classList.remove('hidden');

        setTimeout(() => {
            modalOverlay.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);

        document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
        modalOverlay.classList.add('opacity-0');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');

            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu || mobileMenu.classList.contains('-translate-y-full')) {
                document.body.classList.remove('overflow-hidden');
            }
        }, 300);
    }

    projectCards.forEach(card => card.addEventListener('click', openModal));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);


    /* ========================================================
       8. SISTEMA DE IDIOMAS (i18n) Y MONEDAS
       ======================================================== */
    window.currentLang = 'es';
    window.currentCurrency = 'PEN'; // 'PEN' o 'USD'

    // Objeto con las traducciones
    const translations = {
        'es': {
            // Navbar
            'nav_soluciones': 'Soluciones', 'nav_proyectos': 'Proyectos', 'nav_planes': 'Planes', 'nav_faq': 'FAQ', 'nav_wa': 'WhatsApp',
            // Hero
            'hero_tag': 'Impulsa tu evolución digital',
            'hero_title': 'Especialistas en<br>Soluciones Digitales.',
            'hero_desc': 'Transformamos ideas en resultados. Conectamos tu marca con el mundo a través de tres pilares fundamentales: Diseño, Tecnología y Comunicación.',
            'hero_btn_proyectos': 'Proyectos',
            'hero_btn_hablemos': 'Hablemos por WhatsApp',
            // Pilares
            'pil_title': 'Soluciones Digitales 360°',
            'pil_desc': 'Ofrecemos un ecosistema completo para que tu negocio crezca en el entorno digital.',
            'pil_com_t': 'Comunicación', 'pil_com_d': 'Conectamos marcas con personas mediante estrategias de marketing 360° y gestión de comunidades.',
            'pil_dis_t': 'Diseño', 'pil_dis_d': 'Branding, diseño UX/UI e interfaces digitales intuitivas y experiencias visuales memorables.',
            'pil_tec_t': 'Tecnología', 'pil_tec_d': 'Transformamos ideas en código sólido: desarrollamos software, apps y plataformas web de alto rendimiento.',
            'pil_aud_t': 'Audiovisual', 'pil_aud_d': 'Soluciones audiovisuales integrales con calidad cinematográfica. Resultados modernos y dinámicos.',
            // Portafolio
            'port_title': 'Proyectos diseñados con visión y propósito.',
            'port_desc': 'Conoce las marcas que ya han confiado en nuestra propuesta para cobrar vida en el entorno digital.',
            'port_link': 'Ver proyectos', 'port_tag1': 'Webs y Plataformas', 'port_tag2': 'Sistemas a Medida',
            // Planes
            'plan_main_title': 'Elige el ecosistema perfecto para tu marca.',
            'plan_toggle_normal': 'Precio Normal', 'plan_toggle_save': 'Ahorra 15%', 'plan_toggle_months': 'Primeros 3 meses',
            'tab_1': 'Paquetes Integrales', 'tab_2': 'Paquetes PLUS', 'tab_3': 'Solo Tecnología',
            'plan_per_month': '/ mes', 'btn_contact': 'Contactar', 'badge_recommended': 'Recomendado', 'btn_hire': 'Contratar Ahora',
            'plan_single_payment': 'Pago único (3 meses de garantía)',
            'plan_quote': 'Cotizar', 'plan_quote_desc': 'Previa evaluación (3 meses de garantía)',
            // Diseño
            'design_title': 'Solo Diseño', 'design_desc': 'Servicios creativos de pago único para impulsar la imagen de tu negocio.',
            'design_logo_t': 'Logo Básico', 'design_logo_d': '3 propuestas iniciales + manual de uso básico.',
            'design_id_t': 'Identidad Visual Completa', 'design_id_d': 'Logo, Tipografías, Paleta, Social Media Kit y Papelería.',
            'design_consult': 'CONSULTAR',
            // FAQ
            'faq_title': 'Preguntas Frecuentes (FAQ)',
            'faq_q1': '¿Los planes web incluyen Hosting y Dominio?', 'faq_a1': 'Sí, nuestros servicios de desarrollo incluyen el primer año de Hosting y Dominio (.com o .pe).',
            'faq_q2': '¿Qué pasa después del primer año con mi web?', 'faq_a2': 'Solo deberás abonar la renovación anual del servicio de servidor (Hosting) y Dominio. Te avisaremos con anticipación.',
            'faq_q3': '¿El presupuesto de anuncios está incluido?', 'faq_a3': 'No. Cubrimos la gestión profesional. El presupuesto de inversión lo define el cliente directamente en la plataforma (Facebook/Google).',
            'faq_q4': '¿Puedo tener hosting y dominio gratis?', 'faq_a4': 'Sí, hay servicios como Canva o Github que te prestan un dominio y hosting por un tiempo indefinido, pero solo para páginas estáticas.',
            // Footer
            'footer_desc': '¿Listo para llevar tu marca al siguiente nivel? Escríbenos y hagamos que las cosas sucedan.',
            'footer_contact': 'Contacto', 'footer_legal': 'Legal', 'footer_privacy': 'Política de Privacidad', 'footer_terms': 'Términos y Condiciones',
            'footer_rights': '© 2026 The Frog. Todos los derechos reservados.'
        },
        'en': {
            // Navbar
            'nav_soluciones': 'Solutions', 'nav_proyectos': 'Projects', 'nav_planes': 'Plans', 'nav_faq': 'FAQ', 'nav_wa': 'WhatsApp',
            // Hero
            'hero_tag': 'Boost your digital evolution',
            'hero_title': 'Specialists in<br>Digital Solutions.',
            'hero_desc': 'We transform ideas into results. We connect your brand with the world through three fundamental pillars: Design, Technology, and Communication.',
            'hero_btn_proyectos': 'Projects',
            'hero_btn_hablemos': 'Let\'s talk on WhatsApp',
            // Pilares
            'pil_title': '360° Digital Solutions',
            'pil_desc': 'We offer a complete ecosystem for your business to grow in the digital environment.',
            'pil_com_t': 'Communication', 'pil_com_d': 'We connect brands with people through 360° marketing strategies and community management.',
            'pil_dis_t': 'Design', 'pil_dis_d': 'Branding, UX/UI design, intuitive digital interfaces, and memorable visual experiences.',
            'pil_tec_t': 'Technology', 'pil_tec_d': 'We transform ideas into solid code: we develop high-performance software, apps, and web platforms.',
            'pil_aud_t': 'Audiovisual', 'pil_aud_d': 'Comprehensive audiovisual solutions with cinematic quality. Modern and dynamic results.',
            // Portafolio
            'port_title': 'Projects designed with vision and purpose.',
            'port_desc': 'Meet the brands that have already trusted our proposal to come to life in the digital environment.',
            'port_link': 'View projects', 'port_tag1': 'Websites & Platforms', 'port_tag2': 'Custom Systems',
            // Planes
            'plan_main_title': 'Choose the perfect ecosystem for your brand.',
            'plan_toggle_normal': 'Normal Price', 'plan_toggle_save': 'Save 15%', 'plan_toggle_months': 'First 3 months',
            'tab_1': 'Integral Packages', 'tab_2': 'PLUS Packages', 'tab_3': 'Technology Only',
            'plan_per_month': '/ month', 'btn_contact': 'Contact Us', 'badge_recommended': 'Recommended', 'btn_hire': 'Hire Now',
            'plan_single_payment': 'Single payment (3 months warranty)',
            'plan_quote': 'Quote', 'plan_quote_desc': 'Prior evaluation (3 months warranty)',
            // Diseño
            'design_title': 'Design Only', 'design_desc': 'One-time creative services to boost your business image.',
            'design_logo_t': 'Basic Logo', 'design_logo_d': '3 initial proposals + basic usage manual.',
            'design_id_t': 'Complete Visual Identity', 'design_id_d': 'Logo, Typography, Palette, Social Media Kit and Stationery.',
            'design_consult': 'CONSULT',
            // FAQ
            'faq_title': 'Frequently Asked Questions (FAQ)',
            'faq_q1': 'Do the web plans include Hosting and Domain?', 'faq_a1': 'Yes, our development services include the first year of Hosting and Domain (.com or .pe).',
            'faq_q2': 'What happens after the first year with my website?', 'faq_a2': 'You will only need to pay the annual renewal for the server service (Hosting) and Domain. We will notify you in advance.',
            'faq_q3': 'Is the ad budget included?', 'faq_a3': 'No. We cover professional management. The investment budget is defined by the client directly on the platform (Facebook/Google).',
            'faq_q4': 'Can I get free hosting and domain?', 'faq_a4': 'Yes, there are services like Canva or Github that provide a domain and hosting for an indefinite time, but only for static pages.',
            // Footer
            'footer_desc': 'Ready to take your brand to the next level? Write to us and let\'s make things happen.',
            'footer_contact': 'Contact', 'footer_legal': 'Legal', 'footer_privacy': 'Privacy Policy', 'footer_terms': 'Terms and Conditions',
            'footer_rights': '© 2026 The Frog. All rights reserved.'
        }
    };

    // Usamos querySelectorAll para obtener todos los botones (escritorio y móvil)
    const btnLangs = document.querySelectorAll('.btn-lang');
    const btnCurrencies = document.querySelectorAll('.btn-currency');
    const langTexts = document.querySelectorAll('.lang-text');
    const currencyTexts = document.querySelectorAll('.currency-text');
    const currencySymbols = document.querySelectorAll('.currency-symbol');
    const priceValsElements = document.querySelectorAll('.price-val');

    // Cambiar Idioma
    function toggleLanguage() {
        window.currentLang = window.currentLang === 'es' ? 'en' : 'es';

        // Actualizar textos HTML
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[window.currentLang][key]) {
                element.innerHTML = translations[window.currentLang][key];
            }
        });

        // Actualizar el texto en TODOS los botones de idioma (móvil y PC)
        const newLangText = window.currentLang === 'es' ? 'EN' : 'ES';
        langTexts.forEach(el => el.textContent = newLangText);

        // Actualizar los enlaces de WhatsApp forzando un doble clic al toggle de descuento
        if (document.getElementById('discount-toggle')) {
            document.getElementById('discount-toggle').click();
            document.getElementById('discount-toggle').click();
        }
    }

    // Actualizar Precios
    window.updatePricesDisplay = function () {
        // Actualizar el símbolo de la moneda
        const symbol = window.currentCurrency === 'PEN' ? 'S/' : '$';
        currencySymbols.forEach(el => el.textContent = symbol);

        // Animar números
        priceValsElements.forEach(priceEl => {
            let targetVal;
            if (window.currentCurrency === 'PEN') {
                targetVal = window.isDiscounted ? priceEl.getAttribute('data-pen-discount') : priceEl.getAttribute('data-pen-normal');
            } else {
                targetVal = window.isDiscounted ? priceEl.getAttribute('data-usd-discount') : priceEl.getAttribute('data-usd-normal');
            }

            anime({
                targets: priceEl,
                innerHTML: [priceEl.innerHTML, targetVal],
                round: 1,
                easing: 'easeInOutExpo',
                duration: 800
            });
        });
    };

    // Cambiar Moneda
    function toggleCurrency() {
        window.currentCurrency = window.currentCurrency === 'PEN' ? 'USD' : 'PEN';

        // Actualizar el texto en TODOS los botones de moneda (móvil y PC)
        const newCurrText = window.currentCurrency === 'PEN' ? 'USD' : 'PEN';
        currencyTexts.forEach(el => el.textContent = newCurrText);

        window.updatePricesDisplay();
    }

    // Asignar el evento de clic a todos los botones correspondientes
    btnLangs.forEach(btn => btn.addEventListener('click', toggleLanguage));
    btnCurrencies.forEach(btn => btn.addEventListener('click', toggleCurrency));

});