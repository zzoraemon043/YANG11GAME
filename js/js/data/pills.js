




const PILL_QUALITY = {
    INFERIOR: 'inferior',    
    NORMAL: 'normal',        
    SUPERIOR: 'superior',    
    PERFECT: 'perfect'       
};


const PILL_RARITY = {
    HUANG: 'huang',  
    XUAN: 'xuan',    
    DI: 'di',        
    TIAN: 'tian'     
};


const PILLS_DATA = {
    
    
    
    "聚氣丹": {
        id: "qi_gathering_pill",
        name: "聚氣丹",
        rarity: PILL_RARITY.HUANG,
        element: "metal",
        realmLevel: 0,
        
        effect: {
            type: "cultivation_boost",
            value: 20,              
            duration: 30 * 60       
        },
        
        description: "最基礎的修煉輔助丹藥，能提升修煉效率。"
    },
    
    "回春丹": {
        id: "healing_pill",
        name: "回春丹",
        rarity: PILL_RARITY.HUANG,
        element: "wood",
        realmLevel: 0,
        
        effect: {
            type: "reduce_cooldown",
            value: 30               
        },
        
        description: "恢復類丹藥，能減少渡劫失敗的冷卻時間。"
    },
    
    "凝神丹": {
        id: "focus_pill",
        name: "凝神丹",
        rarity: PILL_RARITY.HUANG,
        element: "water",
        realmLevel: 0,
        
        effect: {
            type: "cultivation_time",
            value: -10              
        },
        
        description: "能夠凝神靜氣，縮短修煉時間。"
    },
    
    
    
    
    "金髓丹": {
        id: "golden_marrow_pill",
        name: "金髓丹",
        rarity: PILL_RARITY.XUAN,
        element: "metal",
        realmLevel: 1,
        
        effect: {
            type: "cultivation_boost",
            value: 50,
            duration: 60 * 60       
        },
        
        description: "蘊含金屬靈氣的丹藥，大幅提升修煉效率。"
    },
    
    "築基丹": {
        id: "foundation_pill",
        name: "築基丹",
        rarity: PILL_RARITY.XUAN,
        element: "earth",
        realmLevel: 1,
        
        effect: {
            type: "breakthrough_rate",
            value: 5                
        },
        
        description: "築基境專用，能增加突破成功率。"
    },
    
    "紫霞丹": {
        id: "purple_cloud_pill",
        name: "紫霞丹",
        rarity: PILL_RARITY.XUAN,
        element: "fire",
        realmLevel: 1,
        
        effect: {
            type: "cultivation_boost",
            value: 40,
            duration: 45 * 60
        },
        
        description: "火屬性丹藥，適合火系功法修煉者。"
    },
    
    
    
    
    "大還丹": {
        id: "great_return_pill",
        name: "大還丹",
        rarity: PILL_RARITY.DI,
        element: "wood",
        realmLevel: 2,
        
        effect: {
            type: "cultivation_boost",
            value: 100,
            duration: 120 * 60      
        },
        
        description: "傳說中的療傷聖藥，也能大幅提升修煉效率。"
    },
    
    "破境丹": {
        id: "breakthrough_pill",
        name: "破境丹",
        rarity: PILL_RARITY.DI,
        element: "fire",
        realmLevel: 2,
        
        effect: {
            type: "breakthrough_rate",
            value: 10
        },
        
        description: "專門用於突破境界，能增加渡劫成功率。"
    },
    
    "金丹玉露": {
        id: "golden_jade_dew",
        name: "金丹玉露",
        rarity: PILL_RARITY.DI,
        element: "water",
        realmLevel: 2,
        
        effect: {
            type: "instant_cultivation",
            value: 10000            
        },
        
        description: "凝聚天地精華，能立即增加修為。"
    },
    
    
    
    
    "九轉金丹": {
        id: "nine_turn_golden_pill",
        name: "九轉金丹",
        rarity: PILL_RARITY.TIAN,
        element: "metal",
        realmLevel: 3,
        
        effect: {
            type: "cultivation_boost",
            value: 200,
            duration: 240 * 60      
        },
        
        description: "傳說中的仙丹，效果驚人。"
    },
    
    "天劫丹": {
        id: "heaven_tribulation_pill",
        name: "天劫丹",
        rarity: PILL_RARITY.TIAN,
        element: "fire",
        realmLevel: 3,
        
        effect: {
            type: "breakthrough_rate",
            value: 20
        },
        
        description: "專門對抗天劫的丹藥，大幅增加渡劫成功率。"
    },
    
    "造化神丹": {
        id: "fortune_divine_pill",
        name: "造化神丹",
        rarity: PILL_RARITY.TIAN,
        element: "wood",
        realmLevel: 3,
        
        effect: {
            type: "instant_cultivation",
            value: 100000
        },
        
        description: "奪天地之造化，能瞬間提升大量修為。"
    },
    
    "療傷金丹": {
        id: "healing_golden_pill",
        name: "療傷金丹",
        rarity: PILL_RARITY.TIAN,
        element: "water",
        realmLevel: 3,
        
        effect: {
            type: "remove_cooldown",
            value: 1                
        },
        
        description: "極品療傷丹藥，能立即移除渡劫失敗的冷卻時間。"
    }
};


const RECIPES_DATA = {
    
    
    
    "聚氣丹": {
        id: "qi_gathering_recipe",
        name: "聚氣丹丹方",
        pillName: "聚氣丹",
        rarity: PILL_RARITY.HUANG,
        
        materials: {
            "青靈芝": 2,
            "白雲草": 1
        },
        
        spiritStone: 50,          
        alchemyTime: 10 * 60,     
        baseSuccessRate: 70,      
        minLevel: 1,              
        
        description: "最基礎的丹方，成功率較高。"
    },
    
    "回春丹": {
        id: "healing_recipe",
        name: "回春丹丹方",
        pillName: "回春丹",
        rarity: PILL_RARITY.HUANG,
        
        materials: {
            "月華芝": 2,
            "凝露草": 2
        },
        
        spiritStone: 60,
        alchemyTime: 12 * 60,
        baseSuccessRate: 65,
        minLevel: 1,
        
        description: "恢復類丹方，需要水木屬性材料。"
    },
    
    "凝神丹": {
        id: "focus_recipe",
        name: "凝神丹丹方",
        pillName: "凝神丹",
        rarity: PILL_RARITY.HUANG,
        
        materials: {
            "聚氣花": 3,
            "凝露草": 1
        },
        
        spiritStone: 55,
        alchemyTime: 10 * 60,
        baseSuccessRate: 68,
        minLevel: 1,
        
        description: "輔助修煉的基礎丹方。"
    },
    
    
    
    
    "金髓丹": {
        id: "golden_marrow_recipe",
        name: "金髓丹丹方",
        pillName: "金髓丹",
        rarity: PILL_RARITY.XUAN,
        
        materials: {
            "金剛根": 3,
            "紫雲花": 2
        },
        
        spiritStone: 200,
        alchemyTime: 30 * 60,
        baseSuccessRate: 50,
        minLevel: 5,
        
        description: "玄階丹方，難度較高。"
    },
    
    "築基丹": {
        id: "foundation_recipe",
        name: "築基丹丹方",
        pillName: "築基丹",
        rarity: PILL_RARITY.XUAN,
        
        materials: {
            "碧月草": 2,
            "玄冰蓮": 2,
            "赤火果": 1
        },
        
        spiritStone: 250,
        alchemyTime: 40 * 60,
        baseSuccessRate: 45,
        minLevel: 5,
        
        description: "突破專用丹方，珍貴無比。"
    },
    
    "紫霞丹": {
        id: "purple_cloud_recipe",
        name: "紫霞丹丹方",
        pillName: "紫霞丹",
        rarity: PILL_RARITY.XUAN,
        
        materials: {
            "紫雲花": 4,
            "赤火果": 2
        },
        
        spiritStone: 220,
        alchemyTime: 35 * 60,
        baseSuccessRate: 48,
        minLevel: 5,
        
        description: "火屬性丹方，適合火修。"
    },
    
    
    
    
    "大還丹": {
        id: "great_return_recipe",
        name: "大還丹丹方",
        pillName: "大還丹",
        rarity: PILL_RARITY.DI,
        
        materials: {
            "九葉蓮": 3,
            "血菩提": 2,
            "龍涎草": 2
        },
        
        spiritStone: 800,
        alchemyTime: 90 * 60,
        baseSuccessRate: 30,
        minLevel: 10,
        
        description: "地階丹方，難度極高。"
    },
    
    "破境丹": {
        id: "breakthrough_recipe",
        name: "破境丹丹方",
        pillName: "破境丹",
        rarity: PILL_RARITY.DI,
        
        materials: {
            "鳳凰羽": 3,
            "血菩提": 3,
            "靈犀角": 1
        },
        
        spiritStone: 1000,
        alchemyTime: 120 * 60,
        baseSuccessRate: 25,
        minLevel: 10,
        
        description: "破境專用，成功率較低但效果卓越。"
    },
    
    "金丹玉露": {
        id: "golden_jade_dew_recipe",
        name: "金丹玉露丹方",
        pillName: "金丹玉露",
        rarity: PILL_RARITY.DI,
        
        materials: {
            "九葉蓮": 4,
            "龍涎草": 3
        },
        
        spiritStone: 900,
        alchemyTime: 100 * 60,
        baseSuccessRate: 28,
        minLevel: 10,
        
        description: "能立即增加修為的珍貴丹方。"
    },
    
    
    
    
    "九轉金丹": {
        id: "nine_turn_golden_recipe",
        name: "九轉金丹丹方",
        pillName: "九轉金丹",
        rarity: PILL_RARITY.TIAN,
        
        materials: {
            "天靈果": 5,
            "麒麟花": 3,
            "鳳凰草": 3
        },
        
        spiritStone: 3000,
        alchemyTime: 240 * 60,
        baseSuccessRate: 15,
        minLevel: 15,
        
        description: "傳說中的仙丹丹方，成功率極低。"
    },
    
    "天劫丹": {
        id: "heaven_tribulation_recipe",
        name: "天劫丹丹方",
        pillName: "天劫丹",
        rarity: PILL_RARITY.TIAN,
        
        materials: {
            "鳳凰草": 5,
            "龍血樹": 3,
            "天靈果": 2
        },
        
        spiritStone: 3500,
        alchemyTime: 300 * 60,
        baseSuccessRate: 12,
        minLevel: 15,
        
        description: "對抗天劫的終極丹方。"
    },
    
    "造化神丹": {
        id: "fortune_divine_recipe",
        name: "造化神丹丹方",
        pillName: "造化神丹",
        rarity: PILL_RARITY.TIAN,
        
        materials: {
            "天靈果": 4,
            "龍血樹": 4,
            "仙人掌": 3
        },
        
        spiritStone: 4000,
        alchemyTime: 360 * 60,
        baseSuccessRate: 10,
        minLevel: 15,
        
        description: "奪天地造化的神級丹方。"
    },
    
    "療傷金丹": {
        id: "healing_golden_recipe",
        name: "療傷金丹丹方",
        pillName: "療傷金丹",
        rarity: PILL_RARITY.TIAN,
        
        materials: {
            "仙人掌": 5,
            "九葉蓮": 3,
            "血菩提": 3
        },
        
        spiritStone: 3200,
        alchemyTime: 280 * 60,
        baseSuccessRate: 13,
        minLevel: 15,
        
        description: "最頂級的療傷丹方。"
    }
};






function getPillData(pillName) {
    return PILLS_DATA[pillName] || null;
}


function getRecipeData(recipeName) {
    return RECIPES_DATA[recipeName] || null;
}


function calculatePillEffect(pillName, quality) {
    const pill = getPillData(pillName);
    if (!pill) return null;
    
    const qualityMultipliers = {
        'inferior': 0.5,   
        'normal': 1.0,     
        'superior': 1.5,   
        'perfect': 2.0     
    };
    
    const multiplier = qualityMultipliers[quality] || 1.0;
    
    return {
        ...pill.effect,
        value: Math.floor(pill.effect.value * multiplier),
        quality: quality
    };
}


function determineAlchemyQuality(successRate) {
    const random = Math.random() * 100;
    
    
    if (random > successRate) {
        return null;
    }
    
    
    const qualityRandom = Math.random() * 100;
    
    if (qualityRandom < 5) {
        return PILL_QUALITY.PERFECT;    
    } else if (qualityRandom < 20) {
        return PILL_QUALITY.SUPERIOR;   
    } else if (qualityRandom < 60) {
        return PILL_QUALITY.NORMAL;     
    } else {
        return PILL_QUALITY.INFERIOR;   
    }
}


function getPillQualityName(quality) {
    const qualityNames = {
        'inferior': '下品',
        'normal': '中品',
        'superior': '上品',
        'perfect': '極品'
    };
    
    return qualityNames[quality] || '未知';
}


function getPillQualityClass(quality) {
    const qualityColors = {
        'inferior': 'quality-inferior',   
        'normal': 'quality-normal',       
        'superior': 'quality-superior',   
        'perfect': 'quality-perfect'      
    };
    
    return qualityColors[quality] || 'quality-default';
}


function getPillEffectDescription(pill, quality) {
    const effect = calculatePillEffect(pill.name, quality);
    if (!effect) return '無效果';
    
    const qualityName = getPillQualityName(quality);
    
    switch (effect.type) {
        case 'cultivation_boost':
            return `${qualityName} - 修為獲得 +${effect.value}% (${formatTime(effect.duration)})`;
        case 'breakthrough_rate':
            return `${qualityName} - 渡劫成功率 +${effect.value}%`;
        case 'instant_cultivation':
            return `${qualityName} - 立即獲得 ${formatNumber(effect.value)} 修為`;
        case 'reduce_cooldown':
            return `${qualityName} - 減少 ${effect.value} 秒冷卻時間`;
        case 'remove_cooldown':
            return `${qualityName} - 完全移除冷卻時間`;
        case 'cultivation_time':
            return `${qualityName} - 修煉時間 ${effect.value}%`;
        default:
            return `${qualityName} - 未知效果`;
    }
}