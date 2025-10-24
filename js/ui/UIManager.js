



class UIManager {
    constructor(game) {
        this.game = game;
        this.player = game.player;
        
        
        this.elements = {};
    }
    
    
    
    
    
    init() {
        
        this.elements = {
            
            realmName: document.getElementById('realm-name'),
            stageName: document.getElementById('stage-name'),
            realmDescription: document.getElementById('realm-description'),
            
            
            cultivation: document.getElementById('cultivation'),
            cultivationProgress: document.getElementById('cultivation-progress'),
            cultivationBar: document.getElementById('cultivation-bar'),
            cultivationPercent: document.getElementById('cultivation-percent'),
            
            

            cultivateBtn: document.getElementById('cultivate-btn'),
            autoCultivateBtn: document.getElementById('auto-cultivate-btn'), 
            cultivationStatus: document.getElementById('cultivation-status'),
            cultivationTimer: document.getElementById('cultivation-timer'),
            cultivationProgressBar: document.getElementById('cultivation-progress-bar'),
            
            
            breakthroughBtn: document.getElementById('breakthrough-btn'),
            breakthroughInfo: document.getElementById('breakthrough-info'),
            
            
            totalSessions: document.getElementById('total-sessions'),
            playTime: document.getElementById('play-time'),
            breakthroughAttempts: document.getElementById('breakthrough-attempts'),
            
            
            messageBox: document.getElementById('message-box')
        };
        
        
        this.bindEvents();
        
        
        this.update();
        
        
        this.setupEventListeners();
        
        console.log('UI 管理器初始化完成');
    }
    
    
    
    
    
    bindEvents() {
        
        if (this.elements.cultivateBtn) {
            this.elements.cultivateBtn.addEventListener('click', () => {
                if (this.player.isCultivating) {
                    this.game.stopCultivation();
                } else {
                    this.game.startCultivation();
                }
            });
        }
        
        

if (this.elements.breakthroughBtn) {
    this.elements.breakthroughBtn.addEventListener('click', () => {
        this.game.attemptBreakthrough();
    });
}


if (this.elements.autoCultivateBtn) {
    this.elements.autoCultivateBtn.addEventListener('click', () => {
        this.game.toggleAutoCultivation();
        this.updateAutoCultivateButton();
    });
}    
}
    
    
    setupEventListeners() {
        
        this.game.on('cultivationStart', (data) => {
            this.updateCultivationStatus();
        });
        
        
        this.game.on('cultivationComplete', (data) => {
            this.updateCultivationStatus();
            this.update();
        });
        
        
        this.game.on('stageAdvance', (data) => {
            this.showRealmAdvanceEffect();
        });
        
        
        this.game.on('breakthroughSuccess', (data) => {
            this.showBreakthroughSuccessEffect();
            this.update();
        });
        
        
        this.game.on('breakthroughFailure', (data) => {
            this.update();
        });
        
        
        this.game.on('message', (data) => {
            this.showMessage(data.message, data.type);
        });
    }
    
    
    
    
    
    
update() {
    this.updateRealmDisplay();
    this.updateCultivationDisplay();
    this.updateCultivationStatus();
    this.updateBreakthroughButton();
    this.updateAutoCultivateButton(); 
    this.updateStatistics();
}
    
    
    updateRealmDisplay() {
        if (this.elements.realmName) {
            const realmName = this.player.getRealmName();
            const colorClass = getRealmColorClass(this.player.realmIndex);
            this.elements.realmName.textContent = realmName;
            this.elements.realmName.className = colorClass;
        }
        
        if (this.elements.stageName) {
            this.elements.stageName.textContent = this.player.getStageName();
        }
        
        if (this.elements.realmDescription) {
            const realm = this.player.getCurrentRealm();
            this.elements.realmDescription.textContent = realm ? realm.description : '';
        }
    }
    
    
    updateCultivationDisplay() {
        const current = this.player.cultivation;
        const stageReq = this.player.getCurrentStageRequirement();
        const nextReq = this.player.getNextStageRequirement();
        const progress = this.player.getCultivationProgress();
        
        
        if (this.elements.cultivation) {
            this.elements.cultivation.innerHTML = formatCultivation(current);
        }
        
        
        if (this.elements.cultivationProgress) {
            this.elements.cultivationProgress.textContent = 
                `${formatNumber(current)} / ${formatNumber(nextReq)}`;
        }
        
        
        if (this.elements.cultivationBar) {
            this.elements.cultivationBar.style.width = progress + '%';
        }
        
        
        if (this.elements.cultivationPercent) {
            this.elements.cultivationPercent.textContent = formatPercent(progress, 1);
        }
    }
    
    
    updateCultivationStatus() {
        const isCultivating = this.player.isCultivating;
        
        
        if (this.elements.cultivateBtn) {
            if (isCultivating) {
                this.elements.cultivateBtn.textContent = '⏸️ 停止修煉';
                this.elements.cultivateBtn.classList.add('cultivating');
            } else {
                this.elements.cultivateBtn.textContent = '🧘 開始修煉';
                this.elements.cultivateBtn.classList.remove('cultivating');
            }
        }
        
        
        if (this.elements.cultivationStatus) {
            if (isCultivating) {
                const info = this.game.cultivationSystem.getCultivationInfo();
                const remaining = Math.ceil(info.remainingTime);
                
                this.elements.cultivationStatus.style.display = 'block';
                
                if (this.elements.cultivationTimer) {
                    this.elements.cultivationTimer.textContent = 
                        `剩餘時間：${remaining} 秒`;
                }
                
                if (this.elements.cultivationProgressBar) {
                    this.elements.cultivationProgressBar.style.width = 
                        info.progress + '%';
                }
            } else {
                this.elements.cultivationStatus.style.display = 'none';
            }
        }
    }
    
    
    updateBreakthroughButton() {
        if (!this.elements.breakthroughBtn) return;
        
        const canBreakthrough = this.player.canBreakthrough();
        const isPerfect = this.player.isPerfectStage();
        const cooldown = this.player.breakthroughCooldown;
        
        if (canBreakthrough) {
            this.elements.breakthroughBtn.disabled = false;
            this.elements.breakthroughBtn.textContent = 
                `⚡ 渡劫突破 (${this.player.getBreakthroughRate()}%)`;
            this.elements.breakthroughBtn.classList.add('ready');
        } else {
            this.elements.breakthroughBtn.disabled = true;
            this.elements.breakthroughBtn.classList.remove('ready');
            
            if (cooldown > 0) {
                this.elements.breakthroughBtn.textContent = 
                    `⏳ 冷卻中 (${Math.ceil(cooldown)}秒)`;
            } else if (!isPerfect) {
                this.elements.breakthroughBtn.textContent = 
                    `🔒 需達到圓滿期`;
            } else {
                this.elements.breakthroughBtn.textContent = 
                    `🔒 修為不足`;
            }
        }
        
        
        if (this.elements.breakthroughInfo && isPerfect) {
            const realm = this.player.getCurrentRealm();
            const needed = realm.maxRequirement - this.player.cultivation;
            
            if (needed > 0) {
                this.elements.breakthroughInfo.textContent = 
                    `還需 ${formatNumber(needed)} 修為`;
                this.elements.breakthroughInfo.style.display = 'block';
            } else {
                this.elements.breakthroughInfo.style.display = 'none';
            }
        }
    }
    
    
    updateStatistics() {
        if (this.elements.totalSessions) {
            this.elements.totalSessions.textContent = 
                this.player.totalCultivationSessions;
        }
        
        if (this.elements.playTime) {
            this.elements.playTime.textContent = 
                formatTime(this.player.playTime);
        }
        
        if (this.elements.breakthroughAttempts) {
            this.elements.breakthroughAttempts.textContent = 
                `${this.player.breakthroughAttempts} 次 (失敗 ${this.player.breakthroughFails})`;
        }
    }
    
updateAutoCultivateButton() {
    if (!this.elements.autoCultivateBtn) return;
    
    const isAuto = this.game.cultivationSystem.isAutoCultivating;
    
    if (isAuto) {
        this.elements.autoCultivateBtn.textContent = '⏸️ 停止自動修煉';
        this.elements.autoCultivateBtn.classList.add('auto-active');
    } else {
        this.elements.autoCultivateBtn.textContent = '🔄 自動修煉';
        this.elements.autoCultivateBtn.classList.remove('auto-active');
    }
}
    
    
    
    
    
    
    showRealmAdvanceEffect() {
        
        if (this.elements.realmName) {
            this.elements.realmName.classList.add('level-up');
            setTimeout(() => {
                this.elements.realmName.classList.remove('level-up');
            }, 1000);
        }
    }
    
    
    showBreakthroughSuccessEffect() {
        
        const flash = document.createElement('div');
        flash.className = 'breakthrough-flash';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 1000);
    }
    
    
    showMessage(message, type = 'info') {
        if (!this.elements.messageBox) return;
        
        const msgElement = document.createElement('div');
        msgElement.className = `message message-${type}`;
        msgElement.textContent = message;
        
        this.elements.messageBox.appendChild(msgElement);
        
        
        setTimeout(() => {
            msgElement.classList.add('fade-out');
            setTimeout(() => {
                msgElement.remove();
            }, 500);
        }, 3000);
    }
}