import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Support both AI Studio (process.env) and Vercel/Vite (import.meta.env)
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey as string });

export function VoiceWidget() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(0);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  
  // Audio playback queue
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const nextPlayTimeRef = useRef(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  const cleanupAudio = () => {
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
  };

  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const playAudioChunk = async (base64Audio: string) => {
    if (!audioContextRef.current) return;
    
    try {
      const arrayBuffer = base64ToArrayBuffer(base64Audio);
      // The model returns 24kHz PCM audio. We need to decode it.
      // Since it's raw PCM, we have to convert it to Float32Array manually.
      const int16Array = new Int16Array(arrayBuffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }
      
      audioQueueRef.current.push(float32Array);
      
      if (!isPlayingRef.current) {
        processAudioQueue();
      }
    } catch (error) {
      console.error('Error decoding audio chunk:', error);
    }
  };

  const processAudioQueue = () => {
    if (!audioContextRef.current || audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const chunk = audioQueueRef.current.shift()!;
    
    const audioBuffer = audioContextRef.current.createBuffer(1, chunk.length, 24000);
    audioBuffer.getChannelData(0).set(chunk);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    
    if (analyserRef.current) {
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    } else {
      source.connect(audioContextRef.current.destination);
    }
    
    const currentTime = audioContextRef.current.currentTime;
    const startTime = Math.max(currentTime, nextPlayTimeRef.current);
    
    source.start(startTime);
    nextPlayTimeRef.current = startTime + audioBuffer.duration;
    
    source.onended = () => {
      processAudioQueue();
    };
  };

  const updateVolume = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      setVolume(average);
    }
    animationFrameRef.current = requestAnimationFrame(updateVolume);
  };

  const connect = async () => {
    try {
      setIsConnecting(true);
      setHasError(false);
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      
      analyserRef.current = audioCtx.createAnalyser();
      analyserRef.current.fftSize = 256;
      updateVolume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const sourceNode = audioCtx.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;
      
      const processorNode = audioCtx.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processorNode;
      
      sourceNode.connect(processorNode);
      processorNode.connect(audioCtx.destination);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are a helpful voice receptionist for Cascade Plumbing Services in Denver, Colorado. Be conversational, natural, and brief. When a user greets you (e.g., "hi", "hello"), simply say hello and ask how you can help (e.g., "Hello! This is Cascade Plumbing. How can I help you today?"). DO NOT list our services or mention the $89 dispatch fee unless the user specifically asks about them. Answer questions naturally one at a time. Our services: emergency plumbing, drain cleaning, water heater repair, pipe leak fixes. Keep your answers brief as they are spoken aloud.',
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            
            processorNode.onaudioprocess = (e) => {
              if (isMuted) return;
              
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
              }
              
              const buffer = new Uint8Array(pcmData.buffer);
              let binary = '';
              // Process in chunks to avoid call stack size exceeded
              const chunkSize = 8192;
              for (let i = 0; i < buffer.length; i += chunkSize) {
                const chunk = buffer.subarray(i, i + chunkSize);
                binary += String.fromCharCode.apply(null, Array.from(chunk));
              }
              const base64Data = window.btoa(binary);
              
              sessionPromise.then((session: any) => {
                session.sendRealtimeInput({
                  audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.interrupted) {
              audioQueueRef.current = [];
              if (audioContextRef.current) {
                nextPlayTimeRef.current = audioContextRef.current.currentTime;
              }
            }
            
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              playAudioChunk(base64Audio);
            }
          },
          onerror: (error) => {
            console.error('Live API Error:', error);
            setHasError(true);
            disconnect();
          },
          onclose: () => {
            disconnect();
          }
        }
      });
      
      sessionRef.current = sessionPromise;
      
    } catch (error) {
      console.error('Failed to connect:', error);
      setHasError(true);
      setIsConnecting(false);
      cleanupAudio();
    }
  };

  const disconnect = () => {
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
      sessionRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    cleanupAudio();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-24 md:right-48 z-40">
      <AnimatePresence>
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 left-4 right-4 mx-auto md:absolute md:bottom-16 md:right-0 md:left-auto md:mx-0 origin-bottom md:origin-bottom-right bg-white rounded-2xl shadow-xl p-4 border border-gray-100 flex flex-col items-center gap-4 w-auto md:w-64 max-w-[320px]"
          >
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">Live Voice Assistant</h3>
              <p className="text-xs text-gray-500">Powered by Gemini</p>
            </div>
            
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-blue-100 rounded-full transition-all duration-75"
                style={{ transform: `scale(${1 + volume / 100})` }}
              />
              <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <Volume2 className="w-8 h-8" />
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={toggleMute}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="text-sm font-medium">{isMuted ? 'Muted' : 'Mute'}</span>
              </button>
              <button
                onClick={disconnect}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
              >
                End Call
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isConnected && (
        <button
          onClick={connect}
          disabled={isConnecting}
          className={`p-4 md:px-5 md:py-3 rounded-full shadow-lg transition-colors flex items-center justify-center gap-2 ${
            hasError ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'
          } text-white`}
          aria-label="Start voice call"
        >
          {isConnecting ? (
            <Loader2 className="w-6 h-6 md:w-5 md:h-5 animate-spin" />
          ) : (
            <Mic className="w-6 h-6 md:w-5 md:h-5" />
          )}
          <span className="hidden md:block font-medium">Click here to Talk</span>
        </button>
      )}
    </div>
  );
}
