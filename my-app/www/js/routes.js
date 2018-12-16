routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/meldingen/',
    componentUrl: './pages/meldingen.html',
  },
  {
    path: '/product/:id/',
    componentUrl: './pages/product.html',
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
