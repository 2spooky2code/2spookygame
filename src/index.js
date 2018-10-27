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
            gravity: { y: 300 },
            debug: false
        }
    },	
    scene: {
        preload: preload,
        update: update,
        create: create
    }
};
var cursors;
var platforms;
var player;
var stars;
var scoreText;
var bombs;


// Phaser game var
var game = new Phaser.Game(config);

var score = 0;

function preload ()
{
    this.load.image('skyBackground', './assets/img/backgrounds/skyBackground.jpg');
    this.load.image('ground', './assets/img/backgrounds/ground.png');
    this.load.image('star', './assets/img/objects/star.png');
    this.load.spritesheet('dude', 
        './assets/img/characters/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );

}

function create ()
{
    // Built-in Keyboard manager
    cursors = this.input.keyboard.createCursorKeys();    
    
    /* Creating game objects */
    
    // background
    const background = this.add.image(300, 200, 'skyBackground');
    platforms = this.physics.add.staticGroup();
    platforms.create(200, 400, 'ground').setScale(2).refreshBody();
    platforms.create(600,300, 'ground');
    // player
    player = this.physics.add.sprite(200, 200, 'dude');
    // stars
    stars = this.physics.add.group({
        key: 'star',
        repeat: 4,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    // Score
    scoreText = this.add.text(16, 16, `score: ${score}`, { fontSize: '32px', fill: '#fff' });
    
    /* Game object physics */

    // Player 
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // Stars 
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    
    
    stars.children.iterate(function (child) {
        
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
    });

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Character animation
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    
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

const collectStar = (player, star) =>
{
    star.disableBody(true, true);    
    score += 10;
    scoreText.setText('Score: ' + score);
}

const hitBomb = (player, bomb) =>
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}