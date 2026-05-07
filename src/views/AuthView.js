import store from '../store/index.js';
import { registerCleanup } from '../router.js';
import { showToast } from '../components/toast.js';

const AuthView = () => {
  const { user } = store.getState();

  // If already logged in, redirect message
  if (user) {
    return `
      <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 class="text-4xl font-black font-outfit">Already Signed In</h1>
        <p class="text-text-muted">You're signed in as <span class="text-white font-bold">${user.name}</span></p>
        <a href="#/dashboard" class="bg-accent-blue text-white px-8 py-3 rounded-full text-sm font-bold no-underline hover:bg-accent-blue/80 transition-all">Go to Dashboard</a>
      </div>`;
  }

  return `
  <section class="relative min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden px-6 py-20">
    <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[160px] rounded-full"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[160px] rounded-full"></div>

    <div class="relative z-10 w-full max-w-md">
      <!-- Tab Switcher -->
      <div class="flex mb-10 bg-white/5 rounded-full p-1.5 border border-white/10">
        <button id="tab-login" class="flex-1 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all bg-accent-blue text-white">Sign In</button>
        <button id="tab-register" class="flex-1 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all text-text-muted hover:text-white">Register</button>
      </div>

      <!-- Login Form -->
      <div id="login-panel" class="glass-effect rounded-[40px] p-10 shadow-premium space-y-8">
        <div class="text-center space-y-3">
          <h1 class="text-3xl font-black font-outfit">Welcome Back</h1>
          <p class="text-text-muted text-sm">Sign in to access your bids and listings</p>
        </div>

        <div id="login-error" class="hidden rounded-xl px-4 py-3 text-sm font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"></div>

        <div class="space-y-5">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Email</label>
            <input type="email" id="login-email" placeholder="your@email.com"
                   class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-text-dark" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Password</label>
            <input type="password" id="login-password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                   class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-text-dark" />
          </div>
        </div>

        <button id="login-btn" class="w-full bg-accent-blue hover:bg-accent-blue/90 text-white py-4 rounded-2xl text-sm font-bold shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
          Sign In
        </button>

        <p class="text-center text-[10px] text-text-dark uppercase tracking-widest">
          Demo: use any email & password (min 3 chars)
        </p>
      </div>

      <!-- Register Form -->
      <div id="register-panel" class="glass-effect rounded-[40px] p-10 shadow-premium space-y-8 hidden">
        <div class="text-center space-y-3">
          <h1 class="text-3xl font-black font-outfit">Create Account</h1>
          <p class="text-text-muted text-sm">Join the BidX marketplace community</p>
        </div>

        <div id="register-error" class="hidden rounded-xl px-4 py-3 text-sm font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"></div>

        <div class="space-y-5">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Display Name</label>
            <input type="text" id="reg-name" placeholder="Your display name"
                   class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-text-dark" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Email</label>
            <input type="email" id="reg-email" placeholder="your@email.com"
                   class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-text-dark" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Password</label>
            <input type="password" id="reg-password" placeholder="Min 6 characters"
                   class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-text-dark" />
          </div>
        </div>

        <button id="register-btn" class="w-full bg-accent-blue hover:bg-accent-blue/90 text-white py-4 rounded-2xl text-sm font-bold shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
          Create Account
        </button>
      </div>
    </div>
  </section>
  `;
};

export const mount = () => {
  const loginPanel = document.getElementById('login-panel');
  const registerPanel = document.getElementById('register-panel');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  if (!tabLogin) return; // Already logged in redirect view

  // Tab switching
  tabLogin.addEventListener('click', () => {
    loginPanel.classList.remove('hidden');
    registerPanel.classList.add('hidden');
    tabLogin.classList.add('bg-accent-blue', 'text-white');
    tabLogin.classList.remove('text-text-muted');
    tabRegister.classList.remove('bg-accent-blue', 'text-white');
    tabRegister.classList.add('text-text-muted');
  });

  tabRegister.addEventListener('click', () => {
    registerPanel.classList.remove('hidden');
    loginPanel.classList.add('hidden');
    tabRegister.classList.add('bg-accent-blue', 'text-white');
    tabRegister.classList.remove('text-text-muted');
    tabLogin.classList.remove('bg-accent-blue', 'text-white');
    tabLogin.classList.add('text-text-muted');
  });

  // Login
  document.getElementById('login-btn')?.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');

    try {
      btn.disabled = true;
      btn.textContent = 'Signing in...';
      
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Login failed');

      localStorage.setItem('bidx_token', result.token);
      localStorage.setItem('bidx_user', JSON.stringify(result.user));
      store.setState({ user: result.user });

      showToast('success', `Welcome back, ${result.user.name}!`, 'You are now signed in.');
      window.location.hash = '#/';
      window.dispatchEvent(new CustomEvent('bidx:authchange'));
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  });

  // Register
  document.getElementById('register-btn')?.addEventListener('click', async () => {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const errorEl = document.getElementById('register-error');
    const btn = document.getElementById('register-btn');

    try {
      btn.disabled = true;
      btn.textContent = 'Creating account...';

      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Registration failed');

      localStorage.setItem('bidx_token', result.token);
      localStorage.setItem('bidx_user', JSON.stringify(result.user));
      store.setState({ user: result.user });

      showToast('success', `Account created!`, `Welcome to BidX, ${result.user.name}.`);
      window.location.hash = '#/';
      window.dispatchEvent(new CustomEvent('bidx:authchange'));
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
      btn.disabled = false;
      btn.textContent = 'Create Account';
    }
  });

};

export default AuthView;
