/**
 * Sample Phaser scene
 * @extends {Phaser.Scene}
 */
export class GameScene extends Phaser.Scene {
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
     * Player image
     * @type {Phaser.Physics.Arcade.Image}
     */
    private player!: Phaser.Physics.Arcade.Image;
    private endGoal!: Phaser.Physics.Arcade.Image;
    private closedArray!:  {
      Tile: Phaser.Tilemaps.Tile,
      cost: number,
      previousNode: Phaser.Tilemaps.Tile
    };
  
    /**
     * Tilemap ground layer
     * @type {Phaser.Tilemaps.StaticTilemapLayer}
     */
    private ground!: Phaser.Tilemaps.StaticTilemapLayer;
  
    private mouseCursor!: Phaser.Input.Pointer;
  
    /**
     * Phaser preload method
     * Called before scene is created
     * @return {void}
     */
    public preload(): void {
      this.load.image('player', 'assets/player.png');
      this.load.image('endGoal', 'assets/endGoal.png');
      this.load.image('tilesgrid', 'assets/tilesgrid.png');
      this.load.tilemapTiledJSON('map', 'assets/tilesgridmap.json');
    }
  
    /**
     * Phaser create method
     * Initialize scene objects
     * @return {void}
     */
    public create(): void {
      // Enable cursor keys
      this.cursors = this.input.keyboard.createCursorKeys();
      this.mouseCursor = this.input.mousePointer;
  
      // Make tilemap
      const map = this.make.tilemap({ key: 'map' });
      const tiles = map.addTilesetImage('tilesgrid');
      const water = map.createStaticLayer('water', tiles, 0, 0);
      this.ground = map.createStaticLayer('ground', tiles, 0, 0);
  
      // Create player
      this.player = this.physics.add.image(32, 32, 'player').setOrigin(0, 0);
      this.player.body.collideWorldBounds = true;
  
      this.endGoal = this.physics.add.image(224, 192, 'endGoal').setOrigin(0, 0);
  
      // Prevent player from walking on water
      water.setCollisionByProperty({ collides: true });
      this.physics.add.collider(this.player, water);
  
      // Player can't move outside world
      this.player.setCollideWorldBounds(true);
    }
  
    /**
     * Phaser update method
     * Called on every frame
     * @param {number} time Time since scene started
     * @return {void}
     */
    public update(time: number): void {
      this.move(time);
  
      if (this.mouseCursor.isDown) {
        this.checkNeighbours();
      }
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
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
  
      // Prevent move until cooldown is completed
      if (time < this.nextMoveTime)
        return;
  
      // Next move can be done in 50 ms
      this.nextMoveTime = time + 50;
  
      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-velocity);
        console.log(this.ground
          .getTileAtWorldXY(this.player.getCenter().x, this.player.getCenter().y));
      } else if (this.cursors.right.isDown)
        this.player.setVelocityX(velocity);
      else if (this.cursors.down.isDown)
        this.player.setVelocityY(velocity);
      else if (this.cursors.left.isDown)
        this.player.setVelocityX(-velocity);
    }
  
    private countCost(tile1: Phaser.Tilemaps.Tile, tile2: Phaser.Tilemaps.Tile) {
      const currentTile = tile1;
      const goalTilePosition = tile2;
  
      const optimalCost = Math.abs(goalTilePosition.x - currentTile.x)
           + Math.abs(goalTilePosition.y - currentTile.y);
  
      return optimalCost;
    }
  
    private checkNeighbours() {
      // console.log(this.player.x);
      const playerPos = [this.player.getCenter().x, this.player.getCenter().y];
      const playerTilePos = [this.ground.getTileAtWorldXY(
        playerPos[0], playerPos[1]).x,
        this.ground.getTileAtWorldXY(
          playerPos[0], playerPos[1]).y];
      const goalPosition = [this.endGoal.getCenter().x, this.endGoal.getCenter().y];
      const goalTilePostion = [this.ground.getTileAtWorldXY(goalPosition[0], goalPosition[1]).x,
        this.ground.getTileAtWorldXY(goalPosition[0], goalPosition[1]).y];
  
      const playerPositionCost = this.countCost(
        this.ground.getTileAtWorldXY(playerPos[0], playerPos[1]),
        this.ground.getTileAtWorldXY(goalPosition[0], goalPosition[1]));
      console.log(playerPositionCost);
      // closearray.push(current) om optimal != 0
      // check if neighbours are accessable then add to open
      // console.log(optimalCost);
  
      // globala shiter
      // openArray = []
      // closeArray = []
      // this.countCost(current.y-1)
      // this.countCost(current.y+1)
      // this.countCost(current.x-1)
      // this.countCost(current.x+1)
      // openArray.push(all these things)
      // if(this.ground.getTileAtWorldXY())
  
    }
  }