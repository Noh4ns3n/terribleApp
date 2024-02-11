/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect } from "react";
// import { Effect } from "../../other_applications/particleSystems1/model/Effect.model";

interface ParticleSystemProps {
  folderPath: string;
}

const ParticleSystem1 = ({ folderPath }: ParticleSystemProps) => {
  useEffect(() => {
    const modulePath = `../../other_applications/${folderPath}/model/Effect.model.ts`;
    import(modulePath)
      .then((effectModule) => {
        const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let animationId: number;
        const effect = new effectModule.Effect(canvas);

        const animate = () => {
          effect.context.clearRect(0, 0, canvas.width, canvas.height);
          effect.handleParticles();
          animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
          cancelAnimationFrame(animationId);
        };
      })
      .catch((error) => {
        console.error("Erreur lors de l'importation du module : ", error);
      });
  }, [folderPath]);

  return (
    <>
      <canvas id="canvas1"></canvas>
      {folderPath === "particleSystem2" && <h2 id="caption">Zog Zog</h2>}
    </>
  );
};

export default ParticleSystem1;
