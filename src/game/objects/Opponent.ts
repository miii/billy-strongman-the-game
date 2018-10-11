import { ImageObject } from './base-classes/ImageObject';
import { PlayerListener } from './base-classes/PlayerListener';
import { Player } from './Player';
import { AStar } from '@/algo/AStar';
import { Bottleneck } from '@/algo/Bottleneck';

/**
 * Opponent object
 * @extends {ImageObject}
 */
export class Opponent extends ImageObject implements PlayerListener {
  /**
   * Object assets key
   * @type {string}
   */
  protected static key: string = 'opponent';

  /**
   * List of opponent allies
   * @type {Opponent[]}
   */
  private static allies: Opponent[] = [];

  /**
   * Override create method
   * @return {void}
   */
  public create(): void {
    Opponent.allies.push(this);
  }

  /**
   * Called on every player move
   * @param {Player} player Player object
   * @return {void}
   */
  public onPlayerMove(player: Player): void {
    // If opponent is the closest one to the player
    if (this.isClosestOpponent(player)) {
      // Find closest path to player
      const path = AStar.getPath(this, player);

      // Move opponent to tile
      this.moveToTile(path[0].tile);

    // If opponent is not the closest one to the player
    } else {
      // TODO: Implement bottleneck mode
    }
  }

  /**
   * Check if opponent is the closest one to the player
   * @param {Player} player Player instance
   * @return {boolean}
   */
  private isClosestOpponent(player: Player): boolean {
    let closest: {
      distance: number,
      opponent: Opponent
    };

    // Check manhattan distance for each player
    Opponent.allies.forEach((opponent) => {
      const distance = AStar.getPath(opponent, player).length;

      // Set new closest opponent
      if (!closest || closest.distance > distance)
        closest = {
          opponent,
          distance
        };
    });

    // @ts-ignore
    return this === closest.opponent;
  }

  /**
   * Move opponent to tile
   * @param {Phaser.Tilemaps.Tile} tile Destination
   * @return {void}
   */
  private moveToTile(tile: Phaser.Tilemaps.Tile): void {
    this.x = tile.pixelX;
    this.y = tile.pixelY;
  }
}