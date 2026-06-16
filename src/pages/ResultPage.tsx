import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Sparkles, Gift, Users, Clock, ChevronDown, ChevronUp, Share2, Zap } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { useBoxStore } from '@/store/useBoxStore';
import { getResultByBoxId } from '@/data/boxes';
import { getRuleTypeName, formatDateTime, formatPrice } from '@/utils/format';
import type { BoxResult, Assignment } from '@/types';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBoxById, currentUserId } = useBoxStore();
  const [revealed, setRevealed] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  
  const box = useMemo(() => id ? getBoxById(id) : undefined, [id, getBoxById]);
  const result = useMemo(() => id ? getResultByBoxId(id) : undefined, [id]);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setRevealed(true), 500);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const mockResult: BoxResult | undefined = useMemo(() => {
    if (result) return result;
    if (!box) return undefined;

    return {
      boxId: box.id,
      styles: [],
      assignments: box.members.map((member, idx) => ({
        userId: member.userId,
        nickname: member.nickname,
        avatar: member.avatar,
        slotNumber: member.slotNumber,
        styles: idx === 0 ? [
          { styleId: 'hidden', styleName: '宇宙隐藏款', styleImage: box.seriesCover, isHidden: true, rarity: 'hidden' as const, slotNumber: member.slotNumber }
        ] : [
          { styleId: `common-${idx}`, styleName: `款式${idx}`, styleImage: box.seriesCover, isHidden: false, rarity: 'common' as const, slotNumber: member.slotNumber }
        ]
      })),
      revealedAt: new Date(),
    };
  }, [box, result]);

  const hasHidden = useMemo(() => 
    mockResult?.assignments.some(a => a.styles.some(s => s.isHidden)),
    [mockResult]
  );

  const hiddenWinner = useMemo(() => 
    mockResult?.assignments.find(a => a.styles.some(s => s.isHidden)),
    [mockResult]
  );

  const myAssignment = useMemo(() => 
    mockResult?.assignments.find(a => a.userId === currentUserId),
    [mockResult, currentUserId]
  );

  const IGotHidden = useMemo(() => 
    myAssignment?.styles.some(s => s.isHidden),
    [myAssignment]
  );

  if (!box || !mockResult) {
    return (
      <div className="min-h-screen bg-grid">
        <Header />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p className="text-dark-400">拼盒不存在或已结束</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid pb-20">
      <Header />

      <div className="relative h-80 md:h-96 overflow-hidden">
        <img
          src={box.seriesCover}
          alt={box.seriesName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-dark-900/40" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 p-2 rounded-full glass hover:bg-white/20 transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <button className="absolute top-20 right-4 p-2 rounded-full glass hover:bg-white/20 transition-colors z-10">
          <Share2 className="w-5 h-5 text-white" />
        </button>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`transition-all duration-1000 ${revealed ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            {hasHidden ? (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-neon-gold/20 flex items-center justify-center hidden-glow">
                  <Sparkles className="w-12 h-12 text-neon-gold" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-neon-gold neon-text-gold mb-2">
                  {IGotHidden ? '恭喜你！' : '隐藏款出了！'}
                </h1>
                <p className="text-dark-200">
                  {IGotHidden ? '你获得了隐藏款！' : `${hiddenWinner?.nickname} 获得了隐藏款`}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-dark-700/50 flex items-center justify-center">
                  <Gift className="w-12 h-12 text-dark-400" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  拆盒结果公布
                </h1>
                <p className="text-dark-400">本次没有隐藏款，下次加油！</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="glass rounded-2xl p-5 mb-6">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{box.seriesName}</h2>
              <div className="flex items-center gap-3 text-sm text-dark-400">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {box.joinedSlots}人拼盒
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDateTime(mockResult.revealedAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag variant="purple">{getRuleTypeName(box.ruleType)}</Tag>
              <Tag variant="success">已完成</Tag>
            </div>
          </div>
        </div>

        {hasHidden && hiddenWinner && (
          <div className="glass rounded-2xl p-6 mb-6 border border-neon-gold/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-neon-gold/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-neon-gold" />
                <h3 className="text-lg font-bold text-neon-gold">隐藏款归属</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={hiddenWinner.avatar}
                    alt={hiddenWinner.nickname}
                    className="w-16 h-16 rounded-full border-2 border-neon-gold"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-neon-gold flex items-center justify-center">
                    <Crown className="w-4 h-4 text-dark-900" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-lg">{hiddenWinner.nickname}</p>
                  <p className="text-dark-400 text-sm">#{hiddenWinner.slotNumber} 卡位</p>
                </div>
                <div className="text-right">
                  <p className="text-neon-gold font-bold text-xl">获得隐藏款</p>
                  <p className="text-dark-400 text-sm">{hiddenWinner.styles.find(s => s.isHidden)?.styleName}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="glass rounded-2xl p-5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-neon-purple" />
            全部拆盒结果
          </h3>

          <div className="space-y-3">
            {mockResult.assignments.map((assignment, idx) => (
              <div
                key={assignment.userId}
                className={`rounded-xl overflow-hidden transition-all ${
                  assignment.styles.some(s => s.isHidden) 
                    ? 'border border-neon-gold/30 bg-neon-gold/5' 
                    : 'glass-light'
                }`}
                style={{ animationDelay: `${idx * 100 + 300}ms` }}
              >
                <button
                  onClick={() => setExpandedUser(expandedUser === assignment.userId ? null : assignment.userId)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={assignment.avatar}
                      alt={assignment.nickname}
                      className="w-12 h-12 rounded-full"
                    />
                    {assignment.styles.some(s => s.isHidden) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon-gold flex items-center justify-center">
                        <Crown className="w-3 h-3 text-dark-900" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{assignment.nickname}</span>
                      <Tag size="sm" variant={assignment.styles.some(s => s.isHidden) ? 'gold' : 'default'}>
                        #{assignment.slotNumber}
                      </Tag>
                    </div>
                    <p className="text-dark-400 text-sm mt-0.5">
                      获得 {assignment.styles.length} 个款式
                      {assignment.styles.some(s => s.isHidden) && (
                        <span className="text-neon-gold ml-2">含隐藏款</span>
                      )}
                    </p>
                  </div>
                  {expandedUser === assignment.userId ? (
                    <ChevronUp className="w-5 h-5 text-dark-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-dark-400" />
                  )}
                </button>

                {expandedUser === assignment.userId && (
                  <div className="px-4 pb-4 border-t border-dark-700/50 pt-3">
                    <div className="grid grid-cols-4 gap-2">
                      {assignment.styles.map((style) => (
                        <div key={style.styleId} className="text-center">
                          <div className={`aspect-square rounded-lg overflow-hidden mb-2 ${
                            style.isHidden ? 'ring-2 ring-neon-gold hidden-glow' : ''
                          }`}>
                            <img src={style.styleImage} alt={style.styleName} className="w-full h-full object-cover" />
                          </div>
                          <p className={`text-xs truncate ${style.isHidden ? 'text-neon-gold' : 'text-dark-300'}`}>
                            {style.styleName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon-amber" />
            我的战绩
          </h3>
          
          {myAssignment ? (
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={box.seriesCover} alt={box.seriesName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold mb-1">{box.seriesName}</p>
                <p className="text-dark-400 text-sm mb-2">{box.mall} · {formatDateTime(box.meetTime)}</p>
                <div className="flex items-center gap-3">
                  <Tag variant={IGotHidden ? 'gold' : 'purple'}>
                    {IGotHidden ? '获得隐藏款！' : `${myAssignment.styles.length}个款式`}
                  </Tag>
                  <span className="text-dark-400 text-sm">花费 {formatPrice(box.pricePerSlot)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-dark-400 text-center py-4">你没有参与本次拼盒</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate(`/box/${box.id}/payment`)}
          >
            分摊结算
          </Button>
          <Button
            fullWidth
            onClick={() => navigate('/')}
          >
            返回大厅
          </Button>
        </div>
      </div>
    </div>
  );
}
