/* ANIMAÇÃO SCROLL */

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {

    const windowHeight = window.innerHeight;

    reveals.forEach(el => {

        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }

    });

}

window.addEventListener("scroll", revealOnScroll);


/* NAVBAR SCROLL EFFECT */

const navbar = document.querySelector('.navbar');

function handleScroll() {

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

}

window.addEventListener('scroll', handleScroll);


/* DONUT CHART + CONTADOR */

const circles = document.querySelectorAll(".circle");

function animateCircles() {

    circles.forEach(circle => {

        let percent = circle.dataset.percent;
        let number = circle.querySelector(".number");

        let count = 0;

        let isDark = document.body.classList.contains('dark-mode');
        let primaryColor = isDark ? '#3b82f6' : '#2563eb';
        let bgColor = isDark ? '#334155' : '#e2e8f0';

        let interval = setInterval(() => {

            count++;

            number.innerText = count + "%";

            let deg = count * 3.6;

            circle.style.background =
                `conic-gradient(${primaryColor} ${deg}deg, ${bgColor} ${deg}deg)`;

            if (count >= percent) {
                clearInterval(interval);
            }

        }, 20);

    });

}


/* OBSERVER PARA GRÁFICO */

const dadosSection = document.querySelector(".dados");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            animateCircles();
        }

    });

});

if (dadosSection) {
    observer.observe(dadosSection);
}


/* SMOOTH SCROLL */

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


/* ANIMAÇÃO EM CASCATA DOS CARDS */

function addStaggeredAnimation() {

    const cards = document.querySelectorAll('.card, .dado, .noticia, .evitar-card, .highlight');

    cards.forEach((card, index) => {

        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('reveal');

    });

}

document.addEventListener('DOMContentLoaded', addStaggeredAnimation);


/* FLIP CARDS */

document.querySelectorAll('.evitar-card').forEach(card => {

    card.addEventListener('click', function () {

        this.classList.toggle('flipped');

    });

});


/* EXPAND RISK CARDS */

document.querySelectorAll('.saiba-mais-btn').forEach(btn => {

    btn.addEventListener('click', function (e) {

        e.stopPropagation();

        const card = this.closest('.card');

        card.classList.toggle('expanded');

        this.textContent =
            card.classList.contains('expanded')
                ? 'Mostrar menos'
                : 'Saiba mais';

    });

});


/* HAMBURGER MENU */

const hamburger = document.getElementById('hamburger');

if (hamburger && navbar) {

    hamburger.addEventListener('click', function () {

        navbar.classList.toggle('mobile-menu');

    });

}


/* FECHAR MENU MOBILE */

document.querySelectorAll('.navbar a').forEach(link => {

    link.addEventListener('click', function () {

        if (navbar) {
            navbar.classList.remove('mobile-menu');
        }

    });

});


/* DARK / LIGHT MODE */

function initTheme() {

    const savedTheme = localStorage.getItem('theme') || 'light';

    const prefersDark =
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme =
        savedTheme || (prefersDark ? 'dark' : 'light');

    if (initialTheme === 'dark') {

        document.body.classList.add('dark-mode');

    } else {

        document.body.classList.remove('dark-mode');

    }

    localStorage.setItem('theme', initialTheme);

}

function toggleTheme() {

    const isDarkMode =
        document.body.classList.toggle('dark-mode');

    const theme = isDarkMode ? 'dark' : 'light';

    localStorage.setItem('theme', theme);

}

const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {

    themeToggle.addEventListener('click', toggleTheme);

}

document.addEventListener('DOMContentLoaded', initTheme);

// Accessibility: Text-to-Speech with responsive behavior
(function () {
    let isSpeaking = false;
    let ptVoice = null;
    let floatingButton = null;

    function loadVoices() {
        const voices = speechSynthesis.getVoices();
        ptVoice = voices.find(voice => voice.lang.startsWith('pt-BR')) || null;
    }

    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();

    function speakText(text, button) {
        if (isSpeaking || !text.trim()) return;

        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.8;
        if (ptVoice) utterance.voice = ptVoice;

        utterance.onstart = () => {
            isSpeaking = true;
            if (button) button.classList.add('speaking');
            if (floatingButton) floatingButton.classList.add('speaking');
        };

        utterance.onend = () => {
            isSpeaking = false;
            if (button) button.classList.remove('speaking');
            if (floatingButton) floatingButton.classList.remove('speaking');
        };

        speechSynthesis.speak(utterance);
    }

    function showMessage(msg) {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = msg;
        msgDiv.setAttribute('role', 'status');
        msgDiv.style.position = 'fixed';
        msgDiv.style.bottom = '90px';
        msgDiv.style.right = '20px';
        msgDiv.style.background = 'var(--primary)';
        msgDiv.style.color = 'white';
        msgDiv.style.padding = '10px 15px';
        msgDiv.style.borderRadius = '10px';
        msgDiv.style.boxShadow = 'var(--shadow)';
        msgDiv.style.zIndex = '1002';
        msgDiv.style.fontSize = '14px';
        msgDiv.style.maxWidth = '220px';
        msgDiv.style.wordWrap = 'break-word';
        document.body.appendChild(msgDiv);

        setTimeout(() => {
            if (document.body.contains(msgDiv)) {
                document.body.removeChild(msgDiv);
            }
        }, 2500);
    }

    function getCardText(card) {
        const title = card.querySelector('h3')?.textContent.trim() || '';
        const paragraph = card.querySelector('p')?.textContent.trim() || '';
        return title ? `${title}. ${paragraph}` : paragraph;
    }

    function addMobileSpeakButtons() {
        removeMobileSpeakButtons();

        const selectors = ['.card', '.noticia', '.dado', '.evitar-card', '.highlight', '.sobre-texto'];
        const cards = document.querySelectorAll(selectors.join(','));

        cards.forEach(card => {
            if (card.querySelector('.card-speak-btn')) return;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'card-speak-btn';
            btn.setAttribute('aria-label', 'Ouvir texto do card');
            btn.textContent = '🔊 Ouvir';

            btn.addEventListener('click', e => {
                e.stopPropagation();
                const text = getCardText(card);
                if (!text) {
                    showMessage('Não há conteúdo para ouvir neste card.');
                    return;
                }
                speakText(text, btn);
            });

            // Se for noticia no mobile, coloque o botão próximo da fonte
            const fonte = card.querySelector('.fonte');
            if (fonte) {
                let footer = card.querySelector('.footer-area');
                if (!footer) {
                    footer = document.createElement('div');
                    footer.className = 'footer-area';
                    fonte.parentNode.insertBefore(footer, fonte);
                    footer.appendChild(fonte);
                }
                footer.appendChild(btn);
            } else {
                card.appendChild(btn);
            }
        });
    }

    function removeMobileSpeakButtons() {
        document.querySelectorAll('.card-speak-btn').forEach(btn => btn.remove());
        document.querySelectorAll('.footer-area').forEach(area => {
            const fonte = area.querySelector('.fonte');
            if (fonte) {
                area.parentNode.insertBefore(fonte, area);
            }
            area.remove();
        });
    }

    function createFloatingButton() {
        floatingButton = document.getElementById('speak-btn');
        if (!floatingButton) {
            floatingButton = document.createElement('button');
            floatingButton.id = 'speak-btn';
            floatingButton.className = 'floating-speak-btn';
            floatingButton.setAttribute('aria-label', 'Ouvir texto selecionado');
            floatingButton.title = 'Selecione um texto e clique para ouvir';
            floatingButton.textContent = '🔊';
            document.body.appendChild(floatingButton);
        }

        floatingButton.addEventListener('click', () => {
            if (isSpeaking) return;
            const selectedText = window.getSelection().toString().trim();
            if (!selectedText) {
                showMessage('Por favor, selecione um texto para ouvir.');
                return;
            }
            speakText(selectedText, floatingButton);
        });
    }

    function updateAccessibilityUI() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (isMobile) {
            if (floatingButton) floatingButton.style.display = 'none';
            addMobileSpeakButtons();
        } else {
            if (floatingButton) floatingButton.style.display = 'flex';
            addFloatingButtonIfNeeded();
            removeMobileSpeakButtons();
        }
    }

    function addFloatingButtonIfNeeded() {
        if (!floatingButton) createFloatingButton();
        if (floatingButton) {
            floatingButton.style.display = 'flex';
        }
    }

    window.addEventListener('resize', updateAccessibilityUI);
    window.addEventListener('orientationchange', updateAccessibilityUI);

    document.addEventListener('DOMContentLoaded', () => {
        createFloatingButton();
        updateAccessibilityUI();
    });
})();