import { useEffect } from "react";
import { Game } from "../../other_applications/goblin3000/model/Game.ts";

interface Goblin3000Props {
    active: boolean;
  }

const Goblin3000 = ({ active }: Goblin3000Props) => {
  useEffect(() => {
    // 1 = Game, 2 = HUD
    const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const canvas2 = document.getElementById("canvas2") as HTMLCanvasElement;
    const rect2 = canvas2.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas2.width = rect2.width;
    canvas2.height = rect2.height;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const ctx2 = canvas2.getContext("2d") as CanvasRenderingContext2D;
    let game : Game;

    if(!active) {
        game = new Game(ctx, ctx2);
        game.animatePreparation(0);
    }

    return () => {
      console.log("Component is unmounting");
      if(game) game.cleanup();
    };
  }, [active]);

  return (
    <>
      <div id="container">
        <canvas id="canvas1" />
        <div id="containerHUD">
          <canvas id="canvas2" />
        </div>
      </div>
      <button onClick={() => {active = !active
    console.log("active :>> ", active);}} />
    </>
  );
};

export default Goblin3000;
