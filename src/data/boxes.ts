import type { Box, BoxResult, ChatMessage, HistoryRecord } from '@/types';
import { seriesList } from './series';

const now = new Date();

const addHours = (date: Date, hours: number) => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
};

const addMinutes = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

export const boxes: Box[] = [
  {
    id: 'box-001',
    seriesId: 'series-001',
    seriesName: 'DIMOO 太空旅行系列',
    seriesCover: seriesList[0].cover,
    seriesBrand: 'POP MART',
    city: '上海',
    district: '静安区',
    mall: '静安大悦城',
    storeName: 'POP MART 旗舰店',
    meetTime: addMinutes(now, 45),
    totalSlots: 6,
    joinedSlots: 4,
    status: 'recruiting',
    ruleType: 'hidden-first',
    ruleDescription: '隐藏款出价最高者获得，普通款按出价顺序轮流选择',
    creatorId: 'user-001',
    creatorName: '潮玩小王子',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    pricePerSlot: 118,
    totalPrice: 708,
    createdAt: addMinutes(now, -30),
    expireAt: addMinutes(now, 90),
    members: [
      { userId: 'user-001', nickname: '潮玩小王子', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', slotNumber: 1, budget: 200, isCreator: true, status: 'paid', joinedAt: addMinutes(now, -30) },
      { userId: 'user-002', nickname: 'DIMOO控', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', slotNumber: 2, budget: 150, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -25) },
      { userId: 'user-003', nickname: '太空漫游者', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop', slotNumber: 3, budget: 180, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -20) },
      { userId: 'user-004', nickname: '追星达人', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', slotNumber: 4, budget: 120, isCreator: false, status: 'pending', joinedAt: addMinutes(now, -5) },
    ],
  },
  {
    id: 'box-002',
    seriesId: 'series-002',
    seriesName: 'MOLLY 我的小时候系列',
    seriesCover: seriesList[1].cover,
    seriesBrand: 'POP MART',
    city: '上海',
    district: '黄浦区',
    mall: '上海来福士广场',
    storeName: 'POP MART',
    meetTime: addMinutes(now, 30),
    totalSlots: 12,
    joinedSlots: 9,
    status: 'recruiting',
    ruleType: 'average',
    ruleDescription: '隐藏款随机抽取，普通款平均分配，差额多退少补',
    creatorId: 'user-005',
    creatorName: 'MOLLY收藏家',
    creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    pricePerSlot: 63,
    totalPrice: 756,
    createdAt: addMinutes(now, -60),
    expireAt: addMinutes(now, 60),
    members: [
      { userId: 'user-005', nickname: 'MOLLY收藏家', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', slotNumber: 1, budget: 63, isCreator: true, status: 'paid', joinedAt: addMinutes(now, -60) },
      { userId: 'user-006', nickname: '童年回忆', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', slotNumber: 2, budget: 63, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -55) },
      { userId: 'user-007', nickname: '小确幸', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', slotNumber: 3, budget: 63, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -50) },
      { userId: 'user-008', nickname: '拆盒狂人', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', slotNumber: 4, budget: 63, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -45) },
      { userId: 'user-009', nickname: '泡泡酱', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', slotNumber: 5, budget: 63, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -40) },
      { userId: 'user-010', nickname: '潮玩新手', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', slotNumber: 6, budget: 63, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -35) },
      { userId: 'user-011', nickname: '收集狂魔', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', slotNumber: 7, budget: 63, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -30) },
      { userId: 'user-012', nickname: '幸运儿', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', slotNumber: 8, budget: 63, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -25) },
      { userId: 'user-013', nickname: '梦女孩', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', slotNumber: 9, budget: 63, isCreator: false, status: 'pending', joinedAt: addMinutes(now, -10) },
    ],
  },
  {
    id: 'box-003',
    seriesId: 'series-003',
    seriesName: 'LABUBU 精灵天团系列',
    seriesCover: seriesList[2].cover,
    seriesBrand: 'POP MART',
    city: '北京',
    district: '朝阳区',
    mall: '朝阳大悦城',
    storeName: 'POP MART 旗舰店',
    meetTime: addMinutes(now, 60),
    totalSlots: 4,
    joinedSlots: 4,
    status: 'full',
    ruleType: 'rotation',
    ruleDescription: '按加入顺序轮流选择，第一轮正向第二轮反向，蛇形选秀',
    creatorId: 'user-014',
    creatorName: 'LABUBU粉',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    pricePerSlot: 207,
    totalPrice: 828,
    createdAt: addMinutes(now, -120),
    expireAt: addMinutes(now, 30),
    members: [
      { userId: 'user-014', nickname: 'LABUBU粉', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', slotNumber: 1, budget: 207, isCreator: true, status: 'paid', joinedAt: addMinutes(now, -120) },
      { userId: 'user-015', nickname: '精灵控', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop', slotNumber: 2, budget: 207, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -100) },
      { userId: 'user-016', nickname: '潮玩达人', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', slotNumber: 3, budget: 207, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -80) },
      { userId: 'user-017', nickname: '收集家', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', slotNumber: 4, budget: 207, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -60) },
    ],
  },
  {
    id: 'box-004',
    seriesId: 'series-004',
    seriesName: 'SKULLPANDA 密林古堡系列',
    seriesCover: seriesList[3].cover,
    seriesBrand: 'POP MART',
    city: '深圳',
    district: '南山区',
    mall: '海岸城',
    storeName: 'X11 潮玩集合店',
    meetTime: addHours(now, -2),
    totalSlots: 6,
    joinedSlots: 6,
    status: 'completed',
    ruleType: 'hidden-first',
    ruleDescription: '隐藏款出价最高者获得，普通款按出价顺序轮流选择',
    creatorId: 'user-018',
    creatorName: '密林探险家',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    pricePerSlot: 116,
    totalPrice: 696,
    createdAt: addHours(now, -5),
    expireAt: addHours(now, -3),
    members: [
      { userId: 'user-018', nickname: '密林探险家', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', slotNumber: 1, budget: 300, isCreator: true, status: 'confirmed', joinedAt: addHours(now, -5) },
      { userId: 'user-019', nickname: '吸血鬼控', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', slotNumber: 2, budget: 200, isCreator: false, status: 'confirmed', joinedAt: addHours(now, -4.5) },
      { userId: 'user-020', nickname: '古堡迷', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', slotNumber: 3, budget: 150, isCreator: false, status: 'confirmed', joinedAt: addHours(now, -4) },
      { userId: 'user-021', nickname: '暗黑风', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', slotNumber: 4, budget: 180, isCreator: false, status: 'confirmed', joinedAt: addHours(now, -3.5) },
      { userId: 'user-022', nickname: '玫瑰猎人', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', slotNumber: 5, budget: 250, isCreator: false, status: 'confirmed', joinedAt: addHours(now, -3) },
      { userId: 'user-023', nickname: '幽灵小姐', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', slotNumber: 6, budget: 100, isCreator: false, status: 'confirmed', joinedAt: addHours(now, -2.5) },
    ],
  },
  {
    id: 'box-005',
    seriesId: 'series-005',
    seriesName: 'PUCKY 精灵们在做什么系列',
    seriesCover: seriesList[4].cover,
    seriesBrand: 'POP MART',
    city: '杭州',
    district: '上城区',
    mall: '湖滨in77',
    storeName: 'POP MART 旗舰店',
    meetTime: addMinutes(now, 90),
    totalSlots: 12,
    joinedSlots: 3,
    status: 'recruiting',
    ruleType: 'average',
    ruleDescription: '隐藏款随机抽取，普通款平均分配，差额多退少补',
    creatorId: 'user-024',
    creatorName: 'PUCKY小精灵',
    creatorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    pricePerSlot: 54,
    totalPrice: 648,
    createdAt: addMinutes(now, -15),
    expireAt: addMinutes(now, 105),
    members: [
      { userId: 'user-024', nickname: 'PUCKY小精灵', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop', slotNumber: 1, budget: 54, isCreator: true, status: 'paid', joinedAt: addMinutes(now, -15) },
      { userId: 'user-025', nickname: '梦幻精灵', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', slotNumber: 2, budget: 54, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -10) },
      { userId: 'user-026', nickname: '独角兽控', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', slotNumber: 3, budget: 54, isCreator: false, status: 'pending', joinedAt: addMinutes(now, -2) },
    ],
  },
  {
    id: 'box-006',
    seriesId: 'series-006',
    seriesName: 'HIRONO 小野二代系列',
    seriesCover: seriesList[5].cover,
    seriesBrand: 'POP MART',
    city: '广州',
    district: '天河区',
    mall: '正佳广场',
    storeName: 'X11 潮玩集合店',
    meetTime: addMinutes(now, 20),
    totalSlots: 6,
    joinedSlots: 5,
    status: 'recruiting',
    ruleType: 'rotation',
    ruleDescription: '按加入顺序轮流选择，第一轮正向第二轮反向，蛇形选秀',
    creatorId: 'user-027',
    creatorName: '小野信徒',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    pricePerSlot: 132,
    totalPrice: 792,
    createdAt: addMinutes(now, -45),
    expireAt: addMinutes(now, 75),
    members: [
      { userId: 'user-027', nickname: '小野信徒', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', slotNumber: 1, budget: 132, isCreator: true, status: 'paid', joinedAt: addMinutes(now, -45) },
      { userId: 'user-028', nickname: '情绪收藏家', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', slotNumber: 2, budget: 132, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -40) },
      { userId: 'user-029', nickname: '孤独患者', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', slotNumber: 3, budget: 132, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -35) },
      { userId: 'user-030', nickname: '文艺青年', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', slotNumber: 4, budget: 132, isCreator: false, status: 'paid', joinedAt: addMinutes(now, -25) },
      { userId: 'user-031', nickname: '另一个我', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', slotNumber: 5, budget: 132, isCreator: false, status: 'pending', joinedAt: addMinutes(now, -8) },
    ],
  },
];

export const chatMessages: Record<string, ChatMessage[]> = {
  'box-001': [
    { id: 'm1', boxId: 'box-001', userId: 'system', userName: '系统', userAvatar: '', content: '潮玩小王子 发起了拼盒', type: 'system', timestamp: addMinutes(now, -30) },
    { id: 'm2', boxId: 'box-001', userId: 'user-002', userName: 'DIMOO控', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', content: '终于等到太空系列拼盒了！', type: 'text', timestamp: addMinutes(now, -28) },
    { id: 'm3', boxId: 'box-001', userId: 'user-001', userName: '潮玩小王子', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', content: '哈哈我也是蹲了好久，就想拼个隐藏款', type: 'text', timestamp: addMinutes(now, -27) },
    { id: 'm4', boxId: 'box-001', userId: 'system', userName: '系统', userAvatar: '', content: 'DIMOO控 加入了拼盒', type: 'system', timestamp: addMinutes(now, -25) },
    { id: 'm5', boxId: 'box-001', userId: 'user-003', userName: '太空漫游者', userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop', content: '大家预算都多少呀？我出180抢隐藏', type: 'text', timestamp: addMinutes(now, -22) },
    { id: 'm6', boxId: 'box-001', userId: 'user-002', userName: 'DIMOO控', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', content: '我150，佛系随缘~', type: 'text', timestamp: addMinutes(now, -20) },
    { id: 'm7', boxId: 'box-001', userId: 'user-001', userName: '潮玩小王子', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', content: '我200！势在必得哈哈哈', type: 'text', timestamp: addMinutes(now, -18) },
    { id: 'm8', boxId: 'box-001', userId: 'system', userName: '系统', userAvatar: '', content: '太空漫游者 加入了拼盒', type: 'system', timestamp: addMinutes(now, -20) },
    { id: 'm9', boxId: 'box-001', userId: 'system', userName: '系统', userAvatar: '', content: '追星达人 加入了拼盒', type: 'system', timestamp: addMinutes(now, -5) },
    { id: 'm10', boxId: 'box-001', userId: 'user-004', userName: '追星达人', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', content: '还差几位呀？', type: 'text', timestamp: addMinutes(now, -3) },
  ],
  'box-002': [
    { id: 'm1', boxId: 'box-002', userId: 'system', userName: '系统', userAvatar: '', content: 'MOLLY收藏家 发起了拼盒', type: 'system', timestamp: addMinutes(now, -60) },
    { id: 'm2', boxId: 'box-002', userId: 'user-006', userName: '童年回忆', userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', content: '均分模式好，大家公平', type: 'text', timestamp: addMinutes(now, -50) },
    { id: 'm3', boxId: 'box-002', userId: 'user-005', userName: 'MOLLY收藏家', userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', content: '对呀，拼的就是运气', type: 'text', timestamp: addMinutes(now, -48) },
    { id: 'm4', boxId: 'box-002', userId: 'user-007', userName: '小确幸', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', content: '半小时内就能凑齐吧', type: 'text', timestamp: addMinutes(now, -40) },
  ],
};

export const boxResults: Record<string, BoxResult> = {
  'box-004': {
    boxId: 'box-004',
    styles: seriesList[3].styles.map((s, i) => ({
      styleId: s.id,
      styleName: s.name,
      styleImage: s.image,
      isHidden: s.isHidden,
      rarity: s.rarity,
      slotNumber: i % 6 + 1,
    })),
    assignments: [
      { userId: 'user-018', nickname: '密林探险家', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', slotNumber: 1, styles: [
        { styleId: 's4-12', styleName: '血色玫瑰', styleImage: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=150&h=150&fit=crop', isHidden: true, rarity: 'hidden', slotNumber: 1 },
      ]},
      { userId: 'user-022', nickname: '玫瑰猎人', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', slotNumber: 5, styles: [
        { styleId: 's4-3', styleName: '吸血鬼', styleImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=150&h=150&fit=crop', isHidden: false, rarity: 'rare', slotNumber: 5 },
      ]},
    ],
    revealedAt: addHours(now, -1),
  },
};

export const historyRecords: HistoryRecord[] = [
  {
    id: 'h1',
    boxId: 'box-004',
    seriesName: 'SKULLPANDA 密林古堡系列',
    seriesCover: seriesList[3].cover,
    date: addDays(now, -2),
    mall: '海岸城',
    gotStyles: [
      { name: '探险家', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&h=150&fit=crop', isHidden: false, rarity: 'common' },
    ],
    totalSpent: 116,
    hasHidden: false,
    ruleType: 'hidden-first',
  },
  {
    id: 'h2',
    boxId: 'box-007',
    seriesName: 'DIMOO 太空旅行系列',
    seriesCover: seriesList[0].cover,
    date: addDays(now, -5),
    mall: '静安大悦城',
    gotStyles: [
      { name: '太空旅客DIMOO', image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=150&h=150&fit=crop', isHidden: true, rarity: 'hidden' },
    ],
    totalSpent: 200,
    hasHidden: true,
    ruleType: 'hidden-first',
  },
  {
    id: 'h3',
    boxId: 'box-008',
    seriesName: 'MOLLY 我的小时候系列',
    seriesCover: seriesList[1].cover,
    date: addDays(now, -10),
    mall: '上海来福士广场',
    gotStyles: [
      { name: '上学去', image: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=150&h=150&fit=crop', isHidden: false, rarity: 'common' },
      { name: '吹泡泡', image: 'https://images.unsplash.com/photo-1578632292335-df36bb36e01f?w=150&h=150&fit=crop', isHidden: false, rarity: 'common' },
    ],
    totalSpent: 126,
    hasHidden: false,
    ruleType: 'average',
  },
  {
    id: 'h4',
    boxId: 'box-009',
    seriesName: 'LABUBU 精灵天团系列',
    seriesCover: seriesList[2].cover,
    date: addDays(now, -15),
    mall: '朝阳大悦城',
    gotStyles: [
      { name: '调皮精灵', image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=150&h=150&fit=crop', isHidden: false, rarity: 'common' },
      { name: '音乐精灵', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop', isHidden: false, rarity: 'rare' },
    ],
    totalSpent: 138,
    hasHidden: false,
    ruleType: 'rotation',
  },
  {
    id: 'h5',
    boxId: 'box-010',
    seriesName: 'PUCKY 精灵们在做什么系列',
    seriesCover: seriesList[4].cover,
    date: addDays(now, -20),
    mall: '湖滨in77',
    gotStyles: [
      { name: '星光独角兽', image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=150&h=150&fit=crop', isHidden: true, rarity: 'hidden' },
    ],
    totalSpent: 300,
    hasHidden: true,
    ruleType: 'hidden-first',
  },
];

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const getBoxById = (id: string): Box | undefined => {
  return boxes.find(b => b.id === id);
};

export const getMessagesByBoxId = (boxId: string): ChatMessage[] => {
  return chatMessages[boxId] || [];
};

export const getResultByBoxId = (boxId: string): BoxResult | undefined => {
  return boxResults[boxId];
};
