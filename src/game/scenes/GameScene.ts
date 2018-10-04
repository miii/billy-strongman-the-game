import { Player } from '@/objects/Player';
import { DebugBlock } from '@/objects/DebugBlock';
import { AStar } from '@/algo/AStar';
import { PathNode } from '@/algo/PathNode';

/**
 * Sample Phaser scene
 * @extends {Phaser.Scene}
 */
export class GameScene extends Phaser.Scene {
  /**
   * Player image
   * @type {Player}
   */
  private player!: Player;

  /**
   * Player check block image
   * @type {Phaser.Physics.Arcade.Image}
   */
  private debugBlock!: Phaser.Physics.Arcade.Image;

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
    this.load.image('debug', 'assets/debug.png');

    this.load.image('tilesgrid', 'assets/tilesgrid.png');
    this.load.tilemapTiledJSON('map', 'assets/tilesgridmap.json');
  }

  /**
   * Phaser create method
   * Initialize scene objects
   * @return {void}
   */
  public create(): void {
    // Make tilemap
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage('tilesgrid');
    const water = map.createStaticLayer('water', tiles, 0, 0);
    this.ground = map.createStaticLayer('ground', tiles, 0, 0);

    // Create player
    this.player = new Player({
      scene: this,
      key: 'player',
      x: 32,
      y: 32
    });

    // Create player
    this.debugBlock = new DebugBlock({
      scene: this,
      key: 'debug',
      x: 32,
      y: 48
    });

    // Create player
    const goal = new Player({
      scene: this,
      key: 'player',
      x: 96,
      y: 128
    });

    // Run A* algorithm
    AStar
      .create(this, this.ground)
      .from(this.player)
      .to(goal)
      .navigate();

    // Prevent player from walking on water
    water.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, water);
  }

  /**
   * Phaser update method
   * Called on every frame
   * @param {number} time Time since scene started
   * @return {void}
   */
  public update(time: number): void {
    this.player.update(time);
    this.debugBlock.update(time);
    // this.move(time);
  }
}