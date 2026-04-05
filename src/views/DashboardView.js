import store from '../store/index.js';
import { registerCleanup } from '../router.js';
import { formatTimeShort } from '../components/countdown.js';
import { showToast } from '../components/toast.js';

const DashboardView = () => {
  const { user, auctions } = store.getState();

  if (!user) {
    return `
      <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 class="text-4xl font-black font-outfit">Sign In Required</h1>
        <p class="text-text-muted">You need to sign in to access your dashboard.</p>
        <a href="#/auth" class="bg-accent-blue text-white px-8 py-3 rounded-full text-sm font-bold no-underline hover:bg-accent-blue/80 transition-all">Sign In</a>
      </div>`;
  }

  // Get user's bids across all auctions
  const myBids = [];
  auctions.forEach(a => {
    a.bids.forEach(b => {
      if (b.bidder === user.name) {
        myBids.push({ ...b, auction: a });
      }
    });
  });

  // Auctions where user is currently winning
  const winning = auctions.filter(a =>
    a.bids.length > 0 && a.bids[0].bidder === user.name && a.endTime > Date.now()
  );

  // Auctions where user was outbid
  const outbid = auctions.filter(a => {
    const userBid = a.bids.find(b => b.bidder === user.name);
    return userBid && a.bids[0].bidder !== user.name && a.endTime > Date.now();
  });

  // Auctions won
  const won = auctions.filter(a =>
    a.bids.length > 0 && a.bids[0].bidder === user.name && a.endTime <= Date.now()
  );

  // User's listings (auctions where user is seller)
  const myListings = auctions.filter(a => a.seller.id === user.id);

  // Watchlist (stored in user object)
  const watchlistIds = user.watchlist || [];
  const watchlist = auctions.filter(a => watchlistIds.includes(a.id));

  return `
  <section class="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
      <div>
        <h1 class="text-4xl font-black font-outfit tracking-tighter mb-2">Dashboard</h1>
        <p class="text-text-muted text-sm">Welcome back, <span class="text-white font-bold">${user.name}</span></p>
      </div>
      <a href="#/sell" class="bg-accent-blue hover:bg-accent-blue/90 text-white px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 no-underline shadow-glow">
        + Create Listing
      </a>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      ${[
        { label: 'Active Bids', value: winning.length + outbid.length, color: 'accent-blue' },
        { label: 'Winning', value: winning.length, color: 'emerald-400' },
        { label: 'Outbid', value: outbid.length, color: 'amber-400' },
        { label: 'Won', value: won.length, color: 'accent-purple' },
      ].map(stat => `
        <div class="p-6 bg-bg-card border border-white/10 rounded-3xl">
          <p class="text-[10px] font-black text-text-dark uppercase tracking-widest mb-3">${stat.label}</p>
          <p class="text-3xl font-black font-outfit text-${stat.color}">${stat.value}</p>
        </div>
      `).join('')}
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-2 mb-10 overflow-x-auto pb-2">
      ${['Active Bids', 'Winning', 'Watchlist', 'My Listings', 'Won'].map((tab, i) => `
        <button data-tab="${tab.toLowerCase().replace(' ', '-')}" class="dash-tab px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${i === 0 ? 'bg-accent-blue text-white' : 'bg-white/5 text-text-muted hover:text-white border border-white/10'}">
          ${tab}
        </button>
      `).join('')}
    </div>

    <!-- Tab Content -->
    <div id="tab-content">
      <!-- Active Bids (default) -->
      <div id="panel-active-bids" class="tab-panel">
        ${renderAuctionList([...winning, ...outbid], user, 'No active bids yet. Browse the <a href="#/search" class="text-accent-blue hover:underline">marketplace</a> to find items.')}
      </div>
      <div id="panel-winning" class="tab-panel hidden">
        ${renderAuctionList(winning, user, 'You are not currently winning any auctions.')}
      </div>
      <div id="panel-watchlist" class="tab-panel hidden">
        ${renderAuctionList(watchlist, user, 'Your watchlist is empty. Add items from auction pages.')}
      </div>
      <div id="panel-my-listings" class="tab-panel hidden">
        ${myListings.length === 0
          ? `<div class="text-center py-20"><p class="text-text-dark text-lg font-semibold">You haven't listed any items yet.</p><a href="#/sell" class="mt-4 inline-block text-accent-blue text-sm font-bold hover:underline">Create your first listing</a></div>`
          : renderAuctionList(myListings, user, '')}
      </div>
      <div id="panel-won" class="tab-panel hidden">
        ${renderAuctionList(won, user, 'No won auctions yet. Keep bidding!')}
      </div>
    </div>
  </section>
  `;
};

const renderAuctionList = (list, user, emptyMsg) => {
  if (list.length === 0) return `<div class="text-center py-20"><p class="text-text-dark text-lg font-semibold">${emptyMsg}</p></div>`;

  return `
    <div class="space-y-4">
      ${list.map(a => {
        const time = formatTimeShort(a.endTime);
        const isWinning = a.bids.length > 0 && a.bids[0].bidder === user.name;
        return `
          <a href="#/auction/${a.id}" class="flex items-center gap-6 p-5 bg-bg-card border border-white/5 rounded-3xl hover:border-accent-blue/30 transition-all no-underline text-white group">
            <div class="h-20 w-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
              <img src="${a.images[0]}" class="w-full h-full object-cover" alt="${a.title}" />
            </div>
            <div class="flex-grow min-w-0">
              <h4 class="font-bold font-outfit group-hover:text-accent-blue transition-colors truncate">${a.title}</h4>
              <p class="text-xs text-text-dark mt-1">By ${a.seller.name} \u2022 ${a.totalBids} bids</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-lg font-black font-outfit">$${a.currentBid.toLocaleString()}</p>
              <p class="text-[10px] font-bold uppercase tracking-widest mt-1 ${time.ended ? 'text-text-dark' : (time.urgent ? 'text-accent-rose' : (isWinning ? 'text-emerald-400' : 'text-amber-400'))}">
                ${time.ended ? 'Ended' : (isWinning ? 'Winning \u2022 ' + time.text : 'Outbid \u2022 ' + time.text)}
              </p>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  `;
};

export const mount = () => {
  // Tab switching
  document.querySelectorAll('.dash-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      // Update tab styles
      document.querySelectorAll('.dash-tab').forEach(t => {
        t.className = 'dash-tab px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap bg-white/5 text-text-muted hover:text-white border border-white/10';
      });
      btn.className = 'dash-tab px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap bg-accent-blue text-white';

      // Show/hide panels
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
      document.getElementById(`panel-${tabId}`)?.classList.remove('hidden');
    });
  });
};

export default DashboardView;
