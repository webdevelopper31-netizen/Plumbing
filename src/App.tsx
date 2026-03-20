import { Bot, MessageSquare, Mic, Zap } from 'lucide-react';
import { Chatbot } from './components/Chatbot';
import { VoiceWidget } from './components/VoiceWidget';

export default function App() {
  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">
      {/* Agency Header */}
      <header className="bg-white border-b border-slate-200 shrink-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">NexusAccelerator</span>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Client Demo Portal
          </div>
        </div>
      </header>

      {/* Main Demo Content - Scrollable inside the fixed viewport */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="text-center max-w-3xl mx-auto w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6 border border-indigo-100 shadow-sm">
              <Bot className="w-4 h-4" />
              Live Interactive Demo
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              AI Assistant Demo
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Built specifically for your plumbing business. The AI knows your services, pricing, and service areas. Test it out using the widgets in the bottom right corner.
            </p>
            
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 text-left max-w-xl mx-auto mb-12">
              <h2 className="text-lg font-bold mb-4 text-slate-800">Try asking the AI:</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-700">
                  <MessageSquare className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="font-medium text-sm md:text-base">"My drain is choked in Woodlands, can you help?"</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <Mic className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base"><span className="text-slate-500 mr-2">(Click the red mic)</span><span className="font-medium">"Do you provide 24/7 emergency services?"</span></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* AI Widgets */}
      <Chatbot />
      <VoiceWidget />
    </div>
  );
}
