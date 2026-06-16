import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Users, Clock, MoreVertical, Gift, Settings } from 'lucide-react';
import Header from '@/components/Layout/Header';
import { useBoxStore } from '@/store/useBoxStore';
import { formatTime, formatRelativeTime } from '@/utils/format';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBoxById, messages, loadMessages, sendMessage, currentUserId } = useBoxStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const box = useMemo(() => id ? getBoxById(id) : undefined, [id, getBoxById]);
  
  const sortedMessages = useMemo(() => 
    [...messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [messages]
  );

  useEffect(() => {
    if (id) {
      loadMessages(id);
    }
  }, [id, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sortedMessages]);

  const handleSend = () => {
    if (!inputValue.trim() || !box) return;
    
    sendMessage(
      box.id,
      currentUserId,
      '我是玩家',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      inputValue.trim()
    );
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!box) {
    return (
      <div className="min-h-screen bg-grid">
        <Header />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p className="text-dark-400">拼盒不存在或已结束</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    '大家预算多少呀？',
    '什么时候到店？',
    '隐藏款有希望吗？',
    '代取怎么收费？',
  ];

  return (
    <div className="min-h-screen bg-grid flex flex-col">
      <Header />

      <div className="glass border-b border-primary-500/20 mt-16">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-dark-300" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src={box.seriesCover} alt={box.seriesName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">{box.seriesName}</h2>
                <div className="flex items-center gap-2 text-xs text-dark-400">
                  <Users className="w-3 h-3" />
                  <span>{box.joinedSlots}/{box.totalSlots}人</span>
                </div>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <MoreVertical className="w-5 h-5 text-dark-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin py-4">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="glass rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{box.seriesName}</h3>
                <p className="text-dark-400 text-sm">{box.mall} · {formatTime(box.meetTime)}到店</p>
              </div>
              <button 
                onClick={() => navigate(`/box/${box.id}`)}
                className="text-neon-purple text-sm hover:underline"
              >
                查看详情
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {sortedMessages.map((msg) => {
              const isSystem = msg.type === 'system';
              const isMine = msg.userId === currentUserId;

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span className="text-xs text-dark-500 bg-dark-800/50 px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-3 ${isMine ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.userAvatar}
                    alt={msg.userName}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'}`}>
                    {!isMine && (
                      <p className="text-xs text-dark-500 mb-1 ml-1">{msg.userName}</p>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isMine
                          ? 'bg-gradient-to-br from-neon-purple to-neon-pink text-white rounded-br-md'
                          : 'glass text-dark-100 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    <p className={`text-xs text-dark-500 mt-1 ${isMine ? 'text-right mr-1' : 'ml-1'}`}>
                      {formatRelativeTime(new Date(msg.timestamp))}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-thin py-2">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => setInputValue(action)}
              className="flex-shrink-0 px-3 py-1.5 glass rounded-full text-xs text-dark-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="glass border-t border-primary-500/20">
        <div className="container mx-auto px-4 max-w-2xl py-3">
          <div className="flex items-end gap-3">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0">
              <Settings className="w-5 h-5 text-dark-400" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="输入消息..."
                rows={1}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-dark-500 resize-none focus:outline-none focus:ring-2 focus:ring-neon-purple/50 max-h-32"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`p-3 rounded-xl flex-shrink-0 transition-all ${
                inputValue.trim()
                  ? 'gradient-bg text-white glow-hover'
                  : 'bg-dark-700 text-dark-500'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
