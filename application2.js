$(function(){

  var score_set = new Array(10).join().split(',').map(function(item, index){ return ++index;});

  var player_initial_score = 501;
  $('#total_score_player1').append(player_initial_score);
  $('#total_score_player2').append(player_initial_score);


  console.log(player_initial_score);
  
  function rand_score(){
    return Math.floor(Math.random() * score_set.length);
  }

  // PLayer 1 GAME
  function play_game1(event) {
    event.preventDefault();
    var current_total_score = $('#total_score_player1').text();
    console.log(current_total_score);

    if (current_total_score == 0) {
      alert('Player 1 won!!');
      reset();
    } else {
    var rand_first_score = score_set[rand_score()];
    console.log(rand_first_score);
    var rand_second_score = score_set[rand_score()];
    var rand_third_score = score_set[rand_score()];
    $('#score11').html(rand_first_score);
    $('#score12').html(rand_second_score);
    $('#score13').html(rand_third_score)
    var total_score = parseInt(rand_first_score) + parseInt(rand_second_score) + parseInt(rand_third_score);
    console.log(total_score);
    var updated_total_score = parseInt(current_total_score) - parseInt(total_score);
    console.log(updated_total_score);
    current_total_score = $('#total_score_player1').html(updated_total_score);
    };
  }

  $('#player1').click(play_game1);

  // player 2 GAME
  function play_game2(event) {
    event.preventDefault();
    var current_total_score = $('#total_score_player2').text();
    console.log(current_total_score);

    if (current_total_score == 0) {
      alert('Player 2 won!!');
      return
    } else {
      var rand_first_score = score_set[rand_score()];
      console.log(rand_first_score);
      var rand_second_score = score_set[rand_score()];
      var rand_third_score = score_set[rand_score()];
      $('#score21').html(rand_first_score);
      $('#score22').html(rand_second_score);
      $('#score23').html(rand_third_score);
      var total_score = parseInt(rand_first_score) + parseInt(rand_second_score) + parseInt(rand_third_score);
      console.log(total_score);
      var updated_total_score = parseInt(current_total_score) - parseInt(total_score);
      console.log(updated_total_score);
      current_total_score = $('#total_score_player2').html(updated_total_score);
    };
  }

  $('#player2').click(play_game2);

  // Reset/refresh the Game/page
  function reset() {
    document.location.reload(true);
  };

  $('#reset').click(reset);


});


