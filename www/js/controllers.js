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

.controller('DashCtrl', function($scope, Questions, $ionicLoading, $state) {

  $scope.$on('$ionicView.beforeEnter', function() {
    $ionicLoading.show();

    Questions.all()
      .then(function(data) {
        $scope.questions = data;
        $ionicLoading.hide();
      }, function(error) {
        alert(error);
        $ionicLoading.hide();
      });
  });

  $scope.goVote = function(question, vote) {
    $state.go('tab.vote', {
      question: question,
      vote: vote
    });
  };

  $scope.goComments = function(question) {
    $state.go('tab.comments', {
      question: question
    });
  };
})

.controller('ChatsCtrl', function($scope, $ionicLoading, $state, $rootScope) {
  $scope.submit = function(userQuestion) {
    $ionicLoading.show();
    var Question = Parse.Object.extend("Question");
    var question = new Question();

    question.set("question", userQuestion);
    question.set("commentNum", 0);
    question.set("yesVote", 0);
    question.set("noVote", 0);
    question.set("createdBy", $rootScope.currentUser);

    question.save(null, {
      success: function(question) {
        console.log(question);
        $ionicLoading.hide();
        $state.go("tab.dash");
      },
      error: function(question, error) {
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });
  }
})

.controller('VoteCtrl', function($scope, $stateParams, $ionicLoading, $rootScope, $state) {
  $scope.question = $stateParams.question;
  $scope.vote = $stateParams.vote;

  $scope.submitVote = function(userVote, userComment) {
    $ionicLoading.show();
    var Vote = Parse.Object.extend("Vote");
    var vote = new Vote();

    var Question = Parse.Object.extend("Question");
    var question = new Question();
    question.id = $scope.question.objectId;

    vote.set("question", question);
    vote.set("createdBy", $rootScope.currentUser);
    vote.set("vote", userVote);
    vote.set("comment", userComment);

    vote.save(null, {
      success: function(vote) {
        $ionicLoading.hide();
        $state.go("tab.dash");
      },
      error: function(vote, error) {
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });
  }
})

.controller('CommentsCtrl', function($scope, $stateParams, $ionicLoading, $rootScope, $state) {
  $scope.question = $stateParams.question;
})

.controller('AccountCtrl', function($scope, $rootScope, $state) {
  $scope.user = $rootScope.currentUser.toJSON();

  $scope.logout = function() {
    $rootScope.currentUser = null;
    Parse.User.logOut();
    $state.go('splash');
  }
});
