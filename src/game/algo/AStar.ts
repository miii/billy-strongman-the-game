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
    let pathNode: PathNode;
    pathNode = this.pathTraverser();

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

  private pathTraverser() {
    const closedArray: PathNode[] = [];
    const openArray: PathNode[] = [];
    const playerPos = [this.fromObject.x, this.fromObject.y];
    const goalPosition = [this.toObject.x, this.toObject.y];

    const playerPositionCost = this.countCost(
        this.tilemap.getTileAtWorldXY(playerPos[0], playerPos[1]),
        this.tilemap.getTileAtWorldXY(goalPosition[0], goalPosition[1]));

    let currentNode = this.createPathNode(
      this.fromObject.x, this.fromObject.y, playerPositionCost, null
    );
    console.log('Closed Array', closedArray);
    openArray.push(currentNode);
    do {
      if (!this.tilemap.getTileAtWorldXY(this.toObject.x, this.toObject.y))
        break;
      if (currentNode.cost === 0) {
        console.log('Found the node', currentNode);
        break;
      }
      closedArray.push(currentNode);
      openArray.splice(closedArray.findIndex(node => node === currentNode), 1);
      const neighbourNodes: PathNode[] = this.checkNeighbours(currentNode);
      neighbourNodes.forEach((neighbourNode) => {
        if (!closedArray.some(closedNode => closedNode.tile === neighbourNode.tile)) {
          openArray.push(neighbourNode);
        }
      });
      let minNode: PathNode | undefined;
      openArray.forEach((arrayNode) => {
        if (minNode !== undefined)
          minNode = arrayNode;
        else if (minNode.cost > arrayNode.cost)
          minNode = arrayNode;
      });
      if (minNode !== undefined)
        currentNode = minNode;
      console.log('Open array, ', openArray);
    } while (openArray.length > 0);

    return currentNode;
  }

  private countCost(tile1: Phaser.Tilemaps.Tile, tile2: Phaser.Tilemaps.Tile) {
    const currentTile = tile1;
    const goalTilePosition = tile2;

    const optimalCost = Math.abs(goalTilePosition.x - currentTile.x)
						          + Math.abs(goalTilePosition.y - currentTile.y);

    return optimalCost;
  }

  private checkNeighbours(currentNode: PathNode): PathNode[] {

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