// ====================================
// 遊戲啟動程式
// ====================================

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('=================================');
    console.log('   修仙模擬器 v1.0');
    console.log('=================================');
    
    // 創建遊戲實例
    game = new Game();
    
    // 初始化遊戲
    game.init();
    
    // 嘗試載入存檔
    const hasSave = game.load();
    
    if (hasSave) {
        console.log('存檔已載入');
    } else {
        console.log('開始新遊戲');
        game.showMessage('歡迎來到修仙世界！開始你的修煉之旅吧！', 'info');
    }
    
    // 自動存檔（每30秒）
    setInterval(() => {
        if (game.isRunning) {
            game.save();
        }
    }, 30000);
    
    // 頁面關閉前自動存檔
    window.addEventListener('beforeunload', () => {
        game.save();
    });
    
    // 調試用：將 game 暴露到全域（方便開發者工具測試）
    window.game = game;
    
    console.log('遊戲啟動完成！');
    console.log('提示：可以在控制台輸入 game 查看遊戲狀態');
});
