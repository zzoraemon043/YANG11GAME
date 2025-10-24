



class AlchemySystem {
    constructor(game) {
        this.game = game;
        this.player = game.player;
        this.resourceManager = game.resourceManager;
    }
    
    
    
    
    
    
    getAlchemyLevel() {
        return this.player.cave.alchemyLevel;
    }
    
    
    upgradeAlchemy() {
        const currentLevel = this.getAlchemyLevel();
        const nextLevel = currentLevel + 1;
        
        if (nextLevel > 30) {
            this.game.showMessage('煉丹房已達最高等級！', 'warning');
            return false;
        }
        
        
        const cost = this.calculateUpgradeCost(nextLevel);
        
        
        if (!this.resourceManager.hasSpiritStone(cost)) {
            this.game.showMessage(`靈石不足！需要 ${formatNumber(cost)} 靈石`, 'error');
            return false;
        }
        
        
        this.resourceManager.consumeSpiritStone(cost, false);
        
        
        this.player.cave.alchemyLevel = nextLevel;
        
        this.game.showMessage(
            `煉丹房升級到 ${nextLevel} 級！`,
            'success'
        );
        
        console.log(`煉丹房升級：${currentLevel} → ${nextLevel}`);
        
        
        this.game.emit('alchemyUpgrade', {
            level: nextLevel
        });
        
        return true;
    }
    
    
    calculateUpgradeCost(level) {
        return Math.floor(200 * Math.pow(1.6, level - 1));
    }
    
    
    
    
    
    
    canAlchemy(recipeName) {
        
        if (!this.resourceManager.hasRecipe(recipeName)) {
            return { canAlchemy: false, reason: '尚未學會此丹方' };
        }
        
        
        const recipe = getRecipeData(recipeName);
        if (!recipe) {
            return { canAlchemy: false, reason: '丹方資料錯誤' };
        }
        
        
        if (this.getAlchemyLevel() < recipe.minLevel) {
            return { 
                canAlchemy: false, 
                reason: `需要煉丹房 ${recipe.minLevel} 級` 
            };
        }
        
        
        if (!this.resourceManager.hasHerbs(recipe.materials)) {
            return { canAlchemy: false, reason: '材料不足' };
        }
        
        
        if (!this.resourceManager.hasSpiritStone(recipe.spiritStone)) {
            return { 
                canAlchemy: false, 
                reason: `靈石不足（需要 ${formatNumber(recipe.spiritStone)}）` 
            };
        }
        
        
        if (this.player.cave.alchemyQueue.length >= 3) {
            return { canAlchemy: false, reason: '煉丹佇列已滿' };
        }
        
        return { canAlchemy: true };
    }
    
    
    startAlchemy(recipeName) {
        
        const check = this.canAlchemy(recipeName);
        if (!check.canAlchemy) {
            this.game.showMessage(check.reason, 'error');
            return false;
        }
        
        const recipe = getRecipeData(recipeName);
        
        
        if (!this.resourceManager.consumeHerbs(recipe.materials, false)) {
            this.game.showMessage('材料扣除失敗！', 'error');
            return false;
        }
        
        
        if (!this.resourceManager.consumeSpiritStone(recipe.spiritStone, false)) {
            this.game.showMessage('靈石扣除失敗！', 'error');
            return false;
        }
        
        
        const alchemyTask = {
            recipeName: recipeName,
            startTime: Date.now(),
            duration: recipe.alchemyTime
        };
        
        this.player.cave.alchemyQueue.push(alchemyTask);
        
        this.game.showMessage(
            `開始煉製《${recipeName}》`,
            'success'
        );
        
        console.log(`開始煉丹：${recipeName}，需時：${recipe.alchemyTime}秒`);
        
        
        this.game.emit('alchemyStart', {
            recipeName: recipeName,
            duration: recipe.alchemyTime
        });
        
        return true;
    }
    
    
    calculateSuccessRate(recipeName) {
        const recipe = getRecipeData(recipeName);
        if (!recipe) return 0;
        
        let successRate = recipe.baseSuccessRate;
        
        
        const levelBonus = this.getAlchemyLevel();
        successRate += levelBonus;
        
        
        if (this.game.techniqueSystem) {
            const techniqueBonus = this.game.techniqueSystem.hasSpecialEffect('alchemy_success');
            successRate += techniqueBonus;
        }
        
        
        const pill = getPillData(recipe.pillName);
        if (pill && pill.element && this.player.elements[pill.element]) {
            const elementBonus = Math.floor(this.player.elements[pill.element] / 10);
            successRate += elementBonus;
        }
        
        
        return Math.max(5, Math.min(95, successRate));
    }
    
    
    completeAlchemy(queueIndex) {
        if (queueIndex < 0 || queueIndex >= this.player.cave.alchemyQueue.length) {
            return false;
        }
        
        const task = this.player.cave.alchemyQueue[queueIndex];
        const recipe = getRecipeData(task.recipeName);
        
        if (!recipe) return false;
        
        
        const successRate = this.calculateSuccessRate(task.recipeName);
        
        
        const quality = determineAlchemyQuality(successRate);
        
        if (quality === null) {
            
            this.game.showMessage(
                `煉製《${task.recipeName}》失敗！`,
                'error'
            );
            
            console.log(`煉丹失敗：${task.recipeName}`);
            
            
            this.game.emit('alchemyFail', {
                recipeName: task.recipeName
            });
        } else {
            
            this.resourceManager.addPill(recipe.pillName, quality, 1, false);
            
            const qualityName = getPillQualityName(quality);
            this.game.showMessage(
                `煉製成功！獲得 ${qualityName}${recipe.pillName}`,
                'success'
            );
            
            console.log(`煉丹成功：${task.recipeName}，品質：${qualityName}`);
            
            
            this.game.emit('alchemySuccess', {
                recipeName: task.recipeName,
                pillName: recipe.pillName,
                quality: quality
            });
        }
        
        
        this.player.cave.alchemyQueue.splice(queueIndex, 1);
        
        return true;
    }
    
    
    
    
    
    
    checkAutoAlchemy() {
        
        if (!this.game.techniqueSystem) return;
        
        const autoAlchemyChance = this.game.techniqueSystem.hasSpecialEffect('auto_alchemy');
        if (autoAlchemyChance <= 0) return;
        
        
        if (this.player.cave.alchemyQueue.length < 3) {
            
            if (this.game.techniqueSystem.tryTriggerSpecialEffect('auto_alchemy')) {
                
                const recipes = this.resourceManager.getLearnedRecipes();
                
                for (let recipeName of recipes) {
                    const check = this.canAlchemy(recipeName);
                    if (check.canAlchemy) {
                        this.startAlchemy(recipeName);
                        console.log(`自動煉丹觸發：${recipeName}`);
                        break;
                    }
                }
            }
        }
    }
    
    
    
    
    
    
    update(deltaTime) {
        
        for (let i = this.player.cave.alchemyQueue.length - 1; i >= 0; i--) {
            const task = this.player.cave.alchemyQueue[i];
            const elapsed = (Date.now() - task.startTime) / 1000;
            
            if (elapsed >= task.duration) {
                
                this.completeAlchemy(i);
            }
        }
        
        
        this.checkAutoAlchemy();
    }
    
    
    
    
    
    
    getQueueStatus() {
        return this.player.cave.alchemyQueue.map((task, index) => {
            const elapsed = (Date.now() - task.startTime) / 1000;
            const progress = Math.min(100, (elapsed / task.duration) * 100);
            const remaining = Math.max(0, task.duration - elapsed);
            
            return {
                index: index,
                recipeName: task.recipeName,
                progress: progress,
                remainingTime: remaining,
                isComplete: elapsed >= task.duration
            };
        });
    }
    
    
    getAvailableRecipes() {
        const recipes = this.resourceManager.getLearnedRecipes();
        
        return recipes.map(recipeName => {
            const recipe = getRecipeData(recipeName);
            const check = this.canAlchemy(recipeName);
            const successRate = this.calculateSuccessRate(recipeName);
            
            return {
                recipeName: recipeName,
                recipe: recipe,
                canAlchemy: check.canAlchemy,
                reason: check.reason,
                successRate: successRate
            };
        });
    }
    
    
    getAlchemySystemInfo() {
        return {
            level: this.getAlchemyLevel(),
            upgradeCost: this.calculateUpgradeCost(this.getAlchemyLevel() + 1),
            queueCount: this.player.cave.alchemyQueue.length,
            maxQueue: 3,
            queue: this.getQueueStatus()
        };
    }
    
    
    
    
    
    
    debugInstantComplete() {
        console.log('=== 調試：所有煉丹立即完成 ===');
        
        let count = 0;
        for (let i = 0; i < this.player.cave.alchemyQueue.length; i++) {
            const task = this.player.cave.alchemyQueue[i];
            task.startTime = Date.now() - (task.duration * 1000); 
            count++;
        }
        
        this.game.showMessage(`${count} 個煉丹任務已完成`, 'success');
    }
    
    
    debugAlchemyAll() {
        console.log('=== 調試：煉製所有丹方 ===');
        
        const recipes = this.resourceManager.getLearnedRecipes();
        let count = 0;
        
        for (let recipeName of recipes) {
            if (this.player.cave.alchemyQueue.length >= 3) break;
            
            
            const recipe = getRecipeData(recipeName);
            if (recipe) {
                for (let herb in recipe.materials) {
                    this.resourceManager.addHerb(herb, recipe.materials[herb] * 2, false);
                }
                this.resourceManager.addSpiritStone(recipe.spiritStone * 2, false);
                
                if (this.startAlchemy(recipeName)) {
                    count++;
                }
            }
        }
        
        this.game.showMessage(`開始煉製 ${count} 種丹藥`, 'success');
    }
}