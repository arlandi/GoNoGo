angular.module('starter.services', [])

.factory('Questions', function() {
  return {
    all: function() {
      var Question = Parse.Object.extend("Question");

      var query = new Parse.Query(Question);

      query.include("createdBy");
      query.limit(50);
      query.descending("createdAt");

      return query.find().then(
        function(results) {
          var res = [];
          for (var i = 0; i < results.length; i++) {
            results[i].set('createdBy', results[i].get('createdBy').toJSON());
            res.push(results[i].toJSON());
          }
          return res;
        },
        function(error) {
          return error;
        }
      );
    },
    get: function(questionId) {
      for (var i = 0; i < questions.length; i++) {
        if (questions[i].id === parseInt(questionId)) {
          return questions[i];
        }
      }
      return null;
    }
  };
})

.factory('Comments', function() {
  return {
    getAllForQuestionId: function(questionId) {
      var Vote     = Parse.Object.extend("Vote");
      var Question = Parse.Object.extend("Question");
      var user     = Parse.Object.extend("User");

      var query    = new Parse.Query(Vote);
      var question = new Question();
      question.id  = questionId;

      query.include("createdBy");
      query.descending("createdAt");
      query.exists("comment");
      query.equalTo("question", question);

      return query.find().then(
        function(results) {
          var res = [];
          for (var i = 0; i < results.length; i++) {
            results[i].set('createdBy', results[i].get('createdBy').toJSON());
            res.push(results[i].toJSON());
          }
          return res;
        },
        function(error) {
          return error;
        }
      );
    },
  };
});
