import { ImageObject } from '@/objects/base-classes/ImageObject';
import { PathNode } from '@/algo/PathNode';

export class AStar {
  private scene!: Phaser.Scene;
  private tilemap!: Phaser.Tilemaps.StaticTilemapLayer;
  private fromObject!: ImageObject;
  private toObject!: ImageObject;

  public constructor(scene: Phaser.Scene, tilemap: Phaser.Tilemaps.StaticTilemapLayer) {
    this.scene = scene;
    this.tilemap = tilemap;
  }

  /**
   * Create new A Star instance
   * @param {Phaser.Scene} scene Current scene
   * @param {Phaser.Tilemaps.StaticTilemapLayer} tilemap Tilemap
   */
  public static create(scene: Phaser.Scene, tilemap: Phaser.Tilemaps.StaticTilemapLayer): AStar {
    const instance = new this(scene, tilemap);
    return instance;
  }

  /**
   * Set object to start from
   * @param {ImageObject} obj Starting object
   * @return {AStar}
   */
  public from(obj: ImageObject): AStar {
    this.fromObject = obj;
    return this;
  }

  /**
   * Set object to walk to
   * @param {ImageObject} obj Goal object
   * @return {AStar}
   */
  public to(obj: ImageObject): AStar {
    this.toObject = obj;
    return this;
  }

  /**
   * Navigate to goal object
   * @return {void}
   */
  public navigate(): void {
    // Check for errors
    if (!this.fromObject)
      return console.error('No from object given');
    if (!this.toObject)
      return console.error('No to object given');

    // Dummy code
    const fromNode = this.createPathNode(this.fromObject.x, this.fromObject.y, 0, null);
    console.log(fromNode);
  }

  /**
   * Create new path node by user position
   * @param {number} x Object x position
   * @param {number} y Object y position
   * @param {number} cost Node path cost
   * @param {PathNode | null} prevNode Previous path node
   */
  private createPathNode(x: number, y: number, cost: number, prevNode: PathNode | null): PathNode {
    const tile = this.tilemap.getTileAtWorldXY(x, y);

    // Calculate subposition index
    let index = 0;
    if (x - tile.pixelX > 0)
      index += 1;
    if (y - tile.pixelY > 0)
      index += 2;

    // Create new path node
    return new PathNode(tile, index, cost, prevNode);
  }
}