import { ImageObject } from '@/objects/base-classes/ImageObject';
import { PathNode } from '@/algo/PathNode';
import { DebugBlock } from '@/objects/DebugBlock';

export class AStar {
  /**
   * Scene AStar.tilemap
   * @type {Phaser.Tilemaps.StaticTilemapLayer}
   */
  public static tilemap: Phaser.Tilemaps.StaticTilemapLayer;

  /**
   * List of debug blocks
   * @type {ImageObject[]}
   */
  public static debugBlocks: ImageObject[] = [];

  /**
   * Find the most efficient way from point A to B
   * @param {ImageObject} fromObject From object
   * @param {ImageObject} toObject To object
   * @param {boolean} debug Render debug tiles (default: false)
   * @return {PathNode[]} Array containing the pathNodes to the player
   */
  public static getPath(
    fromObject: ImageObject,
    toObject: ImageObject,
    debug: boolean = false
  ): PathNode[] {
    // Get original cost
    const playerPositionCost = AStar.countCost(
      AStar.tilemap.getTileAtWorldXY(fromObject.x, fromObject.y),
      AStar.tilemap.getTileAtWorldXY(toObject.x, toObject.y)
    );

    const closedArray: PathNode[] = [];
    const openArray: PathNode[] = [];
    let neighbourNodes: PathNode[];

    // Create PathNode from current tile
    let currentNode: PathNode | null = AStar.createPathNode(
      fromObject.x,
      fromObject.y,
      playerPositionCost,
      null
    );
    openArray.push(currentNode);

    do {
      // Break if goal tile is found
      if (currentNode.cost === 0)
        break;

      closedArray.push(currentNode);
      openArray.splice(openArray.findIndex(node => node === currentNode), 1);

      // Get tile neighbours
      neighbourNodes = AStar.getNeighbours(currentNode, toObject);
      neighbourNodes.forEach((neighbourNode) => {
        if (
          !closedArray.some(closedNode => closedNode.tile === neighbourNode.tile) &&
          !openArray.some(openNode => openNode.tile === neighbourNode.tile)
        )
          openArray.push(neighbourNode);
      });

      // Save node with smallest cost
      let minCostNode: PathNode | undefined = undefined;

      openArray.forEach((arrayNode) => {
        // Add first node
        if (minCostNode === undefined)
          minCostNode = arrayNode;
        // Save new node if cost is smaller
        else if (minCostNode.cost > arrayNode.cost)
          minCostNode = arrayNode;
      });

      // Go to new node with smallest cost
      if (minCostNode !== undefined)
        currentNode = minCostNode;

    } while (openArray.length > 0);

    // Clear debug blocks
    if (debug) {
      AStar.debugBlocks.forEach(block => block.destroy());
      AStar.debugBlocks = [];
    }

    // Traverse backwards through node tree to get corrent order
    const correctPath: PathNode[] = [];
    while (currentNode.prevNode !== null) {
      correctPath.unshift(currentNode);
      currentNode = currentNode.prevNode;

      // Add debug block
      /*
      if (debug)
        AStar.debugBlocks.push(DebugBlock.create(currentNode.tile.pixelX, currentNode.tile.pixelY));
      */
    }

    // Return nodes in ascending order
    return correctPath;
  }

  /**
   * Count the Manhattan distance between two tiles
   * @param {Phaser.AStar.tilemaps.Tile} tile1 From tile
   * @param {Phaser.AStar.tilemaps.Tile} tile2 To Tile
   * @return {number} Manhattan distance
   */
  private static countCost(tile1: Phaser.Tilemaps.Tile, tile2: Phaser.Tilemaps.Tile): number {
    return Math.abs(tile2.x - tile1.x) + Math.abs(tile2.y - tile1.y);
  }

  /**
   * Get existing neighbour nodes
   * @param {PathNode} currentNode Parent node
   * @param {ImageObject} goalObject Goal object
   * @return {PathNode[]}
   */
  private static getNeighbours(currentNode: PathNode, goalObject: ImageObject): PathNode[] {
    const currentTile = currentNode.tile;
    const neighbourNodes: PathNode[] = [];
    let movementCost: number;

    // Get tile objects from AStar.tilemap (null if invalid)
    const upNeighbourTile = AStar.tilemap
      .getTileAtWorldXY(currentTile.pixelX, currentTile.pixelY - 32);
    const rightNeighbourTile = AStar.tilemap
      .getTileAtWorldXY(currentTile.pixelX + 32, currentTile.pixelY);
    const downNeighbourTile = AStar.tilemap
      .getTileAtWorldXY(currentTile.pixelX, currentTile.pixelY + 32);
    const leftNeighbourTile = AStar.tilemap
      .getTileAtWorldXY(currentTile.pixelX - 32, currentTile.pixelY);

    // Upper neighbour
    if (upNeighbourTile) {
      // Get cost to goal tile
      movementCost = AStar.countCost(
        upNeighbourTile,
        AStar.tilemap.getTileAtWorldXY(goalObject.x, goalObject.y)
      );
      // Push neighbour to list
      const upNeighbour = AStar.createPathNode(
        currentNode.tile.pixelX,
        currentNode.tile.pixelY - 32,
        movementCost,
        currentNode
      );
      neighbourNodes.push(upNeighbour);
    }

    // Right neighbour
    if (rightNeighbourTile) {
      // Get cost to goal tile
      movementCost = AStar.countCost(
        rightNeighbourTile,
        AStar.tilemap.getTileAtWorldXY(goalObject.x, goalObject.y)
      );
      // Push neighbour to list
      const rightNeighbour = AStar.createPathNode(
        currentNode.tile.pixelX + 32,
        currentNode.tile.pixelY,
        movementCost,
        currentNode
      );
      neighbourNodes.push(rightNeighbour);
    }

    // Down neighbour
    if (downNeighbourTile) {
      // Get cost to goal tile
      movementCost = AStar.countCost(
        downNeighbourTile,
        AStar.tilemap.getTileAtWorldXY(goalObject.x, goalObject.y)
      );
      // Push neighbour to list
      const downNeighbour = AStar.createPathNode(
        currentNode.tile.pixelX,
        currentNode.tile.pixelY + 32,
        movementCost,
        currentNode
      );
      neighbourNodes.push(downNeighbour);
    }

    // Left neighbour
    if (leftNeighbourTile) {
      // Get cost to goal tile
      movementCost = AStar.countCost(
        leftNeighbourTile,
        AStar.tilemap.getTileAtWorldXY(goalObject.x, goalObject.y)
      );
      // Push neighbour to list
      const leftNeighbour = AStar.createPathNode(
        currentNode.tile.pixelX - 32,
        currentNode.tile.pixelY,
        movementCost,
        currentNode
      );
      neighbourNodes.push(leftNeighbour);
    }

    // Return list of valid neighbours
    return neighbourNodes;
  }

  /**
   * Create new path node by user position
   * @param {number} x Object x position
   * @param {number} y Object y position
   * @param {number} cost Node path cost
   * @param {PathNode | null} prevNode Previous path node
   */
  private static createPathNode(
    x: number,
    y: number,
    cost: number,
    prevNode: PathNode | null
  ): PathNode {
    const tile = AStar.tilemap.getTileAtWorldXY(x, y);

    // Create new path node
    return new PathNode(tile, cost, prevNode);
  }
}