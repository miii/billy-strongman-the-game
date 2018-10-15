import Phaser from 'phaser';

/**
 * Config for creating ImageObject instances
 */
export interface ObjectConfig {
  /**
   * Phaser scene
   * @type {Phaser.Scene}
   */
  scene: Phaser.Scene;

  /**
   * X axis offset
   * @type {number}
   */
  x: number;

  /**
   * Y axis offset
   * @type {number}
   */
  y: number;
}

/**
 * Base class for custom phaser objects
 * @extends {Phaser.Physics.Arcade.Image}
 */
export class ImageObject extends Phaser.Physics.Arcade.Image {
  /**
   * Object assets key
   * Overrided by child classes
   * @type {string}
   */
  protected static key: string;

  /**
   * Store current scene
   * @type {Phaser.Scene}
   */
  protected currentScene!: Phaser.Scene;

  /**
   * Scene tilemap
   * @type {Phaser.Tilemaps.StaticTilemapLayer}
   */
  protected tilemap!: Phaser.Tilemaps.StaticTilemapLayer;

  /**
   * Object constructor
   * @param {ObjectConfig} params Object config
   */
  public constructor(params: ObjectConfig) {
    // Call parent constructor
    super(params.scene, params.x, params.y, '');

    // Set texture after initialization
    // @ts-ignore
    this.setTexture(this.constructor.key);

    // Set current scene
    this.currentScene = params.scene;
    this.currentScene.add.existing(this);
    this.currentScene.physics.add.existing(this);

    // Set origin to top left corner
    this.setOrigin(0, 0);

    // Destroy object on game over
    this.currentScene.events.on('game_over', () => { this.destroy(); });

    // Call overrided method
    this.create();
  }

  /**
   * Set tilemap
   * @param {Phaser.Tilemaps.StaticTilemapLayer} tilemap Tilemap
   * @return {Player} Current instance
   */
  public setTilemap<T>(tilemap: Phaser.Tilemaps.StaticTilemapLayer): T {
    this.tilemap = tilemap;
    // @ts-ignore
    return this;
  }

  /**
   * Placeholder for the create method
   * To be overrided by child classes
   * @return {void}
   */
  public create(): void {}

  /**
   * Placeholder for the update method
   * To be overrided by child classes
   * @param {number} time Time since scene started
   * @return {void}
   */
  public update(time: number): void {}
}