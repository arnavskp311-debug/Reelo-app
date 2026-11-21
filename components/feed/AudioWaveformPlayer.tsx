'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Music, Sparkles } from 'lucide-react';

interface AudioWaveformPlayerProps {
  title?: string;
  artist?: string;
  duration?: string;
}

export function AudioWaveformPlayer({
  title = 'Modular Synth Loop — Tokyo Skyline',
  artist = 'Kai Zenith',
  duration = '0:48',
}: AudioWaveformPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);

  // Bar heights array representing an authentic audio waveform
  const bars = [
    24, 38, 55, 78, 42, 60, 92, 100, 75, 48, 64, 82, 35, 52, 70, 95, 88, 62, 45, 72,
    85, 98, 65, 40, 58, 80, 90, 70, 48, 32, 60, 78, 92, 85, 60, 42, 55, 72, 88, 65,
    45, 30, 50, 68, 82, 94, 76, 52, 38, 25,
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1.5));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="p-3 sm:p-3.5 rounded-xl bg-reelo-surfaceMuted/60 border border-reelo-border space-y-2.5 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-7 h-7 rounded-lg bg-reelo-secondary/15 border border-reelo-secondary/30 flex items-center justify-center text-reelo-secondary">
            <Music className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-reelo-text truncate">{title}</p>
            <p className="text-[10px] text-reelo-muted truncate">{artist} • Spatial Stems</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-reelo-muted">
          <Volume2 className="w-3.5 h-3.5 text-reelo-muted" />
          <span className="tabular-nums">{duration}</span>
        </div>
      </div>

      {/* Waveform Bars & Play Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 rounded-full bg-reelo-primary hover:bg-reelo-primary-hover text-white flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 shadow-subtle"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-white" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
          )}
        </button>

        {/* Dynamic Waveform Bar Graph */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            setProgress(Math.round(clickPos * 100));
          }}
          className="flex-1 h-8 flex items-center gap-[2px] cursor-pointer group py-1"
        >
          {bars.map((heightPercent, idx) => {
            const barProgress = (idx / bars.length) * 100;
            const isPlayed = barProgress <= progress;

            return (
              <span
                key={idx}
                style={{
                  height: `${heightPercent}%`,
                }}
                className={`flex-1 rounded-full transition-all duration-150 ${
                  isPlayed
                    ? 'bg-reelo-accent group-hover:bg-reelo-accent-hover'
                    : 'bg-reelo-border group-hover:bg-reelo-borderHover'
                } ${isPlaying && isPlayed ? 'animate-pulse' : ''}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
