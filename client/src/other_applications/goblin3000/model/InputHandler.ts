import { Game } from "./Game";

export  class InputHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keys: any[];
  game: Game;
  listenedKeys: string[];
  constructor(game : Game) {
    this.game = game;
    this.keys = [];
    this.listenedKeys = ["ArrowDown","ArrowUp", "ArrowLeft", "ArrowRight", "a", "r"]
    
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }
  handleKeyUp = (e : KeyboardEvent) => {
    if (
      this.listenedKeys.includes(e.key)
    ) {
      this.keys.splice(this.keys.indexOf(e.key), 1);
    }
  }
  handleKeyDown = (e : KeyboardEvent) => {
    if (
      this.listenedKeys.includes(e.key) &&
      !this.keys.includes(e.key)
      ) {
        this.keys.push(e.key);
      } else if (e.key === "d") {
        this.game.debug = !this.game.debug;
      }
  }

}