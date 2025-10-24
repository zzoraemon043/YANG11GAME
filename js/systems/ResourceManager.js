// ====================================
// 資源管理系統
// ====================================

class ResourceManager {
    constructor(game) {
        this.game = game;
        this.player = game.player;
    }
    
    // ====================================
    // 靈石管理
    // ====================================
    
    // 獲取靈石數量
    getSpiritStone() {
        return this.player.resources.spiritStone;
    }
    
    // 增加靈石
    addSpiritStone(amount, showMessage = true) {
        this.player.resources.spiritStone += amount;
        
        if (showMessage) {
            this.game.showMessage(`獲得 ${formatNumber(amount)} 靈石`, 'success');
        }
        
        console.log(`靈石 +${amount}，當前：${this.player.resources.spiritStone}`);
        
        // 觸發事件
        this.game.emit('spiritStoneChange', {
            amount: amount,
            total: this.player.resources.spiritStone
        });
        
        return true;
    }
    
    // 扣除靈石
    consumeSpiritStone(amount, showMessage = true) {
        if (this.player.resources.spiritStone < amount) {
            if (showMessage) {
                this.game.showMessage('靈石不足！', 'error');
            }
            return false;
        }
        
        this.player.resources.spiritStone -= amount;
        
        if (showMessage) {
            this.game.showMessage(`消耗 ${formatNumber(amount)} 靈石`, 'info');
        }
        
        console.log(`靈石 -${amount}，當前：${this.player.resources.spiritStone}`);
        
        // 觸發事件
        this.game.emit('spiritStoneChange', {
            amount: -amount,
            total: this.player.resources.spiritStone
        });
        
        return true;
    }
    
    // 檢查靈石是否足夠
    hasSpiritStone(amount) {
        return this.player.resources.spiritStone >= amount;
    }
    
    // ====================================
    // 種子管理
    // ====================================
    
    // 獲取種子數量
    getSeedCount(seedType) {
        return this.player.resources.seeds[seedType] || 0;
    }
    
    // 增加種子
    addSeed(seedType, amount, showMessage = true) {
        if (!this.player.resources.seeds[seedType]) {
            this.player.resources.seeds[seedType] = 0;
        }
        
        this.player.resources.seeds[seedType] += amount;
        
        if (showMessage) {
            const seedData = getSeedData(seedType);
            const seedName = seedData ? seedData.name : seedType;
            this.game.showMessage(`獲得 ${seedName} x${amount}`, 'success');
        }
        
        console.log(`種子 ${seedType} +${amount}`);
        
        return true;
    }
    
    // 扣除種子
    consumeSeed(seedType, amount = 1, showMessage = true) {
        const current = this.getSeedCount(seedType);
        
        if (current < amount) {
            if (showMessage) {
                this.game.showMessage('種子不足！', 'error');
            }
            return false;
        }
        
        this.player.resources.seeds[seedType] -= amount;
        
        console.log(`種子 ${seedType} -${amount}`);
        
        return true;
    }
    
    // 檢查種子是否足夠
    hasSeed(seedType, amount = 1) {
        return this.getSeedCount(seedType) >= amount;
    }
    
    // ====================================
    // 靈草管理
    // ====================================
    
    // 獲取靈草數量
    getHerbCount(herbName) {
        return this.player.resources.herbs[herbName] || 0;
    }
    
    // 增加靈草
    addHerb(herbName, amount, showMessage = true) {
        if (!this.player.resources.herbs[herbName]) {
            this.player.resources.herbs[herbName] = 0;
        }
        
        this.player.resources.herbs[herbName] += amount;
        
        if (showMessage) {
            this.game.showMessage(`獲得 ${herbName} x${amount}`, 'success');
        }
        
        console.log(`靈草 ${herbName} +${amount}`);
        
        // 觸發事件
        this.game.emit('herbChange', {
            herbName: herbName,
            amount: amount,
            total: this.player.resources.herbs[herbName]
        });
        
        return true;
    }
    
    // 扣除靈草
    consumeHerb(herbName, amount, showMessage = true) {
        const current = this.getHerbCount(herbName);
        
        if (current < amount) {
            if (showMessage) {
                this.game.showMessage(`${herbName} 不足！`, 'error');
            }
            return false;
        }
        
        this.player.resources.herbs[herbName] -= amount;
        
        console.log(`靈草 ${herbName} -${amount}`);
        
        // 觸發事件
        this.game.emit('herbChange', {
            herbName: herbName,
            amount: -amount,
            total: this.player.resources.herbs[herbName]
        });
        
        return true;
    }
    
    // 檢查靈草是否足夠
    hasHerb(herbName, amount) {
        return this.getHerbCount(herbName) >= amount;
    }
    
    // 檢查多種靈草是否足夠（用於煉丹）
    hasHerbs(materials) {
        for (let herbName in materials) {
            const required = materials[herbName];
            if (!this.hasHerb(herbName, required)) {
                return false;
            }
        }
        return true;
    }
    
    // 扣除多種靈草（用於煉丹）
    consumeHerbs(materials, showMessage = true) {
        // 先檢查是否全部足夠
        if (!this.hasHerbs(materials)) {
            if (showMessage) {
                this.game.showMessage('材料不足！', 'error');
            }
            return false;
        }
        
        // 全部扣除
        for (let herbName in materials) {
            const amount = materials[herbName];
            this.consumeHerb(herbName, amount, false);
        }
        
        if (showMessage) {
            this.game.showMessage('材料已消耗', 'info');
        }
        
        return true;
    }
    
    // 出售靈草換取靈石
    sellHerb(herbName, amount) {
        const herbData = getHerbData(herbName);
        if (!herbData) {
            this.game.showMessage('未知的靈草！', 'error');
            return false;
        }
        
        if (!this.hasHerb(herbName, amount)) {
            this.game.showMessage('靈草數量不足！', 'error');
            return false;
        }
        
        // 扣除靈草
        this.consumeHerb(herbName, amount, false);
        
        // 獲得靈石
        const totalPrice = herbData.sellPrice * amount;
        this.addSpiritStone(totalPrice, false);
        
        this.game.showMessage(
            `出售 ${herbName} x${amount}，獲得 ${formatNumber(totalPrice)} 靈石`,
            'success'
        );
        
        return true;
    }
    
    // ====================================
    // 丹藥管理
    // ====================================
    
    // 獲取丹藥數量
    getPillCount(pillName, quality = null) {
        if (quality === null) {
            // 獲取所有品質的總數
            let total = 0;
            for (let q in PILL_QUALITY) {
                const key = `${pillName}_${PILL_QUALITY[q]}`;
                total += this.player.resources.pills[key] || 0;
            }
            return total;
        } else {
            // 獲取特定品質的數量
            const key = `${pillName}_${quality}`;
            return this.player.resources.pills[key] || 0;
        }
    }
    
    // 增加丹藥
    addPill(pillName, quality, amount = 1, showMessage = true) {
        const key = `${pillName}_${quality}`;
        
        if (!this.player.resources.pills[key]) {
            this.player.resources.pills[key] = 0;
        }
        
        this.player.resources.pills[key] += amount;
        
        if (showMessage) {
            const qualityName = getPillQualityName(quality);
            this.game.showMessage(
                `獲得 ${qualityName}${pillName} x${amount}`,
                'success'
            );
        }
        
        console.log(`丹藥 ${key} +${amount}`);
        
        // 觸發事件
        this.game.emit('pillChange', {
            pillName: pillName,
            quality: quality,
            amount: amount,
            total: this.player.resources.pills[key]
        });
        
        return true;
    }
    
    // 扣除丹藥
    consumePill(pillName, quality, amount = 1, showMessage = true) {
        const key = `${pillName}_${quality}`;
        const current = this.player.resources.pills[key] || 0;
        
        if (current < amount) {
            if (showMessage) {
                const qualityName = getPillQualityName(quality);
                this.game.showMessage(`${qualityName}${pillName} 不足！`, 'error');
            }
            return false;
        }
        
        this.player.resources.pills[key] -= amount;
        
        console.log(`丹藥 ${key} -${amount}`);
        
        // 觸發事件
        this.game.emit('pillChange', {
            pillName: pillName,
            quality: quality,
            amount: -amount,
            total: this.player.resources.pills[key]
        });
        
        return true;
    }
    
    // 檢查丹藥是否足夠
    hasPill(pillName, quality, amount = 1) {
        return this.getPillCount(pillName, quality) >= amount;
    }
    
    // 使用丹藥
    usePill(pillName, quality) {
        // 檢查是否擁有
        if (!this.hasPill(pillName, quality, 1)) {
            this.game.showMessage('丹藥不足！', 'error');
            return false;
        }
        
        // 扣除丹藥
        this.consumePill(pillName, quality, 1, false);
        
        // 獲取丹藥效果
        const effect = calculatePillEffect(pillName, quality);
        if (!effect) {
            this.game.showMessage('丹藥無效！', 'error');
            return false;
        }
        
        // 應用效果
        this.applyPillEffect(pillName, effect);
        
        const qualityName = getPillQualityName(quality);
        this.game.showMessage(`使用 ${qualityName}${pillName}`, 'success');
        
        return true;
    }
    
    // 應用丹藥效果
    applyPillEffect(pillName, effect) {
        switch (effect.type) {
            case 'instant_cultivation':
                // 立即增加修為
                this.player.addCultivation(effect.value);
                this.game.showMessage(
                    `獲得 ${formatNumber(effect.value)} 修為！`,
                    'success'
                );
                break;
                
            case 'reduce_cooldown':
                // 減少冷卻時間
                this.player.breakthroughCooldown = Math.max(
                    0,
                    this.player.breakthroughCooldown - effect.value
                );
                this.game.showMessage(`冷卻時間減少 ${effect.value} 秒`, 'info');
                break;
                
            case 'remove_cooldown':
                // 完全移除冷卻
                this.player.breakthroughCooldown = 0;
                this.game.showMessage('冷卻時間已移除！', 'success');
                break;
                
            case 'cultivation_boost':
            case 'breakthrough_rate':
            case 'cultivation_time':
                // 這些效果需要在修煉或渡劫時才生效
                // 這裡先儲存 buff 狀態（之後實作 buff 系統）
                console.log(`丹藥效果：${effect.type} +${effect.value}`);
                // TODO: 實作 buff 系統
                break;
        }
        
        // 觸發事件
        this.game.emit('pillUsed', {
            pillName: pillName,
            effect: effect
        });
    }
    
    // ====================================
    // 丹方管理
    // ====================================
    
    // 檢查是否擁有丹方
    hasRecipe(recipeName) {
        return this.player.resources.recipes.includes(recipeName);
    }
    
    // 學習丹方
    learnRecipe(recipeName, showMessage = true) {
        if (this.hasRecipe(recipeName)) {
            if (showMessage) {
                this.game.showMessage('已經學會此丹方！', 'warning');
            }
            return false;
        }
        
        this.player.resources.recipes.push(recipeName);
        
        if (showMessage) {
            this.game.showMessage(`學會丹方：${recipeName}`, 'success');
        }
        
        console.log(`學會丹方：${recipeName}`);
        
        // 觸發事件
        this.game.emit('recipeLearn', {
            recipeName: recipeName
        });
        
        return true;
    }
    
    // 獲取已學會的丹方列表
    getLearnedRecipes() {
        return this.player.resources.recipes;
    }
    
    // ====================================
    // 查詢方法
    // ====================================
    
    // 獲取所有資源摘要
    getResourcesSummary() {
        return {
            spiritStone: this.player.resources.spiritStone,
            seedCount: Object.keys(this.player.resources.seeds).length,
            herbCount: Object.keys(this.player.resources.herbs).length,
            pillCount: Object.keys(this.player.resources.pills).length,
            recipeCount: this.player.resources.recipes.length
        };
    }
    
    // 獲取倉庫使用情況
    getStorageInfo() {
        let used = 0;
        
        // 計算種子數量
        for (let seed in this.player.resources.seeds) {
            used += this.player.resources.seeds[seed];
        }
        
        // 計算靈草數量
        for (let herb in this.player.resources.herbs) {
            used += this.player.resources.herbs[herb];
        }
        
        // 計算丹藥數量
        for (let pill in this.player.resources.pills) {
            used += this.player.resources.pills[pill];
        }
        
        return {
            used: used,
            max: 100,  // 暫時固定為 100
            percent: Math.min(100, (used / 100) * 100)
        };
    }
}