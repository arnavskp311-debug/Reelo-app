'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  Send,
  Heart,
  Share2,
  Sparkles,
  Play,
  Square,
  MessageSquare,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';

interface LiveMsg {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export default function LiveStreamingPage() {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [viewersCount, setViewersCount] = useState(14);
  const [chatInput, setChatInput] = useState('');
  const [heartsCount, setHeartsCount] = useState(28);
  const [messages, setMessages] = useState<LiveMsg[]>([
    {
      id: 'm1',
      user: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      text: 'Audio sounds super crisp! What mic are you on?',
      time: '12:04',
    },
    {
      id: 'm2',
      user: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      text: 'Loving the Natural Premium layout 🔥',
      time: '12:05',
    },
    {
      id: 'm3',
      user: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: 'Can you show the live audio waveform editor?',
      time: '12:06',
    },
  ]);

  const streamTrackRef = useRef<MediaStream | null>(null);

  const startBroadcast = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamTrackRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
      setStreamActive(true);
    } catch (err) {
      console.warn('Webcam permission not granted or available, running simulated live canvas:', err);
      setStreamActive(true);
    }
  };

  const stopBroadcast = () => {
    if (streamTrackRef.current) {
      streamTrackRef.current.getTracks().forEach((track) => track.stop());
      streamTrackRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  };

  const toggleCamera = () => {
    if (streamTrackRef.current) {
      const videoTrack = streamTrackRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraEnabled(videoTrack.enabled);
      }
    } else {
      setCameraEnabled((prev) => !prev);
    }
  };

  const toggleMic = () => {
    if (streamTrackRef.current) {
      const audioTrack = streamTrackRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicEnabled(audioTrack.enabled);
      }
    } else {
      setMicEnabled((prev) => !prev);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: LiveMsg = {
      id: `live_${Date.now()}`,
      user: user?.full_name || 'Host',
      avatar: user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=host',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  // Periodic simulated viewer jitter
  useEffect(() => {
    if (!streamActive) return;
    const interval = setInterval(() => {
      setViewersCount((prev) => Math.max(8, prev + Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(interval);
  }, [streamActive]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-reelo-border">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-red-600 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-reelo-primary tracking-tight">
              Live Stage & Broadcast
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-reelo-muted mt-1">
            Real-time video streaming, live audience chat, and interactive broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {streamActive ? (
            <Button variant="danger" size="sm" onClick={stopBroadcast} className="font-bold">
              <Square className="w-3.5 h-3.5 fill-white mr-1.5" />
              End Stream
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={startBroadcast} className="font-bold bg-red-600 hover:bg-red-700">
              <Play className="w-3.5 h-3.5 fill-white mr-1.5" />
              Start Broadcast
            </Button>
          )}
        </div>
      </div>

      {/* Main Broadcast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Stage Video Window */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative aspect-video w-full rounded-2xl bg-slate-900 border border-reelo-border overflow-hidden shadow-subtle flex items-center justify-center">
            {streamActive ? (
              cameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="text-center text-slate-400 space-y-2">
                  <VideoOff className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-xs font-medium">Camera is disabled</p>
                </div>
              )
            ) : (
              <div className="text-center text-slate-400 p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-red-500 shadow-lg">
                  <Radio className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Live Stage is Idle</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "Start Broadcast" to activate your camera and open the stage for viewers.
                  </p>
                </div>
                <Button size="sm" variant="primary" onClick={startBroadcast} className="bg-red-600 hover:bg-red-700">
                  <Play className="w-3.5 h-3.5 mr-1 fill-white" />
                  Go Live Now
                </Button>
              </div>
            )}

            {/* Overlays */}
            {streamActive && (
              <>
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    LIVE
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
                    <Users className="w-3.5 h-3.5" />
                    <span>{viewersCount}</span>
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleCamera}
                      className={`p-2.5 rounded-xl backdrop-blur-md text-white border transition-all ${
                        cameraEnabled ? 'bg-black/50 border-white/20 hover:bg-black/70' : 'bg-red-600 border-red-500'
                      }`}
                      title={cameraEnabled ? 'Mute Camera' : 'Unmute Camera'}
                    >
                      {cameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={toggleMic}
                      className={`p-2.5 rounded-xl backdrop-blur-md text-white border transition-all ${
                        micEnabled ? 'bg-black/50 border-white/20 hover:bg-black/70' : 'bg-red-600 border-red-500'
                      }`}
                      title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
                    >
                      {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    onClick={() => setHeartsCount((c) => c + 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold backdrop-blur-md shadow-md transition-all active:scale-95"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{heartsCount}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Live Audience Chat Stream */}
        <div className="h-[460px] rounded-2xl bg-white border border-reelo-border shadow-subtle flex flex-col justify-between overflow-hidden">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-reelo-border bg-reelo-surface flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-reelo-secondary" />
              <h3 className="text-xs font-bold text-reelo-primary uppercase tracking-wider">Live Chat</h3>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Connected
            </span>
          </div>

          {/* Messages Flow */}
          <div className="p-3.5 space-y-3 overflow-y-auto flex-1">
            {messages.map((m) => (
              <div key={m.id} className="flex items-start gap-2.5 text-xs">
                <Avatar src={m.avatar} alt={m.user} size="sm" className="w-6 h-6 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-reelo-primary text-[11px] truncate">{m.user}</span>
                    <span className="text-[10px] text-reelo-muted">{m.time}</span>
                  </div>
                  <p className="text-xs text-reelo-text leading-relaxed break-words">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-2.5 border-t border-reelo-border bg-reelo-surface flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Send a comment to the live room..."
              className="flex-1 bg-white border border-reelo-border rounded-xl px-3 py-2 text-xs text-reelo-text placeholder:text-reelo-muted outline-none focus:border-reelo-secondary"
            />
            <Button variant="primary" size="sm" type="submit" className="p-2 shrink-0">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
