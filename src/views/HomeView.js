import store from '../store/index.js';
import { registerCleanup } from '../router.js';
import { formatTimeLeft } from '../components/countdown.js';

const HomeView = () => {
  const { auctions } = store.getState();
  const featured = auctions.find(a => a.featured) || auctions[0];
  const time = formatTimeLeft(featured.endTime);

  // Pick 4 trending auctions (most bids, excluding featured)
  const trending = [...auctions]
    .filter(a => a.id !== featured.id && new Date(a.endTime).getTime() > Date.now())

    .sort((a, b) => b.totalBids - a.totalBids)
    .slice(0, 4);

  return `
  <!-- Hero Section -->
  <section class="relative min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden px-6 md:px-10 py-20">
    <div class="max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-32 items-center relative z-10">

      <div class="space-y-12 text-center lg:text-left">
        <div class="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-text-muted text-[10px] font-black uppercase tracking-[0.4em]">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Exclusive Access \u2022 Live Now
        </div>

        <h1 class="text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-black font-outfit leading-[0.85] tracking-tighter">
          Own the <br/>
          <span class="text-gradient">Unknown.</span>
        </h1>

        <p class="text-xl text-text-muted max-w-[500px] mx-auto lg:mx-0 leading-relaxed font-medium">
          The ultimate digital destination for time-bound luxury acquisitions.
          Discover rare assets curated for the world's most discerning collectors.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
          <a href="#/search" class="bg-accent-blue hover:bg-white hover:text-accent-blue text-white px-10 py-4 rounded-full text-xs md:text-sm font-black uppercase tracking-widest transition-all hover:scale-105 no-underline ring-1 ring-accent-blue/50 text-center">

            Enter Marketplace
          </a>
          <button class="bg-white/5 hover:bg-white/10 text-white px-10 py-4 rounded-full text-xs md:text-sm font-black uppercase tracking-widest border border-white/10 transition-all hover:scale-105">
            The Process
          </button>
        </div>
      </div>

      <!-- Featured Auction Card -->
      <a href="#/auction/${featured.id}" class="relative hidden lg:block perspective-1000 no-underline text-white group">
        <div class="relative z-10 p-16 glass-effect rounded-[80px] border-white/10 shadow-premium transform rotate-3 hover:rotate-0 transition-all duration-1000">
          <div class="aspect-square rounded-[50px] overflow-hidden mb-12 shadow-2xl ring-1 ring-white/10">
            <img src="${featured.images && featured.images.length > 0 ? featured.images[0] : 'https://via.placeholder.com/800x800?text=No+Image'}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="${featured.title}" />

          </div>
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <span class="text-[9px] font-black text-text-dark uppercase tracking-[0.4em]">Featured Series</span>
              <span class="px-4 py-1.5 rounded-full ${time.urgent ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-accent-blue/10 text-accent-blue border-accent-blue/20'} text-[10px] font-black uppercase tracking-widest border" id="featured-badge">
                ${time.ended ? 'Ended' : (time.urgent ? 'Ending Soon' : 'Live Now')}
              </span>
            </div>
            <div class="flex justify-between items-end pt-2">
              <div class="space-y-1">
                <p class="text-[10px] font-black text-text-dark uppercase tracking-widest">Current Bid</p>
                <p class="text-5xl font-black font-outfit tracking-tighter" id="featured-bid">$${featured.currentBid.toLocaleString()}</p>
              </div>
              <div class="h-16 w-16 rounded-full border border-white/20 flex items-center justify-center text-white text-xl group-hover:bg-accent-blue group-hover:border-accent-blue transition-all duration-700">
                \u2197
              </div>
            </div>
            <div class="text-center">
              <span class="text-[10px] font-bold text-text-dark uppercase tracking-widest" id="featured-timer">${time.ended ? 'Auction Ended' : time.text + ' remaining'}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  </section>


  <!-- Trending Auctions -->
  <section class="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-32 border-t border-white/5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 md:mb-16 gap-4">
      <div class="space-y-2">
        <h3 class="text-[10px] font-black text-accent-blue uppercase tracking-[0.4em]">Curated</h3>
        <h2 class="text-4xl font-black font-outfit tracking-tighter">Trending Now</h2>
      </div>
      <a href="#/search" class="text-xs font-bold text-text-muted hover:text-white transition-colors uppercase tracking-[0.2em] no-underline border-b border-white/10 pb-1">View All Auctions</a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
      ${trending.map(auction => {
        const t = formatTimeLeft(auction.endTime);
        return `
        <a href="#/auction/${auction.id}" class="group cursor-pointer no-underline text-white block">
          <div class="aspect-[4/5] rounded-[40px] overflow-hidden bg-white/5 border border-white/5 mb-8 transition-all duration-700 group-hover:border-accent-blue/30 ring-1 ring-white/5 hover:ring-white/10 relative">

            <img src="${auction.images && auction.images.length > 0 ? auction.images[0] : 'https://via.placeholder.com/600x800?text=No+Image'}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-100" alt="${auction.title}" />

            <div class="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <span class="px-3 py-1 rounded-full bg-black/50 backdrop-blur-xl text-[9px] font-black text-white uppercase tracking-widest border border-white/10">${t.ended ? 'Ended' : t.text}</span>
              <span class="px-3 py-1 rounded-full bg-black/50 backdrop-blur-xl text-[9px] font-black text-white uppercase tracking-widest border border-white/10">${auction.totalBids} bids</span>
            </div>
          </div>
          <div class="px-2">
            <h4 class="text-xs font-black uppercase tracking-[0.3em] text-text-muted group-hover:text-white transition-colors text-center group-hover:text-accent-blue">${auction.title}</h4>
            <p class="text-lg font-black font-outfit text-center mt-2 tracking-tighter">$${auction.currentBid.toLocaleString()}</p>
          </div>
        </a>
        `;
      }).join('')}
    </div>
  </section>
  `;
};

export const mount = () => {
  // Live update featured card
  const timerInterval = setInterval(() => {
    const { auctions } = store.getState();
    const featured = auctions.find(a => a.featured) || auctions[0];
    const time = formatTimeLeft(featured.endTime);

    const timerEl = document.getElementById('featured-timer');
    const bidEl = document.getElementById('featured-bid');

    if (timerEl) timerEl.textContent = time.ended ? 'Auction Ended' : time.text + ' remaining';
    if (bidEl) bidEl.textContent = '$' + featured.currentBid.toLocaleString();
  }, 1000);

  registerCleanup(() => clearInterval(timerInterval));
};

export default HomeView;
