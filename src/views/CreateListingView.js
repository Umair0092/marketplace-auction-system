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
        <label class="text-[10px] font-black text-black uppercase tracking-widest">Item Title *</label>
        <input type="text" id="listing-title" placeholder="e.g. MacBook Pro M3 Max"
               class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-text-dark text-black" />

      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black text-black uppercase tracking-widest">Description *</label>
        <textarea id="listing-desc" rows="4" placeholder="Describe your item in detail..."
                  class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-text-dark resize-none text-black"></textarea>

      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-black uppercase tracking-widest">Category *</label>

          <select id="listing-category" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all text-black">
            <option value="">Select category</option>
            ${categoryOptions.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-black uppercase tracking-widest">Condition</label>

          <select id="listing-condition" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-blue/50 transition-all text-black">
            <option value="Factory Sealed">Factory Sealed</option>
            <option value="Like New">Like New</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>
      </div>

      <div class="space-y-4">
        <label class="text-[10px] font-black text-black uppercase tracking-widest">Item Images * (Multiple allowed)</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4" id="image-previews-container">
          <div id="image-upload-zone" class="aspect-square bg-white/5 border border-dashed border-black/20 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-accent-blue/50 transition-all cursor-pointer relative group">
            <input type="file" id="listing-image-file" class="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" multiple />
            <div class="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center text-black group-hover:text-accent-blue transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <p class="text-[9px] font-bold text-black/40 uppercase tracking-wider">Add Photo</p>
          </div>
          <!-- Thumbnails will go here -->
        </div>
        <input type="hidden" id="listing-images-data" value="[]" />
      </div>

      <div id="step0-error" class="hidden rounded-xl px-4 py-3 text-sm font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"></div>

      <button id="next-step-1" class="w-full bg-accent-blue hover:bg-accent-blue/90 text-white py-4 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
        Continue to Auction Setup
      </button>
    </div>

    <!-- Step 2: Auction Parameters -->
    <div id="form-step-1" class="space-y-8 hidden">
      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-black uppercase tracking-widest">Starting Bid *</label>
          <div class="relative">
            <span class="absolute left-6 top-1/2 -translate-y-1/2 text-black/40 font-bold font-outfit">$</span>
            <input type="number" id="listing-price" placeholder="100" min="1"
                   class="w-full bg-white/5 border border-black/10 rounded-2xl py-4 pl-10 pr-6 text-sm font-bold font-outfit focus:outline-none focus:border-accent-blue/50 transition-all text-black" />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-black uppercase tracking-widest">Min Bid Increment *</label>
          <div class="relative">
            <span class="absolute left-6 top-1/2 -translate-y-1/2 text-black/40 font-bold font-outfit">$</span>
            <input type="number" id="listing-increment" placeholder="10" min="1" value="10"
                   class="w-full bg-white/5 border border-black/10 rounded-2xl py-4 pl-10 pr-6 text-sm font-bold font-outfit focus:outline-none focus:border-accent-blue/50 transition-all text-black" />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black text-black uppercase tracking-widest">Auction Duration *</label>
        <div class="grid grid-cols-3 gap-4">
          ${[
            { value: '1', label: '1 Hour' },
            { value: '6', label: '6 Hours' },
            { value: '24', label: '24 Hours' },
          ].map((d, i) => `
            <button data-duration="${d.value}" class="duration-btn py-4 rounded-2xl text-sm font-bold border transition-all ${i === 1 ? 'bg-accent-blue text-white border-accent-blue' : 'bg-white/5 text-black border-black/10 hover:border-accent-blue/50'}">
              ${d.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div id="step1-error" class="hidden rounded-xl px-4 py-3 text-sm font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"></div>

      <div class="flex gap-4">
        <button id="back-step-0" class="flex-1 bg-white/5 hover:bg-white/10 text-black py-4 rounded-2xl text-sm font-bold border border-black/10 transition-all">
          Back
        </button>
        <button id="next-step-2" class="flex-1 bg-accent-blue hover:bg-accent-blue/90 text-white py-4 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
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
        <button id="back-step-1" class="flex-1 bg-white/5 hover:bg-white/10 text-black py-4 rounded-2xl text-sm font-bold border border-black/10 transition-all">
          Back
        </button>
        <button id="submit-listing" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
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
  let uploadedImages = [];

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
        label.className = `text-[10px] font-black uppercase tracking-widest hidden sm:inline transition-all ${i <= step ? 'text-black' : 'text-text-dark'}`;
      }
    }
  };

  // Image Upload Logic
  const imageInput = document.getElementById('listing-image-file');
  const imagesDataInput = document.getElementById('listing-images-data');
  const previewsContainer = document.getElementById('image-previews-container');

  const renderPreviews = () => {
    // Clear old thumbnails (except the upload zone)
    const oldThumbs = previewsContainer.querySelectorAll('.thumb-preview');
    oldThumbs.forEach(t => t.remove());

    uploadedImages.forEach((img, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'thumb-preview aspect-square rounded-2xl overflow-hidden relative group border border-black/10';
      thumb.innerHTML = `
        <img src="${img}" class="w-full h-full object-cover" />
        <button class="remove-thumb absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500" data-idx="${idx}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;
      previewsContainer.appendChild(thumb);
    });

    imagesDataInput.value = JSON.stringify(uploadedImages);

    // Add remove listeners
    document.querySelectorAll('.remove-thumb').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const idx = parseInt(btn.dataset.idx);
        uploadedImages.splice(idx, 1);
        renderPreviews();
      };
    });
  };

  imageInput?.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      if (uploadedImages.length >= 8) break;
      const reader = new FileReader();
      const p = new Promise((resolve) => {
        reader.onload = (event) => {
          uploadedImages.push(event.target.result);
          resolve();
        };
      });
      reader.readAsDataURL(file);
      await p;
    }
    renderPreviews();
    imageInput.value = ''; // Reset input
  });

  // Duration buttons
  document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDuration = parseInt(btn.dataset.duration);
      document.querySelectorAll('.duration-btn').forEach(b => {
        b.className = 'duration-btn py-4 rounded-2xl text-sm font-bold border transition-all bg-white/5 text-black border-black/10 hover:border-accent-blue/50';
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

    if (!title || !desc || !category || uploadedImages.length === 0) {
      errorEl.textContent = 'Please fill in all required fields and upload at least one image.';
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
    const { categories } = store.getState();
    const catLabel = categories.find(c => c.id === category)?.label || category;

    const preview = document.getElementById('preview-card');
    preview.innerHTML = `
      <div class="aspect-[16/9] rounded-3xl overflow-hidden mb-6 border border-black/10">
        <img src="${uploadedImages[0]}" class="w-full h-full object-cover" alt="Preview" />
      </div>
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        ${uploadedImages.map(img => `
          <div class="h-16 w-16 rounded-lg overflow-hidden border border-black/5 flex-shrink-0">
            <img src="${img}" class="w-full h-full object-cover" />
          </div>
        `).join('')}
      </div>
      <h2 class="text-2xl font-black font-outfit text-black">${title}</h2>
      <p class="text-black/60 text-sm leading-relaxed">${desc}</p>
      <div class="grid grid-cols-2 gap-4 pt-4 border-t border-black/5">
        <div>
          <p class="text-[10px] font-bold text-black/40 uppercase tracking-widest">Category</p>
          <p class="font-semibold text-sm text-black">${catLabel}</p>
        </div>
        <div>
          <p class="text-[10px] font-bold text-black/40 uppercase tracking-widest">Condition</p>
          <p class="font-semibold text-sm text-black">${condition}</p>
        </div>
        <div>
          <p class="text-[10px] font-bold text-black/40 uppercase tracking-widest">Starting Bid</p>
          <p class="font-bold font-outfit text-lg text-black">$${price.toLocaleString()}</p>
        </div>
        <div>
          <p class="text-[10px] font-bold text-black/40 uppercase tracking-widest">Duration</p>
          <p class="font-semibold text-sm text-black">${selectedDuration} hour${selectedDuration > 1 ? 's' : ''}</p>
        </div>
      </div>
    `;

    goToStep(2);
  });

  // Back buttons
  document.getElementById('back-step-0')?.addEventListener('click', () => goToStep(0));
  document.getElementById('back-step-1')?.addEventListener('click', () => goToStep(1));

  // Submit listing
  document.getElementById('submit-listing')?.addEventListener('click', async () => {
    const btn = document.getElementById('submit-listing');
    const { user } = store.getState();
    const title = document.getElementById('listing-title').value.trim();
    const desc = document.getElementById('listing-desc').value.trim();
    const category = document.getElementById('listing-category').value;
    const condition = document.getElementById('listing-condition').value;
    const price = parseInt(document.getElementById('listing-price').value);
    const increment = parseInt(document.getElementById('listing-increment').value);

    btn.disabled = true;
    btn.innerHTML = '<span class="flex items-center gap-2 justify-center"><svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Publishing...</span>';

    const newAuction = {
      title,
      description: desc,
      category,
      seller: { name: user.name, id: user.id, rating: 5.0 },
      images: uploadedImages,
      specs: { Condition: condition },
      startingPrice: price,
      currentBid: price,
      minIncrement: increment,
      totalBids: 0,
      endTime: new Date(Date.now() + selectedDuration * 60 * 60 * 1000).toISOString(),
      bids: [],
      status: 'active'
    };

    try {
      const response = await fetch('http://localhost:5001/api/auctions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('bidx_token')}`
        },
        body: JSON.stringify(newAuction)
      });

      if (!response.ok) throw new Error('Failed to save to backend');

      const result = await response.json();
      const savedAuction = result.data;

      // Update local store with the saved auction (including backend ID)
      store.setState(s => {
        s.auctions.unshift({ ...savedAuction, id: savedAuction._id }); // Map Mongo _id to app id
        return s;
      });

      showToast('success', 'Listing published!', `"${title}" is now live on BidX.`);
      window.location.hash = `#/auction/${savedAuction._id}`;
    } catch (error) {
      console.error(error);
      showToast('error', 'Publish failed', 'Could not save listing to server. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Publish Listing';
    }
  });
};

export default CreateListingView;
