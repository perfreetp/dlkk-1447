import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Box, Settings, Users, Zap, ChevronRight, Check, Clock } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { useBoxStore } from '@/store/useBoxStore';
import { getCities, getDistricts, getMalls, getStores } from '@/data/cities';
import { seriesList } from '@/data/series';
import { formatPrice, formatTime } from '@/utils/format';
import { getTimeSlots } from '@/utils/date';
import type { RuleType } from '@/types';

const steps = [
  { id: 1, name: '选择地点', icon: MapPin },
  { id: 2, name: '选择系列', icon: Box },
  { id: 3, name: '时间规则', icon: Settings },
  { id: 4, name: '确认发布', icon: Zap },
];

const ruleOptions: { type: RuleType; title: string; desc: string; icon: string }[] = [
  { type: 'hidden-first', title: '隐藏款优先', desc: '隐藏款出价最高者获得，普通款按出价顺序轮流选择', icon: '👑' },
  { type: 'average', title: '普通款均分', desc: '隐藏款随机抽取，普通款平均分配，差额多退少补', icon: '⚖️' },
  { type: 'rotation', title: '按序轮转', desc: '按加入顺序轮流选择，蛇形选秀公平公正', icon: '🔄' },
];

export default function CreatePage() {
  const navigate = useNavigate();
  const { createForm, setCreateForm, resetCreateForm, createBox, currentCity } = useBoxStore();
  const [currentStep, setCurrentStep] = useState(1);

  const cities = getCities();
  const districts = useMemo(() => getDistricts(createForm.city || currentCity), [createForm.city, currentCity]);
  const malls = useMemo(() => getMalls(createForm.city || currentCity, createForm.district || ''), [createForm.city, createForm.district]);
  const stores = useMemo(() => getStores(createForm.city || currentCity, createForm.district || '', createForm.mall || ''), [createForm.city, createForm.district, createForm.mall]);
  const timeSlots = useMemo(() => getTimeSlots(), []);

  const selectedSeries = useMemo(() => 
    seriesList.find(s => s.id === createForm.seriesId),
    [createForm.seriesId]
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1: return createForm.district && createForm.mall && createForm.storeName;
      case 2: return createForm.seriesId;
      case 3: return createForm.ruleType && createForm.totalSlots && createForm.pricePerSlot && createForm.meetTime;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelectTime = (slot: string) => {
    const [hours, minutes] = slot.split(':').map(Number);
    const newDate = new Date();
    newDate.setHours(hours, minutes, 0, 0);
    setCreateForm({ meetTime: newDate });
  };

  const handleSubmit = () => {
    if (!createForm.meetTime) return;
    const formData = {
      city: createForm.city || currentCity,
      district: createForm.district || '',
      mall: createForm.mall || '',
      storeName: createForm.storeName || '',
      seriesId: createForm.seriesId || '',
      meetTime: createForm.meetTime,
      ruleType: createForm.ruleType || 'hidden-first',
      totalSlots: createForm.totalSlots || 6,
      pricePerSlot: createForm.pricePerSlot || 0,
    };
    const newBox = createBox(formData);
    resetCreateForm();
    navigate(`/box/${newBox.id}`);
  };

  return (
    <div className="min-h-screen bg-grid pb-24">
      <Header />

      <div className="pt-20 pb-6 border-b border-dark-700/50 glass sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-dark-300" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">发起拼盒</h1>
              <p className="text-dark-400 text-sm">第 {currentStep} 步，共 4 步</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step.id < currentStep 
                      ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                      : step.id === currentStep
                      ? 'gradient-bg text-white glow-hover'
                      : 'bg-dark-700 text-dark-500 border border-dark-600'
                  }`}>
                    {step.id < currentStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-2 ${
                    step.id <= currentStep ? 'text-white' : 'text-dark-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-6 ${
                    step.id < currentStep ? 'bg-neon-green' : 'bg-dark-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">选择城市</h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setCreateForm({ city })}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      (createForm.city || currentCity) === city
                        ? 'gradient-bg text-white'
                        : 'glass text-dark-200 hover:text-white hover:border-neon-purple/50'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {createForm.city && (
              <div className="animate-slide-up">
                <h2 className="text-lg font-semibold text-white mb-4">选择行政区</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {districts.map((district) => (
                    <button
                      key={district}
                      onClick={() => setCreateForm({ district, mall: '', storeName: '' })}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        createForm.district === district
                          ? 'gradient-bg text-white'
                          : 'glass text-dark-200 hover:text-white hover:border-neon-purple/50'
                      }`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {createForm.district && (
              <div className="animate-slide-up">
                <h2 className="text-lg font-semibold text-white mb-4">选择商圈</h2>
                <div className="space-y-3">
                  {malls.map((mall) => (
                    <button
                      key={mall}
                      onClick={() => setCreateForm({ mall, storeName: '' })}
                      className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                        createForm.mall === mall
                          ? 'glass neon-border'
                          : 'glass hover:border-neon-purple/30'
                      }`}
                    >
                      <div>
                        <p className="text-white font-medium">{mall}</p>
                        <p className="text-dark-400 text-sm">{stores.length} 家潮玩店</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${
                        createForm.mall === mall ? 'text-neon-purple' : 'text-dark-500'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {createForm.mall && (
              <div className="animate-slide-up">
                <h2 className="text-lg font-semibold text-white mb-4">选择门店</h2>
                <div className="space-y-2">
                  {stores.map((store) => (
                    <button
                      key={store}
                      onClick={() => setCreateForm({ storeName: store })}
                      className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                        createForm.storeName === store
                          ? 'bg-neon-purple/20 border border-neon-purple/50'
                          : 'glass-light hover:bg-dark-700/50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        createForm.storeName === store
                          ? 'border-neon-purple bg-neon-purple'
                          : 'border-dark-500'
                      }`}>
                        {createForm.storeName === store && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-dark-100">{store}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">选择潮玩系列</h2>
              <p className="text-dark-400 text-sm mb-6">选择你想要拼的系列，整盒一起拼更划算</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seriesList.map((series) => (
                <button
                  key={series.id}
                  onClick={() => {
                    setCreateForm({
                      seriesId: series.id,
                      totalSlots: series.boxCount / 2,
                      pricePerSlot: Math.round(series.price / (series.boxCount / 2)),
                    });
                  }}
                  className={`p-4 rounded-2xl text-left transition-all flex gap-4 ${
                    createForm.seriesId === series.id
                      ? 'glass neon-border'
                      : 'glass hover:border-neon-purple/30'
                  }`}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={series.cover} alt={series.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white font-medium truncate">{series.name}</h3>
                      {createForm.seriesId === series.id && (
                        <div className="w-6 h-6 rounded-full bg-neon-green flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-dark-900" />
                        </div>
                      )}
                    </div>
                    <p className="text-dark-400 text-sm mt-1">{series.brand}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Tag variant="purple">{series.boxCount}个/盒</Tag>
                      <span className="text-neon-purple font-semibold">{formatPrice(series.price)}</span>
                    </div>
                    <p className="text-neon-amber text-xs mt-2">
                      隐藏款：{series.hiddenName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-neon-amber" />
                选择到店时间
              </h2>
              <p className="text-dark-400 text-sm mb-6">选择你计划到店拆盒的时间，建议预留30-60分钟路程时间</p>
              
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neon-purple" />
                    <span className="text-dark-300">今天稍后可选时段</span>
                  </div>
                  {createForm.meetTime && (
                    <Tag variant="success" size="sm">
                      已选 {formatTime(createForm.meetTime)}
                    </Tag>
                  )}
                </div>
                {timeSlots.length === 0 ? (
                  <p className="text-dark-500 text-sm text-center py-6">今日时段已满，请改天再来</p>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => {
                      const slotDate = new Date();
                      const [h, m] = slot.split(':').map(Number);
                      slotDate.setHours(h, m, 0, 0);
                      const isSelected = createForm.meetTime && 
                        createForm.meetTime.getHours() === h && 
                        createForm.meetTime.getMinutes() === m;
                      return (
                        <button
                          key={slot}
                          onClick={() => handleSelectTime(slot)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all ${
                            isSelected
                              ? 'gradient-bg text-white glow-hover'
                              : 'glass-light text-dark-200 hover:text-white hover:border-neon-purple/40'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-4">选择分盒规则</h2>
              <div className="space-y-3">
                {ruleOptions.map((rule) => (
                  <button
                    key={rule.type}
                    onClick={() => setCreateForm({ ruleType: rule.type })}
                    className={`w-full p-5 rounded-2xl text-left transition-all ${
                      createForm.ruleType === rule.type
                        ? 'glass neon-border'
                        : 'glass hover:border-neon-purple/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{rule.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold text-lg">{rule.title}</h3>
                          {createForm.ruleType === rule.type && (
                            <div className="w-6 h-6 rounded-full bg-neon-green flex items-center justify-center">
                              <Check className="w-4 h-4 text-dark-900" />
                            </div>
                          )}
                        </div>
                        <p className="text-dark-400 text-sm mt-1">{rule.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-4">设置拼盒人数</h2>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-dark-300">拼盒人数</span>
                  <span className="text-2xl font-bold gradient-text">{createForm.totalSlots} 人</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max={selectedSeries?.boxCount || 12}
                  value={createForm.totalSlots}
                  onChange={(e) => {
                    const slots = parseInt(e.target.value);
                    const price = selectedSeries ? Math.round(selectedSeries.price / slots) : 0;
                    setCreateForm({ totalSlots: slots, pricePerSlot: price });
                  }}
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-neon-purple"
                />
                <div className="flex justify-between text-xs text-dark-500 mt-2">
                  <span>2人</span>
                  <span>{selectedSeries?.boxCount || 12}人（整盒）</span>
                </div>
              </div>
            </div>

            {selectedSeries && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">每人预算</p>
                    <p className="text-2xl font-bold gradient-text mt-1">
                      {formatPrice(createForm.pricePerSlot || 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-dark-400 text-sm">整盒价格</p>
                    <p className="text-lg font-semibold text-white mt-1">
                      {formatPrice(selectedSeries.price)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">确认拼盒信息</h2>
              <p className="text-dark-400 mt-2">确认无误后即可发布，等待匹配小伙伴</p>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-dark-700/50">
                <div className="flex gap-4">
                  {selectedSeries && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={selectedSeries.cover} alt={selectedSeries.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-semibold text-lg">{selectedSeries?.name}</h3>
                    <p className="text-dark-400 text-sm">{selectedSeries?.brand}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Tag variant="purple">{ruleOptions.find(r => r.type === createForm.ruleType)?.title}</Tag>
                      <Tag variant="default">{createForm.totalSlots}人拼盒</Tag>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between">
                  <span className="text-dark-400">拼盒地点</span>
                  <span className="text-white text-right">
                    {createForm.city}<br />
                    <span className="text-dark-300 text-sm">{createForm.mall} · {createForm.storeName}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">到店时间</span>
                  <span className="text-neon-green font-semibold">
                    {createForm.meetTime ? formatTime(createForm.meetTime) : '未选择'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">拼盒人数</span>
                  <span className="text-white">{createForm.totalSlots} 人</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">每人预算</span>
                  <span className="text-neon-purple font-bold text-lg">
                    {formatPrice(createForm.pricePerSlot || 0)}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-dark-700/50">
                  <span className="text-dark-400">整盒总价</span>
                  <span className="text-white font-semibold">
                    {formatPrice(selectedSeries?.price || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="text-white font-medium mb-3">💡 温馨提示</h3>
              <ul className="text-dark-400 text-sm space-y-2">
                <li>• 发布后 2 小时内未凑齐将自动取消</li>
                <li>• 加入后 15 分钟内未支付定金将自动退出</li>
                <li>• 拼盒成功后请按时到店，爽约会影响信用</li>
                <li>• 分盒过程全程透明，结果公布后请及时确认</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-dark-700/50 z-40">
        <div className="container mx-auto px-4 flex gap-3 max-w-3xl">
          {currentStep > 1 ? (
            <Button variant="secondary" onClick={handlePrev} className="flex-1">
              上一步
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => navigate(-1)} className="flex-1">
              取消
            </Button>
          )}
          
          {currentStep < 4 ? (
            <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
              下一步
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed()} size="lg" className="flex-1">
              <Zap className="w-5 h-5" />
              发布拼盒
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
