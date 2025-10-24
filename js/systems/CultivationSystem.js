// ====================================
// 修煉系統
// ====================================

class CultivationSystem {
    constructor(game) {
        this.game = game;
        this.player = game.player;
        
        // 修煉狀態
        this.cultivationTimer = null;      // 計時器
        this.cultivationStartTime = 0;     // 開始時間
        this.cultivationDuration = 0;      // 修煉時長（秒）
        this.cultivationProgress = 0;      // 進度（0-100）

        this.isAutoCultivating = false;
    }
    
    // ====================================
    // 修煉控制
    // ====================================
    
    // 開始修煉
    startCultivation() {
        // 檢查是否已經在修煉
        if (this.player.isCultivating) {
            console.log('已經在修煉中了');
            return false;
        }
        
        // 檢查是否在圓滿期且修為已滿（應該去渡劫）
        if (this.player.isPerfectStage()) {
            const realm = this.player.getCurrentRealm();
            if (this.player.cultivation >= realm.maxRequirement) {
                this.game.showMessage('修為已達圓滿，請進行渡劫突破！', 'warning');
                return false;
            }
        }
        
        // 開始修煉
        this.player.isCultivating = true;
        this.cultivationStartTime = Date.now();
        this.cultivationDuration = this.player.getCultivationTime();
        this.cultivationProgress = 0;
        
        console.log(`開始修煉，預計 ${this.cultivationDuration} 秒完成`);
        this.game.showMessage('開始修煉...', 'info');
        
        // 觸發事件
        this.game.emit('cultivationStart', {
            duration: this.cultivationDuration
        });
        
        return true;
    }
    
    // 停止修煉（手動取消）
stopCultivation() {
    if (!this.player.isCultivating) return;
    
    this.player.isCultivating = false;
    this.cultivationProgress = 0;
    
    // ⭐ 新增：停止時也關閉自動修煉
    this.isAutoCultivating = false;
    
    console.log('修煉已取消');
    this.game.showMessage('修煉已取消', 'info');
    
    // 觸發事件
    this.game.emit('cultivationStop');
}    
    // ====================================
    // 修煉更新
    // ====================================
    
    // 更新修煉狀態（由 Game.update() 調用）
    update(deltaTime) {
        if (!this.player.isCultivating) return;
        
        // 計算修煉進度
        const elapsed = (Date.now() - this.cultivationStartTime) / 1000;
        this.cultivationProgress = Math.min(100, (elapsed / this.cultivationDuration) * 100);
        
        // 檢查是否完成
        if (elapsed >= this.cultivationDuration) {
            this.completeCultivation();
        }
    }
    
    // 完成修煉
    completeCultivation() {
        // 獲得修為
        const gain = this.player.getCultivationGain();
        const previousRealm = this.player.getFullRealmName();
        const previousStage = this.player.stage;
        
        this.player.addCultivation(gain);
        this.player.totalCultivationSessions++;
        
        // 結束修煉狀態
        this.player.isCultivating = false;
        this.cultivationProgress = 0;
        
        console.log(`修煉完成！獲得 ${gain} 修為`);
        
        // 檢查是否自動突破小境界
        const currentStage = this.player.stage;
        const didAdvance = (currentStage > previousStage);
        
        if (didAdvance) {
            // 小境界提升了
            const newRealm = this.player.getFullRealmName();
            console.log(`境界提升：${previousRealm} → ${newRealm}`);
            
            this.game.showMessage(
                `修煉完成！獲得 ${formatNumber(gain)} 修為，突破到 ${newRealm}！`,
                'success'
            );
            
            // 觸發境界提升事件
            this.game.emit('stageAdvance', {
                previousStage: previousStage,
                currentStage: currentStage,
                realmName: newRealm
            });
        } else {
            // 沒有提升境界
            this.game.showCultivationComplete(gain);
        }
        
        // 觸發修煉完成事件
        this.game.emit('cultivationComplete', {
            gain: gain,
            totalCultivation: this.player.cultivation,
            didAdvance: didAdvance
        });
        if (this.isAutoCultivating) {
            setTimeout(() => {
                this.startCultivation();
            }, 100); // 延遲 0.1 秒開始下一次
        }
    }
// ====================================
// ⭐ 新增：自動修煉控制
// ====================================

// 開啟自動修煉
startAutoCultivation() {
    this.isAutoCultivating = true;
    console.log('自動修煉已開啟');
    this.game.showMessage('自動修煉已開啟', 'success');
    
    // 如果當前沒在修煉，立刻開始
    if (!this.player.isCultivating) {
        this.startCultivation();
    }
}

// 停止自動修煉
stopAutoCultivation() {
    this.isAutoCultivating = false;
    console.log('自動修煉已關閉');
    this.game.showMessage('自動修煉已關閉', 'info');
}

// 切換自動修煉
toggleAutoCultivation() {
    if (this.isAutoCultivating) {
        this.stopAutoCultivation();
    } else {
        this.startAutoCultivation();
    }
}
    // ====================================
// ====================================
// 狀態查詢
// ====================================

// 是否正在修煉
isCultivating() {
        return this.player.isCultivating;
    }
    
    // 獲取修煉進度（0-100）
    getProgress() {
        return this.cultivationProgress;
    }
    
    // 獲取剩餘時間（秒）
    getRemainingTime() {
        if (!this.player.isCultivating) return 0;
        
        const elapsed = (Date.now() - this.cultivationStartTime) / 1000;
        const remaining = Math.max(0, this.cultivationDuration - elapsed);
        return remaining;
    }
    
    // 獲取修煉資訊
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