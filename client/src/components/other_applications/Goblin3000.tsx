import { useEffect, useRef, useState } from "react";
import { Game } from "../../other_applications/goblin3000/model/Game.ts";

const Goblin3000 = () => {
  const refCanvas1 = useRef<HTMLCanvasElement>(null);
  const refCanvas2 = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    // 1 = Game, 2 = HUD
    const canvas = refCanvas1.current as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const canvas2 = refCanvas2.current as HTMLCanvasElement;
    const rect2 = canvas2.getBoundingClientRect();
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const ctx2 = canvas2.getContext("2d") as CanvasRenderingContext2D;
    const game = new Game({
      context: ctx,
      context2: ctx2,
      rect1: rect,
      rect2,
      active,
    });

    if (active) {
      game.animatePreparation(0);
    }

    return () => {
      console.log("Component is unmounting");
      if (game.gameStarted) game.cleanup();
    };
  }, [active]);

  return (
    <>
      <div className="body-goblin3000">
        <div id="container-goblin3000 test">
          <canvas width={768} height={432} id="canvas1-goblin3000" ref={refCanvas1} />
          <canvas width={768} height={108} id="canvas2-goblin3000" ref={refCanvas2} />
        </div>
        <button
          style={{ position: "relative", zIndex: "100" }}
          id="button-goblin3000"
          onClick={() => {
            setActive(!active);
          }}
        />
      </div>
    </>
  );
};

export default Goblin3000;
