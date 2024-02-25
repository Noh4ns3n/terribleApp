import { Game } from "./Game";

type Animations =
  | "still"
  | "running"
  | "turning"
  | "attacking"
  | "hurt"
  | "dying";
type Facings = "L" | "R";

type AnimationSide = {
  [Animation in Animations]: {
    [Facing in Facings]: HTMLImageElement;
  };
};

export class Enemy {
  image: HTMLImageElement | null;
  gameWidth: any;
  gameHeight: any;
  width: number;
  height: number;
  yOffset: number;
  x: any;
  y: number;
  weight: number;
  speedX: number;
  maxFrameCol: number;
  maxFrameRow: number;
  sourceWidth: number;
  sourceHeight: number;
  frame: number;
  frameCol: number;
  frameRow: number;
  fps: number;
  frameTimer: number;
  game: Game;
  hitboxRadius: number;
  hitboxXOffset: number;
  hitboxYOffset: number;
  hurt: boolean;
  hurtTimer: number;
  deathTimer: number;
  markedForDeletion: boolean;
  animation: Animations;
  facing: Facings;
  hasGrunted: boolean;
  deathSounds: HTMLAudioElement[];
  images: AnimationSide | null;

  constructor(game: Game) {
    this.game = game;
    this.width = 60; // displayed width
    this.height = 60; // displayed height
    this.x = this.game.width;
    this.yOffset = -17; // account for character offset on sprite
    this.y = this.game.height - this.height + this.yOffset;
    this.speedX = 2;
    this.weight = 0.2;
    this.hurt = false;
    this.hurtTimer = 0;
    this.deathTimer = 700;
    this.maxFrameCol = 4; // number of columns on spritesheet
    this.maxFrameRow = 2; // number or rows on spritesheet
    this.sourceWidth = 124; // width of each sprite on spritesheet
    this.sourceHeight = 124; // height of each sprite on spritesheet
    this.frame = 0;
    this.frameCol = this.frame % this.maxFrameCol;
    this.frameRow = Math.floor(this.frame / this.maxFrameCol);
    this.fps = 15;
    this.frameTimer = 0;
    this.hitboxRadius = this.width / 2.35;
    this.hitboxXOffset = 2;
    this.hitboxYOffset = 1.6;
    this.markedForDeletion = false;
    this.animation = "running";
    this.facing = "L";
    this.hasGrunted = false;
    this.deathSounds = this.game.boarDeathSounds;
    this.images = {
      still: {
        L: null,
        R: null,
      },
      running: {
        L: null,
        R: null,
      },
      turning: {
        L: null,
        R: null,
      },
      attacking: {
        L: null,
        R: null,
      },
      hurt: {
        L: null,
        R: null,
      },
      dying: {
        L: null,
        R: null,
      },
    };

    this.prepareImages();

  }

  prepareImages() {
    this.images.still.L = new Image(60, 45);
    this.images.still.L.src =
      "assets/img/characters/boar/boar_still_L_spritesheet.png";

    this.images.still.R = new Image(60, 45);
    this.images.still.R.src =
      "assets/img/characters/boar/boar_still_R_spritesheet.png";

    this.images.running.L = new Image(60, 45);
    this.images.running.L.src =
      "assets/img/characters/boar/boar_running_L_spritesheet.png";

    this.images.running.R = new Image(60, 45);
    this.images.running.R.src =
      "assets/img/characters/boar/boar_running_R_spritesheet.png";

    this.images.turning.L = new Image(60, 45);
    this.images.turning.L.src =
      "assets/img/characters/boar/boar_turning_L_spritesheet.png";

    this.images.turning.R = new Image(60, 45);
    this.images.turning.R.src =
      "assets/img/characters/boar/boar_turning_R_spritesheet.png";

    this.images.attacking.L = new Image(60, 45);
    this.images.attacking.L.src =
      "assets/img/characters/boar/boar_attacking_L_spritesheet.png";

    this.images.attacking.R = new Image(60, 45);
    this.images.attacking.R.src =
      "assets/img/characters/boar/boar_attacking_R_spritesheet.png";

    this.images.hurt.L = new Image(60, 45);
    this.images.hurt.L.src =
      "assets/img/characters/boar/boar_hurt_L_spritesheet.png";

    this.images.hurt.R = new Image(60, 45);
    this.images.hurt.R.src =
      "assets/img/characters/boar/boar_hurt_R_spritesheet.png";

    this.images.dying.L = new Image(60, 45);
    this.images.dying.L.src =
      "assets/img/characters/boar/boar_dying_L_spritesheet.png";

    this.images.dying.R = new Image(60, 45);
    this.images.dying.R.src =
      "assets/img/characters/boar/boar_dying_R_spritesheet.png";
  }

  playSound() {
    if (!this.hasGrunted) {
      this.hasGrunted = true;
      const sound = Math.floor(Math.random() * this.deathSounds.length);
      this.deathSounds[sound].play();
    }
  }

  checkForCoward() {
    if (this.game.player.x === this.game.player.leftLimit) {
      this.fps = 22;
    } else {
      this.fps = 13;
    }
  }

  checkForDeletion() {
    this.game.reduceEnemyInterval();
    if (this.x < 0 - this.width) {
      this.markedForDeletion = true;
      this.game.score+=2;
      this.game.player.checkGainLife();
    }
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.x + this.width / this.hitboxXOffset,
        this.y + this.height / this.hitboxYOffset,
        this.hitboxRadius,
        0,
        Math.PI * 2
      );
      context.stroke();
    }
    context.drawImage(
      this.images[this.animation][this.facing],
      this.frameCol * this.sourceWidth, //sx
      this.frameRow * this.sourceHeight, //sy
      this.sourceWidth, //sw
      this.sourceHeight, //sh
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  animateSpritesheet(deltaTime: number) {
    // update enemy frame only when above fps interval
    if (this.frameTimer > 1000 / this.fps) {
      // if reached end of spritesheet, repositions to start of spritesheet
      if (this.frame === this.maxFrameRow * this.maxFrameCol - 1) {
        this.frame = 0;
      } else {
        this.frame++;
      }
      this.frameTimer = 0;
      // cycle through spritesheet rows/columns
      this.frameCol = this.frame % this.maxFrameCol;
      this.frameRow = Math.floor(this.frame / this.maxFrameCol);
    } else {
      this.frameTimer += deltaTime;
    }
  }

  movement() {
    // horizontal movement
    if (
      this.game.player.x === this.game.player.rightLimit &&
      this.game.player.speedX !== 0
    ) {
      this.x -=
        (this.speedX + this.game.player.speedX) *
        this.game.speed *
        (this.game.deltaTime / 8);
    } else {
      this.x -= this.speedX * this.game.speed * (this.game.deltaTime / 6);
    }
  }

  update(deltaTime: number) {
    this.movement();
    this.animateSpritesheet(deltaTime);
    this.checkForCoward();

    if (this.hurt) {
      this.hurtTimer += this.game.deltaTime;
      if (this.hurtTimer >= this.deathTimer) {
        this.markedForDeletion = true;
      }
    }

    this.checkForDeletion();
  }
}
export class RedBoar extends Enemy {
  constructor(game: Game) {
    super(game);
    this.speedX = 3;
  }

  checkForDeletion() {
    this.game.reduceEnemyInterval();
    if (this.x < 0 - this.width) {
      this.markedForDeletion = true;
      this.game.score++;
    }
  }

  update(deltaTime: number) {
    if (this.frameTimer > 1000 / this.fps) {
      // if reached end of spritesheet, repositions to start of spritesheet
      if (this.frame === this.maxFrameRow * this.maxFrameCol - 1) {
        this.frame = 0;
      } else {
        this.frame++;
      }
      this.frameTimer = 0;
      // cycle through spritesheet rows/columns
      this.frameCol = this.frame % this.maxFrameCol;
      this.frameRow = Math.floor(this.frame / this.maxFrameCol);
    } else {
      this.frameTimer += deltaTime;
    }

    if (this.hurt) {
      this.hurtTimer += this.game.deltaTime;
      if (this.hurtTimer >= this.deathTimer) {
        this.markedForDeletion = true;
      }
    }

    // horizontal movement
    if (this.game.player.x !== this.game.player.rightLimit) {
      this.x -= this.speedX * this.game.speed;
    } else {
      this.x -= (this.speedX + this.game.player.speedX) * this.game.speed;
    }
    this.checkForDeletion();
    this.checkForCoward();
  }
}
