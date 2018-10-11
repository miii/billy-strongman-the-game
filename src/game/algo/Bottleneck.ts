import { PathNode } from '@/algo/PathNode';
import { DebugBlock } from '@/objects/DebugBlock';

export class Bottleneck {
  /**
   * Singleton instance
   * @type {Bottleneck}
   */
  private static instance: Bottleneck;

  /**
   * Scene tilemap
   * @type {Phaser.Tilemaps.StaticTilemapLayer}
   */
  private tilemap!: Phaser.Tilemaps.StaticTilemapLayer;

  /**
   * Store debug blocks
   * @type {DebugBlock[]}
   */
  private debugBlocks: DebugBlock[] = [];

  /**
   * Initialize bottleneck instance
   * @param {Phaser.Tilemaps.StaticTilemapLayer} tilemap Scene tilemap
   * @return {Bottleneck}
   */
  public static setup(tilemap: Phaser.Tilemaps.StaticTilemapLayer): Bottleneck {
    Bottleneck.instance = new Bottleneck();
    Bottleneck.instance.tilemap = tilemap;

    return Bottleneck.instance;
  }

  /**
   * Get singleton instance
   * @return {Bottleneck}
   */
  public static getInstance(): Bottleneck {
    return Bottleneck.instance;
  }

  /**
   * Find bottleneck tile
   * @param {PathNode} player Player path node
   * @param {PathNode} cpu2 CPU 2 path node
   * @return {PathNode}
   */
  public findEndNodes(player: PathNode, cpu2: PathNode): PathNode[] {
    const closed: PathNode[] = [];
    const open: PathNode[] = [];
    const endNodes: PathNode[] = [];

    let neighbours: PathNode[];
    let currNode = player;
    open.push(currNode);

    // Remember when goal is found
    let goalFound = false;

    while (open.length > 0) {
      // Set current node to next node in open array
      currNode = open[0];
      closed.push(currNode);
      open.shift();

      /*
      * If goal node is found, continue to traverse through the open array until
      * bottleneck tiles are no longer found (tiles with only 2 neighbours).
      */
      if (currNode.tile.x === cpu2.tile.x && currNode.tile.y === cpu2.tile.y) {
        goalFound = true;
        continue;
      }

      // Get new neighbour tiles
      neighbours = this.getNeighbours(currNode).filter((node) => {
        return  !closed.some(closedNode => closedNode.tile === node.tile) &&
                !open.some(openNode => openNode.tile === node.tile);
      });

      /*
      * If goal has been found, tile must have one and only 1 new neighbour.
      * TODO: The new tile should also be closer for CPU 1 to navigate to
      */
      if (!goalFound || neighbours.length === 1)
        // Add neighbour tiles to open array
        neighbours.forEach((neighbourNode) => {
          open.push(neighbourNode);
        });

      /*
      * If goal has been found or new node has multiple neighbours new neighbours,
      * mark node as end node
      */
      else
        endNodes.push(currNode);
    }

    // Reset debug blocks
    this.debugBlocks.forEach(block => block.destroy());
    this.debugBlocks = [];

    // Create debug blocks
    endNodes.forEach((node) => {
      this.debugBlocks.push(DebugBlock.create(node.tile.pixelX, node.tile.pixelY));
    });

    // Return visited nodes
    return endNodes;
  }

  /**
   * Get list of neighbour nodes
   * @param {PathNode} node Parent node
   * @return {PathNode[]}
   */
  public getNeighbours(node: PathNode): PathNode[] {
    const tile = node.tile;
    const neighbours: PathNode[] = [];

    // Upper neighbour
    const upTile = this.tilemap.getTileAtWorldXY(tile.pixelX, tile.pixelY - tile.height);
    if (upTile)
      neighbours.push(new PathNode(upTile, 0, 0, node));

    // Right neighbour
    const rightTile = this.tilemap.getTileAtWorldXY(tile.pixelX + tile.width, tile.pixelY);
    if (rightTile)
      neighbours.push(new PathNode(rightTile, 0, 0, node));

    // Down neighbour
    const downTile = this.tilemap.getTileAtWorldXY(tile.pixelX, tile.pixelY + tile.height);
    if (downTile)
      neighbours.push(new PathNode(downTile, 0, 0, node));

    // Left neighbour
    const leftTile = this.tilemap.getTileAtWorldXY(tile.pixelX - tile.width, tile.pixelY);
    if (leftTile)
      neighbours.push(new PathNode(leftTile, 0, 0, node));

    // Return list of neighbours
    return neighbours;
  }
}