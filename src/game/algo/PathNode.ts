/**
 * Path nodes used by A* algorithm
 */
export class PathNode {
  /**
   * Tilemap tile object
   * @type {Phaser.Tilemaps.Tile}
   */
  public tile: Phaser.Tilemaps.Tile;

  /**
   * The object's subposition within the tile
   * @type {number}
   */
  public subtileIndex: number;

  /**
   * Path cost to destination
   * @type {number}
   */
  public cost: number;

  /**
   * Previous path node
   * @type {PathNode | null}
   */
  public prevNode: PathNode | null;

  /**
   * Create a new path node
   * @param {Phaser.Tilemaps.Tile} tile Tilemap tile object
   * @param {number} subtileIndex The object's subposition within the tile
   * -------
   * | 0 1 |
   * | 2 3 |
   * -------
   * @param {number} cost Path cost to destination
   * @param {PathNode} prevNode Previous path node
   */
  public constructor(
    tile: Phaser.Tilemaps.Tile,
    subtileIndex: number,
    cost: number,
    prevNode: PathNode | null
  ) {
    this.tile = tile;
    this.subtileIndex = subtileIndex;
    this.cost = cost;
    this.prevNode = prevNode;
  }
}