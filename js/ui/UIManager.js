// ====================================
// UI 管理器
// ====================================

class UIManager {
    constructor(game) {
        this.game = game;
        this.player = game.player;
        
        // DOM 元素引用
        this.elements = {};
    }
    
    // ====================================
    // 初始化
    // ====================================
    
    init() {
        // 獲取所有 DOM 元素
        this.elements = {
            // 境界顯示
            realmName: document.getElementById('realm-name'),
            stageName: document.getElementById('stage-name'),
            realmDescription: document.getElementById('realm-description'),
            
            // 修為顯示
            cultivation: document.getElementById('cultivation'),
            cultivationProgress: document.getElementById('cultivation-progress'),
            cultivationBar: document.getElementById('cultivation-bar'),
            cultivationPercent: document.getElementById('cultivation-percent'),
            
            // 修煉按鈕和進度
// 修煉按鈕和進度
            cultivateBtn: document.getElementById('cultivate-btn'),
            autoCultivateBtn: document.getElementById('auto-cultivate-btn'), // ⭐ 新增
            cultivationStatus: document.getElementById('cultivation-status'),
            cultivationTimer: document.getElementById('cultivation-timer'),
            cultivationProgressBar: document.getElementById('cultivation-progress-bar'),
            
            // 渡劫按鈕
            breakthroughBtn: document.getElementById('breakthrough-btn'),
            breakthroughInfo: document.getElementById('breakthrough-info'),
            
            // 統計資訊
            totalSessions: document.getElementById('total-sessions'),
            playTime: document.getElementById('play-time'),
            breakthroughAttempts: document.getElementById('breakthrough-attempts'),
            
            // 訊息顯示
            messageBox: document.getElementById('message-box')
        };
        
        // 綁定按鈕事件
        this.bindEvents();
        
        // 初始更新
        this.update();
        
        // 監聽遊戲事件
        this.setupEventListeners();
        
        console.log('UI 管理器初始化完成');
    }
    
    // ====================================
    // 事件綁定
    // ====================================
    
    bindEvents() {
        // 修煉按鈕
        if (this.elements.cultivateBtn) {
            this.elements.cultivateBtn.addEventListener('click', () => {
                if (this.player.isCultivating) {
                    this.game.stopCultivation();
                } else {
                    this.game.startCultivation();
                }
            });
        }
        
        // 渡劫按鈕
// 渡劫按鈕
if (this.elements.breakthroughBtn) {
    this.elements.breakthroughBtn.addEventListener('click', () => {
        this.game.attemptBreakthrough();
    });
}

// ⭐ 新增：自動修煉按鈕
if (this.elements.autoCultivateBtn) {
    this.elements.autoCultivateBtn.addEventListener('click', () => {
        this.game.toggleAutoCultivation();
        this.updateAutoCultivateButton();
    });
}    
}
    
    // 設置事件監聽器
    setupEventListeners() {
        // 修煉開始
        this.game.on('cultivationStart', (data) => {
            this.updateCultivationStatus();
        });
        
        // 修煉完成
        this.game.on('cultivationComplete', (data) => {
            this.updateCultivationStatus();
            this.update();
        });
        
        // 境界提升
        this.game.on('stageAdvance', (data) => {
            this.showRealmAdvanceEffect();
        });
        
        // 渡劫成功
        this.game.on('breakthroughSuccess', (data) => {
            this.showBreakthroughSuccessEffect();
            this.update();
        });
        
        // 渡劫失敗
        this.game.on('breakthroughFailure', (data) => {
            this.update();
        });
        
        // 訊息顯示
        this.game.on('message', (data) => {
            this.showMessage(data.message, data.type);
        });
    }
    
    // ====================================
    // UI 更新
    // ====================================
    
    // 更新所有 UI
update() {
    this.updateRealmDisplay();
    this.updateCultivationDisplay();
    this.updateCultivationStatus();
    this.updateBreakthroughButton();
    this.updateAutoCultivateButton(); // ⭐ 新增
    this.updateStatistics();
}
    
    // 更新境界顯示
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
    
    // 更新修為顯示
    updateCultivationDisplay() {
        const current = this.player.cultivation;
        const stageReq = this.player.getCurrentStageRequirement();
        const nextReq = this.player.getNextStageRequirement();
        const progress = this.player.getCultivationProgress();
        
        // 修為數值
        if (this.elements.cultivation) {
            this.elements.cultivation.innerHTML = formatCultivation(current);
        }
        
        // 修為進度
        if (this.elements.cultivationProgress) {
            this.elements.cultivationProgress.textContent = 
                `${formatNumber(current)} / ${formatNumber(nextReq)}`;
        }
        
        // 進度條
        if (this.elements.cultivationBar) {
            this.elements.cultivationBar.style.width = progress + '%';
        }
        
        // 百分比
        if (this.elements.cultivationPercent) {
            this.elements.cultivationPercent.textContent = formatPercent(progress, 1);
        }
    }
    
    // 更新修煉狀態
    updateCultivationStatus() {
        const isCultivating = this.player.isCultivating;
        
        // 修煉按鈕
        if (this.elements.cultivateBtn) {
            if (isCultivating) {
                this.elements.cultivateBtn.textContent = '⏸️ 停止修煉';
                this.elements.cultivateBtn.classList.add('cultivating');
            } else {
                this.elements.cultivateBtn.textContent = '🧘 開始修煉';
                this.elements.cultivateBtn.classList.remove('cultivating');
            }
        }
        
        // 修煉狀態顯示
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
    
    // 更新渡劫按鈕
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
        
        // 渡劫資訊
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
    
    // 更新統計資訊
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
    // ⭐ 新增：更新自動修煉按鈕
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
    
    // ====================================
    // 特效顯示
    // ====================================
    
    // 顯示境界提升特效
    showRealmAdvanceEffect() {
        // 簡單的閃爍效果
        if (this.elements.realmName) {
            this.elements.realmName.classList.add('level-up');
            setTimeout(() => {
                this.elements.realmName.classList.remove('level-up');
            }, 1000);
        }
    }
    
    // 顯示渡劫成功特效
    showBreakthroughSuccessEffect() {
        // 全屏閃光效果
        const flash = document.createElement('div');
        flash.className = 'breakthrough-flash';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 1000);
    }
    
    // 顯示訊息
    showMessage(message, type = 'info') {
        if (!this.elements.messageBox) return;
        
        const msgElement = document.createElement('div');
        msgElement.className = `message message-${type}`;
        msgElement.textContent = message;
        
        this.elements.messageBox.appendChild(msgElement);
        
        // 3 秒後移除
        setTimeout(() => {
            msgElement.classList.add('fade-out');
            setTimeout(() => {
                msgElement.remove();
            }, 500);
        }, 3000);
    }
}