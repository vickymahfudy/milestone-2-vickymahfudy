document.addEventListener('DOMContentLoaded', function() {
    // Add click effect to info blocks
    const infoBlocks = document.querySelectorAll('.info-block');
    
    infoBlocks.forEach(block => {
        block.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add scroll reveal effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all info blocks and game cards
    document.querySelectorAll('.info-block, .game-card').forEach(el => {
        observer.observe(el);
    });

    // Add hover sound effect (optional)
    const hoverSound = new Audio('assets/hover.mp3'); // You'll need to add this sound file
    
    document.querySelectorAll('.info-block, .game-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (hoverSound) {
                hoverSound.currentTime = 0;
                hoverSound.volume = 0.2;
                hoverSound.play().catch(() => {}); // Catch and ignore autoplay restrictions
            }
        });
    });
});