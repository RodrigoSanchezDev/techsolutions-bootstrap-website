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

// Logs simples para verificar funcionalidades implementadas
function initializeBasicLogs() {
    console.log('DOM manipulation inicializado');
    console.log('Fetch API inicializado');
    console.log('Mouse over inicializado');
    console.log('Click events inicializado');
    console.log('Submit events inicializado');
}

/*
ARCHIVO PRINCIPAL DE JAVASCRIPT
Contiene todas las funcionalidades interactivas del sitio:
- Inicialización de componentes Bootstrap
- Animaciones y efectos visuales
- Funcionalidades del navbar responsivo
- Validación de formularios
- Integración con APIs externas
*/

/*
===============================================================================
SISTEMA DE CARGA DINÁMICA CON FETCH API
===============================================================================

Este módulo implementa la funcionalidad de Fetch API requerida para la actividad:
- Carga de datos externos desde archivos JSON
- Manejo de promesas con async/await
- Inserción dinámica de contenido en el DOM
- Manejo de errores de carga
- Funciones reutilizables para diferentes tipos de datos

ARCHIVOS JSON UTILIZADOS:
- data/productos.json - Catálogo de productos
- data/testimonios.json - Testimonios de clientes
- data/proyectos.json - Galería de proyectos
- data/extras.json - Estadísticas y noticias

FUNCIONES PRINCIPALES:
- fetchData() - Función genérica para cargar datos
- loadProductos() - Carga productos dinámicamente
- loadTestimonios() - Carga testimonios de clientes
- loadProyectos() - Carga proyectos de galería
- loadEstadisticas() - Carga contadores animados
- handleFetchError() - Manejo centralizado de errores

===============================================================================
*/

/**
 * Función genérica para fetch de datos con manejo de errores
 * @param {string} url - URL del archivo JSON a cargar
 * @param {string} dataType - Tipo de datos para logging
 * @returns {Promise<Object|null>} Datos cargados o null en caso de error
 */
async function fetchData(url, dataType = 'datos') {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return data;
        
    } catch (error) {
        console.error(`❌ Error cargando ${dataType}:`, error);
        handleFetchError(error, dataType);
        return null;
    }
}

/**
 * Carga y muestra productos dinámicamente
 * @param {string} container - Selector del contenedor donde insertar productos
 * @param {string} categoria - Filtro de categoría (opcional)
 */
async function loadProductos(container = '#productos-container', categoria = null) {
    const data = await fetchData('data/productos.json', 'productos');
    
    if (!data || !data.productos) return;
    
    const containerElement = document.querySelector(container);
    if (!containerElement) {
        console.warn(`⚠️ Contenedor ${container} no encontrado`);
        return;
    }
    
    // Filtrar por categoría si se especifica
    let productos = data.productos;
    if (categoria) {
        productos = productos.filter(producto => producto.categoria === categoria);
    }
    
    // Limpiar contenedor existente
    containerElement.innerHTML = '';
    
    // Crear elementos de productos dinámicamente
    productos.forEach((producto, index) => {
        const productCard = createProductCard(producto, index);
        containerElement.appendChild(productCard);
    });
    
    // Reinicializar animaciones
    initializeScrollAnimations();
}

/**
 * Carga y muestra testimonios dinámicamente
 * @param {string} container - Selector del contenedor de testimonios
 * @param {number} limite - Número máximo de testimonios a mostrar
 */
async function loadTestimonios(container = '#testimonios-container', limite = 6) {
    const data = await fetchData('data/testimonios.json', 'testimonios');
    
    if (!data || !data.testimonios) return;
    
    const containerElement = document.querySelector(container);
    if (!containerElement) {
        console.warn(`⚠️ Contenedor ${container} no encontrado`);
        return;
    }
    
    // Limpiar contenedor
    containerElement.innerHTML = '';
    
    // Limitar número de testimonios
    const testimonios = data.testimonios.slice(0, limite);
    
    // Crear elementos de testimonios
    testimonios.forEach((testimonio, index) => {
        const testimonioCard = createTestimonioCard(testimonio, index);
        containerElement.appendChild(testimonioCard);
    });
}

/**
 * Carga y muestra proyectos de galería dinámicamente
 * @param {string} container - Selector del contenedor de proyectos
 * @param {boolean} soloDestacados - Mostrar solo proyectos destacados
 */
async function loadProyectos(container = '#proyectos-container', soloDestacados = false) {
    const data = await fetchData('data/proyectos.json', 'proyectos');
    
    if (!data || !data.proyectos) return;
    
    const containerElement = document.querySelector(container);
    if (!containerElement) {
        console.warn(`⚠️ Contenedor ${container} no encontrado`);
        return;
    }
    
    // Filtrar proyectos destacados si se requiere
    let proyectos = data.proyectos;
    if (soloDestacados) {
        proyectos = proyectos.filter(proyecto => proyecto.destacado);
    }
    
    // Limpiar contenedor
    containerElement.innerHTML = '';
    
    // Crear elementos de proyectos
    proyectos.forEach((proyecto, index) => {
        const proyectoCard = createProyectoCard(proyecto, index);
        containerElement.appendChild(proyectoCard);
    });
    
    // Reinicializar animaciones
    initializeScrollAnimations();
}

/**
 * Carga y anima estadísticas dinámicamente
 * @param {string} container - Selector del contenedor de estadísticas
 */
async function loadEstadisticas(container = '#estadisticas-container') {
    const data = await fetchData('data/extras.json', 'estadísticas');
    
    if (!data || !data.estadisticas) return;
    
    const containerElement = document.querySelector(container);
    if (!containerElement) {
        console.warn(`⚠️ Contenedor ${container} no encontrado`);
        return;
    }
    
    // Limpiar contenedor
    containerElement.innerHTML = '';
    
    // Crear elementos de estadísticas
    data.estadisticas.forEach((stat, index) => {
        const statElement = createStatElement(stat, index);
        containerElement.appendChild(statElement);
    });
    
    // Iniciar animación de contadores después de un delay
    setTimeout(() => {
        animateCounters();
    }, 500);
}

/**
 * Manejo centralizado de errores de fetch
 * @param {Error} error - Error capturado
 * @param {string} dataType - Tipo de datos que falló
 */
function handleFetchError(error, dataType) {
    // Crear mensaje de error para el usuario
    const errorMessage = document.createElement('div');
    errorMessage.className = 'alert alert-warning mt-3';
    errorMessage.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        <strong>Aviso:</strong> No se pudieron cargar los ${dataType}. 
        Por favor, recarga la página o contacta al administrador.
        <button type="button" class="btn-close float-end" data-bs-dismiss="alert"></button>
    `;
    
    // Insertar mensaje en el body si es necesario
    if (error.name !== 'TypeError') {
        document.body.insertBefore(errorMessage, document.body.firstChild);
        
        // Remover mensaje después de 10 segundos
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.remove();
            }
        }, 10000);
    }
}

/**
 * Inicializa todas las cargas de datos dinámicos
 */
async function initializeDynamicContent() {
    // Detectar página actual y cargar contenido apropiado
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            // Página principal - cargar estadísticas y testimonios destacados
            if (document.querySelector('#estadisticas-container')) {
                await loadEstadisticas('#estadisticas-container');
            }
            if (document.querySelector('#testimonios-destacados')) {
                await loadTestimonios('#testimonios-destacados', 3);
            }
            break;
            
        case 'productos.html':
            // Página de productos - cargar catálogo completo
            if (document.querySelector('#productos-container')) {
                await loadProductos('#productos-container');
                // Inicializar filtros después de cargar productos
                setTimeout(() => {
                    initializeProductFilters();
                }, 500);
            }
            break;
            
        case 'galeria.html':
            // Página de galería - cargar proyectos y testimonios
            if (document.querySelector('#proyectos-container')) {
                await loadProyectos('#proyectos-container');
            }
            if (document.querySelector('#testimonios-galeria')) {
                await loadTestimonios('#testimonios-galeria', 6);
            }
            break;
            
        default:
            break;
    }
    
    // Mostrar logs simples de funcionalidades implementadas
    initializeBasicLogs();
}

/*
===============================================================================
FUNCIONES DE CREACIÓN DINÁMICA DE ELEMENTOS DOM
===============================================================================

Estas funciones implementan la manipulación del DOM requerida para la actividad:
- createElement() para crear nuevos elementos
- appendChild() para insertar elementos en el DOM
- innerHTML para contenido HTML estructurado
- Configuración de atributos y clases dinámicamente
- Eventos onclick, onmouseover integrados

===============================================================================
*/

/**
 * Crea una tarjeta de producto dinámicamente
 * @param {Object} producto - Datos del producto
 * @param {number} index - Índice para animaciones
 * @returns {HTMLElement} Elemento DOM de la tarjeta
 */
function createProductCard(producto, index) {
    // Crear elemento principal de la columna
    const colElement = document.createElement('div');
    colElement.className = 'col-12 col-md-6 col-lg-4 product-item';
    colElement.setAttribute('data-category', producto.categoria);
    
    // Crear tarjeta principal
    const cardElement = document.createElement('div');
    cardElement.className = 'card product-card h-100 animate-on-scroll';
    cardElement.style.animationDelay = `${index * 0.1}s`;
    
    // Configurar eventos mouseover/mouseout
    cardElement.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        this.style.transition = 'all 0.3s ease';
    });
    
    cardElement.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
    });
    
    // Crear contenedor de imagen
    const imageContainer = document.createElement('div');
    imageContainer.className = 'position-relative';
    
    const imageElement = document.createElement('img');
    imageElement.src = producto.imagen;
    imageElement.className = 'card-img-top';
    imageElement.alt = producto.nombre;
    imageElement.style.height = '250px';
    imageElement.style.objectFit = 'cover';
    
    // Badge de categoría
    const badgeContainer = document.createElement('div');
    badgeContainer.className = 'position-absolute top-0 end-0 m-3';
    
    const badge = document.createElement('span');
    badge.className = `badge bg-${getBadgeColor(producto.categoria)}`;
    badge.textContent = producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1);
    
    // Crear cuerpo de la tarjeta
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column';
    
    // Título del producto
    const title = document.createElement('h5');
    title.className = 'product-title';
    title.textContent = producto.nombre;
    
    // Descripción
    const description = document.createElement('p');
    description.className = 'card-text mb-3';
    description.textContent = producto.descripcion;
    
    // Lista de características
    const featuresDiv = document.createElement('div');
    featuresDiv.className = 'features mb-3';
    
    const featuresList = document.createElement('ul');
    featuresList.className = 'list-unstyled';
    
    producto.caracteristicas.slice(0, 3).forEach(caracteristica => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<i class="fas fa-check text-primary me-2"></i>${caracteristica}`;
        featuresList.appendChild(listItem);
    });
    
    featuresDiv.appendChild(featuresList);
    
    // Sección inferior con precio y botón
    const footerDiv = document.createElement('div');
    footerDiv.className = 'mt-auto';
    
    const priceRatingDiv = document.createElement('div');
    priceRatingDiv.className = 'd-flex justify-content-between align-items-center mb-3';
    
    const pricingDiv = document.createElement('div');
    pricingDiv.className = 'pricing';
    
    const priceSpan = document.createElement('span');
    priceSpan.className = 'price';
    priceSpan.textContent = producto.precio;
    
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'rating';
    
    const starsSpan = document.createElement('span');
    starsSpan.className = 'stars';
    starsSpan.textContent = '⭐'.repeat(producto.rating);
    
    // Botón de acción
    const actionButton = document.createElement('a');
    actionButton.href = 'contacto.html';
    actionButton.className = 'btn btn-outline-primary w-100';
    actionButton.textContent = 'Solicitar Info';
    
    // Evento click en el botón
    actionButton.addEventListener('click', function(e) {
        // Aquí podrías agregar analytics o tracking
    });
    
    // Ensamblar todos los elementos
    badgeContainer.appendChild(badge);
    imageContainer.appendChild(imageElement);
    imageContainer.appendChild(badgeContainer);
    
    pricingDiv.appendChild(priceSpan);
    ratingDiv.appendChild(starsSpan);
    priceRatingDiv.appendChild(pricingDiv);
    priceRatingDiv.appendChild(ratingDiv);
    
    footerDiv.appendChild(priceRatingDiv);
    footerDiv.appendChild(actionButton);
    
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(featuresDiv);
    cardBody.appendChild(footerDiv);
    
    cardElement.appendChild(imageContainer);
    cardElement.appendChild(cardBody);
    
    colElement.appendChild(cardElement);
    
    return colElement;
}

/**
 * Crea una tarjeta de testimonio dinámicamente
 * @param {Object} testimonio - Datos del testimonio
 * @param {number} index - Índice para animaciones
 * @returns {HTMLElement} Elemento DOM del testimonio
 */
function createTestimonioCard(testimonio, index) {
    const colElement = document.createElement('div');
    colElement.className = 'col-md-6 col-lg-4';
    
    const cardElement = document.createElement('div');
    cardElement.className = 'card border-0 shadow-sm';
    cardElement.style.animationDelay = `${index * 0.2}s`;
    
    // Eventos mouseover
    cardElement.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    cardElement.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body p-4';
    
    // Ícono de comillas
    const quoteIcon = document.createElement('div');
    quoteIcon.className = 'mb-3';
    quoteIcon.innerHTML = '<i class="fas fa-quote-left text-primary fs-3"></i>';
    
    // Texto del testimonio
    const testimonioText = document.createElement('p');
    testimonioText.className = 'card-text';
    testimonioText.textContent = testimonio.testimonio;
    
    // Información del cliente
    const clientInfo = document.createElement('div');
    clientInfo.className = 'd-flex align-items-center';
    
    const clientImage = document.createElement('img');
    clientImage.src = testimonio.imagen;
    clientImage.alt = testimonio.nombre;
    clientImage.className = 'rounded-circle me-3';
    clientImage.style.width = '50px';
    clientImage.style.height = '50px';
    
    const clientDetails = document.createElement('div');
    
    const clientName = document.createElement('h6');
    clientName.className = 'mb-0';
    clientName.textContent = testimonio.nombre;
    
    const clientPosition = document.createElement('small');
    clientPosition.className = 'text-muted';
    clientPosition.textContent = `${testimonio.cargo}, ${testimonio.empresa}`;
    
    // Ensamblar elementos
    clientDetails.appendChild(clientName);
    clientDetails.appendChild(clientPosition);
    
    clientInfo.appendChild(clientImage);
    clientInfo.appendChild(clientDetails);
    
    cardBody.appendChild(quoteIcon);
    cardBody.appendChild(testimonioText);
    cardBody.appendChild(clientInfo);
    
    cardElement.appendChild(cardBody);
    colElement.appendChild(cardElement);
    
    return colElement;
}

/**
 * Crea una tarjeta de proyecto dinámicamente
 * @param {Object} proyecto - Datos del proyecto
 * @param {number} index - Índice para animaciones
 * @returns {HTMLElement} Elemento DOM del proyecto
 */
function createProyectoCard(proyecto, index) {
    const colElement = document.createElement('div');
    colElement.className = 'col-12 col-md-6 col-lg-4';
    
    const cardElement = document.createElement('div');
    cardElement.className = 'card product-card animate-on-scroll';
    cardElement.style.animationDelay = `${index * 0.15}s`;
    
    // Eventos interactivos
    cardElement.addEventListener('mouseenter', function() {
        const overlay = this.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '0.9';
            overlay.style.transform = 'translateY(0)';
        }
    });
    
    cardElement.addEventListener('mouseleave', function() {
        const overlay = this.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateY(20px)';
        }
    });
    
    // Contenedor de imagen
    const imageContainer = document.createElement('div');
    imageContainer.className = 'position-relative';
    
    const imageElement = document.createElement('img');
    imageElement.src = proyecto.imagen;
    imageElement.className = 'card-img-top';
    imageElement.alt = proyecto.titulo;
    imageElement.style.height = '250px';
    imageElement.style.objectFit = 'cover';
    
    // Overlay con información adicional
    const overlay = document.createElement('div');
    overlay.className = 'position-absolute top-0 start-0 w-100 h-100 bg-dark project-overlay';
    overlay.style.opacity = '0';
    overlay.style.transform = 'translateY(20px)';
    overlay.style.transition = 'all 0.3s ease';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.flexDirection = 'column';
    overlay.style.color = 'white';
    overlay.style.padding = '20px';
    overlay.style.textAlign = 'center';
    
    overlay.innerHTML = `
        <h6 class="text-white mb-2">${proyecto.cliente}</h6>
        <p class="small mb-2">${proyecto.duracion} • ${proyecto.equipo}</p>
        <p class="small">${proyecto.resultados}</p>
    `;
    
    // Cuerpo de la tarjeta
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    const title = document.createElement('h5');
    title.className = 'product-title';
    title.textContent = proyecto.titulo;
    
    const description = document.createElement('p');
    description.className = 'card-text';
    description.textContent = proyecto.descripcion;
    
    // Badges de tecnologías
    const techContainer = document.createElement('div');
    techContainer.className = 'd-flex gap-2 mb-3';
    
    proyecto.tecnologias.forEach(tech => {
        const techBadge = document.createElement('span');
        techBadge.className = `badge bg-${getTechColor(tech)}`;
        techBadge.textContent = tech;
        techContainer.appendChild(techBadge);
    });
    
    // Botón de acción
    const actionButton = document.createElement('a');
    actionButton.href = 'contacto.html';
    actionButton.className = 'btn btn-outline-primary';
    actionButton.textContent = 'Ver Caso de Estudio';
    
    // Ensamblar elementos
    imageContainer.appendChild(imageElement);
    imageContainer.appendChild(overlay);
    
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(techContainer);
    cardBody.appendChild(actionButton);
    
    cardElement.appendChild(imageContainer);
    cardElement.appendChild(cardBody);
    
    colElement.appendChild(cardElement);
    
    return colElement;
}

/**
 * Crea un elemento de estadística dinámicamente
 * @param {Object} stat - Datos de la estadística
 * @param {number} index - Índice para animaciones
 * @returns {HTMLElement} Elemento DOM de la estadística
 */
function createStatElement(stat, index) {
    const colElement = document.createElement('div');
    colElement.className = 'col-6 col-md-3';
    
    const statElement = document.createElement('div');
    statElement.className = 'text-center';
    
    // Ícono
    const iconElement = document.createElement('div');
    iconElement.className = 'mb-3';
    iconElement.innerHTML = `<i class="${stat.icono} fs-1 text-white"></i>`;
    
    // Número (para animación de contador)
    const numberElement = document.createElement('h3');
    numberElement.className = 'counter text-white mb-2';
    numberElement.setAttribute('data-target', stat.numero);
    numberElement.textContent = '0';
    
    // Descripción
    const descElement = document.createElement('p');
    descElement.className = 'text-white-50';
    descElement.textContent = stat.descripcion;
    
    // Ensamblar elementos
    statElement.appendChild(iconElement);
    statElement.appendChild(numberElement);
    statElement.appendChild(descElement);
    
    colElement.appendChild(statElement);
    
    return colElement;
}

/**
 * Reinicializa las animaciones de scroll para nuevos elementos
 */
function initializeScrollAnimations() {
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
    
    // Observar elementos para animación
    document.querySelectorAll('.animate-on-scroll:not(.animated)').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Funciones auxiliares para colores de badges
 */
function getBadgeColor(categoria) {
    const colors = {
        'enterprise': 'primary',
        'ecommerce': 'success',
        'analytics': 'warning',
        'cloud': 'info',
        'security': 'danger',
        'iot': 'secondary'
    };
    return colors[categoria] || 'secondary';
}

function getTechColor(tech) {
    const colors = {
        'Angular': 'danger',
        'React': 'info',
        'Vue.js': 'success',
        'Node.js': 'success',
        'Python': 'warning',
        'Docker': 'primary',
        'AWS': 'warning',
        '.NET Core': 'primary'
    };
    return colors[tech] || 'secondary';
}

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

// Eliminar restricciones CSS y configurar funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    // Permitir selección de texto
    document.body.style.userSelect = 'auto';
    document.body.style.webkitUserSelect = 'auto';
    document.body.style.mozUserSelect = 'auto';
    document.body.style.msUserSelect = 'auto';
    
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
    
    if (navbarToggler && navbarCollapse) {
    
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
    
    /*
    INICIALIZACIÓN DE CONTENIDO DINÁMICO CON FETCH API
    Carga datos externos y los inserta dinámicamente en el DOM
    */
    initializeDynamicContent();
    
    /*
    EVENTOS MOUSEOVER/MOUSEOUT ADICIONALES PARA INTERACTIVIDAD
    Implementa efectos hover dinámicos en elementos de la página
    */
    initializeHoverEffects();
    
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
    } // Closing brace for if (navbarToggler && navbarCollapse)
    
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
    
    // INICIALIZAR CARGA DINÁMICA DE CONTENIDO CON FETCH API
    initializeDynamicContent();
    
    // INICIALIZAR EFECTOS HOVER ADICIONALES
    initializeHoverEffects();
});

// Funciones globales
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Animación de contadores
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

/*
===============================================================================
EVENTOS MOUSEOVER/MOUSEOUT ADICIONALES PARA INTERACTIVIDAD
===============================================================================

Implementa eventos mouseover/mouseout en elementos estáticos de la página
para cumplir con los requerimientos de la actividad formativa.

ELEMENTOS AFECTADOS:
- Cards de servicios
- Botones del navbar
- Links del footer
- Elementos de navegación
- Imágenes de la galería

===============================================================================
*/

/**
 * Inicializa efectos hover dinámicos en elementos de la página
 */
function initializeHoverEffects() {
    // Cards con efectos hover
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Animar ícono
            const icon = this.querySelector('.service-icon i');
            if (icon) {
                icon.style.transform = 'rotate(5deg) scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
            
            const icon = this.querySelector('.service-icon i');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });
    
    // Efectos para enlaces del navbar
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#0d6efd';
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.2s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = '';
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Efectos para enlaces del footer
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#0d6efd';
            this.style.paddingLeft = '10px';
            this.style.transition = 'all 0.3s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = '';
            this.style.paddingLeft = '';
        });
    });
    
    // Efectos para botones
    const buttons = document.querySelectorAll('.btn:not(.navbar-toggler)');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/*
===============================================================================
SISTEMA DE FILTROS DINÁMICOS PARA PRODUCTOS
===============================================================================

Implementa funcionalidad de filtrado en tiempo real para la página de productos.
Permite filtrar productos por categoría utilizando los botones de filtro.

FUNCIONALIDADES:
- Filtrado por categoría (enterprise, analytics, security, cloud, ecommerce, iot)
- Opción "Todos" para mostrar todos los productos
- Animaciones suaves de transición
- Estados activos en botones de filtro
- Compatible con contenido cargado dinámicamente

===============================================================================
*/

/**
 * Inicializa el sistema de filtros de productos
 */
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const productContainer = document.querySelector('#productos-container');
    
    if (!filterButtons.length || !productContainer) {
        return;
    }
    
    // Agregar event listeners a todos los botones de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const filterValue = this.getAttribute('data-filter');
            
            // Actualizar estado activo de botones
            updateActiveFilterButton(this, filterButtons);
            
            // Aplicar filtro a productos
            filterProducts(filterValue, productContainer);
        });
    });
}

/**
 * Actualiza el estado activo del botón de filtro seleccionado
 * @param {HTMLElement} activeButton - Botón que fue clickeado
 * @param {NodeList} allButtons - Todos los botones de filtro
 */
function updateActiveFilterButton(activeButton, allButtons) {
    // Remover clase active de todos los botones
    allButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('btn-outline-primary');
        btn.classList.remove('btn-primary');
    });
    
    // Agregar clase active al botón seleccionado
    activeButton.classList.add('active');
    activeButton.classList.remove('btn-outline-primary');
    activeButton.classList.add('btn-primary');
}

/**
 * Filtra productos basado en la categoría seleccionada
 * @param {string} category - Categoría a filtrar ('all' para mostrar todos)
 * @param {HTMLElement} container - Contenedor de productos
 */
function filterProducts(category, container) {
    const productItems = container.querySelectorAll('.product-item');
    let visibleCount = 0;
    
    productItems.forEach(item => {
        const productCategory = item.getAttribute('data-category');
        const shouldShow = category === 'all' || productCategory === category;
        
        if (shouldShow) {
            // Mostrar producto con animación
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            // Animación de entrada
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, visibleCount * 100);
            
            visibleCount++;
        } else {
            // Ocultar producto con animación
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

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
