import { useEffect, useRef } from "react";
import Effect from "../../other_applications/particleSystem1/model/Effect.model";
import Effect2 from "../../other_applications/particleSystem2/model/Effect.model";

interface ParticleSystemProps {
  folderPath: string;
}

const ParticleSystem = ({ folderPath }: ParticleSystemProps) => {
  const animationIdRef = useRef<number>();
  let effect: Effect;

  useEffect(() => {
    const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    folderPath === "particleSystem1"
      ? (effect = new Effect(canvas))
      : (effect = new Effect2(canvas));
    const animate = () => {
      effect.context.clearRect(0, 0, canvas.width, canvas.height);
      effect.handleParticles();
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      console.log("Component is unmounting");
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      effect.cleanup();
    };
  }, [folderPath]);

  const changeParticleNumber = (amount: number) => {
    effect.numberOfParticles *= amount;
    effect.particles = [];
    effect.setupContext();
    effect.createParticles();
  };

  return (
    <>
      <div className="partycleSystem">
        <div className="canvasContainer">
          <canvas id="canvas1" />
          {folderPath === "particleSystem1" ? (
            <h2 id="caption" style={{ display: "none" }}>
              Zog Zog
            </h2>
          ) : (
            <h2 id="caption" style={{ position: "relative", top: "-200px" }}>
              Zog Zog
            </h2>
          )}
        </div>
        <div className="buttonsContainer">
          <button
            style={{ width: "100px", height: "100px" }}
            value={0.9}
            onClick={(e) =>
              changeParticleNumber(
                parseFloat((e.target as HTMLButtonElement).value)
              )
            }
          >
            -
          </button>
          <button
            style={{ width: "100px", height: "100px" }}
            value={1.1}
            onClick={(e) =>
              changeParticleNumber(
                parseFloat((e.target as HTMLButtonElement).value)
              )
            }
          >
            +
          </button>
        </div>
      </div>
    </>
  );
};

export default ParticleSystem;
