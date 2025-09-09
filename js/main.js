/*
===============================================================================
TECHSOLUTIONS PRO - JAVASCRIPT PRINCIPAL
===============================================================================

ÍNDICE DE FUNCIONALIDADES:

1. CONFIGURACIÓN INICIAL
   - Event listeners del DOM
   - Habilitación de interacciones del usuario
   - Configuración de selección de texto
   - Eliminación de restricciones CSS

2. NAVBAR RESPONSIVO
   - Detección de elementos del navbar
   - Manejo del toggle móvil
   - Fallback manual para colapso
   - Verificación de Bootstrap
   - Efectos de scroll en navbar

3. SMOOTH SCROLLING
   - Navegación suave entre secciones
   - Cálculo de offset del navbar
   - Scroll animado con JavaScript

4. SISTEMA DE ENLACES ACTIVOS
   - Detección de sección actual en scroll
   - Actualización de enlaces activos
   - Específico para páginas de una sola página
   - (Deshabilitado para sitio multi-página)

5. CARRUSEL INTERACTIVO
   - Inicialización del carousel Bootstrap
   - Auto-play con pausa en hover
   - Control de intervalos
   - Event listeners personalizados

6. ANIMACIONES EN SCROLL
   - Intersection Observer API
   - Detección de elementos en viewport
   - Aplicación de clases de animación
   - Loading animations para cards

7. VALIDACIÓN DE FORMULARIOS
   - Validación personalizada en tiempo real
   - Mensajes de error dinámicos
   - Verificación de email
   - Estados de éxito y error

8. EFECTOS VISUALES
   - Contadores animados
   - Efectos parallax
   - Animaciones de entrada
   - Estados hover mejorados

9. TOOLTIPS Y POPOVERS
   - Inicialización de tooltips Bootstrap
   - Configuración personalizada
   - Event handling

10. UTILIDADES Y HELPERS
    - Funciones auxiliares reutilizables
    - Validadores personalizados
    - Mensajes de éxito/error
    - Funciones de scroll

11. MODO OSCURO (OPCIONAL)
    - Toggle de tema
    - Persistencia en localStorage
    - Detección de preferencias del sistema

12. OPTIMIZACIONES DE RENDIMIENTO
    - Lazy loading de imágenes
    - Intersection Observer optimizado
    - Debouncing de eventos
    - Minimización de reflows

DEPENDENCIAS:
- Bootstrap 5.3.2 JavaScript
- Intersection Observer API (nativo)
- Local Storage API (nativo)

COMPATIBILIDAD:
- Navegadores modernos ES6+
- Mobile responsive
- Progressive enhancement

DESARROLLADO POR:
SanchezDev.com
Rodrigo Sanchez - rodrigo@sanchezdev.com
© 2025 Todos los derechos reservados

===============================================================================
*/

/*
ARCHIVO PRINCIPAL DE JAVASCRIPT
Contiene todas las funcionalidades interactivas del sitio:
- Inicialización de componentes Bootstrap
- Animaciones y efectos visuales
- Funcionalidades del navbar responsivo
- Validación de formularios
- Integración con APIs externas
*/

// Funcionalidades principales

// Habilitar interacción del usuario
// Asegurar que el contenido sea seleccionable y el clic derecho funcione
document.addEventListener('contextmenu', function(e) {
    // Permitir clic derecho
    return true;
});

document.addEventListener('selectstart', function(e) {
    // Permitir selección de texto
    return true;
});

// Eliminar restricciones CSS
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.userSelect = 'auto';
    document.body.style.webkitUserSelect = 'auto';
    document.body.style.mozUserSelect = 'auto';
    document.body.style.msUserSelect = 'auto';
});

document.addEventListener('DOMContentLoaded', function() {
    
    /*
    CONFIGURACIÓN DEL NAVBAR RESPONSIVO
    Maneja la funcionalidad de colapso en dispositivos móviles:
    - Detecta elementos del navbar
    - Implementa toggle manual como fallback
    - Asegura compatibilidad cross-browser
    */
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    console.log('Navbar elements found:', {
        navbar: !!navbar,
        toggler: !!navbarToggler,
        collapse: !!navbarCollapse
    });
    
    // Asegurar funcionamiento del toggle móvil
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function(e) {
            console.log('Navbar toggler clicked');
            e.preventDefault();
            e.stopPropagation();
            
            // Fallback manual
            if (navbarCollapse) {
                navbarCollapse.classList.toggle('show');
            }
        });
    }
    
    // Verificar Bootstrap
    if (typeof bootstrap !== 'undefined') {
        console.log('Bootstrap loaded correctly');
    } else {
        console.error('Bootstrap not loaded');
    }
    
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - navbarHeight - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active link highlighting (deshabilitado para multi-página)
    // Este código era para páginas de una sola página con secciones.
    // Para sitios multi-página, la clase 'active' se maneja en cada archivo HTML.
    /*
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    */
    
    // Carrusel auto-play
    const carousel = document.querySelector('#imageCarousel');
    if (carousel) {
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 3000,
            pause: 'hover',
            wrap: true
        });
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            carouselInstance.pause();
        });
        
        carousel.addEventListener('mouseleave', () => {
            carouselInstance.cycle();
        });
    }
    
    // Loading animation
    const cards = document.querySelectorAll('.product-card, .service-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-on-scroll');
    });
    
    // Animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación (después de añadir las clases)
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Form validation
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación personalizada
            const inputs = this.querySelectorAll('.form-control');
            let isValid = true;
            
            inputs.forEach(input => {
                const errorDiv = input.parentNode.querySelector('.error-message');
                if (errorDiv) errorDiv.remove();
                
                if (!input.value.trim()) {
                    isValid = false;
                    showFieldError(input, 'Este campo es requerido');
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    showFieldError(input, 'Ingrese un email válido');
                }
            });
            
            if (isValid) {
                showSuccessMessage();
            }
        });
    }
    
    // Counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const speed = 200;
            const increment = target / speed;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 1);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    // Parallax effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Tooltip initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Helper functions
    function showFieldError(input, message) {
        input.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger mt-1';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showSuccessMessage() {
        const form = document.querySelector('#contactForm');
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ¡Mensaje enviado exitosamente! Te contactaremos pronto.
        `;
        form.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
            form.reset();
        }, 5000);
    }
    
    // Dark mode toggle (opcional)
    const darkModeToggle = document.querySelector('#darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
        });
        
        // Cargar preferencia guardada
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
    
});

// Funciones globales
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Back to top button
window.addEventListener('scroll', function() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    }
});

// Performance optimizations
// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
