import { Bot, MessageSquare, Mic, Zap, Phone, Clock, Shield, Wrench, Droplets, Thermometer, CheckCircle2 } from 'lucide-react';
import { Chatbot } from './components/Chatbot';
import { VoiceWidget } from './components/VoiceWidget';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 sm:px-6 lg:px-8 text-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-blue-400" /> 24/7 Emergency Service</span>
          <span className="hidden sm:flex items-center gap-1"><Shield className="w-4 h-4 text-blue-400" /> Licensed & Insured in CO</span>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <Phone className="w-4 h-4 text-blue-400" /> (720) 555-0198
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">Cascade<span className="text-blue-600">Plumbing</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About Us</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Reviews</a>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold">
              Book Online
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img 
              src="https://picsum.photos/seed/waterpipe/1920/1080" 
              alt="Plumbing background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6 border border-blue-500/30 backdrop-blur-sm">
                <Shield className="w-4 h-4" />
                Denver's #1 Trusted Plumbers
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                Fast, Reliable Plumbing When You Need It Most.
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                From leaky faucets to full pipe replacements, our expert technicians are ready 24/7. We guarantee our work and respect your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-colors shadow-lg flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" /> Call (720) 555-0198
                </button>
                <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors shadow-lg flex items-center justify-center gap-2">
                  View Services
                </button>
              </div>
              
              <div className="mt-10 flex items-center gap-6 text-sm font-medium text-slate-300">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Upfront Pricing</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Same-Day Service</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Plumbing Services</h2>
              <p className="text-lg text-slate-600">We handle everything from minor repairs to major installations with professional expertise.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Wrench, title: 'Emergency Repairs', desc: 'Available 24/7 for burst pipes, severe leaks, and overflowing toilets.' },
                { icon: Droplets, title: 'Drain Cleaning', desc: 'Professional snaking and hydro-jetting to clear the toughest clogs.' },
                { icon: Thermometer, title: 'Water Heaters', desc: 'Repair and installation of traditional and tankless water heating systems.' }
              ].map((service, idx) => (
                <div key={idx} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Demo Callout */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Need Help Right Now?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Try our new AI Assistant! Ask questions about our services, get pricing estimates, or troubleshoot a problem instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20">
                <MessageSquare className="w-5 h-5 text-blue-200" />
                <span>Click the blue chat icon below</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20">
                <Mic className="w-5 h-5 text-red-300" />
                <span>Click the red mic to talk</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white">CascadePlumbing</span>
            </div>
            <p className="mb-4 max-w-sm">Providing top-tier plumbing services to the greater Denver area since 2010. Licensed, bonded, and insured.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>1234 Waterway Blvd</li>
              <li>Denver, CO 80202</li>
              <li>(720) 555-0198</li>
              <li>info@cascadeplumbing.demo</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* AI Widgets */}
      <Chatbot />
      <VoiceWidget />
    </div>
  );
}
