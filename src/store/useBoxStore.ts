import { create } from 'zustand';
import type { Box, BoxMember, ChatMessage, HistoryRecord, CreateBoxForm, DeliveryType } from '@/types';
import { boxes as initialBoxes, chatMessages, historyRecords, getMessagesByBoxId, getBoxById, getResultByBoxId, boxResults } from '@/data/boxes';
import { seriesList } from '@/data/series';

interface BoxState {
  boxes: Box[];
  currentBox: Box | null;
  messagesByBox: Record<string, ChatMessage[]>;
  historyRecords: HistoryRecord[];
  currentUserId: string;
  currentCity: string;
  createForm: Partial<CreateBoxForm>;
  deliveryByBox: Record<string, DeliveryType>;

  setCurrentCity: (city: string) => void;
  setCreateForm: (form: Partial<CreateBoxForm>) => void;
  resetCreateForm: () => void;
  getBoxById: (id: string) => Box | undefined;
  setCurrentBox: (box: Box | null) => void;
  joinBox: (boxId: string, userId: string) => boolean;
  leaveBox: (boxId: string, userId: string) => boolean;
  sendMessage: (boxId: string, userId: string, userName: string, userAvatar: string, content: string) => void;
  loadMessages: (boxId: string) => ChatMessage[];
  getFilteredBoxes: (city?: string) => Box[];
  createBox: (form: CreateBoxForm) => Box;
  getHistoryRecords: () => HistoryRecord[];
  getStats: () => { total: number; hiddenCount: number; winRate: number; totalSpent: number };
  setDeliveryType: (boxId: string, type: DeliveryType) => void;
  getDeliveryType: (boxId: string) => DeliveryType;
}

export const useBoxStore = create<BoxState>((set, get) => ({
  boxes: initialBoxes,
  currentBox: null,
  messagesByBox: {},
  historyRecords: historyRecords,
  currentUserId: 'user-current',
  currentCity: '上海',
  deliveryByBox: {},
  createForm: {
    city: '上海',
    district: '',
    mall: '',
    storeName: '',
    seriesId: '',
    meetTime: null,
    ruleType: 'hidden-first',
    totalSlots: 6,
    pricePerSlot: 0,
  },

  setCurrentCity: (city) => set({ currentCity: city }),

  setCreateForm: (form) => set((state) => ({
    createForm: { ...state.createForm, ...form },
  })),

  resetCreateForm: () => set({
    createForm: {
      city: '上海',
      district: '',
      mall: '',
      storeName: '',
      seriesId: '',
      meetTime: null,
      ruleType: 'hidden-first',
      totalSlots: 6,
      pricePerSlot: 0,
    },
  }),

  getBoxById: (id) => get().boxes.find(b => b.id === id),

  setCurrentBox: (box) => set({ currentBox: box }),

  joinBox: (boxId, userId) => {
    const state = get();
    const box = state.boxes.find(b => b.id === boxId);
    if (!box || box.joinedSlots >= box.totalSlots) return false;

    const newMember: BoxMember = {
      userId,
      nickname: '我是玩家',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      slotNumber: box.joinedSlots + 1,
      budget: box.pricePerSlot,
      isCreator: false,
      status: 'paid',
      joinedAt: new Date(),
    };

    const updatedBoxes = state.boxes.map(b => {
      if (b.id === boxId) {
        return {
          ...b,
          members: [...b.members, newMember],
          joinedSlots: b.joinedSlots + 1,
          status: b.joinedSlots + 1 >= b.totalSlots ? 'full' : b.status,
        };
      }
      return b;
    });

    set({ boxes: updatedBoxes });
    
    const systemMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      boxId,
      userId: 'system',
      userName: '系统',
      userAvatar: '',
      content: '我是玩家 加入了拼盒',
      type: 'system',
      timestamp: new Date(),
    };
    
    set((s) => ({
      messagesByBox: {
        ...s.messagesByBox,
        [boxId]: [...(s.messagesByBox[boxId] || getMessagesByBoxId(boxId)), systemMsg],
      },
    }));

    return true;
  },

  leaveBox: (boxId: string, userId: string) => {
    const state = get();
    const box = state.boxes.find(b => b.id === boxId);
    if (!box) return false;

    const updatedBoxes = state.boxes.map(b => {
      if (b.id === boxId) {
        const newMembers = b.members.filter(m => m.userId !== userId);
        return {
          ...b,
          members: newMembers,
          joinedSlots: newMembers.length,
          status: 'recruiting' as const,
        };
      }
      return b;
    });

    set({ boxes: updatedBoxes });
    return true;
  },

  sendMessage: (boxId, userId, userName, userAvatar, content) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      boxId,
      userId,
      userName,
      userAvatar,
      content,
      type: 'text',
      timestamp: new Date(),
    };

    set((s) => ({
      messagesByBox: {
        ...s.messagesByBox,
        [boxId]: [...(s.messagesByBox[boxId] || getMessagesByBoxId(boxId)), newMsg],
      },
    }));
  },

  loadMessages: (boxId) => {
    const state = get();
    if (!state.messagesByBox[boxId]) {
      const msgs = getMessagesByBoxId(boxId);
      set((s) => ({
        messagesByBox: { ...s.messagesByBox, [boxId]: msgs },
      }));
      return msgs;
    }
    return state.messagesByBox[boxId];
  },

  getFilteredBoxes: (city) => {
    const state = get();
    const targetCity = city || state.currentCity;
    return state.boxes.filter(b => b.city === targetCity && b.status !== 'completed' && b.status !== 'cancelled');
  },

  createBox: (form) => {
    const series = seriesList.find(s => s.id === form.seriesId);
    const newBox: Box = {
      id: `box-${Date.now()}`,
      seriesId: form.seriesId,
      seriesName: series?.name || '',
      seriesCover: series?.cover || '',
      seriesBrand: series?.brand || '',
      city: form.city,
      district: form.district,
      mall: form.mall,
      storeName: form.storeName,
      meetTime: form.meetTime || new Date(),
      totalSlots: form.totalSlots,
      joinedSlots: 1,
      status: 'recruiting',
      ruleType: form.ruleType,
      ruleDescription: form.ruleType === 'hidden-first' 
        ? '隐藏款出价最高者获得，普通款按出价顺序轮流选择'
        : form.ruleType === 'average'
        ? '隐藏款随机抽取，普通款平均分配，差额多退少补'
        : '按加入顺序轮流选择，第一轮正向第二轮反向，蛇形选秀',
      creatorId: 'user-current',
      creatorName: '我是玩家',
      creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      pricePerSlot: form.pricePerSlot,
      totalPrice: series?.price || 0,
      createdAt: new Date(),
      expireAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      members: [
        {
          userId: 'user-current',
          nickname: '我是玩家',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          slotNumber: 1,
          budget: form.pricePerSlot,
          isCreator: true,
          status: 'paid',
          joinedAt: new Date(),
        },
      ],
    };

    set((state) => ({
      boxes: [newBox, ...state.boxes],
    }));

    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}-sys`,
      boxId: newBox.id,
      userId: 'system',
      userName: '系统',
      userAvatar: '',
      content: '拼盒发布成功！等待小伙伴加入~',
      type: 'system',
      timestamp: new Date(),
    };

    set((s) => ({
      messagesByBox: {
        ...s.messagesByBox,
        [newBox.id]: [welcomeMsg],
      },
    }));

    return newBox;
  },

  getHistoryRecords: () => get().historyRecords,

  getStats: () => {
    const records = get().historyRecords;
    const total = records.length;
    const hiddenCount = records.filter(r => r.hasHidden).length;
    const winRate = total > 0 ? Math.round((hiddenCount / total) * 100) : 0;
    const totalSpent = records.reduce((sum, r) => sum + r.totalSpent, 0);
    return { total, hiddenCount, winRate, totalSpent };
  },

  setDeliveryType: (boxId, type) => {
    set((state) => ({
      deliveryByBox: {
        ...state.deliveryByBox,
        [boxId]: type,
      },
    }));
  },

  getDeliveryType: (boxId) => {
    return get().deliveryByBox[boxId] || 'self';
  },
}));
