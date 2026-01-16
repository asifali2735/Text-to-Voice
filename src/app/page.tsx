'use client';
import { useState, useEffect, useRef } from 'react';
import { textToSpeech } from '@/ai/flows/speech';
import { generateImage as generateImageFlow } from '@/ai/flows/image';

type ModuleName = 'speech-highlight' | 'image' | 'video' | 'edit' | 'voiceover';

export default function NeoStudioPage() {
    const [activeModule, setActiveModule] = useState<ModuleName>('speech-highlight');
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageStyle, setImageStyle] = useState('Cyberpunk');
    const appContainerRef = useRef<HTMLDivElement>(null);
    const cyberLoaderRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [ttsText, setTtsText] = useState('Hello. Bonjour. Hola. こんにちは. Здравствуйте.');
    const [imagePrompt, setImagePrompt] = useState('A cyberpunk cityscape at night with neon lights, flying cars, and holographic advertisements, ultra detailed, 8k');
    const [selectedVoice, setSelectedVoice] = useState('Algenib');


    useEffect(() => {
        const timer = setTimeout(() => {
            if (cyberLoaderRef.current) {
                cyberLoaderRef.current.style.opacity = '0';
                setTimeout(() => {
                    if (cyberLoaderRef.current) cyberLoaderRef.current.style.display = 'none';
                    if (appContainerRef.current) {
                        appContainerRef.current.style.display = 'block';
                        setTimeout(() => {
                            if (appContainerRef.current) appContainerRef.current.style.opacity = '1';
                            initializeMatrixEffect();
                        }, 50);
                    }
                }, 500);
            }
        }, 2000);

        // Create a hidden audio element to play the speech
        const audio = new Audio();
        audio.hidden = true;
        document.body.appendChild(audio);
        audioRef.current = audio;


        return () => {
            clearTimeout(timer);
            if (audioRef.current) {
                document.body.removeChild(audioRef.current);
            }
        };
    }, []);

    const initializeMatrixEffect = () => {
        const canvas = document.createElement('canvas');
        canvas.className = 'matrix-effect';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = "01";
        const charSize = 14;
        const columns = canvas.width / charSize;
        const drops: number[] = [];

        for (let i = 0; i < columns; i++) drops[i] = 1;

        function drawMatrix() {
            if (!ctx) return;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0af';
            ctx.font = `${charSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * charSize, drops[i] * charSize);

                if (drops[i] * charSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const intervalId = setInterval(drawMatrix, 50);

        const handleResize = () => {
            if (canvas && ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', handleResize);
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        };
    };

    const handleActivateModule = (moduleName: ModuleName) => {
        setActiveModule(moduleName);
    };

    const generateAndPlaySpeech = async () => {
        if (!ttsText || !ttsText.trim()) {
            console.warn('Please enter text to convert');
            return;
        }

        if (!audioRef.current) {
            console.error('Audio player not initialized.');
            return;
        }
        
        setIsGenerating(true);

        try {
            const response = await textToSpeech({ text: ttsText, voice: selectedVoice });
            if (response.media) {
                audioRef.current.src = response.media;
                audioRef.current.play();
            } else {
                throw new Error('No audio data received from AI.');
            }
        } catch (error: any) {
            console.error('Error generating speech:', error);
        } finally {
            setIsGenerating(false);
        }
    };


    const downloadVoice = async () => {
        if (!ttsText || !ttsText.trim()) {
            console.warn('Please enter text to generate audio for');
            return;
        }

        setIsGenerating(true);

        try {
            const response = await textToSpeech({ text: ttsText, voice: selectedVoice });
            if (response.media) {
                const link = document.createElement('a');
                link.href = response.media;
                link.download = 'speech.wav';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                throw new Error('No audio data received from AI.');
            }
        } catch (error: any) {
            console.error('Error downloading voice:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const generateImage = async () => {
        if (!imagePrompt || !imagePrompt.trim()) {
            console.warn('Please enter an image description');
            return;
        }

        const finalPrompt = `${imagePrompt}, ${imageStyle} style`;
        setIsGenerating(true);

        const canvas = document.getElementById('imageCanvas');
        if (!canvas) {
            setIsGenerating(false);
            return;
        }
        
        canvas.innerHTML = '<div style="text-align: center;"><div class="spinner"></div><p style="color: var(--gray); margin-top: 10px;">Generating AI image...</p></div>';

        try {
            const response = await generateImageFlow({ prompt: finalPrompt });
            if (response.url) {
                canvas.innerHTML = `<img src="${response.url}" alt="Generated Image" style="width: 100%; border-radius: var(--radius-md);">`;
            } else {
                throw new Error('No image data received from AI.');
            }
        } catch (error: any) {
            console.error('Error generating image:', error);
            canvas.innerHTML = `<i class="fas fa-image" style="font-size: 48px; color: var(--gray);"></i>`;
        } finally {
            setIsGenerating(false);
        }
    };

    const modules: { id: ModuleName; icon: string; title: string; desc: string }[] = [
        { id: 'speech-highlight', icon: 'fa-pen-to-square', title: 'Speech & Highlight', desc: 'Generate speech and highlight text' },
        { id: 'image', icon: 'fa-image', title: 'AI Image Generator', desc: 'Create images from prompts' },
        { id: 'video', icon: 'fa-video', title: 'Text to Video', desc: 'Generate videos from text' },
        { id: 'edit', icon: 'fa-edit', title: 'Photo Editing', desc: 'AI-powered photo editing' },
        { id: 'voiceover', icon: 'fa-microphone-alt', title: 'Voice on Video', desc: 'Add voiceovers to videos' },
    ];
    
    const imageStyles = ['Realistic', 'Anime', 'Cyberpunk', 'Fantasy'];

    const PlaceholderModule = ({ icon, title }: { icon: string, title: string }) => (
      <div className="module-content active">
          <div className="workspace-header">
              <h2 className="workspace-title"><i className={`fas ${icon}`}></i> {title}</h2>
              <p className="workspace-subtitle">This feature is coming soon.</p>
          </div>
          <div style={{ textAlign: 'center', color: 'var(--gray)', marginTop: '80px' }}>
              <i className={`fas ${icon}`} style={{ fontSize: '48px', marginBottom: '20px' }}></i>
              <h3>Module Under Construction</h3>
              <p>This AI module is currently in development. Check back later!</p>
          </div>
      </div>
    );


    return (
      <>
        <div className="cyber-loader" id="cyberLoader" ref={cyberLoaderRef}>
            <div className="cyber-grid">
                {[...Array(16)].map((_, i) => (
                    <div key={i} className="cyber-cell" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
            </div>
            <h2 style={{ color: 'var(--primary)', marginTop: '20px' }}>INITIALIZING NEO STUDIO</h2>
            <p style={{ color: 'var(--gray)', marginTop: '10px' }}>Loading quantum neural networks...</p>
        </div>

        <div className="app-container" id="appContainer" ref={appContainerRef}>
            <header className="holographic-header">
                <div className="header-content">
                    <div className="logo">
                        <div className="logo-icon"><i className="fas fa-brain"></i></div>
                        <div className="logo-text">NEO STUDIO</div>
                    </div>
                </div>
            </header>

            <main className="neural-dashboard">
                <div className="dashboard-grid">
                    <div className="neural-modules">
                        <h3 style={{ marginBottom: '25px', color: 'var(--light)' }}>AI MODULES</h3>
                        {modules.map(mod => (
                             <div key={mod.id} className={`module-item ${activeModule === mod.id ? 'active' : ''}`} onClick={() => handleActivateModule(mod.id)}>
                                <div className="module-icon"><i className={`fas ${mod.icon}`}></i></div>
                                <h4>{mod.title}</h4>
                                <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{mod.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="main-workspace">
                        {activeModule === 'speech-highlight' && (
                            <div id="speechHighlightModule" className="module-content active">
                                <div className="workspace-header">
                                    <h2 className="workspace-title">🎙️ Speech & Highlight</h2>
                                    <p className="workspace-subtitle">Generate natural AI voices and prepare text for video highlighting</p>
                                </div>
                                <div className="prompt-system">
                                    <textarea 
                                      className="prompt-input" 
                                      id="ttsInput" 
                                      placeholder="Enter text to convert to speech or highlight..." 
                                      value={ttsText}
                                      onChange={(e) => setTtsText(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="ai-controls">
                                    <div className="control-panel">
                                        <h3 className="control-title"><i className="fas fa-sliders-h"></i> Voice Settings</h3>
                                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--gray)' }}>Voice Type</label>
                                        <select 
                                          id="voiceType" 
                                          value={selectedVoice}
                                          onChange={(e) => setSelectedVoice(e.target.value)}
                                          style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', color: 'white', marginBottom: '20px' }}
                                        >
                                            <option value="Algenib">Natural Female</option>
                                            <option value="Antares">Natural Male</option>
                                            <option value="Canopus">Young Boy</option>
                                            <option value="Hadrian">Chinese Female</option>
                                            <option value="Bellatrix">Narrator</option>
                                            <option value="Izar">Cartoon</option>
                                            <option value="Fomalhaut">Robotic</option>
                                        </select>
                                    </div>
                                    <div className="control-panel">
                                        <h3 className="control-title"><i className="fas fa-cogs"></i> Actions</h3>
                                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                                            <button className="neural-btn" onClick={generateAndPlaySpeech} style={{ padding: '12px' }} disabled={isGenerating}>
                                                {isGenerating ? <div className="spinner" style={{width: '20px', height: '20px', margin: 0}}></div> : <><i className="fas fa-play"></i> Generate Speech</>}
                                            </button>
                                            <button className="neural-btn secondary" onClick={downloadVoice} style={{ padding: '12px' }} disabled={isGenerating}>
                                                {isGenerating ? <div className="spinner" style={{width: '20px', height: '20px', margin: 0}}></div> : <><i className="fas fa-download"></i> Download</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeModule === 'image' && (
                             <div id="imageModule" className="module-content active">
                                 <div className="workspace-header">
                                     <h2 className="workspace-title">🎨 AI Image Generator</h2>
                                     <p className="workspace-subtitle">Generate stunning images from text prompts</p>
                                 </div>
                                 <div className="prompt-system">
                                     <textarea 
                                       className="prompt-input" 
                                       id="imagePrompt" 
                                       placeholder="Describe the image you want to generate..." 
                                       value={imagePrompt}
                                       onChange={(e) => setImagePrompt(e.target.value)}
                                      ></textarea>
                                 </div>
                                 <div className="ai-controls">
                                     <div className="control-panel">
                                         <h3 className="control-title"><i className="fas fa-palette"></i> Style Settings</h3>
                                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                             {imageStyles.map(style => (
                                                <button
                                                    key={style}
                                                    className={`neural-btn ${imageStyle === style ? 'secondary' : ''}`}
                                                    style={{ padding: '10px' }}
                                                    onClick={() => setImageStyle(style)}
                                                >
                                                    {style}
                                                </button>
                                             ))}
                                         </div>
                                     </div>
                                     <div className="control-panel">
                                         <h3 className="control-title"><i className="fas fa-cogs"></i> Actions</h3>
                                         <button className="neural-btn large" onClick={generateImage} style={{ width: '100%' }} disabled={isGenerating}>
                                             {isGenerating ? <div className="spinner" style={{width: '20px', height: '20px', margin: 0}}></div> : <><i className="fas fa-magic"></i> Generate Image</>}
                                         </button>
                                     </div>
                                 </div>
                                 <div className="preview-area">
                                     <div className="preview-container">
                                         <div className="ai-canvas" id="imageCanvas">
                                             <i className="fas fa-image" style={{ fontSize: '48px', color: 'var(--gray)' }}></i>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        )}
                        {activeModule === 'video' && <PlaceholderModule icon="fa-video" title="Text to Video" />}
                        {activeModule === 'edit' && <PlaceholderModule icon="fa-edit" title="Photo Editing" />}
                        {activeModule === 'voiceover' && <PlaceholderModule icon="fa-microphone-alt" title="Voice on Video" />}
                    </div>
                </div>
            </main>
        </div>
      </>
    );
}
