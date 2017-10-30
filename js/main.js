var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Shmup The Ante', { preload: preload, create: create, update: update});

function preload() {
  game.load.image('space', 'assets/space.png');
  game.load.image('sprite', 'assets/sprite1.png');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('bullet2', 'assets/bullet2.png');
  game.load.image('enemy1', 'assets/enemy1.png');
  game.load.image('enemy2', 'assets/enemy2.png');
  game.load.spritesheet('explosion', 'assets/explode-sheet.png', 50, 50);
};

var bullet;
var bullets;
var bulletTime = 0;
var ship;


var enemiesOne;
var enemiesTwo;

var explosion;
var explosions;

var score = 0;
var scoreText;
var health = 100;
var healthText;

var gameOver;

var cursors;
var fireButton;

var acceleration = 1000;
var drag = 400;
var maxVelocity = 500;


function create() {
  //fullscreen mode
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.aspectRatio;
  game.input.onDown.add(goFull, this);
  //start physics engine
  game.physics.startSystem(Phaser.Physics.ARCADE);
  background = game.add.tileSprite(0, 0, 800, 800, 'space');

  //create bullet group
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet');
  bullets.setAll('anchor.x', 0.46);
  bullets.setAll('anchor.y', 1);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);
  //add ship sprite
  ship = game.add.sprite(400, 600, 'sprite');
  ship.anchor.setTo(0.5, 0.5);
  ship.scale.setTo(0.75, 0.75)
  game.physics.enable(ship, Phaser.Physics.ARCADE);
  ship.body.maxVelocity.setTo(maxVelocity, maxVelocity);
  ship.body.drag.setTo(drag, drag)
  ship.body.collideWorldBounds = true;
  ship.kill();

  //add enemy group
  enemiesOne =  game.add.group();
  enemiesOne.enableBody = true;
  enemiesOne.physicsBodyType = Phaser.Physics.ARCADE;
  enemiesOne.createMultiple(5, 'enemy1');
  enemiesOne.setAll('anchor.x', 0.5);
  enemiesOne.setAll('anchor.y', 0.5);
  enemiesOne.setAll('scale.x', 1.25);
  enemiesOne.setAll('scale.y', 1.25);
  enemiesOne.setAll('outOfBoundsKill', true);
  enemiesOne.setAll('checkWorldBounds', true);
  launchEnemyOne();
  //add second enemy group
  enemiesTwo =  game.add.group();
  enemiesTwo.enableBody = true;
  enemiesTwo.physicsBodyType = Phaser.Physics.ARCADE;
  enemiesTwo.createMultiple(5, 'enemy2');
  enemiesTwo.setAll('anchor.x', 0.5);
  enemiesTwo.setAll('anchor.y', 0.5);
  enemiesTwo.setAll('scale.x', 1.75);
  enemiesTwo.setAll('scale.y', 1.75);
  enemiesTwo.setAll('outOfBoundsKill', true);
  enemiesTwo.setAll('checkWorldBounds', true);
  launchEnemyTwo();

  //explosion pool
  explosions = game.add.group();
  explosions.enableBody = true;
  explosions.physicsBodyType = Phaser.Physics.ARCADE;
  explosions.createMultiple(5, 'explosion');
  explosions.setAll('anchor.x', 0.5);
  explosions.setAll('anchor.y', 0.5);
  explosions.setAll('scale.x', 1.5);
  explosions.setAll('scale.y', 1.5);
  explosions.forEach(function(explosion) {
    explosion.animations.add('explosion');
  });

  //input assignment
  upButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
  downButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
  leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
  rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  restartButton = game.input.keyboard.addKey(Phaser.Keyboard.R);
  startButton = game.input.keyboard.addKey(Phaser.Keyboard.E);
  //HUD
  scoreText = game.add.text(16, 16, 'Score: 0', {font: '32px VT323', fill: '#ffffff'});
  scoreText.visible = false;
  healthText = game.add.text(game.width - 160, 16, 'Shields: 100', {font: '32px VT323', fill: '#ffffff'});
  healthText.visible = false;
  topScoreText = game.add.text(16, 48, 'Top Score: ' + localStorage.getItem('top-score'), {font: '32px VT323', fill: '#ffffff'});
  topScoreText.visible = false;
  bannerText = game.add.text(190, 200, 'Sh\'mup The Ante', {font: '72px VT323', fill: '#fff'});
  beginText = game.add.text(300, 270, 'Press E to begin', {font: '32px VT323', fill: '#fff'});
  controlsText = game.add.text(265, 380, 'Movement: WASD | Shoot: SPACE', {font: '24px VT323', fill: '#fff'})
};
function update() {
  //create scrolling backdrop
  background.tilePosition.y += 2;
  //reset player
  ship.body.acceleration.x = 0;
  ship.body.acceleration.y = 0;
  //controls
  if (leftButton.isDown) {
    ship.body.acceleration.x = -acceleration;
  } else if (rightButton.isDown) {
    ship.body.acceleration.x = acceleration;
  }
  if (upButton.isDown) {
    ship.body.acceleration.y = -acceleration;
  }
  if (downButton.isDown) {
    ship.body.acceleration.y = acceleration;
  }
  //fire bullets
  if (fireButton.isDown) {
    fireBullet();
  };
  //create restart
  if (restartButton.isDown) {
    restart();
  };
  //start
  if (startButton.isDown) {
    startGame();
  }
  //check for collisions
  game.physics.arcade.overlap(ship, enemiesOne, shipCollision, null, this);
  game.physics.arcade.overlap(enemiesOne, bullets, destroyEnemyOne, null, this);

  game.physics.arcade.overlap(ship, enemiesTwo, shipCollision, null, this);
  game.physics.arcade.overlap(enemiesTwo, bullets, destroyEnemyTwo, null, this);
};
function render() {
  for (var i = 0; i < enemiesOne.length; i++) {
    game.debug.body(enemiesOne.children[i]);
  }
  for (var i = 0; i < enemiesTwo.length; i++) {
    game.debug.body(enemiesTwo.children[i]);
  }
};
//fullscreen
function goFull() {
  if (game.scale.isFullScreen) {
    game.scale.stopFullScreen();
  } else {
    game.scale.startFullScreen(false);
  }
};
//fire bullets at intervals
function fireBullet() {
  if (game.time.now > bulletTime) {
    bullet = bullets.getFirstExists(false);
    if (bullet) {
      bullet.reset(ship.x, ship.y);
      bullet.body.velocity.y = -500;
      bulletTime = game.time.now + 125;
    }
  }
};
//launch enemy function
function launchEnemyOne() {
  let enemy = enemiesOne.getFirstExists(false);
  if (enemy) {
    enemy.reset(game.rnd.integerInRange(0, game.width), -20);
    enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
    enemy.body.velocity.y = 500;
  }
  game.time.events.add(game.rnd.integerInRange(300, 3000), launchEnemyOne);
};
//launch second enemy
function launchEnemyTwo() {
  let enemy = enemiesTwo.getFirstExists(false);
  if (enemy) {
    enemy.reset(game.rnd.integerInRange(0, game.width), -20);
    enemy.body.velocity.x = game.rnd.integerInRange(-200, 200);
    enemy.body.velocity.y = 300;
  }
  game.time.events.add(game.rnd.integerInRange(300, 5000), launchEnemyTwo);
};
//ship collision function
function shipCollision(ship, enemy) {
  var explosion = explosions.getFirstExists(false);
  explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.y + enemy.body.halfHeight);
  explosion.body.velocity.y = enemy.body.velocity.y;
  explosion.alpha = 0.7;
  explosion.play('explosion', 30, false, true);
  enemy.kill();
  //update health
  health -= 20;
  healthText.text = 'Shields: ' + health;
  if (health <= 0) {
    explosion.body.velocity.y = ship.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    ship.kill();
    gameOver = game.add.text(275, 240, 'GAME OVER', {font: '64px VT323', fill: '#ffffff'});
    restartText = game.add.text(280, 300, 'Press R to restart', {font: '32px VT323', fill: '#ffffff'});
  }
};
//destroy enemy number one function
function destroyEnemyOne(enemy, bullet) {
  var explosion = explosions.getFirstExists(false);
  explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.y + enemy.body.halfHeight);
  explosion.body.velocity.y = enemy.body.velocity.y;
  explosion.alpha = 0.7;
  explosion.play('explosion', 30, false, true);
  enemy.kill();
  bullet.kill();
  //update score
  score += 100;
  scoreText.text = 'Score: ' + score;
};
function destroyEnemyTwo(enemy, bullet) {
  var explosion = explosions.getFirstExists(false);
  explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.y + enemy.body.halfHeight);
  explosion.body.velocity.y = enemy.body.velocity.y;
  explosion.alpha = 0.7;
  explosion.play('explosion', 30, false, true);
  enemy.kill();
  bullet.kill();
  //update score
  score += 300;
  scoreText.text = 'Score: ' + score;
};
//start game with E
function startGame() {
  ship.reset(game.width / 2, 700)
  ship.revive();
  healthText.visible = true;
  topScoreText.visible = true;
  scoreText.visible = true;
  beginText.visible = false;
  bannerText.visible = false;
  controlsText.visible = false;
};
//restart game with R after death
function restart() {
  if (health === 0) {
    if (score > localStorage.getItem('top-score')) {
      localStorage.setItem('top-score', score);
    }
    health = 100;
    healthText.text = 'Shields: ' + health;
    score = 0;
    scoreText.text = 'Score: ' + score;
    let topScore = localStorage.getItem('top-score');
    topScoreText.text = 'Top Score: ' + topScore;

    ship.reset(game.width / 2, 700)
    ship.revive();
    gameOver.visible = false;
    restartText.visible = false;
  }
};
