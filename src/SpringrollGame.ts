import { Application, SafeScaleManager, ScaleEvent } from "springroll";
import { GAMEPLAY, SCENE } from "./constants";
import { TitleScene, GameScene } from "./scenes";
import { FactoryPlugin } from "./plugins";
import Phaser, { Game } from 'phaser';

export class SpringrollGame {
    // Instance of a Springroll.Application.
    // Flag any additional features. See https://github.com/SpringRoll/SpringRoll/tree/master/src
    readonly application: Application = new Application({
        features: {
            sfx: true
        }
    });

    private game?: Game;

    public safeScale?: SafeScaleManager;

    constructor() {
        // Listen for when the application is ready.
        this.application.state.ready.subscribe(this.onSpringrollApplicationReady.bind(this));
    }

    private onSpringrollApplicationReady(isReady: ConstrainBoolean) {
        if (isReady) {
            // Listen for container events from the application.
            this.application.state.pause.subscribe(this.onApplicationPause.bind(this));
            this.application.state.soundVolume.subscribe(this.onMasterVolumeChange.bind(this));
            this.application.state.musicVolume.subscribe(result => {
                console.log('musicVolume: ', result);
            });
            this.application.state.voVolume.subscribe(result => {
                console.log('voVolume: ', result);
            });
            this.application.state.captionsMuted.subscribe(result => {
                console.log('captionsMuted: ', result);
            });

            // Create a Phaser.Game.
            this.game = new Phaser.Game({
                type: Phaser.AUTO,
                width: GAMEPLAY.WIDTH,
                height: GAMEPLAY.HEIGHT,
                backgroundColor: '#000000',
                parent: 'gameTarget',
                // @ts-ignore
                plugins: {
                    // FactoryPlugin is not necessary for Springroll, however it demonstrates
                    // how to setup and install a Phaser.Plugin.
                    global: [{ key: "FactoryPlugin", plugin: FactoryPlugin, start: true }]
                }
            });

            this.safeScale = new SafeScaleManager({
                width: GAMEPLAY.WIDTH,
                height: GAMEPLAY.HEIGHT,
                safeWidth: GAMEPLAY.SAFE_WIDTH,
                safeHeight: GAMEPLAY.SAFE_HEIGHT,
                callback: this.onWindowResize.bind(this)
            });

            // Add game scenes.
            this.game.scene.add(SCENE.GAME, GameScene);
            this.game.scene.add(SCENE.TITLE, TitleScene, true);
        }
    }

    private onApplicationPause(value: boolean) {
        if (!this.game) return;

        if (value) {
            this.game.scene.pause(SCENE.GAME);
        }
        else {
            this.game.scene.resume(SCENE.GAME);
        }
    }

    private onMasterVolumeChange(value: number) {
        if (!this.game) return;

        this.game.sound.volume = value;
    }

    private onWindowResize({ scaleRatio }: ScaleEvent) {
        if (!this.game) return;

        this.game.canvas.style.width = `${GAMEPLAY.WIDTH * scaleRatio}px`;
        this.game.canvas.style.height = `${GAMEPLAY.HEIGHT * scaleRatio}px`;
    }
}

export const springrollGame = new SpringrollGame();