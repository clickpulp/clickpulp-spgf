import { GameObjects, Plugins } from 'phaser';
import { Ball } from '../gameobjects';

function createBall(this: GameObjects.GameObjectFactory, x: number, y: number): Ball {
    const ball = new Ball(this.scene, x, y);
    
    this.displayList.add(ball); // <-- only objects in the display list get displayed
    // @ts-ignore There is a bug in the phaser TS declaration
    this.updateList.add(ball); // <-- only objects in the update list get updated every frame.
    
    return ball;
}

export class FactoryPlugin extends Plugins.BasePlugin
{
    constructor(pluginManager: Plugins.PluginManager)
    {
        super(pluginManager);

        this.pluginManager.registerGameObject('ball', createBall);
    }
}