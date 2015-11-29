/* A library of generic Javascript functions.*/

var isIE = document.all;

/* Get/add/remove elements from the Document Object Model (DOM).
 * Source: http://www.dustindiaz.com/add-remove-elements-reprise/
 */
var DOM = {
  get: function(el) {
    if (typeof el === 'string') {
      return document.getElementById(el);
    } else {
      return el;
    }
  },
  add: function(el, dest) {
    var el = this.get(el);
    var dest = this.get(dest);

    dest.appendChild(el);
  },
  remove: function(el) {
    var el = this.get(el);

    el.parentNode.removeChild(el);
  }
};

/*Add events to DOM objects.
 * Source: http://www.dustindiaz.com/add-remove-elements-reprise/
 */
var Event = {
  add: function() {
    if (window.addEventListener) {
      return function(el, type, fn) {
        DOM.get(el).addEventListener(type, fn, false);
      };
    } else if (window.attachEvent) {
      return function(el, type, fn) {
        var f = function() {
          fn.call(DOM.get(el), window.event);
        };
        DOM.get(el).attachEvent('on' + type, f);
      };
    }
  }()
};


/* Function   setText
 * Description  Set the text of an object.
 * Parameters id - the object identifier
 *        txt - the text to set
 * Returns    The text to set.
 */
function setText(id, txt) {
  DOM.get(id).innerHTML = txt;
  
  return txt;
}

/*Function   hypotenuse
 * Description  Gets a triangle's hypotenuse using the Pythagoras's theorem
 * Parameters a - triangle's base; c - triangle's height
 * Returns    triangle's hypotenuse
 */
function hypotenuse(a, c) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(c, 2));
}

/*****************************************************************************
 * Function   sleep
 * Description  Implements some kind of sleep (blocking) function in Javascript.
 * Parameters How long to sleep (in ms).
 * Returns    nothing
 */
function sleep(delay) {
  var start = new Date().getTime();

  while (new Date().getTime() < start + delay);
}

/*****************************************************************************
 * Function   is_empty
 * Description  Check if the received argument is empty.
 * Parameters The value to check.
 * Returns    True if it is empty; false if not.
 */
function is_empty(arg) {
  return (arg == null || (typeof(arg) == 'string' && arg == ''));
}

/* drag and drop   */


/*  Layer */

function Layer(name, x, y, width, height, html, zindex, visible) {
  // at least the layer's name is mandatory
  if (name == null) return;
  this.name = name;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.zindex = zindex == null ? 0 : zindex;
  this.visible = visible == null ? true : visible;

  this.html =
    '<div id="' + this.name +
    '" style="position:absolute' +
    ';top:' + this.y +
    ';left:' + this.x +
    ';width:' + this.width +
    ';height:' + this.height +
    ';z-index:' + this.zindex +
    ';visibility:' + (this.visible ? 'visible' : 'hidden') +
    ';">' + (html == null ? '' : html) +
    '</div>';
}


Layer.prototype.show = function() {
  if (!this.visible) {
    this.visible = true;
    DOM.get(this.name).style.visibility = 'visible';
  }
}

Layer.prototype.hide = function() {
  if (this.visible) {
    this.visible = false;
    DOM.get(this.name).style.visibility = 'hidden';
  }
}


Layer.prototype.setHTML = function(html) {
  DOM.get(this.name).innerHTML = html;
}

Layer.prototype.moveBy = function(x, y) {
  this.moveTo(this.x + x, this.y + y)
}


Layer.prototype.moveTo = function(x, y) {
  DOM.get(this.name).style.left = (this.x = x);
  DOM.get(this.name).style.top = (this.y = y);
}

Layer.prototype.create = function() {
  var el = document.createElement('div');
  el.innerHTML = this.html;
  DOM.add(el, document.body);
}
/*  Timer*/

function Timer() {
  this.id = 0;    // timer identifier
  this.func = null; // timer call-back function
  // this.is_active = gameStatus();
  this.is_active = function() {
      return (this.id ? true : false);
      }
}

// function gameStatus() {
//   return (Timer.id ? true : false);
//   }

// Timer.prototype.is_active = function() {
//  return (this.id ? true : false);
// }

Timer.prototype.start = function(func, time) {
  if (this.is_active()) this.stop();
  this.id = setInterval((this.func = func), time);
}

Timer.prototype.stop = function() {
  clearInterval(this.id);
  this.id = 0;
}

Timer.prototype.change = function(time) {
  this.start(this.func, time);
}

/* Score */

/*****************************************************************************
 * Class    Score
 * Description  Instantiates a new score board.
 * Parameters   index - the player's counter
 *        name - the player's name
 * Returns    nothing
 */
function Score(index, name) {
  this.index = index;
  this.name = name;     // player's name

  this.lblPlayer = 'lblPlayer' + this.index;
  this.rowDart = 'rowDart' + this.index;
  this.lblTurn = 'lblTurn' + this.index;
  this.lblDart = 'lblDart' + this.index;
  this.lblScore = 'lblScore' + this.index;

  this.reset();

  setText(this.lblPlayer, this.name);

  this.dartNum = 0;
}

/*******************************************************************************
 * Function   clear
 * Description  clear the player dart scores.
 * Parameters none
 * Returns    nothing
 */
Score.prototype.clear = function() {
  for (var n = 0; n < 3; n++)
    setText(this.lblDart + n, '-');
}

/*******************************************************************************
 * Function   reset
 * Description  Clear the player dart scores.
 * Parameters none
 * Returns    nothing
 */
Score.prototype.reset = function() {
  this.clear();

  this.darts = new Array(0, 0, 0);
  this.turns = 0;
  this.total = 501;
  this.total_prev = 501;

  setText(this.lblScore, this.total);
  // TODO: strings should come from the language object
  //setText(this.lblTurn, lang.str(6));
  setText(this.lblTurn, 'Darts');
}

/*******************************************************************************
 * Function   lightHigh, lightLow
 * Description  Turn on and off the light on the dart.
 * Parameters dart - the dart number
 * Returns    nothing
 */
Score.prototype.lightHigh = function(dart) {
  DOM.get('rowDart' + this.index + dart).style.backgroundColor = '#ffff00';
}
Score.prototype.lightLow = function(dart) {
  DOM.get('rowDart' + this.index + dart).style.backgroundColor = '#ffffff';
}

/*******************************************************************************
 * Function   setDart
 * Description  Set the score of a dart for the player.
 * Parameters dart - the dart number; score - score value
 * Returns    nothing
 */
Score.prototype.setDart = function(dart, score) {
  this.darts[dart] = score;
  setText(this.lblDart + dart, score);

  this.setTotal(this.total - score);
}

/*******************************************************************************
 * Function   setTotal
 * Description  Set the total score for the player.
 * Parameters score - total score value
 * Returns    nothing
 */
Score.prototype.setTotal = function(score) {
  this.total = score;
  setText(this.lblScore, score);
}

/*******************************************************************************
 * Function   newTurn
 * Description  Set the score for a new turn.
 * Parameters none
 * Returns    nothing
 */
Score.prototype.newTurn = function() {
  // record the current score before a new turn
  this.total_prev = this.total;
  
  // set the darts turn label (increment the player's turn counter)
  setText(
    this.lblTurn,
    // TODO: strings should come from the language object
    //lang.str(6) + ' (' + lang.str(7) + ' ' + ++this.turns + ')'
    'Darts' + ' (' + 'turn' + ' ' + ++this.turns + ')'
  );

  this.clear();
}

/* Board */


Board.prototype = new Layer;      // define sub-class of Layer

 /*****************************************************************************
 * Class    Board
 * Description  Instantiates a new board object.
 * Parameters   name - layer's name;
 *        boardWidth, boardHeight - the board's width and height
 * Returns    nothing
 */
Board.prototype.constructor = Board;
function Board(name) {
  this.WIDTH = 496;
  this.HEIGHT = 496;
  this.CENTER_X = this.WIDTH / 2;
  this.CENTER_Y = this.HEIGHT / 2;
  this.MARGIN = 30;

  this.IMAGE = 'images/board.gif';

  this.calcXY();

  // call the super-class constructor
  Layer.call(
    this,
    name,   // board layer's name
    this.x,
    this.y,
    this.WIDTH,
    this.HEIGHT,
    '<img border="0" src="' + this.IMAGE +
      '" width="' + this.WIDTH +
      '" height="' + this.HEIGHT +
      '" />'
  );
}

 Board.prototype.calcXY = function() {
    this.x = Math.floor((window.innerWidth - this.WIDTH) / 2);
    this.y = Math.floor((window.innerHeight - this.HEIGHT) / 2);

  // set the minimum left and top margins allowed for the board
  if (this.x < this.MARGIN) this.x = this.MARGIN;
  if (this.y < this.MARGIN) this.y = this.MARGIN;
 }

 /* Dart  */

 Dart.prototype = new Layer;      // define sub-class of Layer

  /*****************************************************************************
  * Class   Dart
  * Description Instantiates a new dart object.
  * Parameters  name - layer's name;
  *         boardWidth, boardHeight - the board's width and height
  * Returns   nothing
  */
 Dart.prototype.constructor = Dart;
 function Dart(name, playerId, dartId, boardWidth, boardHeight) {
  this.WIDTH = 17;
  this.HEIGHT = 15;
  this.MARGIN = 5;
  this.MARGIN_BOTTOM = boardHeight - this.HEIGHT - this.MARGIN;

  this.IMAGES = new Array();
  this.IMAGES[0] = new Image(this.WIDTH, this.HEIGHT);
  this.IMAGES[0].src = 'images/dart0.gif';
  this.IMAGES[1] = new Image(this.WIDTH, this.HEIGHT);
  this.IMAGES[1].src = 'images/dart1.gif';

  this.playerId = playerId;   // player id
  this.dartId = dartId;     // dart id

  // call the super-class constructor
  Layer.call(this, name, 0, 0, this.WIDTH, this.HEIGHT);
 }

 /*****************************************************************************
  * Function    dartSetImage
  * Description Set the dart layer image.
  * Parameters  image - the image to set
  * Returns   nothing
  */
 Dart.prototype.setImage = function(image) {
  this.setHTML(
    '<img border="0" src="' + this.IMAGES[image].src +
    '" width="' + this.WIDTH +
    '" height="' + this.HEIGHT +
    '" />'
  );
 }

 /*******************************************************************************
  * Function    showByPlayer
  * Description Show the player dart in the game space footer.
  * Parameters  none
  * Returns   nothing
  */
 Dart.prototype.showByPlayer = function(boardX, boardY) {
  var x = (this.playerId ? 418 : 16) + (this.dartId * 25);

  this.setImage(0);
  this.moveTo(boardX + x, boardY + this.MARGIN_BOTTOM);
  this.show();
 }

 /*******************************************************************************
  * Function    realX, realY
  * Description Calculate the real coords of the layer.
  * Parameters  none
  * Returns   The X and Y coordinates of the dart layer.
  * 
  * Note: The board position should always be centered inside the game space.
  * We need to sum 3 pixels to the coords to correct the point where the dart
  * hits the board because of the center in the dart's image. Even if this is
  * a quadratic mode (remember the old X modes?) we need to do this hack ;-)
  */
 Dart.prototype.realX = function() {
  return this.x + Math.floor(this.WIDTH / 2) - 3;
 }
 Dart.prototype.realY = function() {
  return this.y + Math.floor(this.HEIGHT / 2) - 3;
 }

 /* Hand */

 Hand.prototype = new Layer;      // define sub-class of Layer

  /*****************************************************************************
  * Class   Hand
  * Description Instantiates a new hand object.
  * Parameters  name - layer's name;
  *         boardWidth, boardHeight - the board's width and height
  * Returns   nothing
  */
 Hand.prototype.constructor = Hand;
 function Hand(name, boardX, boardY, boardWidth, boardHeight) {
  this.WIDTH = 41;
  this.HEIGHT = 51;
  this.STEP = 4;
  this.MARGIN = 10;
  this.MARGIN_RIGHT = boardWidth - this.WIDTH - this.MARGIN;
  this.MARGIN_BOTTOM = boardHeight - this.HEIGHT - this.MARGIN;
  this.CENTER_X = boardWidth / 2 - this.WIDTH / 2;
  this.CENTER_Y = boardHeight / 2 - this.HEIGHT / 2;

  this.IMAGES = new Array();
  this.IMAGES[0] = new Image(this.WIDTH, this.HEIGHT);
  this.IMAGES[0].src = 'images/hand0.gif';
  this.IMAGES[1] = new Image(this.WIDTH, this.HEIGHT);
  this.IMAGES[1].src = 'images/hand1.gif';
  this.IMAGES[2] = new Image(this.WIDTH, this.HEIGHT);
  this.IMAGES[2].src = 'images/hand2.gif';
  this.IMAGES[3] = new Image(this.WIDTH, this.HEIGHT);
  this.IMAGES[3].src = 'images/hand3.gif';
  this.IMAGES[4] = new Image(this.WIDTH, this.HEIGHT);
  this.IMAGES[4].src = 'images/hand3.gif';

  this.boardX = boardX;
  this.boardY = boardY;
  this.count = 0;
  this.directionX = 1;
  this.directionY = 1;

  // call the super-class constructor
  Layer.call(this, name, this.boardX, this.boardY, this.WIDTH, this.HEIGHT);
 }

 /******************************************************************************
  * Function    setBoardXY
  * Description Set the board coords for the hand layer.
  * Parameters  boardX, boardY - X,Y base coords
  * Returns   nothing
  */
 Hand.prototype.setBoardXY = function(boardX, boardY) {
  this.boardX = boardX;
  this.boardY = boardY;
 }

 /******************************************************************************
  * Function    setImage
  * Description Set the hand layer image.
  * Parameters  image - the image to set
  * Returns   nothing
  */
 Hand.prototype.setImage = function(image) {
  this.setHTML(
    '<img border="0" src="' + this.IMAGES[image].src +
    '" width="' + this.WIDTH +
    '" height="' + this.HEIGHT +
    '" />'
  );
 }

 /******************************************************************************
  * Function    directionRand
  * Description Randomizes the hand direction.
  * Parameters  none
  * Returns   nothing
  */
 Hand.prototype.directionRand = function() {
  switch (Math.floor(Math.random() * 4)) {
    case 0:     //left
      this.directionLeft();
      break;
    case 1:     //up
      this.directionUp();
      break;
    case 2:     //right
      this.directionRight();
      break;
    default:    //down
      this.directionDown();
  }
 }

 /******************************************************************************
  * Function    directionLeft, directionUp, directionRight, directionDown
  * Description Set the hand movement left, up, right and down, respectively.
  * Parameters  none
  * Returns   nothing
  */
 Hand.prototype.directionLeft = function() {
  this.directionX = -1;
  this.directionY = 1;
 }
 Hand.prototype.directionUp = function() {
  this.directionX = -1;
  this.directionY = -1;
 }
 Hand.prototype.directionRight = function() {
  this.directionX = 1;
  this.directionY = -1;
 }
 Hand.prototype.directionDown = function() {
  this.directionX = 1;
  this.directionY = 1;
 }

 /*****************************************************************************¡
  * Function    move
  * Description Moves the hand layer around the game space.
  * Parameters  none
  * Returns   nothing
  */
 Hand.prototype.move = function() {
  var x = Math.ceil(this.x - this.boardX);
  var y = Math.ceil(this.y - this.boardY);

  // changes the Hand's layer direction if it hits the game space margin
  if (x <= this.MARGIN)
    this.directionX = 1;
  else if (x >= this.MARGIN_RIGHT)
    this.directionX = -1;

  if (y <= this.MARGIN)
    this.directionY = 1;
  else if (y >= this.MARGIN_BOTTOM)
    this.directionY = -1;

  this.moveBy(this.directionX * this.STEP, this.directionY * this.STEP);
 }

 /*****************************************************************************¡
  * Function    moveToCenter
  * Description Moves the hand layer to the center of the game space.
  * Parameters  none
  * Returns   nothing
  */
 Hand.prototype.moveToCenter = function(boardX, boardY) {
  this.moveTo(boardX + this.CENTER_X, boardY + this.CENTER_Y);
 }

 /*  Language  */

 function Lang() {
  var lang_array = ['Now playing: ', 'Bust!!! You lost your turn.', 'Good arrow!','Congratulations, you won!!!', 'Are you sure you want to start a new game?', 'Last arrow should be a double or 50.', 'Darts', 'turn', 'Please, enter the player\'s new name.', 'The game is paused. Press <Enter> to resume.', 'Player 1', 'Player 2', 'No winner after 30 turns. Game is a drawn - could be worst...'];
  this.lang = lang_array;
  this.str = function str(id) {
              return this.lang[id];
            }
 }

 /*  Main Game */

 /* Class   Game
  * Description Instantiates a Game object.
  * Parameters  none
  * Returns   nothing
  */
 function Game() {
  // dart
  this.DART_SHOTMAX = 14;
  this.DART_SHOWMAXANGLE = 10;

  // game speed
  this.SPEED_HAND = 45;         // hand movement
  this.SPEED_DART = 35;         // dart throw movement
  this.SPEED_THROW = this.SPEED_DART * 3; // hand throw movement

  // key codes
  // reference: http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
  this.KEYCODE_UP = 81;   // Q = up
  this.KEYCODE_DOWN = 65;   // A = down
  this.KEYCODE_LEFT = 79;   // O = left
  this.KEYCODE_RIGHT = 80;  // P = right
  this.KEYCODE_THROW = 32;  // Space bar
  this.KEYCODE_NEW = 78;    // (N)ew
  this.KEYCODE_PAUSE = 83;  // (S)top

  // throw types
  this.IS_OUTSIDE = 0;  // outside the board
  this.IS_SINGLE = 1;   // single
  this.IS_DOUBLE = 2;   // double
  this.IS_TREBLE = 3;   // treble
  this.IS_ROUNDM = 4;   // 25
  this.IS_MIDDLE = 5;   // 50
  this.throwType = 0;

  // game timer
  this.oTimer = new Timer();

  // language object (game strings)
  // this.oLang = new Lang('en');
  this.oLang = new Lang();
  
  // score objects for both players
  this.aScores = new Array();
  this.aScores[0] = new Score(0, this.oLang.str(10));
  this.aScores[1] = new Score(1, this.oLang.str(11));

  // board object layer
  this.oBoard = new Board('Board');
  this.oBoard.create();

  // darts object layers array
  this.aDarts = new Array();
  for (var m = 0; m < 2; m++) {
    this.aDarts[m] = new Array();

    for (var n = 0; n < 3; n++) {
      this.aDarts[m][n] = new Dart('Dart' + m + n, m, n, this.oBoard.WIDTH, this.oBoard.HEIGHT);
      this.aDarts[m][n].create();
    }
  }

  // hand object layer
  this.oHand = new Hand('Hand', this.oBoard.x, this.oBoard.y, this.oBoard.WIDTH, this.oBoard.HEIGHT);
  this.oHand.create();

  this.reset();     // reset the game environment
 }

 /*******************************************************************************
  * Function    resize
  * Description Process a window resize event.
  * Parameters  none
  * Returns   nothing
  */
 // TODO: Make sure this works on IE and doesn't affect the performance
 // (see http://mbccs.blogspot.com/2007/11/fixing-window-resize-event-in-ie.html)
 Game.prototype.resize = function() {
  var oldX = this.oBoard.x;
  var oldY = this.oBoard.y;

  this.oBoard.calcXY();

  // after re-calculating all values, move the board layer
  this.oBoard.moveTo(this.oBoard.x, this.oBoard.y);

  // set the new base limits for the hand layer
  this.oHand.setBoardXY(this.oBoard.x, this.oBoard.y);
  this.oHand.moveBy(this.oBoard.x - oldX, this.oBoard.y - oldY);

  // move the darts only the difference from their previous position
  for (var m = 0; m < 2; m++) 
    for (var n = 0; n < 3; n++) 
      this.aDarts[m][n].moveBy(this.oBoard.x - oldX, this.oBoard.y - oldY);
 }

 /*******************************************************************************
  * Function    keyDown
  * Description Processes a key down event.
  * Parameters  none
  * Returns   False (to disable the browser from processing the pressed key)
  */
 Game.prototype.keyDown = function(keyCode) {
  switch (keyCode) {
    case this.KEYCODE_LEFT:   // left
      this.oHand.directionLeft();
      break;
    case this.KEYCODE_UP:   // up
      this.oHand.directionUp();
      break;
    case this.KEYCODE_RIGHT:  // right
      this.oHand.directionRight();
      break;
    case this.KEYCODE_DOWN:   // down
      this.oHand.directionDown();
      break;
    case this.KEYCODE_THROW:  // fire
      this.throwStart();
      break;
    case this.KEYCODE_NEW:    // new game
      this.start();
      break;
    case this.KEYCODE_PAUSE:  // pause game
      this.pause();
  }

  return false;   // KEEP THIS!!
 }

 /*******************************************************************************
  * Function    start
  * Description Start a new game.
  * Parameters  none
  * Returns   nothing
  */
 Game.prototype.start = function() {
  // confirm to start a new game, if another game is already running
  if (!this.oTimer.is_active() || confirm(this.oLang.str(4))) {
    // turn off the light on the current player/dart
    this.aScores[this.playerId].lightLow(this.dartId);

    this.reset();
    this.newTurn();
    this.newDart();
  }
 }

 /*******************************************************************************
  * Function    pause
  * Description Pause a running game.
  * Parameters  none
  * Returns   nothing
  */
 Game.prototype.pause = function() {
  // pause only if a game is running
  if (this.oTimer.is_active()) alert(this.oLang.str(9));
 }

 /*******************************************************************************
  * Function    speed
  * Description Changes the hand speed interval.
  * Parameters  none
  * Returns   nothing
  */
 Game.prototype.speed = function(id) {
  switch (id) {
    case '2':   // fast
      this.SPEED_HAND = 20;
      break;
    case '1':   // medium
      this.SPEED_HAND = 30;
      break;
    default:    // slow
      this.SPEED_HAND = 45;
  }

  this.oTimer.change(this.SPEED_HAND);
 }

 /*******************************************************************************
  * Function    playerChangeName
  * Description Change the player's name.
  * Parameters  player - the player's id
  * Returns   nothing
  */
 Game.prototype.playerChangeName = function(player) {
  var name = prompt(this.oLang.str(8), this.aScores[player].name);

  if (!is_empty(name)) {
    this.aScores[player].name = name;

    // truncate the name if too long
    setText('lblPlayer' + player, (name.length > 15 ? name.substr(0, 15) + '...' : name));
  }
 }

 /*******************************************************************************
  * Function    reset
  * Description Reset the game environment before starting a new game.
  * Parameters  none
  * Returns   nothing
  */
 Game.prototype.reset = function() {
  this.aScores[0].reset();
  this.aScores[1].reset();

  this.throwCount = 0;  // dart throw counter
  this.playerId = 1;    // player id
  this.dartId = 0;    // dart id
 }

 /*******************************************************************************
  * Function    newTurn
  * Description Setup the game space before a player's new turn.
  * Parameters  none
  * Returns   nothing
  */
 Game.prototype.newTurn = function() {
  this.dartId = 0;
  this.playerId = (this.playerId ? 0 : 1);    // change player

  // total score before turn is the current total score
  this.aScores[this.playerId].newTurn();

  for (var m = 0; m < 2; m++)
    for (var n = 0; n < 3; n++)
      this.aDarts[m][n].showByPlayer(this.oBoard.x, this.oBoard.y);
 }

 /*******************************************************************************
  * Function    newDart
  * Description Setup the game space before a player's new dart.
  * Parameters  none
  * Returns   nothing
  */
 Game.prototype.newDart = function() {
  setText('lblFeed', this.oLang.str(0) + this.aScores[this.playerId].name);

  this.aDarts[this.playerId][this.dartId].hide();   // hide the next dart

  this.aScores[this.playerId].lightHigh(this.dartId);
  this.oHand.directionRand(); // randomize the hand direction before a new dart

  // moves the hand layer to the middler (center) of the game space
  this.oHand.moveToCenter(this.oBoard.x, this.oBoard.y);
  this.oHand.setImage(0);

  sleep(500);

  this.oTimer.start('oGame.oHand.move()', this.SPEED_HAND);
 }

 /*******************************************************************************
  * Function    throwStart
  * Description The throw animation.
  * Parameters  none
  * Returns   nothing
  */
 Game.prototype.throwStart = function (){
  this.oTimer.start('oGame.throwHand()', this.SPEED_THROW);
 }

 /*******************************************************************************
  * Function    throwHand
  * Description The throw hand animation.
  * Parameters  none
  * Returns   nothing
  */
 Game.prototype.throwHand = function() {
  this.oHand.setImage(++this.oHand.count);

  if (this.oHand.count == this.oHand.IMAGES.length - 1) {
    this.oHand.count = 0;

    // set the dart layer
    this.aDarts[this.playerId][this.dartId].moveTo(this.oHand.x, this.oHand.y);

    // start the dart throw animation
    this.aDarts[this.playerId][this.dartId].setImage(0);
    this.aDarts[this.playerId][this.dartId].show();
    this.oTimer.start('oGame.throwDart()', this.SPEED_DART);
  }
 }

 /*******************************************************************************
  * Function    throwDart
  * Description The throw dart animation.
  * Parameters  none
  * Returns   nothing
  */
 Game.prototype.throwDart = function() {
  if (this.throwCount++ < this.DART_SHOTMAX) {    // shows the dart throw
    if (this.throwCount < this.DART_SHOWMAXANGLE)
      this.aDarts[this.playerId][this.dartId].moveBy(0, -6);
    else if (this.throwCount == this.DART_SHOWMAXANGLE) 
      this.aDarts[this.playerId][this.dartId].setImage(1);
    else
      this.aDarts[this.playerId][this.dartId].moveBy(0, +3);
  } else {
    this.throwCount = 0;
    this.oHand.setImage(this.oHand.count);
    this.aScores[this.playerId].lightLow(this.dartId);

    if (this.rules501()) this.newDart();
  }
 }

 /*******************************************************************************
  * Function    rules501
  * Description Implements the Darts 501 rules after a throw.
  * Parameters  name - dart (layer) to score
  * Returns   True if the game still runs; false if the game is over.
  */
 Game.prototype.rules501 = function() {
  var ret = true;

  var score = this.pieScore(
    this.aDarts[this.playerId][this.dartId].realX() - this.oBoard.x,
    this.aDarts[this.playerId][this.dartId].realY() - this.oBoard.y
  );

  this.aScores[this.playerId].setDart(this.dartId, score);

  if (this.aScores[this.playerId].total == 0 && (this.throwType == this.IS_DOUBLE || this.throwType == this.IS_MIDDLE)) {
  // game ends (player reach 0 and finished with either a double or in the bull's eye)
    ret = this.finish(this.playerId);   // game is finished (current player wins)
  } else {
  // game is not yet over
    if (this.aScores[this.playerId].total < 2) {  // bust, so apply the rules
      this.aScores[this.playerId].setTotal(this.aScores[this.playerId].total_prev);
      alert(this.aScores[this.playerId].name + ': ' + oLang.str(1));
      this.dartId = 2;    // force a change of player below
    } else if (this.playerId == 1 && this.aScores[1].turns >= 20 && this.dartId == 2) { // if both players have reached 20+ turns
      if (this.aScores[0].total < this.aScores[1].total) { // player 1 wins if score's lower
        ret = this.finish(0);
      } else if (this.aScores[1].total < this.aScores[0].total) { // player 2 wins if score's lower
        ret = this.finish(1);
      } else if (this.aScores[1].turns == 30) {
        // if both players have reached 20+10 turns an their scores are the same we have a drawn
        ret = this.finish();
      }
    }

    // check if the player needs to be changed
    if (ret && this.dartId++ == 2) this.newTurn();
  }

  return ret;
 }

 /*******************************************************************************
  * Function    finish
  * Description Terminates the game and sets the winner (or a drawn).
  * Parameters  playerId - the winners id; if null, the game is a drawn.
  * Returns   false (by design).
  */
 Game.prototype.finish = function(playerId) {
  this.oTimer.stop();

  alert(setText('lblFeed',
    (playerId == null ? this.oLang.str(12) : this.aScores[playerId].name + ': ' + this.oLang.str(3))
  ));

  return false;
 }

 /*******************************************************************************
  * Function    pieScore
  * Description Gets the score from the dart throw.
  * Parameters  x, y - the coords of the point where the dart hit the target
  * Returns   An integer with the score.
  */
 Game.prototype.pieScore = function(x, y) {
  var quad;   // all calculations are reduced to the 1st quadrant
  var newx;   // the new (X,Y) values after the projection
  var newy;   // on the board's 1st quadrant

  var aScore = new Array(
    new Array( 6, 13,  4, 18,  1, 20),
    new Array(20,  5, 12,  9, 14, 11),
    new Array(11,  8, 16,  7, 19,  3),
    new Array( 3, 17,  2, 15, 10,  6)
  );

  if (x < this.oBoard.CENTER_X) {   // quad 2 or 3 ??
    if (y < this.oBoard.CENTER_Y) { // quad 2
      quad = 2;
      newx = this.oBoard.CENTER_X - y;
      newy = this.oBoard.CENTER_Y - x;
    } else {          // quad 3
      quad = 3;
      newx = this.oBoard.CENTER_X - x;
      newy = this.oBoard.CENTER_Y - y;
    }
  } else {            // quad 1 or 4 ??
    if (y < this.oBoard.CENTER_Y) { // quad 1
      quad = 1;
      newx = x - this.oBoard.CENTER_X;
      newy = this.oBoard.CENTER_Y - y;
    } else {          // quad 4
      quad = 4;
      newx = y - this.oBoard.CENTER_Y;
      newy = x - this.oBoard.CENTER_X;
    }
  }

  // An angle cosine should be calculated with cos @=(a/h), where:
  // (a=triangle's base) and (h=hypotenuse). Because we want the angle's
  // value, we calculate the arccosine (which is the angle's from which the
  // cosine is the value).
  var hypo = hypotenuse(newx, newy);  // Pythagoras's theorem hypotenuse
  var angle = Math.acos(newx / hypo);
  var pie = this.getPie(angle);

  return this.realScore(hypo, aScore[quad - 1][pie]);
 }

 /*******************************************************************************
  * Function    getPie
  * Description Gets the pie where the darts hits the board.
  * Parameters  none
  * Returns   The pie's number (only on the 1st quadrant).
  */
 Game.prototype.getPie = function(angle) {
  var aRadians = new Array(0.157079633, 0.471238898, 0.785398163, 1.099557429, 1.413616694);

  for (var n = 0; n < 5 && (angle > aRadians[n]); n++);

  return n;
 }

 /*******************************************************************************
  * Function    realScore
  * Description Returns the real score because every pie is divided by different circles.
  * Parameters  The angle's hypotenuse
  * Returns   An integer with the real score.
  */
 Game.prototype.realScore = function(hypo, score) {
  var real;
  var aCircle = new Array(5, 11, 67, 75, 131, 140);

  if (hypo < aCircle[0]) {
    real = 50;
    this.throwType = this.IS_MIDDLE;
  } else if (hypo < aCircle[1]) {
    real = 25;
    this.throwType = this.IS_ROUNDM;
  } else if (hypo > aCircle[2] && hypo < aCircle[3]) {
    real = score * 3;
    this.throwType = this.IS_TREBLE;
  } else if (hypo > aCircle[4] && hypo < aCircle[5]) {
    real = score * 2;
    this.throwType = this.IS_DOUBLE;
  } else if (hypo > aCircle[5]) {
    real = 0;
    this.throwType = this.IS_OUTSIDE;
  } else {
    real = score;
    this.throwType = this.IS_SINGLE;
  }

   return real;
 }

 /*******************************************************************************
  * Function    test
  * Description Implements some unit tests - this is very basic and needs to be improved.
  * Parameters  none
  * Returns   nothing
  */
 Game.prototype.test = function() {
  this.debug = true;
  var testId = 0;

  setText('lblFeed', 'The Darts Game - Tests start.');

  setText('lblFeed', 'Test ' + ++testId + ': Darts highlight.');
  for (m = 0; m < 2; m++)
    for (n = 0; n < 3; n++) {
      this.aScores[m].lightHigh(n);
      alert('Hightlight dart ' + (n + 1) + ' for Player ' + (m + 1) + '.');
      this.aScores[m].lightLow(n);
    }

  setText('lblFeed', 'Test ' + ++testId + ': Hand layer.');
  alert('Show Hand (on center).');
  this.oHand.moveToCenter(this.oBoard.x, this.oBoard.y);
  this.oHand.setImage(0);

  setText('lblFeed', 'Test ' + ++testId + ': Darts layers.');
  for (var m = 0; m < 2; m++) 
    for (var n = 0; n < 3; n++) {
      alert('Show Dart ' + (n + 1) + ' for Player ' + (m + 1) + '.');
      this.aDarts[m][n].showByPlayer(this.oBoard.x, this.oBoard.y);
    }

 // setText('lblFeed', 'Test ' + ++testId + ': Throw dart.');
 // alert('Hand throw dart.');
 // this.throwStart();
 // this.oTimer.stop();

  setText('lblFeed', 'The Darts Game - Tests end.');
 }

 /* Event*/

 // game object
 var oGame;

 // game events
 Event.add(window, 'load', function() {
  oGame = new Game();
 });

 Event.add(window, 'resize', function() {
  oGame.resize();
 });

 Event.add(document, 'keydown', function(key) {
  return oGame.keyDown(isIE ? event.keyCode : key.which);
 });