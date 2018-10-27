import 'phaser';

// phaser config
var config = {
    type: Phaser.AUTO,
    // parent: 'phaser-example',
    title: "2SPOOKY2CODE",
    url: "http://www.2spooky2code.com",
    width: 600,
    height: 400,
    input: {
        keyboard: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },	
    scene: {
        preload: preload,
        update: update,
        create: create,
        render: render 
    }
};
var cursors;
var platforms;
var player;
var candy;
var scoreText;
var bats;


// Phaser game var
var game = new Phaser.Game(config);

var score = 0;

function preload ()
{
    this.load.image('bgWerewolf', './assets/img/backgrounds/bgWerewolf.png');
    this.load.image('ground', './assets/img/backgrounds/ground.png');
    this.load.image('blueCandy', './assets/img/objects/blueCandy.png');
    this.load.spritesheet('clara', 
        './assets/img/characters/clara.png',
        { frameWidth: 438, frameHeight: 620 }
    );
    this.load.spritesheet('bat', 
        './assets/img/characters/bat.png',
        { frameWidth: 860, frameHeight: 327 }
    );

    this.load.audio('BleedingMoon', './assets/audio/BleedingMoon.mp3');

}

function create ()
{
    // Built-in Keyboard manager
    this.cameras.main.setBounds(0, 0, 720 * 2, 176);
    cursors = this.input.keyboard.createCursorKeys();    
    // this.cameras.main.roundPixels = true;

    /* Creating game objects */
    
    // background
    const bgWerewolf = this.add.sprite(0, 0, 'bgWerewolf').setOrigin(0, 0);
    // bgWerewolf.scale.x = 10
    // this.add.tileSprite(-100, -230, 1920, 1920, 'bgWerewolf');

    platforms = this.physics.add.staticGroup();
    platforms.create(200, 400, 'ground').setScale(2).refreshBody();
    platforms.create(600,300, 'ground');

    // player
    player = this.physics.add.sprite(200, 200, 'clara').setScale(.1);

    // stars
    candy = this.physics.add.group({
        key: 'blueCandy',
        repeat: 4,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    // Score
    scoreText = this.add.text(16, 16, `score: ${score}`, { fontSize: '32px', fill: '#fff' });
    
    /* Game object physics */

    // Player 
    player.setBounce(0.2);
    // player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // Stars 
    this.physics.add.collider(candy, platforms);
    this.physics.add.overlap(player, candy, collectCandy, null, this);
    
    
    candy.children.iterate(function (child) {
        
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)).setScale(.03);
        
    });

    bats = this.physics.add.group();

    this.physics.add.collider(bats, platforms);

    this.physics.add.collider(player, bats, hitPlayer, null, this);

    // Character animation
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('clara', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'clara', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('clara', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });


    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bat = bats.create(x, 16, 'bat').setScale(.1);
    bat.setBounce(1);
    bat.setCollideWorldBounds(true);
    bat.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bat.allowGravity = false;
    
    candy.children.iterate(function (child) {

        child.enableBody(true, child.x, 0, true, true);

    });
    
    this.cameras.main.startFollow(player);
    var bgMusic = this.sound.add('BleedingMoon');
    bgMusic.play();
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
    
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
    
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
    
        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}
function render () 
{
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}

const collectCandy = (player, candy) =>
{
    candy.disableBody(true, true);    
    score += 10;
    scoreText.setText('Score: ' + score);
}
const hitPlayer = (player, bat) => {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}