const canvas = document.getElementById("data-network");

if (canvas) {
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let nodes = [];
  let animationFrame;

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(36, Math.min(92, Math.floor(width / 18)));
    nodes = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      size: index % 7 === 0 ? 2.1 : 1.35,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

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
        const limit = width < 720 ? 96 : 138;

        if (distance < limit) {
          const alpha = (1 - distance / limit) * 0.18;
          ctx.strokeStyle = `rgba(16, 17, 20, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((node) => {
      ctx.fillStyle = "rgba(15, 143, 114, 0.58)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
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
