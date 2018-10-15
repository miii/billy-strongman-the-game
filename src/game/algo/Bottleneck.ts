import { PathNode } from '@/algo/PathNode';
import { DebugBlock } from '@/objects/DebugBlock';
import { ImageObject } from '@/objects/base-classes/ImageObject';
import { AStar } from './AStar';
import { Opponent } from '@/objects/Opponent';

export class Bottleneck {
  /**
   * Scene tilemap
   * @type {Phaser.Tilemaps.StaticTilemapLayer}
   */
  public static tilemap: Phaser.Tilemaps.StaticTilemapLayer;

  /**
   * Store debug blocks
   * @type {DebugBlock[]}
   */
  private static debugBlocks: DebugBlock[] = [];

  /**
   * Find suitable bottleneck location
   * @param {ImageObject} opponent Opponent object
   * @param {ImageObject} player Player object
   * @return {PathNode | undefined}
   */
  public static find(opponent: ImageObject, player: ImageObject): PathNode | undefined {
    const closed: PathNode[] = [];
    const open: PathNode[] = [];

    // Get max distance opponent can reach before collide with player
    const distance = Math.ceil((AStar.getPath(opponent, player).length - 1) / 2);

    let neighbours: PathNode[];
    let currNode = new PathNode(this.tilemap.getTileAtWorldXY(opponent.x, opponent.y), 0, null);
    open.push(currNode);

    // Reset debug blocks
    Bottleneck.debugBlocks.forEach(block => block.destroy());
    Bottleneck.debugBlocks = [];

    while (open.length > 0) {
      // Set current node to next node in open array
      currNode = open[0];
      closed.push(currNode);
      open.shift();

      // Break loop if cost is too high
      if (currNode.cost >= distance)
        break;

      // Find neighbours
      neighbours = Bottleneck.getNeighbours(currNode).filter((node) => {
        return  !closed.some(closedNode => closedNode.tile === node.tile) &&
                !open.some(openNode => openNode.tile === node.tile);
      });

      // Add neighbour tiles to open array
      neighbours.forEach((neighbourNode) => {
        open.push(neighbourNode);
      });
    }

    // Store bottleneck nodes
    const bottleneckNodes: PathNode[] = [];
    let currentNode: PathNode | null;

    // Traverse through end nodes
    open.forEach((node) => {
      currentNode = node;

      // While tile is a passage, go to previous node
      while (currentNode !== null && this.getNeighbours(currentNode).length === 2)
        currentNode = currentNode.prevNode;

      // Mark as bottleneck node if tile exists
      if (currentNode !== null)
        bottleneckNodes.push(currentNode);
    });

    // Temporary variables
    let bestNode: PathNode | undefined = undefined;
    let debugTile: ImageObject;
    let pathToPlayer: PathNode[];

    // Traverse through each bottleneck node
    bottleneckNodes.forEach((node) => {
      // Create dummy tile to use with A* algorithm
      debugTile = DebugBlock.create(node.tile.pixelX, node.tile.pixelY);

      // Get A* path from bottleneck tile to player
      pathToPlayer = AStar.getPath(debugTile, player);
      node.cost = pathToPlayer.length;

      // Destroy debug tile
      debugTile.destroy();

      // Add node directly if first iteration
      if (!bestNode) {
        bestNode = node;
        return;
      }

      // Find other opponents along the path between the bottleneck tile and the player
      // If someone is found, we know that the player cannot move here and therefore ignore it
      for (let i = 0; i < pathToPlayer.length; i++)
        for (let j = 0; j < Opponent.allies.length; j++)
          if (
            pathToPlayer[i].tile.pixelX === Opponent.allies[j].x &&
            pathToPlayer[i].tile.pixelY === Opponent.allies[j].y
          )
            return;

      /*
      Bottleneck.debugBlocks.push(
        DebugBlock.create(node.tile.pixelX, node.tile.pixelY)
      );
      */

      // Replace node if cost is better
      if (node.cost < bestNode.cost) {
        bestNode = node;
      }
    });

    /*
    if (bestNode !== undefined)
      Bottleneck.debugBlocks.push(
        // @ts-ignore
        DebugBlock.create(bestNode.tile.pixelX, bestNode.tile.pixelY)
      );
    */

    return bestNode;
  }

  /**
   * Get list of neighbour nodes
   * @param {PathNode} node Parent node
   * @return {PathNode[]}
   */
  public static getNeighbours(node: PathNode): PathNode[] {
    const tile = node.tile;
    const neighbours: PathNode[] = [];

    // Upper neighbour
    const upTile = Bottleneck.tilemap.getTileAtWorldXY(tile.pixelX, tile.pixelY - tile.height);
    if (upTile)
      neighbours.push(new PathNode(upTile, node.cost + 1, node));

    // Right neighbour
    const rightTile = Bottleneck.tilemap.getTileAtWorldXY(tile.pixelX + tile.width, tile.pixelY);
    if (rightTile)
      neighbours.push(new PathNode(rightTile, node.cost + 1, node));

    // Down neighbour
    const downTile = Bottleneck.tilemap.getTileAtWorldXY(tile.pixelX, tile.pixelY + tile.height);
    if (downTile)
      neighbours.push(new PathNode(downTile, node.cost + 1, node));

    // Left neighbour
    const leftTile = Bottleneck.tilemap.getTileAtWorldXY(tile.pixelX - tile.width, tile.pixelY);
    if (leftTile)
      neighbours.push(new PathNode(leftTile, node.cost + 1, node));

    // Return list of neighbours
    return neighbours;
  }
}