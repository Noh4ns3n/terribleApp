import { Background } from "./Background";

export   class Layer {
  background: Background;
  width: number;
  height: number;
  image: HTMLImageElement;
  speedModifier: number;
  x: number;
  x2: number;
  y: number;
  speed: number;
  constructor(background, image, speedModifier) {
    this.background = background;
    this.width = this.background.width;
    this.height = this.background.height;
    this.image = image;
    this.speedModifier = speedModifier;
    this.x = 0;
    this.x2 = 0;
    this.y = 0;
    this.speed = this.background.speedX * this.speedModifier;
  }
  update() {
    this.speed = this.background.speedX * this.speedModifier;
    this.x = this.x + this.speed;
    // reset image1 position if off-limits
    if (this.x < 0 - this.width) {
      this.x = 0;
    } else if (this.x > this.width) {
      this.x = 0;
    }
    // positions image2 to left or right
    if (this.x <= 0) {
      this.x2 = this.x + this.width;
    } else {
      this.x2 = this.x - this.width;
    }
  }
  draw(context : CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(this.image, this.x2, this.y, this.width, this.height);
  }
}