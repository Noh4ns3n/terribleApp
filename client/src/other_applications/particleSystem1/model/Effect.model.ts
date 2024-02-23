import { Particle } from "./Particle.model";

type Mouse = {
  x: number;
  y: number;
  pressed: boolean;
  radius: number;
};

export default class Effect {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  particles: Particle[];
  numberOfParticles: number;
  mouse: Mouse;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.setupContext();
    this.particles = [];
    this.numberOfParticles = 400;
    this.createParticles();

    this.mouse = {
      x: 0,
      y: 0,
      pressed: false,
      radius: 150,
    };

    window.addEventListener("resize", this.handleResize);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  handleResize = () => {
    const rect = this.canvas.getBoundingClientRect();
    this.resize(rect.width, rect.height);
  };

  handleMouseMove = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.x - rect.left;
    this.mouse.y = e.y - rect.top;
  };

  handleMouseDown = () => {
    this.mouse.pressed = true;
  };

  handleMouseUp = () => {
    this.mouse.pressed = false;
  };

  setupContext() {
    this.context.lineWidth = 2;
    const gradient = this.context.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    gradient.addColorStop(0, "rgba(255,0,255,1)"); // Magenta
    gradient.addColorStop(0.5, "rgba(255,125,0,1)"); // Orange
    gradient.addColorStop(1, "rgba(30,0,255,1)"); // Deep Blue
    this.context.fillStyle = gradient;
    this.context.strokeStyle = "crimson";
  }

  createParticles = () => {
    for (let i: number = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  };

  handleParticles = () => {
    this.connectParticles();
    this.particles.forEach((particle) => {
      particle.draw();
      particle.update();
    });
  };

  connectParticles = () => {
    const maxDistance: number = 100;
    // allows comparison of every particle, with every other particle
    for (let a: number = 0; a < this.particles.length; a++) {
      for (let b: number = a; b < this.particles.length; b++) {
        const dx: number = this.particles[a].x - this.particles[b].x;
        const dy: number = this.particles[a].y - this.particles[b].y;
        const distance: number = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          // context save and restore allows to change context only for the specified interval
          this.context.save();
          const opacity: number = 1 - distance / maxDistance;
          this.context.globalAlpha = opacity;
          this.context.beginPath();
          this.context.moveTo(this.particles[a].x, this.particles[a].y);
          this.context.lineTo(this.particles[b].x, this.particles[b].y);
          this.context.stroke();
          this.context.restore();
        }
      }
    }
  };

  resize = (width: number, height: number) => {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.setupContext();

    this.particles.forEach((particle) => {
      if (
        particle.x < particle.radius ||
        particle.x > this.canvas.width - particle.radius ||
        particle.y < particle.radius ||
        particle.y > this.canvas.height - particle.radius
      )
        particle.reset();
    });
  };

  cleanup = () => {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
    this.particles = [];
    this.canvas = null!;
    this.context = null!;
    this.mouse = null!;
  };
}
