import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Sparkles, Gift, Users, Clock, ChevronDown, ChevronUp, Share2, Zap, Star, Calendar, MapPin } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { useBoxStore } from '@/store/useBoxStore';
import { getResultByBoxId } from '@/data/boxes';
import { getRuleTypeName, formatDateTime, formatPrice, formatDate } from '@/utils/format';
import type { BoxResult, Assignment, HistoryRecord } from '@/types';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBoxById, currentUserId, getHistoryRecords } = useBoxStore();
  const [revealed, setRevealed] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  
  const box = useMemo(() => id ? getBoxById(id) : undefined, [id, getBoxById]);
  const result = useMemo(() => id ? getResultByBoxId(id) : undefined, [id]);
  
  // 从历史战绩里找到对应记录（box不存在时使用）
  const historyRecord: HistoryRecord | undefined = useMemo(() => {
    if (!id) return undefined;
    const records = getHistoryRecords();
    return records.find(r => r.boxId === id);
  }, [id, getHistoryRecords]);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 500);
    return () => clearTimeout(timer);
  }, [id, box, historyRecord]);

  // 从box生成mock结果，或者从historyRecord提取信息组装
  const viewData = useMemo(() => {
    // 1. 有真实结果的情况
    if (result) {
      return {
        from: 'box_result' as const,
        title: result.boxId,
        cover: box?.seriesCover || '',
        seriesName: box?.seriesName || '',
        seriesBrand: box?.seriesBrand || '',
        ruleType: box?.ruleType || 'hidden-first',
        mall: box?.mall || '',
        joinedSlots: box?.joinedSlots || 0,
        totalSlots: box?.totalSlots || 0,
        revealedAt: result.revealedAt,
        meetTime: box?.meetTime || new Date(),
        pricePerSlot: box?.pricePerSlot || 0,
        hasHidden: result.assignments.some(a => a.styles.some(s => s.isHidden)),
        hiddenWinner: result.assignments.find(a => a.styles.some(s => s.isHidden)),
        iGotHidden: !!result.assignments.find(a => a.userId === currentUserId && a.styles.some(s => s.isHidden)),
        assignments: result.assignments,
        myAssignment: result.assignments.find(a => a.userId === currentUserId),
        totalSpent: box?.pricePerSlot || 0,
        gotStylesDisplay: (result.assignments.find(a => a.userId === currentUserId)?.styles || []).map(s => ({
          name: s.styleName, image: s.styleImage, isHidden: s.isHidden, rarity: s.rarity
        })),
      };
    }

    // 2. 有box时生成mock结果
    if (box) {
      const mockAssignments: Assignment[] = box.members.map((member, idx) => ({
        userId: member.userId,
        nickname: member.nickname,
        avatar: member.avatar,
        slotNumber: member.slotNumber,
        styles: idx === 0 ? [
          { styleId: 'hidden', styleName: '隐藏款', styleImage: box.seriesCover, isHidden: true, rarity: 'hidden' as const, slotNumber: member.slotNumber }
        ] : [
          { styleId: `common-${idx}`, styleName: `款式${idx}`, styleImage: box.seriesCover, isHidden: false, rarity: 'common' as const, slotNumber: member.slotNumber }
        ]
      }));
      return {
        from: 'box_mock' as const,
        title: box.id,
        cover: box.seriesCover,
        seriesName: box.seriesName,
        seriesBrand: box.seriesBrand,
        ruleType: box.ruleType,
        mall: box.mall,
        joinedSlots: box.joinedSlots,
        totalSlots: box.totalSlots,
        revealedAt: new Date(),
        meetTime: box.meetTime,
        pricePerSlot: box.pricePerSlot,
        hasHidden: mockAssignments.some(a => a.styles.some(s => s.isHidden)),
        hiddenWinner: mockAssignments.find(a => a.styles.some(s => s.isHidden)),
        iGotHidden: !!mockAssignments.find(a => a.userId === currentUserId && a.styles.some(s => s.isHidden)),
        assignments: mockAssignments,
        myAssignment: mockAssignments.find(a => a.userId === currentUserId),
        totalSpent: box.pricePerSlot,
        gotStylesDisplay: (mockAssignments.find(a => a.userId === currentUserId)?.styles || []).map(s => ({
          name: s.styleName, image: s.styleImage, isHidden: s.isHidden, rarity: s.rarity
        })),
      };
    }

    // 3. 只有历史战绩的情况
    if (historyRecord) {
      const gotStyles = historyRecord.gotStyles;
      const myAssignment: Assignment | undefined = {
        userId: currentUserId,
        nickname: '我是玩家',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        slotNumber: 1,
        styles: gotStyles.map((gs, idx) => ({
          styleId: `hs-${idx}`,
          styleName: gs.name,
          styleImage: gs.image,
          isHidden: gs.isHidden,
          rarity: gs.rarity,
          slotNumber: 1,
        })),
      };
      return {
        from: 'history' as const,
        title: historyRecord.boxId,
        cover: historyRecord.seriesCover,
        seriesName: historyRecord.seriesName,
        seriesBrand: '',
        ruleType: historyRecord.ruleType,
        mall: historyRecord.mall,
        joinedSlots: 0,
        totalSlots: 0,
        revealedAt: historyRecord.date,
        meetTime: historyRecord.date,
        pricePerSlot: 0,
        hasHidden: historyRecord.hasHidden,
        hiddenWinner: historyRecord.hasHidden ? myAssignment : undefined,
        iGotHidden: historyRecord.hasHidden,
        assignments: [myAssignment].filter(Boolean) as Assignment[],
        myAssignment,
        totalSpent: historyRecord.totalSpent,
        gotStylesDisplay: gotStyles.map(gs => ({
          name: gs.name, image: gs.image, isHidden: gs.isHidden, rarity: gs.rarity
        })),
      };
    }

    return null;
  }, [box, result, historyRecord, currentUserId]);

  if (!viewData) {
    return (
      <div className="min-h-screen bg-grid">
        <Header />
        <div className="container mx-auto px-4 pt-24 text-center">
          <div className="glass rounded-2xl p-12 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700/50 flex items-center justify-center">
              <Gift className="w-8 h-8 text-dark-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">拼盒不存在</h2>
            <p className="text-dark-400 mb-6">该拼盒可能已经结束或未创建</p>
            <Button onClick={() => navigate('/')}>返回大厅</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid pb-20">
      <Header />

      <div className="relative h-80 md:h-96 overflow-hidden">
        <img
          src={viewData.cover}
          alt={viewData.seriesName}
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
            {viewData.hasHidden ? (
              <div className="text-center px-4">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-neon-gold/20 flex items-center justify-center hidden-glow">
                  <Sparkles className="w-12 h-12 text-neon-gold" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-neon-gold neon-text-gold mb-2">
                  {viewData.iGotHidden ? '恭喜你！' : viewData.from === 'history' ? '本次获得隐藏款！' : '隐藏款出了！'}
                </h1>
                <p className="text-dark-200">
                  {viewData.iGotHidden 
                    ? '你获得了隐藏款！' 
                    : viewData.hiddenWinner 
                      ? `${viewData.hiddenWinner.nickname} 获得了隐藏款`
                      : '恭喜获得隐藏款'}
                </p>
              </div>
            ) : (
              <div className="text-center px-4">
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
              <h2 className="text-xl font-bold text-white mb-1">{viewData.seriesName}</h2>
              <div className="flex items-center gap-3 text-sm text-dark-400">
                {viewData.from !== 'history' && viewData.joinedSlots > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {viewData.joinedSlots}/{viewData.totalSlots}人拼盒
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {viewData.from === 'history' ? formatDate(viewData.revealedAt) : formatDateTime(viewData.revealedAt)}
                </span>
                {viewData.mall && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {viewData.mall}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag variant="purple">{getRuleTypeName(viewData.ruleType)}</Tag>
              <Tag variant="success">已完成</Tag>
            </div>
          </div>
        </div>

        {viewData.hasHidden && viewData.hiddenWinner && (
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
                    src={viewData.hiddenWinner.avatar}
                    alt={viewData.hiddenWinner.nickname}
                    className="w-16 h-16 rounded-full border-2 border-neon-gold object-cover"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-neon-gold flex items-center justify-center">
                    <Crown className="w-4 h-4 text-dark-900" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-lg truncate">{viewData.hiddenWinner.nickname}</p>
                  <p className="text-dark-400 text-sm">
                    {viewData.hiddenWinner.slotNumber ? `#${viewData.hiddenWinner.slotNumber} 卡位` : '幸运玩家'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-neon-gold font-bold text-xl">获得隐藏款</p>
                  <p className="text-dark-400 text-sm truncate max-w-[160px]">
                    {viewData.hiddenWinner.styles.find(s => s.isHidden)?.styleName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewData.from !== 'history' && (
          <div className="glass rounded-2xl p-5 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-neon-purple" />
              全部拆盒结果
            </h3>

            <div className="space-y-3">
              {viewData.assignments.map((assignment, idx) => (
                <div
                  key={assignment.userId + idx}
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
                    <div className="relative flex-shrink-0">
                      <img
                        src={assignment.avatar}
                        alt={assignment.nickname}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {assignment.styles.some(s => s.isHidden) && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon-gold flex items-center justify-center">
                          <Crown className="w-3 h-3 text-dark-900" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium truncate">{assignment.nickname}</span>
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
                      <ChevronUp className="w-5 h-5 text-dark-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-dark-400 flex-shrink-0" />
                    )}
                  </button>

                  {expandedUser === assignment.userId && (
                    <div className="px-4 pb-4 border-t border-dark-700/50 pt-3">
                      <div className="grid grid-cols-4 gap-2">
                        {assignment.styles.map((style, sIdx) => (
                          <div key={style.styleId + sIdx} className="text-center">
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
        )}

        <div className="glass rounded-2xl p-5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon-amber" />
            我的战绩
          </h3>
          
          {viewData.myAssignment || viewData.from === 'history' ? (
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={viewData.cover} alt={viewData.seriesName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold mb-1 truncate">{viewData.seriesName}</p>
                <p className="text-dark-400 text-sm mb-2 truncate">
                  {viewData.mall} · {formatDateTime(viewData.meetTime)}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Tag variant={viewData.iGotHidden ? 'gold' : 'purple'}>
                    {viewData.iGotHidden 
                      ? '获得隐藏款！' 
                      : viewData.gotStylesDisplay.length 
                        ? `${viewData.gotStylesDisplay.length}个款式`
                        : '参与本次拼盒'}
                  </Tag>
                  {viewData.totalSpent > 0 && (
                    <span className="text-dark-400 text-sm">花费 {formatPrice(viewData.totalSpent)}</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-dark-400 text-center py-4">你没有参与本次拼盒</p>
          )}

          {viewData.gotStylesDisplay.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dark-700/50">
              <p className="text-dark-400 text-sm mb-3">获得款式</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {viewData.gotStylesDisplay.map((style, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`aspect-square rounded-lg overflow-hidden mb-1 ${
                      style.isHidden ? 'ring-2 ring-neon-gold hidden-glow' : ''
                    }`}>
                      <img src={style.image} alt={style.name} className="w-full h-full object-cover" />
                    </div>
                    <p className={`text-xs truncate ${style.isHidden ? 'text-neon-gold font-medium' : 'text-dark-300'}`}>
                      {style.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {viewData.from !== 'history' && viewData.myAssignment && (
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate(`/box/${id}/payment`)}
            >
              分摊结算
            </Button>
          )}
          <Button
            fullWidth
            onClick={() => navigate('/history')}
            variant={viewData.from === 'history' ? 'primary' : 'secondary'}
          >
            {viewData.from === 'history' ? '返回战绩列表' : '查看历史战绩'}
          </Button>
          {viewData.from !== 'history' && (
            <Button
              fullWidth
              onClick={() => navigate('/')}
            >
              返回大厅
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
