



class ResourceManager {
    constructor(game) {
        this.game = game;
        this.player = game.player;
    }
    
    
    
    
    
    
    getSpiritStone() {
        return this.player.resources.spiritStone;
    }
    
    
    addSpiritStone(amount, showMessage = true) {
        this.player.resources.spiritStone += amount;
        
        if (showMessage) {
            this.game.showMessage(`獲得 ${formatNumber(amount)} 靈石`, 'success');
        }
        
        console.log(`靈石 +${amount}，當前：${this.player.resources.spiritStone}`);
        
        
        this.game.emit('spiritStoneChange', {
            amount: amount,
            total: this.player.resources.spiritStone
        });
        
        return true;
    }
    
    
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
        
        
        this.game.emit('spiritStoneChange', {
            amount: -amount,
            total: this.player.resources.spiritStone
        });
        
        return true;
    }
    
    
    hasSpiritStone(amount) {
        return this.player.resources.spiritStone >= amount;
    }
    
    
    
    
    
    
    getSeedCount(seedType) {
        return this.player.resources.seeds[seedType] || 0;
    }
    
    
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
    
    
    hasSeed(seedType, amount = 1) {
        return this.getSeedCount(seedType) >= amount;
    }
    
    
    
    
    
    
    getHerbCount(herbName) {
        return this.player.resources.herbs[herbName] || 0;
    }
    
    
    addHerb(herbName, amount, showMessage = true) {
        if (!this.player.resources.herbs[herbName]) {
            this.player.resources.herbs[herbName] = 0;
        }
        
        this.player.resources.herbs[herbName] += amount;
        
        if (showMessage) {
            this.game.showMessage(`獲得 ${herbName} x${amount}`, 'success');
        }
        
        console.log(`靈草 ${herbName} +${amount}`);
        
        
        this.game.emit('herbChange', {
            herbName: herbName,
            amount: amount,
            total: this.player.resources.herbs[herbName]
        });
        
        return true;
    }
    
    
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
        
        
        this.game.emit('herbChange', {
            herbName: herbName,
            amount: -amount,
            total: this.player.resources.herbs[herbName]
        });
        
        return true;
    }
    
    
    hasHerb(herbName, amount) {
        return this.getHerbCount(herbName) >= amount;
    }
    
    
    hasHerbs(materials) {
        for (let herbName in materials) {
            const required = materials[herbName];
            if (!this.hasHerb(herbName, required)) {
                return false;
            }
        }
        return true;
    }
    
    
    consumeHerbs(materials, showMessage = true) {
        
        if (!this.hasHerbs(materials)) {
            if (showMessage) {
                this.game.showMessage('材料不足！', 'error');
            }
            return false;
        }
        
        
        for (let herbName in materials) {
            const amount = materials[herbName];
            this.consumeHerb(herbName, amount, false);
        }
        
        if (showMessage) {
            this.game.showMessage('材料已消耗', 'info');
        }
        
        return true;
    }
    
    
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
        
        
        this.consumeHerb(herbName, amount, false);
        
        
        const totalPrice = herbData.sellPrice * amount;
        this.addSpiritStone(totalPrice, false);
        
        this.game.showMessage(
            `出售 ${herbName} x${amount}，獲得 ${formatNumber(totalPrice)} 靈石`,
            'success'
        );
        
        return true;
    }
    
    
    
    
    
    
    getPillCount(pillName, quality = null) {
        if (quality === null) {
            
            let total = 0;
            for (let q in PILL_QUALITY) {
                const key = `${pillName}_${PILL_QUALITY[q]}`;
                total += this.player.resources.pills[key] || 0;
            }
            return total;
        } else {
            
            const key = `${pillName}_${quality}`;
            return this.player.resources.pills[key] || 0;
        }
    }
    
    
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
        
        
        this.game.emit('pillChange', {
            pillName: pillName,
            quality: quality,
            amount: amount,
            total: this.player.resources.pills[key]
        });
        
        return true;
    }
    
    
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
        
        
        this.game.emit('pillChange', {
            pillName: pillName,
            quality: quality,
            amount: -amount,
            total: this.player.resources.pills[key]
        });
        
        return true;
    }
    
    
    hasPill(pillName, quality, amount = 1) {
        return this.getPillCount(pillName, quality) >= amount;
    }
    
    
    usePill(pillName, quality) {
        
        if (!this.hasPill(pillName, quality, 1)) {
            this.game.showMessage('丹藥不足！', 'error');
            return false;
        }
        
        
        this.consumePill(pillName, quality, 1, false);
        
        
        const effect = calculatePillEffect(pillName, quality);
        if (!effect) {
            this.game.showMessage('丹藥無效！', 'error');
            return false;
        }
        
        
        this.applyPillEffect(pillName, effect);
        
        const qualityName = getPillQualityName(quality);
        this.game.showMessage(`使用 ${qualityName}${pillName}`, 'success');
        
        return true;
    }
    
    
    applyPillEffect(pillName, effect) {
        switch (effect.type) {
            case 'instant_cultivation':
                
                this.player.addCultivation(effect.value);
                this.game.showMessage(
                    `獲得 ${formatNumber(effect.value)} 修為！`,
                    'success'
                );
                break;
                
            case 'reduce_cooldown':
                
                this.player.breakthroughCooldown = Math.max(
                    0,
                    this.player.breakthroughCooldown - effect.value
                );
                this.game.showMessage(`冷卻時間減少 ${effect.value} 秒`, 'info');
                break;
                
            case 'remove_cooldown':
                
                this.player.breakthroughCooldown = 0;
                this.game.showMessage('冷卻時間已移除！', 'success');
                break;
                
            case 'cultivation_boost':
            case 'breakthrough_rate':
            case 'cultivation_time':
                
                
                console.log(`丹藥效果：${effect.type} +${effect.value}`);
                
                break;
        }
        
        
        this.game.emit('pillUsed', {
            pillName: pillName,
            effect: effect
        });
    }
    
    
    
    
    
    
    hasRecipe(recipeName) {
        return this.player.resources.recipes.includes(recipeName);
    }
    
    
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
        
        
        this.game.emit('recipeLearn', {
            recipeName: recipeName
        });
        
        return true;
    }
    
    
    getLearnedRecipes() {
        return this.player.resources.recipes;
    }
    
    
    
    
    
    
    getResourcesSummary() {
        return {
            spiritStone: this.player.resources.spiritStone,
            seedCount: Object.keys(this.player.resources.seeds).length,
            herbCount: Object.keys(this.player.resources.herbs).length,
            pillCount: Object.keys(this.player.resources.pills).length,
            recipeCount: this.player.resources.recipes.length
        };
    }
    
    
    getStorageInfo() {
        let used = 0;
        
        
        for (let seed in this.player.resources.seeds) {
            used += this.player.resources.seeds[seed];
        }
        
        
        for (let herb in this.player.resources.herbs) {
            used += this.player.resources.herbs[herb];
        }
        
        
        for (let pill in this.player.resources.pills) {
            used += this.player.resources.pills[pill];
        }
        
        return {
            used: used,
            max: 100,  
            percent: Math.min(100, (used / 100) * 100)
        };
    }
}