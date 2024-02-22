/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useRef } from "react";
import { Effect } from "../../other_applications/particleSystem1/model/Effect.model";

interface ParticleSystemProps {
  folderPath: string;
}
interface ParticleSystemProps {
  folderPath: string;
}

const ParticleSystem = ({ folderPath }: ParticleSystemProps) => {
  const isMounted = useRef(true);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        console.log('canvas :>> ', canvas);
        console.log('rect :>> ', rect);
        canvas.width = rect.width;
        canvas.height = rect.height;
        const effect = new Effect(canvas);

        const animate = () => {
          effect.context.clearRect(0, 0, canvas.width, canvas.height);
          effect.handleParticles();
          animationIdRef.current = requestAnimationFrame(animate);
        };
        animate();

    return () => {
      isMounted.current = false;
      console.log("Component is unmounting");
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      effect.cleanup();
    };
  }, []);

  return (
    <>
      <canvas id="canvas1"></canvas>
      {folderPath === "particleSystem2" && <h2 id="caption">Zog Zog</h2>}
    </>
  );
};

export default ParticleSystem;
