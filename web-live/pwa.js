(() => {
  'use strict';
  const panel = document.getElementById('infopop');
  if (!panel) return;
  const messages = {
    en: {
      add: 'Add map to phone', installed: 'Opened as an app', installing: 'Opening install…', update: 'Update map', updating: 'Updating…',
      preparing: 'Saving the map for offline use…', ready: 'Offline map ready · saved {date}.', offline: 'Offline · using the saved map ({date}).',
      unavailable: 'Offline saving is unavailable in this browser. An internet connection may be needed.', unavailableOffline: 'You are offline. Reconnect once to save the complete map.',
      snapshot: 'Map and accommodation details are a published snapshot, not live availability. Reopen or refresh online to check for updates. Booking links need internet.',
      ios: 'In Safari, tap Share, then “Add to Home Screen” (under More if needed), and Add. Open the new icon once while online to save its offline map.',
      android: 'In Chrome or your browser menu, choose “Install app” or “Add to Home screen”. If unavailable, bookmark this page. Open the new icon once while online to save its offline map.',
      wechatIOS: 'In WeChat, tap ⋯ and choose Open in Safari. Then use Safari’s Share → Add to Home Screen → Add. Open the new icon once while online.',
      wechatAndroid: 'In WeChat, tap ⋯ and choose Open in browser. In Chrome’s menu, choose Install app or Add to Home screen. Open the new icon once while online.',
      desktop: 'Use your browser’s install icon or menu to install this map. On a phone, open this link in Safari or Chrome and add it to the home screen.',
      promptDone: 'If installed, open the map from its new home-screen icon. Otherwise you can try again from your browser menu.',
      updateFailed: 'The update could not finish. Reconnect and reopen the map to try again.'
    },
    zh: {
      add: '把地图添加到手机桌面', installed: '已在独立应用中打开', installing: '正在打开安装窗口…', update: '更新地图', updating: '正在更新…',
      preparing: '正在保存离线地图…', ready: '离线地图已就绪 · 保存于 {date}。', offline: '当前离线 · 使用 {date} 保存的地图。',
      unavailable: '当前浏览器无法保存离线地图，使用时可能需要联网。', unavailableOffline: '当前处于离线状态。联网打开一次，即可尝试保存完整地图。',
      snapshot: '地图和房源资料是已发布的静态版本，并非实时空房信息。联网时重新打开或刷新可检查新版，预订链接需要网络。',
      ios: '用 Safari 打开，点击“分享”→“添加到主屏幕”（必要时先点“更多”）→“添加”。添加后，请联网打开桌面图标一次，保存离线地图。',
      android: '用 Chrome 等浏览器打开，在菜单中选择“安装应用”或“添加到主屏幕”；若没有此选项，可先收藏网页。添加后，请联网打开桌面图标一次。',
      wechatIOS: '在微信右上角点击“⋯”，选择“在 Safari 中打开”。然后点击 Safari 的“分享”→“添加到主屏幕”→“添加”。添加后，请联网打开桌面图标一次。',
      wechatAndroid: '在微信右上角点击“⋯”，选择“在浏览器打开”。再在 Chrome 菜单中选择“安装应用”或“添加到主屏幕”。添加后，请联网打开桌面图标一次。',
      desktop: '可通过浏览器地址栏的安装图标或菜单安装。手机用户请用 Safari 或 Chrome 打开此链接，再添加到主屏幕。',
      promptDone: '安装成功后，可点击桌面上的地图图标打开；如未安装，也可通过浏览器菜单再试。',
      updateFailed: '更新暂未完成，请联网后重新打开地图再试。'
    },
    ja: {
      add: 'ホーム画面に追加', installed: 'アプリとして表示中', installing: 'インストール画面を開いています…', update: 'マップを更新', updating: '更新中…',
      preparing: 'オフライン用のマップを保存しています…', ready: 'オフライン利用可能 · 保存日時：{date}。', offline: 'オフライン · {date} に保存したマップを表示中。',
      unavailable: 'このブラウザではオフライン保存が利用できません。通信接続が必要な場合があります。', unavailableOffline: 'オフラインです。一度オンラインで開いて、マップ全体を保存してください。',
      snapshot: '地図と物件情報は公開時点の情報で、リアルタイムの空室状況ではありません。オンラインで開き直すか再読み込みすると更新を確認できます。予約リンクには通信が必要です。',
      ios: 'Safari の共有メニューから「ホーム画面に追加」（必要なら「その他」）→「追加」を選んでください。その後、一度オンラインで新しいアイコンを開いてください。',
      android: 'Chrome などのメニューから「アプリをインストール」または「ホーム画面に追加」を選んでください。項目がなければブックマークできます。その後、一度オンラインで新しいアイコンを開いてください。',
      wechatIOS: 'WeChat 右上の「⋯」から Safari で開き、共有→「ホーム画面に追加」→「追加」を選んでください。その後、一度オンラインで新しいアイコンを開いてください。',
      wechatAndroid: 'WeChat 右上の「⋯」からブラウザで開き、Chrome のメニューから「アプリをインストール」または「ホーム画面に追加」を選んでください。その後、一度オンラインで新しいアイコンを開いてください。',
      desktop: 'ブラウザのインストールアイコンまたはメニューを使えます。スマートフォンでは、このリンクを Safari または Chrome で開き、ホーム画面に追加してください。',
      promptDone: 'インストールできたら、ホーム画面のアイコンから開けます。できなかった場合は、ブラウザのメニューからもう一度お試しください。',
      updateFailed: '更新を完了できませんでした。オンラインでマップを開き直してください。'
    }
  };
  const section = document.createElement('section');
  section.className = 'pwa-tools';
  section.innerHTML = '<div class="pwa-actions"><button type="button" id="pwa-install" aria-controls="pwa-help" aria-expanded="false"></button><button type="button" id="pwa-update" class="pwa-update" hidden></button></div><p id="pwa-help" class="pwa-help" hidden></p><p class="pwa-status" role="status" aria-live="polite"></p><p class="pwa-snapshot"></p>';
  panel.append(section);
  const installButton = section.querySelector('#pwa-install');
  const updateButton = section.querySelector('#pwa-update');
  const help = section.querySelector('#pwa-help');
  const status = section.querySelector('.pwa-status');
  const snapshot = section.querySelector('.pwa-snapshot');
  const standaloneMedia = window.matchMedia('(display-mode: standalone)');
  const ios = /iPad|iPhone|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(navigator.userAgent);
  const wechat = /MicroMessenger/i.test(navigator.userAgent);
  let deferredPrompt = null;
  let registration = null;
  let cacheState = null;
  let preparing = 'serviceWorker' in navigator && window.isSecureContext;
  let prompting = false;
  let updating = false;
  let helpMessage = null;
  let updateTimer = null;

  function language() {
    const language = document.documentElement.lang.toLowerCase();
    return language.startsWith('zh') ? 'zh' : language.startsWith('ja') ? 'ja' : 'en';
  }
  function standalone() { return standaloneMedia.matches || navigator.standalone === true; }
  function instruction() {
    if (wechat) return ios ? 'wechatIOS' : 'wechatAndroid';
    return ios ? 'ios' : android ? 'android' : 'desktop';
  }
  function render() {
    const lang = language();
    const m = messages[lang];
    installButton.textContent = prompting ? m.installing : standalone() ? m.installed : m.add;
    installButton.disabled = prompting || standalone();
    updateButton.hidden = !registration?.waiting;
    updateButton.disabled = updating;
    updateButton.textContent = updating ? m.updating : m.update;
    help.textContent = m[helpMessage || instruction()];
    snapshot.textContent = m.snapshot;
    if (cacheState?.ready) {
      const date = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : lang === 'ja' ? 'ja-JP' : 'en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(cacheState.savedAt));
      status.textContent = (navigator.onLine ? m.ready : m.offline).replace('{date}', date);
    } else {
      status.textContent = !navigator.onLine ? m.unavailableOffline : preparing ? m.preparing : m.unavailable;
    }
  }
  function showHelp(key) {
    helpMessage = key || null;
    help.hidden = false;
    installButton.setAttribute('aria-expanded', 'true');
    render();
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    render();
  });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; prompting = false; showHelp('promptDone'); });
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt || wechat) { showHelp(); return; }
    const prompt = deferredPrompt;
    deferredPrompt = null;
    prompting = true;
    render();
    try {
      // Must remain in the click handler: browsers require a real user gesture.
      await prompt.prompt();
      const choice = await prompt.userChoice;
      showHelp(choice.outcome === 'accepted' ? 'promptDone' : undefined);
    } catch (_) { showHelp(); }
    finally { prompting = false; render(); }
  });
  updateButton.addEventListener('click', () => {
    if (!registration?.waiting || updating) return;
    updating = true;
    render();
    registration.waiting.postMessage({ type: 'LSM_ACTIVATE_UPDATE' });
    updateTimer = window.setTimeout(() => {
      updating = false;
      showHelp('updateFailed');
    }, 15000);
  });
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  standaloneMedia.addEventListener?.('change', render);
  window.addEventListener('offline', render);

  function refreshCacheState() {
    const worker = navigator.serviceWorker?.controller || registration?.active;
    if (!worker) { render(); return; }
    const channel = new MessageChannel();
    const timeout = setTimeout(() => { channel.port1.close(); preparing = false; render(); }, 6000);
    channel.port1.onmessage = event => {
      clearTimeout(timeout);
      channel.port1.close();
      if (event.data?.type !== 'LSM_CACHE_STATUS') return;
      cacheState = event.data;
      preparing = false;
      render();
    };
    worker.postMessage({ type: 'LSM_CACHE_STATUS' }, [channel.port2]);
  }
  function watchRegistration(reg) {
    registration = reg;
    render();
    const watchWorker = worker => {
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' || worker.state === 'activated') { refreshCacheState(); render(); }
        if (worker.state === 'redundant') { preparing = false; render(); }
      });
    };
    watchWorker(reg.installing);
    reg.addEventListener('updatefound', () => watchWorker(reg.installing));
    refreshCacheState();
  }
  render();
  if (!preparing) return;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (updating) { clearTimeout(updateTimer); location.reload(); return; }
    refreshCacheState();
  });
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type === 'LSM_CACHE_CHANGED') refreshCacheState();
  });
  window.addEventListener('online', () => {
    render();
    registration?.update().catch(() => {});
    refreshCacheState();
  });
  window.addEventListener('pageshow', refreshCacheState);
  navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' })
    .then(watchRegistration)
    .catch(() => { preparing = false; render(); });
  navigator.serviceWorker.ready.then(reg => { registration = reg; refreshCacheState(); });
})();
