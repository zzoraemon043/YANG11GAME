// ====================================
// 遊戲核心管理器
// ====================================

class Game {
    constructor() {
        // 玩家實例
        this.player = new Player();
        
        // 遊戲狀態
        this.isRunning = false;
        this.isPaused = false;
        
        // 時間管理
        this.lastUpdateTime = Date.now();
        this.gameLoopInterval = null;
        
        // 原有系統管理器
        this.cultivationSystem = null;
        this.breakthroughSystem = null;
        this.uiManager = null;
        
        // 🆕 洞府系統管理器
        this.resourceManager = null;
        this.techniqueSystem = null;
        this.farmSystem = null;
        this.alchemySystem = null;
        this.caveSystem = null;
        this.caveUIManager = null;
        
        // 事件監聽器
        this.eventListeners = {};
    }
    
    // ====================================
    // 遊戲生命週期
    // ====================================
    
    // 初始化遊戲
    init() {
        console.log('遊戲初始化中...');
        
        // 初始化原有系統
        this.cultivationSystem = new CultivationSystem(this);
        this.breakthroughSystem = new BreakthroughSystem(this);
        
        // 🆕 初始化洞府系統
        this.resourceManager = new ResourceManager(this);
        this.techniqueSystem = new TechniqueSystem(this);     
        this.farmSystem = new FarmSystem(this);            
         this.alchemySystem = new AlchemySystem(this);         
         this.caveSystem = new CaveSystem(this);              
        
        // 初始化UI
        this.uiManager = new UIManager(this);
         this.caveUIManager = new CaveUIManager(this);         
        
        this.uiManager.init();
         this.caveUIManager.init();                         
        
        // 啟動遊戲循環
        this.start();
        
        console.log('遊戲初始化完成！');
        
        // 觸發遊戲開始事件
        this.emit('gameStart');
    }
    
    // 啟動遊戲
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastUpdateTime = Date.now();
        
        // 啟動遊戲主循環（每秒更新10次）
        this.gameLoopInterval = setInterval(() => {
            this.update();
        }, 100);
        
        console.log('遊戲開始運行');
    }
    
    // 暫停遊戲
    pause() {
        this.isPaused = true;
        console.log('遊戲已暫停');
    }
    
    // 繼續遊戲
    resume() {
        this.isPaused = false;
        this.lastUpdateTime = Date.now();
        console.log('遊戲繼續');
    }
    
    // 停止遊戲
    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
        
        console.log('遊戲已停止');
    }
    
    // ====================================
    // 遊戲主循環
    // ====================================
    
    // 更新遊戲狀態
    update() {
        if (!this.isRunning || this.isPaused) return;
        
        // 計算時間差
        const now = Date.now();
        const deltaTime = (now - this.lastUpdateTime) / 1000; // 轉換為秒
        this.lastUpdateTime = now;
        
        // 更新玩家遊戲時間
        this.player.playTime += deltaTime;
        
        // 更新渡劫冷卻
        this.player.updateCooldown(deltaTime);
        
        // 更新修煉系統
        if (this.cultivationSystem) {
            this.cultivationSystem.update(deltaTime);
        }
        
        // 🆕 更新洞府系統
        if (this.farmSystem) {
            this.farmSystem.update(deltaTime);
        }
        if (this.alchemySystem) {
            this.alchemySystem.update(deltaTime);
        }
        if (this.caveSystem) {
            this.caveSystem.update(deltaTime);
        }
        
        // 更新UI
        if (this.uiManager) {
            this.uiManager.update();
        }
    }
    
    // ====================================
    // 事件系統
    // ====================================
    
    // 註冊事件監聽
    on(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
    }
    
    // 觸發事件
    emit(eventName, data = {}) {
        if (!this.eventListeners[eventName]) return;
        
        this.eventListeners[eventName].forEach(callback => {
            callback(data);
        });
    }
    
    // ====================================
    // 玩家操作
    // ====================================
    
    // 開始修煉
    startCultivation() {
        if (!this.cultivationSystem) return;
        this.cultivationSystem.startCultivation();
    }
    
    // 停止修煉
    stopCultivation() {
        if (!this.cultivationSystem) return;
        this.cultivationSystem.stopCultivation();
    }
    
    // 嘗試渡劫
    attemptBreakthrough() {
        if (!this.breakthroughSystem) return;
        this.breakthroughSystem.attemptBreakthrough();
    }
    
    // 切換自動修煉
    toggleAutoCultivation() {
        if (!this.cultivationSystem) return;
        this.cultivationSystem.toggleAutoCultivation();
    }
    
    // ====================================
    // 存檔系統
    // ====================================
    
    // 儲存遊戲
    save() {
        const saveData = {
            player: this.player.toJSON(),
            saveTime: Date.now()
        };
        
        try {
            localStorage.setItem('xiuxian_save', JSON.stringify(saveData));
            console.log('遊戲已儲存');
            this.showMessage('遊戲已儲存', 'success');
            return true;
        } catch (error) {
            console.error('儲存失敗:', error);
            this.showMessage('儲存失敗', 'error');
            return false;
        }
    }
    
    // 載入遊戲
    load() {
        try {
            const saveData = localStorage.getItem('xiuxian_save');
            
            if (!saveData) {
                console.log('沒有存檔資料');
                return false;
            }
            
            const data = JSON.parse(saveData);
            this.player.fromJSON(data.player);
            
            console.log('遊戲已載入');
            this.showMessage('遊戲已載入', 'success');
            
            // 更新UI
            if (this.uiManager) {
                this.uiManager.update();
            }
            
            return true;
        } catch (error) {
            console.error('載入失敗:', error);
            this.showMessage('載入失敗', 'error');
            return false;
        }
    }
    
    // 刪除存檔
    deleteSave() {
        try {
            localStorage.removeItem('xiuxian_save');
            console.log('存檔已刪除');
            this.showMessage('存檔已刪除', 'info');
            return true;
        } catch (error) {
            console.error('刪除失敗:', error);
            return false;
        }
    }
    
    // ====================================
    // UI 輔助方法
    // ====================================
    
    // 顯示訊息
    showMessage(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        this.emit('message', { message, type });
    }
    
    // 顯示修煉完成訊息
    showCultivationComplete(gain) {
        const message = `修煉完成！獲得 ${formatNumber(gain)} 修為`;
        this.showMessage(message, 'success');
    }
    
    // 顯示境界提升訊息
    showRealmAdvance() {
        const message = `突破成功！進入 ${this.player.getFullRealmName()}`;
        this.showMessage(message, 'success');
    }
    
    // 顯示渡劫結果
    showBreakthroughResult(success, message) {
        const type = success ? 'success' : 'error';
        this.showMessage(message, type);
    }
    
    // ====================================
    // 調試方法
    // ====================================
    
    // 獲取遊戲狀態
    getGameState() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            player: this.player.toJSON(),
            playTime: this.player.playTime
        };
    }
    
    // 重置遊戲
    reset() {
        this.stop();
        this.player = new Player();
        this.deleteSave();
        
        if (this.uiManager) {
            this.uiManager.update();
        }
        
        this.start();
        this.showMessage('遊戲已重置', 'info');
    }
    
    // 🆕 調試用 - 測試資源系統
    debugAddResources() {
        console.log('=== 調試：添加測試資源 ===');
        
        // 添加靈石
        this.resourceManager.addSpiritStone(10000, false);
        console.log('靈石: +10000');
        
        // 添加種子
        this.resourceManager.addSeed('huang', 10, false);
        this.resourceManager.addSeed('xuan', 5, false);
        this.resourceManager.addSeed('di', 3, false);
        this.resourceManager.addSeed('tian', 1, false);
        console.log('種子已添加');
        
        // 添加靈草
        const testHerbs = ['青靈芝', '白雲草', '紫雲花', '金剛根'];
        testHerbs.forEach(herb => {
            this.resourceManager.addHerb(herb, 20, false);
        });
        console.log('靈草已添加');
        
        this.showMessage('調試資源已添加', 'info');
        console.log('資源摘要:', this.resourceManager.getResourcesSummary());
    }
}