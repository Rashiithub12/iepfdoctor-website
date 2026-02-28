/* ========================================
   IEPF Doctor — Main JavaScript
   Features: Chatbot, Language Toggle,
   Stats Counter, FAQ, Mobile Menu,
   Scroll Animations, Form Handling
   ======================================== */

// ===== LANGUAGE TOGGLE =====
let currentLang = 'en';

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    const btn = document.getElementById('langToggle');
    btn.textContent = currentLang === 'en' ? 'हिंदी' : 'English';

    // Update all elements with data-en / data-hi attributes
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute('data-' + currentLang);
        if (text) {
            // Preserve child elements (like <strong>, <br>)
            if (el.children.length === 0) {
                el.textContent = text;
            } else {
                el.innerHTML = text;
            }
        }
    });

    // Update chatbot messages if open
    if (currentLang === 'hi') {
        document.documentElement.lang = 'hi';
    } else {
        document.documentElement.lang = 'en';
    }
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

// ===== STICKY NAVBAR SHADOW =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
    }
});

// ===== ANIMATED STATS COUNTER =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (counter.dataset.animated === 'true') return;

        const duration = 2000; // 2 seconds
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);

        counter.dataset.animated = 'true';
    });
}

// Trigger counter animation when stats section is in view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== SCROLL FADE-IN ANIMATIONS =====
function setupScrollAnimations() {
    const elements = document.querySelectorAll(
        '.service-card, .step-card, .testimonial-card, .problem-item, .faq-item, .about-content, .contact-wrapper'
    );

    elements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

setupScrollAnimations();

// ===== FAQ ACCORDION =====
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all others
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Toggle current
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ===== CONTACT FORM HANDLER =====
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });

    // Store lead data in localStorage as backup
    const leads = JSON.parse(localStorage.getItem('iepf_leads') || '[]');
    data.timestamp = new Date().toISOString();
    leads.push(data);
    localStorage.setItem('iepf_leads', JSON.stringify(leads));

    // Send via email using formsubmit or similar
    // For now, show success message and send via WhatsApp
    const message = `New Lead from IEPF Doctor Website:%0A` +
        `Name: ${data.name}%0A` +
        `Phone: ${data.phone}%0A` +
        `Email: ${data.email}%0A` +
        `Concern: ${data.concern}%0A` +
        `Message: ${data.message || 'N/A'}`;

    // EDIT: Change this WhatsApp number to your number
    const whatsappUrl = `https://wa.me/919301116635?text=${message}`;

    // Show success
    form.innerHTML = `
        <div class="form-success">
            <div class="success-icon">✅</div>
            <h3>${currentLang === 'hi' ? 'धन्यवाद!' : 'Thank You!'}</h3>
            <p>${currentLang === 'hi' ? 'हमने आपकी जानकारी प्राप्त कर ली है। हमारी टीम 24 घंटे के भीतर आपसे संपर्क करेगी।' : 'We have received your details. Our team will contact you within 24 hours.'}</p>
            <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp" style="margin-top: 16px;">
                ${currentLang === 'hi' ? 'व्हाट्सएप पर भी भेजें' : 'Also Send via WhatsApp'}
            </a>
        </div>
    `;
}

// ===== CHATBOT =====
const chatbotFlow = {
    steps: [
        {
            id: 'greeting',
            bot_en: "Hi! 👋 Welcome to IEPF Doctor. I can help you get started with recovering your unclaimed investments. What's your name?",
            bot_hi: "नमस्ते! 👋 IEPF डॉक्टर में आपका स्वागत है। मैं आपके दावा न किए गए निवेशों की वसूली में मदद कर सकता हूं। आपका नाम क्या है?",
            input: 'text',
            placeholder_en: 'Enter your name...',
            placeholder_hi: 'अपना नाम लिखें...',
            field: 'name'
        },
        {
            id: 'phone',
            bot_en: "Thanks, {name}! Could you share your phone number so our experts can reach you?",
            bot_hi: "धन्यवाद, {name}! क्या आप अपना फोन नंबर साझा कर सकते हैं ताकि हमारे विशेषज्ञ आपसे संपर्क कर सकें?",
            input: 'tel',
            placeholder_en: '+91 XXXXXXXXXX',
            placeholder_hi: '+91 XXXXXXXXXX',
            field: 'phone'
        },
        {
            id: 'concern',
            bot_en: "Got it! What type of investment concern do you have?",
            bot_hi: "समझ गया! आपकी किस प्रकार की निवेश समस्या है?",
            input: 'options',
            options_en: [
                'IEPF Share Claim',
                'Transmission of Shares',
                'Physical to Demat',
                'Lost Share Certificate',
                'Unclaimed Dividends',
                'PF / PPF Recovery',
                'Other'
            ],
            options_hi: [
                'IEPF शेयर दावा',
                'शेयरों का ट्रांसमिशन',
                'फिजिकल से डीमैट',
                'खोया शेयर प्रमाणपत्र',
                'दावा न किए गए लाभांश',
                'PF / PPF वसूली',
                'अन्य'
            ],
            field: 'concern'
        },
        {
            id: 'email',
            bot_en: "Thanks! Last question — your email address? (optional, you can type 'skip')",
            bot_hi: "धन्यवाद! अंतिम प्रश्न — आपका ईमेल पता? ('skip' टाइप कर सकते हैं)",
            input: 'text',
            placeholder_en: 'your@email.com or skip',
            placeholder_hi: 'your@email.com या skip',
            field: 'email'
        },
        {
            id: 'done',
            bot_en: "Thank you, {name}! 🎉 Our team will contact you shortly on {phone}. You can also reach us directly:",
            bot_hi: "धन्यवाद, {name}! 🎉 हमारी टीम जल्द ही {phone} पर आपसे संपर्क करेगी। आप हमसे सीधे भी संपर्क कर सकते हैं:",
            input: 'final',
            field: null
        }
    ]
};

let chatStep = 0;
let chatData = {};
let chatbotOpen = false;
let chatInitialized = false;

function toggleChatbot() {
    const window_ = document.getElementById('chatbotWindow');
    const badge = document.getElementById('chatbotBadge');
    chatbotOpen = !chatbotOpen;

    if (chatbotOpen) {
        window_.classList.add('open');
        badge.style.display = 'none';
        if (!chatInitialized) {
            chatInitialized = true;
            startChatbot();
        }
    } else {
        window_.classList.remove('open');
    }
}

function startChatbot() {
    showBotMessage(chatbotFlow.steps[0]);
    showChatInput(chatbotFlow.steps[0]);
}

function showBotMessage(step) {
    const messages = document.getElementById('chatbotMessages');
    const lang = currentLang;
    let text = step['bot_' + lang] || step['bot_en'];

    // Replace placeholders
    Object.keys(chatData).forEach(key => {
        text = text.replace('{' + key + '}', chatData[key]);
    });

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg bot';
    msgDiv.textContent = text;
    messages.appendChild(msgDiv);

    // If final step, add contact buttons
    if (step.input === 'final') {
        const btnDiv = document.createElement('div');
        btnDiv.className = 'chat-msg bot';
        btnDiv.innerHTML = `
            <a href="tel:+919301116635" style="display:block;color:#1a56db;font-weight:600;margin-bottom:8px;">📞 +91-9301116635</a>
            <a href="https://wa.me/919301116635" target="_blank" style="display:block;color:#25D366;font-weight:600;">💬 WhatsApp</a>
        `;
        messages.appendChild(btnDiv);

        // Save lead
        saveChatLead();

        // Hide input area
        document.getElementById('chatbotInputArea').innerHTML = `
            <p style="text-align:center;font-size:0.85rem;color:#6b7280;padding:8px;">
                ${currentLang === 'hi' ? 'बातचीत समाप्त। धन्यवाद!' : 'Chat complete. Thank you!'}
            </p>
        `;
    }

    messages.scrollTop = messages.scrollHeight;
}

function showUserMessage(text) {
    const messages = document.getElementById('chatbotMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg user';
    msgDiv.textContent = text;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

function showChatInput(step) {
    const inputArea = document.getElementById('chatbotInputArea');

    if (step.input === 'text' || step.input === 'tel') {
        const placeholder = step['placeholder_' + currentLang] || step['placeholder_en'];
        inputArea.innerHTML = `
            <div class="chatbot-input-row">
                <input type="${step.input === 'tel' ? 'tel' : 'text'}"
                       id="chatInput"
                       placeholder="${placeholder}"
                       onkeypress="if(event.key==='Enter') submitChatInput()">
                <button onclick="submitChatInput()">➤</button>
            </div>
        `;
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.focus();
        }, 300);
    } else if (step.input === 'options') {
        const options = step['options_' + currentLang] || step['options_en'];
        const optionsEn = step['options_en'];
        let html = '<div class="chat-options">';
        options.forEach((opt, i) => {
            html += `<button class="chat-option-btn" onclick="selectChatOption('${optionsEn[i]}', '${opt}')">${opt}</button>`;
        });
        html += '</div>';
        inputArea.innerHTML = html;
    }
}

function submitChatInput() {
    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim()) return;

    const value = input.value.trim();
    const step = chatbotFlow.steps[chatStep];

    chatData[step.field] = value;
    showUserMessage(value);

    chatStep++;
    if (chatStep < chatbotFlow.steps.length) {
        setTimeout(() => {
            showBotMessage(chatbotFlow.steps[chatStep]);
            showChatInput(chatbotFlow.steps[chatStep]);
        }, 500);
    }
}

function selectChatOption(valueEn, displayText) {
    const step = chatbotFlow.steps[chatStep];
    chatData[step.field] = valueEn;
    showUserMessage(displayText);

    chatStep++;
    if (chatStep < chatbotFlow.steps.length) {
        setTimeout(() => {
            showBotMessage(chatbotFlow.steps[chatStep]);
            showChatInput(chatbotFlow.steps[chatStep]);
        }, 500);
    }
}

function saveChatLead() {
    // Save to localStorage
    const leads = JSON.parse(localStorage.getItem('iepf_chatbot_leads') || '[]');
    chatData.timestamp = new Date().toISOString();
    chatData.source = 'chatbot';
    leads.push(chatData);
    localStorage.setItem('iepf_chatbot_leads', JSON.stringify(leads));

    // Also prepare WhatsApp message for immediate notification
    const message = `New Chatbot Lead:%0A` +
        `Name: ${chatData.name || 'N/A'}%0A` +
        `Phone: ${chatData.phone || 'N/A'}%0A` +
        `Email: ${chatData.email || 'N/A'}%0A` +
        `Concern: ${chatData.concern || 'N/A'}%0A` +
        `Source: Website Chatbot`;

    // Send notification via a hidden image ping (you can replace with your own endpoint)
    // For now, leads are stored in localStorage
    console.log('Lead captured:', chatData);
}

// Auto-open chatbot after 5 seconds on first visit
setTimeout(() => {
    if (!chatbotOpen && !sessionStorage.getItem('chatbot_shown')) {
        const badge = document.getElementById('chatbotBadge');
        if (badge) {
            badge.style.display = 'flex';
        }
        sessionStorage.setItem('chatbot_shown', 'true');
    }
}, 5000);
