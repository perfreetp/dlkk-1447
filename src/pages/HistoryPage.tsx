import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, TrendingUp, Clock, Filter, ChevronRight, Calendar, MapPin, Crown, Sparkles } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Tag from '@/components/ui/Tag';
import Button from '@/components/ui/Button';
import { useBoxStore } from '@/store/useBoxStore';
import { formatPrice, formatDate, getRuleTypeName } from '@/utils/format';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { getHistoryRecords, getStats } = useBoxStore();
  const [filterType, setFilterType] = useState<'all' | 'hidden' | 'normal'>('all');
  
  const records = getHistoryRecords();
  const stats = getStats();

  const filteredRecords = useMemo(() => {
    if (filterType === 'hidden') {
      return records.filter(r => r.hasHidden);
    }
    if (filterType === 'normal') {
      return records.filter(r => !r.hasHidden);
    }
    return records;
  }, [records, filterType]);

  const statCards = [
    { label: '总拼盒数', value: stats.total, icon: Trophy, color: 'text-neon-purple', bg: 'bg-neon-purple/20' },
    { label: '隐藏款数', value: stats.hiddenCount, icon: Crown, color: 'text-neon-gold', bg: 'bg-neon-gold/20' },
    { label: '隐藏率', value: `${stats.winRate}%`, icon: TrendingUp, color: 'text-neon-green', bg: 'bg-neon-green/20' },
    { label: '总花费', value: formatPrice(stats.totalSpent), icon: Star, color: 'text-neon-pink', bg: 'bg-neon-pink/20' },
  ];

  const filterOptions = [
    { value: 'all', label: '全部' },
    { value: 'hidden', label: '有隐藏款' },
    { value: 'normal', label: '普通' },
  ];

  return (
    <div className="min-h-screen bg-grid pb-20">
      <Header />

      <div className="container mx-auto px-4 pt-24">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-neon-gold" />
            历史战绩
          </h1>
          <p className="text-dark-400">记录你的每一次拼盒之旅</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-animation">
          {statCards.map((stat, idx) => (
            <div key={idx} className="glass rounded-2xl p-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-dark-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-neon-purple" />
            拼盒记录
          </h2>
          <div className="flex items-center gap-1 glass rounded-xl p-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterType(option.value as any)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filterType === option.value
                    ? 'bg-neon-purple/30 text-white'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700/50 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-dark-500" />
              </div>
              <p className="text-dark-400 mb-4">暂无拼盒记录</p>
              <Button onClick={() => navigate('/')}>去拼盒大厅</Button>
            </div>
          ) : (
            filteredRecords.map((record, idx) => (
              <div
                key={record.id}
                className="glass rounded-2xl overflow-hidden card-hover cursor-pointer transition-all"
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => navigate(`/box/${record.boxId}/result`)}
              >
                <div className="p-5">
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden">
                        <img
                          src={record.seriesCover}
                          alt={record.seriesName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {record.hasHidden && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-neon-gold flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-dark-900" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white font-semibold truncate">{record.seriesName}</h3>
                        <ChevronRight className="w-5 h-5 text-dark-500 flex-shrink-0" />
                      </div>

                      <div className="flex items-center gap-3 text-sm text-dark-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(record.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {record.mall}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag variant="purple" size="sm">
                          {getRuleTypeName(record.ruleType)}
                        </Tag>
                        {record.hasHidden && (
                          <Tag variant="gold" size="sm">
                            获得隐藏款
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-dark-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-dark-400 text-sm">获得款式：</span>
                        <div className="flex -space-x-2">
                          {record.gotStyles.slice(0, 3).map((style, sIdx) => (
                            <div
                              key={sIdx}
                              className={`w-8 h-8 rounded-lg overflow-hidden border-2 border-dark-800 ${
                                style.isHidden ? 'ring-2 ring-neon-gold' : ''
                              }`}
                            >
                              <img
                                src={style.image}
                                alt={style.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {record.gotStyles.length > 3 && (
                            <div className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center border-2 border-dark-800">
                              <span className="text-xs text-dark-400">+{record.gotStyles.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-dark-400 text-sm">共花费 </span>
                        <span className="text-neon-purple font-semibold">{formatPrice(record.totalSpent)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
