import { ImageObject } from './base-classes/ImageObject';
import { PlayerListener } from './base-classes/PlayerListener';
import { Player } from './Player';
import { AStar } from '@/algo/AStar';
import { Bottleneck } from '@/algo/Bottleneck';

export interface ClosestOpponent {
  distance: number;
  opponent: Opponent;
}

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
  public static allies: Opponent[] = [];

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
    // Check collision with player before move
    if (this.checkCollision(player))
      return;

    const closestOpponent = this.closestOpponent(player);

    // If opponent is the closest one to the player
    if (this === closestOpponent.opponent) {
      // Find closest path to player
      const path = AStar.getPath(this, player);

      // Move opponent to tile
      this.moveToTile(path[0].tile);
    // If opponent is not the closest one to the player
    } else {
      let bottleneck = Bottleneck.find(this, player);

      // If any bottleneck tile was found near the opponent
      if (bottleneck) {
        // Find the next node to move to
        while (bottleneck.prevNode !== null && bottleneck.prevNode.prevNode !== null)
          bottleneck = bottleneck.prevNode;

        // Move to neighbour tile
        this.moveToTile(bottleneck.tile);
      }
    }

    // Check collision with player after move
    this.checkCollision(player);
  }

  /**
   * Get closest opponent to the player
   * @param {Player} player Player instance
   * @return {boolean}
   */
  private closestOpponent(player: Player): ClosestOpponent {
    let closest: ClosestOpponent;

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
    return closest;
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

  /**
   * Check collision with player
   * @param {Player} player Player object
   * @return {boolean}
   */
  private checkCollision(player: Player): boolean {
    // Check collision with player
    if (this.x === player.x && this.y === player.y) {
      // Add delay to prevent bug were player is moved after scene restart
      if (this.scene)
        this.scene.events.emit('game_over');

      return true;
    }

    return false;
  }
}