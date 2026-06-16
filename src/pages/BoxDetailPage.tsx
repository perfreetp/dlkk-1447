import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, MessageCircle, Crown, Gift, Truck, RefreshCw, Star, Zap, Share2 } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { useBoxStore } from '@/store/useBoxStore';
import { formatPrice, getRuleTypeName, getStatusName, formatCountdown, formatTime, getDeliveryTypeName } from '@/utils/format';
import { getSecondsUntil } from '@/utils/date';
import { seriesList } from '@/data/series';
import type { DeliveryType } from '@/types';

export default function BoxDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBoxById, joinBox, leaveBox, currentUserId } = useBoxStore();
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('self');
  
  const box = useMemo(() => id ? getBoxById(id) : undefined, [id, getBoxById]);
  
  const series = useMemo(() => 
    box ? seriesList.find(s => s.id === box.seriesId) : undefined,
    [box]
  );

  const isJoined = useMemo(() => 
    box?.members.some(m => m.userId === currentUserId),
    [box, currentUserId]
  );

  const isCreator = useMemo(() => 
    box?.creatorId === currentUserId,
    [box, currentUserId]
  );

  const progress = useMemo(() => 
    box ? (box.joinedSlots / box.totalSlots) * 100 : 0,
    [box]
  );

  useEffect(() => {
    if (box) {
      setSecondsLeft(getSecondsUntil(box.expireAt));
      const timer = setInterval(() => {
        setSecondsLeft(getSecondsUntil(box.expireAt));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [box]);

  const handleJoin = () => {
    if (box && !isJoined) {
      joinBox(box.id, currentUserId);
    }
  };

  const handleLeave = () => {
    if (box && isJoined && !isCreator) {
      leaveBox(box.id, currentUserId);
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

  const deliveryOptions = [
    { type: 'self' as DeliveryType, label: '到店自提', icon: Gift, desc: '现场拆盒直接取走' },
    { type: 'proxy' as DeliveryType, label: '代取', icon: RefreshCw, desc: '发起人代取后邮寄' },
    { type: 'delivery' as DeliveryType, label: '同城送达', icon: Truck, desc: '专人同城配送' },
  ];

  return (
    <div className="min-h-screen bg-grid pb-32">
      <Header />

      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={box.seriesCover}
          alt={box.seriesName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-dark-900/30" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 p-2 rounded-full glass hover:bg-white/20 transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <button className="absolute top-20 right-4 p-2 rounded-full glass hover:bg-white/20 transition-colors z-10">
          <Share2 className="w-5 h-5 text-white" />
        </button>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag variant="success">{getStatusName(box.status)}</Tag>
            <Tag variant="purple">{getRuleTypeName(box.ruleType)}</Tag>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{box.seriesName}</h1>
          <p className="text-dark-300 text-sm">{box.seriesBrand}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="glass rounded-2xl p-5 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-neon-amber" />
              <span className="text-dark-200">招募倒计时</span>
            </div>
            <span className={`text-2xl font-bold font-mono ${
              secondsLeft < 600 ? 'text-neon-pink animate-pulse' : 'text-neon-amber'
            }`}>
              {formatCountdown(secondsLeft)}
            </span>
          </div>
          
          <div className="relative h-3 bg-dark-700 rounded-full overflow-hidden mb-3">
            <div
              className="absolute inset-y-0 left-0 rounded-full gradient-bg transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-dark-300">
              <Users className="w-4 h-4" />
              <span>已凑 {box.joinedSlots}/{box.totalSlots} 人</span>
            </div>
            <span className="text-neon-purple font-semibold">
              还差 {box.totalSlots - box.joinedSlots} 人
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-neon-purple" />
                拼盒地点
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-dark-400">城市</span>
                  <span className="text-white">{box.city} · {box.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">商圈</span>
                  <span className="text-white">{box.mall}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">门店</span>
                  <span className="text-white">{box.storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">到店时间</span>
                  <span className="text-neon-green font-medium">{formatTime(box.meetTime)} 左右</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-neon-purple" />
                拼盒成员
                <Tag variant="purple" size="sm">{box.joinedSlots}人</Tag>
              </h2>
              
              <div className="space-y-3">
                {box.members.map((member, index) => (
                  <div
                    key={member.userId}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img src={member.avatar} alt={member.nickname} className="w-full h-full object-cover" />
                      </div>
                      {member.isCreator && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon-amber flex items-center justify-center">
                          <Crown className="w-3 h-3 text-dark-900" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-neon-purple text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{member.nickname}</span>
                        {member.isCreator && <Tag variant="warning" size="sm">发起人</Tag>}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-dark-400 text-sm">预算 {formatPrice(member.budget)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          member.status === 'paid' 
                            ? 'bg-neon-green/20 text-neon-green' 
                            : 'bg-neon-amber/20 text-neon-amber'
                        }`}>
                          {member.status === 'paid' ? '已支付' : '待支付'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-dark-400 text-sm">#{member.slotNumber} 卡位</span>
                    </div>
                  </div>
                ))}
                
                {Array.from({ length: box.totalSlots - box.joinedSlots }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="flex items-center gap-4 p-3 rounded-xl border border-dashed border-dark-600">
                    <div className="w-12 h-12 rounded-full bg-dark-700/50 flex items-center justify-center">
                      <Users className="w-6 h-6 text-dark-500" />
                    </div>
                    <div className="flex-1">
                      <span className="text-dark-500">虚位以待...</span>
                    </div>
                    <span className="text-dark-500 text-sm">#{box.joinedSlots + idx + 1} 卡位</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-neon-amber" />
                分盒规则
              </h2>
              
              <div className="p-4 bg-neon-purple/10 rounded-xl border border-neon-purple/30">
                <h3 className="text-neon-purple font-semibold mb-2">{getRuleTypeName(box.ruleType)}</h3>
                <p className="text-dark-300 text-sm">{box.ruleDescription}</p>
              </div>

              {box.ruleType === 'hidden-first' && (
                <div className="mt-4 p-4 glass-light rounded-xl">
                  <h4 className="text-white text-sm font-medium mb-2">📊 当前出价排行</h4>
                  <div className="space-y-2">
                    {[...box.members]
                      .sort((a, b) => b.budget - a.budget)
                      .map((member, idx) => (
                        <div key={member.userId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx === 0 ? 'bg-neon-amber text-dark-900' : 'bg-dark-600 text-dark-300'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="text-dark-200">{member.nickname}</span>
                          </div>
                          <span className="text-neon-purple font-medium">{formatPrice(member.budget)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {isJoined && (
              <div className="glass rounded-2xl p-5">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-neon-green" />
                  配送方式
                </h2>
                
                <div className="grid grid-cols-3 gap-3">
                  {deliveryOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setDeliveryType(option.type)}
                      className={`p-4 rounded-xl text-center transition-all ${
                        deliveryType === option.type
                          ? 'bg-neon-green/20 border border-neon-green/50'
                          : 'glass-light hover:border-dark-500'
                      }`}
                    >
                      <option.icon className={`w-6 h-6 mx-auto mb-2 ${
                        deliveryType === option.type ? 'text-neon-green' : 'text-dark-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        deliveryType === option.type ? 'text-neon-green' : 'text-dark-200'
                      }`}>{option.label}</p>
                      <p className="text-xs text-dark-500 mt-1">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-5 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">费用信息</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">整盒价格</span>
                  <span className="text-white">{formatPrice(box.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">拼盒人数</span>
                  <span className="text-white">{box.totalSlots} 人</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">服务费</span>
                  <span className="text-neon-green">免费</span>
                </div>
                <div className="pt-3 border-t border-dark-700">
                  <div className="flex justify-between items-center">
                    <span className="text-dark-300">人均价格</span>
                    <span className="text-2xl font-bold gradient-text">{formatPrice(box.pricePerSlot)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {!isJoined ? (
                  <Button 
                    fullWidth 
                    size="lg"
                    onClick={handleJoin}
                    disabled={box.joinedSlots >= box.totalSlots}
                  >
                    <Zap className="w-5 h-5" />
                    {box.joinedSlots >= box.totalSlots ? '人已凑齐' : '立即加入拼盒'}
                  </Button>
                ) : (
                  <>
                    {isCreator && box.status === 'full' && (
                      <Button fullWidth size="lg" onClick={() => navigate(`/box/${box.id}/result`)}>
                        <Gift className="w-5 h-5" />
                        开始拆盒
                      </Button>
                    )}
                    {!isCreator && (
                      <Button variant="secondary" fullWidth onClick={handleLeave}>
                        退出拼盒
                      </Button>
                    )}
                  </>
                )}

                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => navigate(`/box/${box.id}/chat`)}
                >
                  <MessageCircle className="w-5 h-5" />
                  聊天协商
                </Button>
              </div>

              {box.status === 'completed' && (
                <div className="mt-4">
                  <Button 
                    variant="secondary" 
                    fullWidth
                    onClick={() => navigate(`/box/${box.id}/result`)}
                  >
                    查看拆盒结果
                  </Button>
                </div>
              )}
            </div>

            {series && (
              <div className="glass rounded-2xl p-5">
                <h2 className="text-lg font-semibold text-white mb-4">系列概览</h2>
                <div className="grid grid-cols-4 gap-2">
                  {series.styles.slice(0, 8).map((style) => (
                    <div 
                      key={style.id}
                      className={`aspect-square rounded-lg overflow-hidden ${
                        style.isHidden ? 'ring-2 ring-neon-gold hidden-glow' : ''
                      }`}
                    >
                      <img 
                        src={style.image} 
                        alt={style.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Tag variant="gold" size="sm">
                    隐藏款：{series.hiddenName}
                  </Tag>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
