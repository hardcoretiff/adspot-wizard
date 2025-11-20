import React, { useState } from 'react';
import { Bot, ChevronRight, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I\'m your AdSpot assistant. I can help you navigate the campaign setup. Any questions so far?' }
  ]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 ${isOpen ? 'rotate-0 scale-0' : 'rotate-0 scale-100'}`}
      >
        <Bot size={24} />
      </button>

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-neutral-900 border-l border-neutral-800 shadow-2xl transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-4 bg-neutral-900">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-red-500" />
              <span className="font-bold text-white">AdSpot Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-xl text-sm 
                    ${msg.type === 'user' 
                      ? 'bg-red-600 text-white rounded-br-none' 
                      : 'bg-neutral-800 text-gray-200 rounded-bl-none border border-neutral-700'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-900">
            <div className="text-xs text-gray-500 mb-2 text-center">
              AI can assist with strategy after subscription
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:ring-1 focus:ring-red-500 outline-none"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;