// 等待 DOM 內容完全載入後執行
document.addEventListener('DOMContentLoaded', () => {
    // 定義翻譯文字
    const translations = {
        en: {
            status: "Ad blocking is active",
            version: "Version"
        },
        zh: {
            status: "廣告攔截已啟用",
            version: "版本"
        }
    };

    // 取得瀏覽器的語言設定
    const userLang = navigator.language || navigator.userLanguage;
    
    // 判斷語言是否為中文 (例如 'zh', 'zh-TW', 'zh-CN')
    const isChinese = userLang.toLowerCase().startsWith('zh');

    // 根據判斷結果選擇對應的語言，預設為英文
    const lang = isChinese ? 'zh' : 'en';
    const currentTranslation = translations[lang];

    // 取得需要更新文字的 HTML 元素
    const statusEl = document.getElementById('status');
    const versionEl = document.getElementById('version');

    // 如果元素存在，就更新其文字內容
    if (statusEl) {
        statusEl.innerText = currentTranslation.status;
    }
    
    if (versionEl) {
        versionEl.innerText = `${currentTranslation.version} 1.1.1`;
    }
});
