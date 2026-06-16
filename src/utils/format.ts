export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(0)}`;
};

export const formatCountdown = (seconds: number): string => {
  if (seconds <= 0) return '00:00:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const formatDate = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return formatDate(date);
};

export const getRuleTypeName = (type: string): string => {
  const map: Record<string, string> = {
    'hidden-first': '隐藏款优先',
    'average': '普通款均分',
    'rotation': '按序轮转',
  };
  return map[type] || type;
};

export const getStatusName = (status: string): string => {
  const map: Record<string, string> = {
    'recruiting': '招募中',
    'full': '凑齐待开',
    'opening': '拆盒中',
    'completed': '已完成',
    'cancelled': '已取消',
  };
  return map[status] || status;
};

export const getDeliveryTypeName = (type: string): string => {
  const map: Record<string, string> = {
    'self': '到店自提',
    'proxy': '代取',
    'delivery': '同城送达',
  };
  return map[type] || type;
};
