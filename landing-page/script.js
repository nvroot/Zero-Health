// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to any anchor links (if added in the future)
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading animations to feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and vulnerability categories for animations
    const animatedElements = document.querySelectorAll('.feature-card, .vuln-category, .setup-step');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Track clicks on important links (for analytics)
    const trackableLinks = document.querySelectorAll('a[href*="github.com"], a[href*="youtube.com"]');
    
    trackableLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            const text = this.textContent.trim();
            
            // Simple console logging (can be replaced with actual analytics)
            console.log(`Link clicked: ${text} -> ${href}`);
            
            // If you want to add Google Analytics or other tracking:
            // gtag('event', 'click', {
            //     event_category: 'outbound',
            //     event_label: href,
            //     transport_type: 'beacon'
            // });
        });
    });

    // Add a simple easter egg for security enthusiasts
    let konami = [];
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', function(e) {
        konami.push(e.keyCode);
        konami = konami.slice(-konamiCode.length);
        
        if (konami.join(',') === konamiCode.join(',')) {
            showSecretMessage();
        }
    });

    function showSecretMessage() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                text-align: center;
                z-index: 9999;
                max-width: 400px;
            ">
                <h3>🎉 Security Enthusiast Detected!</h3>
                <p>You found the Konami code! This is exactly the kind of attention to detail that makes great security professionals.</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    margin-top: 15px;
                    cursor: pointer;
                    font-weight: 600;
                ">Close</button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9998;
            " onclick="this.parentElement.remove()"></div>
        `;
        document.body.appendChild(message);
    }
});

// Add a simple copy-to-clipboard function for code snippets
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        // Show a temporary success message
        const message = document.createElement('div');
        message.textContent = 'Copied to clipboard!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-weight: 600;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, 2000);
    });
}

// Make code snippets clickable to copy
document.addEventListener('DOMContentLoaded', function() {
    const codeElements = document.querySelectorAll('code');
    
    codeElements.forEach(code => {
        code.style.cursor = 'pointer';
        code.title = 'Click to copy';
        
        code.addEventListener('click', function() {
            copyToClipboard(this.textContent);
        });
    });
}); 