document.addEventListener('DOMContentLoaded', () => {
  // --- カウントダウンタイマー設定 ---
  // ターゲット日時: 2027年1月10日 18:00:00 (日本時間)
  const targetDate = new Date('2027-01-10T18:00:00').getTime();

  const timerDays = document.getElementById('days');
  const timerHours = document.getElementById('hours');
  const timerMinutes = document.getElementById('minutes');
  const timerSeconds = document.getElementById('seconds');
  const finishedMessage = document.getElementById('finished-message');
  const activeTimer = document.getElementById('active-timer');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      // 開催時刻を過ぎた場合
      if (activeTimer) activeTimer.style.display = 'none';
      if (finishedMessage) finishedMessage.style.display = 'block';
      clearInterval(countdownInterval);
      return;
    }

    // 時間計算
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 画面にゼロパディングで表示
    if (timerDays) timerDays.textContent = String(days).padStart(2, '0');
    if (timerHours) timerHours.textContent = String(hours).padStart(2, '0');
    if (timerMinutes) timerMinutes.textContent = String(minutes).padStart(2, '0');
    if (timerSeconds) timerSeconds.textContent = String(seconds).padStart(2, '0');
  }

  // 初回実行と1秒毎のアップデート開始
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);

  // --- スクロール連動アニメーション (Intersection Observer) ---
  const fadeElements = document.querySelectorAll('.section, .organizer-card, .letter-style, .countdown-container');
  
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target); // 一度表示されたら監視を解除
      }
    });
  }, observerOptions);

  // フェードイン用のCSSを動的に適用、または初期クラスを付与
  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });

  // 動的にスタイルを追加するためのヘルパー（CSSに直書きしてもいいが、JS非有効環境対策も兼ねる）
  const style = document.createElement('style');
  style.innerHTML = `
    .fade-in-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // --- 桜の花びら舞い散るエフェクト ---
  const sakuraContainer = document.createElement('div');
  sakuraContainer.classList.add('sakura-container');
  document.body.appendChild(sakuraContainer);

  const petalColors = ['#ffe6e8', '#ffd1d6', '#ffccd2', '#fbc5cd']; // 複数の桜ピンク

  function createPetal() {
    // パフォーマンス考慮のため、最大数を制御
    if (sakuraContainer.childElementCount > 40) return;

    const petal = document.createElement('div');
    petal.classList.add('sakura-petal');

    // ランダムな位置・サイズ・透明度・速度
    const startLeft = Math.random() * 100; // 0vw - 100vw
    const scale = Math.random() * 0.6 + 0.5; // 0.5 - 1.1
    const delay = Math.random() * 5; // 0s - 5s
    const duration = Math.random() * 8 + 8; // 8s - 16s
    const color = petalColors[Math.floor(Math.random() * petalColors.length)];

    petal.style.left = `${startLeft}vw`;
    petal.style.width = `${15 * scale}px`;
    petal.style.height = `${12 * scale}px`;
    petal.style.backgroundColor = color;
    petal.style.animationDelay = `${delay}s`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.opacity = Math.random() * 0.4 + 0.5; // 0.5 - 0.9

    sakuraContainer.appendChild(petal);

    // アニメーション完了後にDOMから削除
    petal.addEventListener('animationend', () => {
      petal.remove();
    });
  }

  // 初期ロード時にいくつかの花びらを配置
  for (let i = 0; i < 15; i++) {
    createPetal();
  }
  // その後一定間隔で生成
  setInterval(createPetal, 400);
});
