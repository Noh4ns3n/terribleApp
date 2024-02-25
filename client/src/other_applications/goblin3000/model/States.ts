import { STATES } from "../const/const";
import { Game } from "./Game";
import { InputHandler } from "./InputHandler";
import { Player } from "./Player";

class State {
  state: string;
  constructor(state: string) {
    this.state = state;
  }
}

class Still extends State {
  game: Game;
  constructor(game: Game) {
    super("STILL");
    this.game = game;
  }
  enter() {
    this.game.player.animation = "still";
  }
  handleInput(input: InputHandler) {}
}
class Running extends State {
  game: Game;
  constructor(game: Game) {
    super("RUNNING");
    this.game = game;
  }
  enter() {
    this.game.player.animation = "running";
  }
  handleInput(input: InputHandler) {}
}
class Jumping extends State {
  game: Game;
  constructor(game) {
    super("JUMPING");
    this.game = game;
  }
  enter() {
    this.game.player.animation = "running";
  }
  handleInput(input: InputHandler) {
    // when jumping : attack allowed, horizontal speed increased

    // horizontal movement
    if (input.keys.includes("ArrowRight")) {
      this.game.player.facing = "R";
      this.game.player.speedX =
        this.game.player.speedXAirModifier * this.game.speed;
    } else if (input.keys.includes("ArrowLeft")) {
      this.game.player.facing = "L";
      this.game.player.speedX =
        -this.game.player.speedXAirModifier * this.game.speed;
    } else {
      this.game.player.speedX = 0;
    }

    // update position
    this.game.player.x += this.game.player.speedX * (this.game.deltaTime / 8);
    this.game.player.y += this.game.player.speedY * (this.game.deltaTime / 10);

    if (
      (input.keys.includes("a") || input.keys.includes("ArrowDown")) &&
      this.game.player.lastAttack <= this.game.deltaTime
    ) {
      this.game.player.setState(STATES.ATTACKING);
    }

    // adding weight gradually
    if (!this.game.player.onGround()) {
      this.game.player.speedY +=
        this.game.player.weight * (this.game.deltaTime / 10);
    }

    // switch to falling state
    if (this.game.player.speedY > this.game.player.weight) {
      this.game.player.setState(STATES.FALLING);
    }
  }
}
class Falling extends State {
  game: Game;
  constructor(game: Game) {
    super("FALLING");
    this.game = game;
  }
  enter() {
    this.game.player.animation = "running";
  }
  handleInput(input: InputHandler) {
    // when falling : attack allowed, horizontal speed increased

    // horizontal movement (speedXAirModifier)
    if (input.keys.includes("ArrowRight")) {
      this.game.player.facing = "R";
      this.game.player.speedX =
        this.game.player.speedXAirModifier * this.game.speed;
    } else if (input.keys.includes("ArrowLeft")) {
      this.game.player.facing = "L";
      this.game.player.speedX =
        -this.game.player.speedXAirModifier * this.game.speed;
    } else {
      this.game.player.speedX = 0;
    }

    // update position
    this.game.player.x += this.game.player.speedX * (this.game.deltaTime / 8);
    this.game.player.y += this.game.player.speedY * (this.game.deltaTime / 10);

    if (
      (input.keys.includes("a") || input.keys.includes("ArrowDown")) &&
      this.game.player.lastAttack <= this.game.deltaTime
    ) {
      this.game.player.setState(STATES.ATTACKING);
    }

    // adding weight gradually, stop on ground
    if (!this.game.player.onGround()) {
      this.game.player.speedY +=
        this.game.player.weight * (this.game.deltaTime / 10);
    } else {
      this.game.player.speedY = 0;
    }

    // return to still state
    if (
      this.game.player.onGround() &&
      this.game.player.currentState.state !== "ATTACKING"
    ) {
      this.game.player.setState(STATES.STILL);
    }
  }
}
class Attacking extends State {
  game: Game;
  attackTimer: number;

  constructor(game: Game) {
    super("ATTACKING");
    this.game = game;
  }
  enter() {
    this.game.player.frame = 0;
    this.game.player.animation = "attacking";
    this.game.player.lastAttack = this.game.player.attackCooldown;
    this.game.player.attackIndicated = false;
    this.game.player.soundAxeHit.play();
    this.attackTimer = this.game.player.attackDuration;
  }
  handleInput(input: InputHandler) {
    // remains in attacking state for duration = attackTimer
    this.attackTimer -= this.game.deltaTime;
    if (this.attackTimer <= this.game.deltaTime) {
      this.game.player.setState(STATES.STILL);
    }

    // horizontal movement
    if (input.keys.includes("ArrowRight")) {
      this.game.player.facing = "R";
      this.game.player.speedX =
        this.game.player.speedXModifier * this.game.speed;
    } else if (input.keys.includes("ArrowLeft")) {
      this.game.player.facing = "L";
      this.game.player.speedX =
        -this.game.player.speedXModifier * this.game.speed;
    } else {
      this.game.player.speedX = 0;
    }

    // vertical movement
    if (!this.game.player.onGround()) {
      this.game.player.speedY +=
        this.game.player.weight * (this.game.deltaTime / 10);
    } else {
      this.game.player.speedY = 0;
    }
    if (
      input.keys.includes("ArrowUp") &&
      this.game.player.lastJump > this.game.player.jumpCooldown
    ) {
      this.game.player.lastJump = 0;
      this.game.player.speedY -= 20;
    }

    // update position
    this.game.player.x += this.game.player.speedX * (this.game.deltaTime / 8);
    this.game.player.y += this.game.player.speedY * (this.game.deltaTime / 10);
  }
}

class Preparing extends State {
  game: Game;
  attackTimer: number;
  constructor(game: Game) {
    super("PREPARING");
    this.game = game;
  }
  enter() {
    this.game.player.animation = "still";
  }
  handleInput(input: InputHandler) {
    this.attackTimer -= this.game.deltaTime;

    // special state before game starts
    if (input.keys.includes("r")) {
      if (this.game.gameOver === true) {
        this.game.resetGame();
      } else {
        this.game.context.clearRect(0, 0, this.game.width, this.game.height);
        this.game.gameStarted = true;
        this.game.player.setState(STATES.STILL);
      }
    }

    // horizontal movement (speedXAirModifier)
    if (input.keys.includes("ArrowRight")) {
      this.game.player.facing = "R";
      this.game.player.animation = "running";
      this.game.player.speedX =
        this.game.player.speedXModifier * this.game.speed;
    } else if (input.keys.includes("ArrowLeft")) {
      this.game.player.facing = "L";
      this.game.player.animation = "running";
      this.game.player.speedX =
        -this.game.player.speedXModifier * this.game.speed;
    } else {
      this.game.player.speedX = 0;
    }

    // jump
    if (
      input.keys.includes("ArrowUp") &&
      this.game.player.lastJump > this.game.player.jumpCooldown
    ) {
      this.game.player.lastJump = 0;
      this.game.player.speedY -= 20;
    }

    // update position
    this.game.player.x += this.game.player.speedX * (this.game.deltaTime / 8);
    this.game.player.y += this.game.player.speedY * (this.game.deltaTime / 10);

    if (!this.game.player.onGround()) {
      this.game.player.speedY +=
        this.game.player.weight * (this.game.deltaTime / 10);
    } else {
      this.game.player.speedY = 0;
    }

    // attack
    if (
      (input.keys.includes("a") || input.keys.includes("ArrowDown")) &&
      this.game.player.lastAttack <= this.game.deltaTime &&
      this.game.player.animation !== "attacking"
    ) {
      this.game.player.frame = 0;
      this.game.player.animation = "attacking";
      this.game.player.lastAttack = this.game.player.attackCooldown;
      this.game.player.attackIndicated = false;
      this.game.player.soundAxeHit.play();
      this.attackTimer = this.game.player.attackDuration;
    }
    if (this.attackTimer <= this.game.deltaTime) {
      this.game.player.animation = "still";
      this.attackTimer = this.game.player.attackDuration;
    }

    if (
      this.game.player.speedX === 0 &&
      this.game.player.animation !== "attacking"
    ) {
      this.game.player.animation = "still";
    }
  }
}

export { State, Still, Running, Jumping, Falling, Attacking, Preparing };
