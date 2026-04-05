import store from '../store/index.js';
import { registerCleanup } from '../router.js';
import { showToast } from '../components/toast.js';

const CreateListingView = () => {
  const { user, categories } = store.getState();

  if (!user) {
    return `
      <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 class="text-4xl font-black font-outfit">Sign In Required</h1>
        <p class="text-text-muted">You need to sign in to create a listing.</p>
        <a href="#/auth" class="bg-accent-blue text-white px-8 py-3 rounded-full text-sm font-bold no-underline hover:bg-accent-blue/80 transition-all">Sign In</a>
      </div>`;
  }

  const categoryOptions = categories.filter(c => c.id !== 'all');

  return `
  <section class="max-w-[800px] mx-auto px-6 md:px-10 py-20">
    <div class="mb-12">
      <a href="#/dashboard" class="text-text-dark hover:text-white text-sm font-bold no-underline transition-colors">\u2190 Back to Dashboard</a>
    </div>

    <h1 class="text-4xl font-black font-outfit tracking-tighter mb-4">Create Listing</h1>
    <p class="text-text-muted mb-16">List your item for auction on BidX</p>

    <!-- Step Indicator -->
    <div class="flex items-center gap-4 mb-16">
      ${['Item Details', 'Auction Setup', 'Preview'].map((step, i) => `
        <div class="flex items-center gap-3 step-indicator" data-step="${i}">
          <div class="h-8 w-8 rounded-full ${i === 0 ? 'bg-accent-blue text-white' : 'bg-white/5 text-text-dark border border-white/10'} flex items-center justify-center text-xs font-black transition-all" id="step-dot-${i}">${i + 1}</div>
          <span class="text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-white' : 'text-text-dark'} hidden sm:inline transition-all" id="step-label-${i}">${step}</span>
        </div>
        ${i < 2 ? '<div class="flex-grow h-px bg-white/10"></div>' : ''}
      `).join('')}
    </div>

    <!-- Step 1: Item Details -->
    <div id="form-step-0" class="space-y-8">
      <div class="space-y-2">
        <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Item Title *</label>
        <input type="text" id="listing-title" placeholder="e.g. MacBook Pro M3 Max"
               class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-text-dark" />
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Description *</label>
        <textarea id="listing-desc" rows="4" placeholder="Describe your item in detail..."
                  class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-text-dark resize-none"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Category *</label>
          <select id="listing-category" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all text-white">
            <option value="">Select category</option>
            ${categoryOptions.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Condition</label>
          <select id="listing-condition" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all text-white">
            <option value="Factory Sealed">Factory Sealed</option>
            <option value="Like New">Like New</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Image URL (placeholder)</label>
        <input type="text" id="listing-image" placeholder="https://picsum.photos/1200/900?random=999"
               value="https://picsum.photos/1200/900?random=${Math.floor(Math.random() * 900) + 100}"
               class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-text-dark" />
        <p class="text-[10px] text-text-dark">Image upload will be available with backend integration</p>
      </div>

      <div id="step0-error" class="hidden rounded-xl px-4 py-3 text-sm font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"></div>

      <button id="next-step-1" class="w-full bg-accent-blue hover:bg-accent-blue/90 text-white py-4 rounded-2xl text-sm font-bold shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
        Continue to Auction Setup
      </button>
    </div>

    <!-- Step 2: Auction Parameters -->
    <div id="form-step-1" class="space-y-8 hidden">
      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Starting Bid *</label>
          <div class="relative">
            <span class="absolute left-6 top-1/2 -translate-y-1/2 text-text-dark font-bold font-outfit">$</span>
            <input type="number" id="listing-price" placeholder="100" min="1"
                   class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-6 text-sm font-bold font-outfit focus:outline-none focus:border-accent-blue/50 transition-all" />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Min Bid Increment *</label>
          <div class="relative">
            <span class="absolute left-6 top-1/2 -translate-y-1/2 text-text-dark font-bold font-outfit">$</span>
            <input type="number" id="listing-increment" placeholder="10" min="1" value="10"
                   class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-6 text-sm font-bold font-outfit focus:outline-none focus:border-accent-blue/50 transition-all" />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black text-text-dark uppercase tracking-widest">Auction Duration *</label>
        <div class="grid grid-cols-3 gap-4">
          ${[
            { value: '1', label: '1 Hour' },
            { value: '6', label: '6 Hours' },
            { value: '24', label: '24 Hours' },
          ].map((d, i) => `
            <button data-duration="${d.value}" class="duration-btn py-4 rounded-2xl text-sm font-bold border transition-all ${i === 1 ? 'bg-accent-blue text-white border-accent-blue' : 'bg-white/5 text-text-muted border-white/10 hover:border-accent-blue/50'}">
              ${d.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div id="step1-error" class="hidden rounded-xl px-4 py-3 text-sm font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"></div>

      <div class="flex gap-4">
        <button id="back-step-0" class="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl text-sm font-bold border border-white/10 transition-all">
          Back
        </button>
        <button id="next-step-2" class="flex-1 bg-accent-blue hover:bg-accent-blue/90 text-white py-4 rounded-2xl text-sm font-bold shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
          Preview Listing
        </button>
      </div>
    </div>

    <!-- Step 3: Preview -->
    <div id="form-step-2" class="space-y-8 hidden">
      <div id="preview-card" class="glass-effect rounded-[40px] p-8 shadow-premium space-y-6">
        <!-- Filled dynamically -->
      </div>

      <div class="flex gap-4">
        <button id="back-step-1" class="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl text-sm font-bold border border-white/10 transition-all">
          Back
        </button>
        <button id="submit-listing" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl text-sm font-bold shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
          Publish Listing
        </button>
      </div>
    </div>
  </section>
  `;
};

export const mount = () => {
  let currentStep = 0;
  let selectedDuration = 6; // hours

  const goToStep = (step) => {
    currentStep = step;
    for (let i = 0; i < 3; i++) {
      const panel = document.getElementById(`form-step-${i}`);
      const dot = document.getElementById(`step-dot-${i}`);
      const label = document.getElementById(`step-label-${i}`);
      if (panel) panel.classList.toggle('hidden', i !== step);
      if (dot) {
        dot.className = `h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${i <= step ? 'bg-accent-blue text-white' : 'bg-white/5 text-text-dark border border-white/10'}`;
      }
      if (label) {
        label.className = `text-[10px] font-black uppercase tracking-widest hidden sm:inline transition-all ${i <= step ? 'text-white' : 'text-text-dark'}`;
      }
    }
  };

  // Duration buttons
  document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDuration = parseInt(btn.dataset.duration);
      document.querySelectorAll('.duration-btn').forEach(b => {
        b.className = 'duration-btn py-4 rounded-2xl text-sm font-bold border transition-all bg-white/5 text-text-muted border-white/10 hover:border-accent-blue/50';
      });
      btn.className = 'duration-btn py-4 rounded-2xl text-sm font-bold border transition-all bg-accent-blue text-white border-accent-blue';
    });
  });

  // Step 1 -> Step 2
  document.getElementById('next-step-1')?.addEventListener('click', () => {
    const title = document.getElementById('listing-title').value.trim();
    const desc = document.getElementById('listing-desc').value.trim();
    const category = document.getElementById('listing-category').value;
    const errorEl = document.getElementById('step0-error');

    if (!title || !desc || !category) {
      errorEl.textContent = 'Please fill in all required fields.';
      errorEl.classList.remove('hidden');
      return;
    }
    errorEl.classList.add('hidden');
    goToStep(1);
  });

  // Step 2 -> Step 3 (preview)
  document.getElementById('next-step-2')?.addEventListener('click', () => {
    const price = parseInt(document.getElementById('listing-price').value);
    const increment = parseInt(document.getElementById('listing-increment').value);
    const errorEl = document.getElementById('step1-error');

    if (!price || price < 1) {
      errorEl.textContent = 'Please set a starting bid.';
      errorEl.classList.remove('hidden');
      return;
    }
    if (!increment || increment < 1) {
      errorEl.textContent = 'Please set a minimum increment.';
      errorEl.classList.remove('hidden');
      return;
    }
    errorEl.classList.add('hidden');

    // Build preview
    const title = document.getElementById('listing-title').value.trim();
    const desc = document.getElementById('listing-desc').value.trim();
    const category = document.getElementById('listing-category').value;
    const condition = document.getElementById('listing-condition').value;
    const image = document.getElementById('listing-image').value || 'https://picsum.photos/1200/900?random=999';
    const { categories } = store.getState();
    const catLabel = categories.find(c => c.id === category)?.label || category;

    const preview = document.getElementById('preview-card');
    preview.innerHTML = `
      <div class="aspect-[16/9] rounded-3xl overflow-hidden mb-6">
        <img src="${image}" class="w-full h-full object-cover" alt="Preview" />
      </div>
      <h2 class="text-2xl font-black font-outfit">${title}</h2>
      <p class="text-text-muted text-sm leading-relaxed">${desc}</p>
      <div class="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div>
          <p class="text-[10px] font-bold text-text-dark uppercase tracking-widest">Category</p>
          <p class="font-semibold text-sm">${catLabel}</p>
        </div>
        <div>
          <p class="text-[10px] font-bold text-text-dark uppercase tracking-widest">Condition</p>
          <p class="font-semibold text-sm">${condition}</p>
        </div>
        <div>
          <p class="text-[10px] font-bold text-text-dark uppercase tracking-widest">Starting Bid</p>
          <p class="font-bold font-outfit text-lg">$${price.toLocaleString()}</p>
        </div>
        <div>
          <p class="text-[10px] font-bold text-text-dark uppercase tracking-widest">Duration</p>
          <p class="font-semibold text-sm">${selectedDuration} hour${selectedDuration > 1 ? 's' : ''}</p>
        </div>
      </div>
    `;

    goToStep(2);
  });

  // Back buttons
  document.getElementById('back-step-0')?.addEventListener('click', () => goToStep(0));
  document.getElementById('back-step-1')?.addEventListener('click', () => goToStep(1));

  // Submit listing
  document.getElementById('submit-listing')?.addEventListener('click', () => {
    const { user } = store.getState();
    const title = document.getElementById('listing-title').value.trim();
    const desc = document.getElementById('listing-desc').value.trim();
    const category = document.getElementById('listing-category').value;
    const condition = document.getElementById('listing-condition').value;
    const price = parseInt(document.getElementById('listing-price').value);
    const increment = parseInt(document.getElementById('listing-increment').value);
    const image = document.getElementById('listing-image').value || 'https://picsum.photos/1200/900?random=999';

    const newAuction = {
      id: 'listing-' + Date.now(),
      title,
      description: desc,
      category,
      seller: { name: user.name, id: user.id, rating: 5.0 },
      images: [
        image,
        `https://picsum.photos/400/400?random=${Date.now() + 1}`,
        `https://picsum.photos/400/400?random=${Date.now() + 2}`,
        `https://picsum.photos/400/400?random=${Date.now() + 3}`,
      ],
      specs: { Condition: condition },
      startingPrice: price,
      currentBid: price,
      minIncrement: increment,
      totalBids: 0,
      endTime: Date.now() + selectedDuration * 60 * 60 * 1000,
      bids: [],
      featured: false,
    };

    store.setState(s => {
      s.auctions.unshift(newAuction);
      return s;
    });

    showToast('success', 'Listing published!', `"${title}" is now live on BidX.`);
    window.location.hash = `#/auction/${newAuction.id}`;
  });
};

export default CreateListingView;
