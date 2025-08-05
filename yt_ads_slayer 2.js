// 專為 YouTube 設計的輕量級廣告攔截腳本

// 檢查當前頁面是否為 YouTube
if (window.location.hostname.includes('youtube.com')) {

  /**
   * 向背景腳本發送訊息，通知一個廣告已被攔截。
   */
  const reportAdBlocked = () => {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'AD_BLOCKED' });
    }
  };

  /**
   * 處理並移除 YouTube 觀看頁面 (watch page) 上的影片內廣告。
   * - 加速影片廣告。
   * - 自動點擊「略過廣告」按鈕。
   */
  const handleWatchPageAds = () => {
    // 1. 加速影片播放器中的廣告
    const adVideo = document.querySelector('.ad-showing .html5-main-video');
    if (adVideo) {
      adVideo.muted = true;
      adVideo.currentTime = adVideo.duration || 9999;
      reportAdBlocked(); // 回報已攔截
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
        reportAdBlocked(); // 回報已攔截
      }
    });
  };

  /**
   * 處理並移除 YouTube 所有頁面 (包含首頁、搜尋頁) 上的靜態廣告版位。
   * - 尋找並隱藏廣告的「整個容器」，以徹底消除空白區域。
   */
  const handleGeneralAds = () => {
    const adSelectors = [
      "ytd-player-legacy-desktop-watch-ads-renderer",
      "ytd-ad-inline-playback-meta-block",
      'ytd-ad-slot-renderer',
	  "ytd-in-feed-ad-layout-renderer",
      "ytd-video-masthead-ad-v3-renderer",
      'ytd-ad-inline-playback-renderer',
      "ytd-display-ad-renderer",
      "ytd-promoted-sparkles-web-renderer",
      "ytd-compact-promoted-video-renderer",
      "ytd-action-companion-ad-renderer",
      "ytd-action-engagement-panel-content-renderer",
      "ytd-banner-promo-renderer",
      "ytd-engagement-panel-title-header-renderer",
      "ytd-ads-engagement-panel-content-renderer",
	  'tp-yt-iron-overlay-backdrop',
      'panel-ad-header-image-lockup-view-model',
	  '.video-ads',
    ];

    document.querySelectorAll(adSelectors.join(', ')).forEach(adElement => {
      const container = adElement.closest(
        'ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-ad-inline-playback-renderer'
      );
      const elementToHide = container || adElement;
      if (elementToHide.style.display !== 'none') {
        elementToHide.style.setProperty('display', 'none', 'important');
        reportAdBlocked(); // 回報已攔截
      }
    });
  };

  const runAdChecks = () => {
    handleGeneralAds();
    if (window.location.pathname === '/watch') {
      handleWatchPageAds();
    }
  };

  const observer = new MutationObserver(runAdChecks);

   observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
  });
  
  runAdChecks();
}
