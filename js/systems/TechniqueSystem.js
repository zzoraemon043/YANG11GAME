// ====================================
// 功法系統
// ====================================

class TechniqueSystem {
    constructor(game) {
        this.game = game;
        this.player = game.player;
    }
    
    // ====================================
    // 功法管理
    // ====================================
    
    // 獲取當前運行的功法
    getActiveTechnique() {
        return this.player.techniques.active;
    }
    
    // 獲取當前運行的功法資料
    getActiveTechniqueData() {
        const techniqueName = this.getActiveTechnique();
        return getTechniqueData(techniqueName);
    }
    
    // 獲取擁有的所有功法
    getOwnedTechniques() {
        return this.player.techniques.owned;
    }
    
    // 檢查是否擁有功法
    hasTechnique(techniqueName) {
        return this.player.techniques.owned.includes(techniqueName);
    }
    
    // 獲得新功法
    learnTechnique(techniqueName, showMessage = true) {
        // 檢查是否已經擁有
        if (this.hasTechnique(techniqueName)) {
            if (showMessage) {
                this.game.showMessage('已經擁有此功法！', 'warning');
            }
            return false;
        }
        
        // 檢查功法是否存在
        const techniqueData = getTechniqueData(techniqueName);
        if (!techniqueData) {
            if (showMessage) {
                this.game.showMessage('未知的功法！', 'error');
            }
            return false;
        }
        
        // 檢查境界是否達標
        if (this.player.realmIndex < techniqueData.realmRequirement) {
            if (showMessage) {
                const requiredRealm = getRealmData(techniqueData.realmRequirement);
                this.game.showMessage(
                    `需要達到 ${requiredRealm.name} 才能學習此功法！`,
                    'error'
                );
            }
            return false;
        }
        
        // 檢查藏經閣容量
        if (this.player.techniques.owned.length >= this.player.techniques.maxSlots) {
            if (showMessage) {
                this.game.showMessage('藏經閣已滿，無法學習更多功法！', 'error');
            }
            return false;
        }
        
        // 學習功法
        this.player.techniques.owned.push(techniqueName);
        
        if (showMessage) {
            const rarityName = getTechniqueRarityName(techniqueData.rarity);
            this.game.showMessage(
                `學會 ${rarityName}功法《${techniqueName}》！`,
                'success'
            );
        }
        
        console.log(`學會功法：${techniqueName}`);
        
        // 觸發事件
        this.game.emit('techniqueLearn', {
            techniqueName: techniqueName,
            techniqueData: techniqueData
        });
        
        return true;
    }
    
    // ====================================
    // 功法切換
    // ====================================
    
    // 切換運行的功法
    switchTechnique(techniqueName, showMessage = true) {
        // 檢查是否擁有
        if (!this.hasTechnique(techniqueName)) {
            if (showMessage) {
                this.game.showMessage('尚未擁有此功法！', 'error');
            }
            return false;
        }
        
        // 檢查是否已經在運行
        if (this.player.techniques.active === techniqueName) {
            if (showMessage) {
                this.game.showMessage('此功法已在運行中！', 'warning');
            }
            return false;
        }
        
        // 檢查功法資料
        const techniqueData = getTechniqueData(techniqueName);
        if (!techniqueData) {
            if (showMessage) {
                this.game.showMessage('功法資料錯誤！', 'error');
            }
            return false;
        }
        
        // 檢查境界是否達標
        if (this.player.realmIndex < techniqueData.realmRequirement) {
            if (showMessage) {
                const requiredRealm = getRealmData(techniqueData.realmRequirement);
                this.game.showMessage(
                    `修為不足，需要達到 ${requiredRealm.name}！`,
                    'error'
                );
            }
            return false;
        }
        
        // 切換功法
        const oldTechnique = this.player.techniques.active;
        this.player.techniques.active = techniqueName;
        
        // 重新計算五行屬性
        this.updateElementsFromTechniques();
        
        if (showMessage) {
            this.game.showMessage(
                `已切換為《${techniqueName}》`,
                'success'
            );
        }
        
        console.log(`功法切換：${oldTechnique} → ${techniqueName}`);
        
        // 觸發事件
        this.game.emit('techniqueSwitch', {
            oldTechnique: oldTechnique,
            newTechnique: techniqueName
        });
        
        return true;
    }
    
    // ====================================
    // 功法效果計算
    // ====================================
    
    // 獲取當前修煉速度加成
    getCultivationSpeedBonus() {
        const technique = this.getActiveTechniqueData();
        if (!technique) return 0;
        
        if (technique.mainEffect.type === 'cultivation_speed') {
            return technique.mainEffect.value;
        }
        
        return 0;
    }
    
    // 計算實際修煉時間（考慮功法加成）
    getActualCultivationTime(baseTime) {
        const speedBonus = this.getCultivationSpeedBonus();
        
        // 速度加成轉換為時間減少
        // 例如：+50% 速度 = 時間減少 33%
        const timeMultiplier = 100 / (100 + speedBonus);
        
        return Math.max(1, Math.floor(baseTime * timeMultiplier));
    }
    
    // 更新五行屬性（從所有擁有的功法）
    updateElementsFromTechniques() {
        // 重置五行屬性
        this.player.elements = {
            metal: 0,
            wood: 0,
            water: 0,
            fire: 0,
            earth: 0
        };
        
        // 遍歷所有擁有的功法
        this.player.techniques.owned.forEach(techniqueName => {
            const technique = getTechniqueData(techniqueName);
            if (!technique) return;
            
            // 應用被動效果
            if (technique.passiveEffect) {
                this.applyPassiveEffect(technique.passiveEffect);
            }
        });
        
        console.log('五行屬性已更新：', this.player.elements);
        
        // 觸發事件
        this.game.emit('elementsUpdate', {
            elements: this.player.elements
        });
    }
    
    // 應用功法被動效果
    applyPassiveEffect(passiveEffect) {
        if (passiveEffect.type === 'element') {
            // 五行屬性加成
            const element = passiveEffect.element;
            const value = passiveEffect.value;
            
            if (this.player.elements[element] !== undefined) {
                this.player.elements[element] += value;
            }
        } else if (passiveEffect.type === 'special') {
            // 特殊效果（自動煉丹、自動收穫等）
            // 這些效果會在對應的系統中檢查和觸發
            console.log(`功法特殊效果：${passiveEffect.effect} ${passiveEffect.value}%`);
        }
    }
    
    // 檢查是否有特定特殊效果
    hasSpecialEffect(effectName) {
        let totalChance = 0;
        
        this.player.techniques.owned.forEach(techniqueName => {
            const technique = getTechniqueData(techniqueName);
            if (!technique) return;
            
            if (technique.passiveEffect && 
                technique.passiveEffect.type === 'special' &&
                technique.passiveEffect.effect === effectName) {
                totalChance += technique.passiveEffect.value;
            }
        });
        
        return totalChance;
    }
    
    // 隨機觸發特殊效果
    tryTriggerSpecialEffect(effectName) {
        const chance = this.hasSpecialEffect(effectName);
        if (chance <= 0) return false;
        
        const random = Math.random() * 100;
        const triggered = random < chance;
        
        if (triggered) {
            console.log(`特殊效果觸發：${effectName} (機率：${chance}%)`);
        }
        
        return triggered;
    }
    
    // ====================================
    // 查詢方法
    // ====================================
    
    // 獲取功法詳細資訊
    getTechniqueInfo(techniqueName) {
        const technique = getTechniqueData(techniqueName);
        if (!technique) return null;
        
        const isOwned = this.hasTechnique(techniqueName);
        const isActive = this.player.techniques.active === techniqueName;
        const canUse = this.player.realmIndex >= technique.realmRequirement;
        
        return {
            ...technique,
            isOwned: isOwned,
            isActive: isActive,
            canUse: canUse
        };
    }
    
    // 獲取可學習的功法列表
    getAvailableTechniques() {
        const available = [];
        
        for (let name in TECHNIQUES_DATA) {
            const technique = TECHNIQUES_DATA[name];
            
            // 已擁有的不顯示
            if (this.hasTechnique(name)) continue;
            
            available.push({
                name: name,
                data: technique,
                canLearn: this.player.realmIndex >= technique.realmRequirement
            });
        }
        
        return available;
    }
    
    // 獲取功法統計
    getTechniqueStats() {
        return {
            owned: this.player.techniques.owned.length,
            maxSlots: this.player.techniques.maxSlots,
            active: this.player.techniques.active,
            cultivationSpeedBonus: this.getCultivationSpeedBonus()
        };
    }
    
    // ====================================
    // 調試方法
    // ====================================
    
    // 調試：學習所有當前境界可學的功法
    debugLearnAllAvailable() {
        console.log('=== 調試：學習所有可用功法 ===');
        
        let learned = 0;
        const techniques = this.getAvailableTechniques();
        
        techniques.forEach(item => {
            if (item.canLearn) {
                if (this.learnTechnique(item.name, false)) {
                    learned++;
                    console.log(`學會：${item.name}`);
                }
            }
        });
        
        this.game.showMessage(`學會了 ${learned} 個功法`, 'success');
        console.log(`總共學會 ${learned} 個功法`);
        
        // 更新五行屬性
        this.updateElementsFromTechniques();
    }
}