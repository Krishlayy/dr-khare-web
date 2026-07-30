import { useState } from 'react';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  // Defaulting to local port 3001 assuming the external chatbot runs there locally
  // In production, this can be swapped with a real deployed URL
  const CHATBOT_URL = "http://localhost:5173/"; 

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* 1/4th Screen Popup Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] max-h-[70vh] bg-background border border-rule/60 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-ink text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-sm">AI Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:text-gold transition-colors font-bold text-lg leading-none"
            >
              &times;
            </button>
          </div>
          
          {/* External Chatbot Iframe */}
          <iframe 
            src={CHATBOT_URL} 
            className="w-full flex-grow border-0 bg-white"
            title="AI Assistant Chat"
            allow="microphone"
          />
        </div>
      )}

      {/* Floating 3D Character Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 relative group bg-white border-2 border-rule overflow-hidden flex items-center justify-center"
      >
        <span className="text-2xl">🤖</span>
        
        {/* Notification dot */}
        {!isOpen && (
           <span className="absolute top-0 right-0 flex h-4 w-4">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
             <span className="relative inline-flex rounded-full h-4 w-4 bg-gold border-2 border-white"></span>
           </span>
        )}
      </button>
    </div>
  );
}
