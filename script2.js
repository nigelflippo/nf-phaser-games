var game  = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.image('space', 'assets/space.png');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('ship', 'assets/sprite2.png');
}

var sprite;
var cursors;
var bullet;
var bullets;
var weapon;
var bulletTime = 0;

function create() {
  game.renderer.clearBeforeRender = false;
  game.renderer.roundPixels = true;

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.add.tileSprite(0, 0, game.width, game.height, 'space');

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.phsyicsBodyType = Phaser.Physics.ARCADE;

  bullets.createMultiple(40, 'bullet');
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 0.5);

  sprite = game.add.sprite(300, 300, 'ship');
  sprite.anchor.set(0.5);

  game.physics.enable(sprite, Phaser.Physics.ARCADE);
  sprite.body.drag.set(100);
  sprite.body.maxVelocity.set(200);

  cursors = game.input.keyboard.createCursorKeys();
  game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
}
function update() {
  sprite.body.velocity.x = 0;
  sprite.body.velocity.y = 0;
  sprite.body.angularVelocity = 0;

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    sprite.body.angularVelocity = -200;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    sprite.body.angularVelocity = 200;
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    game.physics.arcade.velocityFromAngle(sprite.angle, 300, sprite.body.velocity);
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    fireBullet();
  }
}
function fireBullet() {
  if (game.time.now > bulletTime) {
    bullet = bullets.getFirstExists(false);
    if (bullet) {
      bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
      bullet.lifespan = 2000;
      bullet.rotation = sprite.rotation;
      game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
      bulletTime = game.time.now + 50;
    }
  }
}
function render() {

}
