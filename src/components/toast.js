// BidX Toast Notification System

let container = null;

const ensureContainer = () => {
  if (!container || !document.body.contains(container)) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-28 right-6 z-[200] flex flex-col gap-3 pointer-events-none';
    document.body.appendChild(container);
  }
  return container;
};

const icons = {
  success: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
  error: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
  outbid: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3l9 16H3L12 3z"/></svg>`,
  info: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>`,
  victory: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`,
};

const colors = {
  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: 'text-emerald-400' },
  error: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', icon: 'text-rose-400' },
  outbid: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: 'text-amber-400' },
  info: { bg: 'bg-accent-blue/10', border: 'border-accent-blue/30', text: 'text-indigo-300', icon: 'text-indigo-400' },
  victory: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-300', icon: 'text-purple-400' },
};

/**
 * Show a toast notification.
 * @param {'success'|'error'|'outbid'|'info'|'victory'} type
 * @param {string} title
 * @param {string} [message]
 * @param {number} [duration=4000]
 */
export const showToast = (type, title, message = '', duration = 4000) => {
  const c = ensureContainer();
  const color = colors[type] || colors.info;
  const icon = icons[type] || icons.info;

  const el = document.createElement('div');
  el.className = `pointer-events-auto flex items-start gap-4 px-5 py-4 rounded-2xl ${color.bg} border ${color.border} backdrop-blur-xl shadow-premium max-w-sm transform translate-x-full opacity-0 transition-all duration-500`;

  el.innerHTML = `
    <div class="flex-shrink-0 mt-0.5 ${color.icon}">${icon}</div>
    <div class="flex-grow min-w-0">
      <p class="text-sm font-bold ${color.text}">${title}</p>
      ${message ? `<p class="text-xs text-text-muted mt-1 leading-relaxed">${message}</p>` : ''}
    </div>
    <button class="flex-shrink-0 text-text-dark hover:text-white transition-colors toast-close">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  c.appendChild(el);

  // Slide in
  requestAnimationFrame(() => {
    el.classList.remove('translate-x-full', 'opacity-0');
    el.classList.add('translate-x-0', 'opacity-100');
  });

  const dismiss = () => {
    el.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => el.remove(), 500);
  };

  el.querySelector('.toast-close').addEventListener('click', dismiss);

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
};
