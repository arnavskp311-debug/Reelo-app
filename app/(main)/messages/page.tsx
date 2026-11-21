'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Smile,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { DEMO_USERS, DEMO_CURRENT_USER } from '@/lib/constants/demo-data';
import { formatTimeAgo } from '@/lib/utils/formatters';
import { useAuth } from '@/hooks/useAuth';
import { AudioWaveformPlayer } from '@/components/feed/AudioWaveformPlayer';

interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_audio?: boolean;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const currentUserId = user?.id || DEMO_CURRENT_USER.id;
  const [selectedUserId, setSelectedUserId] = useState<string>('usr_01');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Fetch messages from local PC database
  const loadMessages = (peerId: string) => {
    fetch(`/api/messages?peer_id=${peerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          // Default initial friendly conversation starter
          setMessages([
            {
              id: 'init_1',
              sender_id: peerId,
              recipient_id: currentUserId,
              content: 'Hey! Welcome to REELO Direct Messaging. All messages are stored privately on your PC.',
              created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            },
          ]);
        }
      })
      .catch((err) => console.warn('Could not load messages:', err));
  };

  useEffect(() => {
    loadMessages(selectedUserId);
    const interval = setInterval(() => {
      loadMessages(selectedUserId);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedUserId, currentUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const textToSend = inputMessage.trim();
    setInputMessage('');

    // Optimistic UI append
    const tempMsg: ChatMessage = {
      id: `tmp_${Date.now()}`,
      sender_id: currentUserId,
      recipient_id: selectedUserId,
      content: textToSend,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_id: selectedUserId,
          content: textToSend,
        }),
      });
      loadMessages(selectedUserId);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob, `voice_${Date.now()}.webm`);

        try {
          const uploadRes = await fetch('/api/uploads', { method: 'POST', body: formData });
          const uploadData = await uploadRes.json();

          const audioUrl = uploadData.url || 'voice_note';
          const voiceContent = `[VOICE_NOTE]:${audioUrl}`;

          await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipient_id: selectedUserId,
              content: voiceContent,
            }),
          });
          loadMessages(selectedUserId);
        } catch (err) {
          console.error('Failed to upload voice note:', err);
        }
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone permission not granted:', err);
      // Fallback simulated voice note
      const fallbackVoiceMsg: ChatMessage = {
        id: `m_audio_${Date.now()}`,
        sender_id: currentUserId,
        recipient_id: selectedUserId,
        content: '[VOICE_NOTE]:sample_stem.mp3',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackVoiceMsg]);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const activeUser = DEMO_USERS[selectedUserId] || DEMO_USERS.usr_01;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row rounded-2xl overflow-hidden border border-reelo-border bg-white shadow-subtle">
      {/* Left Chat Contacts List */}
      <div className="w-full md:w-80 border-r border-reelo-border flex flex-col bg-white">
        <div className="p-4 border-b border-reelo-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-reelo-primary flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-reelo-secondary" />
              <span>Direct Messages</span>
            </h2>
            <span className="text-[10px] bg-reelo-surfaceMuted text-reelo-primary px-2 py-0.5 rounded-full font-bold">
              Local DB
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-reelo-muted" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-reelo-surfaceMuted border border-reelo-border text-xs text-reelo-text placeholder:text-reelo-muted rounded-lg pl-9 pr-3 py-2 outline-none focus:border-reelo-secondary focus:ring-1 focus:ring-reelo-secondary/20 transition-all"
            />
          </div>
        </div>

        {/* Contact list items */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-reelo-border">
          {Object.values(DEMO_USERS).map((u) => {
            const isSelected = u.id === selectedUserId;

            return (
              <button
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`w-full flex items-center gap-3 p-3.5 text-left transition-colors ${
                  isSelected
                    ? 'bg-reelo-surfaceMuted border-l-3 border-reelo-primary'
                    : 'hover:bg-reelo-surfaceMuted/50'
                }`}
              >
                <Avatar
                  src={u.avatar_url}
                  alt={u.full_name}
                  size="md"
                  isVerified={u.is_verified}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold text-reelo-primary truncate">
                      {u.full_name}
                    </p>
                    <span className="text-[10px] text-reelo-muted">Online</span>
                  </div>
                  <p className="text-[11px] text-reelo-muted truncate">@{u.username}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Thread View */}
      <div className="flex-1 flex flex-col bg-reelo-bg">
        {/* Active Contact Header */}
        <div className="p-4 border-b border-reelo-border flex items-center justify-between bg-white shadow-subtle">
          <div className="flex items-center gap-3">
            <Avatar
              src={activeUser.avatar_url}
              alt={activeUser.full_name}
              size="sm"
              isVerified={activeUser.is_verified}
            />
            <div>
              <p className="text-sm font-bold text-reelo-primary leading-none">
                {activeUser.full_name}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Active on REELO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-reelo-muted">
            <button className="p-2 hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-xl transition-colors" title="Audio Call">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-xl transition-colors" title="Video Call">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-xl transition-colors" title="More">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Bubble History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 no-scrollbar">
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            const isVoice = msg.content.startsWith('[VOICE_NOTE]:');

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-subtle ${
                    isMe
                      ? 'bg-reelo-primary text-white rounded-br-none'
                      : 'bg-white border border-reelo-border text-reelo-text rounded-bl-none'
                  }`}
                >
                  {isVoice ? (
                    <div className="w-64">
                      <p className="text-[10px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5" />
                        Voice Note
                      </p>
                      <AudioWaveformPlayer
                        title="Recorded Voice Message"
                        artist={isMe ? 'You' : activeUser.full_name}
                        duration="0:18"
                      />
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  <span
                    className={`block text-[9px] mt-1 text-right font-medium ${
                      isMe ? 'text-white/70' : 'text-reelo-muted'
                    }`}
                  >
                    {formatTimeAgo(msg.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Send Input Bar with Voice Note Recording */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-reelo-border flex items-center gap-2 bg-white"
        >
          <div className="flex items-center gap-1 text-reelo-muted">
            <button
              type="button"
              className="p-2 hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-lg transition-colors"
              title="Attach media"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Voice Note Button */}
            <button
              type="button"
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`p-2 rounded-lg transition-all ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'text-reelo-muted hover:text-reelo-primary hover:bg-reelo-surfaceMuted'
              }`}
              title={isRecording ? 'Stop Recording' : 'Record Voice Note'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isRecording ? 'Recording audio... click mic to send voice note' : `Message ${activeUser.full_name}...`}
            disabled={isRecording}
            className="flex-1 bg-reelo-surfaceMuted border border-reelo-border text-xs text-reelo-text placeholder:text-reelo-muted rounded-lg px-3.5 py-2.5 outline-none focus:border-reelo-secondary focus:ring-1 focus:ring-reelo-secondary/20 transition-all"
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!inputMessage.trim() || isRecording}
            className="rounded-lg px-3.5 py-2 font-bold"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
