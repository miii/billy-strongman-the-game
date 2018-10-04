import { ImageObject } from './base-classes/ImageObject';

export class DebugBlock extends ImageObject {
  public create() {
    this.alpha = 0.3;
  }
}