class TitleScene extends Phaser.Scene {
  constructor() {
    super({key: 'TitleScene' });
  }

  preload() {
    this.load.image('background_image', './assets/backgrounds/bgWerewolf.png')
  }
}

export default TitleScene;