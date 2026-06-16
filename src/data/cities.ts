import type { CityOption } from '@/types';

export const cities: CityOption[] = [
  {
    name: '上海',
    districts: [
      {
        name: '静安区',
        malls: [
          { name: '静安大悦城', stores: ['POP MART 旗舰店', '泡泡玛特机器人商店'] },
          { name: '久光百货', stores: ['POP MART 专柜'] },
          { name: '晶品购物中心', stores: ['TOP TOY'] },
        ],
      },
      {
        name: '黄浦区',
        malls: [
          { name: '上海来福士广场', stores: ['POP MART', '52TOYS'] },
          { name: '世茂广场', stores: ['POP MART 概念店'] },
          { name: '新天地', stores: ['泡泡玛特潮玩店'] },
        ],
      },
      {
        name: '浦东新区',
        malls: [
          { name: '陆家嘴正大广场', stores: ['POP MART', 'TOP TOY'] },
          { name: '世纪百联', stores: ['52TOYS'] },
          { name: '前滩太古里', stores: ['POP MART 高端店'] },
        ],
      },
      {
        name: '徐汇区',
        malls: [
          { name: '美罗城', stores: ['POP MART', '名创优品潮玩区'] },
          { name: '日月光中心', stores: ['X11 潮玩集合店'] },
          { name: '港汇恒隆', stores: ['POP MART 精品店'] },
        ],
      },
    ],
  },
  {
    name: '北京',
    districts: [
      {
        name: '朝阳区',
        malls: [
          { name: '朝阳大悦城', stores: ['POP MART 旗舰店', 'X11'] },
          { name: '三里屯太古里', stores: ['POP MART 潮玩店', '52TOYS'] },
          { name: '合生汇', stores: ['TOP TOY'] },
        ],
      },
      {
        name: '海淀区',
        malls: [
          { name: '中关村大悦城', stores: ['POP MART'] },
          { name: '五道口华联', stores: ['泡泡玛特机器人商店'] },
        ],
      },
      {
        name: '东城区',
        malls: [
          { name: '北京apm', stores: ['POP MART', 'TOP TOY'] },
          { name: '东方新天地', stores: ['52TOYS 概念店'] },
        ],
      },
    ],
  },
  {
    name: '广州',
    districts: [
      {
        name: '天河区',
        malls: [
          { name: '天河城', stores: ['POP MART', 'TOP TOY'] },
          { name: '正佳广场', stores: ['X11 潮玩集合店', '52TOYS'] },
          { name: '太古汇', stores: ['POP MART 高端店'] },
        ],
      },
      {
        name: '越秀区',
        malls: [
          { name: '中华广场', stores: ['POP MART'] },
          { name: '北京路天河城', stores: ['泡泡玛特机器人商店'] },
        ],
      },
    ],
  },
  {
    name: '深圳',
    districts: [
      {
        name: '南山区',
        malls: [
          { name: '海岸城', stores: ['POP MART', 'X11'] },
          { name: '万象天地', stores: ['POP MART 概念店', '52TOYS'] },
          { name: '益田假日广场', stores: ['TOP TOY'] },
        ],
      },
      {
        name: '福田区',
        malls: [
          { name: '福田COCO Park', stores: ['POP MART'] },
          { name: '卓悦中心', stores: ['POP MART 旗舰店'] },
        ],
      },
      {
        name: '罗湖区',
        malls: [
          { name: '万象城', stores: ['POP MART 精品店'] },
          { name: '东门老街', stores: ['泡泡玛特潮玩店'] },
        ],
      },
    ],
  },
  {
    name: '杭州',
    districts: [
      {
        name: '西湖区',
        malls: [
          { name: '西湖银泰', stores: ['POP MART'] },
          { name: '西溪印象城', stores: ['TOP TOY'] },
        ],
      },
      {
        name: '上城区',
        malls: [
          { name: '湖滨in77', stores: ['POP MART 旗舰店', 'X11'] },
          { name: '杭州大厦', stores: ['52TOYS 概念店'] },
        ],
      },
    ],
  },
];

export const getCities = (): string[] => cities.map(c => c.name);

export const getDistricts = (cityName: string): string[] => {
  const city = cities.find(c => c.name === cityName);
  return city ? city.districts.map(d => d.name) : [];
};

export const getMalls = (cityName: string, districtName: string): string[] => {
  const city = cities.find(c => c.name === cityName);
  const district = city?.districts.find(d => d.name === districtName);
  return district ? district.malls.map(m => m.name) : [];
};

export const getStores = (cityName: string, districtName: string, mallName: string): string[] => {
  const city = cities.find(c => c.name === cityName);
  const district = city?.districts.find(d => d.name === districtName);
  const mall = district?.malls.find(m => m.name === mallName);
  return mall ? mall.stores : [];
};
