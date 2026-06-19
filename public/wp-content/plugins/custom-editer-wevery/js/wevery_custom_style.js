















$(function() {
    $('.plgwv_tab_01').each(function() {
        var $container = $(this);

        // 初期設定：最初のタブパネルのみ表示
        $container.find('.tab_panel').hide();
        $container.find('.tab_panel').eq(0).show();

        // タブクリック時の挙動
        $container.find('.tab_menu .tab').click(function() {
            var index = $(this).data('tab');

            // クリックされたタブのパネルを表示、他を非表示
            $container.find('.tab_panel').hide();
            $container.find('.tab_panel').eq(index).fadeIn();

            // タブのスタイルを更新
            $container.find('.tab').removeClass('selected');
            $(this).addClass('selected');
        });
    });
});
$(function() {
    $('.plgwv_tab_02').each(function() {
        var $container = $(this);

        // 初期設定：最初のタブパネルのみ表示
        $container.find('.tab_panel').hide();
        $container.find('.tab_panel').eq(0).show();

        // タブクリック時の挙動
        $container.find('.tab_menu .tab').click(function() {
            var index = $(this).data('tab');

            // クリックされたタブのパネルを表示、他を非表示
            $container.find('.tab_panel').hide();
            $container.find('.tab_panel').eq(index).fadeIn();

            // タブのスタイルを更新
            $container.find('.tab').removeClass('selected');
            $(this).addClass('selected');
        });
    });
});
$(function() {
    $('.plgwv_tab_03').each(function() {
        var $container = $(this);

        // 初期設定：最初のタブパネルのみ表示
        $container.find('.tab_panel').hide();
        $container.find('.tab_panel').eq(0).show();

        // タブクリック時の挙動
        $container.find('.tab_menu .tab').click(function() {
            var index = $(this).data('tab');

            // クリックされたタブのパネルを表示、他を非表示
            $container.find('.tab_panel').hide();
            $container.find('.tab_panel').eq(index).fadeIn();

            // タブのスタイルを更新
            $container.find('.tab').removeClass('selected');
            $(this).addClass('selected');
        });
    });
});
  $(function() {
    $('.plgwv_acco_01 > .ttl').on('click', function() {
      const $ttl = $(this);
      const $content = $ttl.next('.content');

      $content.slideToggle(200, function() {
        if ($content.is(':visible')) {
          $ttl.addClass('open');
        } else {
          $ttl.removeClass('open');
        }
      });
    });
  });
  $(function() {
    $('.plgwv_acco_02 .item > .acco_head').on('click', function() {
      const $ttl = $(this);
      const $content = $ttl.next('.content');

      $content.slideToggle(200, function() {
        if ($content.is(':visible')) {
          $ttl.addClass('open');
        } else {
          $ttl.removeClass('open');
        }
      });
    });
  });






$(function(){
  $('.plgwv_info_blog .newsdate').each(function(){
    var txt =  $(this).html();
    $(this).html(txt.replace(/\[/g,'').replace(/]/g,'').slice(0,-8));
  });

  $('.plgwv_info_blog .columndate').each(function(){
    var txt =  $(this).html();
    $(this).html(txt.replace(/\[/g,'').replace(/]/g,'').replace(/更新/g,''));
  });
});

(function(){
  const boot = () => {
    document.querySelectorAll('.plgwv_cal_02').forEach(container => {
      try {
        const labelThis = container.querySelector('.cal_label0');
        const labelNext = container.querySelector('.cal_label1');
        const holderNext = container.querySelector('.cal_next_holder');
        const iframeThis = container.querySelector('iframe');

        if (!iframeThis) { console.warn('[gcal] iframeが見つかりません', container); return; }

        // ベースURLを取得
        let baseUrl = (iframeThis.getAttribute('src') || '').trim().replace(/&/g, '&');
        if (!baseUrl) { console.warn('[gcal] iframeのsrcが空です', iframeThis); return; }

        // URL妥当性チェック
        let urlObj;
        try { urlObj = new URL(baseUrl); }
        catch(e){ console.error('[gcal] 不正なURLです:', baseUrl, e); return; }

        // 既存の dates パラメータを削除
        urlObj.searchParams.delete('dates');
        baseUrl = urlObj.toString();

        // ラベル設定
        const setMonthLabel = (el, dateObj)=>{
          if (!el) return;
          el.textContent = dateObj.toLocaleDateString('ja-JP', { month:'long' });
        };
        const now = new Date();
        setMonthLabel(labelThis, now);

        // 来月dates生成
        const fmt = (y,m,d)=> String(y)+String(m).padStart(2,'0')+String(d).padStart(2,'0');
        const firstNext = new Date(now.getFullYear(), now.getMonth()+1, 1);
        const firstAfter = new Date(now.getFullYear(), now.getMonth()+2, 1);
        const datesParam = `dates=${fmt(firstNext.getFullYear(), firstNext.getMonth()+1, 1)}/${fmt(firstAfter.getFullYear(), firstAfter.getMonth()+1, 1)}`;
        setMonthLabel(labelNext, firstNext);

        // 来月iframe生成
        if (holderNext) {
          holderNext.textContent = '';
          const ifr = document.createElement('iframe');
          ifr.src = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${datesParam}`;
          ifr.width = iframeThis.getAttribute('width') || '800';
          ifr.height = iframeThis.getAttribute('height') || '600';
          ifr.style.borderWidth = '0';
          ifr.frameBorder = '0';
          ifr.scrolling = 'no';
          ifr.loading = 'lazy';
          holderNext.appendChild(ifr);
        }

      } catch(err) {
        console.error('[gcal] 予期せぬエラー:', err);
      }
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once:true });
  } else {
    boot();
  }
})();
