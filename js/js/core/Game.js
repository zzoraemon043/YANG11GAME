



class Game {
    constructor() {
        
        this.player = new Player();
        
        
        this.isRunning = false;
        this.isPaused = false;
        
        
        this.lastUpdateTime = Date.now();
        this.gameLoopInterval = null;
        
        
        this.cultivationSystem = null;
        this.breakthroughSystem = null;
        this.uiManager = null;
        
        
        this.resourceManager = null;
        this.techniqueSystem = null;
        this.farmSystem = null;
        this.alchemySystem = null;
        this.caveSystem = null;
        this.caveUIManager = null;
        
        
        this.eventListeners = {};
    }
    
    
    
    
    
    
    init() {
        console.log('遊戲初始化中...');
        
        
        this.cultivationSystem = new CultivationSystem(this);
        this.breakthroughSystem = new BreakthroughSystem(this);
        
        
        this.resourceManager = new ResourceManager(this);
        this.techniqueSystem = new TechniqueSystem(this);     
        this.farmSystem = new FarmSystem(this);            
         this.alchemySystem = new AlchemySystem(this);         
         this.caveSystem = new CaveSystem(this);              
        
        
        this.uiManager = new UIManager(this);
         this.caveUIManager = new CaveUIManager(this);         
        
        this.uiManager.init();
         this.caveUIManager.init();                         
        
        
        this.start();
        
        console.log('遊戲初始化完成！');
        
        
        this.emit('gameStart');
    }
    
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastUpdateTime = Date.now();
        
        
        this.gameLoopInterval = setInterval(() => {
            this.update();
        }, 100);
        
        console.log('遊戲開始運行');
    }
    
    
    pause() {
        this.isPaused = true;
        console.log('遊戲已暫停');
    }
    
    
    resume() {
        this.isPaused = false;
        this.lastUpdateTime = Date.now();
        console.log('遊戲繼續');
    }
    
    
    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
        
        console.log('遊戲已停止');
    }
    
    
    
    
    
    
    update() {
        if (!this.isRunning || this.isPaused) return;
        
        
        const now = Date.now();
        const deltaTime = (now - this.lastUpdateTime) / 1000; 
        this.lastUpdateTime = now;
        
        
        this.player.playTime += deltaTime;
        
        
        this.player.updateCooldown(deltaTime);
        
        
        if (this.cultivationSystem) {
            this.cultivationSystem.update(deltaTime);
        }
        
        
        if (this.farmSystem) {
            this.farmSystem.update(deltaTime);
        }
        if (this.alchemySystem) {
            this.alchemySystem.update(deltaTime);
        }
        if (this.caveSystem) {
            this.caveSystem.update(deltaTime);
        }
        
        
        if (this.uiManager) {
            this.uiManager.update();
        }
    }
    
    
    
    
    
    
    on(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
    }
    
    
    emit(eventName, data = {}) {
        if (!this.eventListeners[eventName]) return;
        
        this.eventListeners[eventName].forEach(callback => {
            callback(data);
        });
    }
    
    
    
    
    
    
    startCultivation() {
        if (!this.cultivationSystem) return;
        this.cultivationSystem.startCultivation();
    }
    
    
    stopCultivation() {
        if (!this.cultivationSystem) return;
        this.cultivationSystem.stopCultivation();
    }
    
    
    attemptBreakthrough() {
        if (!this.breakthroughSystem) return;
        this.breakthroughSystem.attemptBreakthrough();
    }
    
    
    toggleAutoCultivation() {
        if (!this.cultivationSystem) return;
        this.cultivationSystem.toggleAutoCultivation();
    }
    
    
    
    
    
    
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
    
    
    
    
    
    
    showMessage(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        this.emit('message', { message, type });
    }
    
    
    showCultivationComplete(gain) {
        const message = `修煉完成！獲得 ${formatNumber(gain)} 修為`;
        this.showMessage(message, 'success');
    }
    
    
    showRealmAdvance() {
        const message = `突破成功！進入 ${this.player.getFullRealmName()}`;
        this.showMessage(message, 'success');
    }
    
    
    showBreakthroughResult(success, message) {
        const type = success ? 'success' : 'error';
        this.showMessage(message, type);
    }
    
    
    
    
    
    
    getGameState() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            player: this.player.toJSON(),
            playTime: this.player.playTime
        };
    }
    
    
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
    
    
    debugAddResources() {
        console.log('=== 調試：添加測試資源 ===');
        
        
        this.resourceManager.addSpiritStone(10000, false);
        console.log('靈石: +10000');
        
        
        this.resourceManager.addSeed('huang', 10, false);
        this.resourceManager.addSeed('xuan', 5, false);
        this.resourceManager.addSeed('di', 3, false);
        this.resourceManager.addSeed('tian', 1, false);
        console.log('種子已添加');
        
        
        const testHerbs = ['青靈芝', '白雲草', '紫雲花', '金剛根'];
        testHerbs.forEach(herb => {
            this.resourceManager.addHerb(herb, 20, false);
        });
        console.log('靈草已添加');
        
        this.showMessage('調試資源已添加', 'info');
        console.log('資源摘要:', this.resourceManager.getResourcesSummary());
    }
}