



class CaveSystem {
    constructor(game) {
        this.game = game;
        this.player = game.player;
        this.resourceManager = game.resourceManager;
    }
    
    
    
    
    
    
    getMineLevel() {
        return this.player.cave.mineLevel;
    }
    
    
    upgradeMine() {
        const currentLevel = this.getMineLevel();
        const nextLevel = currentLevel + 1;
        
        if (nextLevel > 30) {
            this.game.showMessage('礦脈已達最高等級！', 'warning');
            return false;
        }
        
        
        const cost = this.calculateMineUpgradeCost(nextLevel);
        
        
        if (!this.resourceManager.hasSpiritStone(cost)) {
            this.game.showMessage(`靈石不足！需要 ${formatNumber(cost)} 靈石`, 'error');
            return false;
        }
        
        
        this.resourceManager.consumeSpiritStone(cost, false);
        
        
        this.player.cave.mineLevel = nextLevel;
        
        this.game.showMessage(
            `礦脈升級到 ${nextLevel} 級！每小時產出 ${this.getMineProduction()}/小時`,
            'success'
        );
        
        console.log(`礦脈升級：${currentLevel} → ${nextLevel}`);
        
        
        this.game.emit('mineUpgrade', {
            level: nextLevel,
            production: this.getMineProduction()
        });
        
        return true;
    }
    
    
    calculateMineUpgradeCost(level) {
        return Math.floor(500 * Math.pow(1.8, level - 1));
    }
    
    
    getMineProduction() {
        const level = this.getMineLevel();
        if (level === 0) return 0;
        
        
        let production = level * 10;
        
        
        const arrayBonus = this.getArrayBonus();
        production = Math.floor(production * (1 + arrayBonus / 100));
        
        return production;
    }
    
    
    calculateAccumulated() {
        if (this.getMineLevel() === 0) return 0;
        
        const now = Date.now();
        const lastCollect = this.player.cave.mineLastCollect;
        const elapsed = (now - lastCollect) / 1000; 
        const hours = elapsed / 3600; 
        
        const production = this.getMineProduction();
        const accumulated = Math.floor(production * hours);
        
        return accumulated;
    }
    
    
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
        
        
        this.resourceManager.addSpiritStone(accumulated, false);
        
        
        this.player.cave.mineLastCollect = Date.now();
        
        this.game.showMessage(
            `收取礦脈：獲得 ${formatNumber(accumulated)} 靈石`,
            'success'
        );
        
        console.log(`收取礦脈：${accumulated} 靈石`);
        
        
        this.game.emit('mineCollect', {
            amount: accumulated
        });
        
        return true;
    }
    
    
    checkAutoCollect() {
        if (!this.game.techniqueSystem) return;
        
        const autoCollectChance = this.game.techniqueSystem.hasSpecialEffect('auto_collect');
        if (autoCollectChance <= 0) return;
        
        
        const accumulated = this.calculateAccumulated();
        if (accumulated > 0) {
            
            if (this.game.techniqueSystem.tryTriggerSpecialEffect('auto_collect')) {
                this.collectMine();
                console.log(`自動收取礦脈觸發：${accumulated} 靈石`);
            }
        }
    }
    
    
    
    
    
    
    getArrayLevel() {
        return this.player.cave.arrayLevel;
    }
    
    
    upgradeArray() {
        const currentLevel = this.getArrayLevel();
        const nextLevel = currentLevel + 1;
        
        if (nextLevel > 30) {
            this.game.showMessage('聚靈陣已達最高等級！', 'warning');
            return false;
        }
        
        
        const cost = this.calculateArrayUpgradeCost(nextLevel);
        
        
        if (!this.resourceManager.hasSpiritStone(cost)) {
            this.game.showMessage(`靈石不足！需要 ${formatNumber(cost)} 靈石`, 'error');
            return false;
        }
        
        
        this.resourceManager.consumeSpiritStone(cost, false);
        
        
        this.player.cave.arrayLevel = nextLevel;
        
        this.game.showMessage(
            `聚靈陣升級到 ${nextLevel} 級！修煉速度 +${this.getArrayBonus()}%`,
            'success'
        );
        
        console.log(`聚靈陣升級：${currentLevel} → ${nextLevel}`);
        
        
        this.game.emit('arrayUpgrade', {
            level: nextLevel,
            bonus: this.getArrayBonus()
        });
        
        return true;
    }
    
    
    calculateArrayUpgradeCost(level) {
        return Math.floor(300 * Math.pow(1.7, level - 1));
    }
    
    
    getArrayBonus() {
        const level = this.getArrayLevel();
        if (level === 0) return 0;
        
        
        return level * 2;
    }
    
    
    
    
    
    
    getLibraryLevel() {
        return this.player.cave.libraryLevel;
    }
    
    
    upgradeLibrary() {
        const currentLevel = this.getLibraryLevel();
        const nextLevel = currentLevel + 1;
        
        if (nextLevel > 30) {
            this.game.showMessage('藏經閣已達最高等級！', 'warning');
            return false;
        }
        
        
        const cost = this.calculateLibraryUpgradeCost(nextLevel);
        
        
        if (!this.resourceManager.hasSpiritStone(cost)) {
            this.game.showMessage(`靈石不足！需要 ${formatNumber(cost)} 靈石`, 'error');
            return false;
        }
        
        
        this.resourceManager.consumeSpiritStone(cost, false);
        
        
        this.player.cave.libraryLevel = nextLevel;
        
        
        this.updateTechniqueSlots();
        
        this.game.showMessage(
            `藏經閣升級到 ${nextLevel} 級！功法容量：${this.player.techniques.maxSlots}`,
            'success'
        );
        
        console.log(`藏經閣升級：${currentLevel} → ${nextLevel}`);
        
        
        this.game.emit('libraryUpgrade', {
            level: nextLevel,
            maxSlots: this.player.techniques.maxSlots
        });
        
        return true;
    }
    
    
    calculateLibraryUpgradeCost(level) {
        return Math.floor(150 * Math.pow(1.5, level - 1));
    }
    
    
    updateTechniqueSlots() {
        const level = this.getLibraryLevel();
        
        
        const bonus = Math.floor(level / 3);
        this.player.techniques.maxSlots = 10 + bonus;
    }
    
    
    
    
    
    
    update(deltaTime) {
        
        this.checkAutoCollect();
    }
    
    
    
    
    
    
    getCaveOverview() {
        return {
            
            library: {
                level: this.getLibraryLevel(),
                maxSlots: this.player.techniques.maxSlots,
                upgradeCost: this.calculateLibraryUpgradeCost(this.getLibraryLevel() + 1)
            },
            
            
            mine: {
                level: this.getMineLevel(),
                production: this.getMineProduction(),
                accumulated: this.calculateAccumulated(),
                upgradeCost: this.calculateMineUpgradeCost(this.getMineLevel() + 1)
            },
            
            
            array: {
                level: this.getArrayLevel(),
                bonus: this.getArrayBonus(),
                upgradeCost: this.calculateArrayUpgradeCost(this.getArrayLevel() + 1)
            },
            
            
            farm: this.game.farmSystem ? this.game.farmSystem.getFarmSystemInfo() : null,
            
            
            alchemy: this.game.alchemySystem ? this.game.alchemySystem.getAlchemySystemInfo() : null
        };
    }
    
    
    
    
    
    
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
    
    
    debugAccelerateMine() {
        console.log('=== 調試：礦脈加速24小時 ===');
        
        if (this.getMineLevel() === 0) {
            this.player.cave.mineLevel = 10;
        }
        
        
        this.player.cave.mineLastCollect = Date.now() - (24 * 60 * 60 * 1000);
        
        const accumulated = this.calculateAccumulated();
        this.game.showMessage(`礦脈已累積 ${formatNumber(accumulated)} 靈石`, 'success');
    }
}