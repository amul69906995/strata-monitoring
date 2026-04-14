import  { useRef, useEffect, useState } from "react";

const PanelSnapshot = ({ snapshot, instrunmentsData, index }) => {
  const gridWidth = 950;
  const gridHeight = 520;
  const canvasRef = useRef(null);

  // cursor state: { inside: bool, x: number, y: number }
  const [cursor, setCursor] = useState({ inside: false, x: 0, y: 0 });

  //new codes
  const drawPillars = (ctx, pillars) => {
  if (!pillars || pillars.length === 0) return;

  let maxX = -Infinity, minX = Infinity;
  let maxY = -Infinity, minY = Infinity;

  pillars.forEach(p => {
    p.coordinates.forEach(coord => {
      maxX = Math.max(maxX, coord.x);
      minX = Math.min(minX, coord.x);
      maxY = Math.max(maxY, coord.y);
      minY = Math.min(minY, coord.y);
    });
  });

  const width = maxX - minX;
  const height = maxY - minY;

  const scale = Math.max(width, height);
  const finalScale = Math.min(950, 520) / scale;

  const drawPolygon = (points, status) => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();

    ctx.fillStyle = status === "extracted" ? "grey" : "black";
    ctx.fill();

    ctx.strokeStyle = "red";
    ctx.stroke();
  };

  pillars.forEach(p => {
    const points = p.coordinates.map(c => ({
      x: (c.x - minX) * finalScale,
      y: (c.y - minY) * finalScale,
    }));

    drawPolygon(points, p.status);
  });
};







  ///

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;

    // set CSS size
    canvas.style.width = `${gridWidth}px`;
    canvas.style.height = `${gridHeight}px`;

    // set backing store size for crispness
    canvas.width = Math.round(gridWidth * dpr);
    canvas.height = Math.round(gridHeight * dpr);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // clear and draw
    ctx.clearRect(0, 0, gridWidth, gridHeight);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, gridWidth, gridHeight);

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, gridWidth - 2, gridHeight - 2);

    drawPillars(ctx, snapshot?.pillars);

    // no cleanup necessary here; event listeners handled separately
  }, [gridWidth, gridHeight, snapshot, instrunmentsData, index]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // handle pointer events (works for mouse + touch)
    function handlePointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      // client coordinates -> CSS pixels relative to top-left of canvas
      const cssX = e.clientX - rect.left;
      const cssY = e.clientY - rect.top;

      // clamp inside [0, gridWidth/gridHeight]
      const x = Math.max(0, Math.min(gridWidth, cssX));
      const y = Math.max(0, Math.min(gridHeight, cssY));

      setCursor({ inside: true, x: Math.round(x), y: Math.round(y) });
    }

    function handlePointerLeave() {
      setCursor((c) => ({ ...c, inside: false }));
    }

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("pointercancel", handlePointerLeave);

    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointercancel", handlePointerLeave);
    };
  }, [gridWidth, gridHeight]);

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{ width: gridWidth, height: gridHeight, boxSizing: "border-box" }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Panel grid"
          style={{ display: "block", width: gridWidth, height: gridHeight }}
        />
      </div>

      {/* Tool pit on the right */}
      <div
        aria-hidden={!cursor.inside}
        style={{
          width: 220,
          minHeight: 80,
          padding: 12,
          borderRadius: 8,
          background: "#ffffff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'",
          fontSize: 13,
          color: "#111",
          border: "1px solid #e6edf6",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Cursor</div>

        {cursor.inside ? (
          <>
            <div style={{ marginBottom: 6 }}>
              <div style={{ color: "#555", fontSize: 12 }}>Pixel (x, y)</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>{`${cursor.x}, ${cursor.y}`}</div>
            </div>
            <div style={{ color: "#666", fontSize: 12, marginTop: 6 }}>
              Move cursor over the canvas to inspect coordinates. When you leave the canvas the tool hides.
            </div>
          </>
        ) : (
          <div style={{ color: "#888" }}>Move pointer over the canvas to see coordinates</div>
        )}
      </div>
    </div>
  );
};

export default PanelSnapshot;



