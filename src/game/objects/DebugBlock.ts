import { ImageObject } from './base-classes/ImageObject';

/**
 * Create transparent debug blocks in scene
 * @extends {ImageObject}
 */
export class DebugBlock extends ImageObject {
  /**
   * Object assets key
   * @type {string}
   */
  protected static key: string = 'debug';

  /**
   * Static phaser scene
   * @type {Phaser.Scene}
   */
  public static scene: Phaser.Scene;

  /**
   * Create new debug block
   * @param {number} x x offset from top left
   * @param {number} y y offset from top left
   * @param {Phaser.Scene} scene Scene to create block in (optional)
   * @return {DebugBlock}
   */
  public static create(x: number, y: number): DebugBlock {
    return new DebugBlock({ x, y, scene: DebugBlock.scene });
  }

  /**
   * Phaser create method
   * @type {void}
   */
  public create(): void {
    // Set block opacity
    this.alpha = 0.1;
  }
}