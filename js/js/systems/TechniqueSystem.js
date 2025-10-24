



class TechniqueSystem {
    constructor(game) {
        this.game = game;
        this.player = game.player;
    }
    
    
    
    
    
    
    getActiveTechnique() {
        return this.player.techniques.active;
    }
    
    
    getActiveTechniqueData() {
        const techniqueName = this.getActiveTechnique();
        return getTechniqueData(techniqueName);
    }
    
    
    getOwnedTechniques() {
        return this.player.techniques.owned;
    }
    
    
    hasTechnique(techniqueName) {
        return this.player.techniques.owned.includes(techniqueName);
    }
    
    
    learnTechnique(techniqueName, showMessage = true) {
        
        if (this.hasTechnique(techniqueName)) {
            if (showMessage) {
                this.game.showMessage('已經擁有此功法！', 'warning');
            }
            return false;
        }
        
        
        const techniqueData = getTechniqueData(techniqueName);
        if (!techniqueData) {
            if (showMessage) {
                this.game.showMessage('未知的功法！', 'error');
            }
            return false;
        }
        
        
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
        
        
        if (this.player.techniques.owned.length >= this.player.techniques.maxSlots) {
            if (showMessage) {
                this.game.showMessage('藏經閣已滿，無法學習更多功法！', 'error');
            }
            return false;
        }
        
        
        this.player.techniques.owned.push(techniqueName);
        
        if (showMessage) {
            const rarityName = getTechniqueRarityName(techniqueData.rarity);
            this.game.showMessage(
                `學會 ${rarityName}功法《${techniqueName}》！`,
                'success'
            );
        }
        
        console.log(`學會功法：${techniqueName}`);
        
        
        this.game.emit('techniqueLearn', {
            techniqueName: techniqueName,
            techniqueData: techniqueData
        });
        
        return true;
    }
    
    
    
    
    
    
    switchTechnique(techniqueName, showMessage = true) {
        
        if (!this.hasTechnique(techniqueName)) {
            if (showMessage) {
                this.game.showMessage('尚未擁有此功法！', 'error');
            }
            return false;
        }
        
        
        if (this.player.techniques.active === techniqueName) {
            if (showMessage) {
                this.game.showMessage('此功法已在運行中！', 'warning');
            }
            return false;
        }
        
        
        const techniqueData = getTechniqueData(techniqueName);
        if (!techniqueData) {
            if (showMessage) {
                this.game.showMessage('功法資料錯誤！', 'error');
            }
            return false;
        }
        
        
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
        
        
        const oldTechnique = this.player.techniques.active;
        this.player.techniques.active = techniqueName;
        
        
        this.updateElementsFromTechniques();
        
        if (showMessage) {
            this.game.showMessage(
                `已切換為《${techniqueName}》`,
                'success'
            );
        }
        
        console.log(`功法切換：${oldTechnique} → ${techniqueName}`);
        
        
        this.game.emit('techniqueSwitch', {
            oldTechnique: oldTechnique,
            newTechnique: techniqueName
        });
        
        return true;
    }
    
    
    
    
    
    
    getCultivationSpeedBonus() {
        const technique = this.getActiveTechniqueData();
        if (!technique) return 0;
        
        if (technique.mainEffect.type === 'cultivation_speed') {
            return technique.mainEffect.value;
        }
        
        return 0;
    }
    
    
    getActualCultivationTime(baseTime) {
        const speedBonus = this.getCultivationSpeedBonus();
        
        
        
        const timeMultiplier = 100 / (100 + speedBonus);
        
        return Math.max(1, Math.floor(baseTime * timeMultiplier));
    }
    
    
    updateElementsFromTechniques() {
        
        this.player.elements = {
            metal: 0,
            wood: 0,
            water: 0,
            fire: 0,
            earth: 0
        };
        
        
        this.player.techniques.owned.forEach(techniqueName => {
            const technique = getTechniqueData(techniqueName);
            if (!technique) return;
            
            
            if (technique.passiveEffect) {
                this.applyPassiveEffect(technique.passiveEffect);
            }
        });
        
        console.log('五行屬性已更新：', this.player.elements);
        
        
        this.game.emit('elementsUpdate', {
            elements: this.player.elements
        });
    }
    
    
    applyPassiveEffect(passiveEffect) {
        if (passiveEffect.type === 'element') {
            
            const element = passiveEffect.element;
            const value = passiveEffect.value;
            
            if (this.player.elements[element] !== undefined) {
                this.player.elements[element] += value;
            }
        } else if (passiveEffect.type === 'special') {
            
            
            console.log(`功法特殊效果：${passiveEffect.effect} ${passiveEffect.value}%`);
        }
    }
    
    
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
    
    
    getAvailableTechniques() {
        const available = [];
        
        for (let name in TECHNIQUES_DATA) {
            const technique = TECHNIQUES_DATA[name];
            
            
            if (this.hasTechnique(name)) continue;
            
            available.push({
                name: name,
                data: technique,
                canLearn: this.player.realmIndex >= technique.realmRequirement
            });
        }
        
        return available;
    }
    
    
    getTechniqueStats() {
        return {
            owned: this.player.techniques.owned.length,
            maxSlots: this.player.techniques.maxSlots,
            active: this.player.techniques.active,
            cultivationSpeedBonus: this.getCultivationSpeedBonus()
        };
    }
    
    
    
    
    
    
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
        
        
        this.updateElementsFromTechniques();
    }
}