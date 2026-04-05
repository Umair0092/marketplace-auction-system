import './styles/index.css';
import { initRouter } from './router.js';

// Setup Global Shell
const setupAppShell = () => {
  const app = document.getElementById('app');
  app.innerHTML = `
    <nav class="sticky top-0 z-[100] w-full border-b border-white/5 bg-bg-deep/80 backdrop-blur-2xl">
      <div class="max-w-[1400px] mx-auto px-10 h-24 flex justify-between items-center">
        <div class="flex items-center gap-16">
          <a href="#/" data-link class="font-outfit text-3xl font-black tracking-tighter hover:opacity-80 transition-opacity no-underline text-white">
            Bid<span class="text-accent-blue">X</span>
          </a>
          <div class="hidden md:flex items-center gap-10">
            <a href="#/" data-link class="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-white transition-all no-underline">Collection</a>
            <a href="#/search" data-link class="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-white transition-all no-underline">Marketplace</a>
            <a href="#" class="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-white transition-all no-underline">Institutional</a>
          </div>
        </div>
        
        <div class="flex items-center gap-8">
          <div class="hidden xl:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
             <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
             <span class="text-[10px] font-bold text-text-dark uppercase tracking-widest">System Active</span>
          </div>
          <button class="bg-white text-black hover:bg-accent-blue hover:text-white px-10 py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-premium">
            Member Sign In
          </button>
        </div>
      </div>
    </nav>

    <main id="router-view" class="flex-grow"></main>

    <footer class="mt-40 bg-[#05050a] border-t border-white/5 pt-32 pb-16">
      <div class="max-w-[1400px] mx-auto px-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          <div class="space-y-8">
            <div class="font-outfit text-4xl font-black tracking-tighter">Bid<span class="text-accent-blue">X</span></div>
            <p class="text-text-muted text-sm leading-relaxed font-medium">
              The premier destination for the acquisition of high-value, time-bound assets. Curating the world's most extraordinary collections for the modern elite.
            </p>
            <div class="flex gap-4">
               ${['Twitter', 'Discord', 'Insta'].map(social => `
                 <div class="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-xs text-text-dark hover:border-white hover:text-white cursor-pointer transition-all">${social[0]}</div>
               `).join('')}
            </div>
          </div>

          <div class="space-y-8">
            <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-white">Navigation</h4>
            <nav class="flex flex-col gap-5">
              <a href="#" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">Explore Assets</a>
              <a href="#" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">Active Auctions</a>
              <a href="#" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">Selling Guide</a>
            </nav>
          </div>

          <div class="space-y-8">
            <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-white">Resources</h4>
            <nav class="flex flex-col gap-5">
              <a href="#" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">Help Center</a>
              <a href="#" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">Escrow Process</a>
              <a href="#" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">Verified Sellers</a>
            </nav>
          </div>

          <div class="space-y-8">
            <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-white">Privacy</h4>
            <nav class="flex flex-col gap-5">
              <a href="#" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">Terms of Access</a>
              <a href="#" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">Data Protection</a>
              <a href="#" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">KYC/AML Policy</a>
            </nav>
          </div>
        </div>

        <div class="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p class="text-[10px] font-bold text-text-dark uppercase tracking-[0.3em]">
            &copy; 2026 BidX Global Marketplace • International HQ
          </p>
          <div class="flex gap-8">
             <span class="text-[10px] font-bold text-text-dark uppercase tracking-[0.2em]">English (US)</span>
             <span class="text-[10px] font-bold text-text-dark uppercase tracking-[0.2em]">System Status: Green</span>
          </div>
        </div>
      </div>
    </footer>
  `;
};

setupAppShell();
initRouter();
