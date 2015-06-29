angular.module('starter.controllers', ["ionic"])

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
