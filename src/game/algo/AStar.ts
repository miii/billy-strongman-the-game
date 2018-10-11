import { ImageObject } from '@/objects/base-classes/ImageObject';
import { PathNode } from '@/algo/PathNode';
import { DebugBlock } from '@/objects/DebugBlock';

export class AStar {
  private tilemap!: Phaser.Tilemaps.StaticTilemapLayer;
  private fromObject!: ImageObject;
  private toObject!: ImageObject;
  private static debugBlock: ImageObject[] = [];

  public constructor(tilemap: Phaser.Tilemaps.StaticTilemapLayer) {
    this.tilemap = tilemap;
  }

  /**
   * Create new A Star instance
   * @param {Phaser.Tilemaps.StaticTilemapLayer} tilemap Tilemap
   */
  public static create(tilemap: Phaser.Tilemaps.StaticTilemapLayer): AStar {
    const instance = new this(tilemap);
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
   * Create new path node by user position
   * @param {number} x Object x position
   * @param {number} y Object y position
   * @param {number} cost Node path cost
   * @param {PathNode | null} prevNode Previous path node
   */
  private createPathNode(x: number, y: number, cost: number, prevNode: PathNode | null): PathNode {
    const tile = this.tilemap.getTileAtWorldXY(x, y);

    // Create new path node
    return new PathNode(tile, cost, prevNode);
  }

  /**
   * Find the most efficient way from point A to B
   * @return {PathNode[]} Array containing the pathNodes to the player
   */
  public getPath(): PathNode[] {
    // Check for errors
    if (!this.fromObject)
      throw new Error('No from object given');
    if (!this.toObject)
      throw new Error('No to object given');

    const closedArray: PathNode[] = [];
    const openArray: PathNode[] = [];
    const playerPos = [this.fromObject.x, this.fromObject.y];
    const goalPosition = [this.toObject.x, this.toObject.y];

    const playerPositionCost = this.countCost(
        this.tilemap.getTileAtWorldXY(playerPos[0], playerPos[1]),
        this.tilemap.getTileAtWorldXY(goalPosition[0], goalPosition[1]));

    console.log('Player pos cost ', playerPositionCost);
    let currentNode: PathNode | null = this.createPathNode(
      this.fromObject.x, this.fromObject.y, playerPositionCost, null
    );

    openArray.push(currentNode);
    do {
      if (currentNode.cost === 0) {
        break;
      }
      closedArray.push(currentNode);
      openArray.splice(openArray.findIndex(node => node === currentNode), 1);
      const neighbourNodes: PathNode[] = this.getNeighbours(currentNode);
      neighbourNodes.forEach((neighbourNode) => {
        if (!closedArray.some(closedNode => closedNode.tile === neighbourNode.tile &&
            !openArray.some(openNode => openNode.tile === neighbourNode.tile))) {
          openArray.push(neighbourNode);
        }
      });
      let minCostNode: PathNode | undefined = undefined;
      openArray.forEach((arrayNode) => {
        if (minCostNode === undefined)
          minCostNode = arrayNode;
        else if (minCostNode.cost > arrayNode.cost)
          minCostNode = arrayNode;
      });
      if (minCostNode !== undefined)
        currentNode = minCostNode;
    } while (openArray.length > 0);

    const correctPath: PathNode[] = [];
    AStar.debugBlock.forEach(block => block.destroy());
    AStar.debugBlock = [];
    while (currentNode.prevNode !== null) {
      correctPath.unshift(currentNode);
      AStar.debugBlock.push(DebugBlock.create(currentNode.tile.pixelX, currentNode.tile.pixelY));
      currentNode = currentNode.prevNode;
    }

    return correctPath;
  }

  /**
   * Count the Manhattan distance between two tiles
   * @param {Phaser.Tilemaps.Tile} tile1 From tile
   * @param tile2 To Tile
   * @return {number} Manhattan distance
   */
  private countCost(tile1: Phaser.Tilemaps.Tile, tile2: Phaser.Tilemaps.Tile): number {
    const currentTile = tile1;
    const goalTilePosition = tile2;

    const optimalCost = Math.abs(goalTilePosition.x - currentTile.x)
						          + Math.abs(goalTilePosition.y - currentTile.y);

    return optimalCost;
  }

  /**
   * Get existing neighbour nodes
   * @param {PathNode} currentNode Parent node
   * @return {PathNode[]}
   */
  private getNeighbours(currentNode: PathNode): PathNode[] {

    const goalPosition = [this.toObject.x, this.toObject.y];
    let movementCost: number;
    const neighbourNodes: PathNode[] = [];

    const upNeighbourTile = this.tilemap
      .getTileAtWorldXY(currentNode.tile.pixelX, currentNode.tile.pixelY - 32);
    const rightNeighbourTile = this.tilemap
      .getTileAtWorldXY(currentNode.tile.pixelX + 32, currentNode.tile.pixelY);
    const downNeighbourTile = this.tilemap
      .getTileAtWorldXY(currentNode.tile.pixelX, currentNode.tile.pixelY + 32);
    const leftNeighbourTile = this.tilemap
      .getTileAtWorldXY(currentNode.tile.pixelX - 32, currentNode.tile.pixelY);

    if (upNeighbourTile) {
      movementCost = this.countCost(
        upNeighbourTile,
        this.tilemap.getTileAtWorldXY(goalPosition[0], goalPosition[1])
      );
      const upNeighbour = this.createPathNode(
        currentNode.tile.pixelX, currentNode.tile.pixelY - 32, movementCost, currentNode
      );
      neighbourNodes.push(upNeighbour);
    }

    if (rightNeighbourTile) {
      movementCost = this.countCost(
        rightNeighbourTile,
        this.tilemap.getTileAtWorldXY(goalPosition[0], goalPosition[1])
      );
      const rightNeighbour = this.createPathNode(
        currentNode.tile.pixelX + 32, currentNode.tile.pixelY, movementCost, currentNode
      );
      neighbourNodes.push(rightNeighbour);
    }

    if (downNeighbourTile) {
      movementCost = this.countCost(
        downNeighbourTile,
        this.tilemap.getTileAtWorldXY(goalPosition[0], goalPosition[1])
      );
      const downNeighbour = this.createPathNode(
        currentNode.tile.pixelX, currentNode.tile.pixelY + 32, movementCost, currentNode
      );
      neighbourNodes.push(downNeighbour);
    }

    if (leftNeighbourTile) {
      movementCost = this.countCost(
        leftNeighbourTile,
        this.tilemap.getTileAtWorldXY(goalPosition[0], goalPosition[1])
      );
      const leftNeighbour = this.createPathNode(
        currentNode.tile.pixelX - 32, currentNode.tile.pixelY, movementCost, currentNode
      );
      neighbourNodes.push(leftNeighbour);
    }
    return neighbourNodes;
  }
}