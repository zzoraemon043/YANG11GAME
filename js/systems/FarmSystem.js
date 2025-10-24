



class FarmSystem {
    constructor(game) {
        this.game = game;
        this.player = game.player;
        this.resourceManager = game.resourceManager;
    }
    
    
    
    
    
    
    getFarmLevel() {
        return this.player.cave.farmLevel;
    }
    
    
    getUnlockedFarmCount() {
        return this.player.cave.farms.filter(farm => farm.unlocked).length;
    }
    
    
    getMaxFarmCount() {
        const level = this.getFarmLevel();
        
        
        if (level >= 15) return 5;
        if (level >= 10) return 4;
        if (level >= 6) return 3;
        if (level >= 3) return 2;
        return 1;
    }
    
    
    upgradeFarm() {
        const currentLevel = this.getFarmLevel();
        const nextLevel = currentLevel + 1;
        
        if (nextLevel > 30) {
            this.game.showMessage('靈田已達最高等級！', 'warning');
            return false;
        }
        
        
        const cost = this.calculateUpgradeCost(nextLevel);
        
        
        if (!this.resourceManager.hasSpiritStone(cost)) {
            this.game.showMessage(`靈石不足！需要 ${formatNumber(cost)} 靈石`, 'error');
            return false;
        }
        
        
        this.resourceManager.consumeSpiritStone(cost, false);
        
        
        this.player.cave.farmLevel = nextLevel;
        
        
        const maxFarms = this.getMaxFarmCount();
        for (let i = 0; i < maxFarms && i < this.player.cave.farms.length; i++) {
            this.player.cave.farms[i].unlocked = true;
        }
        
        this.game.showMessage(
            `靈田升級到 ${nextLevel} 級！`,
            'success'
        );
        
        console.log(`靈田升級：${currentLevel} → ${nextLevel}`);
        
        
        this.game.emit('farmUpgrade', {
            level: nextLevel,
            unlockedFarms: this.getUnlockedFarmCount()
        });
        
        return true;
    }
    
    
    calculateUpgradeCost(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }
    
    
    
    
    
    
    plantSeed(farmIndex, seedType) {
        
        if (farmIndex < 0 || farmIndex >= this.player.cave.farms.length) {
            this.game.showMessage('無效的靈田！', 'error');
            return false;
        }
        
        const farm = this.player.cave.farms[farmIndex];
        
        
        if (!farm.unlocked) {
            this.game.showMessage('此靈田尚未解鎖！', 'error');
            return false;
        }
        
        
        if (farm.planting) {
            this.game.showMessage('此靈田已有作物！', 'warning');
            return false;
        }
        
        
        const seedData = getSeedData(seedType);
        if (!seedData) {
            this.game.showMessage('未知的種子類型！', 'error');
            return false;
        }
        
        
        if (!this.resourceManager.hasSeed(seedType, 1)) {
            this.game.showMessage(`${seedData.name}不足！`, 'error');
            return false;
        }
        
        
        this.resourceManager.consumeSeed(seedType, 1, false);
        
        
        farm.planting = seedType;
        farm.startTime = Date.now();
        
        this.game.showMessage(
            `在靈田 ${farmIndex + 1} 種植了 ${seedData.name}`,
            'success'
        );
        
        console.log(`種植：靈田${farmIndex + 1}，種子：${seedType}`);
        
        
        this.game.emit('seedPlant', {
            farmIndex: farmIndex,
            seedType: seedType,
            growTime: seedData.growTime
        });
        
        return true;
    }
    
    
    canHarvest(farmIndex) {
        if (farmIndex < 0 || farmIndex >= this.player.cave.farms.length) {
            return false;
        }
        
        const farm = this.player.cave.farms[farmIndex];
        
        
        if (!farm.planting) return false;
        
        
        const seedData = getSeedData(farm.planting);
        if (!seedData) return false;
        
        const elapsed = (Date.now() - farm.startTime) / 1000; 
        return elapsed >= seedData.growTime;
    }
    
    
    getGrowthProgress(farmIndex) {
        if (farmIndex < 0 || farmIndex >= this.player.cave.farms.length) {
            return 0;
        }
        
        const farm = this.player.cave.farms[farmIndex];
        if (!farm.planting) return 0;
        
        const seedData = getSeedData(farm.planting);
        if (!seedData) return 0;
        
        const elapsed = (Date.now() - farm.startTime) / 1000;
        const progress = (elapsed / seedData.growTime) * 100;
        
        return Math.min(100, progress);
    }
    
    
    getRemainingTime(farmIndex) {
        if (farmIndex < 0 || farmIndex >= this.player.cave.farms.length) {
            return 0;
        }
        
        const farm = this.player.cave.farms[farmIndex];
        if (!farm.planting) return 0;
        
        const seedData = getSeedData(farm.planting);
        if (!seedData) return 0;
        
        const elapsed = (Date.now() - farm.startTime) / 1000;
        const remaining = Math.max(0, seedData.growTime - elapsed);
        
        return remaining;
    }
    
    
    harvest(farmIndex) {
        
        if (!this.canHarvest(farmIndex)) {
            this.game.showMessage('作物尚未成熟！', 'warning');
            return false;
        }
        
        const farm = this.player.cave.farms[farmIndex];
        const seedType = farm.planting;
        
        
        const harvest = generateHerbHarvest(seedType);
        
        if (harvest.length === 0) {
            this.game.showMessage('收穫失敗！', 'error');
            return false;
        }
        
        
        const herbCounts = {};
        harvest.forEach(herbName => {
            herbCounts[herbName] = (herbCounts[herbName] || 0) + 1;
        });
        
        for (let herbName in herbCounts) {
            this.resourceManager.addHerb(herbName, herbCounts[herbName], false);
        }
        
        
        farm.planting = null;
        farm.startTime = 0;
        
        
        const herbList = Object.keys(herbCounts)
            .map(name => `${name} x${herbCounts[name]}`)
            .join('、');
        
        this.game.showMessage(
            `收穫：${herbList}`,
            'success'
        );
        
        console.log(`收穫：靈田${farmIndex + 1}，獲得：`, herbCounts);
        
        
        this.game.emit('farmHarvest', {
            farmIndex: farmIndex,
            seedType: seedType,
            harvest: herbCounts
        });
        
        return true;
    }
    
    
    
    
    
    
    checkAutoHarvest() {
        
        if (!this.game.techniqueSystem) return;
        
        const autoHarvestChance = this.game.techniqueSystem.hasSpecialEffect('auto_harvest');
        if (autoHarvestChance <= 0) return;
        
        
        for (let i = 0; i < this.player.cave.farms.length; i++) {
            if (this.canHarvest(i)) {
                
                if (this.game.techniqueSystem.tryTriggerSpecialEffect('auto_harvest')) {
                    this.harvest(i);
                    console.log(`自動收穫觸發：靈田${i + 1}`);
                }
            }
        }
    }
    
    
    harvestAll() {
        let harvested = 0;
        
        for (let i = 0; i < this.player.cave.farms.length; i++) {
            if (this.canHarvest(i)) {
                if (this.harvest(i)) {
                    harvested++;
                }
            }
        }
        
        if (harvested > 0) {
            this.game.showMessage(`收穫了 ${harvested} 塊靈田`, 'success');
        } else {
            this.game.showMessage('沒有可收穫的作物', 'info');
        }
        
        return harvested;
    }
    
    
    
    
    
    
    update(deltaTime) {
        
        this.checkAutoHarvest();
    }
    
    
    
    
    
    
    getAllFarmsStatus() {
        return this.player.cave.farms.map((farm, index) => {
            return {
                index: index,
                unlocked: farm.unlocked,
                planting: farm.planting,
                progress: this.getGrowthProgress(index),
                remainingTime: this.getRemainingTime(index),
                canHarvest: this.canHarvest(index)
            };
        });
    }
    
    
    getFarmSystemInfo() {
        return {
            level: this.getFarmLevel(),
            unlockedCount: this.getUnlockedFarmCount(),
            maxCount: this.getMaxFarmCount(),
            upgradeCost: this.calculateUpgradeCost(this.getFarmLevel() + 1),
            farms: this.getAllFarmsStatus()
        };
    }
    
    
    
    
    
    
    debugPlantAll() {
        console.log('=== 調試：所有靈田種植黃階種子 ===');
        
        
        this.resourceManager.addSeed('huang', 10, false);
        
        let planted = 0;
        for (let i = 0; i < this.player.cave.farms.length; i++) {
            if (this.player.cave.farms[i].unlocked && !this.player.cave.farms[i].planting) {
                if (this.plantSeed(i, 'huang')) {
                    planted++;
                }
            }
        }
        
        this.game.showMessage(`種植了 ${planted} 塊靈田`, 'success');
    }
    
    
    debugInstantGrow() {
        console.log('=== 調試：所有作物立即成熟 ===');
        
        let count = 0;
        for (let i = 0; i < this.player.cave.farms.length; i++) {
            const farm = this.player.cave.farms[i];
            if (farm.planting) {
                farm.startTime = Date.now() - (60 * 60 * 1000); 
                count++;
            }
        }
        
        this.game.showMessage(`${count} 個作物已成熟`, 'success');
    }
}