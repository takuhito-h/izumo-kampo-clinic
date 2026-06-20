/* ============================================================
   出雲漢方クリニック リデザイン案 — 独自JS（依存ライブラリなし・バニラ）
   リデザインで追加した独自のクライアント挙動はすべてこのファイルに集約する
   （本番WordPress由来JSには手を入れない方針）。HTML構造は変更せず、
   要素はJSで動的生成／class・属性付与のみで実現する。

   (A) モバイルメニュー（#sidr ドロワー）
       実サイトの jQuery sidr プラグイン（side:right）の挙動をバニラJSで再現。
       ・.mobile_menu（ハンバーガー）クリックで右からドロワーを開閉
       ・開く際はページ最上部へスクロール（sidr.js と同じ挙動）
       ・オーバーレイ／Closeボタン／メニューリンク／Escで閉じる
       ・body.drawer-open を付け外しし、表示は CSS 側で制御
       ・aria 同期／フォーカストラップ／フォーカス復帰（アクセシビリティ）
   (B) フローティング「ページトップへ」ボタン（一定スクロールで出現）
   ============================================================ */

/* ---------- (A) モバイルメニュー（#sidr ドロワー） ---------- */
(function () {
  function init() {
    var body = document.body;
    var sidr = document.getElementById("sidr");
    if (!sidr) return;

    // ハンバーガー（#sidr 外の .mobile_menu）= 開閉トグル兼フォーカス復帰先
    var hamburger = document.querySelector("#mobile .mobile_menu");

    // オーバーレイを生成
    var overlay = document.createElement("div");
    overlay.id = "drawer-overlay";
    body.appendChild(overlay);

    // ----- アクセシビリティ初期設定（aria） -----
    sidr.setAttribute("role", "dialog");
    sidr.setAttribute("aria-modal", "true");
    sidr.setAttribute("aria-label", "メニュー");
    sidr.setAttribute("aria-hidden", "true");
    if (hamburger) {
      hamburger.setAttribute("aria-controls", "sidr");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-haspopup", "dialog");
    }

    // ドロワー内のフォーカス可能要素（フォーカストラップ用、表示中のもののみ）
    function focusables() {
      return Array.prototype.filter.call(
        sidr.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ),
        function (el) {
          return el.offsetWidth > 0 || el.offsetHeight > 0;
        }
      );
    }

    function isOpen() {
      return body.classList.contains("drawer-open");
    }
    function open() {
      window.scrollTo({ top: 0, behavior: "smooth" }); // sidr.js と同様に最上部へ
      body.classList.add("drawer-open");
      sidr.setAttribute("aria-hidden", "false");
      if (hamburger) hamburger.setAttribute("aria-expanded", "true");
      // ドロワー内の最初の操作要素へフォーカスを移す
      var f = focusables();
      if (f.length) f[0].focus();
    }
    function close() {
      body.classList.remove("drawer-open");
      sidr.setAttribute("aria-hidden", "true");
      if (hamburger) {
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.focus(); // 開いた起点（ハンバーガー）へフォーカスを戻す
      }
    }

    // ハンバーガー（#mobile 内）と Close（#sidr 内）の .mobile_menu を振り分け
    var triggers = document.querySelectorAll(".mobile_menu");
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener("click", function (e) {
        e.preventDefault();
        if (this.closest && this.closest("#sidr")) {
          close();
        } else {
          isOpen() ? close() : open();
        }
      });
    }

    // オーバーレイのクリックで閉じる
    overlay.addEventListener("click", close);

    // ドロワー内のリンク（Close以外）クリックで閉じる
    var links = sidr.querySelectorAll("a");
    for (var j = 0; j < links.length; j++) {
      if (links[j].classList.contains("mobile_menu")) continue;
      links[j].addEventListener("click", close);
    }

    // Escキーで閉じる／開いている間は Tab をドロワー内に閉じ込める（フォーカストラップ）
    document.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape" || e.keyCode === 27) {
        close();
        return;
      }
      if (e.key === "Tab" || e.keyCode === 9) {
        var f = focusables();
        if (!f.length) return;
        var first = f[0];
        var last = f[f.length - 1];
        var active = document.activeElement;
        // フォーカスがドロワー外に出ていたら先頭へ引き戻す
        if (!sidr.contains(active)) {
          e.preventDefault();
          first.focus();
          return;
        }
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

/* ---------- (B) フローティング「ページトップへ」ボタン ---------- */
(function () {
  function init() {
    var body = document.body;
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 上のドロワーのオーバーレイ生成と同様、HTMLには書かずJSで挿入する
    var fab = document.createElement("button");
    fab.id = "pagetop-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "ページの先頭へ戻る");
    body.appendChild(fab);
    fab.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });

    // スクロール量に応じて出現を更新（rAFで間引き）
    var SHOW_AT = 400; // ページトップボタンを出す閾値(px)
    var ticking = false;

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (y > SHOW_AT) fab.classList.add("is-visible");
      else fab.classList.remove("is-visible");
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame
          ? window.requestAnimationFrame(update)
          : update();
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // 初期状態（リロード時に既にスクロール位置がある場合に対応）
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
