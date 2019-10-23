$(document).ready(intializeApp);
var firstCardClicked = null;
var secondCardClicked = null;
var firstCardUrl = null;
var secondCardUrl = null;
var matches = null;
var max_matches = 1;
var attempts = 0;
var games_played = 0;
var accuracy = 0;

function intializeApp(){
  shuffleCards();
  $(".brawlStars").on("click", handleCardClick);

}

function displayScores(res) {
  for(var scoreCount = 0; scoreCount < res.length; scoreCount++){
    var tableRow = $("<tr>");
    var rank = $("<td>").text(scoreCount+1);
    var name = $("<td>").text(res[scoreCount].name);
    var attemptsTd = $("<td>").text(res[scoreCount].attempts);
    var accuracyTd = $("<td>").text(res[scoreCount].accuracy);
    tableRow.append(rank, name, attemptsTd, accuracyTd);
    $("table").append(tableRow);
  }

  //       // game reset button
  var modalButton = $("<button>");
  modalButton.attr('id', 'modalButton');
  modalButton.text("Play again");
  modalButton.on('click', resetGame);
  $("body").append(modalButton);
}

function getScores(){
  var scoresConfig = {
    datatype: "json",
    url: "/api/highScore.php",
    success: function(response) {
      displayScores(response);
    }
  };
  $.ajax(scoresConfig);
}

function addScore(name){
  var inputText = $("input:text").val();
  var tempAccuracy = calculateAccuracy();

  var newScore = {
    name: name,
    attempts: attempts,
    accuracy: tempAccuracy
  }
  var stringScore = JSON.stringify(newScore);

  var addScoreConfig = {
    type: "POST",
    datatype: "json",
    data: stringScore,
    url: "/api/addScore.php"
  };

  $.ajax(addScoreConfig)
    .done(() => getScores());
}

function handleCardClick(event){
  var clickCurrentTarget = $(event.currentTarget);
  clickCurrentTarget.addClass('hidden');
  playAudio2()
  if (!firstCardClicked){
    firstCardClicked = clickCurrentTarget;
    firstCardUrl = $(firstCardClicked).siblings().css("background-image");
  } else if(!secondCardClicked){
    secondCardClicked = clickCurrentTarget;
    secondCardUrl = $(secondCardClicked).siblings().css("background-image");
    $(".brawlStars").off("click", handleCardClick);
    attempts++;
    if (firstCardUrl === secondCardUrl){
      matches++;
      firstCardClicked = null;
      secondCardClicked = null;
      $(".brawlStars").on("click", handleCardClick);
      if(max_matches === matches){
        $(".brawlStars").off("click", handleCardClick);
        var winningDiv = $('.youWin');
        winningDiv.removeClass('hidden');
        winningDiv.text("You Won!");


        // game reset button
        // var modalButton = $("<button>");
        // modalButton.attr('id', 'modalButton');
        // modalButton.text("Play again");
        // modalButton.on('click', resetGame);
        // winningDiv.append(modalButton);

        var inputLabel = $("<label>");
        inputLabel.attr("for", "nameInput");
        inputLabel.addClass("labelInput");
        inputLabel.html("<br>" + "Enter your name: ");
        winningDiv.append(inputLabel);

        var inputForm = $("<input>");
        inputForm.attr("type", "text");
        inputForm.attr("id", "nameInput");
        winningDiv.append(inputForm);

        var inputButton = $("<input>");
        inputButton.attr("type", "submit");
        inputButton.attr("id", "nameButton");
        winningDiv.append(inputButton);

        $('#nameButton').on("click", nameSubmit);

        var scoreTable = $("<div>");
        scoreTable.addClass("scores");

        games_played++;
        playAudio();
      }
    } else {
      flipCardsBack();
    }
    displayStats();
  }
}

function nameSubmit(){
  var inputText = $("input:text").val();
  addScore(inputText);
  // getScores();
  $("youWin").addClass("hidden");
  $("table").removeClass("hidden");

}

function flipCardsBack(){
  setTimeout(function(){
    $(".brawlStars").on("click", handleCardClick);
    firstCardClicked.removeClass('hidden');
    secondCardClicked.removeClass('hidden');
    firstCardClicked = null;
    secondCardClicked = null;
  }, 1500);
}

function resetGame(){
  shuffleCards();
  $(".brawlStars").on("click", handleCardClick);
  $('.youWin').addClass('hidden');
  $('#modalButton').addClass('hidden');
  $('table').addClass('hidden');
  $('.brawlStars').removeClass('hidden');

  matches = null;
  attempts = 0;
  $('.attempts').text("0");
  $('.accuracy').text('0%');
}

function calculateAccuracy(){
  accuracy = Math.round(100*(matches/attempts));
  return accuracy;
}

function displayStats(){
  var yourAccuracy = calculateAccuracy();
  $('.accuracy').text(yourAccuracy + '%');
  $('.gamesPlayed').text(games_played);
  $('.attempts').text(attempts);
}

function shuffleCards(){
  var cardsArray = ['elPrimo', 'nita', 'poco', 'frank', 'barley', 'carl', 'mortis', 'tara', 'elPrimo', 'nita', 'poco', 'frank', 'barley', 'carl', 'mortis', 'tara', 'pam', 'pam'];
  var frontCards = $('.frontCard');
  var randomNum = 0;
  var roundRandomNum = 0;
  var spliceNum = "";
  for (var cardsArrayNum = 0; cardsArrayNum < 18; cardsArrayNum++) {
    frontCards.removeClass(cardsArray[cardsArrayNum]);
  }
    $('.frontCard').each(function(){
      randomNum = Math.random() * (cardsArray.length - 1);
      roundRandomNum = Math.round(randomNum);
      spliceNum = cardsArray.splice(roundRandomNum, 1);
      $(this).addClass(spliceNum);
    })
}

function playAudio() {
  var audio = new Audio("assets/sounds/retro-arcade.wav");
  audio.play();
}

function playAudio2() {
  var audio = new Audio("assets/sounds/clickSound.wav");
  audio.play();
}
