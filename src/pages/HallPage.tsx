import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Flame, Clock, TrendingUp, Plus, Filter, Search } from 'lucide-react';
import Header from '@/components/Layout/Header';
import BoxCard from '@/components/BoxCard/BoxCard';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { useBoxStore } from '@/store/useBoxStore';
import { seriesList } from '@/data/series';

export default function HallPage() {
  const navigate = useNavigate();
  const { getFilteredBoxes, currentCity } = useBoxStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  const boxes = useMemo(() => getFilteredBoxes(), [getFilteredBoxes]);

  const filteredBoxes = useMemo(() => {
    let result = [...boxes];
    
    if (activeFilter === 'hot') {
      result = result.filter(b => b.joinedSlots / b.totalSlots >= 0.7);
    } else if (activeFilter === 'urgent') {
      result = result.filter(b => {
        const diff = new Date(b.expireAt).getTime() - Date.now();
        return diff < 1800000;
      });
    } else if (activeFilter === 'new') {
      result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (searchText) {
      result = result.filter(b => 
        b.seriesName.toLowerCase().includes(searchText.toLowerCase()) ||
        b.mall.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return result;
  }, [boxes, activeFilter, searchText]);

  const popularSeries = seriesList.slice(0, 4);

  return (
    <div className="min-h-screen bg-grid">
      <Header />
      
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-32 right-1/4 w-72 h-72 bg-neon-pink/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto stagger-animation">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in">
              <Zap className="w-4 h-4 text-neon-amber" />
              <span className="text-sm text-dark-200">最快 30 分钟凑齐开盒</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">
              <span className="gradient-text neon-text">闪电拼盒</span>
              <br />
              <span className="text-white">同城潮玩新玩法</span>
            </h1>
            
            <p className="text-dark-400 text-lg mb-8 max-w-xl mx-auto">
              选择心仪系列，匹配同城玩家，现场拆盒透明分盒
              <br />
              隐藏款优先、均分模式、轮转选秀，想怎么拼就怎么拼
            </p>

            <div className="relative max-w-lg mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-dark-500" />
              </div>
              <input
                type="text"
                placeholder="搜索系列、商圈..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:border-neon-purple/50 transition-colors"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={() => navigate('/create')}>
                <Plus className="w-5 h-5" />
                立即发起拼盒
              </Button>
              <Button variant="outline" size="lg">
                了解拼盒规则
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto stagger-animation">
            <div className="glass rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold gradient-text mb-1">200+</div>
              <div className="text-dark-400 text-sm">今日拼盒</div>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold gradient-text mb-1">95%</div>
              <div className="text-dark-400 text-sm">30分钟凑齐率</div>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold gradient-text mb-1">50+</div>
              <div className="text-dark-400 text-sm">热门系列</div>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold gradient-text mb-1">5w+</div>
              <div className="text-dark-400 text-sm">活跃玩家</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-5 h-5 text-neon-pink" />
            <h2 className="text-xl font-bold text-white">热门系列</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-animation">
            {popularSeries.map((series) => (
              <div
                key={series.id}
                className="glass rounded-2xl overflow-hidden cursor-pointer card-hover group"
                onClick={() => setSearchText(series.name)}
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={series.cover}
                    alt={series.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3">
                    <p className="text-white text-sm font-medium truncate">{series.name}</p>
                    <p className="text-dark-400 text-xs">{series.boxCount}个/盒</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-neon-purple" />
              <h2 className="text-xl font-bold text-white">
                {currentCity} · 进行中的拼盒
              </h2>
              <Tag variant="purple">{filteredBoxes.length} 个</Tag>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-1 glass rounded-xl">
                {[
                  { key: 'all', label: '全部' },
                  { key: 'hot', label: '热门' },
                  { key: 'urgent', label: '即将截止' },
                  { key: 'new', label: '最新' },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeFilter === filter.key
                        ? 'gradient-bg text-white'
                        : 'text-dark-300 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <button className="p-2.5 glass rounded-xl hover:bg-white/5 transition-colors">
                <Filter className="w-5 h-5 text-dark-300" />
              </button>
            </div>
          </div>

          {filteredBoxes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
              {filteredBoxes.map((box) => (
                <BoxCard key={box.id} box={box} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full glass flex items-center justify-center">
                <Clock className="w-10 h-10 text-dark-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">暂无拼盒</h3>
              <p className="text-dark-400 mb-6">换个筛选条件试试，或者自己发起一个吧</p>
              <Button onClick={() => navigate('/create')}>
                <Plus className="w-4 h-4" />
                发起拼盒
              </Button>
            </div>
          )}
        </div>
      </section>

      <button
        onClick={() => navigate('/create')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-bg text-white shadow-lg glow-hover flex items-center justify-center z-40 md:hidden"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
