// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App root data

  on: {
    pageInit: function (page) {
      if (localStorage.getItem("darktheme") == 1) {
        $$('body').addClass('theme-dark color-theme-red');
        $$('.darktheme-toggle input').prop({checked: true});
      }

      var toggle = app.toggle.create({
        el: '.darktheme-toggle',
        on: {
          change: function () {
            if (toggle.checked) {
              localStorage.setItem("darktheme", "1");
              $$('body').addClass('theme-dark color-theme-red');
            } else {
              localStorage.removeItem("darktheme");
              $$('body').removeClass('theme-dark color-theme-red')
            }
          }
        }
      });
    },
    popupOpen: function (popup) {
    },
  },

  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
      // Demo products for Catalog section
      products: [
        {
          id: '1',
          title: 'Apple iPhone 8',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        },
        {
          id: '2',
          title: 'Apple iPhone 8 Plus',
          description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
        },
        {
          id: '3',
          title: 'Apple iPhone X',
          description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
        },
      ]
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var meldingenView = app.views.create('#view-meldingen', {
  url: '/meldingen/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});
