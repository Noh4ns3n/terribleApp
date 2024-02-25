import { STATES } from "../const/const";
import { Background } from "./Background";
import { Enemy } from "./Enemy";
import { Game } from "./Game";
import { InputHandler } from "./InputHandler";
import {
  State,
  Running,
  Jumping,
  Falling,
  Still,
  Attacking,
  Preparing,
} from "./States";

type Animations = "alerted" | "still" | "running" | "attacking";
type Facings = "L" | "R";

type AnimationSide = {
  [Animation in Animations]: {
    [Facing in Facings]: HTMLImageElement;
  };
};

export class Player {
  facing: Facings;
  animation: Animations;
  readyToGainLife: boolean;
  healthpoints: number;
  startingHealthpoints: number;
  width: number;
  height: number;
  leftLimit: number;
  rightLimit: number;
  yOffset: number;
  groundLimit: number;
  traveledX: number;
  x: number;
  y: number;
  speedX: number;
  speedXModifier: number;
  speedXAirModifier: number;
  speedY: number;
  jumpCooldown: number;
  lastJump: number;
  weight: number;
  sourceWidth: number;
  sourceHeight: number;
  maxFrameCol: number;
  maxFrameRow: number;
  frame: number;
  frameCol: number;
  frameRow: number;
  fps: number;
  frameTimer: number;
  background: Background;
  game: Game;
  states: State[];
  specialStates: string[];
  currentState: any;
  hitboxRadius: number;
  hitboxXOffset: number;
  hitboxYOffset: number;
  hitboxXCenter: number;
  hitboxYCenter: number;
  images: AnimationSide | null;
  lastAttack: number;
  attackCooldown: number;
  attackDuration: number;
  attackIndicated: boolean;
  soundAxeReady: HTMLAudioElement;
  soundAxeHit: HTMLAudioElement;

  constructor(game: Game) {
    this.game = game;
    this.facing = "R"; // R = right, L = left
    this.animation = "still";
    this.startingHealthpoints = 6;
    this.healthpoints = this.startingHealthpoints;
    this.readyToGainLife = true;
    this.width = 66; // displayed width
    this.height = 61; // displayed height
    this.leftLimit = this.game.width / 5;
    this.rightLimit = this.game.width - this.game.width / 5 - this.width;
    this.yOffset = -22; // account for character position offset on spritesheet
    this.groundLimit = this.game.height - this.height + this.yOffset;
    this.x = this.game.width / 3 - this.width / 2;
    this.y = this.groundLimit;
    this.speedX = 0;
    this.speedXModifier = 4;
    this.speedXAirModifier = 5;
    this.traveledX = 0;
    this.speedY = 0;
    this.jumpCooldown = 500;
    this.lastJump = this.jumpCooldown;
    this.weight = 1.2;
    this.sourceWidth = 66; // width of each sprite on spritesheet
    this.sourceHeight = 61; // height of each sprite on spritesheet
    this.maxFrameCol = 6; // number of columns on spritesheet
    this.maxFrameRow = 4; // number or rows on spritesheet
    this.frame = 0;
    this.frameCol = this.frame % this.maxFrameCol;
    this.frameRow = Math.floor(this.frame / this.maxFrameCol);
    this.fps = 15;
    this.frameTimer = 0;
    this.hitboxRadius = this.width / 3;
    this.hitboxXOffset = 2.6;
    this.hitboxYOffset = 1.8;
    this.hitboxXCenter = this.x + this.width / this.hitboxXOffset;
    this.hitboxYCenter = this.y + this.height / this.hitboxYOffset;
    this.attackCooldown = 2000;
    this.lastAttack = 0;
    this.attackDuration = 500;
    this.soundAxeReady = new Audio("assets/audio/axe/axe_unsheath.mp3");
    this.soundAxeHit = new Audio("assets/audio/axe/axe_hit.mp3");
    this.attackIndicated = true;
    this.images = {
      alerted: {
        L: null,
        R: null,
      },
      attacking: {
        L: null,
        R: null,
      },
      running: {
        L: null,
        R: null,
      },
      still: {
        L: null,
        R: null,
      },
    };

    this.images.alerted.L = new Image(60, 45);
    this.images.alerted.L.src =
      "assets/img/characters/goblin/goblin_alerted_L_spritesheet.png";

    this.images.alerted.R = new Image(60, 45);
    this.images.alerted.R.src =
      "assets/img/characters/goblin/goblin_alerted_R_spritesheet.png";

    this.images.attacking.L = new Image(60, 45);
    this.images.attacking.L.src =
      "assets/img/characters/goblin/goblin_attacking_L_spritesheet.png";

    this.images.attacking.R = new Image(60, 45);
    this.images.attacking.R.src =
      "assets/img/characters/goblin/goblin_attacking_R_spritesheet.png";

    this.images.running.L = new Image(60, 45);
    this.images.running.L.src =
      "assets/img/characters/goblin/goblin_running_L_spritesheet.png";

    this.images.running.R = new Image(60, 45);
    this.images.running.R.src =
      "assets/img/characters/goblin/goblin_running_R_spritesheet.png";

    this.images.still.L = new Image(60, 45);
    this.images.still.L.src =
      "assets/img/characters/goblin/goblin_still_L_spritesheet.png";

    this.images.still.R = new Image(60, 45);
    this.images.still.R.src =
      "assets/img/characters/goblin/goblin_still_R_spritesheet.png";

    this.states = [
      new Still(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Attacking(this.game),
      new Preparing(this.game),
    ];
    this.currentState = this.states[STATES.PREPARING];
    this.specialStates = ["JUMPING", "ATTACKING", "FALLING", "PREPARING"];
  }

  update(input: InputHandler, deltaTime: number) {
    if (this.game.debug) {
      console.log("this.currentState :>> ", this.currentState);
      console.log("this.speedX :>> ", this.speedX);
      console.log("this.speedY :>> ", this.speedY);
      console.log("this.traveledX :>> ", this.traveledX);
    }

    this.lastAttack -= deltaTime;
    this.lastJump += deltaTime;
    this.traveledX += this.speedX;

    // if not in special state (attacking, jumping), using generic inputs from player
    if (this.specialStates.includes(this.currentState.state)) {
      this.currentState.handleInput(input);
    } else {
      this.handleInput(input);
    }

    if (!this.attackIndicated && this.lastAttack - 200 <= this.game.deltaTime) {
      this.soundAxeReady.play();
      this.attackIndicated = true;
    }

    this.checkCollision();
    this.checkBoundaries();
    this.animateSpritesheet(deltaTime);
    if(this.healthpoints <= 0 && this.game.gameStarted) this.game.gameOver = true;
  }

  draw(context: CanvasRenderingContext2D) {
    // see https://www.youtube.com/watch?v=7JtLHJbm0kA&t=830s
    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.hitboxXCenter,
        this.hitboxYCenter,
        this.hitboxRadius,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.beginPath();
      context.moveTo(this.rightLimit + 48, 0);
      context.lineTo(this.rightLimit + 48, this.game.height);
      context.moveTo(this.leftLimit + 15, 0);
      context.lineTo(this.leftLimit + 15, this.game.height);
      context.stroke();
    }
    context.drawImage(
      this.images[this.animation][this.facing],
      this.frameCol * this.sourceWidth, // sx
      this.frameRow * this.sourceHeight, // sy
      this.width, // sw
      this.height, // sh
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  handleInput(input: InputHandler) {
    // ----- MOVEMENT
    // horizontal movement
    if (input.keys.includes("ArrowRight")) {
      if (this.onGround()) this.game.player.setState(STATES.RUNNING);
      this.game.player.facing = "R";
      this.game.player.speedX =
        this.game.player.speedXModifier * this.game.speed;
    } else if (input.keys.includes("ArrowLeft")) {
      if (this.onGround()) this.game.player.setState(STATES.RUNNING);
      this.game.player.facing = "L";
      this.game.player.speedX =
        -this.game.player.speedXModifier * this.game.speed;
    } else {
      this.speedX = 0;
    }

    // vertical movement
    if (
      input.keys.includes("ArrowUp") &&
      this.onGround() &&
      this.lastJump > this.jumpCooldown
    ) {
      this.game.player.setState(STATES.JUMPING);
      this.lastJump = 0;
      this.speedY -= 20;
    }

    this.x += this.speedX * (this.game.deltaTime / 8);
    this.y += this.speedY * (this.game.deltaTime / 10);

    if (!this.onGround()) {
      this.speedY += this.weight * (this.game.deltaTime / 10);
    } else {
      this.speedY = 0;
    }

    // ----- STATES
    if (this.currentState.state === "JUMPING" && this.speedY > this.weight) {
      this.setState(STATES.FALLING);
    }

    if (
      (input.keys.includes("a") || input.keys.includes("ArrowDown")) &&
      this.lastAttack <= this.game.deltaTime
    ) {
      this.setState(STATES.ATTACKING);
    }

    if (
      this.onGround() &&
      this.currentState.state !== "ATTACKING" &&
      this.speedX === 0
    ) {
      this.setState(STATES.STILL);
    }
  }

  checkBoundaries() {
    // horizontal boundaries
    if (this.x < this.leftLimit) {
      this.x = this.leftLimit;
      this.game.background.speedX =
        -(this.speedX * this.game.speed) * (this.game.deltaTime / 10);
    } else if (this.x > this.rightLimit) {
      this.x = this.rightLimit;
      this.game.background.speedX =
        -this.speedX * this.game.speed * (this.game.deltaTime / 10);
    } else {
      this.game.background.speedX = 0;
    }

    // vertical boundaries
    if (this.y > this.groundLimit) this.y = this.groundLimit;
  }

  animateSpritesheet(deltaTime: number) {
    // ----- ANIMATION
    // update player frame only when above fps interval
    if (this.frameTimer > 1000 / this.fps) {
      this.frameTimer = 0;
      // if reached end of spritesheet, repositions to start of spritesheet
      if (this.frame === this.maxFrameRow * this.maxFrameCol - 1) {
        this.frame = 0;
      } else {
        this.frame++;
      }
      // cycle through spritesheet rows/columns
      this.frameCol = this.frame % this.maxFrameCol;
      this.frameRow = Math.floor(this.frame / this.maxFrameCol);
    } else {
      this.frameTimer += deltaTime;
    }
  }

  checkGainLife() {
    if (
      this.readyToGainLife &&
      this.game.score >= 10 &&
      (this.game.score % 10 === 0 || this.game.score % 10 === 1)
    ) {
      this.healthpoints+=1;
      this.readyToGainLife = false;
      if (this.healthpoints > this.startingHealthpoints) {
        this.startingHealthpoints = this.healthpoints;
      }
      this.game.displayHearts();
    } else {
      this.readyToGainLife = true;
    }
  }

  checkCollision() {
    // change hitbox position depending on where player is facing
    if (this.facing === "R") {
      this.hitboxXCenter = this.x + this.width / this.hitboxXOffset;
      this.hitboxYCenter = this.y + this.height / this.hitboxYOffset;
    } else {
      this.hitboxXCenter = this.x + 12 + this.width / this.hitboxXOffset;
      this.hitboxYCenter = this.y + this.height / this.hitboxYOffset;
    }

    this.game.enemies.forEach((enemy: Enemy) => {
      const dx =
        enemy.x + enemy.width / enemy.hitboxXOffset - this.hitboxXCenter;
      const dy =
        enemy.y + enemy.height / enemy.hitboxYOffset - this.hitboxYCenter;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < enemy.hitboxRadius + this.hitboxRadius) {
        if (
          this.currentState !== this.states[STATES.ATTACKING] &&
          !enemy.hurt
        ) {
          this.healthpoints--;
          this.speedX = -10;
          this.speedY = -15;
          this.game.displayHearts();
        } else if (this.currentState === this.states[STATES.ATTACKING]) {
          if (!enemy.hurt) {
            this.game.score++;
            this.checkGainLife();
          }

          enemy.hurt = true;
          enemy.frame = 0;
          enemy.animation = "dying";
          enemy.playSound();

          while (enemy.speedX > enemy.weight) {
            enemy.speedX -= enemy.weight * 0.9;
          }
        }
      }
    });
  }

  setState(state: number) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }

  onGround() {
    return this.y >= this.game.height - this.height + this.yOffset;
  }
}
