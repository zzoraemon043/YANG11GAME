// ====================================
// 洞府系統（礦脈 + 聚靈陣）
// ====================================

class CaveSystem {
    constructor(game) {
        this.game = game;
        this.player = game.player;
        this.resourceManager = game.resourceManager;
    }
    
    // ====================================
    // 礦脈系統
    // ====================================
    
    // 獲取礦脈等級
    getMineLevel() {
        return this.player.cave.mineLevel;
    }
    
    // 升級礦脈
    upgradeMine() {
        const currentLevel = this.getMineLevel();
        const nextLevel = currentLevel + 1;
        
        if (nextLevel > 30) {
            this.game.showMessage('礦脈已達最高等級！', 'warning');
            return false;
        }
        
        // 計算升級費用
        const cost = this.calculateMineUpgradeCost(nextLevel);
        
        // 檢查靈石
        if (!this.resourceManager.hasSpiritStone(cost)) {
            this.game.showMessage(`靈石不足！需要 ${formatNumber(cost)} 靈石`, 'error');
            return false;
        }
        
        // 扣除靈石
        this.resourceManager.consumeSpiritStone(cost, false);
        
        // 升級
        this.player.cave.mineLevel = nextLevel;
        
        this.game.showMessage(
            `礦脈升級到 ${nextLevel} 級！每小時產出 ${this.getMineProduction()}/小時`,
            'success'
        );
        
        console.log(`礦脈升級：${currentLevel} → ${nextLevel}`);
        
        // 觸發事件
        this.game.emit('mineUpgrade', {
            level: nextLevel,
            production: this.getMineProduction()
        });
        
        return true;
    }
    
    // 計算礦脈升級費用
    calculateMineUpgradeCost(level) {
        return Math.floor(500 * Math.pow(1.8, level - 1));
    }
    
    // 獲取礦脈每小時產量
    getMineProduction() {
        const level = this.getMineLevel();
        if (level === 0) return 0;
        
        // 基礎產量：等級 * 10
        let production = level * 10;
        
        // 聚靈陣加成
        const arrayBonus = this.getArrayBonus();
        production = Math.floor(production * (1 + arrayBonus / 100));
        
        return production;
    }
    
    // 計算累積的靈石
    calculateAccumulated() {
        if (this.getMineLevel() === 0) return 0;
        
        const now = Date.now();
        const lastCollect = this.player.cave.mineLastCollect;
        const elapsed = (now - lastCollect) / 1000; // 秒
        const hours = elapsed / 3600; // 小時
        
        const production = this.getMineProduction();
        const accumulated = Math.floor(production * hours);
        
        return accumulated;
    }
    
    // 收取礦脈靈石
    collectMine() {
        if (this.getMineLevel() === 0) {
            this.game.showMessage('尚未建造礦脈！', 'error');
            return false;
        }
        
        const accumulated = this.calculateAccumulated();
        
        if (accumulated === 0) {
            this.game.showMessage('尚無可收取的靈石', 'info');
            return false;
        }
        
        // 添加靈石
        this.resourceManager.addSpiritStone(accumulated, false);
        
        // 更新上次收取時間
        this.player.cave.mineLastCollect = Date.now();
        
        this.game.showMessage(
            `收取礦脈：獲得 ${formatNumber(accumulated)} 靈石`,
            'success'
        );
        
        console.log(`收取礦脈：${accumulated} 靈石`);
        
        // 觸發事件
        this.game.emit('mineCollect', {
            amount: accumulated
        });
        
        return true;
    }
    
    // 自動收取礦脈（如果有功法特殊效果）
    checkAutoCollect() {
        if (!this.game.techniqueSystem) return;
        
        const autoCollectChance = this.game.techniqueSystem.hasSpecialEffect('auto_collect');
        if (autoCollectChance <= 0) return;
        
        // 檢查是否有可收取的
        const accumulated = this.calculateAccumulated();
        if (accumulated > 0) {
            // 嘗試觸發自動收取
            if (this.game.techniqueSystem.tryTriggerSpecialEffect('auto_collect')) {
                this.collectMine();
                console.log(`自動收取礦脈觸發：${accumulated} 靈石`);
            }
        }
    }
    
    // ====================================
    // 聚靈陣系統
    // ====================================
    
    // 獲取聚靈陣等級
    getArrayLevel() {
        return this.player.cave.arrayLevel;
    }
    
    // 升級聚靈陣
    upgradeArray() {
        const currentLevel = this.getArrayLevel();
        const nextLevel = currentLevel + 1;
        
        if (nextLevel > 30) {
            this.game.showMessage('聚靈陣已達最高等級！', 'warning');
            return false;
        }
        
        // 計算升級費用
        const cost = this.calculateArrayUpgradeCost(nextLevel);
        
        // 檢查靈石
        if (!this.resourceManager.hasSpiritStone(cost)) {
            this.game.showMessage(`靈石不足！需要 ${formatNumber(cost)} 靈石`, 'error');
            return false;
        }
        
        // 扣除靈石
        this.resourceManager.consumeSpiritStone(cost, false);
        
        // 升級
        this.player.cave.arrayLevel = nextLevel;
        
        this.game.showMessage(
            `聚靈陣升級到 ${nextLevel} 級！修煉速度 +${this.getArrayBonus()}%`,
            'success'
        );
        
        console.log(`聚靈陣升級：${currentLevel} → ${nextLevel}`);
        
        // 觸發事件
        this.game.emit('arrayUpgrade', {
            level: nextLevel,
            bonus: this.getArrayBonus()
        });
        
        return true;
    }
    
    // 計算聚靈陣升級費用
    calculateArrayUpgradeCost(level) {
        return Math.floor(300 * Math.pow(1.7, level - 1));
    }
    
    // 獲取聚靈陣加成百分比
    getArrayBonus() {
        const level = this.getArrayLevel();
        if (level === 0) return 0;
        
        // 每級 +2% 加成
        return level * 2;
    }
    
    // ====================================
    // 藏經閣系統
    // ====================================
    
    // 獲取藏經閣等級
    getLibraryLevel() {
        return this.player.cave.libraryLevel;
    }
    
    // 升級藏經閣
    upgradeLibrary() {
        const currentLevel = this.getLibraryLevel();
        const nextLevel = currentLevel + 1;
        
        if (nextLevel > 30) {
            this.game.showMessage('藏經閣已達最高等級！', 'warning');
            return false;
        }
        
        // 計算升級費用
        const cost = this.calculateLibraryUpgradeCost(nextLevel);
        
        // 檢查靈石
        if (!this.resourceManager.hasSpiritStone(cost)) {
            this.game.showMessage(`靈石不足！需要 ${formatNumber(cost)} 靈石`, 'error');
            return false;
        }
        
        // 扣除靈石
        this.resourceManager.consumeSpiritStone(cost, false);
        
        // 升級
        this.player.cave.libraryLevel = nextLevel;
        
        // 增加功法容量
        this.updateTechniqueSlots();
        
        this.game.showMessage(
            `藏經閣升級到 ${nextLevel} 級！功法容量：${this.player.techniques.maxSlots}`,
            'success'
        );
        
        console.log(`藏經閣升級：${currentLevel} → ${nextLevel}`);
        
        // 觸發事件
        this.game.emit('libraryUpgrade', {
            level: nextLevel,
            maxSlots: this.player.techniques.maxSlots
        });
        
        return true;
    }
    
    // 計算藏經閣升級費用
    calculateLibraryUpgradeCost(level) {
        return Math.floor(150 * Math.pow(1.5, level - 1));
    }
    
    // 更新功法容量
    updateTechniqueSlots() {
        const level = this.getLibraryLevel();
        
        // 基礎容量 10，每 3 級 +1
        const bonus = Math.floor(level / 3);
        this.player.techniques.maxSlots = 10 + bonus;
    }
    
    // ====================================
    // 更新系統
    // ====================================
    
    // 每幀更新
    update(deltaTime) {
        // 檢查自動收取礦脈
        this.checkAutoCollect();
    }
    
    // ====================================
    // 查詢方法
    // ====================================
    
    // 獲取洞府總覽資訊
    getCaveOverview() {
        return {
            // 藏經閣
            library: {
                level: this.getLibraryLevel(),
                maxSlots: this.player.techniques.maxSlots,
                upgradeCost: this.calculateLibraryUpgradeCost(this.getLibraryLevel() + 1)
            },
            
            // 礦脈
            mine: {
                level: this.getMineLevel(),
                production: this.getMineProduction(),
                accumulated: this.calculateAccumulated(),
                upgradeCost: this.calculateMineUpgradeCost(this.getMineLevel() + 1)
            },
            
            // 聚靈陣
            array: {
                level: this.getArrayLevel(),
                bonus: this.getArrayBonus(),
                upgradeCost: this.calculateArrayUpgradeCost(this.getArrayLevel() + 1)
            },
            
            // 靈田
            farm: this.game.farmSystem ? this.game.farmSystem.getFarmSystemInfo() : null,
            
            // 煉丹房
            alchemy: this.game.alchemySystem ? this.game.alchemySystem.getAlchemySystemInfo() : null
        };
    }
    
    // ====================================
    // 調試方法
    // ====================================
    
    // 調試：全部設施升到10級
    debugUpgradeAll() {
        console.log('=== 調試：所有設施升級到10級 ===');
        
        this.player.cave.libraryLevel = 10;
        this.player.cave.mineLevel = 10;
        this.player.cave.arrayLevel = 10;
        this.player.cave.farmLevel = 10;
        this.player.cave.alchemyLevel = 10;
        
        this.updateTechniqueSlots();
        
        this.game.showMessage('所有設施已升級到10級', 'success');
        console.log('洞府總覽：', this.getCaveOverview());
    }
    
    // 調試：加速礦脈（立即產出24小時的靈石）
    debugAccelerateMine() {
        console.log('=== 調試：礦脈加速24小時 ===');
        
        if (this.getMineLevel() === 0) {
            this.player.cave.mineLevel = 10;
        }
        
        // 設為24小時前
        this.player.cave.mineLastCollect = Date.now() - (24 * 60 * 60 * 1000);
        
        const accumulated = this.calculateAccumulated();
        this.game.showMessage(`礦脈已累積 ${formatNumber(accumulated)} 靈石`, 'success');
    }
}