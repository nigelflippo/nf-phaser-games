var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update});

function preload() {
  game.load.image('space', 'assets/space.png');
  game.load.image('sprite', 'assets/sprite1.png');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('enemy', 'assets/enemy1.png')
  game.load.spritesheet('explosion', 'assets/explode-sheet.png', 50, 50);
};

var bullet;
var bullets;
var bulletTime = 0;
var ship;
var enemies;
var explosion;
var explosions;

var score = 0;
var scoreText;
var health = 100;
var healthText;

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
  ship.scale.setTo(0.75, 0.75)
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
  enemies.setAll('scale.x', 1.75);
  enemies.setAll('scale.y', 1.75);
  enemies.setAll('outOfBoundsKill', true);
  enemies.setAll('checkWorldBounds', true);
  //enemies.setAll('angle', 180);
  launchEnemy();
  //explosion pool
  explosions = game.add.group();
  explosions.enableBody = true;
  explosions.physicsBodyType = Phaser.Physics.ARCADE;
  explosions.createMultiple(30, 'explosion');
  explosions.setAll('anchor.x', 0.5);
  explosions.setAll('anchor.y', 0.5);
  explosions.setAll('scale.x', 0.5);
  explosions.setAll('scale.y', 0.5);
  explosions.forEach(function(explosion) {
    explosion.animations.add('explosion');
  });
  //input assignment
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  //HUD
  scoreText = game.add.text(16, 64, 'Score: 0', { fontSize: '32px', fill: '#ffffff'});
  healthText = game.add.text(16, 16, 'Health: 100', {fontSize: '32px', fill: '#ffffff'});
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
  //check for collisions
  game.physics.arcade.overlap(ship, enemies, shipCollision, null, this);
  game.physics.arcade.overlap(enemies, bullets, destroyEnemy, null, this);
};
function render() {
  // for (var i = 0; i < enemies.length; i++) {
  //   game.debug.body(enemies.children[i]);
  // }
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
      bulletTime = game.time.now + 100;
    }
  }
};
////create random number function for testing

//launch enemy function
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
  healthText.text = 'Health: ' + health;
  if (health === 0) {
    explosion.body.velocity.y = ship.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    ship.kill();
    game.add.text(300, 400, 'GAME OVER', {fontSize: '132px', fill: '#ffffff'});
  }
};
//destroy enemy number one function
function destroyEnemy(enemy, bullet) {
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
