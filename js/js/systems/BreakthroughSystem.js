



class BreakthroughSystem {
    constructor(game) {
        this.game = game;
        this.player = game.player;
    }
    
    
    
    
    
    
    attemptBreakthrough() {
        
        if (!this.canBreakthrough()) {
            return this.getBreakthroughBlockReason();
        }
        
        
        const successRate = this.player.getBreakthroughRate();
        const roll = Math.random() * 100;
        const success = roll < successRate;
        
        console.log(`渡劫嘗試：成功率 ${successRate}%，擲骰 ${roll.toFixed(2)}，結果：${success ? '成功' : '失敗'}`);
        
        if (success) {
            return this.breakthroughSuccess();
        } else {
            return this.breakthroughFailure();
        }
    }
    
    
    breakthroughSuccess() {
        const previousRealm = this.player.getRealmName();
        const result = this.player.breakthrough();
        const newRealm = this.player.getRealmName();
        
        console.log(`渡劫成功！${previousRealm} → ${newRealm}`);
        
        
        this.game.showMessage(
            `🎉 渡劫成功！突破到 ${newRealm}！`,
            'success'
        );
        
        
        this.game.emit('breakthroughSuccess', {
            previousRealm: previousRealm,
            newRealm: newRealm,
            realmIndex: this.player.realmIndex
        });
        
        return {
            success: true,
            message: `渡劫成功！突破到 ${newRealm}！`
        };
    }
    
    
    breakthroughFailure() {
        const realm = this.player.getRealmName();
        const result = this.player.breakthroughFailed();
        
        console.log(`渡劫失敗！需要冷卻 ${this.player.breakthroughCooldown} 秒`);
        
        
        this.game.showMessage(
            `💀 渡劫失敗！天劫太強，需要休養 60 秒...`,
            'error'
        );
        
        
        this.game.emit('breakthroughFailure', {
            realm: realm,
            cooldown: this.player.breakthroughCooldown,
            attempts: this.player.breakthroughAttempts,
            fails: this.player.breakthroughFails
        });
        
        return {
            success: false,
            message: result.message
        };
    }
    
    
    
    
    
    
    canBreakthrough() {
        return this.player.canBreakthrough();
    }
    
    
    getBreakthroughBlockReason() {
        
        if (!this.player.isPerfectStage()) {
            return {
                success: false,
                message: `需要達到${this.player.getRealmName()}圓滿才能渡劫`,
                reason: 'not_perfect'
            };
        }
        
        
        const realm = this.player.getCurrentRealm();
        if (this.player.cultivation < realm.maxRequirement) {
            const needed = realm.maxRequirement - this.player.cultivation;
            return {
                success: false,
                message: `修為不足，還需要 ${formatNumber(needed)} 修為`,
                reason: 'insufficient_cultivation'
            };
        }
        
        
        if (this.player.breakthroughCooldown > 0) {
            return {
                success: false,
                message: `渡劫冷卻中，還需 ${Math.ceil(this.player.breakthroughCooldown)} 秒`,
                reason: 'cooldown'
            };
        }
        
        
        if (this.player.realmIndex >= REALMS_DATA.length - 1) {
            return {
                success: false,
                message: '已達到最高境界！',
                reason: 'max_realm'
            };
        }
        
        return {
            success: false,
            message: '未知原因無法渡劫',
            reason: 'unknown'
        };
    }
    
    
    
    
    
    
    getBreakthroughInfo() {
        return {
            canBreakthrough: this.canBreakthrough(),
            successRate: this.player.getBreakthroughRate(),
            cooldown: this.player.breakthroughCooldown,
            attempts: this.player.breakthroughAttempts,
            fails: this.player.breakthroughFails,
            isPerfectStage: this.player.isPerfectStage()
        };
    }
    
    
    getNextRealmInfo() {
        const nextRealmIndex = this.player.realmIndex + 1;
        
        if (nextRealmIndex >= REALMS_DATA.length) {
            return null;
        }
        
        const nextRealm = getRealmData(nextRealmIndex);
        
        return {
            name: nextRealm.name,
            description: nextRealm.description,
            cultivationGain: nextRealm.cultivationGain
        };
    }
}