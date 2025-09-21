
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
// FIX: Corrected the import from 'startEcoHelperChat' to 'startAiAssistantChat' as exported from geminiService.
import { startAiAssistantChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { SparklesIcon, SendIcon } from './Icons';

const EcoHelper: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // FIX: Corrected the function call from 'startEcoHelperChat' to 'startAiAssistantChat'.
        const chatInstance = startAiAssistantChat();
        if (chatInstance) {
            setChat(chatInstance);
            setMessages([
                { role: 'model', text: 'Hello! I am your Eco Helper. Ask me anything about sustainability, recycling, or conservation!' }
            ]);
        } else {
            setError("Could not initialize Eco Helper. The API key might be missing.");
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        // Add a placeholder for the model's response to stream into
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        try {
            const stream = await chat.sendMessageStream({ message: input });
            
            for await (const chunk of stream) {
                // FIX: Access the text directly from the chunk, which is a GenerateContentResponse.
                const chunkText = chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text += chunkText;
                    return newMessages;
                });
            }

        } catch (e) {
            console.error(e);
            setError("Sorry, I couldn't process that request. Please try again.");
            setMessages(prev => prev.slice(0, -1)); // Remove the empty model message
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 border-b flex items-center space-x-2 bg-gray-50">
                <SparklesIcon className="w-6 h-6 text-green-600" />
                <h1 className="text-xl font-bold text-gray-800">Eco Helper</h1>
            </div>
            
            <div ref={chatContainerRef} className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-100/50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg px-4 py-3 rounded-2xl ${
                            msg.role === 'user' 
                                ? 'bg-green-600 text-white rounded-br-none' 
                                : `bg-white text-gray-800 rounded-bl-none shadow-sm ${isLoading && index === messages.length -1 ? 'typing-indicator' : ''}`
                        }`}>
                           {msg.text || (isLoading && <span className="animate-pulse">...</span>)}
                        </div>
                    </div>
                ))}
                {error && <p className="text-red-500 text-center">{error}</p>}
            </div>

            <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={error ? "Helper is unavailable" : "Ask an eco-question..."}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                        disabled={isLoading || !!error}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim() || !!error}
                        className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EcoHelper;
