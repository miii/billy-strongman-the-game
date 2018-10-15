import { Player } from '@/objects/Player';
import { DebugBlock } from '@/objects/DebugBlock';
import { Bottleneck } from '@/algo/Bottleneck';
import { Opponent } from '@/objects/Opponent';
import { AStar } from '@/algo/AStar';
import { Powder } from '@/objects/Powder';

/**
 * Sample Phaser scene
 * @extends {Phaser.Scene}
 */
export class GameScene extends Phaser.Scene {
  /**
   * Player image
   * @type {Player}
   */
  private player!: Player;

  /**
   * Tilemap ground layer
   * @type {Phaser.Tilemaps.StaticTilemapLayer}
   */
  private ground!: Phaser.Tilemaps.StaticTilemapLayer;

  /**
   * Setup scene
   * @param {GameConfig} config Phaser game config
   */
  public constructor(config: GameConfig) {
    super(config);

    // Set scene key
    Phaser.Scene.call(this, { key: 'GameScene' });
  }

  /**
   * Phaser preload method
   * Called before scene is created
   * @return {void}
   */
  public preload(): void {
    this.load.image('player', 'assets/tiled/blocks/player.png');
    this.load.image('powder', 'assets/tiled/blocks/powder.png');
    this.load.image('opponent', 'assets/tiled/blocks/opponent.png');
    this.load.image('debug', 'assets/tiled/blocks/debug.png');

    this.load.image('tilesgrid', 'assets/tiled/tilesgrid.png');
    this.load.tilemapTiledJSON('map', 'assets/tiled/tilemap.json');

    // Set debugger scene
    DebugBlock.scene = this;
  }

  /**
   * Phaser create method
   * Initialize scene objects
   * @return {void}
   */
  public create(): void {
    // Make tilemap
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage('tileset', 'tilesgrid');
    const water = map.createStaticLayer('water', tiles, 0, 0);
    this.ground = map.createStaticLayer('ground', tiles, 0, 0);

    // Create player
    this.createPlayer(map);

    // Create powder on map
    this.createPowder(map);

    // Create opponents
    this.createOpponents(map);

    // Prevent player from walking on water
    water.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, water);

    AStar.tilemap = this.ground;
    Bottleneck.tilemap = this.ground;

    this.events.on('game_over', () => { this.onGameOver(); });
  }

  /**
   * Phaser update method
   * Called on every frame
   * @param {number} time Time since scene started
   * @return {void}
   */
  public update(time: number): void {
    this.player.update(time);
  }

  /**
   * Create player in scene
   * @return {void}
   */
  private createPlayer(map: Phaser.Tilemaps.Tilemap): void {
    // Get player object layer from tilemap
    const charactersLayer = map.layers
      .find(layer => layer.name === 'characters') as Phaser.Tilemaps.LayerData;

    // Find player tile
    // @ts-ignore
    let playerTile: Phaser.Tilemaps.Tile = undefined;
    charactersLayer.data.forEach((row: Phaser.Tilemaps.Tile[]) => {
      row.some((tile) => {
        const player = tile.properties.hasOwnProperty('player');
        if (player)
          playerTile = tile;

        return player;
      });
    });

    // Avoid errors
    if (playerTile === undefined)
      throw new Error('Player not found in tilemap');

    // Create player
    this.player = new Player({
      scene: this,
      x: playerTile.pixelX,
      y: playerTile.pixelY
    }).setTilemap(this.ground);
  }

  /**
   * Create player in scene
   * @return {void}
   */
  private createOpponents(map: Phaser.Tilemaps.Tilemap): void {
    // Reset allies
    Opponent.allies = [];

    // Get player object layer from tilemap
    const charactersLayer = map.layers
      .find(layer => layer.name === 'characters') as Phaser.Tilemaps.LayerData;

    // Find opponent tiles
    const opponentTiles: Phaser.Tilemaps.Tile[] = [];
    charactersLayer.data.forEach((row: Phaser.Tilemaps.Tile[]) => {
      row.forEach((tile) => {
        const opponent = tile.properties.hasOwnProperty('opponent');
        if (opponent)
          opponentTiles.push(tile);
      });
    });

    // Avoid errors
    if (opponentTiles.length === 0)
      throw new Error('No opponent found in tilemap');

    // Add opponents
    opponentTiles.forEach((opponentTile) => {
      // Create opponent
      const cpu = new Opponent({
        scene: this,
        x: opponentTile.pixelX,
        y: opponentTile.pixelY
      }).setTilemap<Opponent>(this.ground);

      // Listen to player moves
      this.player.addMoveListener(cpu);
    });
  }

  private createPowder(map: Phaser.Tilemaps.Tilemap): void {
    // Get player object layer from tilemap
    const charactersLayer = map.layers
      .find(layer => layer.name === 'powder') as Phaser.Tilemaps.LayerData;

    // Find opponent tiles
    const powderTiles: Phaser.Tilemaps.Tile[] = [];
    charactersLayer.data.forEach((row: Phaser.Tilemaps.Tile[]) => {
      row.forEach((tile) => {
        const opponent = tile.properties.hasOwnProperty('powder');
        if (opponent)
          powderTiles.push(tile);
      });
    });

    // Add opponents
    powderTiles.forEach((tile) => {
      // Create opponent
      const powder = new Powder({
        scene: this,
        x: tile.pixelX,
        y: tile.pixelY
      }).setTilemap<Powder>(this.ground);

      // Listen to player moves
      this.player.addMoveListener(powder);
    });
  }

  /**
   * On game over
   */
  private onGameOver() {
    setTimeout(
      () => {
        this.scene.restart();
      },
      150
    );
  }
}