const canvas = document.getElementById("data-network");

if (canvas) {
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let nodes = [];
  let animationFrame;
  let tick = 0;

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(56, Math.min(140, Math.floor(width / 13)));
    nodes = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
      size: index % 9 === 0 ? 2.4 : 1.25,
      pulse: Math.random() * Math.PI * 2,
      depth: 0.45 + Math.random() * 0.9,
    }));
  };

  const draw = () => {
    tick += 0.008;
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(width * 0.68, height * 0.36, 0, width * 0.68, height * 0.36, width * 0.62);
    gradient.addColorStop(0, "rgba(15, 143, 114, 0.12)");
    gradient.addColorStop(0.42, "rgba(157, 123, 47, 0.06)");
    gradient.addColorStop(1, "rgba(251, 251, 248, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    nodes.forEach((node) => {
      node.x += node.vx * node.depth;
      node.y += node.vy * node.depth;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const limit = width < 720 ? 102 : 164;

        if (distance < limit) {
          const alpha = (1 - distance / limit) * 0.18;
          ctx.strokeStyle = `rgba(20, 21, 24, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          if ((i + j) % 17 === 0) {
            const progress = (Math.sin(tick * 3 + i) + 1) / 2;
            ctx.fillStyle = "rgba(15, 143, 114, 0.34)";
            ctx.beginPath();
            ctx.arc(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress, 1.15, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    nodes.forEach((node) => {
      const pulse = (Math.sin(tick * 5 + node.pulse) + 1) / 2;
      ctx.fillStyle = `rgba(15, 143, 114, ${0.28 + pulse * 0.32})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size + pulse * 0.8, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!prefersReducedMotion) {
      animationFrame = requestAnimationFrame(draw);
    }
  };

  resize();
  draw();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resize();
    draw();
  });
}
