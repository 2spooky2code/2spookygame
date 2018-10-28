import 'phaser';

// phaser config
var config = {
    type: Phaser.AUTO,
    // parent: 'phaser-example',
    title: "2SPOOKY2CODE",
    url: "http://www.2spooky2code.com",
    width: 1000,
    height: 500,
    input: {
        keyboard: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },	
    scene: {
        preload: preload,
        update: update,
        create: create,
        // render: render 
    }
};
var cursors;
var platforms;
var player;
var candy;
var redCandy;
var scoreText;
var bats;


// Phaser game var
var game = new Phaser.Game(config);
var gameOver = false;
var score = 0;

function preload ()
{
    this.load.image('bgWerewolf', './assets/img/backgrounds/bgWerewolf.png');
    this.load.image('rip', './assets/img/backgrounds/rip.png');
    this.load.image('ground', './assets/img/backgrounds/ground.png');
    this.load.image('blueCandy', './assets/img/objects/blueCandy.png');
    this.load.image('redCandy', './assets/img/objects/redCandy.png');
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
    const bgWerewolf = this.add.sprite(0, 100, 'bgWerewolf').setOrigin(0, 0).setScale(.25);
    // bgWerewolf.scale.x = 10
    // this.add.tileSprite(-100, -230, 1920, 1920, 'bgWerewolf');

    platforms = this.physics.add.staticGroup();
    platforms.create(200, 400, 'ground').setScale(2).refreshBody();
    platforms.create(1450, 400, 'ground').setScale(2).refreshBody();
    platforms.create(600,300, 'ground');
    platforms.create(300,100, 'ground');
    platforms.create(50,200, 'ground');

    // player
    player = this.physics.add.sprite(200, 200, 'clara').setScale(.1);

    // stars
    candy = this.physics.add.group({
        key: 'blueCandy',
        repeat: 4,
        setXY: { x: 12, y: 0, stepX: 350 }
    });

    redCandy = this.physics.add.sprite(200,20, 'redCandy').setScale(.1);

    // Score
    scoreText = this.add.text(16, 16, `score: ${score}`, { fontSize: '32px', fill: '#fff' });
    
    /* Game object physics */

    // Player 
    player.setBounce(0.2);
    // player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // candy 
    this.physics.add.collider(candy, platforms);
    this.physics.add.overlap(player, candy, collectCandy, null, this);
    
    this.physics.add.collider(redCandy, platforms);
    this.physics.add.overlap(player, redCandy, collectCandy, null, this);
    
    candy.children.iterate(function (child) {
        
        child.setScale(.03);
        
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
    bat.setVelocity(Phaser.Math.Between(100, 200), 20);
    var bat2 = bats.create(100, 32, 'bat').setScale(.1);
    bat2.setBounce(1);
    bat2.setCollideWorldBounds(true);
    bat2.setVelocity(Phaser.Math.Between(100, 200), 20);
    bat2.allowGravity = false;
    
    candy.children.iterate(function (child) {

        child.enableBody(true, child.x, 0, true, true);

    });

    bat.enableUpdate = true;
    // bat.onUpdate.add(onUpdate, this);

    this.cameras.main.startFollow(player);
    var bgMusic = this.sound.add('BleedingMoon');
    bgMusic.play();
}

function update ()
{
    if(gameOver){
        // this.add.tileSprite(-100, -230, 1920, 1920, 'rip');
        // this.add.sprite(0, 0, 'rip').setOrigin(0, 0)
        const bgWerewolf = this.add.sprite(-750, 0, 'rip').setOrigin(0, 0).setScale(.4);

        this.physics.pause();

        return;
    };

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
// function render () 
// {
//     game.debug.cameraInfo(game.camera, 32, 32);
//     game.debug.spriteCoords(player, 32, 500);

// }

const collectCandy = (player, candy) =>
{
    candy.disableBody(true, true);    
    score += 10;
    scoreText.setText('Score: ' + score);
}
const hitPlayer = (player, bat) => {

    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}
function onUpdate(anim, frame) {

    text.text = 'Frame ' + frame.index;

}