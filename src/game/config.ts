import { GameScene } from '@/scenes/GameScene';

/**
 * Phaser game config
 */
export const phaserConfig: GameConfig = {
  parent: 'app',
  type: Phaser.AUTO,
  scene: [GameScene],
  width: 640,
  height: 640,

  // Sample config items
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
    }
  },
};