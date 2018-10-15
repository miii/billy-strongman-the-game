import { ImageObject } from './base-classes/ImageObject';
import { PlayerListener } from './base-classes/PlayerListener';
import { Player } from './Player';

/**
 * Powder object
 * @extends {ImageObject}
 */
export class Powder extends ImageObject implements PlayerListener {
  /**
   * Object assets key
   * @type {string}
   */
  protected static key: string = 'powder';

  /**
   * Player score
   * @type {number}
   */
  private static points: number = 0;

  /**
   * If powder has been taken
   * @type {boolean}
   */
  private taken: boolean = false;

  /**
   * Called on object creation
   * @return {void}
   */
  public create(): void {
    Powder.points = 0;
  }

  /**
   * Called on every player move
   * @param {Player} player Player object
   * @return {void}
   */
  public onPlayerMove(player: Player): void {
    if (!this.taken && this.x === player.x && this.y === player.y) {
      Powder.points++;
      this.destroy();
      this.taken = true;

      console.log('New score:', Powder.points);
    }
  }
}