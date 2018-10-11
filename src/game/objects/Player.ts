import { ImageObject } from './base-classes/ImageObject';
import { AStar } from '@/algo/AStar';

/**
 * Player object
 * @extends {ImageObject}
 */
export class Player extends ImageObject {
  /**
   * Object assets key
   * @type {string}
   */
  protected static key: string = 'player';

  /**
   * Player tilemap
   * @type {Phaser.Tilemaps.StaticTilemapLayer}
   */
  private tilemap!: Phaser.Tilemaps.StaticTilemapLayer;

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
   * Override create method
   * @return {void}
   */
  public create(): void {
    // Enable cursor keys
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();
  }

  /**
   * Override update method
   * @param {number} time Time since scene started
   * @return {void}
   */
  public update(time: number): void {
    this.move(time);
  }

  public setTilemap(tilemap: Phaser.Tilemaps.StaticTilemapLayer): Player {
    this.tilemap = tilemap;
    return this;
  }

  /**
   * Move player
   * @param {number} time Time since scene started
   * @return {void}
   */
  private move(time: number): void {
    // Jump 32 pixels on every arrow click
    const velocity = 32;

    // Prevent move until cooldown is completed
    if (time < this.nextMoveTime)
      return;

    // Next move can be done in 50 ms
    this.nextMoveTime = time + 100;

    // Check cursor keys and move player
    if (this.cursors.up.isDown)
      this.movePlayerIfPossible(this.x, this.y - velocity);
    else if (this.cursors.right.isDown)
      this.movePlayerIfPossible(this.x + velocity, this.y);
    else if (this.cursors.down.isDown)
      this.movePlayerIfPossible(this.x, this.y + velocity);
    else if (this.cursors.left.isDown)
      this.movePlayerIfPossible(this.x - velocity, this.y);
  }

  /**
   * Move player if tile is valid
   * @param {number} x X axis coordinate
   * @param {number} y Y axis coordinate
   * @return {boolean}
   */
  private movePlayerIfPossible(x: number, y: number): boolean {
    // If tile exists
    if (!this.tilemap.getTileAtWorldXY(x, y))
      return false;

    this.x = x;
    this.y = y;

    // Create goal
    const goal = new Player({
      scene: this.scene,
      x: 96,
      y: 128
    });

    AStar
      .create(this.scene, this.tilemap)
      .from(this)
      .to(goal)
      .navigate();

    return true;
  }
}