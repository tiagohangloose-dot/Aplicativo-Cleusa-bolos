import { useEffect, useRef } from 'react';

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ['#73575b', '#725a42', '#85530b', '#fedcbe', '#f4d0d4'];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Init particles
    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        // Recycle particle
        if (p.y > canvas.height) {
          particles[index] = {
            x: Math.random() * canvas.width,
            y: -10,
            size: Math.random() * 8 + 4,
            speedX: Math.random() * 3 - 1.5,
            speedY: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 4 - 2,
          };
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(() => {
      animate();
    }, 150);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      ref={canvasRef}
    />
  );
}
