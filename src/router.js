const routes = {
  '/': 'HomeView',
  '/search': 'BrowseView',
  '/auction': 'AuctionDetailView'
};

export const initRouter = async () => {
  const mountRoute = async () => {
    const hash = window.location.hash.replace('#', '') || '/';
    const viewName = routes[hash] || 'HomeView';
    
    const routerView = document.getElementById('router-view');
    routerView.style.opacity = '0'; // Transition start
    
    try {
      const module = await import(`./views/${viewName}.js`);
      routerView.innerHTML = module.default();
    } catch (err) {
      console.error('Failed to load view:', err);
      routerView.innerHTML = `<h1>404 Not Found</h1>`;
    }
    
    setTimeout(() => { routerView.style.opacity = '1'; }, 50); // Transition end
  };

  window.addEventListener('hashchange', mountRoute);
  mountRoute(); // Initial load
};
