



class CultivationSystem {
    constructor(game) {
        this.game = game;
        this.player = game.player;
        
        
        this.cultivationTimer = null;      
        this.cultivationStartTime = 0;     
        this.cultivationDuration = 0;      
        this.cultivationProgress = 0;      

        this.isAutoCultivating = false;
    }
    
    
    
    
    
    
    startCultivation() {
        
        if (this.player.isCultivating) {
            console.log('已經在修煉中了');
            return false;
        }
        
        
        if (this.player.isPerfectStage()) {
            const realm = this.player.getCurrentRealm();
            if (this.player.cultivation >= realm.maxRequirement) {
                this.game.showMessage('修為已達圓滿，請進行渡劫突破！', 'warning');
                return false;
            }
        }
        
        
        this.player.isCultivating = true;
        this.cultivationStartTime = Date.now();
        this.cultivationDuration = this.player.getCultivationTime();
        this.cultivationProgress = 0;
        
        console.log(`開始修煉，預計 ${this.cultivationDuration} 秒完成`);
        this.game.showMessage('開始修煉...', 'info');
        
        
        this.game.emit('cultivationStart', {
            duration: this.cultivationDuration
        });
        
        return true;
    }
    
    
stopCultivation() {
    if (!this.player.isCultivating) return;
    
    this.player.isCultivating = false;
    this.cultivationProgress = 0;
    
    
    this.isAutoCultivating = false;
    
    console.log('修煉已取消');
    this.game.showMessage('修煉已取消', 'info');
    
    
    this.game.emit('cultivationStop');
}    
    
    
    
    
    
    update(deltaTime) {
        if (!this.player.isCultivating) return;
        
        
        const elapsed = (Date.now() - this.cultivationStartTime) / 1000;
        this.cultivationProgress = Math.min(100, (elapsed / this.cultivationDuration) * 100);
        
        
        if (elapsed >= this.cultivationDuration) {
            this.completeCultivation();
        }
    }
    
    
    completeCultivation() {
        
        const gain = this.player.getCultivationGain();
        const previousRealm = this.player.getFullRealmName();
        const previousStage = this.player.stage;
        
        this.player.addCultivation(gain);
        this.player.totalCultivationSessions++;
        
        
        this.player.isCultivating = false;
        this.cultivationProgress = 0;
        
        console.log(`修煉完成！獲得 ${gain} 修為`);
        
        
        const currentStage = this.player.stage;
        const didAdvance = (currentStage > previousStage);
        
        if (didAdvance) {
            
            const newRealm = this.player.getFullRealmName();
            console.log(`境界提升：${previousRealm} → ${newRealm}`);
            
            this.game.showMessage(
                `修煉完成！獲得 ${formatNumber(gain)} 修為，突破到 ${newRealm}！`,
                'success'
            );
            
            
            this.game.emit('stageAdvance', {
                previousStage: previousStage,
                currentStage: currentStage,
                realmName: newRealm
            });
        } else {
            
            this.game.showCultivationComplete(gain);
        }
        
        
        this.game.emit('cultivationComplete', {
            gain: gain,
            totalCultivation: this.player.cultivation,
            didAdvance: didAdvance
        });
        if (this.isAutoCultivating) {
            setTimeout(() => {
                this.startCultivation();
            }, 100); 
        }
    }





startAutoCultivation() {
    this.isAutoCultivating = true;
    console.log('自動修煉已開啟');
    this.game.showMessage('自動修煉已開啟', 'success');
    
    
    if (!this.player.isCultivating) {
        this.startCultivation();
    }
}


stopAutoCultivation() {
    this.isAutoCultivating = false;
    console.log('自動修煉已關閉');
    this.game.showMessage('自動修煉已關閉', 'info');
}


toggleAutoCultivation() {
    if (this.isAutoCultivating) {
        this.stopAutoCultivation();
    } else {
        this.startAutoCultivation();
    }
}
    





isCultivating() {
        return this.player.isCultivating;
    }
    
    
    getProgress() {
        return this.cultivationProgress;
    }
    
    
    getRemainingTime() {
        if (!this.player.isCultivating) return 0;
        
        const elapsed = (Date.now() - this.cultivationStartTime) / 1000;
        const remaining = Math.max(0, this.cultivationDuration - elapsed);
        return remaining;
    }
    
    
    getCultivationInfo() {
        return {
            isCultivating: this.player.isCultivating,
            progress: this.cultivationProgress,
            remainingTime: this.getRemainingTime(),
            duration: this.cultivationDuration,
            gain: this.player.getCultivationGain()
        };
    }
}