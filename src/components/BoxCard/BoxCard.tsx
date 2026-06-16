import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Zap } from 'lucide-react';
import type { Box } from '@/types';
import { formatPrice, getRuleTypeName, getStatusName, formatTime } from '@/utils/format';
import { getSecondsUntil } from '@/utils/date';
import { useEffect, useState } from 'react';
import { formatCountdown } from '@/utils/format';

interface BoxCardProps {
  box: Box;
}

export default function BoxCard({ box }: BoxCardProps) {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(getSecondsUntil(box.expireAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(getSecondsUntil(box.expireAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [box.expireAt]);

  const progress = (box.joinedSlots / box.totalSlots) * 100;
  const isUrgent = secondsLeft < 600;

  return (
    <div
      onClick={() => navigate(`/box/${box.id}`)}
      className="glass rounded-2xl overflow-hidden cursor-pointer card-hover group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={box.seriesCover}
          alt={box.seriesName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
        
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            box.status === 'recruiting' 
              ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
              : box.status === 'full'
              ? 'bg-neon-amber/20 text-neon-amber border border-neon-amber/30'
              : 'bg-dark-500/50 text-dark-300 border border-dark-500/30'
          }`}>
            {getStatusName(box.status)}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
            {getRuleTypeName(box.ruleType)}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono ${
            isUrgent 
              ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30 animate-pulse'
              : 'bg-dark-800/70 text-dark-200 border border-dark-600/30'
          }`}>
            <Clock className="w-3 h-3" />
            {formatCountdown(secondsLeft)}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg truncate">{box.seriesName}</h3>
          <p className="text-dark-400 text-xs mt-1">{box.seriesBrand}</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-dark-300">
          <MapPin className="w-4 h-4 text-neon-purple" />
          <span className="truncate">{box.mall}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-dark-300">
            <Clock className="w-4 h-4" />
            <span>{formatTime(box.meetTime)} 到店</span>
          </div>
          <div className="flex items-center gap-1 text-neon-purple font-medium">
            <Users className="w-4 h-4" />
            <span>{box.joinedSlots}/{box.totalSlots}人</span>
          </div>
        </div>

        <div className="relative h-2 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full gradient-bg transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-y-0 left-0 rounded-full bg-white/20 w-full animate-shimmer"
            style={{ 
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-dark-700">
          <div className="flex -space-x-2">
            {box.members.slice(0, 4).map((member, idx) => (
              <div
                key={member.userId}
                className="w-7 h-7 rounded-full border-2 border-dark-800 overflow-hidden"
                style={{ zIndex: 4 - idx }}
              >
                <img src={member.avatar} alt={member.nickname} className="w-full h-full object-cover" />
              </div>
            ))}
            {box.totalSlots > 4 && (
              <div className="w-7 h-7 rounded-full border-2 border-dark-800 bg-dark-700 flex items-center justify-center text-xs text-dark-300">
                +{box.totalSlots - 4}
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="text-lg font-bold gradient-text">{formatPrice(box.pricePerSlot)}</span>
            <span className="text-dark-500 text-xs ml-1">/位</span>
          </div>
        </div>
      </div>
    </div>
  );
}
