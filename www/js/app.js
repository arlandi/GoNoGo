// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function() {
    Parse.initialize("fWrQZVK5nEvqdatS6l1xjl6AKUhGfZi0RmvFWe5T", "FjJ9JvqQ727AbhY0i2RDRWKTsGmNOpsKe34M1Mlk");
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    $rootScope.getCurrentUser = function() {
      $rootScope.currentUser = Parse.User.current();

      if ($rootScope.currentUser !== null) {
        console.log('User logged in', $rootScope.currentUser);
        $state.go('tab.dash');
      }
    }
    $rootScope.getCurrentUser();

  });
})

.config(function($stateProvider, $urlRouterProvider, $cordovaFacebookProvider) {
  // $cordovaFacebookProvider.browserInit(1415459878783005);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // Splash and sign in
  .state('splash', {
      url: '/splash',
      templateUrl: 'templates/splash.html',
      controller: 'SplashCtrl'
    })
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('signup', {
      url: '/sign-up',
      templateUrl: 'templates/sign-up.html',
      controller: 'SignUpCtrl'
    })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.list', {
        url: '/list',
        views: {
          'tab-list': {
            templateUrl: 'templates/tab-list.html',
            controller: 'ListCtrl'
          }
        }
      })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })

  .state('tab.vote', {
    url: '/vote',
    params: {
      question: null,
      vote: null
    },
    views: {
      'tab-dash': {
        templateUrl: 'templates/vote.html',
        controller: 'VoteCtrl'
      }
    }
  })

  .state('tab.comments', {
    url: '/comments',
    params: {
      question: null
    },
    views: {
      'tab-dash': {
        templateUrl: 'templates/comments.html',
        controller: 'CommentsCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/splash');

});
