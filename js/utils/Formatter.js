// ====================================
// 格式化工具函數
// ====================================

// 格式化數字顯示
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    
    num = Number(num);
    
    // 小於 1 萬：直接顯示
    if (num < 10000) {
        return num.toLocaleString('zh-TW');
    }
    
    // 1 萬以上：使用單位
    const units = [
        { value: 1e12, suffix: 'T' },  // 兆
        { value: 1e9, suffix: 'B' },   // 十億
        { value: 1e6, suffix: 'M' },   // 百萬
        { value: 1e3, suffix: 'K' }    // 千
    ];
    
    for (let unit of units) {
        if (num >= unit.value) {
            const formatted = (num / unit.value).toFixed(2);
            return formatted + unit.suffix;
        }
    }
    
    return num.toLocaleString('zh-TW');
}

// 格式化時間顯示（秒數轉換為易讀格式）
function formatTime(seconds) {
    if (seconds === null || seconds === undefined) return '0秒';
    
    seconds = Math.floor(seconds);
    
    if (seconds < 60) {
        return `${seconds}秒`;
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let result = [];
    
    if (hours > 0) result.push(`${hours}時`);
    if (minutes > 0) result.push(`${minutes}分`);
    if (secs > 0 || result.length === 0) result.push(`${secs}秒`);
    
    return result.join('');
}

// 格式化百分比
function formatPercent(value, decimals = 1) {
    if (value === null || value === undefined) return '0%';
    return value.toFixed(decimals) + '%';
}

// 格式化進度條
function formatProgressBar(current, max, length = 20) {
    const percent = Math.min(100, Math.max(0, (current / max) * 100));
    const filled = Math.floor((percent / 100) * length);
    const empty = length - filled;
    
    return '█'.repeat(filled) + '░'.repeat(empty);
}

// 格式化修為顯示（帶顏色等級）
function formatCultivation(cultivation) {
    if (cultivation < 1000) return formatNumber(cultivation);
    if (cultivation < 100000) return `<span class="cultivation-low">${formatNumber(cultivation)}</span>`;
    if (cultivation < 1000000) return `<span class="cultivation-mid">${formatNumber(cultivation)}</span>`;
    return `<span class="cultivation-high">${formatNumber(cultivation)}</span>`;
}

// 獲取境界顏色類名
function getRealmColorClass(realmIndex) {
    const colors = [
        'realm-qi',        // 煉氣 - 白色
        'realm-foundation', // 築基 - 綠色
        'realm-golden',    // 金丹 - 金色
        'realm-nascent',   // 元嬰 - 藍色
        'realm-spirit',    // 化神 - 紫色
        'realm-unity',     // 合道 - 紅色
        'realm-mahayana',  // 大乘 - 橙色
        'realm-tribulation' // 渡劫 - 黑色
    ];
    
    return colors[realmIndex] || 'realm-default';
}

// 格式化日期時間
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 獲取相對時間描述（例如：3分鐘前）
function getRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小時前`;
    if (minutes > 0) return `${minutes}分鐘前`;
    if (seconds > 0) return `${seconds}秒前`;
    return '剛剛';
}