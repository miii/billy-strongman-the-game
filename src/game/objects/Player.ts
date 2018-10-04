import { ImageObject } from './base-classes/ImageObject';

export class Player extends ImageObject {
  /**
   * Timestamp of next allowed move
   * @type {number}
   */
  private nextMoveTime: number = 0;

  /**
   * Capture key events
   * @type {Phaser.Input.Keyboard.CursorKeys}
   */
  private cursors!: Phaser.Input.Keyboard.CursorKeys;

  /**
   * Override create method
   * @return {void}
   */
  public create(): void {
    // Enable cursor keys
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();
  }

  /**
   * Override update method
   * @param {number} time Time since scene started
   * @return {void}
   */
  public update(time: number): void {
    // this.move(time);
  }

  /**
   * Move player
   * @param {number} time Time since scene started
   * @return {void}
   */
  private move(time: number): void {
    // Jump 32 pixels on every arrow click
    const velocity = 32 * 30;

    // Reset velocity
    this.setVelocityX(0);
    this.setVelocityY(0);

    // Prevent move until cooldown is completed
    if (time < this.nextMoveTime)
      return;

    // Next move can be done in 50 ms
    this.nextMoveTime = time + 50;

    if (this.cursors.up.isDown)
      this.setVelocityY(-velocity);
    else if (this.cursors.right.isDown)
      this.setVelocityX(velocity);
    else if (this.cursors.down.isDown)
      this.setVelocityY(velocity);
    else if (this.cursors.left.isDown)
      this.setVelocityX(-velocity);

    // Get tile at player position
    /*
    console.log(this.ground.getTileAtWorldXY(this.player.getCenter().x, this.player.getCenter().y));
    */
  }
}