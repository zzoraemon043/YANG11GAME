// ====================================
// 功法資料配置
// ====================================

// 功法稀有度等級
const TECHNIQUE_RARITY = {
    HUANG: 'huang',    // 黃階
    XUAN: 'xuan',      // 玄階
    DI: 'di',          // 地階
    TIAN: 'tian',      // 天階
    XIAN: 'xian'       // 仙階
};

// 功法資料庫
const TECHNIQUES_DATA = {
    // ========================================
    // 黃階功法
    // ========================================
    "基礎吐納術": {
        id: "basic_breathing",
        name: "基礎吐納術",
        rarity: TECHNIQUE_RARITY.HUANG,
        realmRequirement: 0,  // 煉氣境
        
        // 主效果（只有運行時生效）
        mainEffect: {
            type: "cultivation_speed",
            value: 10  // 修煉速度 +10%
        },
        
        // 被動效果（永遠生效）
        passiveEffect: {
            type: "element",
            element: "metal",  // 金屬性
            value: 5           // +5 點
        },
        
        description: "最基礎的吐納功法，適合初學者修煉。"
    },
    
    "青木訣": {
        id: "green_wood_art",
        name: "青木訣",
        rarity: TECHNIQUE_RARITY.HUANG,
        realmRequirement: 0,
        
        mainEffect: {
            type: "cultivation_speed",
            value: 12
        },
        
        passiveEffect: {
            type: "element",
            element: "wood",
            value: 6
        },
        
        description: "木屬性功法，生生不息。"
    },
    
    "流水訣": {
        id: "flowing_water_art",
        name: "流水訣",
        rarity: TECHNIQUE_RARITY.HUANG,
        realmRequirement: 0,
        
        mainEffect: {
            type: "cultivation_speed",
            value: 11
        },
        
        passiveEffect: {
            type: "element",
            element: "water",
            value: 5
        },
        
        description: "水屬性功法，綿綿不絕。"
    },
    
    // ========================================
    // 玄階功法
    // ========================================
    "紫霞功": {
        id: "purple_cloud",
        name: "紫霞功",
        rarity: TECHNIQUE_RARITY.XUAN,
        realmRequirement: 1,  // 築基境
        
        mainEffect: {
            type: "cultivation_speed",
            value: 25
        },
        
        passiveEffect: {
            type: "element",
            element: "fire",
            value: 15
        },
        
        description: "華山派祖傳功法，火屬性功法。"
    },
    
    "玄鐵心法": {
        id: "black_iron_heart",
        name: "玄鐵心法",
        rarity: TECHNIQUE_RARITY.XUAN,
        realmRequirement: 1,
        
        mainEffect: {
            type: "cultivation_speed",
            value: 23
        },
        
        passiveEffect: {
            type: "element",
            element: "metal",
            value: 18
        },
        
        description: "金屬性功法，堅不可摧。"
    },
    
    "厚土功": {
        id: "thick_earth_skill",
        name: "厚土功",
        rarity: TECHNIQUE_RARITY.XUAN,
        realmRequirement: 1,
        
        mainEffect: {
            type: "cultivation_speed",
            value: 24
        },
        
        passiveEffect: {
            type: "element",
            element: "earth",
            value: 16
        },
        
        description: "土屬性功法，厚德載物。"
    },
    
    // ========================================
    // 地階功法
    // ========================================
    "大力金剛功": {
        id: "vajra_power",
        name: "大力金剛功",
        rarity: TECHNIQUE_RARITY.DI,
        realmRequirement: 3,  // 元嬰境
        
        mainEffect: {
            type: "cultivation_speed",
            value: 45
        },
        
        passiveEffect: {
            type: "special",
            effect: "auto_alchemy",
            value: 2  // 2% 機率自動煉丹
        },
        
        description: "少林絕學，力大無窮。"
    },
    
    "九陽真經": {
        id: "nine_yang_manual",
        name: "九陽真經",
        rarity: TECHNIQUE_RARITY.DI,
        realmRequirement: 3,
        
        mainEffect: {
            type: "cultivation_speed",
            value: 50
        },
        
        passiveEffect: {
            type: "element",
            element: "fire",
            value: 40
        },
        
        description: "至陽至剛的火屬性功法。"
    },
    
    "碧海潮生訣": {
        id: "blue_sea_tide",
        name: "碧海潮生訣",
        rarity: TECHNIQUE_RARITY.DI,
        realmRequirement: 3,
        
        mainEffect: {
            type: "cultivation_speed",
            value: 48
        },
        
        passiveEffect: {
            type: "special",
            effect: "spirit_stone_gain",
            value: 10  // 靈石獲得 +10%
        },
        
        description: "水屬性功法，波濤洶湧。"
    },
    
    // ========================================
    // 天階功法
    // ========================================
    "北冥神功": {
        id: "beiming_divine_skill",
        name: "北冥神功",
        rarity: TECHNIQUE_RARITY.TIAN,
        realmRequirement: 5,  // 合道境
        
        mainEffect: {
            type: "cultivation_speed",
            value: 70
        },
        
        passiveEffect: {
            type: "special",
            effect: "auto_harvest",
            value: 5  // 5% 機率自動收穫靈田
        },
        
        description: "逍遙派絕學，吸人內力為己用。"
    },
    
    "太極玄清道": {
        id: "taiji_mystery",
        name: "太極玄清道",
        rarity: TECHNIQUE_RARITY.TIAN,
        realmRequirement: 5,
        
        mainEffect: {
            type: "cultivation_speed",
            value: 75
        },
        
        passiveEffect: {
            type: "special",
            effect: "alchemy_success",
            value: 10  // 煉丹成功率 +10%
        },
        
        description: "青雲門鎮派功法，玄妙無比。"
    },
    
    // ========================================
    // 仙階功法
    // ========================================
    "混元金章": {
        id: "hunyuan_golden_chapter",
        name: "混元金章",
        rarity: TECHNIQUE_RARITY.XIAN,
        realmRequirement: 7,  // 渡劫境
        
        mainEffect: {
            type: "cultivation_speed",
            value: 100
        },
        
        passiveEffect: {
            type: "special",
            effect: "auto_collect",
            value: 10  // 10% 機率自動收取靈石
        },
        
        description: "傳說中的仙階功法，威力無窮。"
    },
    
    "萬劍歸宗": {
        id: "ten_thousand_swords",
        name: "萬劍歸宗",
        rarity: TECHNIQUE_RARITY.XIAN,
        realmRequirement: 7,
        
        mainEffect: {
            type: "cultivation_speed",
            value: 120
        },
        
        passiveEffect: {
            type: "element",
            element: "metal",
            value: 100
        },
        
        description: "劍修至高功法，萬劍聽命。"
    }
};

// ====================================
// 工具函數
// ====================================

// 獲取功法資料
function getTechniqueData(techniqueName) {
    return TECHNIQUES_DATA[techniqueName] || null;
}

// 獲取功法列表（根據境界篩選）
function getTechniquesByRealm(realmIndex) {
    const techniques = [];
    
    for (let name in TECHNIQUES_DATA) {
        const technique = TECHNIQUES_DATA[name];
        if (technique.realmRequirement <= realmIndex) {
            techniques.push(technique);
        }
    }
    
    return techniques;
}

// 獲取稀有度顏色類名
function getTechniqueRarityClass(rarity) {
    const rarityColors = {
        'huang': 'technique-huang',  // 黃色
        'xuan': 'technique-xuan',    // 青色
        'di': 'technique-di',        // 紫色
        'tian': 'technique-tian',    // 金色
        'xian': 'technique-xian'     // 紅色
    };
    
    return rarityColors[rarity] || 'technique-default';
}

// 獲取稀有度中文名稱
function getTechniqueRarityName(rarity) {
    const rarityNames = {
        'huang': '黃階',
        'xuan': '玄階',
        'di': '地階',
        'tian': '天階',
        'xian': '仙階'
    };
    
    return rarityNames[rarity] || '未知';
}

// 獲取元素中文名稱
function getElementName(element) {
    const elementNames = {
        'metal': '金',
        'wood': '木',
        'water': '水',
        'fire': '火',
        'earth': '土'
    };
    
    return elementNames[element] || '無';
}

// 獲取特殊效果中文描述
function getSpecialEffectDesc(effect, value) {
    const effectDescs = {
        'auto_alchemy': `自動煉丹 ${value}%`,
        'auto_harvest': `自動收穫靈田 ${value}%`,
        'auto_collect': `自動收取靈石 ${value}%`,
        'spirit_stone_gain': `靈石獲得 +${value}%`,
        'alchemy_success': `煉丹成功率 +${value}%`,
        'battle_damage': `戰鬥傷害 +${value}%`,
        'cultivation_gain': `修為獲得 +${value}%`
    };
    
    return effectDescs[effect] || `未知效果`;
}