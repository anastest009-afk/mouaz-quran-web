import React, { useRef, useEffect } from 'react';

export interface WaveformCanvasProps {
  amplitudes: number[];
  isRecording: boolean;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({ amplitudes, isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const data = amplitudes.length > 0 ? amplitudes : new Array(24).fill(0.1);
    const barWidth = canvas.width / data.length;
    const centerY = canvas.height / 2;

    data.forEach((val, i) => {
      const normalized = Math.max(0.1, Math.min(1.0, val));
      const barHeight = canvas.height * normalized * 0.75;
      const x = i * barWidth + barWidth / 4;

      ctx.fillStyle = isRecording && normalized > 0.25
        ? 'var(--color-wave-active)'
        : 'var(--color-wave-inactive)';

      ctx.beginPath();
      ctx.roundRect(x, centerY - barHeight / 2, barWidth / 2, barHeight, 4);
      ctx.fill();
    });
  }, [amplitudes, isRecording]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={64}
      style={{
        width: '100%',
        height: '64px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--color-surface-subtle)',
      }}
    />
  );
};
