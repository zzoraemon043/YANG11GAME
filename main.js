




document.addEventListener('DOMContentLoaded', function() {
    console.log('=================================');
    console.log('   修仙模擬器 v1.0');
    console.log('=================================');
    
    
    game = new Game();
    
    
    game.init();
    
    
    const hasSave = game.load();
    
    if (hasSave) {
        console.log('存檔已載入');
    } else {
        console.log('開始新遊戲');
        game.showMessage('歡迎來到修仙世界！開始你的修煉之旅吧！', 'info');
    }
    
    
    setInterval(() => {
        if (game.isRunning) {
            game.save();
        }
    }, 30000);
    
    
    window.addEventListener('beforeunload', () => {
        game.save();
    });
    
    
    window.game = game;
    
    console.log('遊戲啟動完成！');
    console.log('提示：可以在控制台輸入 game 查看遊戲狀態');
});
