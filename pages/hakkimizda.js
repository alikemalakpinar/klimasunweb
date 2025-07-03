document.addEventListener('DOMContentLoaded', function() {
    // ===== Testimonials Slider Enhanced =====
    const slider = document.querySelector('.testimonials-slider');
    const container = document.querySelector('.testimonials-container');
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');
    const items = document.querySelectorAll('.testimonial-item');
    
    // Auto-hide navigation if not enough items
    if (items.length <= 3) {
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
        return;
    }
    
    // Calculate dimensions - consider responsive dimensions
    let itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight) + 30; // Include gap
    let currentPosition = 0;
    let maxPosition = -(items.length - getVisibleItems()) * itemWidth;
    
    // Function to get visible items based on screen size
    function getVisibleItems() {
        if (window.innerWidth < 992) return 1;
        if (window.innerWidth < 1200) return 2;
        return 3;
    }
    
    // Function to update dimensions on resize
    const updateDimensions = () => {
        itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight) + 30;
        maxPosition = -(items.length - getVisibleItems()) * itemWidth;
        // Reset position when dimensions change
        currentPosition = 0;
        container.style.transform = `translateX(0)`;
        updateButtonStates();
        updateDots();
    };
    
    // Update button states
    const updateButtonStates = () => {
        prevButton.style.opacity = currentPosition === 0 ? '0.5' : '1';
        prevButton.style.cursor = currentPosition === 0 ? 'default' : 'pointer';
        nextButton.style.opacity = currentPosition <= maxPosition ? '0.5' : '1';
        nextButton.style.cursor = currentPosition <= maxPosition ? 'default' : 'pointer';
    };
    
    // Initial button states
    updateButtonStates();
    
    // Smooth sliding function with easing
    function slide(direction) {
        // Add bouncing effect at edges
        if (direction === 'next' && currentPosition > maxPosition) {
            currentPosition -= itemWidth;
        } else if (direction === 'prev' && currentPosition < 0) {
            currentPosition += itemWidth;
        } else if (direction === 'next' && currentPosition <= maxPosition) {
            // Bounce effect at end
            container.style.transform = `translateX(${currentPosition - 10}px)`;
            setTimeout(() => {
                container.style.transform = `translateX(${currentPosition}px)`;
            }, 150);
            return;
        } else if (direction === 'prev' && currentPosition >= 0) {
            // Bounce effect at start
            container.style.transform = `translateX(${currentPosition + 10}px)`;
            setTimeout(() => {
                container.style.transform = `translateX(${currentPosition}px)`;
            }, 150);
            return;
        }
        
        // Apply smooth transition with easing
        container.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        container.style.transform = `translateX(${currentPosition}px)`;
        
        // Update navigation buttons
        updateButtonStates();
    }
    
    // Click event listeners with hover effects
    nextButton.addEventListener('mouseenter', () => {
        if (currentPosition > maxPosition) {
            nextButton.style.transform = 'translateY(-50%) scale(1.1)';
        }
    });
    
    nextButton.addEventListener('mouseleave', () => {
        nextButton.style.transform = 'translateY(-50%)';
    });
    
    prevButton.addEventListener('mouseenter', () => {
        if (currentPosition < 0) {
            prevButton.style.transform = 'translateY(-50%) scale(1.1)';
        }
    });
    
    prevButton.addEventListener('mouseleave', () => {
        prevButton.style.transform = 'translateY(-50%)';
    });
    
    nextButton.addEventListener('click', () => slide('next'));
    prevButton.addEventListener('click', () => slide('prev'));
    
    // Enhanced touch events with momentum
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    let touchEndTime = 0;
    
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartTime = new Date().getTime();
        container.style.transition = 'none'; // Disable transition during drag
    }, { passive: true });
    
    container.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
        const diffX = touchEndX - touchStartX;
        
        // Only allow sliding within boundaries with resistance at edges
        let newPosition = currentPosition + diffX;
        if (newPosition > 0) {
            newPosition = diffX / 3; // Resistance at start
        } else if (newPosition < maxPosition) {
            newPosition = maxPosition + (diffX / 3); // Resistance at end
        }
        
        container.style.transform = `translateX(${newPosition}px)`;
    }, { passive: true });
    
    container.addEventListener('touchend', () => {
        touchEndTime = new Date().getTime();
        const touchDuration = touchEndTime - touchStartTime;
        const difference = touchStartX - touchEndX;
        
        // Re-enable smooth transitions
        container.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        
        // Calculate velocity for momentum effect
        const velocity = Math.abs(difference / touchDuration);
        
        if (Math.abs(difference) > 30 || velocity > 0.5) {
            if (difference > 0) {
                slide('next');
            } else {
                slide('prev');
            }
        } else {
            // Return to current position if swipe was too small
            container.style.transform = `translateX(${currentPosition}px)`;
        }
    }, { passive: true });
    
    // Auto-play functionality with pause on hover
    let autoplayInterval;
    
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            if (currentPosition > maxPosition) {
                slide('next');
            } else {
                // Reset to beginning when reached the end
                currentPosition = 0;
                container.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
                container.style.transform = `translateX(${currentPosition}px)`;
                updateButtonStates();
                updateDots();
            }
        }, 5000); // Change slide every 5 seconds
    };
    
    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };
    
    // Start autoplay initially
    startAutoplay();
    
    // Stop autoplay on interaction
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('touchstart', stopAutoplay, { passive: true });
    
    // Resume autoplay when not interacting
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('touchend', () => {
        setTimeout(startAutoplay, 1000);
    }, { passive: true });
    
    // Update dimensions on window resize
    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(updateDimensions, 250);
    });
    
    // ===== Parallax Effect for Hero Section =====
    const heroSection = document.querySelector('.about-hero');
    const heroImage = document.querySelector('.about-hero img');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition < heroSection.offsetHeight) {
            heroImage.style.transform = `translateY(${scrollPosition * 0.3}px) scale(1.05)`;
        }
    });
    
    // ===== Animate Features on Scroll =====
    const featureItems = document.querySelectorAll('.feature-item');
    const animateOnScroll = () => {
        featureItems.forEach((item, index) => {
            const itemPosition = item.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (itemPosition < screenPosition) {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = item.classList.contains('feature-item-highlight') 
                        ? 'translateY(0) scale(1.05)' 
                        : 'translateY(0)';
                }, index * 150);
            }
        });
    };
    
    // Initialize feature animations
    featureItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = item.classList.contains('feature-item-highlight') 
            ? 'translateY(40px) scale(1.05)' 
            : 'translateY(40px)';
        item.style.transition = 'all 0.6s ease-out';
    });
    
    // ===== Animate Values on Scroll =====
    const valueItems = document.querySelectorAll('.value-item');
    const animateValuesOnScroll = () => {
        valueItems.forEach((item, index) => {
            const itemPosition = item.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (itemPosition < screenPosition) {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 200);
            }
        });
    };
    
    // Initialize value animations
    valueItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        item.style.transition = 'all 0.7s ease-out';
    });
    
    // ===== Animate Title Section =====
    const animateTitles = () => {
        const titles = [
            document.querySelector('.service-approach h2'),
            document.querySelector('.klimasun-features h2'),
            document.querySelector('.values-title'),
            document.querySelector('.testimonials-section h2')
        ];
        
        titles.forEach(title => {
            if (title) {
                const titlePosition = title.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.1;
                
                if (titlePosition < screenPosition) {
                    title.style.opacity = '1';
                    title.style.transform = 'translateY(0)';
                }
            }
        });
    };
    
    // Initialize title animations
    const titles = [
        document.querySelector('.klimasun-features h2'),
        document.querySelector('.values-title'),
        document.querySelector('.testimonials-section h2')
    ];
    
    titles.forEach(title => {
        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(20px)';
            title.style.transition = 'all 0.5s ease-out';
        }
    });
    
    // ===== Slowly zoom hero image on load =====
    window.addEventListener('load', () => {
        const heroImg = document.querySelector('.about-hero img');
        if (heroImg) {
            heroImg.style.transform = 'scale(1.05)';
        }
    });
    
    // Run animations on scroll
    window.addEventListener('scroll', () => {
        animateOnScroll();
        animateValuesOnScroll();
        animateTitles();
        updateScrollIndicator();
    });
    
    // Trigger once on load to reveal visible items
    setTimeout(() => {
        animateOnScroll();
        animateValuesOnScroll();
        animateTitles();
    }, 300);
    
    // ===== Interactive Service Items =====
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'translateY(-5px)';
            item.style.color = '#FFC700';
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'translateY(0)';
            item.style.color = 'white';
        });
        
        // Add click animation
        item.addEventListener('click', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // ===== Add hover effect to feature items =====
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const allItems = document.querySelectorAll('.feature-item');
            
            allItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.style.opacity = '0.7';
                }
            });
        });
        
        item.addEventListener('mouseleave', () => {
            const allItems = document.querySelectorAll('.feature-item');
            
            allItems.forEach(otherItem => {
                otherItem.style.opacity = '1';
            });
        });
    });
    
    // ===== Add hover effect to value items =====
    valueItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const allItems = document.querySelectorAll('.value-item');
            
            allItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.style.opacity = '0.7';
                }
            });
        });
        
        item.addEventListener('mouseleave', () => {
            const allItems = document.querySelectorAll('.value-item');
            
            allItems.forEach(otherItem => {
                otherItem.style.opacity = '1';
            });
        });
    });
    
    // ===== Add testimonial counter =====
    if (items.length > 3) {
        const testimonialCounter = document.createElement('div');
        testimonialCounter.className = 'testimonial-counter';
        
        for (let i = 0; i < items.length; i++) {
            const dot = document.createElement('span');
            dot.style.backgroundColor = i === 0 ? '#F9C200' : 'rgba(249, 194, 0, 0.3)';
            
            dot.addEventListener('click', () => {
                currentPosition = -i * itemWidth;
                container.style.transform = `translateX(${currentPosition}px)`;
                updateButtonStates();
                
                // Update active dot
                document.querySelectorAll('.testimonial-counter span').forEach((d, idx) => {
                    d.style.backgroundColor = idx === i ? '#F9C200' : 'rgba(249, 194, 0, 0.3)';
                    d.style.width = idx === i ? '12px' : '8px';
                    d.style.height = idx === i ? '12px' : '8px';
                });
            });
            
            testimonialCounter.appendChild(dot);
        }
        
        slider.appendChild(testimonialCounter);
        
        // Update dots function
        window.updateDots = () => {
            const currentIndex = Math.abs(Math.round(currentPosition / itemWidth));
            document.querySelectorAll('.testimonial-counter span').forEach((dot, idx) => {
                dot.style.backgroundColor = idx === currentIndex ? '#F9C200' : 'rgba(249, 194, 0, 0.3)';
                dot.style.width = idx === currentIndex ? '12px' : '8px';
                dot.style.height = idx === currentIndex ? '12px' : '8px';
            });
        };
        
        // Add updateDots function to global scope
        updateDots = window.updateDots;
        
        // Override slide function to update dots
        const originalSlide = slide;
        window.slideFn = function(direction) {
            originalSlide(direction);
            setTimeout(updateDots, 300);
        };
        
        // Update global slide function reference
        slide = window.slideFn;
    }
    
    // ===== Add floating animation to service icons =====
    const animateServiceIcons = () => {
        serviceItems.forEach((item, index) => {
            const icon = item.querySelector('i');
            
            // Create a slight floating effect with different timing for each icon
            setTimeout(() => {
                icon.style.animation = `float 3s ease-in-out ${index * 0.5}s infinite`;
                
                // Add the animation keyframes if they don't exist
                if (!document.querySelector('#float-animation')) {
                    const style = document.createElement('style');
                    style.id = 'float-animation';
                    style.textContent = `
                        @keyframes float {
                            0% { transform: translateY(0); }
                            50% { transform: translateY(-5px); }
                            100% { transform: translateY(0); }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }, index * 100);
        });
    };
    
    // Start the floating animation after a delay
    setTimeout(animateServiceIcons, 1000);
    
    // ===== Add particle background to hero section =====
    const addParticles = () => {
        // Only add particles if hero section exists and device is not mobile
        if (heroSection && window.innerWidth > 768) {
            const particleContainer = document.querySelector('.hero-particles');
            
            // Create particles
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                const size = Math.random() * 4 + 1;
                const duration = Math.random() * 15 + 5;
                const delay = Math.random() * 5;
                const translateX = Math.random() * 100 - 50;
                
                particle.className = 'particle';
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.opacity = `${Math.random() * 0.5 + 0.2}`;
                particle.style.animation = `float-particle ${duration}s linear ${delay}s infinite`;
                particle.style.setProperty('--tx', `${translateX}px`);
                
                particleContainer.appendChild(particle);
            }
        }
    };
    
    // Add particles with delay
    setTimeout(addParticles, 500);
    
    // ===== Add 3D tilt effect to feature cards =====
    const addTiltEffect = () => {
        featureItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const itemRect = item.getBoundingClientRect();
                const itemCenterX = itemRect.left + itemRect.width / 2;
                const itemCenterY = itemRect.top + itemRect.height / 2;
                
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                // Calculate distance from center (in percentage)
                const percentX = (mouseX - itemCenterX) / (itemRect.width / 2);
                const percentY = (mouseY - itemCenterY) / (itemRect.height / 2);
                
                // Limit tilt effect
                const tiltLimit = 5;
                const tiltX = -percentY * tiltLimit; // Reversed for natural feeling
                const tiltY = percentX * tiltLimit;
                
                // Apply transform with tilt
                if (item.classList.contains('feature-item-highlight')) {
                    item.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px) scale(1.05)`;
                } else {
                    item.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px)`;
                }
                    
                // Add slight shadow movement
                item.style.boxShadow = `
                    ${-tiltY * 2}px ${-tiltX * 2}px 20px rgba(0, 0, 0, 0.1),
                    0 10px 30px rgba(0, 0, 0, 0.08)
                `;
            });
            
            // Reset on mouse leave
            item.addEventListener('mouseleave', () => {
                item.style.transition = 'all 0.6s ease-out';
                if (item.classList.contains('feature-item-highlight')) {
                    item.style.transform = 'translateY(0) scale(1.05)';
                } else {
                    item.style.transform = 'translateY(0)';
                }
                item.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
            });
            
            // Disable transition during mouse move for smooth effect
            item.addEventListener('mouseenter', () => {
                item.style.transition = 'box-shadow 0.3s ease-out';
            });
        });
    };
    
    // Only add tilt effect on desktop
    if (window.innerWidth > 992) {
        addTiltEffect();
    }
    
    // ===== Update scroll indicator =====
    const updateScrollIndicator = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            indicator.style.width = `${scrollPercent}%`;
        }
    };
    
    // Initialize scroll indicator
    updateScrollIndicator();
    
    // ===== Back to top button functionality =====
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.style.opacity = '1';
                backToTopButton.style.transform = 'translateY(0)';
            } else {
                backToTopButton.style.opacity = '0';
                backToTopButton.style.transform = 'translateY(20px)';
            }
        });
        
        // Scroll to top on click
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover effect
        backToTopButton.addEventListener('mouseenter', () => {
            backToTopButton.style.transform = 'translateY(-5px)';
            backToTopButton.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        });
        
        backToTopButton.addEventListener('mouseleave', () => {
            backToTopButton.style.transform = 'translateY(0)';
            backToTopButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
    }
});