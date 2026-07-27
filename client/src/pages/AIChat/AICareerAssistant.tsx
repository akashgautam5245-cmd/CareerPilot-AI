import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { ChatMessage } from '../../types';
import { Bot, Send, User, Sparkles, Code, FileText, Compass, BookOpen, RefreshCw } from 'lucide-react';

export const AICareerAssistant: React.FC = () => {
  const { addToast } = useNotification();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      role: 'assistant',
      text: 'Hello! I am your AI Career Coach & Technical Advisor. Ask me anything about ATS resume optimization, interview prep, project architectures, or coding advice.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setIsSending(true);

    try {
      const res: any = await api.post('/ai/chat', {
        messages: messages.map(m => ({ role: m.role, message: m.text })),
        userMessage: text,
      });

      if (res.success && res.data?.reply) {
        const assistantMsg: ChatMessage = {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          text: res.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      addToast('error', 'Chat Error', err.message);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    { label: 'Resume Formatting Tips', text: 'How do I format my work experience bullet points for maximum ATS score?' },
    { label: 'STAR Interview Method', text: 'Explain how to answer behavioral interview questions using the STAR method.' },
    { label: 'Full-Stack Project Ideas', text: 'Give me 3 impressive full-stack project ideas for a Software Engineer resume.' },
    { label: 'System Design Basics', text: 'What are key principles to mention in a System Design interview for a web app?' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Bot className="w-7 h-7 text-blue-500" /> AI Career & Coding Assistant
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Instant guidance for resumes, interview prep, career roadmaps, and software engineering questions
        </p>
      </div>

      {/* Chat Container */}
      <div className="glass-panel rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col h-[600px] overflow-hidden">
        {/* Messages Scroll View */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                  m.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-tr from-indigo-600 to-cyan-400'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-gray-100 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-tl-none'
                }`}
              >
                {m.text}
                <span className={`block text-[10px] mt-1.5 opacity-60 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium italic pl-11">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> AI Assistant is thinking...
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-gray-50/50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex-shrink-0">Prompts:</span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qp.text)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 flex-shrink-0 transition-colors"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <input
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about resume tips, coding advice, or interview questions..."
            className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isSending}
            className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg glow-blue transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
