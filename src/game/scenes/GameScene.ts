import { Player } from '@/objects/Player';
import { DebugBlock } from '@/objects/DebugBlock';
import { AStar } from '@/algo/AStar';

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

    // Set debugger scene
    DebugBlock.scene = this;
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
    this.createPlayer(map);

    // Create goal
    const goal = new Player({
      scene: this,
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
   * Create player in scene
   * @return {void}
   */
  private createPlayer(map: Phaser.Tilemaps.Tilemap): void {
    // Get player object layer from tilemap
    const tilemapPlayerObjectGroup = map.objects
      .find((object) => {
        return object.name === 'player';
      });

    // Make sure object layer exists
    if (tilemapPlayerObjectGroup === undefined)
      return console.error('No player was found in tilemap');

    // Get player object from layer
    const tilemapPlayerObject = tilemapPlayerObjectGroup.objects[0];

    // Create player
    this.player = new Player({
      scene: this,

      // Object x offset
      // @ts-ignore
      x: tilemapPlayerObject.x,

      // Object y offset
      // For some reason, the origin is placed in the bottom
      // left corner, hence the 32 pixel negative offset
      // @ts-ignore
      y: tilemapPlayerObject.y - 32
    });
  }

  /**
   * Phaser update method
   * Called on every frame
   * @param {number} time Time since scene started
   * @return {void}
   */
  public update(time: number): void {
    this.player.update(time);
  }
}