



class Player {
    constructor() {
        
        this.name = '道友';
        
        
        this.cultivation = 0;           
        this.realmIndex = 0;            
        this.stage = 1;                 
        
        
        this.isCultivating = false;     
        this.cultivationProgress = 0;   
        this.cultivationTimer = null;   
        
        
        this.breakthroughCooldown = 0;  
        this.breakthroughAttempts = 0;  
        this.breakthroughFails = 0;     
        
        
        this.totalCultivationSessions = 0;  
        this.playTime = 0;                  
    
    
    
    
    this.cave = {
        
        farmLevel: 1,
        alchemyLevel: 0,
        libraryLevel: 1,
        mineLevel: 0,
        arrayLevel: 0,
        
        
        farms: [
            { unlocked: true, planting: null, startTime: 0 },
            { unlocked: false, planting: null, startTime: 0 },
            { unlocked: false, planting: null, startTime: 0 },
            { unlocked: false, planting: null, startTime: 0 },
            { unlocked: false, planting: null, startTime: 0 }
        ],
        
        
        mineAccumulated: 0,
        mineLastCollect: Date.now(),
        
        
        alchemyQueue: []
    };
    
    
    this.resources = {
        spiritStone: 1000,
        
        seeds: {
            huang: 5,
            xuan: 0,
            di: 0,
            tian: 0
        },
        
        herbs: {},
        pills: {},
        recipes: ["聚氣丹", "回春丹"]
    };
    
    
    this.techniques = {
        owned: ["基礎吐納術"],
        active: "基礎吐納術",
        maxSlots: 10
    };
    
    
    this.elements = {
        metal: 0,
        wood: 0,
        water: 0,
        fire: 0,
        earth: 0
    };
    
    
    this.vip = {
        active: false,
        expireTime: 0
    };
}
    
    
    
    
    
    
    getCurrentRealm() {
        return getRealmData(this.realmIndex);
    }
    
    
    getRealmName() {
        const realm = this.getCurrentRealm();
        return realm ? realm.name : '未知境界';
    }
    
    
    getStageName() {
        return getStageName(this.stage);
    }
    
    
    getFullRealmName() {
        return `${this.getRealmName()} ${this.getStageName()}`;
    }
    
    
    getStagePhase() {
        return getStagePhase(this.stage);
    }
    
    
    
    
    
    
    getCurrentStageRequirement() {
        return calculateStageRequirement(this.realmIndex, this.stage);
    }
    
    
    getNextStageRequirement() {
        
        if (this.stage === 10) {
            const realm = this.getCurrentRealm();
            return realm ? realm.maxRequirement : 0;
        }
        return calculateStageRequirement(this.realmIndex, this.stage + 1);
    }
    
    
    getCultivationProgress() {
        const current = this.getCurrentStageRequirement();
        const next = this.getNextStageRequirement();
        
        if (next <= current) return 100;
        
        const progress = ((this.cultivation - current) / (next - current)) * 100;
        return Math.max(0, Math.min(100, progress));
    }
    
    
    addCultivation(amount) {
        this.cultivation += amount;
        this.checkAutoAdvance();
    }
    
    
    
    
    
    
    checkAutoAdvance() {
        
        if (this.stage === 10) return false;
        
        const nextRequirement = this.getNextStageRequirement();
        
        if (this.cultivation >= nextRequirement) {
            this.stage++;
            return true;
        }
        
        return false;
    }
    
    
    isPerfectStage() {
        return this.stage === 10;
    }
    
    
    canBreakthrough() {
        
        if (!this.isPerfectStage()) return false;
        
        
        const realm = this.getCurrentRealm();
        if (!realm) return false;
        if (this.cultivation < realm.maxRequirement) return false;
        
        
        if (this.breakthroughCooldown > 0) return false;
        
        return true;
    }
    
    
    breakthrough() {
        
        if (this.realmIndex >= REALMS_DATA.length - 1) {
            return {
                success: false,
                message: '已達到最高境界！'
            };
        }
        
        this.realmIndex++;
        this.stage = 1;
        this.breakthroughAttempts++;
        
        return {
            success: true,
            message: `成功突破到 ${this.getRealmName()}！`
        };
    }
    
    
    breakthroughFailed() {
        this.breakthroughFails++;
        this.breakthroughCooldown = 60;  
        
        return {
            success: false,
            message: '渡劫失敗！需要等待 60 秒後再次嘗試。'
        };
    }
    
    
    
    
    
    
    getCultivationGain() {
        const realm = this.getCurrentRealm();
        return realm ? realm.cultivationGain : 0;
    }
    
    
    getCultivationTime() {
        const realm = this.getCurrentRealm();
        return realm ? realm.sessionTime : 10;
    }
    
    
    
    
    
    
    getBreakthroughRate() {
        const realm = this.getCurrentRealm();
        return realm ? realm.breakthroughRate : 100;
    }
    
    
    updateCooldown(deltaTime) {
        if (this.breakthroughCooldown > 0) {
            this.breakthroughCooldown = Math.max(0, this.breakthroughCooldown - deltaTime);
        }
    }
    
    
    
    
    
    
    toJSON() {
        return {
            name: this.name,
            cultivation: this.cultivation,
            realmIndex: this.realmIndex,
            stage: this.stage,
            breakthroughAttempts: this.breakthroughAttempts,
            breakthroughFails: this.breakthroughFails,
            totalCultivationSessions: this.totalCultivationSessions,
            playTime: this.playTime,

            cave: this.cave,
            resources: this.resources,
            techniques: this.techniques,
            elements: this.elements,
            vip: this.vip
        };
    }
    
    
    fromJSON(data) {
        this.name = data.name || '道友';
        this.cultivation = data.cultivation || 0;
        this.realmIndex = data.realmIndex || 0;
        this.stage = data.stage || 1;
        this.breakthroughAttempts = data.breakthroughAttempts || 0;
        this.breakthroughFails = data.breakthroughFails || 0;
        this.totalCultivationSessions = data.totalCultivationSessions || 0;
        this.playTime = data.playTime || 0;

            
        if (data.cave) {
           this.cave = data.cave;
        }
        if (data.resources) {
           this.resources = data.resources;
        }
        if (data.techniques) {
            this.techniques = data.techniques;
         }
        if (data.elements) {
            this.elements = data.elements;
        }
        if (data.vip) {
            this.vip = data.vip;
        }
    }
}