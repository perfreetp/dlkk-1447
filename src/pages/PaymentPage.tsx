import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, CheckCircle, Clock, Users, Receipt, ChevronRight, Share2, AlertCircle, Truck, RefreshCw, Gift } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { useBoxStore } from '@/store/useBoxStore';
import { formatPrice, getRuleTypeName, formatDateTime, getDeliveryTypeName } from '@/utils/format';
import type { DeliveryType } from '@/types';

const DELIVERY_COST: Record<DeliveryType, number> = {
  self: 0,
  proxy: 8,
  delivery: 15,
};

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBoxById, currentUserId, getDeliveryType } = useBoxStore();
  const [paymentMethod, setPaymentMethod] = useState('wechat');
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paidDelivery, setPaidDelivery] = useState<DeliveryType>('self');
  
  const box = useMemo(() => id ? getBoxById(id) : undefined, [id, getBoxById]);
  const deliveryType = useMemo(() => 
    id ? getDeliveryType(id) : 'self' as DeliveryType, 
    [id, getDeliveryType]
  );

  const myMember = useMemo(() => 
    box?.members.find(m => m.userId === currentUserId),
    [box, currentUserId]
  );

  const paymentMethods = [
    { id: 'wechat', name: '微信支付', icon: '💬', color: 'text-green-400' },
    { id: 'alipay', name: '支付宝', icon: '💰', color: 'text-blue-400' },
    { id: 'balance', name: '余额支付', icon: '👛', color: 'text-neon-purple' },
  ];

  const deliveryInfo: Record<DeliveryType, { label: string; icon: any; desc: string }> = {
    self: { label: '到店自提', icon: Gift, desc: '现场拆盒直接取走' },
    proxy: { label: '代取', icon: RefreshCw, desc: '发起人代取后邮寄' },
    delivery: { label: '同城送达', icon: Truck, desc: '专人同城配送' },
  };

  const costDetails = [
    { label: '拼盒费用', value: box?.pricePerSlot || 0 },
    { label: '服务费', value: 0 },
    { label: deliveryInfo[deliveryType].label + '费', value: DELIVERY_COST[deliveryType] },
  ];

  const totalCost = costDetails.reduce((sum, item) => sum + item.value, 0);

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaidAmount(totalCost);
      setPaidDelivery(deliveryType);
      setIsPaid(true);
    }, 2000);
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

  if (isPaid) {
    return (
      <div className="min-h-screen bg-grid">
        <Header />

        <div className="container mx-auto px-4 pt-24 max-w-lg">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-neon-green" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">支付成功</h2>
            <p className="text-dark-400 mb-6">你的拼盒费用已结清</p>

            <div className="glass-light rounded-xl p-4 mb-6 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-dark-400">支付金额</span>
                <span className="text-2xl font-bold gradient-text">{formatPrice(paidAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">支付方式</span>
                <span className="text-dark-200">
                  {paymentMethods.find(m => m.id === paymentMethod)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm pt-3 border-t border-dark-700/50">
                <span className="text-dark-400">取货方式</span>
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const info = deliveryInfo[paidDelivery];
                    const IconCmp = info.icon;
                    return (
                      <Tag variant={paidDelivery === 'self' ? 'success' : paidDelivery === 'proxy' ? 'purple' : 'warning'} size="sm">
                        <IconCmp className="w-3 h-3 mr-1" />
                        {info.label}
                      </Tag>
                    );
                  })()}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-dark-700/50">
                {costDetails.map((item, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-dark-500 text-xs mb-1">{item.label}</p>
                    <p className={`font-semibold text-sm ${item.value === 0 ? 'text-neon-green' : 'text-white'}`}>
                      {item.value === 0 ? '免费' : formatPrice(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button fullWidth onClick={() => navigate(`/box/${box.id}/result`)}>
                查看拆盒结果
              </Button>
              <Button variant="secondary" fullWidth onClick={() => navigate('/history')}>
                查看历史战绩
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid pb-32">
      <Header />

      <div className="glass border-b border-primary-500/20 mt-16">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-dark-300" />
          </button>
          <h1 className="text-white font-semibold">分摊结算</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-lg">
        <div className="glass rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <img src={box.seriesCover} alt={box.seriesName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">{box.seriesName}</h3>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <span>{box.mall}</span>
                <span>·</span>
                <span>{formatDateTime(box.meetTime)}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Tag variant="purple" size="sm">{getRuleTypeName(box.ruleType)}</Tag>
                <Tag variant="default" size="sm">{box.joinedSlots}人拼</Tag>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-neon-green" />
            取货方式
          </h3>
          <div className="space-y-2">
            {(Object.keys(deliveryInfo) as DeliveryType[]).map((type) => {
              const info = deliveryInfo[type];
              const IconCmp = info.icon;
              const cost = DELIVERY_COST[type];
              const isSelected = deliveryType === type;
              return (
                <div
                  key={type}
                  className={`p-4 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-neon-green/15 border border-neon-green/50'
                      : 'glass-light'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-neon-green/20' : 'bg-dark-700/50'
                    }`}>
                      <IconCmp className={`w-5 h-5 ${isSelected ? 'text-neon-green' : 'text-dark-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isSelected ? 'text-neon-green' : 'text-dark-200'}`}>
                          {info.label}
                        </span>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-neon-green" />
                        )}
                      </div>
                      <p className="text-xs text-dark-500 mt-0.5">{info.desc}</p>
                    </div>
                    <span className={`text-sm font-semibold ${cost === 0 ? 'text-neon-green' : 'text-white'}`}>
                      {cost === 0 ? '免费' : `+${formatPrice(cost)}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-neon-purple" />
            费用明细
          </h3>

          <div className="space-y-3">
            {costDetails.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-dark-400">{item.label}</span>
                <span className={`${item.value === 0 ? 'text-neon-green' : 'text-white'}`}>
                  {item.value === 0 ? '免费' : formatPrice(item.value)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-dark-700 mt-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">应付金额</span>
              <span className="text-2xl font-bold gradient-text">{formatPrice(totalCost)}</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-neon-purple" />
            支付方式
          </h3>

          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
                  paymentMethod === method.id
                    ? 'bg-neon-purple/15 border border-neon-purple/50'
                    : 'glass-light hover:border-dark-500'
                }`}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className={`flex-1 text-left font-medium ${
                  paymentMethod === method.id ? 'text-neon-purple' : 'text-dark-200'
                }`}>
                  {method.name}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === method.id
                    ? 'border-neon-purple bg-neon-purple'
                    : 'border-dark-500'
                }`}>
                  {paymentMethod === method.id && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-neon-amber flex-shrink-0 mt-0.5" />
            <div className="text-sm text-dark-400">
              <p className="text-dark-300 font-medium mb-1">温馨提示</p>
              <ul className="space-y-1">
                <li>• 拆盒结束后系统自动计算费用，多退少补</li>
                <li>• 隐藏款优先模式按出价结算</li>
                <li>• 如有疑问请联系拼盒发起人协商</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 glass border-t border-primary-500/20">
        <div className="container mx-auto px-4 py-4 max-w-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-dark-400">应付金额</span>
            <span className="text-2xl font-bold gradient-text">{formatPrice(totalCost)}</span>
          </div>
          <Button
            fullWidth
            size="lg"
            onClick={handlePay}
            disabled={isPaying}
          >
            {isPaying ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                支付中...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                立即支付
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
