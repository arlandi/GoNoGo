Parse.Cloud.afterSave("Vote", function(request, response) {
  var vote = request.object.get('vote');
  var comment = request.object.get('comment');
  var question = request.object.get('question');

  var Question = Parse.Object.extend("Question");
  var query = new Parse.Query(Question);
  query.get(question.id, {
    success: function(questionResult) {
      var yesVote = questionResult.get('yesVote') || 0;
      var noVote = questionResult.get('noVote') || 0;

      // Set number of votes
      if (vote) {
        yesVote = yesVote + 1;
        questionResult.set('yesVote', yesVote);
      } else {
        noVote = noVote + 1;
        questionResult.set('noVote', noVote);
      }

      // Set number of comments
      if (comment) {
        commentNum = questionResult.get('commentNum') || 0;
        questionResult.set('commentNum', commentNum + 1);
      }

      // Set percentage
      var totalVotes = yesVote + noVote;
      yesPercent = Math.round( (yesVote / totalVotes) * 100 );
      noPercent = Math.round( (noVote / totalVotes) * 100 );
      questionResult.set('votePercentage', [yesPercent, noPercent]);

      // Finally Save
      questionResult.save();
    },
    error: function(object, error) {
      console.log('Vote afterSave fail' + error.message);
    }
  });
});
