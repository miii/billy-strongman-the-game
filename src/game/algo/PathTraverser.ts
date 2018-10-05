import { PathNode } from '@/algo/PathNode';
import { AStar } from '@/algo/AStar';

export class PathTraverser {

  public constructor(scene: Phaser.Scene, tilemap: Phaser.Tilemaps.StaticTilemapLayer) {
    this.scene = scene;
    this.tilemap = tilemap;
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