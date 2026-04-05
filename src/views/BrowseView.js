const BrowseView = () => `
  <section class="max-w-[1440px] mx-auto px-10 py-20 flex flex-col lg:flex-row gap-16">
    <!-- Sidebar Filters -->
    <aside class="w-full lg:w-80 shrink-0 space-y-16">
      <div>
        <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-text-dark mb-8">Categories</h3>
        <nav class="space-y-6">
          <a href="#" class="flex items-center group no-underline">
            <span class="h-1.5 w-1.5 rounded-full bg-accent-blue mr-4"></span>
            <span class="text-sm font-bold text-white transition-colors">All Collections</span>
          </a>
          <a href="#" class="flex items-center group no-underline">
            <span class="h-1.5 w-1.5 rounded-full bg-transparent border border-white/20 mr-4 group-hover:bg-accent-blue transition-all"></span>
            <span class="text-sm font-semibold text-text-muted hover:text-white transition-colors">Fine Watches</span>
          </a>
          <a href="#" class="flex items-center group no-underline">
            <span class="h-1.5 w-1.5 rounded-full bg-transparent border border-white/20 mr-4 group-hover:bg-accent-blue transition-all"></span>
            <span class="text-sm font-semibold text-text-muted hover:text-white transition-colors">Digital Retables</span>
          </a>
          <a href="#" class="flex items-center group no-underline">
            <span class="h-1.5 w-1.5 rounded-full bg-transparent border border-white/20 mr-4 group-hover:bg-accent-blue transition-all"></span>
            <span class="text-sm font-semibold text-text-muted hover:text-white transition-colors">Private Motors</span>
          </a>
        </nav>
      </div>

      <div>
        <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-text-dark mb-8">Price Threshold</h3>
        <div class="space-y-6">
          <input type="range" min="0" max="10000" class="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-blue">
          <div class="flex justify-between text-[10px] font-black text-text-dark uppercase tracking-widest">
            <span>$0</span>
            <span class="text-text-muted">$10,000+</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Auction Grid -->
    <div class="flex-grow">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
        <div>
          <h2 class="text-3xl font-black font-outfit tracking-tighter mb-2">Live Auctions</h2>
          <p class="text-xs font-bold text-text-dark uppercase tracking-widest">Discovery • 8,240 Results</p>
        </div>
        <div class="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
          <span class="text-[10px] font-black text-text-dark uppercase tracking-widest">Sort:</span>
          <select class="bg-transparent text-[11px] font-bold border-none focus:ring-0 text-white uppercase tracking-widest cursor-pointer outline-none">
            <option>Featured First</option>
            <option>Latest Uploads</option>
            <option>Price Ascending</option>
            <option>Ending Soon</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-12">
        ${[1, 2, 3, 4, 5, 6].map(i => `
          <div class="group relative bg-[#0e0e1a]/40 border border-white/5 rounded-[48px] p-5 transition-all duration-700 hover:border-accent-blue/40 hover:-translate-y-3 hover:shadow-premium ring-1 ring-white/5 hover:ring-white/10">
            <!-- Image Area -->
            <div class="aspect-[4/3] rounded-[36px] overflow-hidden relative mb-8 shadow-2xl">
               <div class="absolute inset-0 bg-center bg-cover transition-transform duration-1000 group-hover:scale-110" 
                    style="background-image: url('https://picsum.photos/800/600?random=${i + 10}');"></div>
               <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div class="absolute top-5 right-5 bg-black/40 backdrop-blur-xl px-5 py-2 rounded-full text-[9px] font-black text-white uppercase tracking-[0.2em] border border-white/10 animate-pulse">
                 Live • 02:45
               </div>
            </div>

            <!-- Content -->
            <div class="px-3 pb-3">
              <div class="flex justify-between items-start mb-6">
                <h4 class="text-xl font-black font-outfit leading-tight group-hover:text-accent-blue transition-colors duration-500">Edition Collection #${i}</h4>
                <div class="h-10 w-10 flex-shrink-0 rounded-full border border-white/10 flex items-center justify-center text-text-dark hover:text-white hover:border-white transition-all">
                  <span class="text-sm">↗</span>
                </div>
              </div>
              
              <div class="flex justify-between items-end pt-2">
                <div class="space-y-1">
                  <p class="text-[9px] font-black text-text-dark uppercase tracking-[0.3em]">Current Highest</p>
                  <p class="text-2xl font-black font-outfit text-white tracking-tighter">$${(i * 2450).toLocaleString()}</p>
                </div>
                <button class="bg-white/5 hover:bg-white text-white hover:text-black transition-all px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                  Quick Bid
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
`;

export default BrowseView;
