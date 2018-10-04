/**
 * Sample Phaser scene
 * @extends {Phaser.Scene}
 */
export class GameScene extends Phaser.Scene {
  /**
   * Timestamp of next allowed move
   * @type {number}
   */
  private nextMoveTime: number = 0;

  /**
   * Capture key events
   * @type {Phaser.Input.Keyboard.CursorKeys}
   */
  private cursors!: Phaser.Input.Keyboard.CursorKeys;

  /**
   * Player image
   * @type {Phaser.Physics.Arcade.Image}
   */
  private player!: Phaser.Physics.Arcade.Image;

  /**
   * Tilemap ground layer
   * @type {Phaser.Tilemaps.StaticTilemapLayer}
   */
  private ground!: Phaser.Tilemaps.StaticTilemapLayer;

  /**
   * Phaser preload method
   * Called before scene is created
   * @return {void}
   */
  public preload(): void {
    this.load.image('player', 'assets/player.png');
    this.load.image('tilesgrid', 'assets/tilesgrid.png');
    this.load.tilemapTiledJSON('map', 'assets/tilesgridmap.json');
  }

  /**
   * Phaser create method
   * Initialize scene objects
   * @return {void}
   */
  public create(): void {
    // Enable cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // Make tilemap
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage('tilesgrid');
    const water = map.createStaticLayer('water', tiles, 0, 0);
    this.ground = map.createStaticLayer('ground', tiles, 0, 0);

    // Create player
    this.player = this.physics.add.image(32, 32, 'player').setOrigin(0, 0);
    this.player.body.collideWorldBounds = true;

    // Prevent player from walking on water
    water.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, water);

    // Player can't move outside world
    this.player.setCollideWorldBounds(true);
  }

  /**
   * Phaser update method
   * Called on every frame
   * @param {number} time Time since scene started
   * @return {void}
   */
  public update(time: number): void {
    this.move(time);
  }

  /**
   * Move player
   * @param {number} time Time since scene started
   * @return {void}
   */
  private move(time: number): void {
    // Jump 32 pixels on every arrow click
    const velocity = 32 * 30;

    // Reset velocity
    this.player.setVelocityX(0);
    this.player.setVelocityY(0);

    // Prevent move until cooldown is completed
    if (time < this.nextMoveTime)
      return;

    // Next move can be done in 50 ms
    this.nextMoveTime = time + 50;

    if (this.cursors.up.isDown)
      this.player.setVelocityY(-velocity);
    else if (this.cursors.right.isDown)
      this.player.setVelocityX(velocity);
    else if (this.cursors.down.isDown)
      this.player.setVelocityY(velocity);
    else if (this.cursors.left.isDown)
      this.player.setVelocityX(-velocity);

    // Get tile at player position
    /*
    console.log(this.ground.getTileAtWorldXY(this.player.getCenter().x, this.player.getCenter().y));
    */
  }
}