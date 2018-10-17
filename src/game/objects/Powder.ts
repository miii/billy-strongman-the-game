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
  public static score: number = 0;

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
    Powder.score = 0;

    // @ts-ignore
    document.getElementById('score').innerHTML = Powder.score;
  }

  /**
   * Called on every player move
   * @param {Player} player Player object
   * @return {void}
   */
  public onPlayerMove(player: Player): void {
    // @ts-ignore
    if (this.currentScene.gameOver)
      return;

    // Check if powder was catched
    if (!this.taken && this.x === player.x && this.y === player.y) {
      Powder.score++;
      this.destroy();
      this.taken = true;

      // @ts-ignore
      document.getElementById('score').innerHTML = Powder.score;
    }
  }
}