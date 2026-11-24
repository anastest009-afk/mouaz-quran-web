import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../store/app.store';

export interface WaveformCanvasProps {
  amplitudes: number[];
  isRecording: boolean;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({ amplitudes, isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeMode = useAppStore((s) => s.themeMode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasStyles = getComputedStyle(canvas);
    const rootStyles = getComputedStyle(document.documentElement);
    const activeColor =
      canvasStyles.getPropertyValue('--color-wave-active').trim() ||
      rootStyles.getPropertyValue('--color-wave-active').trim();
    const inactiveColor =
      canvasStyles.getPropertyValue('--color-wave-inactive').trim() ||
      rootStyles.getPropertyValue('--color-wave-inactive').trim();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const data = amplitudes.length > 0 ? amplitudes : new Array(24).fill(0.12);
    const barWidth = canvas.width / data.length;
    const centerY = canvas.height / 2;

    data.forEach((val, i) => {
      const normalized = Math.max(0.12, Math.min(1.0, val));
      const barHeight = canvas.height * normalized * 0.78;
      const x = i * barWidth + barWidth / 4;

      ctx.fillStyle = isRecording && normalized > 0.22 ? activeColor : inactiveColor;
      ctx.beginPath();
      ctx.roundRect(x, centerY - barHeight / 2, Math.max(2, barWidth / 2), barHeight, 4);
      ctx.fill();
    });
  }, [amplitudes, isRecording, themeMode]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={64}
      style={{
        width: '100%',
        height: '64px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--color-surface-subtle)',
        border: '1px solid var(--color-surface-interactive)',
      }}
    />
  );
};
