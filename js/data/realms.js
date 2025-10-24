



const REALMS_DATA = [
    {
        id: 0,
        name: '煉氣境',
        description: '吸納天地靈氣、鞏固體魄的起步階段。這時候你還在山腳喘。',
        baseRequirement: 100,        
        maxRequirement: 1000,        
        cultivationGain: 10,         
        sessionTime: 3,             
        breakthroughRate: 100,       
        stages: 10                   
    },
    {
        id: 1,
        name: '築基境',
        description: '穩固丹田、開啟經脈，成為真正的修士。',
        baseRequirement: 2000,
        maxRequirement: 10000,
        cultivationGain: 100,
        sessionTime: 4,
        breakthroughRate: 100,
        stages: 10
    },
    {
        id: 2,
        name: '金丹境',
        description: '凝聚金丹於體內，靈氣內循環，正式踏入長生之路。',
        baseRequirement: 20000,
        maxRequirement: 100000,
        cultivationGain: 1000,
        sessionTime: 5,
        breakthroughRate: 90,        
        stages: 10
    },
    {
        id: 3,
        name: '元嬰境',
        description: '元神離體、可御空飛行。人類終於進化成飛行動物。',
        baseRequirement: 200000,
        maxRequirement: 500000,
        cultivationGain: 5000,
        sessionTime: 10,
        breakthroughRate: 80,
        stages: 10
    },
    {
        id: 4,
        name: '化神境',
        description: '元神化形，掌控精神力與法則之初。',
        baseRequirement: 800000,
        maxRequirement: 1500000,
        cultivationGain: 15000,
        sessionTime: 10,
        breakthroughRate: 70,
        stages: 10
    },
    {
        id: 5,
        name: '合道境',
        description: '融天地之道，修士之身與天道共鳴。',
        baseRequirement: 2000000,
        maxRequirement: 5000000,
        cultivationGain: 50000,
        sessionTime: 10,
        breakthroughRate: 60,
        stages: 10
    },
    {
        id: 6,
        name: '大乘境',
        description: '修為大成，可創宗立派，壽元悠長。',
        baseRequirement: 8000000,
        maxRequirement: 15000000,
        cultivationGain: 150000,
        sessionTime: 10,
        breakthroughRate: 50,
        stages: 10
    },
    {
        id: 7,
        name: '渡劫境',
        description: '面對天劫洗禮，九死一生。',
        baseRequirement: 20000000,
        maxRequirement: 30000000,
        cultivationGain: 300000,
        sessionTime: 10,
        breakthroughRate: 40,
        stages: 10
    }
];


const STAGE_NAMES = {
    1: '一期',
    2: '二期', 
    3: '三期',
    4: '四期',
    5: '五期',
    6: '六期',
    7: '七期',
    8: '八期',
    9: '九期',
    10: '圓滿'
};


const STAGE_PHASES = {
    early: [1, 2, 3],      
    middle: [4, 5, 6],     
    late: [7, 8, 9],       
    perfect: [10]          
};


function getRealmData(realmIndex) {
    return REALMS_DATA[realmIndex] || null;
}


function calculateStageRequirement(realmIndex, stage) {
    const realm = REALMS_DATA[realmIndex];
    if (!realm) return 0;
    
    const totalRange = realm.maxRequirement - realm.baseRequirement;
    
    
    
    const weights = [1, 1.2, 1.5, 2, 2.5, 3.5, 4.5, 6, 8, 10];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    let accumulated = realm.baseRequirement;
    for (let i = 1; i < stage; i++) {
        accumulated += (totalRange * weights[i - 1]) / totalWeight;
    }
    
    return Math.floor(accumulated);
}


function getStageName(stage) {
    return STAGE_NAMES[stage] || '未知';
}


function getStagePhase(stage) {
    if (STAGE_PHASES.early.includes(stage)) return '初期';
    if (STAGE_PHASES.middle.includes(stage)) return '中期';
    if (STAGE_PHASES.late.includes(stage)) return '後期';
    if (STAGE_PHASES.perfect.includes(stage)) return '圓滿';
    return '';
}