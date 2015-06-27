angular.module('starter.controllers', ["ionic"])

.controller('DashCtrl', function($scope, Questions) {
  $scope.questions = Questions.all();
})

.controller('ChatsCtrl', function($scope, Chats, $ionicLoading, $state) {


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
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
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
