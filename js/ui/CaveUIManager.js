// ====================================
// 洞府UI管理器
// ====================================

class CaveUIManager {
    constructor(game) {
        this.game = game;
        this.player = game.player;
        
        // 當前顯示的頁面
        this.currentPage = 'cultivation'; // cultivation, cave
        this.currentFacility = null; // library, mine, array, farm, alchemy
        
        // DOM 元素
        this.elements = {};
    }
    
    // ====================================
    // 初始化
    // ====================================
    
    init() {
        console.log('洞府UI管理器初始化中...');
        
        // 獲取 DOM 元素
        this.elements = {
            // 選單按鈕
            menuCultivation: document.getElementById('menu-cultivation'),
            menuCave: document.getElementById('menu-cave'),
            menuExplore: document.getElementById('menu-explore'),
            menuSect: document.getElementById('menu-sect'),
            menuBattle: document.getElementById('menu-battle'),
            
            // 洞府頁面
            cavePage: document.getElementById('cave-page'),
            caveDetailArea: document.getElementById('cave-detail-area'),
            
            // 洞府資源顯示
            caveSpiritStone: document.getElementById('cave-spirit-stone'),
            caveStorage: document.getElementById('cave-storage'),
            
            // 設施按鈕
            caveLibrary: document.getElementById('cave-library'),
            caveMine: document.getElementById('cave-mine'),
            caveArray: document.getElementById('cave-array'),
            caveFarm: document.getElementById('cave-farm'),
            caveAlchemy: document.getElementById('cave-alchemy')
        };
        
        // 綁定事件
        this.bindEvents();
        
        console.log('洞府UI管理器初始化完成');
    }
    
    // ====================================
    // 事件綁定
    // ====================================
    
    bindEvents() {
        // 選單按鈕
    // 選單按鈕（底部選單）
    if (this.elements.menuCultivation) {
        this.elements.menuCultivation.addEventListener('click', () => {
            this.switchPage('cultivation');
        });
    }
    
    if (this.elements.menuCave) {
        this.elements.menuCave.addEventListener('click', () => {
            this.switchPage('cave');
        });
    }

        // 設施按鈕
        if (this.elements.caveLibrary) {
            this.elements.caveLibrary.addEventListener('click', () => {
                this.showFacility('library');
            });
        }
        
        if (this.elements.caveMine) {
            this.elements.caveMine.addEventListener('click', () => {
                this.showFacility('mine');
            });
        }
        
        if (this.elements.caveArray) {
            this.elements.caveArray.addEventListener('click', () => {
                this.showFacility('array');
            });
        }
        
        if (this.elements.caveFarm) {
            this.elements.caveFarm.addEventListener('click', () => {
                this.showFacility('farm');
            });
        }
        
        if (this.elements.caveAlchemy) {
            this.elements.caveAlchemy.addEventListener('click', () => {
                this.showFacility('alchemy');
            });
        }
    }
    
    // ====================================
    // 頁面切換
    // ====================================
    
switchPage(pageName) {
    this.currentPage = pageName;
    
    // 更新選單按鈕狀態
    document.querySelectorAll('.bottom-menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // ⭐ 獲取兩個頁面元素
    const cultivationPage = document.getElementById('cultivation-page');
    const cavePage = document.getElementById('cave-page');
    
    if (pageName === 'cultivation') {
        // 顯示修煉頁面，隱藏洞府頁面
        if (cultivationPage) {
            cultivationPage.style.display = 'block';
        }
        if (cavePage) {
            cavePage.style.display = 'none';
        }
        
        if (this.elements.menuCultivation) {
            this.elements.menuCultivation.classList.add('active');
        }
        
    } else if (pageName === 'cave') {
        // ⭐ 隱藏修煉頁面，只顯示洞府頁面
        if (cultivationPage) {
            cultivationPage.style.display = 'none';  // ⬅️ 關鍵：隱藏修煉頁面
        }
        if (cavePage) {
            cavePage.style.display = 'block';
        }
        
        if (this.elements.menuCave) {
            this.elements.menuCave.classList.add('active');
        }
        
        // 更新洞府資源顯示
        this.updateCaveResources();
        
        // 如果沒有選擇設施，顯示歡迎訊息
        if (!this.currentFacility && this.elements.caveDetailArea) {
            this.elements.caveDetailArea.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #a0aec0;">
                    <h3>🏠 歡迎來到洞府</h3>
                    <p>請選擇一個設施開始管理</p>
                </div>
            `;
        }
    }
}
    // ====================================
    // 設施顯示
    // ====================================
    
    showFacility(facilityName) {
        this.currentFacility = facilityName;
        
        if (!this.elements.caveDetailArea) return;
        
        switch (facilityName) {
            case 'library':
                this.showLibraryDetail();
                break;
            case 'mine':
                this.showMineDetail();
                break;
            case 'array':
                this.showArrayDetail();
                break;
            case 'farm':
                this.showFarmDetail();
                break;
            case 'alchemy':
                this.showAlchemyDetail();
                break;
        }
    }
    
    // 顯示藏經閣詳情
    showLibraryDetail() {
        const level = this.game.caveSystem.getLibraryLevel();
        const maxSlots = this.player.techniques.maxSlots;
        const owned = this.game.techniqueSystem.getOwnedTechniques().length;
        const upgradeCost = this.game.caveSystem.calculateLibraryUpgradeCost(level + 1);
        
        const html = `
            <div class="facility-detail">
                <h3>📚 藏經閣</h3>
                <div class="facility-info">
                    <p>等級：${level} 級</p>
                    <p>功法容量：${owned} / ${maxSlots}</p>
                    <p>升級費用：${formatNumber(upgradeCost)} 靈石</p>
                </div>
                <button onclick="game.caveSystem.upgradeLibrary(); game.caveUIManager.showFacility('library')">
                    升級藏經閣
                </button>
                
                <div class="technique-list">
                    <h4>已學會的功法：</h4>
                    ${this.renderTechniqueList()}
                </div>
            </div>
        `;
        
        this.elements.caveDetailArea.innerHTML = html;
    }
    
    // 顯示礦脈詳情
    showMineDetail() {
        const level = this.game.caveSystem.getMineLevel();
        const production = this.game.caveSystem.getMineProduction();
        const accumulated = this.game.caveSystem.calculateAccumulated();
        const upgradeCost = this.game.caveSystem.calculateMineUpgradeCost(level + 1);
        
        const html = `
            <div class="facility-detail">
                <h3>⛏️ 靈石礦脈</h3>
                <div class="facility-info">
                    <p>等級：${level} 級</p>
                    <p>產量：${formatNumber(production)} 靈石/小時</p>
                    <p>已累積：${formatNumber(accumulated)} 靈石</p>
                    <p>升級費用：${formatNumber(upgradeCost)} 靈石</p>
                </div>
                <button onclick="game.caveSystem.upgradeMine(); game.caveUIManager.showFacility('mine')">
                    升級礦脈
                </button>
                <button onclick="game.caveSystem.collectMine(); game.caveUIManager.updateCaveResources()">
                    💎 收取靈石
                </button>
            </div>
        `;
        
        this.elements.caveDetailArea.innerHTML = html;
    }
    
    // 顯示聚靈陣詳情
    showArrayDetail() {
        const level = this.game.caveSystem.getArrayLevel();
        const bonus = this.game.caveSystem.getArrayBonus();
        const upgradeCost = this.game.caveSystem.calculateArrayUpgradeCost(level + 1);
        
        const html = `
            <div class="facility-detail">
                <h3>✨ 聚靈陣</h3>
                <div class="facility-info">
                    <p>等級：${level} 級</p>
                    <p>修煉加成：+${bonus}%</p>
                    <p>礦脈加成：+${bonus}%</p>
                    <p>升級費用：${formatNumber(upgradeCost)} 靈石</p>
                </div>
                <button onclick="game.caveSystem.upgradeArray(); game.caveUIManager.showFacility('array')">
                    升級聚靈陣
                </button>
            </div>
        `;
        
        this.elements.caveDetailArea.innerHTML = html;
    }
    
    // 顯示靈田詳情
    showFarmDetail() {
        const farmInfo = this.game.farmSystem.getFarmSystemInfo();
        
        const html = `
            <div class="facility-detail">
                <h3>🌱 靈田</h3>
                <div class="facility-info">
                    <p>等級：${farmInfo.level} 級</p>
                    <p>靈田數量：${farmInfo.unlockedCount} / ${farmInfo.maxCount}</p>
                    <p>升級費用：${formatNumber(farmInfo.upgradeCost)} 靈石</p>
                </div>
                <button onclick="game.farmSystem.upgradeFarm(); game.caveUIManager.showFacility('farm')">
                    升級靈田
                </button>
                <button onclick="game.farmSystem.harvestAll(); game.caveUIManager.showFacility('farm')">
                    🌾 一鍵收穫
                </button>
                
                <div class="farm-list">
                    <h4>靈田狀態：</h4>
                    ${this.renderFarmList(farmInfo.farms)}
                </div>
            </div>
        `;
        
        this.elements.caveDetailArea.innerHTML = html;
    }
    
    // 顯示煉丹房詳情
    showAlchemyDetail() {
        const alchemyInfo = this.game.alchemySystem.getAlchemySystemInfo();
        
        const html = `
            <div class="facility-detail">
                <h3>💊 煉丹房</h3>
                <div class="facility-info">
                    <p>等級：${alchemyInfo.level} 級</p>
                    <p>煉丹佇列：${alchemyInfo.queueCount} / ${alchemyInfo.maxQueue}</p>
                    <p>升級費用：${formatNumber(alchemyInfo.upgradeCost)} 靈石</p>
                </div>
                <button onclick="game.alchemySystem.upgradeAlchemy(); game.caveUIManager.showFacility('alchemy')">
                    升級煉丹房
                </button>
                
                <div class="alchemy-queue">
                    <h4>煉製中：</h4>
                    ${this.renderAlchemyQueue(alchemyInfo.queue)}
                </div>
                
                <div class="recipe-list">
                    <h4>可煉製的丹方：</h4>
                    ${this.renderRecipeList()}
                </div>
            </div>
        `;
        
        this.elements.caveDetailArea.innerHTML = html;
    }
    
    // ====================================
    // 渲染輔助方法
    // ====================================
    
    renderTechniqueList() {
        const techniques = this.game.techniqueSystem.getOwnedTechniques();
        const active = this.game.techniqueSystem.getActiveTechnique();
        
        if (techniques.length === 0) {
            return '<p>尚無功法</p>';
        }
        
        return techniques.map(name => {
            const isActive = name === active;
            const techniqueData = getTechniqueData(name);
            const rarityClass = getTechniqueRarityClass(techniqueData.rarity);
            
            return `
                <div class="technique-item ${isActive ? 'active' : ''}">
                    <span class="${rarityClass}">${name}</span>
                    ${isActive ? '<span class="badge">運行中</span>' : ''}
                    ${!isActive ? `<button onclick="game.techniqueSystem.switchTechnique('${name}'); game.caveUIManager.showFacility('library')">切換</button>` : ''}
                </div>
            `;
        }).join('');
    }
    
    renderFarmList(farms) {
        return farms.map(farm => {
            if (!farm.unlocked) {
                return `<div class="farm-item locked">靈田 ${farm.index + 1}：未解鎖</div>`;
            }
            
            if (!farm.planting) {
                return `
                    <div class="farm-item empty">
                        靈田 ${farm.index + 1}：空閒
                        <button onclick="game.caveUIManager.plantSeed(${farm.index})">種植</button>
                    </div>
                `;
            }
            
            const seedData = getSeedData(farm.planting);
            const progress = Math.floor(farm.progress);
            
            if (farm.canHarvest) {
                return `
                    <div class="farm-item ready">
                        靈田 ${farm.index + 1}：${seedData.name} (可收穫)
                        <button onclick="game.farmSystem.harvest(${farm.index}); game.caveUIManager.showFacility('farm')">收穫</button>
                    </div>
                `;
            }
            
            return `
                <div class="farm-item growing">
                    靈田 ${farm.index + 1}：${seedData.name} (${progress}%)
                    <div class="mini-progress">
                        <div class="mini-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span>剩餘：${formatTime(farm.remainingTime)}</span>
                </div>
            `;
        }).join('');
    }
    
    renderAlchemyQueue(queue) {
        if (queue.length === 0) {
            return '<p>當前無煉製任務</p>';
        }
        
        return queue.map(task => {
            const progress = Math.floor(task.progress);
            
            if (task.isComplete) {
                return `
                    <div class="alchemy-item complete">
                        ${task.recipeName} (已完成)
                    </div>
                `;
            }
            
            return `
                <div class="alchemy-item">
                    ${task.recipeName} (${progress}%)
                    <div class="mini-progress">
                        <div class="mini-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span>剩餘：${formatTime(task.remainingTime)}</span>
                </div>
            `;
        }).join('');
    }
    
    renderRecipeList() {
        const recipes = this.game.alchemySystem.getAvailableRecipes();
        
        if (recipes.length === 0) {
            return '<p>尚無丹方</p>';
        }
        
        return recipes.map(item => {
            const canAlchemy = item.canAlchemy;
            const recipe = item.recipe;
            
            return `
                <div class="recipe-item ${canAlchemy ? 'available' : 'unavailable'}">
                    <div class="recipe-name">${item.recipeName}</div>
                    <div class="recipe-info">
                        <span>成功率：${item.successRate}%</span>
                        <span>時間：${formatTime(recipe.alchemyTime)}</span>
                        <span>靈石：${formatNumber(recipe.spiritStone)}</span>
                    </div>
                    ${canAlchemy 
                        ? `<button onclick="game.alchemySystem.startAlchemy('${item.recipeName}'); game.caveUIManager.showFacility('alchemy')">煉製</button>`
                        : `<span class="unavailable-reason">${item.reason}</span>`
                    }
                </div>
            `;
        }).join('');
    }
    
    // ====================================
    // 更新方法
    // ====================================
    
    update() {
        // 如果在洞府頁面，更新資源顯示
        if (this.currentPage === 'cave') {
            this.updateCaveResources();
            
            // 如果有顯示設施，刷新設施詳情
            if (this.currentFacility) {
                this.showFacility(this.currentFacility);
            }
        }
    }
    
    updateCaveResources() {
        if (this.elements.caveSpiritStone) {
            this.elements.caveSpiritStone.textContent = formatNumber(
                this.game.resourceManager.getSpiritStone()
            );
        }
        
        if (this.elements.caveStorage) {
            const storage = this.game.resourceManager.getStorageInfo();
            this.elements.caveStorage.textContent = `${storage.used}/${storage.max}`;
        }
    }
    
    // ====================================
    // 輔助方法
    // ====================================
    
    plantSeed(farmIndex) {
        // 簡單實作：種植黃階種子
        // TODO: 顯示種子選擇界面
        if (this.game.resourceManager.hasSeed('huang')) {
            this.game.farmSystem.plantSeed(farmIndex, 'huang');
            this.showFacility('farm');
        } else {
            this.game.showMessage('沒有種子！', 'error');
        }
    }
}