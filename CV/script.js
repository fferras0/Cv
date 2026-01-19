document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------
       1. Custom Cursor
    -------------------------------------------------- */
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Hover effect for links and buttons
        const hoverTargets = document.querySelectorAll('a, button, .filter-btn, .gallery-item, .skill-item');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            target.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }

    /* --------------------------------------------------
       2. Typing Effect (Home Page)
    -------------------------------------------------- */
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const roles = ["مصمم ملتيميديا", "مطور واجهات", "محرر فيديو", "مصمم 3D"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    /* --------------------------------------------------
       3. 3D Tilt Effect
    -------------------------------------------------- */
    const tiltCards = document.querySelectorAll('.gallery-item, .skill-item, .info-item');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    /* --------------------------------------------------
       4. Portfolio Filtering
    -------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });

    /* --------------------------------------------------
       5. Skills Progress Bars
    -------------------------------------------------- */
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    if (progressBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width + '%';
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => observer.observe(bar));
    }

    /* --------------------------------------------------
       6. Floating Contact FAB
    -------------------------------------------------- */
    const fabBtn = document.querySelector('.fab-btn');
    const fabMenu = document.querySelector('.fab-menu');

    if (fabBtn && fabMenu) {
        fabBtn.addEventListener('click', () => {
            fabMenu.classList.toggle('active');
            fabBtn.classList.toggle('active');
        });
    }

    /* --------------------------------------------------
       7. Parallax Background (Converted to Network Canvas)
    -------------------------------------------------- */
    const canvas = document.getElementById('network-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;

        // Mouse position for interaction
        let mouse = {
            x: null,
            y: null,
            radius: (canvas.height / 80) * (canvas.width / 80)
        }

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        // Create particle
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            // Draw particle
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = '#fca311'; // Accent color for dots
                ctx.fill();
            }
            // Update particle position
            update() {
                // Check if particle is still within canvas
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Mouse attraction (Optional: slight pull towards mouse to increase density)
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    // Gentle attraction
                    this.x += dx * 0.01;
                    this.y += dy * 0.01;
                }

                // Move particle
                this.x += this.directionX;
                this.y += this.directionY;

                // Draw particle
                this.draw();
            }
        }

        // Create particle array
        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1; // Random size
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2; // Random speed
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = '#fca311';

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Check if particles are close enough to draw line
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                // Connect particles to particles
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(252, 163, 17,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }

                // Connect particles to MOUSE (Create more threads)
                let mouseDistance = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x)) +
                    ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));

                if (mouseDistance < (canvas.width / 5) * (canvas.height / 5)) { // Larger radius for mouse
                    opacityValue = 1 - (mouseDistance / 30000); // Slower fade
                    ctx.strokeStyle = 'rgba(252, 163, 17,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        // Resize event
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
            init();
        });

        // Mouse out event
        document.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        })

        init();
        animate();
    }

    /* --------------------------------------------------
       8. Page Transitions
    -------------------------------------------------- */
    const pageTransition = document.querySelector('.page-transition');
    const internalLinks = document.querySelectorAll('a[href^="index.html"], a[href^="skills.html"], a[href^="work.html"]');

    if (pageTransition) {
        // Fade in on load
        setTimeout(() => {
            pageTransition.classList.remove('active');
        }, 500);

        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.href;
                // Only intercept actual navigations to current domain pages
                if (target && !target.includes('#') && target !== window.location.href) {
                    e.preventDefault();
                    pageTransition.classList.add('active');
                    setTimeout(() => {
                        window.location.href = target;
                    }, 500);
                }
            });
        });
    }

    /* --------------------------------------------------
       9. Image Lightbox Slideshow
    -------------------------------------------------- */
    const images = ['Work/House (1).jpg', 'Work/House (2).jpg', 'Work/House (3).jpg',
        'Work/c1.jpg', 'Work/c2.jpg', 'Work/c3.jpg',
        'Work/r1.jpg', 'Work/r2.jpg', 'Work/r3.jpg'];
    let currentSlide = 0;

    window.openLightbox = function (index) {
        currentSlide = index;
        document.getElementById('lightbox').classList.add('active');
        document.getElementById('lightbox-img').src = images[currentSlide];
    }

    window.closeLightbox = function () {
        document.getElementById('lightbox').classList.remove('active');
    }

    window.changeSlide = function (direction) {
        currentSlide += direction;
        if (currentSlide >= images.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = images.length - 1;
        document.getElementById('lightbox-img').src = images[currentSlide];
    }

    // Close lightbox on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') changeSlide(1);
        if (e.key === 'ArrowLeft') changeSlide(-1);
    });
});
