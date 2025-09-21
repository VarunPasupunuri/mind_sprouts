
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { startAiAssistantChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { SparklesIcon, SendIcon, XIcon, MicrophoneIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';

// FIX: Add minimal TypeScript definitions for the Web Speech API to resolve "Cannot find name 'SpeechRecognition'" errors.
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
  onend: (this: SpeechRecognition, ev: Event) => any;
  onerror: (this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

const AiAssistant: React.FC = () => {
    const { t, language } = useI18n();
    const { user, stats } = useAuth();
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    // New states for speech recognition
    const [isListening, setIsListening] = useState(false);
    const [speechSupport, setSpeechSupport] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Effect to set up SpeechRecognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setSpeechSupport(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = language;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };

            recognition.onend = () => {
                setIsListening(false);
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            setSpeechSupport(false);
            console.warn("Speech recognition not supported in this browser.");
        }
    }, [language]);


    useEffect(() => {
        const chatInstance = startAiAssistantChat();
        if (chatInstance) {
            setChat(chatInstance);
            
            let greeting: string;
            if (stats.challengesCompleted > 0) {
                greeting = t('ai_assistant_greeting_personalized')
                    .replace('{name}', user?.userId || 'Eco-Champ')
                    .replace('{count}', stats.challengesCompleted.toString());
            } else {
                greeting = t('ai_assistant_greeting_new_user')
                    .replace('{name}', user?.userId || 'Eco-Champ');
            }

            setMessages([
                { role: 'model', text: greeting }
            ]);
        } else {
            setError(t('ai_assistant_init_error'));
        }
    }, [t, user, stats]);

    useEffect(() => {
        if (isOpen && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        try {
            const stream = await chat.sendMessageStream({ message: input });
            
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text += chunkText;
                    return newMessages;
                });
            }

        } catch (e) {
            console.error(e);
            setError(t('ai_assistant_request_error'));
            setMessages(prev => prev.slice(0, -1)); 
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleToggleListen = () => {
        if (!recognitionRef.current) return;
    
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                setInput('');
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error("Could not start speech recognition", err);
                setIsListening(false);
            }
        }
    };

    return (
        <>
            <style>{`
                .chat-window {
                  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .chat-window-enter { transform: translateY(20px) scale(0.95); opacity: 0; }
                .chat-window-enter-active { transform: translateY(0) scale(1); opacity: 1; }
                .chat-window-exit { transform: translateY(0) scale(1); opacity: 1; }
                .chat-window-exit-active { transform: translateY(20px) scale(0.95); opacity: 0; }
            `}</style>
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
                {/* Chat Window */}
                {isOpen && (
                    <div className="chat-window chat-window-enter chat-window-enter-active mb-4 w-80 h-[28rem] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col origin-bottom-right border dark:border-gray-700">
                         <div className="p-3 border-b dark:border-gray-700 flex items-center justify-between space-x-2 bg-gray-50 dark:bg-gray-900/50 rounded-t-2xl flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <SparklesIcon className="w-6 h-6 text-green-600" />
                                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('ai_assistant')}</h1>
                            </div>
                        </div>
                        
                        <div ref={chatContainerRef} className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-100/50 dark:bg-gray-800/50">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-green-600 text-white rounded-br-none' 
                                            : `bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none shadow-sm ${isLoading && index === messages.length -1 ? 'typing-indicator' : ''}`
                                    }`}>
                                    {msg.text || (isLoading && <span className="animate-pulse">...</span>)}
                                    </div>
                                </div>
                            ))}
                            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                        </div>

                        <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-900/50 rounded-b-2xl flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={
                                        isListening 
                                            ? t('listening_message') 
                                            : error ? t('ai_assistant_unavailable') : t('ask_eco_question')
                                    }
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                    disabled={isLoading || !!error || isListening}
                                />
                                {speechSupport && (
                                    <button
                                        onClick={handleToggleListen}
                                        disabled={isLoading || !!error}
                                        className={`p-2 rounded-full transition-colors ${
                                            isListening
                                                ? 'bg-red-500 text-white animate-pulse'
                                                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                        }`}
                                        aria-label={isListening ? t('stop_listening') : t('start_listening')}
                                    >
                                        <MicrophoneIcon className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim() || !!error || isListening}
                                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    <SendIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* FAB Button */}
                <button 
                    id="ai-assistant-fab"
                    onClick={() => setIsOpen(!isOpen)} 
                    className="w-16 h-16 bg-brand-primary rounded-full shadow-lg flex items-center justify-center text-white btn-hover"
                    aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
                >
                    {isOpen ? <XIcon className="w-8 h-8"/> : <SparklesIcon className="w-8 h-8"/>}
                </button>
            </div>
        </>
    );
};

export default AiAssistant;