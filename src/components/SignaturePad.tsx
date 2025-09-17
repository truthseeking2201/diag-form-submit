import React from 'react';

type Props = {
  value?: string;
  onChange: (dataUrl?: string) => void;
};

export const SignaturePad: React.FC<Props> = ({ value, onChange }) => {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = React.useState(false);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const pos = (e: React.PointerEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: React.PointerEvent) => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drawing) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing) return;
    setDrawing(false);
    const canvas = ref.current;
    if (!canvas) return;
    onChange(canvas.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onChange(undefined);
  };

  return (
    <div>
      <div className="signature">
        <canvas
          ref={ref}
          width={720}
          height={240}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={end}
          onPointerCancel={end}
          aria-label="Signature pad"
        />
      </div>
      <div className="signature__actions">
        <button className="btn btn--ghost" onClick={clear} type="button">Clear</button>
        <span className={`pill ${value ? 'pill--ok' : ''}`}>{value ? 'Signed' : 'Not signed'}</span>
      </div>
    </div>
  );
};
