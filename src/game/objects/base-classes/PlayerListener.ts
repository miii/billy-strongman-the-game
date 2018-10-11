import { Player } from '../Player';

export interface PlayerListener {
  /**
   * Called on every player move
   * @param {Player} player Player object
   * @return {void}
   */
  onPlayerMove(player: Player): void;
}