import { Game } from "./Game";
import { Layer } from "./Layer";

export class Background {
    layers: Layer[];
    x: number;
    y: number;
    width: number;
    height: number;
    speedX: number;
    imageLayer1: HTMLImageElement;
    imageLayer2: HTMLImageElement;
    imageLayer3: HTMLImageElement;
    imageLayer4: HTMLImageElement;
    imageLayer5: HTMLImageElement;
    imageGround: HTMLImageElement;
    constructor(game: Game) {
      this.x = 0;
      this.y = 0;
      this.width = game.context.canvas.width;
      this.height = game.context.canvas.height;
      this.speedX = 0;

      this.imageLayer1 = new Image(60,40);
      this.imageLayer1.src = "assets/img/background/plx-1.png";
      const layer1 = new Layer(this, this.imageLayer1, 0.0);
      this.imageLayer2 = new Image(60,40);
      this.imageLayer2.src = "assets/img/background/plx-2.png";
      const layer2 = new Layer(this, this.imageLayer2, 0.3);
      this.imageLayer3 = new Image(60,40);
      this.imageLayer3.src = "assets/img/background/plx-3.png";
      const layer3 = new Layer(this, this.imageLayer3, 0.4);
      this.imageLayer4 = new Image(60,40);
      this.imageLayer4.src = "assets/img/background/plx-4.png";
      const layer4 = new Layer(this, this.imageLayer4, 0.6);
      this.imageLayer5 = new Image(60,40);
      this.imageLayer5.src = "assets/img/background/plx-5.png";
      const layer5 = new Layer(this, this.imageLayer5, 0.9);
      this.imageGround = new Image(60,40);
      this.imageGround.src = "assets/img/background/ground.png";
      const layerGround = new Layer(this, this.imageGround, 1);
      this.layers = [layer1, layer2, layer3, layer4, layer5, layerGround];
    }
    draw(context: CanvasRenderingContext2D) {
      this.layers.forEach((layer) => {
        layer.draw(context);
      });
    }
    update() {
      this.layers.forEach((layer) => {
        layer.update();
      });
    }
  }