'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Smile,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { DEMO_USERS, DEMO_CURRENT_USER } from '@/lib/constants/demo-data';
import { formatTimeAgo } from '@/lib/utils/formatters';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export default function MessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>('usr_01');
  const [inputMessage, setInputMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Record<string, ChatMessage[]>>({
    usr_01: [
      {
        id: 'm1',
        senderId: 'usr_01',
        text: 'Hey Alex! Have you reviewed the newest procedural shader presets?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: 'm2',
        senderId: DEMO_CURRENT_USER.id,
        text: 'Yes! The reflection response and natural contrast are incredible.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'm3',
        senderId: 'usr_01',
        text: 'Awesome! Let us prepare a community breakdown for tomorrow.',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
    ],
    usr_02: [
      {
        id: 'm4',
        senderId: 'usr_02',
        text: 'Alex, just sent over the analog synth stems for your video montage.',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
    ],
    usr_03: [
      {
        id: 'm5',
        senderId: 'usr_03',
        text: 'We are deploying the updated moderation and security hooks tonight.',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      },
    ],
  });

  const activeUser = DEMO_USERS[selectedUserId] || DEMO_USERS.usr_01;
  const currentMessages = conversationHistory[selectedUserId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: DEMO_CURRENT_USER.id,
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setConversationHistory((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMsg],
    }));

    setInputMessage('');
  };

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
              3 Active
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
          {Object.values(DEMO_USERS).map((user) => {
            const isSelected = user.id === selectedUserId;
            const userMsgs = conversationHistory[user.id] || [];
            const lastMsg = userMsgs[userMsgs.length - 1]?.text || 'Started a conversation';

            return (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`w-full flex items-center gap-3 p-3.5 text-left transition-colors ${
                  isSelected
                    ? 'bg-reelo-surfaceMuted border-l-3 border-reelo-primary'
                    : 'hover:bg-reelo-surfaceMuted/50'
                }`}
              >
                <Avatar
                  src={user.avatar_url}
                  alt={user.full_name}
                  size="md"
                  isVerified={user.is_verified}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold text-reelo-primary truncate">
                      {user.full_name}
                    </p>
                    <span className="text-[10px] text-reelo-muted">10m</span>
                  </div>
                  <p className="text-[11px] text-reelo-muted truncate">{lastMsg}</p>
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
            <button className="p-2 hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-xl transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-xl transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-xl transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Bubble History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 no-scrollbar">
          {currentMessages.map((msg) => {
            const isMe = msg.senderId === DEMO_CURRENT_USER.id;

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
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right font-medium ${
                      isMe ? 'text-white/70' : 'text-reelo-muted'
                    }`}
                  >
                    {formatTimeAgo(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Send Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-reelo-border flex items-center gap-2 bg-white"
        >
          <div className="flex items-center gap-1 text-reelo-muted">
            <button
              type="button"
              className="p-2 hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-lg transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-lg transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${activeUser.full_name}...`}
            className="flex-1 bg-reelo-surfaceMuted border border-reelo-border text-xs text-reelo-text placeholder:text-reelo-muted rounded-lg px-3.5 py-2.5 outline-none focus:border-reelo-secondary focus:ring-1 focus:ring-reelo-secondary/20 transition-all"
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!inputMessage.trim()}
            className="rounded-lg px-3.5 py-2 font-bold"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
