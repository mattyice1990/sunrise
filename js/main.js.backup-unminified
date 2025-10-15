// Intersection Observer for Scroll Animations
        document.addEventListener('DOMContentLoaded', function() {
            const observerOptions = {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal');
                        // Optional: Unobserve after animation to prevent re-triggering
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe all timeline steps
            const timelineSteps = document.querySelectorAll('.timeline-step');
            timelineSteps.forEach((step, index) => {
                // Add slight stagger delay to each step
                step.style.transitionDelay = `${index * 0.15}s`;
                observer.observe(step);
            });
        });

// ============================================
        // DROPDOWN NAVIGATION SYSTEM WITH HOVER
        // ============================================
        document.addEventListener('DOMContentLoaded', function() {
            const dropdowns = document.querySelectorAll('.dropdown');
            let closeTimeout;
            
            dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                const header = dropdown.querySelector('.dropdown-header');
                const link = dropdown.querySelector('.dropdown-link');
                
                // Hover functionality for desktop - auto close others
                dropdown.addEventListener('mouseenter', function() {
                    clearTimeout(closeTimeout);
                    if (window.innerWidth > 768) {
                        // Close all other dropdowns when hovering over this one
                        dropdowns.forEach(other => {
                            if (other !== dropdown) {
                                other.classList.remove('active');
                            }
                        });
                        dropdown.classList.add('active');
                    }
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    if (window.innerWidth > 768) {
                        closeTimeout = setTimeout(() => {
                            dropdown.classList.remove('active');
                        }, 200);
                    }
                });
                
                // Dropdown header click - expand menu (for mobile and desktop)
                if (header) {
                    header.addEventListener('click', function(e) {
                        // Don't expand if clicking on the "About" link or its children
                        if (link && (e.target === link || link.contains(e.target))) {
                            return; // Allow navigation to about page
                        }
                        
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Close all other dropdowns
                        dropdowns.forEach(other => {
                            if (other !== dropdown) other.classList.remove('active');
                        });
                        
                        // Toggle this dropdown
                        dropdown.classList.toggle('active');
                    });
                }
                
                // Toggle button click - works for both mobile and desktop
                if (toggle) {
                    toggle.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Close all other dropdowns
                        dropdowns.forEach(other => {
                            if (other !== dropdown) other.classList.remove('active');
                        });
                        
                        // Toggle this dropdown
                        dropdown.classList.toggle('active');
                    });
                }
            });
            
            // Close dropdowns when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.dropdown')) {
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                }
            });
            
            // Mobile menu toggle
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            
            if (mobileToggle) {
                mobileToggle.addEventListener('click', function() {
                    navLinks.classList.toggle('active');
                    this.classList.toggle('active');
                });
            }
            
            // Close mobile menu when clicking a link
            const navLinksAll = document.querySelectorAll('.nav-links a:not(.dropdown-toggle)');
            navLinksAll.forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    if (mobileToggle) {
                        mobileToggle.classList.remove('active');
                    }
                });
            });
            
            // Footer Dropdown Functionality
            const footerDropdowns = document.querySelectorAll('.footer-dropdown');
            
            footerDropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.footer-dropdown-toggle');
                const header = dropdown.querySelector('.footer-dropdown-header');
                const link = dropdown.querySelector('.footer-dropdown-link');
                
                // Header click - expand menu
                if (header) {
                    header.addEventListener('click', function(e) {
                        // Don't expand if clicking on the "About" link or its children
                        if (link && (e.target === link || link.contains(e.target))) {
                            return; // Allow navigation to about page
                        }
                        
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Close all other footer dropdowns
                        footerDropdowns.forEach(other => {
                            if (other !== dropdown) other.classList.remove('active');
                        });
                        
                        // Toggle this dropdown
                        dropdown.classList.toggle('active');
                    });
                }
                
                // Toggle button click
                if (toggle) {
                    toggle.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Close all other footer dropdowns
                        footerDropdowns.forEach(other => {
                            if (other !== dropdown) other.classList.remove('active');
                        });
                        
                        // Toggle this dropdown
                        dropdown.classList.toggle('active');
                    });
                }
            });
            
            // Close footer dropdowns when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.footer-dropdown')) {
                    footerDropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                }
            });
        });
        
        // Testimonial Carousel Functionality
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const totalSlides = slides.length;
        
        function showSlide(index) {
            // Remove active class from all slides and dots
            slides.forEach(slide => {
                slide.classList.remove('active', 'prev');
            });
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Add active class to current slide and dot
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }
        
        function moveCarousel(direction) {
            currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }
        
        function goToSlide(index) {
            currentSlide = index;
            showSlide(currentSlide);
        }
        
        // Auto-advance carousel every 5 seconds
        setInterval(() => {
            moveCarousel(1);
        }, 5000);
        
        // Gallery Carousel Functionality
        let currentGallerySlide = 0;
        const galleryCards = document.querySelectorAll('.gallery-card');
        const galleryDots = document.querySelectorAll('.gallery-dot');
        const totalGallerySlides = galleryCards.length;
        
        function showGallerySlide(index) {
            // Remove active class from all cards and dots
            galleryCards.forEach(card => {
                card.classList.remove('active');
            });
            galleryDots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Add active class to current card and dot
            galleryCards[index].classList.add('active');
            galleryDots[index].classList.add('active');
        }
        
        function moveGallery(direction) {
            currentGallerySlide = (currentGallerySlide + direction + totalGallerySlides) % totalGallerySlides;
            showGallerySlide(currentGallerySlide);
        }
        
        function goToGallerySlide(index) {
            currentGallerySlide = index;
            showGallerySlide(currentGallerySlide);
        }
        
        // Auto-advance gallery every 5 seconds
        setInterval(() => {
            moveGallery(1);
        }, 5000);
        
        // Gallery Card Lightbox Functionality
        const lightboxModal = document.createElement('div');
        lightboxModal.className = 'lightbox-modal';
        lightboxModal.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close">&times;</button>
                <img src="" alt="">
                <div class="lightbox-info">
                    <h3></h3>
                    <p></p>
                </div>
            </div>
        `;
        document.body.appendChild(lightboxModal);
        
        const lightboxImg = lightboxModal.querySelector('img');
        const lightboxTitle = lightboxModal.querySelector('h3');
        const lightboxDesc = lightboxModal.querySelector('p');
        const lightboxClose = lightboxModal.querySelector('.lightbox-close');
        
        // Link to gallery page when card is clicked
        galleryCards.forEach(card => {
            card.addEventListener('click', function() {
                if (!this.classList.contains('active')) return;
                window.location.href = 'gallery.html';
            });
        });
        
        // Close lightbox
        lightboxClose.addEventListener('click', function() {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close on background click
        lightboxModal.addEventListener('click', function(e) {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

// Counter animation function
        function animateCounter(element, target, duration = 2000, callback) {
            const start = 0;
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = Math.ceil(target);
                    clearInterval(timer);
                    if (callback) callback();
                } else {
                    element.textContent = Math.ceil(current);
                }
            }, 16);
        }
        
        // Intersection Observer to trigger animation when visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate mile radius counter
                    const mileCounter = document.getElementById('mile-radius-counter');
                    const mileTarget = parseInt(mileCounter.getAttribute('data-target'));
                    animateCounter(mileCounter, mileTarget, 2000);
                    
                    // Animate cities counter and show "+" when done
                    const citiesCounter = document.getElementById('cities-counter');
                    const citiesPlus = document.getElementById('cities-plus');
                    const citiesTarget = parseInt(citiesCounter.getAttribute('data-target'));
                    animateCounter(citiesCounter, citiesTarget, 2000, () => {
                        // Show the "+" sign after animation completes
                        if (citiesPlus) {
                            citiesPlus.style.opacity = '1';
                        }
                    });
                    
                    // Only animate once
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        // Observe the stats section
        const statsSection = document.getElementById('service-stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

let serviceAreaMap;
        
        // Service area radius in miles
        const SERVICE_RADIUS_MILES = 40;
        const MILES_TO_METERS = 1609.34;

        const businessLocation = {
            title: "Sunrise Roofers LLC",
            address1: "7320 N La Cholla Blvd Ste 154-276",
            address2: "Tucson, AZ 85741, USA",
            coords: {lat: 32.3399923325422, lng: -111.0119592071643}
        };
        
        const bensonLocation = {
            title: "Benson Service Area",
            address: "Benson, AZ 85602",
            coords: {lat: 31.9678809, lng: -110.2945396}
        };

        async function initServiceAreaMap() {
            // Request required libraries
            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
            
            // Create map centered on business location
            serviceAreaMap = new Map(document.getElementById("service-area-map"), {
                center: businessLocation.coords,
                mapTypeControl: true,
                fullscreenControl: true,
                streetViewControl: false,
                zoomControl: true,
                mapId: "SUNRISE_ROOFERS_MAP", // Required for AdvancedMarkerElement
                styles: [
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    }
                ]
            });

            // Add service area circle
            const serviceArea = new google.maps.Circle({
                strokeColor: "#F5A623",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#F5A623",
                fillOpacity: 0.15,
                map: serviceAreaMap,
                center: businessLocation.coords,
                radius: SERVICE_RADIUS_MILES * MILES_TO_METERS
            });

            // Fit map bounds to show entire service area circle
            const bounds = serviceArea.getBounds();
            serviceAreaMap.fitBounds(bounds);
            
            // Add slight padding to the bounds for better visual spacing
            setTimeout(() => {
                const currentZoom = serviceAreaMap.getZoom();
                serviceAreaMap.setZoom(currentZoom - 0.2);
            }, 100);

            // Create custom pin for marker
            const pinElement = new PinElement({
                background: "#F5A623",
                borderColor: "#FFFFFF",
                glyphColor: "#FFFFFF",
                scale: 1.3
            });

            // Add advanced marker for business location
            const marker = new AdvancedMarkerElement({
                position: businessLocation.coords,
                map: serviceAreaMap,
                title: businessLocation.title,
                content: pinElement.element
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="font-family: Arial, sans-serif; padding: 12px; max-width: 300px;">
                        <h3 style="margin: 0 0 10px 0; color: #F5A623; font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1px;">${businessLocation.title}</h3>
                        <p style="margin: 4px 0; font-size: 14px; color: #666; line-height: 1.5;">${businessLocation.address1}</p>
                        <p style="margin: 4px 0; font-size: 14px; color: #666; line-height: 1.5;">${businessLocation.address2}</p>
                        <p style="margin: 10px 0 12px 0; color: #1A1A1A; font-weight: 600; font-size: 13px;">
                            <i class="fas fa-circle" style="color: #F5A623; font-size: 8px;"></i> Service Area: ${SERVICE_RADIUS_MILES} mile radius
                        </p>
                        <div style="border-top: 1px solid #E0E0E0; padding-top: 12px; margin-top: 12px;">
                            <a href="https://google.com/maps/place/Sunrise+Roofers+LLC/@32.3398462,-111.0119968,17z/data=!3m1!5s0x86d674b1c06cc0ed:0xee29905f9ad6a485!4m6!3m5!1s0x41069aff002a721d:0x27f42115ff29e8e8!8m2!3d32.3398462!4d-111.0119968!16s%2Fg%2F11yf9bvjpk?entry=ttu&g_ep=EgoyMDI1MTAxMi4wIKXMDSoASAFQAw%3D%3D" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: #4285F4; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 2px 6px rgba(66, 133, 244, 0.3);"
                               onmouseover="this.style.background='#357ae8'; this.style.boxShadow='0 4px 12px rgba(66, 133, 244, 0.5)';"
                               onmouseout="this.style.background='#4285F4'; this.style.boxShadow='0 2px 6px rgba(66, 133, 244, 0.3)';">
                                <i class="fab fa-google" style="font-size: 16px;"></i>
                                <span>View on Google Maps</span>
                            </a>
                        </div>
                    </div>
                `
            });

            marker.addListener("click", () => {
                infoWindow.open(serviceAreaMap, marker);
            });

            // Auto-open info window on load
            setTimeout(() => {
                infoWindow.open(serviceAreaMap, marker);
            }, 500);
            
            // Add Benson service area marker
            const bensonPinElement = new PinElement({
                background: "#E89510",
                borderColor: "#FFFFFF",
                glyphColor: "#FFFFFF",
                scale: 1.1
            });

            const bensonMarker = new AdvancedMarkerElement({
                position: bensonLocation.coords,
                map: serviceAreaMap,
                title: bensonLocation.title,
                content: bensonPinElement.element
            });

            // Add info window for Benson
            const bensonInfoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="font-family: Arial, sans-serif; padding: 12px; max-width: 280px;">
                        <h3 style="margin: 0 0 10px 0; color: #E89510; font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 1px;">${bensonLocation.title}</h3>
                        <p style="margin: 4px 0; font-size: 14px; color: #666; line-height: 1.5;">${bensonLocation.address}</p>
                        <p style="margin: 10px 0 0 0; color: #1A1A1A; font-weight: 600; font-size: 13px;">
                            <i class="fas fa-check-circle" style="color: #E89510; font-size: 12px;"></i> Full service coverage area
                        </p>
                    </div>
                `
            });

            bensonMarker.addListener("click", () => {
                bensonInfoWindow.open(serviceAreaMap, bensonMarker);
            });
        }

        // Initialize map when page loads
        window.initServiceAreaMap = initServiceAreaMap;