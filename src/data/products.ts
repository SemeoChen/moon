export type ProductCategoryId = 'mango' | 'cake' | 'cookie';

export type ProductStatus = 'available' | 'sold_out' | 'coming_soon';

export interface ShippingTier {
  minAmount: number;
  minBoxes: number;
  fee: number;
  label: string;
}

export interface ProductImage {
  src: string;
  title: string;
  desc: string;
}

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  categoryId: ProductCategoryId;
  categoryName: string;
  status: ProductStatus;
  statusBadgeText: string;
  originalPrice?: number;
  price?: number;
  unit: string;
  tempZone: '冷凍';
  defaultFeatured?: boolean;
  headline: string;
  description: string[];
  features: { title: string; desc: string }[];
  secretTip?: {
    title: string;
    content: string;
  };
  shippingNote?: string;
  shippingTiers?: ShippingTier[];
  images: ProductImage[];
}

export interface ProductCategory {
  id: ProductCategoryId;
  name: string;
  badge?: string;
  description: string;
  isUnderConstruction?: boolean;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'mango',
    name: '芒果類',
    badge: '人氣主打',
    description: '嚴選台南官田陽光熟成芒果，結合頂級食材手工精製的招牌芒果系列。',
    isUnderConstruction: false,
  },
  {
    id: 'cake',
    name: '蛋糕類',
    badge: '建置中',
    description: '甜點師細緻手藝打造：裱花蛋糕、翻糖蛋糕、戚風蛋糕、巴斯克乳酪蛋糕。',
    isUnderConstruction: true,
  },
  {
    id: 'cookie',
    name: '餅乾類',
    badge: '建置中',
    description: '嚴選法國發酵奶油與天然食材手工烘焙，酥脆香濃的手作餅乾系列。',
    isUnderConstruction: true,
  },
];

export const MANGO_CHOKER_SHIPPING_TIERS: ShippingTier[] = [
  { minAmount: 0, minBoxes: 1, fee: 120, label: '未滿千元（1~3盒）：運費 $120' },
  { minAmount: 1000, minBoxes: 4, fee: 100, label: '滿 $1,000（4盒）：運費 $100' },
  { minAmount: 2000, minBoxes: 8, fee: 80, label: '滿 $2,000（8盒）：運費 $80' },
  { minAmount: 3000, minBoxes: 12, fee: 0, label: '滿 $3,000（12盒）：免運費' },
];

export const PRODUCTS: ProductItem[] = [
  // ==================== 芒果類 ====================
  {
    id: 'mango-choker',
    name: '芒果恰克',
    subtitle: 'MANGO CHOCOLATE ‧ 絲滑黑巧 X 陽光熟成芒果乾',
    categoryId: 'mango',
    categoryName: '芒果類',
    status: 'available',
    statusBadgeText: '熱銷預訂中',
    originalPrice: 280,
    price: 250,
    unit: '盒',
    tempZone: '冷凍',
    defaultFeatured: true,
    headline: '當濃厚絲滑的黑巧克力，遇上陽光熟成、酸甜Q彈的芒果乾，這就是讓人一吃就上癮的「芒果恰克」',
    description: [
      '每一顆小巧的巧克力磚，都能看到芒果果乾鑲嵌其中。',
      '入口先是巧克力的醇厚微苦，隨著溫度融化，芒果獨特的濃郁果香在嘴裡散開，多層次的咬感，完美平衡了甜膩，只留下滿滿的幸福感。',
    ],
    features: [
      {
        title: '看得到的真材實料',
        desc: '每一口都咬得到Q彈果肉，果香超濃郁！',
      },
      {
        title: '甜而不膩的黃金比例',
        desc: '巧克力的醇香完美中和了果乾的酸甜，一口接一口完全停不下來。',
      },
      {
        title: '一口大小剛剛好',
        desc: '獨立小方磚造型，優雅入口不沾手，追劇、上班偷吃超方便！',
      },
    ],
    secretTip: {
      title: '❄️ 私房美味吃法',
      content:
        '收到後請直接放冷凍庫！剛拿出來微冰的時候吃，外層巧克力脆口、內餡果乾帶有嚼勁，冰涼濃郁的口感真的超讚！',
    },
    shippingNote:
      '一律以 7-11 冷凍交貨便寄出，不用在家苦等宅配，下班順路去小七就能把美味帶回家！',
    shippingTiers: MANGO_CHOKER_SHIPPING_TIERS,
    images: [
      {
        src: '/images/choker/DSC03515.JPG',
        title: '芒果恰克 MANGO CHOCOLATE',
        desc: '濃厚絲滑的黑巧克力遇上陽光熟成、酸甜Q彈的芒果乾，一口大小獨立方磚造型。',
      },
      {
        src: '/images/choker/DSC03542.JPG',
        title: '看得到的真材實料 ‧ 鑲嵌Q彈芒果果乾',
        desc: '每一顆小巧的巧克力磚都能看到滿滿芒果果乾鑲嵌其中，醇厚微苦與濃郁果香完美交織。',
      },
      {
        src: '/images/choker/DSC03498.JPG',
        title: '質感盒裝設計 ‧ 揪團自享送禮皆宜',
        desc: '原價 $280/盒，限時特惠只要 $250/盒！滿 $3,000（12盒）再享 7-11 冷凍交貨便免運費。',
      },
      {
        src: '/images/DSC03335.JPG',
        title: '私房美味吃法 ‧ 冷凍微冰脆口嚼勁',
        desc: '收到後直接放冷凍庫，微冰時外層巧克力脆口、內餡果乾帶有嚼勁！',
      },
    ],
  },
  {
    id: 'dried-mango',
    name: '歐伯手工芒果乾',
    subtitle: '陽光熟成 ‧ 厚切低糖烘烤果乾',
    categoryId: 'mango',
    categoryName: '芒果類',
    status: 'sold_out',
    statusBadgeText: '本年度已銷售完畢',
    originalPrice: 300,
    price: 250,
    unit: '包',
    tempZone: '冷凍',
    defaultFeatured: false,
    headline: '嚴選台南官田在欉紅愛文芒果，低溫慢火烘焙鎖住濃郁果香與Q彈果肉。',
    description: [
      '每一片芒果乾皆由新鮮熟成芒果厚切烘製，不添加人工色素與防腐劑，保留最天然的酸甜果香。',
      '感謝大家熱烈支持，本年度歐伯手工芒果乾已全數銷售完畢！想要品嚐官田芒果乾與黑巧克力交織的美味，推薦立即預訂目前主打的「芒果恰克」！',
    ],
    features: [
      { title: '官田在欉紅鮮果', desc: '嚴選自然熟成芒果，果肉厚實香氣濃郁。' },
      { title: '低溫慢火烘焙', desc: '保留果肉纖維與Q彈咬感，減糖無負擔。' },
      { title: '本年度已完售', desc: '感謝支持，本年度已銷售完畢，敬請期待下一產季！' },
    ],
    images: [
      {
        src: '/images/choker/DSC03542.JPG',
        title: '歐伯手工芒果乾（本年度已銷售完畢）',
        desc: '本年度已銷售完畢！推薦選購內含Q彈芒果果乾的人氣主打「芒果恰克」。',
      },
    ],
  },
  {
    id: 'fresh-mango',
    name: '歐伯新鮮芒果禮盒',
    subtitle: '產地直送 ‧ 台南官田陽光熟成鮮果',
    categoryId: 'mango',
    categoryName: '芒果類',
    status: 'sold_out',
    statusBadgeText: '本年度已銷售完畢',
    originalPrice: 880,
    price: 750,
    unit: '箱',
    tempZone: '冷凍',
    defaultFeatured: false,
    headline: '來自台南官田果園產地直送，皮薄肉細、甜度飽滿的夏日紅寶石。',
    description: [
      '歐伯用心栽種的台南官田新鮮芒果，每年盛夏限量採收直送，果香濃郁、汁多味美。',
      '本年度新鮮芒果產季已結束並全數銷售完畢！現在想回味陽光熟成的芒果香氣，千萬別錯過限時優惠中的「芒果恰克」！',
    ],
    features: [
      { title: '產地鮮採直送', desc: '每日清晨果園現採，人工嚴選分級包裝。' },
      { title: '濃郁果香飽滿多汁', desc: '自然在欉紅熟成，果肉細緻無粗纖維。' },
      { title: '本年度已完售', desc: '本年度已銷售完畢，感謝饕客們年年回購支持！' },
    ],
    images: [
      {
        src: '/images/choker/DSC03498.JPG',
        title: '歐伯新鮮芒果（本年度已銷售完畢）',
        desc: '本年度已銷售完畢！推薦選購以官田芒果乾精製而成的「芒果恰克」。',
      },
    ],
  },

  // ==================== 蛋糕類 (建置中) ====================
  {
    id: 'cake-floral',
    name: '韓式裱花蛋糕',
    subtitle: '蛋糕類（建置中）‧ 客製化精緻手工擠花',
    categoryId: 'cake',
    categoryName: '蛋糕類',
    status: 'coming_soon',
    statusBadgeText: '建置中',
    unit: '模',
    tempZone: '冷凍',
    headline: '以細膩手工擠花工藝，打造宛如盛開鮮花般的夢幻慶生與紀念日蛋糕。',
    description: [
      '妮邦廚房嚴選天然乳品與純粹食材，由甜點師一瓣一葉手工裱出細緻花朵，兼具視覺美感與溫潤清爽口感。',
      '目前「蛋糕類 - 裱花蛋糕」專屬線上訂購頁面正加緊建置中，敬請期待！',
    ],
    features: [
      { title: '純手工立體裱花', desc: '每一朵花皆為甜點師親手擠製，獨一無二。' },
      { title: '減糖清爽配方', desc: '好吃不膩口，長輩與小孩都能開心享用。' },
      { title: '專頁建置中', desc: '商品頁面建置中，如需客製化洽詢歡迎聯繫客服。' },
    ],
    images: [
      {
        src: '/images/DSC03291.JPG',
        title: '韓式裱花蛋糕（建置中）',
        desc: '妮邦廚房精緻手作蛋糕系列，頁面建置中。',
      },
    ],
  },
  {
    id: 'cake-fondant',
    name: '客製翻糖蛋糕',
    subtitle: '蛋糕類（建置中）‧ 主題派對與周歲慶典首選',
    categoryId: 'cake',
    categoryName: '蛋糕類',
    status: 'coming_soon',
    statusBadgeText: '建置中',
    unit: '模',
    tempZone: '冷凍',
    headline: '結合創意立體造型與細膩手藝，為特別的日子留下最難忘的焦點回憶。',
    description: [
      '針對抓周、生日派對、慶典活動量身打造的翻糖造型蛋糕，內餡選用真材實料的手作蛋糕體。',
      '目前「蛋糕類 - 翻糖蛋糕」專屬線上訂購頁面正加緊建置中，敬請期待！',
    ],
    features: [
      { title: '專屬主題造型', desc: '精緻手作翻糖工藝，完美呈現派對主題。' },
      { title: '嚴選安心食材', desc: '內外兼備的用心製作，兼顧造型與美味。' },
      { title: '專頁建置中', desc: '商品頁面建置中，敬請期待正式上線。' },
    ],
    images: [
      {
        src: '/images/DSC03344.JPG',
        title: '客製翻糖蛋糕（建置中）',
        desc: '妮邦廚房精緻手作蛋糕系列，頁面建置中。',
      },
    ],
  },
  {
    id: 'cake-chiffon',
    name: '手作戚風蛋糕',
    subtitle: '蛋糕類（建置中）‧ 雲朵般輕盈蓬鬆口感',
    categoryId: 'cake',
    categoryName: '蛋糕類',
    status: 'coming_soon',
    statusBadgeText: '建置中',
    unit: '模',
    tempZone: '冷凍',
    headline: '單純的新鮮雞蛋、鮮奶與日本麵粉，烤出濕潤Q彈、入口即化的溫柔滋味。',
    description: [
      '不添加泡打粉與人工香精，憑藉精準溫控與打發手法，展現戚風蛋糕最純粹的蛋香與空氣感。',
      '目前「蛋糕類 - 戚風蛋糕」專屬線上訂購頁面正加緊建置中，敬請期待！',
    ],
    features: [
      { title: '輕盈蓬鬆不乾口', desc: '保水度極佳的戚風蛋糕體，柔軟綿密。' },
      { title: '純粹天然蛋香', desc: '嚴選優質鮮蛋與頂級鮮奶油製作。' },
      { title: '專頁建置中', desc: '商品頁面建置中，敬請期待正式上線。' },
    ],
    images: [
      {
        src: '/images/DSC03350.JPG',
        title: '手作戚風蛋糕（建置中）',
        desc: '妮邦廚房精緻手作蛋糕系列，頁面建置中。',
      },
    ],
  },
  {
    id: 'cake-basque',
    name: '巴斯克乳酪蛋糕',
    subtitle: '蛋糕類（建置中）‧ 焦香外皮與濃郁半熟流心',
    categoryId: 'cake',
    categoryName: '蛋糕類',
    status: 'coming_soon',
    statusBadgeText: '建置中',
    unit: '模',
    tempZone: '冷凍',
    headline: '高溫烘烤出迷人焦糖色表層，切開是綿密滑順、乳香濃郁的極致享受。',
    description: [
      '嚴選頂級奶油乳酪與鮮奶油，冷凍後微退冰享用宛如濃郁冰淇淋，冷藏享用則滑順入口即化。',
      '目前「蛋糕類 - 巴斯克乳酪蛋糕」專屬線上訂購頁面正加緊建置中，敬請期待！',
    ],
    features: [
      { title: '濃醇乳酪香氣', desc: '重本使用頂級奶油乳酪，每一口都濃郁滿足。' },
      { title: '微焦 карамель 風味', desc: '表層獨特微焦香氣與綿密內餡完美平衡。' },
      { title: '專頁建置中', desc: '商品頁面建置中，敬請期待正式上線。' },
    ],
    images: [
      {
        src: '/images/DSC03291.JPG',
        title: '巴斯克乳酪蛋糕（建置中）',
        desc: '妮邦廚房精緻手作蛋糕系列，頁面建置中。',
      },
    ],
  },

  // ==================== 餅乾類 (建置中) ====================
  {
    id: 'cookie-handmade',
    name: '手工烘焙餅乾系列',
    subtitle: '餅乾類（建置中）‧ 法式杏仁瓦片 / 蜂蜜燕麥餅乾',
    categoryId: 'cookie',
    categoryName: '餅乾類',
    status: 'coming_soon',
    statusBadgeText: '建置中',
    unit: '盒',
    tempZone: '冷凍',
    headline: '嚴選法國發酵奶油、新鮮雞蛋與飽滿堅果，手工細烤出金黃酥脆的幸福香氣。',
    description: [
      '包含薄脆金黃、鋪滿杏仁片的「法式杏仁瓦片」，以及揉合純天然蜂蜜、燕麥與蔓越莓的「蜂蜜燕麥餅乾」等多款人氣手作餅乾。',
      '目前「餅乾類」單品與禮盒線上訂購頁面正加緊建置中，敬請期待！',
    ],
    features: [
      { title: '法式杏仁瓦片', desc: '法國發酵奶油烘焙，薄脆金黃、堅果香氣濃郁。' },
      { title: '蜂蜜燕麥餅乾', desc: '天然蜂蜜與蔓越莓果乾，口感扎實層次豐富。' },
      { title: '專頁建置中', desc: '餅乾類訂購頁面建置中，目前推薦選購主打商品「芒果恰克」！' },
    ],
    images: [
      {
        src: '/images/DSC03329.JPG',
        title: '法式杏仁瓦片（建置中）',
        desc: '法國發酵奶油與台灣麵粉烘焙，鋪滿滿滿杏仁片，金黃薄脆。',
      },
      {
        src: '/images/DSC03330.JPG',
        title: '蜂蜜燕麥餅乾（建置中）',
        desc: '純天然蜂蜜、燕麥與蔓越莓果乾，口感扎實散發天然香氣。',
      },
    ],
  },
];

// 預設目前主打商品 ID（管理者可於常數或介面切換）
export const DEFAULT_FEATURED_PRODUCT_ID = 'mango-choker';

// 根據訂購金額/盒數計算運費
export function calculateShippingFee(orderAmount: number, quantity: number): {
  shippingFee: number;
  currentTierLabel: string;
  nextTierInfo: { neededBoxes: number; neededAmount: number; nextFee: number } | null;
} {
  if (orderAmount >= 3000 || quantity >= 12) {
    return {
      shippingFee: 0,
      currentTierLabel: '滿 $3,000（12盒以上）：免運費 ($0)',
      nextTierInfo: null,
    };
  }
  if (orderAmount >= 2000 || quantity >= 8) {
    return {
      shippingFee: 80,
      currentTierLabel: '滿 $2,000（8~11盒）：運費優惠 $80',
      nextTierInfo: {
        neededBoxes: Math.max(1, 12 - quantity),
        neededAmount: Math.max(0, 3000 - orderAmount),
        nextFee: 0,
      },
    };
  }
  if (orderAmount >= 1000 || quantity >= 4) {
    return {
      shippingFee: 100,
      currentTierLabel: '滿 $1,000（4~7盒）：運費優惠 $100',
      nextTierInfo: {
        neededBoxes: Math.max(1, 8 - quantity),
        neededAmount: Math.max(0, 2000 - orderAmount),
        nextFee: 80,
      },
    };
  }
  return {
    shippingFee: 120,
    currentTierLabel: '未滿千元（1~3盒）：運費 $120',
    nextTierInfo: {
      neededBoxes: Math.max(1, 4 - quantity),
      neededAmount: Math.max(0, 1000 - orderAmount),
      nextFee: 100,
    },
  };
}
