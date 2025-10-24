// ====================================
// 玩家實體類
// ====================================

class Player {
    constructor() {
        // 基礎屬性
        this.name = '道友';
        
        // 修煉相關
        this.cultivation = 0;           // 當前修為
        this.realmIndex = 0;            // 大境界索引（0=煉氣境）
        this.stage = 1;                 // 小境界（1-10）
        
        // 修煉狀態
        this.isCultivating = false;     // 是否正在修煉
        this.cultivationProgress = 0;   // 修煉進度（0-100）
        this.cultivationTimer = null;   // 修煉計時器
        
        // 渡劫相關
        this.breakthroughCooldown = 0;  // 渡劫冷卻時間（秒）
        this.breakthroughAttempts = 0;  // 渡劫次數統計
        this.breakthroughFails = 0;     // 渡劫失敗次數
        
        // 統計資料
        this.totalCultivationSessions = 0;  // 總修煉次數
        this.playTime = 0;                  // 遊戲時間（秒）
    
    // ========================================
    // 🆕 洞府相關資料
    // ========================================
    this.cave = {
        // 設施等級
        farmLevel: 1,
        alchemyLevel: 0,
        libraryLevel: 1,
        mineLevel: 0,
        arrayLevel: 0,
        
        // 靈田槽位
        farms: [
            { unlocked: true, planting: null, startTime: 0 },
            { unlocked: false, planting: null, startTime: 0 },
            { unlocked: false, planting: null, startTime: 0 },
            { unlocked: false, planting: null, startTime: 0 },
            { unlocked: false, planting: null, startTime: 0 }
        ],
        
        // 礦脈累積
        mineAccumulated: 0,
        mineLastCollect: Date.now(),
        
        // 煉丹佇列
        alchemyQueue: []
    };
    
    // 🆕 資源
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
    
    // 🆕 功法
    this.techniques = {
        owned: ["基礎吐納術"],
        active: "基礎吐納術",
        maxSlots: 10
    };
    
    // 🆕 五行屬性
    this.elements = {
        metal: 0,
        wood: 0,
        water: 0,
        fire: 0,
        earth: 0
    };
    
    // 🆕 月卡
    this.vip = {
        active: false,
        expireTime: 0
    };
}
    
    // ====================================
    // 境界相關方法
    // ====================================
    
    // 獲取當前境界資料
    getCurrentRealm() {
        return getRealmData(this.realmIndex);
    }
    
    // 獲取當前境界名稱
    getRealmName() {
        const realm = this.getCurrentRealm();
        return realm ? realm.name : '未知境界';
    }
    
    // 獲取當前階段名稱
    getStageName() {
        return getStageName(this.stage);
    }
    
    // 獲取完整境界顯示（例如：煉氣境 三期）
    getFullRealmName() {
        return `${this.getRealmName()} ${this.getStageName()}`;
    }
    
    // 獲取階段描述（初期/中期/後期/圓滿）
    getStagePhase() {
        return getStagePhase(this.stage);
    }
    
    // ====================================
    // 修為相關方法
    // ====================================
    
    // 獲取當前階段需要的修為
    getCurrentStageRequirement() {
        return calculateStageRequirement(this.realmIndex, this.stage);
    }
    
    // 獲取下一階段需要的修為
    getNextStageRequirement() {
        // 如果是圓滿期，返回當前境界最大值
        if (this.stage === 10) {
            const realm = this.getCurrentRealm();
            return realm ? realm.maxRequirement : 0;
        }
        return calculateStageRequirement(this.realmIndex, this.stage + 1);
    }
    
    // 獲取當前階段修為進度百分比
    getCultivationProgress() {
        const current = this.getCurrentStageRequirement();
        const next = this.getNextStageRequirement();
        
        if (next <= current) return 100;
        
        const progress = ((this.cultivation - current) / (next - current)) * 100;
        return Math.max(0, Math.min(100, progress));
    }
    
    // 增加修為
    addCultivation(amount) {
        this.cultivation += amount;
        this.checkAutoAdvance();
    }
    
    // ====================================
    // 境界提升相關
    // ====================================
    
    // 檢查是否可以自動進入下一個小境界
    checkAutoAdvance() {
        // 如果是圓滿期，不自動提升（需要渡劫）
        if (this.stage === 10) return false;
        
        const nextRequirement = this.getNextStageRequirement();
        
        if (this.cultivation >= nextRequirement) {
            this.stage++;
            return true;
        }
        
        return false;
    }
    
    // 檢查是否在圓滿期
    isPerfectStage() {
        return this.stage === 10;
    }
    
    // 檢查是否可以渡劫
    canBreakthrough() {
        // 必須在圓滿期
        if (!this.isPerfectStage()) return false;
        
        // 必須修為達標
        const realm = this.getCurrentRealm();
        if (!realm) return false;
        if (this.cultivation < realm.maxRequirement) return false;
        
        // 必須沒有冷卻
        if (this.breakthroughCooldown > 0) return false;
        
        return true;
    }
    
    // 突破到下一個大境界
    breakthrough() {
        // 檢查是否還有下一個境界
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
    
    // 渡劫失敗處理
    breakthroughFailed() {
        this.breakthroughFails++;
        this.breakthroughCooldown = 60;  // 冷卻 60 秒
        
        return {
            success: false,
            message: '渡劫失敗！需要等待 60 秒後再次嘗試。'
        };
    }
    
    // ====================================
    // 修煉相關方法
    // ====================================
    
    // 獲取每次修煉獲得的修為
    getCultivationGain() {
        const realm = this.getCurrentRealm();
        return realm ? realm.cultivationGain : 0;
    }
    
    // 獲取修煉時間
    getCultivationTime() {
        const realm = this.getCurrentRealm();
        return realm ? realm.sessionTime : 10;
    }
    
    // ====================================
    // 渡劫相關方法
    // ====================================
    
    // 獲取渡劫成功率
    getBreakthroughRate() {
        const realm = this.getCurrentRealm();
        return realm ? realm.breakthroughRate : 100;
    }
    
    // 更新冷卻時間
    updateCooldown(deltaTime) {
        if (this.breakthroughCooldown > 0) {
            this.breakthroughCooldown = Math.max(0, this.breakthroughCooldown - deltaTime);
        }
    }
    
    // ====================================
    // 存檔相關方法
    // ====================================
    
    // 導出存檔資料
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
    
    // 從存檔載入
    fromJSON(data) {
        this.name = data.name || '道友';
        this.cultivation = data.cultivation || 0;
        this.realmIndex = data.realmIndex || 0;
        this.stage = data.stage || 1;
        this.breakthroughAttempts = data.breakthroughAttempts || 0;
        this.breakthroughFails = data.breakthroughFails || 0;
        this.totalCultivationSessions = data.totalCultivationSessions || 0;
        this.playTime = data.playTime || 0;

            // 🆕 載入新增資料
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