import { PathNode } from '@/algo/PathNode';
import { DebugBlock } from '@/objects/DebugBlock';
import { ImageObject } from '@/objects/base-classes/ImageObject';
import { AStar } from './AStar';

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
   */
  public static find(opponent: ImageObject, player: ImageObject): PathNode[] {
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
        Bottleneck.debugBlocks.push(
          DebugBlock.create(neighbourNode.tile.pixelX, neighbourNode.tile.pixelY)
        );
      });
    }

    // Return visited nodes
    return open;
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