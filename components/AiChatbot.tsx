import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToChatStream, startChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../hooks/useLanguage';

const AiChatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { t, language } = useLanguage();

    useEffect(() => {
        startChat(language);
        setMessages([
            { sender: 'model', text: t('aiChatbot.initialMessage') }
        ]);
    }, [t, language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await sendMessageToChatStream(userMessage.text, language);
            
            let modelResponse = '';
            setMessages(prev => [...prev, { sender: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages.length > 0 && newMessages[newMessages.length - 1].sender === 'model' && newMessages[newMessages.length - 1].text === '') {
                    newMessages.pop();
                }
                return [...newMessages, { sender: 'model', text: t('aiChatbot.errorMessage') }];
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg flex flex-col h-[70vh] transition-colors">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 p-4 border-b border-zinc-200 dark:border-zinc-700">{t('aiChatbot.title')}</h2>
            <div className="flex-grow p-4 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                                K
                            </div>
                        )}
                        <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-be-lg' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-bs-lg'}`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                         {msg.sender === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-zinc-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                                U
                            </div>
                        )}
                    </div>
                ))}
                 {isLoading && messages[messages.length-1].sender === 'user' && (
                     <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">K</div>
                        <div className="px-4 py-3 rounded-2xl bg-zinc-200 dark:bg-zinc-700 rounded-bs-lg">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('aiChatbot.placeholder')}
                        disabled={isLoading}
                        className="flex-grow w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-700 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:bg-zinc-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-white dark:focus:ring-offset-zinc-800 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiChatbot;