




function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    
    num = Number(num);
    
    
    if (num < 10000) {
        return num.toLocaleString('zh-TW');
    }
    
    
    const units = [
        { value: 1e12, suffix: 'T' },  
        { value: 1e9, suffix: 'B' },   
        { value: 1e6, suffix: 'M' },   
        { value: 1e3, suffix: 'K' }    
    ];
    
    for (let unit of units) {
        if (num >= unit.value) {
            const formatted = (num / unit.value).toFixed(2);
            return formatted + unit.suffix;
        }
    }
    
    return num.toLocaleString('zh-TW');
}


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


function formatPercent(value, decimals = 1) {
    if (value === null || value === undefined) return '0%';
    return value.toFixed(decimals) + '%';
}


function formatProgressBar(current, max, length = 20) {
    const percent = Math.min(100, Math.max(0, (current / max) * 100));
    const filled = Math.floor((percent / 100) * length);
    const empty = length - filled;
    
    return '█'.repeat(filled) + '░'.repeat(empty);
}


function formatCultivation(cultivation) {
    if (cultivation < 1000) return formatNumber(cultivation);
    if (cultivation < 100000) return `<span class="cultivation-low">${formatNumber(cultivation)}</span>`;
    if (cultivation < 1000000) return `<span class="cultivation-mid">${formatNumber(cultivation)}</span>`;
    return `<span class="cultivation-high">${formatNumber(cultivation)}</span>`;
}


function getRealmColorClass(realmIndex) {
    const colors = [
        'realm-qi',        
        'realm-foundation', 
        'realm-golden',    
        'realm-nascent',   
        'realm-spirit',    
        'realm-unity',     
        'realm-mahayana',  
        'realm-tribulation' 
    ];
    
    return colors[realmIndex] || 'realm-default';
}


function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}


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