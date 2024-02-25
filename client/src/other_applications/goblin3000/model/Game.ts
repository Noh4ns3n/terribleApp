import { IMG_HEARTS, STATES } from "../const/const";
import { Background } from "./Background";
import { Enemy } from "./Enemy";
import { InputHandler } from "./InputHandler";
import { Player } from "./Player";
// import "../scripts/require.js";

export class Game {
  input: InputHandler;
  background: Background;
  player: Player;
  music: HTMLAudioElement;
  musicStarted: boolean;
  height: number;
  width: number;
  lastTime: number;
  deltaTime: number;
  enemyInterval: number;
  randomEnemyInterval: number;
  enemyIntervalReduction: number;
  enemyTimer: number;
  enemies: Enemy[];
  context: CanvasRenderingContext2D;
  context2: CanvasRenderingContext2D;
  debug: boolean;
  score: number;
  speed: number;
  gameOver: boolean;
  gameStarted: boolean;
  victory: boolean;
  spanScore: HTMLSpanElement;
  boarDeathSounds: HTMLAudioElement[];
  heartImages: HTMLImageElement[];
  framerate: number;
  lastFrame: number;
  playerLastHealth: number;
  lastScore: number;
  animationFrame!: number;

  constructor(
    context: CanvasRenderingContext2D,
    context2: CanvasRenderingContext2D
  ) {
    this.context = context;
    this.context2 = context2;
    this.height = this.context.canvas.height;
    this.width = this.context.canvas.width;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.enemyIntervalReduction = 0;
    this.enemyInterval = 1000;
    this.randomEnemyInterval = Math.random() * 1000 + 500;
    this.enemyTimer = 0;
    this.enemies = [];
    this.debug = false;
    this.score = 0;
    this.speed = 1;
    this.gameOver = false;
    this.gameStarted = false;
    this.victory = false;
    this.spanScore = document.getElementById("spanScore") as HTMLSpanElement;
    this.heartImages = this.prepareHUDImages("heart");
    this.framerate = 200;
    this.lastFrame = 0;
    this.lastScore = 0;
    this.musicStarted = false;
    this.music = new Audio("assets/audio/background/ambient_forest.mp3");
    this.boarDeathSounds = [
      new Audio("assets/audio/boar/boar_grunt1.mp3"),
      new Audio("assets/audio/boar/boar_grunt2.mp3"),
      new Audio("assets/audio/boar/boar_grunt3.mp3"),
      new Audio("assets/audio/boar/boar_grunt4.mp3"),
      new Audio("assets/audio/boar/boar_grunt5.mp3"),
      new Audio("assets/audio/boar/boar_death1.mp3"),
      new Audio("assets/audio/boar/boar_death2.mp3"),
      new Audio("assets/audio/boar/boar_death3.mp3"),
      new Audio("assets/audio/boar/boar_death4.mp3"),
    ];
    this.input = new InputHandler(this);
    this.background = new Background(this);
    this.player = new Player(this);
    this.playerLastHealth = this.player.startingHealthpoints;
  }

  resetGame() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.enemies = [];

    this.player.healthpoints = 6;
    this.player.x = this.player.game.width / 3 - this.player.width / 2;
    this.player.y = this.player.groundLimit;
    this.player.lastJump = this.player.jumpCooldown;
    this.player.lastAttack = 0;
    this.player.attackIndicated = true;
    this.player.currentState = this.player.states[STATES.PREPARING];
    this.player.facing = "R"; // R = right, L = left
    this.player.animation = "still";

    this.gameOver = false;
    this.gameStarted = false;
    this.enemyInterval = 1000;
    this.score = 0;
    this.lastScore = 0;
    this.input = new InputHandler(this);
    this.background = new Background(this);
    this.debug = false;
    this.animatePreparation(0);
  }

  prepareHUDImages(keyword: string): HTMLImageElement[] {
    if (keyword === "heart") {
      const imagesHUD = [new Image(), new Image(), new Image()];
      imagesHUD[0].src = "assets/img/display/heart_full.png";
      imagesHUD[0].width = 50;
      imagesHUD[1].src = "assets/img/display/heart_half.png";
      imagesHUD[1].width = 50;
      imagesHUD[2].src = "assets/img/display/heart_empty.png";
      imagesHUD[2].width = 50;
      return imagesHUD;
    }
    return [];
  }

  playMusic() {
    this.music.play();
    this.music.addEventListener(
      "ended",
      function () {
        this.currentTime = 0;
        this.play();
      },
      false
    );
  }

  handleEnemies(deltaTime: number) {
    if (this.enemyTimer > this.enemyInterval + this.randomEnemyInterval) {
      this.enemies.push(new Enemy(this));

      // max random enemy interval reduction based on score
      if (this.score <= 100) {
        this.randomEnemyInterval = Math.random() * 1000;
      } else if (this.score <= 200) {
        this.randomEnemyInterval = Math.random() * 900;
      } else if (this.score <= 300) {
        this.randomEnemyInterval = Math.random() * 800;
      } else if (this.score <= 400) {
        this.randomEnemyInterval = Math.random() * 700;
      } else if (this.score <= 500) {
        this.randomEnemyInterval = Math.random() * 600;
      } else if (this.score <= 600) {
        this.randomEnemyInterval = Math.random() * 500;
      } else if (this.score <= 700) {
        this.randomEnemyInterval = Math.random() * 400;
      } else if (this.score <= 800) {
        this.randomEnemyInterval = Math.random() * 300;
      } else if (this.score <= 900) {
        this.randomEnemyInterval = Math.random() * 200;
      } else {
        this.randomEnemyInterval = Math.random() * 100;
      }

      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }
    this.enemies.forEach((enemy) => {
      enemy.draw(this.context);
      enemy.update(deltaTime);
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    });
  }

  reduceEnemyInterval() {
    // enemyInterval 5% reduction every 10 score points
    if (this.score > this.lastScore + 10) {
      this.lastScore = this.score;
      this.enemyInterval *= 0.95;
    }
  }

  grayscaleCanvas() {
    const imageData: ImageData = this.context.getImageData(
      0,
      0,
      this.width,
      this.height
    ) as ImageData;
    const data: Uint8ClampedArray = imageData.data as Uint8ClampedArray;
    for (let i = 0; i < data.length; i += 4) {
      const luminance: number =
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = luminance;
      data[i + 1] = luminance;
      data[i + 2] = luminance;
    }
    this.context.putImageData(imageData, 0, 0);
  }

  displayGameOver() {
    this.context2.clearRect(
      this.context2.canvas.width / 3,
      0,
      this.context2.canvas.width,
      this.context2.canvas.height
    );
    this.context2.font = "40px silkscreen";
    this.context2.fillStyle = "darkred";
    this.context2.fillText(
      "GAME OVER !",
      this.context2.canvas.width * 0.5 - 50,
      this.context2.canvas.height * 0.33
    );
    this.context2.fillText(
      "PRESS R TO RESTART",
      this.context2.canvas.width * 0.5 - 150,
      this.context2.canvas.height * 0.9
    );
  }

  displayHearts() {
    const updateHearts: boolean =
      this.playerLastHealth !== this.player.healthpoints;
    if (
      updateHearts ||
      this.player.healthpoints === 0 ||
      this.lastTime < 1000
    ) {
      this.playerLastHealth = this.player.healthpoints;
      this.context2.clearRect(
        this.context2.canvas.width / 3,
        0,
        this.context2.canvas.width,
        this.context2.canvas.height
      );
      let fullHearts: number = Math.floor(this.player.healthpoints / 2);
      let halfHeart: number = this.player.healthpoints % 2 === 1 ? 1 : 0;
      let emptyHearts: number =
        this.player.startingHealthpoints / 2 - fullHearts - halfHeart;
      const imgWidth: number = 40;
      const imgHeight: number = 40;

      let drawnHearts: number = 0;

      for (let i: number = 0; i < this.player.startingHealthpoints / 2; i++) {
        const index: number = drawnHearts <= 11 ? i : i - 12;

        const positionY: number =
          drawnHearts > 11
            ? this.context2.canvas.height / 1.5 - imgWidth / 2
            : this.context2.canvas.height / 3 - imgWidth / 2;

        // positionX = ( sizeCanvas - ( sizeImage * numberImages ) / 2 ) + ( indexImage * sizeImage )
        const positionX: number =
          this.context2.canvas.width - imgWidth * 12.5 + index * imgWidth;

        if (fullHearts > 0) {
          fullHearts--;
          this.context2.drawImage(
            this.heartImages[IMG_HEARTS.FULL],
            positionX,
            positionY,
            imgWidth,
            imgHeight
          );
          drawnHearts++;
        } else if (halfHeart > 0) {
          halfHeart--;
          this.context2.drawImage(
            this.heartImages[IMG_HEARTS.HALF],
            positionX,
            positionY,
            imgWidth,
            imgHeight
          );
          drawnHearts++;
        } else if (emptyHearts > 0) {
          emptyHearts--;
          this.context2.drawImage(
            this.heartImages[IMG_HEARTS.EMPTY],
            positionX,
            positionY,
            imgWidth,
            imgHeight
          );
          drawnHearts++;
        }
      }
    }
  }

  displayCommands() {
    this.context2.clearRect(0, 0, this.width, this.height);
    this.context2.font = "40px silkscreen";
    this.context2.fillStyle = "green";
    this.context2.fillText(
      "MOVE WITH ARROWS",
      this.context2.canvas.width * 0.5 - 230,
      this.context2.canvas.height * 0.75
    );
    this.context2.fillText(
      "ATTACK WITH A",
      this.context2.canvas.width * 0.5 - 180,
      this.context2.canvas.height * 0.25
    );
    this.context.font = "50px silkscreen";
    this.context.fillStyle = "black";
    this.context.fillText(
      "PRESS R TO START",
      this.context.canvas.width * 0.5 - 265,
      this.context.canvas.height * 0.45
    );
  }

  displayStatusText() {
    this.context2.clearRect(0, 0, this.width / 3, this.height);
    this.context2.font = "40px silkscreen";

    if (this.score >= 1000) {
      this.context2.fillStyle = "deeppink";
    } else if (this.score >= 800) {
      this.context2.fillStyle = "lime";
    } else if (this.score >= 600) {
      this.context2.fillStyle = "cyan";
    } else if (this.score >= 400) {
      this.context2.fillStyle = "darkorange";
    } else if (this.score >= 300) {
      this.context2.fillStyle = "darkmagenta";
    } else if (this.score >= 200) {
      this.context2.fillStyle = "dodgerblue";
    } else if (this.score >= 100) {
      this.context2.fillStyle = "forestgreen";
    } else if (this.score >= 50) {
      this.context2.fillStyle = "yellow";
    } else {
      this.context2.fillStyle = "white";
    }
    this.context2.fillText(
      `${this.score.toString()}`,
      this.context2.canvas.width / 6 - 70,
      this.context2.canvas.height / 3 + 13
    );
    this.context2.font = "25px silkscreen";
    this.context2.fillText(
      `score`,
      this.context2.canvas.width / 6 - 70,
      this.context2.canvas.height * 0.75 + 13
    );
  }

  animateHUD() {
    if (this.gameOver) {
      this.displayGameOver();
    } else if (this.player.currentState.state === "PREPARING") {
      this.displayCommands();
    } else {
      this.displayHearts();
      this.displayStatusText();
    }
  }

  animateGameOver = (timeStamp: number) => {
    this.deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    this.lastFrame += this.deltaTime;

    if (this.player.currentState.state !== "PREPARING") {
      this.player.setState(STATES.PREPARING);
    }

    this.player.update(this.input, this.deltaTime);
    this.grayscaleCanvas();
    this.animateHUD();

    if (this.gameOver && this.gameStarted)
      this.animationFrame = requestAnimationFrame(this.animateGameOver);
  };

  animatePreparation = (timeStamp: number) => {
    this.deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    console.log("animate");
    if (!this.musicStarted && this.player.traveledX !== 0) {
      this.playMusic();
      this.musicStarted = true;
    }

    this.context.clearRect(0, 0, this.width, this.height);
    this.background.draw(this.context);
    this.background.update();
    this.player.draw(this.context);
    this.player.update(this.input, this.deltaTime);

    this.animateHUD();

    if (!this.gameStarted) {
      this.animationFrame = requestAnimationFrame(this.animatePreparation);
    } else {
      this.player.healthpoints = 6;
      this.animate(0);
    }
  };

  animate = (timeStamp: number) => {
    this.deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    this.lastFrame += this.deltaTime;

    if (this.debug) {
      console.log("this.player :>> ", this.player);
      console.log("this.randomEnemyInterval :>> ", this.randomEnemyInterval);
      console.log("this.enemyInterval :>> ", this.enemyInterval);
    }

    if (!this.musicStarted && this.player.traveledX !== 0) {
      this.playMusic();
      this.musicStarted = true;
    }

    if (this.lastFrame > 1000 / this.framerate) {
      this.context.clearRect(0, 0, this.width, this.height);
      this.background.draw(this.context);
      this.background.update();
      this.handleEnemies(this.deltaTime);
      this.player.draw(this.context);
      this.player.update(this.input, this.deltaTime);
      this.displayStatusText();
      this.lastFrame = 0;
    }

    this.animateHUD();

    if (this.gameOver) {
      this.animateGameOver(0);
    } else this.animationFrame = requestAnimationFrame(this.animate);
  };

  cleanup = () => {
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("keydown", this.input.handleKeyDown);
    window.removeEventListener("keyup", this.input.handleKeyUp);
  };
}
