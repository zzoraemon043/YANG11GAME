// ====================================
// 煉丹系統
// ====================================

class AlchemySystem {
    constructor(game) {
        this.game = game;
        this.player = game.player;
        this.resourceManager = game.resourceManager;
    }
    
    // ====================================
    // 煉丹房管理
    // ====================================
    
    // 獲取煉丹房等級
    getAlchemyLevel() {
        return this.player.cave.alchemyLevel;
    }
    
    // 升級煉丹房
    upgradeAlchemy() {
        const currentLevel = this.getAlchemyLevel();
        const nextLevel = currentLevel + 1;
        
        if (nextLevel > 30) {
            this.game.showMessage('煉丹房已達最高等級！', 'warning');
            return false;
        }
        
        // 計算升級費用
        const cost = this.calculateUpgradeCost(nextLevel);
        
        // 檢查靈石
        if (!this.resourceManager.hasSpiritStone(cost)) {
            this.game.showMessage(`靈石不足！需要 ${formatNumber(cost)} 靈石`, 'error');
            return false;
        }
        
        // 扣除靈石
        this.resourceManager.consumeSpiritStone(cost, false);
        
        // 升級
        this.player.cave.alchemyLevel = nextLevel;
        
        this.game.showMessage(
            `煉丹房升級到 ${nextLevel} 級！`,
            'success'
        );
        
        console.log(`煉丹房升級：${currentLevel} → ${nextLevel}`);
        
        // 觸發事件
        this.game.emit('alchemyUpgrade', {
            level: nextLevel
        });
        
        return true;
    }
    
    // 計算升級費用
    calculateUpgradeCost(level) {
        return Math.floor(200 * Math.pow(1.6, level - 1));
    }
    
    // ====================================
    // 煉丹系統
    // ====================================
    
    // 檢查是否可以煉製
    canAlchemy(recipeName) {
        // 檢查是否擁有丹方
        if (!this.resourceManager.hasRecipe(recipeName)) {
            return { canAlchemy: false, reason: '尚未學會此丹方' };
        }
        
        // 檢查丹方資料
        const recipe = getRecipeData(recipeName);
        if (!recipe) {
            return { canAlchemy: false, reason: '丹方資料錯誤' };
        }
        
        // 檢查煉丹房等級
        if (this.getAlchemyLevel() < recipe.minLevel) {
            return { 
                canAlchemy: false, 
                reason: `需要煉丹房 ${recipe.minLevel} 級` 
            };
        }
        
        // 檢查材料
        if (!this.resourceManager.hasHerbs(recipe.materials)) {
            return { canAlchemy: false, reason: '材料不足' };
        }
        
        // 檢查靈石
        if (!this.resourceManager.hasSpiritStone(recipe.spiritStone)) {
            return { 
                canAlchemy: false, 
                reason: `靈石不足（需要 ${formatNumber(recipe.spiritStone)}）` 
            };
        }
        
        // 檢查煉丹佇列是否已滿（最多3個）
        if (this.player.cave.alchemyQueue.length >= 3) {
            return { canAlchemy: false, reason: '煉丹佇列已滿' };
        }
        
        return { canAlchemy: true };
    }
    
    // 開始煉丹
    startAlchemy(recipeName) {
        // 檢查是否可以煉製
        const check = this.canAlchemy(recipeName);
        if (!check.canAlchemy) {
            this.game.showMessage(check.reason, 'error');
            return false;
        }
        
        const recipe = getRecipeData(recipeName);
        
        // 扣除材料
        if (!this.resourceManager.consumeHerbs(recipe.materials, false)) {
            this.game.showMessage('材料扣除失敗！', 'error');
            return false;
        }
        
        // 扣除靈石
        if (!this.resourceManager.consumeSpiritStone(recipe.spiritStone, false)) {
            this.game.showMessage('靈石扣除失敗！', 'error');
            return false;
        }
        
        // 加入煉丹佇列
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
        
        // 觸發事件
        this.game.emit('alchemyStart', {
            recipeName: recipeName,
            duration: recipe.alchemyTime
        });
        
        return true;
    }
    
    // 計算煉丹成功率
    calculateSuccessRate(recipeName) {
        const recipe = getRecipeData(recipeName);
        if (!recipe) return 0;
        
        let successRate = recipe.baseSuccessRate;
        
        // 煉丹房等級加成（每級 +1%）
        const levelBonus = this.getAlchemyLevel();
        successRate += levelBonus;
        
        // 功法加成（煉丹成功率）
        if (this.game.techniqueSystem) {
            const techniqueBonus = this.game.techniqueSystem.hasSpecialEffect('alchemy_success');
            successRate += techniqueBonus;
        }
        
        // 五行相性加成（丹藥屬性與玩家五行匹配）
        const pill = getPillData(recipe.pillName);
        if (pill && pill.element && this.player.elements[pill.element]) {
            const elementBonus = Math.floor(this.player.elements[pill.element] / 10);
            successRate += elementBonus;
        }
        
        // 限制在 5-95% 之間
        return Math.max(5, Math.min(95, successRate));
    }
    
    // 完成煉丹
    completeAlchemy(queueIndex) {
        if (queueIndex < 0 || queueIndex >= this.player.cave.alchemyQueue.length) {
            return false;
        }
        
        const task = this.player.cave.alchemyQueue[queueIndex];
        const recipe = getRecipeData(task.recipeName);
        
        if (!recipe) return false;
        
        // 計算成功率
        const successRate = this.calculateSuccessRate(task.recipeName);
        
        // 判定品質
        const quality = determineAlchemyQuality(successRate);
        
        if (quality === null) {
            // 煉丹失敗
            this.game.showMessage(
                `煉製《${task.recipeName}》失敗！`,
                'error'
            );
            
            console.log(`煉丹失敗：${task.recipeName}`);
            
            // 觸發事件
            this.game.emit('alchemyFail', {
                recipeName: task.recipeName
            });
        } else {
            // 煉丹成功
            this.resourceManager.addPill(recipe.pillName, quality, 1, false);
            
            const qualityName = getPillQualityName(quality);
            this.game.showMessage(
                `煉製成功！獲得 ${qualityName}${recipe.pillName}`,
                'success'
            );
            
            console.log(`煉丹成功：${task.recipeName}，品質：${qualityName}`);
            
            // 觸發事件
            this.game.emit('alchemySuccess', {
                recipeName: task.recipeName,
                pillName: recipe.pillName,
                quality: quality
            });
        }
        
        // 移除佇列
        this.player.cave.alchemyQueue.splice(queueIndex, 1);
        
        return true;
    }
    
    // ====================================
    // 自動系統
    // ====================================
    
    // 檢查並自動煉丹（如果有功法特殊效果）
    checkAutoAlchemy() {
        // 檢查是否有自動煉丹效果
        if (!this.game.techniqueSystem) return;
        
        const autoAlchemyChance = this.game.techniqueSystem.hasSpecialEffect('auto_alchemy');
        if (autoAlchemyChance <= 0) return;
        
        // 如果佇列未滿且有可煉製的丹藥
        if (this.player.cave.alchemyQueue.length < 3) {
            // 嘗試觸發自動煉丹
            if (this.game.techniqueSystem.tryTriggerSpecialEffect('auto_alchemy')) {
                // 找到第一個可以煉製的丹方
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
    
    // ====================================
    // 更新系統
    // ====================================
    
    // 每幀更新
    update(deltaTime) {
        // 檢查煉丹佇列
        for (let i = this.player.cave.alchemyQueue.length - 1; i >= 0; i--) {
            const task = this.player.cave.alchemyQueue[i];
            const elapsed = (Date.now() - task.startTime) / 1000;
            
            if (elapsed >= task.duration) {
                // 煉丹完成
                this.completeAlchemy(i);
            }
        }
        
        // 檢查自動煉丹
        this.checkAutoAlchemy();
    }
    
    // ====================================
    // 查詢方法
    // ====================================
    
    // 獲取煉丹佇列狀態
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
    
    // 獲取可煉製的丹方列表
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
    
    // 獲取煉丹系統資訊
    getAlchemySystemInfo() {
        return {
            level: this.getAlchemyLevel(),
            upgradeCost: this.calculateUpgradeCost(this.getAlchemyLevel() + 1),
            queueCount: this.player.cave.alchemyQueue.length,
            maxQueue: 3,
            queue: this.getQueueStatus()
        };
    }
    
    // ====================================
    // 調試方法
    // ====================================
    
    // 調試：快速煉製（立即完成）
    debugInstantComplete() {
        console.log('=== 調試：所有煉丹立即完成 ===');
        
        let count = 0;
        for (let i = 0; i < this.player.cave.alchemyQueue.length; i++) {
            const task = this.player.cave.alchemyQueue[i];
            task.startTime = Date.now() - (task.duration * 1000); // 設為已完成
            count++;
        }
        
        this.game.showMessage(`${count} 個煉丹任務已完成`, 'success');
    }
    
    // 調試：煉製所有已學會的丹方
    debugAlchemyAll() {
        console.log('=== 調試：煉製所有丹方 ===');
        
        const recipes = this.resourceManager.getLearnedRecipes();
        let count = 0;
        
        for (let recipeName of recipes) {
            if (this.player.cave.alchemyQueue.length >= 3) break;
            
            // 添加足夠的材料
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