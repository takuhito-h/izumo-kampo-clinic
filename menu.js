/* ============================================================
   出雲漢方クリニック リデザイン案 — モバイルメニュー（#sidr ドロワー）
   実サイトの jQuery sidr プラグイン（side:right）の挙動を、
   依存ライブラリなしのバニラJSで再現したもの。
   ・.mobile_menu（ハンバーガー）クリックで右からドロワーを開閉
   ・開く際はページ最上部へスクロール（sidr.js と同じ挙動）
   ・オーバーレイ／Closeボタン／メニューリンク／Escで閉じる
   ・body.drawer-open を付け外しし、表示は CSS 側で制御
   ============================================================ */
(function () {
  /* ===== ヒーロースライダー（#metaslider_133）=====
     本番 nivoSlider の設定を踏襲：fade / pauseTime 3000 / animSpeed 800(CSS) /
     controlNav（ドット）/ directionNav なし / 自動送り / ホバーで一時停止 */
  function initHero() {
    var box = document.getElementById("metaslider_133");
    if (!box) return;
    var slides = [];
    for (var k = 0; k < box.children.length; k++) {
      if (box.children[k].tagName === "A") slides.push(box.children[k]);
    }
    if (slides.length === 0) return;
    box.classList.add("slider-ready");

    var i = 0;
    var timer = null;

    function render() {
      for (var n = 0; n < slides.length; n++) {
        slides[n].classList.toggle("is-active", n === i);
        if (btns[n]) btns[n].classList.toggle("is-active", n === i);
      }
    }
    function go(n) {
      i = (n + slides.length) % slides.length;
      render();
    }
    function start() {
      if (slides.length > 1) timer = window.setInterval(function () { go(i + 1); }, 3000);
    }
    function stop() { window.clearInterval(timer); }
    function reset() { stop(); start(); }

    // ドットナビ（controlNav）
    var btns = [];
    if (slides.length > 1) {
      var dots = document.createElement("ul");
      dots.className = "hero-dots";
      for (var d = 0; d < slides.length; d++) {
        (function (idx) {
          var li = document.createElement("li");
          var b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-label", idx + 1 + "枚目を表示");
          b.addEventListener("click", function () { go(idx); reset(); });
          li.appendChild(b);
          dots.appendChild(li);
          btns.push(b);
        })(d);
      }
      box.appendChild(dots);
    }

    render();
    start();
    box.addEventListener("mouseenter", stop);
    box.addEventListener("mouseleave", start);
  }

  function init() {
    initHero();

    var body = document.body;
    var sidr = document.getElementById("sidr");
    if (!sidr) return;

    // オーバーレイを生成
    var overlay = document.createElement("div");
    overlay.id = "drawer-overlay";
    body.appendChild(overlay);

    function isOpen() {
      return body.classList.contains("drawer-open");
    }
    function open() {
      window.scrollTo({ top: 0, behavior: "smooth" }); // sidr.js と同様に最上部へ
      body.classList.add("drawer-open");
    }
    function close() {
      body.classList.remove("drawer-open");
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

    // Escキーで閉じる
    document.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.keyCode === 27) && isOpen()) close();
    });
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
