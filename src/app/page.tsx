'use client';
import { useEffect, useRef, useState } from 'react';

export default function VoiceLabPage() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Set initial theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target as Node) &&
        mobileMenuBtnRef.current &&
        !mobileMenuBtnRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeElements.forEach((el) => fadeObserver.observe(el));

    return () => {
      fadeElements.forEach((el) => fadeObserver.unobserve(el));
    };
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setMobileMenuOpen(false);
    }
  };

    const playVoicePreview = (voice: string, event: React.MouseEvent<HTMLDivElement>) => {
        const messages: { [key: string]: string } = {
            'aria': 'Hello! I am Aria, your English AI voice assistant.',
            'marcus': 'Greetings! I am Marcus, ready to help with your text-to-speech needs.',
            'sophie': 'Bonjour! Je suis Sophie, votre assistante vocale française.',
            'kenji': 'こんにちは！私は健二です、日本語のAI音声です。',
            'isabella': '¡Hola! Soy Isabella, tu asistente de voz en español.',
            'priya': 'नमस्ते! मैं प्रिया हूं, आपकी हिंदी एआई आवाज सहायक।'
        };

        const utterance = new SpeechSynthesisUtterance(messages[voice]);
        const voices = speechSynthesis.getVoices();
        
        const langMap: { [key: string]: string } = { 'aria': 'en-US', 'marcus': 'en-US', 'sophie': 'fr-FR', 'kenji': 'ja-JP', 'isabella': 'es-ES', 'priya': 'hi-IN' };
        const targetLang = langMap[voice];
        const matchedVoice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
        
        if (matchedVoice) utterance.voice = matchedVoice;
        utterance.rate = 0.9;
        utterance.pitch = 1.1;

        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
        
        const voiceItem = event.currentTarget;
        if (voiceItem) {
          voiceItem.style.background = 'rgba(99, 102, 241, 0.3)';
          setTimeout(() => {
              voiceItem.style.background = '';
          }, 2000);
        }
    };
    
    useEffect(() => {
        const loadVoices = () => {
            console.log('Voices loaded:', speechSynthesis.getVoices().length);
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => { window.speechSynthesis.onvoiceschanged = null; };
    }, []);

    const startQuickTTS = () => {
        const text = prompt('Enter text to convert to speech:', 'Welcome to VoiceLab AI!');
        if (text) {
            const utterance = new SpeechSynthesisUtterance(text);
            speechSynthesis.speak(utterance);
            alert('Playing speech...');
        }
    };

    const openVoiceStudio = () => alert('Voice Studio would open in a real application. This is a demo interface.');
    const downloadSamples = () => alert('Voice samples would start downloading. This is a demo.');


  return (
    <>
      <style jsx global>{`
        .header { background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); padding: 1rem 2rem; position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: 700; background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--secondary))); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .logo i { font-size: 1.8rem; }
        .nav-links { display: flex; gap: 2rem; align-items: center; }
        .nav-link { color: hsl(var(--light)); text-decoration: none; padding: 0.5rem 1rem; border-radius: var(--radius); transition: var(--transition); }
        .nav-link:hover { background: rgba(255, 255, 255, 0.1); }
        .nav-link.active { background: hsl(var(--primary)); }
        .mobile-menu-btn { display: none; background: none; border: none; color: hsl(var(--light)); font-size: 1.5rem; cursor: pointer; }
        .btn { padding: 0.75rem 1.5rem; border-radius: var(--radius); border: none; cursor: pointer; transition: var(--transition); font-weight: 600; }
        .btn-primary { background: hsl(var(--primary)); color: hsl(var(--light)); }
        .btn-primary:hover { background: hsl(var(--primary-dark)); }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .hero { text-align: center; padding: 4rem 2rem; background: linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600'); background-size: cover; border-radius: var(--radius); margin-bottom: 2rem; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--secondary))); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 1.2rem; color: hsl(var(--gray)); max-width: 600px; margin: 0 auto 2rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .stat-card { background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); text-align: center; border: 1px solid rgba(255, 255, 255, 0.1); transition: var(--transition); }
        .stat-card:hover { transform: translateY(-5px); border-color: hsl(var(--primary)); }
        .stat-number { font-size: 2.5rem; font-weight: 700; color: hsl(var(--primary)); margin-bottom: 0.5rem; }
        .stat-label { color: hsl(var(--gray)); font-size: 0.9rem; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .feature-card { background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); border: 1px solid rgba(255, 255, 255, 0.1); transition: var(--transition); }
        .feature-card:hover { background: rgba(99, 102, 241, 0.1); border-color: hsl(var(--primary)); }
        .feature-icon { font-size: 2rem; color: hsl(var(--primary)); margin-bottom: 1rem; }
        .quick-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .action-card { background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-dark))); padding: 2rem; border-radius: var(--radius); text-align: center; cursor: pointer; transition: var(--transition); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; }
        .action-card:nth-child(2) { background: linear-gradient(135deg, hsl(var(--secondary)), #059669); }
        .action-card:nth-child(3) { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .action-card:hover { transform: translateY(-5px); box-shadow: var(--shadow); }
        .action-icon { font-size: 3rem; margin-bottom: 1rem; }
        .voice-preview { background: rgba(255, 255, 255, 0.05); border-radius: var(--radius); padding: 2rem; margin-bottom: 3rem; border: 1px solid rgba(255, 255, 255, 0.1); }
        .voice-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .voice-item { background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: var(--radius); text-align: center; cursor: pointer; transition: var(--transition); }
        .voice-item:hover { background: rgba(99, 102, 241, 0.2); transform: scale(1.05); }
        .voice-avatar { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--secondary))); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .footer { background: rgba(15, 23, 42, 0.95); padding: 3rem 2rem; margin-top: 4rem; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .footer-content { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; }
        .footer-section h3 { color: hsl(var(--light)); margin-bottom: 1rem; }
        .footer-section a { color: hsl(var(--gray)); text-decoration: none; display: block; margin-bottom: 0.5rem; transition: var(--transition); }
        .footer-section a:hover { color: hsl(var(--primary)); }
        .copyright { text-align: center; padding-top: 2rem; margin-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.1); color: hsl(var(--gray)); }
        .mobile-nav { display: none; position: fixed; top: 70px; left: 0; right: 0; background: hsl(var(--darker)); padding: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); z-index: 999; }
        .mobile-nav.active { display: block; }
        .theme-toggle { background: rgba(255, 255, 255, 0.1); border: none; width: 50px; height: 26px; border-radius: 13px; position: relative; cursor: pointer; margin-left: 1rem; }
        .theme-toggle::before { content: ''; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: hsl(var(--light)); border-radius: 50%; transition: var(--transition); }
        html.dark .theme-toggle::before { transform: translateX(24px); }
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .mobile-menu-btn { display: block; }
          .hero h1 { font-size: 2rem; }
          .hero p { font-size: 1rem; }
          .container { padding: 1rem; }
          .voice-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
          .features-grid, .quick-actions { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .header { padding: 1rem; }
          .hero { padding: 2rem 1rem; }
          .stat-card, .feature-card, .voice-preview { padding: 1.5rem; }
        }
      `}</style>
      <header className="header">
        <div className="nav-container">
          <div className="logo">
            <i className="fas fa-wave-square"></i>
            <span>VoiceLab AI</span>
          </div>
          <nav className="nav-links">
            <a href="#home" className="nav-link active" onClick={handleSmoothScroll}>Home</a>
            <a href="#voices" className="nav-link" onClick={handleSmoothScroll}>Voices</a>
            <a href="#features" className="nav-link" onClick={handleSmoothScroll}>Features</a>
            <a href="#pricing" className="nav-link" onClick={handleSmoothScroll}>Pricing</a>
            <a href="#docs" className="nav-link" onClick={handleSmoothScroll}>Docs</a>
            <button className="theme-toggle" onClick={toggleTheme}></button>
            <button className="btn btn-primary">Get Started</button>
          </nav>
          <button className="mobile-menu-btn" id="mobileMenuBtn" ref={mobileMenuBtnRef} onClick={toggleMobileMenu}>
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`} id="mobileNav" ref={mobileNavRef}>
          <a href="#home" className="nav-link active" onClick={handleSmoothScroll}>Home</a>
          <a href="#voices" className="nav-link" onClick={handleSmoothScroll}>Voices</a>
          <a href="#features" className="nav-link" onClick={handleSmoothScroll}>Features</a>
          <a href="#pricing" className="nav-link" onClick={handleSmoothScroll}>Pricing</a>
          <a href="#docs" className="nav-link" onClick={handleSmoothScroll}>Docs</a>
          <div style={{ padding: '1rem' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>Get Started</button>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero fade-in" id="home">
          <h1>Transform Text into Natural Speech</h1>
          <p>Professional AI-powered text-to-speech with 50+ natural voices. Perfect for content creators, developers, and businesses.</p>
          <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            <i className="fas fa-play-circle"></i> Try Demo Voices
          </button>
        </section>

        <section className="stats-grid fade-in">
          <div className="stat-card">
            <div className="stat-number">50+</div>
            <div className="stat-label">AI Voices</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">30+</div>
            <div className="stat-label">Languages</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">10M+</div>
            <div className="stat-label">Words Processed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </section>

        <section className="fade-in" id="features">
          <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Quick Actions</h2>
          <div className="quick-actions">
            <div className="action-card" onClick={startQuickTTS}>
              <div className="action-icon"><i className="fas fa-microphone"></i></div>
              <h3>Quick Speech</h3>
              <p>Generate speech instantly</p>
            </div>
            <div className="action-card" onClick={openVoiceStudio}>
              <div className="action-icon"><i className="fas fa-sliders-h"></i></div>
              <h3>Voice Studio</h3>
              <p>Advanced voice customization</p>
            </div>
            <div className="action-card" onClick={downloadSamples}>
              <div className="action-icon"><i className="fas fa-download"></i></div>
              <h3>Download Samples</h3>
              <p>Get voice samples</p>
            </div>
          </div>
        </section>

        <section className="fade-in" style={{ marginTop: '4rem' }}>
          <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-brain"></i></div>
              <h3>Neural Voices</h3>
              <p>Advanced neural network technology for natural-sounding speech.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-globe"></i></div>
              <h3>Multi-Language</h3>
              <p>Support for 30+ languages and accents.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-tachometer-alt"></i></div>
              <h3>Real-time Processing</h3>
              <p>Generate speech in milliseconds with our optimized engine.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-code"></i></div>
              <h3>API Access</h3>
              <p>Easy integration with REST API and SDKs.</p>
            </div>
          </div>
        </section>

        <section className="voice-preview fade-in" id="voices">
          <h2 style={{ marginBottom: '1rem' }}>Popular Voices</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>Click any voice to hear a preview</p>
          <div className="voice-grid">
            <div className="voice-item" onClick={(e) => playVoicePreview('aria', e)}>
              <div className="voice-avatar">👩</div>
              <h4>Aria</h4>
              <small style={{ color: 'var(--gray)' }}>English, Female</small>
            </div>
            <div className="voice-item" onClick={(e) => playVoicePreview('marcus', e)}>
              <div className="voice-avatar">👨</div>
              <h4>Marcus</h4>
              <small style={{ color: 'var(--gray)' }}>English, Male</small>
            </div>
            <div className="voice-item" onClick={(e) => playVoicePreview('sophie', e)}>
              <div className="voice-avatar">🇫🇷</div>
              <h4>Sophie</h4>
              <small style={{ color: 'var(--gray)' }}>French, Female</small>
            </div>
             <div className="voice-item" onClick={(e) => playVoicePreview('kenji', e)}>
                    <div className="voice-avatar">🇯🇵</div>
                    <h4>Kenji</h4>
                    <small style={{ color: 'var(--gray)' }}>Japanese, Male</small>
                </div>
                <div className="voice-item" onClick={(e) => playVoicePreview('isabella', e)}>
                    <div className="voice-avatar">🇪🇸</div>
                    <h4>Isabella</h4>
                    <small style={{ color: 'var(--gray)' }}>Spanish, Female</small>
                </div>
                <div className="voice-item" onClick={(e) => playVoicePreview('priya', e)}>
                    <div className="voice-avatar">🇮🇳</div>
                    <h4>Priya</h4>
                    <small style={{ color: 'var(--gray)' }}>Hindi, Female</small>
                </div>
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <div className="footer-content">
            <div className="footer-section">
                <h3>VoiceLab AI</h3>
                <p>Professional text-to-speech platform powered by advanced AI technology.</p>
            </div>
            <div className="footer-section">
                <h3>Product</h3>
                <a href="#voices" onClick={handleSmoothScroll}>Voices</a>
                <a href="#pricing" onClick={handleSmoothScroll}>Pricing</a>
                <a href="#api" onClick={handleSmoothScroll}>API Docs</a>
                <a href="#support" onClick={handleSmoothScroll}>Support</a>
            </div>
            <div className="footer-section">
                <h3>Legal</h3>
                <a href="#privacy" onClick={handleSmoothScroll}>Privacy Policy</a>
                <a href="#terms" onClick={handleSmoothScroll}>Terms of Service</a>
                <a href="#cookies" onClick={handleSmoothScroll}>Cookie Policy</a>
            </div>
            <div className="footer-section">
                <h3>Connect</h3>
                <a href="#twitter"><i className="fab fa-twitter"></i> Twitter</a>
                <a href="#github"><i className="fab fa-github"></i> GitHub</a>
                <a href="#discord"><i className="fab fa-discord"></i> Discord</a>
                <a href="#email"><i className="fas fa-envelope"></i> Contact</a>
            </div>
        </div>
        
        <div className="copyright">
            <p>&copy; 2024 VoiceLab AI. All rights reserved.</p>
        </div>
    </footer>
    </>
  );
}
