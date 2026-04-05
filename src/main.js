import './styles/index.css';
import { initRouter } from './router.js';
import { startSimulator } from './mock/simulator.js';
import store from './store/index.js';
import { showToast } from './components/toast.js';

const renderAuthButton = () => {
  const { user } = store.getState();
  const container = document.getElementById('auth-area');
  if (!container) return;

  if (user) {
    container.innerHTML = `
      <div class="relative" id="user-menu-wrapper">
        <button id="user-menu-btn" class="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full transition-all">
          <div class="h-8 w-8 rounded-full bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-accent-blue text-xs font-black">${user.name[0].toUpperCase()}</div>
          <span class="text-[11px] font-bold text-white uppercase tracking-wider hidden sm:inline">${user.name}</span>
          <svg class="w-3 h-3 text-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="user-dropdown" class="hidden absolute right-0 top-full mt-3 w-56 glass-effect rounded-2xl shadow-premium border border-white/10 py-3 z-[150]">
          <div class="px-5 py-3 border-b border-white/5">
            <p class="text-sm font-bold">${user.name}</p>
            <p class="text-[10px] text-text-dark">${user.email}</p>
          </div>
          <a href="#/dashboard" class="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-text-muted hover:text-white hover:bg-white/5 transition-all no-underline">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            Dashboard
          </a>
          <a href="#/sell" class="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-text-muted hover:text-white hover:bg-white/5 transition-all no-underline">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Create Listing
          </a>
          <button id="sign-out-btn" class="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"/></svg>
            Sign Out
          </button>
        </div>
      </div>
    `;

    // Dropdown toggle
    document.getElementById('user-menu-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('user-dropdown')?.classList.toggle('hidden');
    });

    // Close dropdown on outside click
    const closeDropdown = (e) => {
      if (!e.target.closest('#user-menu-wrapper')) {
        document.getElementById('user-dropdown')?.classList.add('hidden');
      }
    };
    document.addEventListener('click', closeDropdown);

    // Sign out
    document.getElementById('sign-out-btn')?.addEventListener('click', () => {
      localStorage.removeItem('bidx_user');
      store.setState({ user: null });
      showToast('info', 'Signed out', 'You have been signed out of BidX.');
      window.location.hash = '#/';
      renderAuthButton();
    });
  } else {
    container.innerHTML = `
      <a href="#/auth" class="bg-white text-black hover:bg-accent-blue hover:text-white px-10 py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-premium no-underline">
        Member Sign In
      </a>
    `;
  }
};

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
            <a href="#/sell" data-link class="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-white transition-all no-underline">Sell</a>
          </div>
        </div>

        <div class="flex items-center gap-8">
          <div class="hidden xl:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
             <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
             <span class="text-[10px] font-bold text-text-dark uppercase tracking-widest">System Active</span>
          </div>
          <div id="auth-area"></div>
        </div>
      </div>
    </nav>

    <main id="router-view" class="flex-grow transition-opacity duration-300"></main>

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
              <a href="#/" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">Explore Assets</a>
              <a href="#/search" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">Active Auctions</a>
              <a href="#/sell" class="text-sm font-semibold text-text-dark hover:text-accent-blue transition-colors no-underline">Selling Guide</a>
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
            &copy; 2026 BidX Global Marketplace \u2022 International HQ
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
renderAuthButton();
initRouter();
startSimulator();

// Re-render auth button when auth state changes
window.addEventListener('bidx:authchange', renderAuthButton);
