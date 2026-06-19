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
  function init() {
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
