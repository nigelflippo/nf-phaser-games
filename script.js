var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update});

function preload() {
  game.load.image('space', 'assets/space.png');
  game.load.image('sprite', 'assets/sprite1.png');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('enemy', 'assets/enemy1.png')
};

var bullet;
var bullets;
var bulletTime = 0;
var ship;
var enemies;

var cursors;
var fireButton;

var acceleration = 1000;
var drag = 500;
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
  //create power-up group

  //add ship sprite
  ship = game.add.sprite(400, 700, 'sprite');
  ship.anchor.setTo(0.5, 0.5);
  game.physics.enable(ship, Phaser.Physics.ARCADE);
  ship.body.maxVelocity.setTo(maxVelocity, maxVelocity);
  ship.body.drag.setTo(drag, drag)
  ship.body.collideWorldBounds = true;
  //add enemy
  enemies =  game.add.group();
  enemies.enableBody = true;
  enemies.physicsBodyType = Phaser.Physics.ARCADE;
  enemies.createMultiple(5, 'enemy');
  enemies.setAll('anchor.x', 0.5);
  enemies.setAll('anchor.y', 0.5);
  enemies.setAll('scale.x', 0.5);
  enemies.setAll('scale.y', 0.5);
  enemies.setAll('outOfBoundsKill', true);
  enemies.setAll('checkWorldBounds', true);
  //enemies.setAll('angle', 180);
  launchEnemy();
  //input assignment
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};
function update() {
  //create scrolling backdrop
  background.tilePosition.y += 3;
  //reset player
  ship.body.acceleration.x = 0;
  ship.body.acceleration.y = 0;
  //controls
  if (cursors.left.isDown) {
    ship.body.acceleration.x = -acceleration;
  } else if (cursors.right.isDown) {
    ship.body.acceleration.x = acceleration;
  }
  if (cursors.up.isDown) {
    ship.body.acceleration.y = -acceleration;
  }
  if (cursors.down.isDown) {
    ship.body.acceleration.y = acceleration;
  }
  //fire bullets
  if (fireButton.isDown) {
    fireBullet();
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
      bullet.body.velocity.y = -600;
      bulletTime = game.time.now + 50;
    }
  }
};
//launch enemy function
////create random number function for testing
function launchEnemy() {
  var enemy = enemies.getFirstExists(false);
  if (enemy) {
    enemy.reset(game.rnd.integerInRange(0, game.width), -20);
    enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
    enemy.body.velocity.y = 300;
    enemy.body.drag.x = 100;
  }
  game.time.events.add(game.rnd.integerInRange(300, 3000), launchEnemy);
};
// function launchPowerup() {
//
// }
