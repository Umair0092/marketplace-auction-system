import store from '../store/index.js';
import { registerCleanup } from '../router.js';
import { formatTimeShort } from '../components/countdown.js';
import { showToast } from '../components/toast.js';

const getFilteredAuctions = () => {
  const { auctions, filters } = store.getState();
  let list = [...auctions];

  if (filters.category !== 'all') {
    list = list.filter(a => a.category === filters.category);
  }
  if (filters.maxPrice < 10000) {
    list = list.filter(a => a.currentBid <= filters.maxPrice);
  }

  switch (filters.sort) {
    case 'latest': list.sort((a, b) => b.totalBids - a.totalBids); break;
    case 'price_asc': list.sort((a, b) => a.currentBid - b.currentBid); break;
    case 'ending': list.sort((a, b) => a.endTime - b.endTime); break;
    default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
  }
  return list;
};

const renderCard = (auction) => {
  const time = formatTimeShort(auction.endTime);
  const isLive = !time.ended;
  return `
    <a href="#/auction/${auction.id}" class="group relative bg-[#0e0e1a]/40 border border-white/5 rounded-[48px] p-5 transition-all duration-700 hover:border-accent-blue/40 hover:-translate-y-3 hover:shadow-premium ring-1 ring-white/5 hover:ring-white/10 block no-underline text-white cursor-pointer">
      <div class="aspect-[4/3] rounded-[36px] overflow-hidden relative mb-8 shadow-2xl">
        <div class="absolute inset-0 bg-center bg-cover transition-transform duration-1000 group-hover:scale-110"
             style="background-image: url('${auction.images[0]}');"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div class="absolute top-5 right-5 ${isLive ? (time.urgent ? 'bg-rose-500/30 border-rose-500/40' : 'bg-black/40 border-white/10') : 'bg-white/10 border-white/10'} backdrop-blur-xl px-5 py-2 rounded-full text-[9px] font-black text-white uppercase tracking-[0.2em] border ${isLive ? 'animate-pulse' : ''}" data-timer="${auction.id}">
          ${isLive ? `Live • <span data-countdown="${auction.id}">${time.text}</span>` : '<span class="text-text-muted">Ended</span>'}
        </div>
      </div>
      <div class="px-3 pb-3">
        <div class="flex justify-between items-start mb-6">
          <h4 class="text-xl font-black font-outfit leading-tight group-hover:text-accent-blue transition-colors duration-500">${auction.title}</h4>
          <div class="h-10 w-10 flex-shrink-0 rounded-full border border-white/10 flex items-center justify-center text-text-dark hover:text-white hover:border-white transition-all">
            <span class="text-sm">\u2197</span>
          </div>
        </div>
        <div class="flex justify-between items-end pt-2">
          <div class="space-y-1">
            <p class="text-[9px] font-black text-text-dark uppercase tracking-[0.3em]">Current Highest</p>
            <p class="text-2xl font-black font-outfit text-white tracking-tighter" data-bid="${auction.id}">$${auction.currentBid.toLocaleString()}</p>
          </div>
          <span class="bg-white/5 hover:bg-white text-white hover:text-black transition-all px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
            View Auction
          </span>
        </div>
      </div>
    </a>
  `;
};

const BrowseView = () => {
  const { categories, filters } = store.getState();
  const auctions = getFilteredAuctions();

  return `
  <section class="max-w-[1440px] mx-auto px-10 py-20 flex flex-col lg:flex-row gap-16">
    <!-- Sidebar Filters -->
    <aside class="w-full lg:w-80 shrink-0 space-y-16">
      <div>
        <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-text-dark mb-8">Categories</h3>
        <nav class="space-y-6" id="category-filters">
          ${categories.map(cat => `
            <a href="#" data-category="${cat.id}" class="flex items-center group no-underline category-link">
              <span class="h-1.5 w-1.5 rounded-full ${filters.category === cat.id ? 'bg-accent-blue' : 'bg-transparent border border-white/20 group-hover:bg-accent-blue'} mr-4 transition-all"></span>
              <span class="text-sm ${filters.category === cat.id ? 'font-bold text-white' : 'font-semibold text-text-muted hover:text-white'} transition-colors">${cat.label}</span>
            </a>
          `).join('')}
        </nav>
      </div>

      <div>
        <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-text-dark mb-8">Price Threshold</h3>
        <div class="space-y-6">
          <input type="range" id="price-slider" min="0" max="10000" step="100" value="${filters.maxPrice}" class="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-blue">
          <div class="flex justify-between text-[10px] font-black text-text-dark uppercase tracking-widest">
            <span>$0</span>
            <span class="text-text-muted" id="price-display">${filters.maxPrice >= 10000 ? '$10,000+' : '$' + filters.maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Auction Grid -->
    <div class="flex-grow">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
        <div>
          <h2 class="text-3xl font-black font-outfit tracking-tighter mb-2">Live Auctions</h2>
          <p class="text-xs font-bold text-text-dark uppercase tracking-widest">Discovery \u2022 <span id="result-count">${auctions.length}</span> Results</p>
        </div>
        <div class="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
          <span class="text-[10px] font-black text-text-dark uppercase tracking-widest">Sort:</span>
          <select id="sort-select" class="bg-transparent text-[11px] font-bold border-none focus:ring-0 text-white uppercase tracking-widest cursor-pointer outline-none">
            <option value="featured" ${filters.sort === 'featured' ? 'selected' : ''}>Featured First</option>
            <option value="latest" ${filters.sort === 'latest' ? 'selected' : ''}>Most Active</option>
            <option value="price_asc" ${filters.sort === 'price_asc' ? 'selected' : ''}>Price Ascending</option>
            <option value="ending" ${filters.sort === 'ending' ? 'selected' : ''}>Ending Soon</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-12" id="auction-grid">
        ${auctions.map(renderCard).join('')}
      </div>

      ${auctions.length === 0 ? `
        <div class="text-center py-32">
          <p class="text-text-dark text-lg font-semibold">No auctions match your filters</p>
          <button id="clear-filters" class="mt-4 text-accent-blue text-sm font-bold hover:underline">Clear all filters</button>
        </div>
      ` : ''}
    </div>
  </section>
  `;
};

const rerenderGrid = () => {
  const grid = document.getElementById('auction-grid');
  const countEl = document.getElementById('result-count');
  if (!grid) return;
  const auctions = getFilteredAuctions();
  grid.innerHTML = auctions.map(renderCard).join('');
  if (countEl) countEl.textContent = auctions.length;
};

export const mount = () => {
  // Category filter clicks
  document.getElementById('category-filters')?.addEventListener('click', (e) => {
    e.preventDefault();
    const link = e.target.closest('[data-category]');
    if (!link) return;
    store.setState(s => { s.filters.category = link.dataset.category; return s; });
    // Re-render the whole view by triggering hashchange
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  // Price slider
  const slider = document.getElementById('price-slider');
  const priceDisplay = document.getElementById('price-display');
  slider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    priceDisplay.textContent = val >= 10000 ? '$10,000+' : '$' + val.toLocaleString();
  });
  slider?.addEventListener('change', (e) => {
    store.setState(s => { s.filters.maxPrice = parseInt(e.target.value); return s; });
    rerenderGrid();
  });

  // Sort dropdown
  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    store.setState(s => { s.filters.sort = e.target.value; return s; });
    rerenderGrid();
  });

  // Clear filters button
  document.getElementById('clear-filters')?.addEventListener('click', () => {
    store.setState(s => { s.filters = { category: 'all', maxPrice: 10000, sort: 'featured' }; return s; });
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  // Live countdown timers
  const timerInterval = setInterval(() => {
    const { auctions } = store.getState();
    auctions.forEach(a => {
      const el = document.querySelector(`[data-countdown="${a.id}"]`);
      if (el) {
        const time = formatTimeShort(a.endTime);
        el.textContent = time.text;
        const badge = el.closest('[data-timer]');
        if (badge) {
          if (time.ended) {
            badge.className = 'absolute top-5 right-5 bg-white/10 border-white/10 backdrop-blur-xl px-5 py-2 rounded-full text-[9px] font-black text-text-muted uppercase tracking-[0.2em] border';
            badge.innerHTML = '<span class="text-text-muted">Ended</span>';
          } else if (time.urgent) {
            badge.classList.add('bg-rose-500/30', 'border-rose-500/40');
            badge.classList.remove('bg-black/40');
          }
        }
      }
    });
  }, 1000);

  // Update bid prices when simulator places bids
  const unsubBid = store.subscribe('bid', (data) => {
    const bidEl = document.querySelector(`[data-bid="${data.auctionId}"]`);
    if (bidEl) {
      bidEl.textContent = '$' + data.amount.toLocaleString();
      bidEl.classList.add('text-accent-cyan');
      setTimeout(() => bidEl.classList.remove('text-accent-cyan'), 1500);
    }
  });

  registerCleanup(() => {
    clearInterval(timerInterval);
    unsubBid();
  });
};

export default BrowseView;
