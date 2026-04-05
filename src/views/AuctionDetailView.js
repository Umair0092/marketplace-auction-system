import store from '../store/index.js';
import { registerCleanup } from '../router.js';
import { formatTimeLeft } from '../components/countdown.js';
import { showToast } from '../components/toast.js';

const AuctionDetailView = (params) => {
  const { auctions } = store.getState();
  const auction = auctions.find(a => a.id === params?.id);

  if (!auction) {
    return `
      <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 class="text-5xl font-black font-outfit">Auction Not Found</h1>
        <p class="text-text-muted">This listing may have been removed.</p>
        <a href="#/search" class="text-accent-blue hover:underline text-sm font-bold">Browse Marketplace</a>
      </div>`;
  }

  const time = formatTimeLeft(auction.endTime);
  const specs = Object.entries(auction.specs);

  return `
  <section class="max-w-[1240px] mx-auto px-6 py-20 gap-16 grid lg:grid-cols-[1fr_420px]">
    <!-- Product Gallery -->
    <div class="space-y-8">
      <div class="aspect-[4/3] rounded-[48px] overflow-hidden border border-white/5 shadow-premium group">
        <img id="main-image" src="${auction.images[0]}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="${auction.title}" />
      </div>
      <div class="grid grid-cols-4 gap-6" id="thumbnail-gallery">
        ${auction.images.map((img, i) => `
          <div class="aspect-square rounded-3xl overflow-hidden border ${i === 0 ? 'border-accent-blue/50 opacity-100' : 'border-white/10 opacity-60'} cursor-pointer hover:border-accent-blue/50 transition-all hover:opacity-100 thumb-item" data-img="${img}" data-index="${i}">
            <img src="${img}" class="w-full h-full object-cover" alt="Thumbnail ${i + 1}" />
          </div>
        `).join('')}
      </div>

      <!-- Description Section -->
      <div class="pt-12 border-t border-white/5 space-y-6">
        <h3 class="text-2xl font-bold font-outfit">Product Details</h3>
        <p class="text-text-muted leading-relaxed text-lg">${auction.description}</p>
        <div class="grid grid-cols-2 gap-y-6 gap-x-12 pt-6">
          ${specs.map(([key, val]) => `
            <div class="space-y-1">
              <p class="text-[10px] font-bold text-text-dark uppercase tracking-widest">${key}</p>
              <p class="font-semibold text-text-main">${val}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Bid History -->
      <div class="pt-12 border-t border-white/5 space-y-6">
        <h3 class="text-2xl font-bold font-outfit">Bid History</h3>
        <div id="bid-history" class="space-y-3 max-h-80 overflow-y-auto pr-2">
          ${auction.bids.length === 0
            ? '<p class="text-text-dark text-sm">No bids recorded yet. Be the first!</p>'
            : auction.bids.slice(0, 10).map(b => `
              <div class="flex justify-between items-center py-3 px-4 rounded-2xl bg-white/5 border border-white/5">
                <span class="text-sm font-semibold">${b.bidder}</span>
                <span class="text-sm font-bold font-outfit">$${b.amount.toLocaleString()}</span>
              </div>
            `).join('')}
        </div>
      </div>
    </div>

    <!-- Bidding Sidebar -->
    <aside class="space-y-8">
      <div class="sticky top-32 space-y-8">
        <div>
          <div class="text-[10px] font-bold text-accent-blue uppercase tracking-[0.2em] mb-4">Current Auction</div>
          <h1 class="text-4xl font-bold font-outfit leading-tight mb-4">${auction.title}</h1>
          <div class="flex items-center gap-4 text-xs font-medium text-text-dark uppercase tracking-widest">
            <span>By ${auction.seller.name}</span>
            <span>\u2022</span>
            <span id="time-remaining" class="${time.urgent ? 'text-accent-rose' : 'text-accent-rose'}">${time.ended ? 'Auction Ended' : time.text + ' remaining'}</span>
          </div>
        </div>

        <div class="p-8 bg-bg-card border border-white/10 rounded-[40px] shadow-premium space-y-8">
          <div class="space-y-2">
            <p class="text-[10px] font-bold text-text-dark uppercase tracking-widest">Current Bid</p>
            <div class="flex items-baseline gap-2">
              <span id="current-bid-display" class="text-5xl font-bold font-outfit transition-colors duration-500">$${auction.currentBid.toLocaleString()}</span>
              <span id="bid-status-badge" class="text-sm font-medium text-accent-cyan">High Bid</span>
            </div>
            <p class="text-xs text-text-muted">Total Bids: <span id="total-bids">${auction.totalBids}</span></p>
          </div>

          ${time.ended ? `
            <div class="text-center py-4">
              <p class="text-lg font-bold text-text-muted">This auction has ended</p>
            </div>
          ` : `
            <div class="space-y-4" id="bid-form">
              <div id="bid-feedback" class="hidden rounded-xl px-4 py-3 text-sm font-semibold"></div>
              <div class="relative">
                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-text-dark font-bold font-outfit">$</span>
                <input type="number" id="bid-input" placeholder="${(auction.currentBid + auction.minIncrement).toLocaleString()}+"
                       min="${auction.currentBid + auction.minIncrement}"
                       class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-6 text-xl font-bold font-outfit focus:outline-none focus:border-accent-blue/50 transition-all" />
              </div>
              <button id="place-bid-btn" class="w-full bg-accent-blue hover:bg-accent-blue/90 text-white py-5 rounded-2xl text-lg font-bold shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
                Place a Bid
              </button>
              <p class="text-[10px] text-center text-text-dark uppercase tracking-widest">Minimum increment $${auction.minIncrement}</p>
            </div>
          `}
        </div>

        <div class="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-4">
          <div class="h-12 w-12 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
            <span class="icon-security">\uD83D\uDEE1\uFE0F</span>
          </div>
          <div>
            <p class="text-sm font-bold">Secure Escrow</p>
            <p class="text-[10px] text-text-muted uppercase tracking-widest">Verified Seller & Goods</p>
          </div>
        </div>
      </div>
    </aside>
  </section>
  `;
};

export const mount = (params) => {
  const auctionId = params?.id;
  if (!auctionId) return;

  // Thumbnail image switching
  document.getElementById('thumbnail-gallery')?.addEventListener('click', (e) => {
    const thumb = e.target.closest('.thumb-item');
    if (!thumb) return;
    const mainImg = document.getElementById('main-image');
    mainImg.src = thumb.dataset.img;
    document.querySelectorAll('.thumb-item').forEach(t => {
      t.classList.remove('border-accent-blue/50', 'opacity-100');
      t.classList.add('border-white/10', 'opacity-60');
    });
    thumb.classList.remove('border-white/10', 'opacity-60');
    thumb.classList.add('border-accent-blue/50', 'opacity-100');
  });

  // Place bid
  document.getElementById('place-bid-btn')?.addEventListener('click', () => {
    const { user, auctions } = store.getState();
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) return;

    if (!user) {
      showToast('error', 'Sign in required', 'You need to sign in before placing a bid.');
      return;
    }

    if (auction.endTime <= Date.now()) {
      showToast('error', 'Auction ended', 'This auction is no longer accepting bids.');
      return;
    }

    const input = document.getElementById('bid-input');
    const amount = parseInt(input.value);
    const minRequired = auction.currentBid + auction.minIncrement;

    const feedback = document.getElementById('bid-feedback');

    if (!amount || amount < minRequired) {
      feedback.className = 'rounded-xl px-4 py-3 text-sm font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20';
      feedback.textContent = `Minimum bid is $${minRequired.toLocaleString()}`;
      feedback.classList.remove('hidden');
      return;
    }

    // Place the bid
    store.setState(s => {
      const idx = s.auctions.findIndex(a => a.id === auctionId);
      if (idx === -1) return s;
      s.auctions[idx].currentBid = amount;
      s.auctions[idx].totalBids += 1;
      s.auctions[idx].bids.unshift({
        bidder: s.user.name,
        amount,
        time: Date.now(),
        isBot: false,
      });
      return s;
    });

    // Update UI
    const bidDisplay = document.getElementById('current-bid-display');
    const totalBids = document.getElementById('total-bids');
    const statusBadge = document.getElementById('bid-status-badge');

    bidDisplay.textContent = '$' + amount.toLocaleString();
    bidDisplay.classList.add('text-accent-cyan');
    setTimeout(() => bidDisplay.classList.remove('text-accent-cyan'), 2000);

    const updatedAuction = store.getState().auctions.find(a => a.id === auctionId);
    totalBids.textContent = updatedAuction.totalBids;

    statusBadge.textContent = 'You\'re Winning!';
    statusBadge.className = 'text-sm font-medium text-emerald-400';

    feedback.className = 'rounded-xl px-4 py-3 text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    feedback.textContent = `Bid of $${amount.toLocaleString()} placed successfully!`;
    feedback.classList.remove('hidden');

    input.value = '';
    input.placeholder = (amount + updatedAuction.minIncrement).toLocaleString() + '+';
    input.min = amount + updatedAuction.minIncrement;

    showToast('success', 'Bid placed!', `You bid $${amount.toLocaleString()} on "${updatedAuction.title}"`);

    // Update bid history
    updateBidHistory(auctionId);
  });

  // Live countdown
  const timerInterval = setInterval(() => {
    const auction = store.getState().auctions.find(a => a.id === auctionId);
    if (!auction) return;
    const el = document.getElementById('time-remaining');
    if (!el) return;
    const time = formatTimeLeft(auction.endTime);
    if (time.ended) {
      el.textContent = 'Auction Ended';
      el.className = 'text-text-muted';
      const bidForm = document.getElementById('bid-form');
      if (bidForm) {
        bidForm.innerHTML = '<div class="text-center py-4"><p class="text-lg font-bold text-text-muted">This auction has ended</p></div>';
      }
    } else {
      el.textContent = time.text + ' remaining';
      el.className = time.urgent ? 'text-accent-rose animate-pulse' : 'text-accent-rose';
    }
  }, 1000);

  // Listen for bot bids on this auction
  const unsubBid = store.subscribe('bid', (data) => {
    if (data.auctionId !== auctionId) return;
    const bidDisplay = document.getElementById('current-bid-display');
    const totalBids = document.getElementById('total-bids');
    const statusBadge = document.getElementById('bid-status-badge');

    if (bidDisplay) {
      bidDisplay.textContent = '$' + data.amount.toLocaleString();
      bidDisplay.classList.add('text-accent-rose');
      setTimeout(() => bidDisplay.classList.remove('text-accent-rose'), 2000);
    }

    const auction = store.getState().auctions.find(a => a.id === auctionId);
    if (totalBids && auction) totalBids.textContent = auction.totalBids;

    const { user } = store.getState();
    if (user && statusBadge) {
      const userBid = auction?.bids.find(b => b.bidder === user.name);
      if (userBid && auction.currentBid > userBid.amount) {
        statusBadge.textContent = 'Outbid!';
        statusBadge.className = 'text-sm font-medium text-rose-400 animate-pulse';
      }
    }

    // Update bid input minimum
    const input = document.getElementById('bid-input');
    if (input && auction) {
      input.min = auction.currentBid + auction.minIncrement;
      input.placeholder = (auction.currentBid + auction.minIncrement).toLocaleString() + '+';
    }

    updateBidHistory(auctionId);
  });

  registerCleanup(() => {
    clearInterval(timerInterval);
    unsubBid();
  });
};

const updateBidHistory = (auctionId) => {
  const container = document.getElementById('bid-history');
  if (!container) return;
  const auction = store.getState().auctions.find(a => a.id === auctionId);
  if (!auction || auction.bids.length === 0) return;

  const { user } = store.getState();
  container.innerHTML = auction.bids.slice(0, 15).map(b => `
    <div class="flex justify-between items-center py-3 px-4 rounded-2xl ${b.bidder === user?.name ? 'bg-accent-blue/10 border border-accent-blue/20' : 'bg-white/5 border border-white/5'}">
      <span class="text-sm font-semibold ${b.bidder === user?.name ? 'text-accent-blue' : ''}">${b.bidder}${b.bidder === user?.name ? ' (You)' : ''}</span>
      <span class="text-sm font-bold font-outfit">$${b.amount.toLocaleString()}</span>
    </div>
  `).join('');
};

export default AuctionDetailView;
