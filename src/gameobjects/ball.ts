import Phaser from 'phaser';
import { GAMEPLAY } from '../constants';
import { springrollGame } from '../SpringrollGame';


export class Ball extends Phaser.GameObjects.Sprite
{
    private velY: number = 0;
    private hitSound: any;
    private sfxChangeBound: any;

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'ball');
        this.velY = 0; 

        this.hitSound = scene.sound.add('bounce');

        // listen for state changes on SFX volume
        this.sfxChangeBound = this.onSFXVolumeChange.bind(this);

        const sfxState =  springrollGame.application.state.sfxVolume;

        sfxState.subscribe(this.sfxChangeBound);
        this.onSFXVolumeChange(sfxState.value);
    }

    preUpdate(time: number, delta: number): void
    {
        this.velY += GAMEPLAY.GRAVITY;
        this.y += this.velY;

        if(this.y >= 680)
        {
            this.y = 680 - 1;
            this.velY *= -1;

            this.hitSound.play();
        }

        // @ts-ignore
        super.update(time, delta);
    }

    destroy()
    {
        // @ts-ignore
        this.scene.app.state.sfxVolume.unsubscribe(this.sfxChangeBound);
        super.destroy();
    }

    onSFXVolumeChange(current: number)
    {
        if (isFinite(current)) {
            this.hitSound.volume = current;
        }
    }
}