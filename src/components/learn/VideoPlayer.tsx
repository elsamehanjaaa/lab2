"use client";

import {
  Pause,
  Play,
  RotateCw,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ArrowLeft,
  ArrowRight,
  Volume1,
  Volume,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface VideoPlayerProps {
  src: string;
  onNext?: () => void;
  onPrev?: () => void;
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onNext, onPrev }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1); // from 0 to 1
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const rewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 5
      );
    }
  };

  const forward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        duration,
        videoRef.current.currentTime + 5
      );
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rate = parseFloat(e.target.value);
    setSpeed(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      if (vol === 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => setProgress(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.volume = volume;

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [src]);

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-9/12 mx-auto max-h-2xl rounded-lg overflow-hidden border border-gray-300 shadow bg-black relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video ref={videoRef} className="w-full" src={src} />

      <motion.div
        className="absolute inset-0 flex flex-col justify-end gap-2 p-3 mt-auto h-36 "
        initial={{ opacity: 0 }}
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
        }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Controls */}

        <div className="flex items-center justify-between gap-3">
          {/* Left group */}
          <div className="flex gap-3 items-center">
            <button
              onClick={onPrev}
              title="Previous Lesson"
              className="cursor-pointer px-4 py-1 flex gap-1 rounded text-white"
            >
              <ArrowLeft /> Prev
            </button>

            <button
              onClick={rewind}
              title="Rewind 5s"
              className="cursor-pointer text-white"
            >
              <RotateCcw />
            </button>
            <button onClick={togglePlay} className="cursor-pointer text-white">
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button
              onClick={forward}
              title="Forward 5s"
              className="cursor-pointer text-white"
            >
              <RotateCw />
            </button>
            <button
              onClick={onNext}
              title="Next Lesson"
              className="cursor-pointer px-4 py-1 flex gap-1 rounded text-white"
            >
              Next <ArrowRight />
            </button>
          </div>

          {/* Playback speed */}
          <select
            value={speed}
            onChange={handleSpeedChange}
            className="bg-gray-700 px-2 py-1 rounded text-sm text-white"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Progress bar */}
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={progress}
            onChange={handleProgressChange}
            className="w-full accent-gray-400"
          />
          {/* Time */}
          <div className="text-sm text-gray-300 w-20">
            {formatTime(progress)} / {formatTime(duration)}
          </div>
        </div>
        {/* Volume controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="cursor-pointer text-white">
              {isMuted || volume === 0 ? (
                <VolumeX />
              ) : volume > 0 && volume < 0.33 ? (
                <Volume />
              ) : volume >= 0.33 && volume < 0.66 ? (
                <Volume1 />
              ) : (
                <Volume2 />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="accent-gray-400"
            />
          </div>
          <button
            onClick={toggleFullscreen}
            className="cursor-pointer text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoPlayer;
