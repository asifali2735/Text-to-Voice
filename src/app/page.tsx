'use client';
import { useState, useEffect, useRef } from 'react';
import { textToSpeech } from '@/ai/flows/speech';

type ModuleName = 'speech-highlight' | 'image' | 'video' | 'edit' | 'voiceover' | 'code' | 'music';

type OutputMessage = {
    id: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    time: string;
};

export default function NeoStudioPage() {
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState<ModuleName>('speech-highlight');
    const [outputs, setOutputs] = useState<OutputMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const appContainerRef = useRef<HTMLDivElement>(null);
    const cyberLoaderRef = useRef<HTMLDivElement>(null);
    const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);


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

        addOutput('All AI modules initialized successfully', 'success', false);

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
        matrixCanvasRef.current = canvas;

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

    const addOutput = (message: string, type: OutputMessage['type'], showAlert = true) => {
        setOutputs(prev => {
            const newOutput = {
                id: Date.now(),
                message,
                type,
                time: new Date().toLocaleTimeString(),
            };
            const updatedOutputs = [newOutput, ...prev];
            return updatedOutputs.slice(0, 10);
        });
    };

    const clearOutput = () => {
        setOutputs([]);
        addOutput('Output cleared', 'info');
    };

    const handleActivateModule = (moduleName: ModuleName) => {
        setActiveModule(moduleName);
        addOutput(`Switched to ${moduleName.replace('-', ' & ').toUpperCase()} module`, 'info');
    };

    const getSelectedVoice = () => {
        const voiceSelect = document.getElementById('voiceType') as HTMLSelectElement;
        const selectedVoice = voiceSelect?.value || 'Algenib'; // Default to Algenib
        const voiceMap: { [key: string]: string } = {
            natural_female: 'Algenib',
            natural_male: 'Antares',
            young_boy: 'Canopus',
            chinese_female: 'Hadrian',
            chinese_male: 'Hadrian', // No distinct male Chinese voice in this set
            narrator: 'Bellatrix',
            cartoon: 'Izar',
            robotic: 'Fomalhaut',
        };
        return voiceMap[selectedVoice] || 'Algenib';
    };


    const generateAndPlaySpeech = async () => {
        const textInput = document.getElementById('ttsInput') as HTMLTextAreaElement;
        const text = textInput?.value;

        if (!text || !text.trim()) {
            addOutput('Please enter text to convert', 'warning');
            return;
        }

        if (!audioRef.current) {
            addOutput('Audio player not initialized.', 'error');
            return;
        }
        
        setIsGenerating(true);
        addOutput('Generating AI speech...', 'info');

        try {
            const voice = getSelectedVoice();
            const response = await textToSpeech({ text, voice });
            if (response.media) {
                addOutput('Speech generated. Playing now...', 'success');
                audioRef.current.src = response.media;
                audioRef.current.play();
                audioRef.current.onended = () => addOutput('Playback finished.', 'info');
            } else {
                throw new Error('No audio data received from AI.');
            }
        } catch (error: any) {
            console.error('Error generating speech:', error);
            addOutput(`Error: ${error.message || 'Could not generate speech.'}`, 'error');
        } finally {
            setIsGenerating(false);
        }
    };


    const downloadVoice = async () => {
        const textInput = document.getElementById('ttsInput') as HTMLTextAreaElement;
        const text = textInput?.value;

        if (!text || !text.trim()) {
            addOutput('Please enter text to generate audio for', 'warning');
            return;
        }

        setIsGenerating(true);
        addOutput('Generating AI voice for download...', 'info');

        try {
            const voice = getSelectedVoice();
            const response = await textToSpeech({ text, voice });
            if (response.media) {
                const link = document.createElement('a');
                link.href = response.media;
                link.download = 'speech.wav';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                addOutput('Voice downloaded as speech.wav', 'success');
            } else {
                throw new Error('No audio data received from AI.');
            }
        } catch (error: any) {
            console.error('Error downloading voice:', error);
            addOutput(`Error: ${error.message || 'Could not generate audio.'}`, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateImage = () => {
        const promptInput = document.getElementById('imagePrompt') as HTMLTextAreaElement;
        const prompt = promptInput?.value;

        if (!prompt || !prompt.trim()) {
            addOutput('Please enter an image description', 'warning');
            return;
        }

        addOutput(`Generating image: "${prompt}"`, 'info');

        const canvas = document.getElementById('imageCanvas');
        if (!canvas) return;
        
        canvas.innerHTML = '<div style="text-align: center;"><div class="spinner"></div><p style="color: var(--gray); margin-top: 10px;">Generating AI image...</p></div>';

        setTimeout(() => {
            const images = [
                'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop'
            ];
            const randomImage = images[Math.floor(Math.random() * images.length)];
            canvas.innerHTML = `<img src="${randomImage}" alt="Generated Image" style="width: 100%; border-radius: var(--radius-md);">`;
            addOutput('Image generated successfully', 'success');
        }, 3000);
    };

    const projectAction = (action: 'save' | 'export' | 'runAll') => {
        const messages = {
            save: { start: 'Saving project...', end: 'Project saved to cloud storage' },
            export: { start: 'Exporting project files...', end: 'Project exported successfully' },
            runAll: { start: 'Running all AI modules in sequence...', end: 'All AI processes completed' }
        };
        addOutput(messages[action].start, 'info');
        setTimeout(() => {
            addOutput(messages[action].end, 'success');
        }, 2000);
    };

    const modules: { id: ModuleName; icon: string; title: string; desc: string }[] = [
        { id: 'speech-highlight', icon: 'fa-pen-to-square', title: 'Speech & Highlight', desc: 'Generate speech and highlight text' },
        { id: 'image', icon: 'fa-image', title: 'AI Image Generator', desc: 'Create images from prompts' },
        { id: 'video', icon: 'fa-video', title: 'Text to Video', desc: 'Generate videos from text' },
        { id: 'edit', icon: 'fa-edit', title: 'Photo Editing', desc: 'AI-powered photo editing' },
        { id: 'voiceover', icon: 'fa-microphone-alt', title: 'Voice on Video', desc: 'Add voiceovers to videos' },
        { id: 'code', icon: 'fa-code', title: 'Code Generation', desc: 'Generate code from prompts' },
        { id: 'music', icon: 'fa-music', title: 'AI Music Generator', desc: 'Create music from text' },
    ];
    
    const outputColors = {
        info: 'var(--primary)',
        success: 'var(--secondary)',
        warning: 'var(--accent)',
        error: 'var(--danger)'
    };


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
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div className="neural-btn" onClick={() => projectAction('export')}><i className="fas fa-download"></i> Export</div>
                        <div className="neural-btn secondary" onClick={() => projectAction('save')}><i className="fas fa-save"></i> Save</div>
                        <div className="neural-btn" style={{ background: 'var(--accent)' }} onClick={() => projectAction('runAll')}><i className="fas fa-play"></i> Run All AI</div>
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
                                    <textarea className="prompt-input" id="ttsInput" placeholder="Enter text to convert to speech or highlight..." defaultValue="Welcome to Neo Studio. 欢迎来到 Neo Studio."></textarea>
                                </div>
                                <div className="ai-controls">
                                    <div className="control-panel">
                                        <h3 className="control-title"><i className="fas fa-sliders-h"></i> Voice Settings</h3>
                                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--gray)' }}>Voice Type</label>
                                        <select id="voiceType" style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', color: 'white', marginBottom: '20px' }}>
                                            <option value="natural_female">Natural Female</option>
                                            <option value="natural_male">Natural Male</option>
                                            <option value="young_boy">Young Boy</option>
                                            <option value="chinese_female">Chinese Female</option>
                                            <option value="chinese_male">Chinese Male</option>
                                            <option value="narrator">Narrator</option>
                                            <option value="cartoon">Cartoon</option>
                                            <option value="robotic">Robotic</option>
                                        </select>
                                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--gray)' }}>Emotion</label>
                                        <input type="range" className="neural-slider" id="emotionSlider" min="0" max="100" defaultValue="50" />
                                        <label style={{ display: 'block', margin: '20px 0 10px', color: 'var(--gray)' }}>Speed</label>
                                        <input type="range" className="neural-slider" id="speedSlider" min="0.5" max="2" step="0.1" defaultValue="1" />
                                    </div>
                                    <div className="control-panel">
                                        <h3 className="control-title"><i className="fas fa-highlighter"></i> Highlight Settings</h3>
                                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--gray)' }}>Highlight Style</label>
                                        <select style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', color: 'white', marginBottom: '20px' }}>
                                            <option>Karaoke</option>
                                            <option>Word by Word</option>
                                            <option>Full Sentence</option>
                                        </select>
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
                                     <textarea className="prompt-input" id="imagePrompt" placeholder="Describe the image you want to generate..." defaultValue="A cyberpunk cityscape at night with neon lights, flying cars, and holographic advertisements, ultra detailed, 8k"></textarea>
                                 </div>
                                 <div className="ai-controls">
                                     <div className="control-panel">
                                         <h3 className="control-title"><i className="fas fa-palette"></i> Style Settings</h3>
                                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                             <button className="neural-btn" style={{ padding: '10px' }}>Realistic</button>
                                             <button className="neural-btn" style={{ padding: '10px' }}>Anime</button>
                                             <button className="neural-btn" style={{ padding: '10px' }}>Cyberpunk</button>
                                             <button className="neural-btn" style={{ padding: '10px' }}>Fantasy</button>
                                         </div>
                                     </div>
                                     <div className="control-panel">
                                         <h3 className="control-title"><i className="fas fa-cogs"></i> Advanced</h3>
                                         <label style={{ display: 'block', marginBottom: '10px', color: 'var(--gray)' }}>Resolution</label>
                                         <select style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', color: 'white' }}>
                                             <option>512x512</option><option>768x768</option><option>1024x1024</option><option>2048x2048</option>
                                         </select>
                                     </div>
                                 </div>
                                 <div className="preview-area">
                                     <div className="preview-container">
                                         <div className="ai-canvas" id="imageCanvas">
                                             <i className="fas fa-image" style={{ fontSize: '48px', color: 'var(--gray)' }}></i>
                                         </div>
                                     </div>
                                 </div>
                                 <button className="neural-btn large" onClick={generateImage} style={{ width: '100%' }}>
                                     <i className="fas fa-magic"></i> Generate Image
                                 </button>
                             </div>
                        )}
                         {/* Other modules would be conditionally rendered here */}
                    </div>

                    <div className="neural-output">
                        <div className="output-header">
                            <h3>AI Output</h3>
                            <button className="neural-btn" onClick={clearOutput} style={{ padding: '8px 15px', fontSize: '14px' }}>
                                <i className="fas fa-trash"></i> Clear
                            </button>
                        </div>
                        <div className="output-list" id="outputList">
                           {outputs.map(out => (
                             <div key={out.id} className="output-item" style={{ borderLeftColor: outputColors[out.type] }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <strong style={{ color: outputColors[out.type] }}>{out.type.toUpperCase()}</strong>
                                 <span style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{out.time}</span>
                               </div>
                               <p style={{ color: 'var(--gray)', margin: '5px 0 0' }}>{out.message}</p>
                             </div>
                           ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
      </>
    );
}
