




const SEED_RARITY = {
    HUANG: 'huang',  
    XUAN: 'xuan',    
    DI: 'di',        
    TIAN: 'tian'     
};


const SEEDS_DATA = {
    huang: {
        id: 'huang',
        name: '黃階種子',
        rarity: SEED_RARITY.HUANG,
        growTime: 30 * 60,        
        minHerbs: 1,
        maxHerbs: 5,
        herbPool: [
            '青靈芝', '白雲草', '聚氣花',
            '凝露草', '月華芝'
        ],
        description: '最普通的靈植種子'
    },
    
    xuan: {
        id: 'xuan',
        name: '玄階種子',
        rarity: SEED_RARITY.XUAN,
        growTime: 60 * 60,        
        minHerbs: 2,
        maxHerbs: 5,
        herbPool: [
            '紫雲花', '金剛根', '碧月草',
            '赤火果', '玄冰蓮'
        ],
        description: '較為罕見的靈植種子'
    },
    
    di: {
        id: 'di',
        name: '地階種子',
        rarity: SEED_RARITY.DI,
        growTime: 120 * 60,       
        minHerbs: 3,
        maxHerbs: 5,
        herbPool: [
            '九葉蓮', '血菩提', '龍涎草',
            '鳳凰羽', '靈犀角'
        ],
        description: '珍稀的靈植種子'
    },
    
    tian: {
        id: 'tian',
        name: '天階種子',
        rarity: SEED_RARITY.TIAN,
        growTime: 180 * 60,       
        minHerbs: 4,
        maxHerbs: 5,
        herbPool: [
            '天靈果', '麒麟花', '鳳凰草',
            '龍血樹', '仙人掌'
        ],
        description: '極為罕見的靈植種子'
    }
};


const HERBS_DATA = {
    
    
    
    "青靈芝": {
        id: "qing_ling_zhi",
        name: "青靈芝",
        rarity: SEED_RARITY.HUANG,
        element: "wood",
        realmLevel: 0,
        sellPrice: 10,
        description: "常見的木屬性靈草"
    },
    
    "白雲草": {
        id: "bai_yun_cao",
        name: "白雲草",
        rarity: SEED_RARITY.HUANG,
        element: "metal",
        realmLevel: 0,
        sellPrice: 10,
        description: "常見的金屬性靈草"
    },
    
    "聚氣花": {
        id: "ju_qi_hua",
        name: "聚氣花",
        rarity: SEED_RARITY.HUANG,
        element: "earth",
        realmLevel: 0,
        sellPrice: 12,
        description: "能聚集靈氣的花朵"
    },
    
    "凝露草": {
        id: "ning_lu_cao",
        name: "凝露草",
        rarity: SEED_RARITY.HUANG,
        element: "water",
        realmLevel: 0,
        sellPrice: 10,
        description: "常見的水屬性靈草"
    },
    
    "月華芝": {
        id: "yue_hua_zhi",
        name: "月華芝",
        rarity: SEED_RARITY.HUANG,
        element: "metal",
        realmLevel: 0,
        sellPrice: 15,
        description: "吸收月華的靈芝"
    },
    
    
    
    
    "紫雲花": {
        id: "zi_yun_hua",
        name: "紫雲花",
        rarity: SEED_RARITY.XUAN,
        element: "fire",
        realmLevel: 1,
        sellPrice: 50,
        description: "紫色的靈花，火屬性"
    },
    
    "金剛根": {
        id: "jin_gang_gen",
        name: "金剛根",
        rarity: SEED_RARITY.XUAN,
        element: "metal",
        realmLevel: 1,
        sellPrice: 55,
        description: "堅硬如金剛的根莖"
    },
    
    "碧月草": {
        id: "bi_yue_cao",
        name: "碧月草",
        rarity: SEED_RARITY.XUAN,
        element: "wood",
        realmLevel: 1,
        sellPrice: 50,
        description: "碧綠如月光的靈草"
    },
    
    "赤火果": {
        id: "chi_huo_guo",
        name: "赤火果",
        rarity: SEED_RARITY.XUAN,
        element: "fire",
        realmLevel: 1,
        sellPrice: 60,
        description: "蘊含火焰之力的果實"
    },
    
    "玄冰蓮": {
        id: "xuan_bing_lian",
        name: "玄冰蓮",
        rarity: SEED_RARITY.XUAN,
        element: "water",
        realmLevel: 1,
        sellPrice: 50,
        description: "生長在玄冰中的蓮花"
    },
    
    
    
    
    "九葉蓮": {
        id: "jiu_ye_lian",
        name: "九葉蓮",
        rarity: SEED_RARITY.DI,
        element: "water",
        realmLevel: 2,
        sellPrice: 200,
        description: "九片葉子的神奇蓮花"
    },
    
    "血菩提": {
        id: "xue_pu_ti",
        name: "血菩提",
        rarity: SEED_RARITY.DI,
        element: "fire",
        realmLevel: 2,
        sellPrice: 220,
        description: "傳說中的療傷聖品"
    },
    
    "龍涎草": {
        id: "long_xian_cao",
        name: "龍涎草",
        rarity: SEED_RARITY.DI,
        element: "wood",
        realmLevel: 2,
        sellPrice: 200,
        description: "生長在龍涎之中的靈草"
    },
    
    "鳳凰羽": {
        id: "feng_huang_yu",
        name: "鳳凰羽",
        rarity: SEED_RARITY.DI,
        element: "fire",
        realmLevel: 2,
        sellPrice: 250,
        description: "鳳凰的羽毛化成的靈草"
    },
    
    "靈犀角": {
        id: "ling_xi_jiao",
        name: "靈犀角",
        rarity: SEED_RARITY.DI,
        element: "earth",
        realmLevel: 2,
        sellPrice: 200,
        description: "靈犀獸的角"
    },
    
    
    
    
    "天靈果": {
        id: "tian_ling_guo",
        name: "天靈果",
        rarity: SEED_RARITY.TIAN,
        element: "metal",
        realmLevel: 3,
        sellPrice: 1000,
        description: "天地靈氣凝聚的果實"
    },
    
    "麒麟花": {
        id: "qi_lin_hua",
        name: "麒麟花",
        rarity: SEED_RARITY.TIAN,
        element: "earth",
        realmLevel: 3,
        sellPrice: 1100,
        description: "麒麟踏過之地生長的仙花"
    },
    
    "鳳凰草": {
        id: "feng_huang_cao",
        name: "鳳凰草",
        rarity: SEED_RARITY.TIAN,
        element: "fire",
        realmLevel: 3,
        sellPrice: 1000,
        description: "鳳凰涅槃後生長的神草"
    },
    
    "龍血樹": {
        id: "long_xue_shu",
        name: "龍血樹",
        rarity: SEED_RARITY.TIAN,
        element: "wood",
        realmLevel: 3,
        sellPrice: 1200,
        description: "龍血浸潤的神樹"
    },
    
    "仙人掌": {
        id: "xian_ren_zhang",
        name: "仙人掌",
        rarity: SEED_RARITY.TIAN,
        element: "water",
        realmLevel: 3,
        sellPrice: 1000,
        description: "傳說中仙人種植的神掌"
    }
};






function getSeedData(seedType) {
    return SEEDS_DATA[seedType] || null;
}


function getHerbData(herbName) {
    return HERBS_DATA[herbName] || null;
}


function generateHerbHarvest(seedType) {
    const seed = getSeedData(seedType);
    if (!seed) return [];
    
    
    const count = Math.floor(Math.random() * (seed.maxHerbs - seed.minHerbs + 1)) + seed.minHerbs;
    
    
    const harvest = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * seed.herbPool.length);
        const herbName = seed.herbPool[randomIndex];
        harvest.push(herbName);
    }
    
    return harvest;
}


function getHerbElementClass(element) {
    const elementColors = {
        'metal': 'element-metal',   
        'wood': 'element-wood',     
        'water': 'element-water',   
        'fire': 'element-fire',     
        'earth': 'element-earth'    
    };
    
    return elementColors[element] || 'element-default';
}
