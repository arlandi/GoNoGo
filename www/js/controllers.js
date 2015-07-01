angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('SplashCtrl', function($scope) {})

.controller('SignInCtrl', function($scope, $rootScope, $state) {
  $scope.signInError = '';

  $scope.signIn = function(user) {
    $scope.signInError = '';

    if (!user || !user.username || !user.password) {
      $scope.signInError = 'Please fill out all the fields.';
      return false;
    }

    $scope.loading = true;

    Parse.User.logIn(user.username.toLowerCase(), user.password, {
      success: function(thisUser) {
        console.log(thisUser);
        $rootScope.currentUser = thisUser;
        $rootScope.$apply();
        $state.go('tab.dash');
      },
      error: function(user, error) {
        console.log(error);
        switch (error.code) {
          case 101:
            $scope.signInError = 'Wrong username or password.';
            break;
        }
        $scope.loading = false;
        setTimeout(function() {
          $scope.$apply();
        });
      }
    });
  };
})

.controller('SignUpCtrl', function($scope, $rootScope, $state) {
  $scope.signUpError = '';

  $scope.signUp = function(user) {
    $scope.signUpError = '';

    if (!user || !user.email || !user.username || !user.password) {
      $scope.signUpError = 'Please fill out all the fields.';
      return false;
    }

    $scope.loading = true;

    var parseUser = new Parse.User();
    parseUser.set("email", user.email.toLowerCase());
    parseUser.set("username", user.username.toLowerCase());
    parseUser.set("usernameDisplay", user.username);
    parseUser.set("password", user.password);

    parseUser.signUp(null, {
      success: function(newUser) {
        $rootScope.currentUser = newUser;
        $rootScope.$apply();
        $state.go('tab.dash');
      },
      error: function(newUser, error) {
        console.log(error);
        switch (error.code) {
          case 125:
            $scope.signUpError = 'Invalid email.';
            break;
          case 202:
            $scope.signUpError = 'That username is taken.';
            break;
          case 203:
            $scope.signUpError = 'That email is taken.';
            break;
        }
        $scope.loading = false;
        $scope.$apply();
      }
    });
  }
})

.controller('DashCtrl', function($scope, Questions, $ionicLoading) {

  $ionicLoading.show();

  Questions.all()
    .then(function(data) {
      $scope.questions = data;
      $ionicLoading.hide();
    }, function(error) {
      alert(error);
      $ionicLoading.hide();
    });
})

.controller('ChatsCtrl', function($scope, $ionicLoading, $state) {
  $scope.submit = function(userQuestion) {
    $ionicLoading.show();
    var Question = Parse.Object.extend("Question");
    var question = new Question();

    question.set("question", userQuestion);

    question.save(null, {
      success: function(question) {
        console.log(question);
        $ionicLoading.hide();
        $state.go("tab.dash")

      },
      error: function(question, error) {
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
