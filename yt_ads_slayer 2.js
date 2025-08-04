// 專為 YouTube 設計的輕量級廣告攔截腳本

// 檢查當前頁面是否為 YouTube
if (window.location.hostname.includes('youtube.com')) {

  /**
   * 處理並移除 YouTube 觀看頁面 (watch page) 上的影片內廣告。
   * - 加速影片廣告。
   * - 自動點擊「略過廣告」按鈕。
   */
  const handleWatchPageAds = () => {
    // 1. 加速影片播放器中的廣告
    // 尋找 .ad-showing 標記，這是處理影片廣告的關鍵
    const adVideo = document.querySelector('.ad-showing .html5-main-video');
    if (adVideo) {
      adVideo.muted = true;
      // 將影片時間快轉到結尾，達到立即跳過的效果
      adVideo.currentTime = adVideo.duration || 9999;
    }

    // 2. 自動點擊各種「略過廣告」按鈕
    const skipButtons = [
			'.ytp-skip-ad-button', 
			'.ytp-ad-skip-button', 
			'.ytp-ad-skip-button-modern',
    ];
    document.querySelectorAll(skipButtons.join(', ')).forEach(button => {
      if (button && typeof button.click === 'function') {
        button.click();
      }
    });
  };

  /**
   * 處理並移除 YouTube 所有頁面 (包含首頁、搜尋頁) 上的靜態廣告版位。
   * - 尋找並隱藏廣告的「整個容器」，以徹底消除空白區域。
   */
  const handleGeneralAds = () => {
    const adSelectors = [
      "ytd-player-legacy-desktop-watch-ads-renderer", // 播放
	  
	  
      "ytd-ad-inline-playback-meta-block", //主頁 置頂廣告
      'ytd-ad-slot-renderer',// 主頁 主要圖片縮圖廣告
	  "ytd-in-feed-ad-layout-renderer", // 主頁 動態消息中的廣告版面配置 (In-feed Ad Layout)
      "ytd-video-masthead-ad-v3-renderer", //主頁? 影片上方的橫幅廣告 (Masthead Ad)
	  
      'ytd-ad-inline-playback-renderer',//主頁 

      "ytd-display-ad-renderer", // 顯示廣告 (Display Ad)
      "ytd-promoted-sparkles-web-renderer", // 首頁
      "ytd-compact-promoted-video-renderer", // 緊湊型的推廣影片 (Compact Promoted Video)
      "ytd-action-companion-ad-renderer", // 影片旁的行動呼籲廣告 (Action Companion Ad)
      "ytd-action-engagement-panel-content-renderer", // 參與面板中的行動呼籲廣告內容 (Action Engagement Panel Content)
      "ytd-banner-promo-renderer", // 橫幅推廣 (Banner Promo)


	  
      "ytd-engagement-panel-title-header-renderer", //播放 主要廣告 參與面板中的標題廣告 (Engagement Panel Ad)
      "ytd-ads-engagement-panel-content-renderer", // 播放 主要廣告 參與面板中的廣告內容 (Ads Engagement Panel Content)
	  'tp-yt-iron-overlay-backdrop', //播放
      'panel-ad-header-image-lockup-view-model', //播放
	  

	  
      'ytd-enforcement-message-view-model', //播放 反廣告攔截器的提示
	  '.ytp-ad-module',
	  '.video-ads', //主頁 播放 片尾圖片

    ];

    document.querySelectorAll(adSelectors.join(', ')).forEach(adElement => {
        /* 再次確認，絕對不要隱藏這兩個父容器本身
        if (adElement.id === 'player-ads' || adElement.classList.contains('ad-showing')) {
            return; // 跳過此元素，不進行任何操作
        }*/
      
      // 往上尋找最接近的父層容器，確保整個廣告區塊被隱藏
      const container = adElement.closest(
        'ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-ad-inline-playback-renderer, tp-yt-paper-dialog'
      );

      // 如果找到容器，就隱藏容器，否則隱藏原始的廣告元素
      const elementToHide = container || adElement;
      if (elementToHide.style.display !== 'none') {
        elementToHide.style.setProperty('display', 'none', 'important');
      }
    });
  };

//根據當前頁面路徑，決定執行哪個廣告處理函數
   
  const runAdChecks = () => {
    // 這個函數對所有頁面都有效
    handleGeneralAds();
	
    // 這個函數只在影片觀看頁面執行
    if (window.location.pathname === '/watch') {
      handleWatchPageAds();
    }
  };

  // 使用 MutationObserver 來監控頁面的動態變化，確保新載入的廣告也能被處理
  const observer = new MutationObserver(runAdChecks);

   observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true, // 啟用屬性監視
    //attributeFilter: ['style', 'hidden'] // 指定只關心 style 和 hidden 屬性的變化，提升效能
  });
  

  // 頁面初次載入時，立即執行一次檢查
  runAdChecks();
  console.log('YT Ads Slayer Lite is active.');
}
