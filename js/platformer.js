var mainState = {
  preload: function() {
    game.load.image('player', 'assets/player.png');
    game.load.image('lava', 'assets/lava.png');
    game.load.image('wall', 'assets/wall.png');
    game.load.image('coin', 'assets/coin.png');
    game.load.image('nigel', 'assets/nigel.png');
    game.load.image('win', 'assets/win.png')
    game.load.spritesheet('nigel-sprite', 'assets/nigel-sheet.png', 32, 32)
  },

  create: function() {
    game.stage.backgroundColor = '#757575';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.enableBody = true;

    this.cursor = game.input.keyboard.createCursorKeys();
    this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.player = game.add.sprite(20, 500, 'nigel-sprite');
    this.player.scale.setTo(1, 1)
    this.player.body.gravity.y = 600;

    this.walls = game.add.group();
    this.coins = game.add.group();
    this.enemies = game.add.group();
    this.wins = game.add.group();
    position = 32;

    this.game.add.text(this.game.width - 70, 16, 'FINISH', {font: '20px VT323'});
    this.game.add.text(this.game.width / 2 - 115, 16, 'CONTROLS: ARROWS | SPACE', {font: '20px VT323'});
    this.game.add.text(20, 520, 'START', {font: '20px VT323'});


    var level = [
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      'x                                                3',
      'x                                                3',
      'x                                                3',
      'x                                                3',
      'x                        0 0                  xxxx',
      'x   0                                 xxxxx      x',
      'x                                                x',
      'x             !   xxxxx       xxxxx              x',
      'x             !                                  x',
      'x!      xxxxx !                                  x',
      'x!            !                                  x',
      'x!                                               x',
      'xxxxxx               0            0  0           x',
      'x                                                x',
      'x                                                x',
      'x               xxx!!!!!xxx  xxxx!!!!!!xxxx      x',
      'x   xxxx                                         x',
      'x                                                x',
      'x          0                                     x',
      'x                                             xxxx',
      'x        xxxxx                             0     x',
      'x                   xxxxxxxxxxxxxxxxxx           x',
      'x                   !!!!!!!!!!!!!!!!!!           x',
      'x                                         xxx    x',
      'x                                                x',
      'x                                                x',
      'x                                                x',
      'x                            0                xxxx',
      'x                    0                           x',
      'x                                       xxxx     x',
      'x           0          xxxx     xxxx             x',
      'x               xxxxx                            x',
      'x          xxx                                   x',
      'x   xxxx                                         x',
      'x                                                x',
      'xxxxxxx!!!!!!!!xxxxxxxxxx!!!!!!!!!xxxxxxxx!!!!!xxx'
    ];

    for (var i = 0; i < level.length; i++) {
      for (var j = 0; j < level[i].length; j++) {
        if (level[i][j] === 'x') {
          var wall = game.add.sprite(0 + 16 * j, 0 + 16 * i, 'wall');
          this.walls.add(wall);
          wall.body.immovable = true;
        } else if (level[i][j] === '!') {
          var lava = game.add.sprite(0 + 16 * j, 0 + 16 * i, 'lava');
          this.enemies.add(lava);
          lava.body.immovable = true;
        } else if (level[i][j] === '0') {
          var coin = game.add.sprite(0 + 16 * j, 0 + 16 * i, 'coin');
          this.coins.add(coin);
          coin.body.immovable = true;
        } else if (level[i][j] === '3') {
          var win = game.add.sprite(0 + 16 * j, 0 + 16 * i, 'win');
          this.wins.add(win);
          win.body.immovable = true;
        }
      }
    }
  },

  update: function() {

    game.physics.arcade.collide(this.player, this.walls);
    game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.restart, null, this);
    game.physics.arcade.overlap(this.player, this.wins, this.restart, null, this);

    if (this.cursor.left.isDown) {
        this.player.body.velocity.x = -200;
        this.player.frame = 1;
        if (this.jumpButton.isDown && this.cursor.left.isDown) {
          this.player.frame = 3;
        } else if (this.player.body.touching.down) {
          this.player.frame = 1;
        }
      } else if (this.cursor.right.isDown) {
        this.player.body.velocity.x = 200;
        this.player.frame = 0;
        if (this.jumpButton.isDown && this.cursor.right.isDown) {
          this.player.frame = 2;
        } else if (this.player.body.touching.down) {
          this.player.frame = 0;
        }
      } else {
        this.player.body.velocity.x = 0;
      }
    if (this.jumpButton.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -300;
      this.player.frame = 2;
    } else if (this.player.body.touching.down) {
      this.player.frame = 0;
      if (this.cursor.left.isDown) {
        this.player.frame = 1;
      }
    }
  },

  restart: function() {
    game.state.start('main');
  },

  takeCoin: function(player, coin) {
    coin.kill();
    this.score = game.add.sprite(position, 32, 'coin');
    position += 20;
  }
};

var game = new Phaser.Game(800, 592, Phaser.AUTO);
game.state.add('main', mainState);
game.state.start('main');
