import type { Ball } from '../gameobjects/ball'

// Merge declarations with phaser

declare global {
  declare namespace Phaser.GameObjects {
    interface GameObjectFactory {
      ball(x: number, y: number): Ball;
    }
  }
}
