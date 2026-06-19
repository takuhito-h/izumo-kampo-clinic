// JavaScript Document
// 管理画面では、$はjQueryでないとエラーが出る。
//jQuery(function() {
window.addEventListener('DOMContentLoaded', function() {
    var bln_click_num = 0; //バルーンクリックチェック用 2015.05.13追加
    var player; //Youtube Player 2015.5.21追加
    var ua = navigator.userAgent;

    if ((ua.indexOf('iPhone') > -1
        || (ua.indexOf('Android') > -1
            && ua.indexOf('Mobile') > -1))
        && window.innerWidth >= 481) {
        Object.defineProperty(navigator, 'userAgent', {
            get: function () { return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'; }
        });
    }

    //編集の範囲を表示する
    jQuery(".edit_link").mouseover(function(){
        jQuery(this).parent().css({
            'cssText': 'border: 2px #F00 dashed !important; box-sizing: border-box;'
        });
    });

    jQuery(".edit_link").mouseout(function(){
        jQuery(this).parent().css({
            'cssText': 'border: none;'
        });
    });

    jQuery(".edit_link_h").mouseover(function(){
        jQuery(this).parent().css({
            'cssText': 'border: 2px #F00 dashed !important; box-sizing: border-box;'
        });
    });

    jQuery(".edit_link_h").mouseout(function(){
        jQuery(this).parent().css({
            'cssText': 'border: none;'
        });
    });

    jQuery(".edit_link_s").mouseover(function(){
        jQuery(this).parent().css({
            'cssText': 'border: 2px #F00 dashed !important; box-sizing: border-box;'
        });
    });

    jQuery(".edit_link_s").mouseout(function(){
        $(this).parent().css({
            'cssText': 'border: none;'
        });
    });

    //説明用バルーンの表示 2015.05.13追加
    if(jQuery("input[name='assist']").val()==1) {
        bln_click_num = 0;

        //A
        jQuery("#wpadminbar").append("<div id='bln_manual' class='balloon topright_balloon'>操作に関するマニュアルはこちらの特設サイトをご活用ください。<img class='ico_close' src='wp-content/themes/theme/img/ico_close.png' /></div><div class='clear_balloon'></div>");
        //B
        jQuery("#gNav.editover").append("<div id='bln_navi' class='balloon topright_balloon'>修正したいページに飛んでいただき、タイトルをにマウスポインタをあてると、編集パネルが出現し、修正ができます。<img class='ico_close' src='wp-content/themes/theme/img/ico_close.png' /></div><div class='clear_balloon'></div>");
        //C
        jQuery("#wpadminbar").append("<div id='bln_icon' class='balloon topleft_balloon'>このアイコンをクリックすると、管理ページにジャンプします。アクセスの動向や新規のページ追加などができます。<img class='ico_close' src='wp-content/themes/theme/img/ico_close.png' /></div><div class='clear_balloon'></div>");

        jQuery(".infoSec.editover").append("<div class='balloon blnpos_middle left_balloon'>ログイン状態で編集をしたいエリアのタイトルにマウスポインタをあてると、編集バーが出現し追加・修正ができます<img class='ico_close' src='wp-content/themes/theme/img/ico_close.png' /></div><div class='clear_balloon'></div>");
        //説明用バルーンの消去
        jQuery(".balloon").click(function(){
            $(this).fadeOut("slow");
            checkBalloon();
        });
    }

    /**** 管理画面表示コントロール ****/ //2015.04.01追加
    url = location.href;
    filename = url.match(".+/(.+?)([\?#;].*)?$")[1];
    param = GetQueryString();

    //Contact Par Dayのタイトル変更
    if(jQuery('#cpd-metaboxes h2')) {
        objImg = jQuery('#cpd-metaboxes h2 img');

        //2019.12.11 change start
        //jQuery('#cpd-metaboxes h2').text('');
        //jQuery('#cpd-metaboxes h2').append(objImg);
        //jQuery('#cpd-metaboxes h2').append(' アクセス状況');
        objCpdTitle = jQuery('#cpd-metaboxes h2').first();
        objCpdTitle.text('');
        objCpdTitle.append(objImg);
        objCpdTitle.append(' アクセス状況');
        //2019.12.11 change end
    }

    //診療時間の表リストメニュー変更 2015.4.30追加
    if(jQuery('.column-table_name .row-actions')) {
        jQuery('.column-table_name .row-actions .copy').css("display", "none");
        jQuery('.column-table_name .row-actions .delete').css("display", "none");
    }
    //診療時間の表タイトル変更
    if(jQuery('#tablepress-nav')) {
        // 2019.12.11 change
        // jQuery('#tablepress-nav').text('診療時間の表');
        jQuery('#tablepress-nav').html('<h1>診療時間の表</h1>');
    }
    //診療時間の表ようこそ！（アップデート情報？）消す
    if(jQuery('#tablepress-page') && jQuery('.updated')) {
        jQuery('.updated').css('display', 'none');
    }
    //2019.12.11 add start
    //診療時間の表ようこそ！（アップデート情報？）消す
    if(jQuery('#tablepress-page') && jQuery('.notice')) {
        jQuery('.notice').css('display', 'none');
    }
    //2019.12.11 add end
    //診療時間の表テーブル情報消す 2015.5.8追加
    if(jQuery('#tablepress_edit-table-information')) {
        jQuery('#tablepress_edit-table-information').css('display', 'none');
    }
    //診療時間説明文消す
    if(jQuery('#postbox-container-2')) {
        jQuery('#postbox-container-2 p:eq(0)').css("display", "none");
        jQuery('#postbox-container-2 p:eq(1)').css("display", "none");
        jQuery('#tablepress_edit-table-options').css("display", "none");
        jQuery('#tablepress_edit-datatables-features').css("display", "none");
        jQuery('#postbox-container-2 p.submit:last').css("display", "none"); // 2015.4.30追加
    }

    //2018.04.18 add
    //simple Map , Duplicate Post の警告が表示されてしまうため、一時的に表示（暫定対応）
    if(jQuery('.is-dismissible')) {
        jQuery('.is-dismissible').css("display", "none");
    }

    //メニュー編集の「位置の管理」消す
    if(filename == 'nav-menus.php') {
        jQuery('h2.nav-tab-wrapper .nav-tab:eq(1)').css("display", "none");

        //2018.08.13 add
        //「リンクを新ウィンドウまたはタブで開く」のチェックボックスを表示させる
        jQuery('p.field-link-target').removeClass("hidden-field");

        setManualNavMenu(); //2015.05.13追加
    }

    //メニュー編集画面にマニュアルのリンクを追加 2015.05.13追加
    function setManualNavMenu() {
        strMetaBox = '<div id="manual_meta_post_page" class="postbox" style="margin-top: 15px;" >\n';
        strMetaBox = strMetaBox + '<div class="handlediv" title="クリックで切替"><br /></div>\n';
        strMetaBox = strMetaBox + '<h3 class="hndle"><span>この画面の操作方法</span></h3>\n';
        strMetaBox = strMetaBox + '<div class="inside">\n';
        strMetaBox = strMetaBox + '<ul>\n';
        //マニュアルはここを追加↓↓↓
        strMetaBox = strMetaBox + '<li><a href="http://manual.wevery.jp/?p=152" target="_blank">メニューからページを削除する</a></li>\n';
        strMetaBox = strMetaBox + '<li><a href="http://manual.wevery.jp/?p=68" target="_blank">新しくメニューを作る</a></li>\n';
        strMetaBox = strMetaBox + '<li><a href="http://manual.wevery.jp/?p=62" target="_blank">サイドメニューの並び順を変更する</a></li>\n';
        strMetaBox = strMetaBox + '<li><a href="http://manual.wevery.jp/?p=60" target="_blank">メニューの項目の並び順を変更する</a></li>\n';
        strMetaBox = strMetaBox + '<li><a href="http://manual.wevery.jp/?p=51" target="_blank">メニューにページを追加する</a></li>\n';
        //マニュアルはここを追加↑↑↑
        strMetaBox = strMetaBox + '</ul>\n';
        strMetaBox = strMetaBox + '</div>\n';
        strMetaBox = strMetaBox + '</div>\n';

        jQuery('#menu-settings-column').append(strMetaBox);
    }
    
    jQuery("#mf_3").css("display", "none");
    jQuery("#list_display_method").insertAfter("#expirationdatediv");

    // トップページ内容編集のMagic Fieldをタイトル下に表示する
    if(jQuery( '#mf_4' )) {
        jQuery( '#mf_4' ).insertBefore( '#edit-slug-box' );
        jQuery( '#mf_4 .hndle' ).css( 'height', '0' );
        jQuery( '#mf_4 .hndle' ).css( 'display', 'none' );
    }

    // トップページ内容編集の「表示位置」を表示期限の上に表示する 2015.05.11 add
    if(jQuery( '#mf_5' )) {
        jQuery( '#mf_5' ).insertBefore( '#expirationdatediv' );
    }

    //サイドメニューバナーのMF項目整備
    if(jQuery('#mf_1')) {
        jQuery('#mf_1 .hndle').css('display', 'none');
        jQuery('#mf_1 .field-banner_url').css('width', '80%');
        jQuery('#mf_1 .field-banner_url .mf-field-title').css('float', 'left');
        jQuery('#mf_1 .field-banner_url .mf-field-title').next('.clear').remove();
        jQuery('#mf_1 .field-banner_url .text_field_mf').css('float', 'left');
        jQuery('#mf_1 .field-banner_url .text_field_mf').css('width', '60%');
        jQuery('#mf_1 .field-banner_url .text_field_mf input').css('width', '100%');
        jQuery('#mf_1 .field-banner_target').css('position', 'relative');
        jQuery('#mf_1 .field-banner_target div:eq(3)').css('position', 'absolute');
        jQuery('#mf_1 .field-banner_target div:eq(3)').css('top', '0');
        jQuery('#mf_1 .field-banner_target div:eq(3)').css('left', '0');
        jQuery('#mf_1 .field-banner_target .mf-field-title').css('padding-left', '30px');
    }

    //2018.07.05 add
    //リビジョン(過去の内容)
    var revisionText = jQuery(".alignright").children("label").html();
    //2019.12.11 change エラー回避
    //if(revisionText){
    if(typeof revisionText != "undefined"){
        var revisionText = revisionText.replace("リビジョンコントロール:", "");
        var revisionText = revisionText.replace(/最大 [0-9]{1,} 個のリビジョンを保存します/, "");
    }
    jQuery(".alignright").children("label").html(revisionText);



    if(!param) { return; }

    //管理画面でのバルーン消す 2015.05.13追加
    if(param['page'] == 'wevery-admin-menu/wv.php') {
        jQuery('.balloon').css('display', 'none');
    }

    //Meta Sliderの表示変更・アップグレード・ソーシャル・「スライダー削除」消す
    //2018.07.05 change add
    //初期画面もしくはid=133の場合は、非表示にする
    //if(param['page'] == 'metaslider') {
    //    jQuery('#screen-options-link-wrap').text("");
    //    jQuery('#screen-options-link-wrap').css("border", "none");
    //
    //    jQuery('#screen-options-switch-view-wrap').text("");
    //    jQuery('#screen-options-switch-view-wrap').css("border", "none");
    //
    //    jQuery('#metaslider_social').css("display", "none");
    //
    //    jQuery('.delete-slider').css("display", "none");
    //}
    if(param['page'] == 'metaslider') {
        if(!param['id'] || param['id'] == 133){
            jQuery('#screen-options-link-wrap').text("");
            jQuery('#screen-options-link-wrap').css("border", "none");

            jQuery('#screen-options-switch-view-wrap').text("");
            jQuery('#screen-options-switch-view-wrap').css("border", "none");

            jQuery('#metaslider_social').css("display", "none");
        }
        //使い方のPHPタグ記述部分削除
        var sliderText = jQuery('pre#ms-entire-code').html();
        // 2019.12.11 change start エラー回避
        // sliderText = sliderText.replace("&lt;?php echo do_shortcode('<br>","");
        // sliderText = sliderText.replace("'); ?&gt;","");
        if(typeof sliderText != "undefined"){
            sliderText = sliderText.replace("&lt;?php echo do_shortcode('<br>","");
            sliderText = sliderText.replace("'); ?&gt;","");
        }
        // メタスライダー新バージョン警告を非表示
        jQuery('div.warning').css('display','none');
        // 2019.12.11 change end

        jQuery('pre#ms-entire-code').html(sliderText);
    }

    //2018.07.05 change end

    //Meta Managerの「サイドワイド設定」・「タクソノミー設定」・Powered by削除
    //タイトル変更
    if(param['page'] == 'meta-manager.php') {
        jQuery('#wpbody-content h2').text("metaタグの設定");

        jQuery('#wpbody-content h3:eq(0)').css("display", "none");
        jQuery('#wpbody-content h3:eq(2)').css("display", "none");

        jQuery('#wpbody-content .form-table:eq(1) tr:eq(0)').css("display", "none");
        jQuery('#wpbody-content .form-table:eq(2)').css("display", "none");

        jQuery('#wpbody-content #developper_information').css("display", "none");
    }

    //2018.07.05 add
    //共通タグ・トップページコンテンツ画面にもメッセージを追加する
    //2015.05.20 add
    //サイドメニューバナー画面へメッセージ追加
    //if(param['post_type'] == 'side_banner') {
    if(param['post_type'] == 'side_banner' || param['post_type'] == 'toppage') {
        jQuery( '<p id=side_msg>ドラッグ&ドロップで順番の並び替えができます。</p>' ).insertAfter( '.wp-list-table #title a' );
        jQuery('#side_msg').css("color", "red");
        jQuery('#side_msg').css("margin-top", "-5px");
        jQuery('#side_msg').css("margin-bottom", "3px");
        jQuery('#side_msg').css("margin-left", "7px");
    }


    //Ultimate Google Analyticsの「Check for updates」・「Enable tracker」・「Advanced configuration」削除
    //タイトル変更
    regTxt = /ultimate_ga.+/;
    if(regTxt.test(param['page'])) {
        jQuery('#wpbody-content h2').text("Googleアナリティクス");
        objInput = jQuery('input[name="account_id"]');

        jQuery('.editform tr:eq(0) td').text("");
        jQuery('.editform tr:eq(0) td').append(objInput);
        jQuery('.editform tr:eq(0) td').append("<br />");
        //2018.07.05 change
        //jQuery('.editform tr:eq(0) td').append("Googleアナリティクス測定ID・アカウントIDを入力してください。埋め込みコードは必要ありません。");
        //2021.01.25 change G-にも対応
        //jQuery('.editform tr:eq(0) td').append("UA-○○○○○○の形で、Googleアナリティクス測定ID・アカウントIDを入力してください。埋め込みコードは必要ありません。");
        jQuery('.editform tr:eq(0) td').append("G-○○○○○　または　UA-○○○○○の形で、Googleアナリティクス測定ID・アカウントIDを入力してください。埋め込みコードは必要ありません。");
        jQuery('.editform tr:eq(0) td').append("<br />");
        jQuery('.editform tr:eq(0) td').append("※設置方法については<a href=\"https://manual.wevery.jp/?p=728\" target=\"_blank\" rel=\"noopener noreferrer\">こちらの操作マニュアル</a>をご覧ください。");
    }

    //URLからパラメータを取得
    function GetQueryString() {
        if (1 < document.location.search.length) {
            // 最初の1文字 (?記号) を除いた文字列を取得する
            var query = document.location.search.substring(1);

            // クエリの区切り記号 (&) で文字列を配列に分割する
            var parameters = query.split('&');

            var result = new Object();
            for (var i = 0; i < parameters.length; i++) {
                // パラメータ名とパラメータ値に分割する
                var element = parameters[i].split('=');

                var paramName = decodeURIComponent(element[0]);
                var paramValue = decodeURIComponent(element[1]);

                // パラメータ名をキーとして連想配列に追加する
                result[paramName] = decodeURIComponent(paramValue);
            }
            return result;
        }
        return null;
    }

    //バルーンの消した数をチェック 2015.05.13追加
    function checkBalloon() {
        bln_click_num++;

        if(bln_click_num < jQuery(".balloon").length) {
            return;
        }

        changeAssist(0);
    }

    //アシスト表示設定変更 2015.05.13追加
    //assist_val 0:OFF 1:ON
    function changeAssist(assist_val) {
        option_data = 'option_val='+assist_val+'&option_name=assist';

        $.ajax({
                type: "POST",
                url: "wp-content/themes/theme/change_assist.php",
                data: option_data
        });
    }

    //2018.07.05 add start
    //GetPremium ボタン消去
    jQuery('.imgevr-get-premium').css('display', 'none');


    //メタ情報の削除
    var pageTitle = jQuery('h2').html();
    var deleteTitle = ["コンテンツ内容編集", "共通コード・ショートコードを編集する"];
    var deleteParam = ["toppage", "script_writing"];
    var isSearchPage = "s" in param;
    if(pageTitle) {
        for(var val = 0; val < deleteParam.length; val++){
            if(param['post_type'] == deleteParam[val] || pageTitle.indexOf(deleteTitle[val]) != -1){
                jQuery("#post_meta_box").remove();
            }
        }
    }

    //magic fieldの文言変更
    var magicCodeTitle = jQuery("#mf_6").children(".hndle").children("span").text();
    if(magicCodeTitle == "Magic Fields") {
        jQuery("#mf_6").children(".hndle").children("span").text("コード等を記載");
    }

    //診療時間の表ページ
    if(param['page'] == "tablepress") {
        var path = location.pathname;
        path = path.replace("/wp-admin/admin.php","");
        //リンクの追加
        jQuery('#normal-sortables').before('<a href="'+path+'/wp-admin/admin.php?page=wevery-admin-menu/wv.php#basic_info">診療時間の備考や休診日の設定はこちらへ</a>');

        //お問い合わせ表示の削除
        jQuery('#footer-left').remove();
    }
    //診療時間の表ページからクリニックの基本情報に遷移した場合のみ、診療時間項目にジャンプする
    if(param['page'] == "wevery-admin-menu/wv.php") {
        var pageHash = location.hash;
        if(pageHash){
            location.href = "#meditime";
        }
    }

    //2018.07.05 add end

    //2018.11.06 add start
    //meta情報の入力部にサムネイル画像の選択フォームを追加
    if(pageTitle && !isSearchPage) {
        //2022.04.11 change
        //postMetaBox = '<dt>サムネイル画像</dt>';
        postMetaBox = '<dt>Google検索用サムネイル画像</dt>';
        postMetaBox = postMetaBox + '<dd>';
        postMetaBox = postMetaBox + '<input type="button" name="meta_media" value="選択">';
        postMetaBox = postMetaBox + '<input type="button" name="meta_media_clear" value="クリア">';
        postMetaBox = postMetaBox + '</dd>';
        postMetaBox = postMetaBox + '<div id="meta_thumbnail">';
        var meta_thumbnail_img = jQuery("#thumbnail_url").val()
        postMetaBox = postMetaBox + '<img id="meta_thumbnail_img" src="'+meta_thumbnail_img+'" />';
        postMetaBox = postMetaBox + '<input type="hidden" id="thumbnail" name="thumbnail" value="'+meta_thumbnail_img+'"></div>';

        jQuery(postMetaBox).appendTo('#post_meta_box .inside');
    }

    var custom_uploader;
    jQuery("input:button[name=meta_media]").click(function(e) {
        e.preventDefault();
        if (custom_uploader) {
            custom_uploader.open();
            return;
        }

        custom_uploader = wp.media({
            title: "画像を選択",
            //ライブラリの一覧は画像のみにする
            library: {
                type: "image"
            },
            button: {
                text: "選択"
            },
            //選択できる画像は 1 つだけにする
            multiple: false
        });

        custom_uploader.on("select", function() {
            var images = custom_uploader.state().get("selection");

            //file の中に選択された画像の各種情報が入っている
            images.each(function(file){

                //hiddenフォームと表示されたサムネイル画像があればクリア
                jQuery("input:hidden[name=thumbnail]").val("");
                jQuery("#meta_media").empty();
                jQuery("#meta_thumbnail_img").val("");
                jQuery("#meta_thumbnail").empty();

                //hiddenフォームに画像の URL を表示
                //jQuery("input:hidden[name=thumbnail]").val(file.attributes.sizes.thumbnail.url);
                jQuery("#meta_thumbnail").append('<input type="hidden" id="thumbnail" name="thumbnail" value="'+file.attributes.sizes.thumbnail.url+'"></div>');

                //選択されたサムネイル画像を表示
                //var imgUrl = <?php //echo update_post_meta( $post_id, '_post_thumbnail' ); ?>
                jQuery("#meta_thumbnail").append('<img src="'+file.attributes.sizes.thumbnail.url+'" />');

            });
        });
        custom_uploader.open();

    });

    //クリアボタンを押した時の処理
    jQuery("input:button[name=meta_media_clear]").click(function() {
        //hiddenフォームと表示されたサムネイル画像があればクリア
        jQuery("input:hidden[name=thumbnail]").val("");
        jQuery("#meta_thumbnail_img").val("");
        jQuery("#meta_media").empty();
        jQuery("#meta_thumbnail").empty();
    });
    //2018.11.06 add end


    ////////////////////////////////////////
    // Youtube表示 2015.5.21追加
    ////////////////////////////////////////
    //YouTube iFrame Player API
    var tag=document.createElement('script');
    tag.src="//www.youtube.com/iframe_api";
    var firstScriptTag=document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    /* プレーヤーの準備完了時 */
    window.onYouTubeIframeAPIReady=function() {
        if(jQuery('[name="movie_play"]').val()==1 && param['movie_on']) {
            $('#mov_intro').css('display', 'block');
        } else {
            return;
        }

        player = new YT.Player(
            'player',{
                width: '768',    /* 動画プレーヤーの幅 */
                height: '468',    /* 動画プレーヤーの高さ */
                videoId: 'Z5CK1GlqaOg',    /* YouTube動画ID */
                playerVars: {
                    autoplay: 1,
                    rel: 0
                },
                events: { /* イベント */
                    "onReady": onPlayerReady,    /* プレーヤの準備完了時 */
                    "onStateChange": onPlayerStateChange   /* プレーヤの状態が変化した時 */
                }
            }
        );
    }

    function movFadeOut() {
        $('#mov_intro').fadeOut(1000);

        //動画表示OFF
        option_data = 'option_val=0&option_name=movie_play';

        $.ajax({
            type: "POST",
            url: "wp-content/themes/theme/change_assist.php",
            data: option_data
        });
    }

    function onPlayerReady(event){
        event.target.setVolume(50);    /* 音量調整 */
    }

    function onPlayerStateChange(event){
        if(event.data == 0) {
            setTimeout(movFadeOut, 500);
        }
    }

    jQuery('#mov_intro .ico_close').click(function(){
        player.stopVideo();
        movFadeOut();
    });


//    //--------------------------------------------
//    //ページ内スクロールを全てスムーズに
//    //--------------------------------------------
//    // スクロールのオフセット値
//    var offsetY = -10;
//    // スクロールにかかる時間
//    var time = 500;
//
//    // ページ内リンクのみを取得
//    jQuery('a[href^=#]').click(function() {
//        // 移動先となる要素を取得
//        var target = $(this.hash);
//        if (!target.length) return ;
//
//        //var target = jQuery(this.hash);
//
//        // 移動先となる値
//        var targetY = target.offset().top+offsetY;
//        // スクロールアニメーション
//        jQuery('html,body').animate({scrollTop: targetY}, time, 'swing');
//        // ハッシュ書き換えとく
//        window.history.pushState(null, null, this.hash);
//        // デフォルトの処理はキャンセル
//        return false;
//    });

});

//2019.06.10 add start
//--------------------------------------------
// aタグに設定されているリンクが外部サイトの場合、
// 「rel=nofollow」を加える。
//--------------------------------------------
//jQuery(function(){
window.addEventListener('DOMContentLoaded', function() {
    //閲覧中のサイトドメイン取得
    var domain = window.location.hostname;
    //正規表現内容をセット(外部サイトでないことを確認)
    var internalLinkRegex = new RegExp('^((http:\\/\\/|https:\\/\\/)(www\.)?)');
    var domaincheckRegex = new RegExp('^(((http:\\/\\/|https:\\/\\/)(www\.)?)?'
        + domain
        + ')');
    var newRel = "";
    //aタグを正規表現チェック
    jQuery('a').filter(function() {
        // 2021.04.22 add start 条件の追加（target = "_blank"が付与されていて、relがnoopener noreferrerであること）
        var targetCheck = jQuery(this).prop('target');
        var relCheck = jQuery(this).prop('rel');
        if ((relCheck == "noopener noreferrer" || relCheck == "") && targetCheck == "_blank"){
            newRel = "nofollow " + relCheck;
            // 2021.04.22 add end
            var href = jQuery(this).attr('href');
            //「http://」あるいは「https://」で始まることを確認
            if(internalLinkRegex.test(href)) {
                //「http://」などで始まった場合は、次にドメインが入るか
                return !domaincheckRegex.test(href);
            } else {
                return false;
            }
        } //2021.04.22 add 条件の追加
    })
    .each(function() {
        // 2021.04.22 change 
        // jQuery(this).attr('rel', 'nofollow');
        jQuery(this).attr('rel', newRel);
    });
});
//2019.06.10 add end

// 2019.09.02 add
// Instagram Feed Pro バージョンアップに伴う追加
// jQueryのバージョンが古いため「addBack」関数を補う
//jQuery.fn.addBack = function (selector) {
//    return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
//}

//2019.10.01 add start
//--------------------------------------------
//メディアをグリッドで表示する場合のSVGファイル表示
//--------------------------------------------
//jQuery(function(){
window.addEventListener('DOMContentLoaded', function() {
    var observer = new MutationObserver(function(mutations){
        for (var i=0; i < mutations.length; i++){
            for (var j=0; j < mutations[i].addedNodes.length; j++){
                //該当の要素を取得
                element = jQuery(mutations[i].addedNodes[j]);
                //classがある場合のみ実行
                if(element.attr('class')){
                    elementClass = element.attr('class');
                    //「attachments」classを探す
                    if (element.attr('class').indexOf('attachment') != -1){
                        attachmentPreview = element.children('.attachment-preview');
                        if(attachmentPreview.length != 0){
                            //SVGファイルにのみ実行する
                            if(attachmentPreview.attr('class').indexOf('subtype-svg+xml') != -1){
                                var handler = function(element){
                                    //WP ajaxを呼び出して「wp_ajax_svg_get_attachment_url」関数を実行→該当のSVGファイルのURLを取得する
                                    jQuery.ajax({
                                        url: ajaxurl,
                                        data: {
                                            'action'        : 'svg_get_attachment_url',
                                            'attachmentID'  : element.attr('data-id')
                                        },
                                        success: function(data){
                                            if(data){
                                                //svgファイルのURLに変換
                                                element.find('img').attr('src', data);
                                            }
                                        }
                                    });
                                }(element);
                            }
                        }
                    }
                }
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

//--------------------------------------------
//メディアライブラリの添付ファイル詳細モーダルでのSVGファイル表示
//--------------------------------------------
    var attachmentPreviewObserver = new MutationObserver(function(mutations){
        for (var i=0; i < mutations.length; i++){
            for (var j=0; j < mutations[i].addedNodes.length; j++){
                var element = jQuery(mutations[i].addedNodes[j]);

                //添付ファイルの詳細画面なのか
                var onAttachmentPage = false;
                if( (element.hasClass('attachment-details')) || element.find('.attachment-details').length != 0){
                    onAttachmentPage = true;
                }

                if(onAttachmentPage == true){
                    //URL値を設定する
                    var urlLabel = element.find('label[data-setting="url"]');
                    if(urlLabel.length != 0){
                        var value = urlLabel.find('input').val();
                        element.find('.details-image').attr('src', value);
                    }
                }
            }
        }
    });
    attachmentPreviewObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});
//2019.10.01 add end

//2022.05.26 add start
//カード03
jQuery(function(){
    jQuery(document).on("click", '.wev_accordion_one > .wev_accordion_header', function() {
        jQuery(this).next(".wev_accordion_inner").slideToggle();
        jQuery(this).toggleClass("open");
        jQuery(".wev_accordion_one > .wev_accordion_header").not(jQuery(this)).next(".wev_accordion_inner").slideUp();
        jQuery(".wev_accordion_one > .wev_accordion_header").not(jQuery(this)).removeClass("open");
    });
});

//--------------------------------------------
// Scrolling code start
//--------------------------------------------

// Add debug function
function isElementVisible($el) {
    if (!$el.length) return false;
    const elOffset = $el.offset().top;
    const elHeight = $el.innerHeight();
    const scrollTop = jQuery(window).scrollTop();
    const windowHeight = jQuery(window).height();

    return (elOffset + elHeight > scrollTop && elOffset < scrollTop + windowHeight);
}

function logAfterScrollInfo() {
    const scrollTop = jQuery(window).scrollTop();

    const header = jQuery("#header");
    const gnavbar = jQuery("#gNav");

    const headerHeight = header.length ? header.innerHeight() : 0;
    const gnavHeight = gnavbar.length ? gnavbar.innerHeight() : 0;

    const isHeaderVisible = isElementVisible(header);
    const isGNavVisible = isElementVisible(gnavbar);

    console.log("===== Scroll後の状態 =====");
    console.log("現在位置 (scrollTop):", scrollTop);
    console.log("header高さ:", headerHeight, " / 表示中?:", isHeaderVisible);
    console.log("gNav高さ:", gnavHeight, " / 表示中?:", isGNavVisible);
    console.log("========================");
}

//2022.05.26 add end
window.addEventListener("load", function () {
    const speed = 400;
    const url = jQuery(location).attr("href");
    let retry = 15;
    let navbarHeight = getNavHeight();

    if (url.indexOf("#") !== -1) {
        // urlを#で分割して配列に格納
        const anchor = url.split("#");
        // 分割した最後の文字列（#◯◯の部分）をtargetに代入
        const interval = setInterval(function () {
            let target = jQuery("#" + anchor[anchor.length - 1]);
            if (target.length) {
                clearInterval(interval);
                let position = Math.floor(target.offset().top);
                smoothScroll(position, speed, navbarHeight, "#" + anchor[anchor.length - 1]);
            }
            retry--;
            if (retry <= 0) {
                clearInterval(interval);
            }
        }, 500);
    }
});

//ページ内アンカーリンク
var isClicked = false;
jQuery(document).on("click", 'a[href*="#"]', function (e) {
    isClicked = true;
    const url = this.href;
    const urlObj = new URL(url);

    // Allow #sidr to be added to the URL and another site # link
    if ((urlObj.hash === "#sidr") || (!url.includes(window.location.host)) || Array.from(urlObj.searchParams).length > 0) {
        return;
    }

    if (urlObj.pathname == window.location.pathname) {
        e.preventDefault(); // Prevent default only for internal page anchors
        console.log('Click Scroll link');
        let navbarHeight = getNavHeight();
        const speed = 400;
        const target = jQuery(urlObj.hash);

        if (target.length) {
            let position = Math.floor(target.offset().top);
            smoothScroll(position, speed, navbarHeight, urlObj.hash);
        }
    }
});

jQuery(window).on("hashchange", function () {
    if (isClicked) {
        isClicked = false;
        return;
    }
    const url = jQuery(location).attr("href");
    let navbarHeight = getNavHeight();
    const speed = 400;

    if (url.indexOf("#") !== -1) {
        // urlを#で分割して配列に格納
        const anchor = url.split("#");
        // 分割した最後の文字列（#◯◯の部分）をtargetに代入
        let target = jQuery("#" + anchor[anchor.length - 1]);
        if (target.length) {
            let position = Math.floor(target.offset().top);
            smoothScroll(position, speed, navbarHeight, "#" + anchor[anchor.length - 1]);
        }
    }
});

function getNavHeight() {
    const gnavbar = jQuery("#gNav");
    const header = jQuery("#header");
    let gnavbarHeight = 0;
    let headerHeight = 0;
    let navbarHeight = 10;

    if (gnavbar.length) {
        gnavbarHeight += gnavbar.innerHeight();
    }

    if (header.length) {
        headerHeight += header.innerHeight();
    }

    navbarHeight += Math.max(headerHeight, gnavbarHeight);
    return navbarHeight;
}

function getMinPadding() {
    const gnavbar = jQuery("#gNav");
    const header = jQuery("#header");
    let gnavbarHeight = 0;
    let headerHeight = 0;
    let padding = 0;

    if (gnavbar.length) {
        gnavbarHeight += gnavbar.innerHeight();
    }

    if (header.length) {
        headerHeight += header.innerHeight();
    }

    const maxHeight = Math.max(headerHeight, gnavbarHeight);

    if (maxHeight === gnavbarHeight) {
        const style = window.getComputedStyle(gnavbar[0]);
        padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    } else if (maxHeight === headerHeight) {
        const style = window.getComputedStyle(header[0]);
        padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    }
    return padding;
}

function smoothScroll(position, speed, navbarHeight, targetSelector) {
    const body = jQuery("html,body");
    const gnavbar = jQuery("#gNav");
    const header = jQuery("#header");
    const isGNavFixed = gnavbar.length && gnavbar.css("position") === "fixed";
    const isHeaderFixed = header.length && header.css("position") === "fixed";

    let finalScrollPosition = position;
    let needSecondAdjust = true;

    if (jQuery(window).width() <= 480) {
        var fixedHeight = 30;
        var firstH1 = $('h1').first();
        if (firstH1.length > 0) {
            fixedHeight = (firstH1.outerHeight() !== 0 ? firstH1.outerHeight() : fixedHeight);
        }
        finalScrollPosition -= fixedHeight;
        needSecondAdjust = false;
    } else {
        const gnavHeight = gnavbar.length ? gnavbar.innerHeight() : 0;
        const headerHeight = header.length ? header.innerHeight() : 0;

        if (gnavHeight > 450 || headerHeight > 450) {
            const smallerHeight = Math.min(gnavHeight || Infinity, headerHeight || Infinity);
            finalScrollPosition -= smallerHeight;
        } else if (isGNavFixed) {
            finalScrollPosition -= gnavbar.innerHeight() > 100 ? gnavbar.innerHeight() : 100;
            needSecondAdjust = false;
        } else if (isHeaderFixed) {
            finalScrollPosition -= header.innerHeight() > 100 ? header.innerHeight() : 100;
            needSecondAdjust = false;
        } else {
            finalScrollPosition -= navbarHeight + getMinPadding();
            needSecondAdjust = true;
        }
    }

    body.stop().animate(
        { scrollTop: finalScrollPosition },
        speed,
        "swing",
        function () {
            const isHeaderVisible = isElementVisible(header);
            const isGNavVisible = isElementVisible(gnavbar);

            // For debug
            // console.log("isHeaderVisible?:", isHeaderVisible);
            // console.log("isGNavVisible?:", isGNavVisible);
            // console.log("needSecondAdjust?:", needSecondAdjust);
            // console.log('targetSelector:?', targetSelector);
            // logAfterScrollInfo();
            if (!isHeaderVisible && !isGNavVisible && targetSelector) {
                needSecondAdjust = false;
                const target = jQuery(targetSelector);
                if (target.length) {
                    const targetPos = Math.floor(target.offset().top) - 50;
                    $("html,body").stop().animate(
                        { scrollTop: targetPos },
                        500,
                        "swing",
                        // For debug
                        //function () {
                            //console.log("Correction: Since there is no header or gNav, reposition the target to top+30px");
                            //logAfterScrollInfo();
                        //}
                    );
                }
                return;
            }

            if (!needSecondAdjust) return;
            // --- 2nd time: Re-correct height change due to gNav's is-fixed ---
            setTimeout(function () {
                const gnavNowFixed = gnavbar.length && gnavbar.css("position") === "fixed";
                if (gnavNowFixed && gnavbar.hasClass("is-fixed")) {
                    let adjust = gnavbar.innerHeight();
                    let currentScroll = $(window).scrollTop();
                    $("html,body").stop().animate(
                        { scrollTop: currentScroll - adjust},
                        600,
                        "swing",
                        // For debug
                        //function () {
                        //    logAfterScrollInfo();
                        //}
                    );
                }
            }, 500);
        }
    );
}
//--------------------------------------------
// Scrolling code end
//--------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
    const iframeHeightObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === "height") {
                const iframeElement = mutation.target;
                iframeElement.style.height = `${iframeElement.getAttribute("height")}px`;
            }
        });
    });

    const iframeElements = Array.from(document.querySelectorAll("iframe.wp-embedded-content"));
    iframeElements.forEach(iframe => iframeHeightObserver.observe(iframe, { attributes: true }));

});

window.addEventListener("load", () => {
    handleNestedAccordion()
    if (isMobileSafari()) {
        removeInstagramLightBox();
    }

});

function isMobileSafari() {
    return (
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/)
    );
}

function removeInstagramLightBox() {
    const sbiElements = $(".sbi");
    sbiElements.each((index, element) => {
        const $self = $(element);
        const flags = $self.attr("data-sbi-flags");
        if (flags !== undefined && flags.indexOf("disableOnTouch") === -1) {
            if (typeof window.sbi.touchDevice === "undefined") {
                window.sbi.touchDevice = true;
                $(".sbi_item").each((index, item) => {
                    const $item = $(item);
                    if (!$item.find(".sbi_link").hasClass("sbi_disable_lightbox")) {
                        $item.find(".sbi_photo_wrap").prepend($item.find(".sbi_link_area"));
                        $item.find(".sbi_link").remove();
                    }
                });
            }
        }
    });
}

function handleNestedAccordion() {
    var $root = jQuery('#sidr ul#menu-main_menu');
    if ($root.length === 0) return;

    if (!window.__nestedAccordionInitTry) window.__nestedAccordionInitTry = 0;
    window.__nestedAccordionInitTry += 1;

    var topAccCountNow = $root.find('> li > a + .accordion-elm').length;
    if (topAccCountNow === 0 && window.__nestedAccordionInitTry <= 60) {
        setTimeout(handleNestedAccordion, 50);
        return;
    }

    // Add accordion under sub-menu
    $root.children('li').each(function () {
        var $menuItem = jQuery(this);
        var $targets = $menuItem.find('li.menu-item-has-children');

        $targets.each(function () {
            var $subMenuItem = jQuery(this);
            if ($subMenuItem.children('ul.sub-menu').length === 0) return;

            var $linkTag = $subMenuItem.children('a').first();
            if ($linkTag.length === 0) return;

            // Duplicate prevention: If there is no accordion-elm immediately after a, add it.
            if ($linkTag.next('.accordion-elm').length === 0) {
                $linkTag.after('<div class="accordion-elm">▼</div>');
            }

            $subMenuItem.css({
                'text-indent': 'initial',
                'margin-left': '0.8em'
            });
        });
    });

    $root.find('.accordion-elm').off('click');

    jQuery(document)
        .off('click.handleNestedAccordion', '#sidr ul#menu-main_menu .accordion-elm')
        .on('click.handleNestedAccordion', '#sidr ul#menu-main_menu .accordion-elm', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

            var $btn = jQuery(this);
            var $targetUl = $btn.next('ul.sub-menu');

            if ($targetUl.length === 0) return false;

            $btn.toggleClass('active');
            $targetUl.stop(true, true).slideToggle(400);

            return false;
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const options = document.querySelectorAll('#mm option');
    options.forEach(option => {
        let dataText = option.getAttribute('data-text');
        if (dataText) {
            dataText = dataText.replace('月', '');
            option.setAttribute('data-text', dataText);
        }
    });
});

// 2024/11/28 add for Wevery custom plugins
document.addEventListener('DOMContentLoaded', function() {
    function isAdmin() {
        return window.location.href.indexOf('/wp-admin/') !== -1;
    }

    if (!isAdmin()) {
        var elements = document.querySelectorAll("div.box_editer_custom");
        elements.forEach(function(element) {
            // Get parent element
            var parent = element.parentNode;
            // Move child element to parent element
            while (element.firstChild) {
                parent.insertBefore(element.firstChild, element);
            }
            // Delete the original div
            parent.removeChild(element);
        });
    }
});
// add end

// 2025/06/24 Add for metaslider 
(function () {
    if (!location.pathname.endsWith('/wp-admin/admin.php') || !location.search.includes('page=metaslider')) return;
    let initialLoading = true;
    function showLoading() {
        const wpbody = document.getElementById('wpbody');
        if (!wpbody || document.getElementById('metaslider-spinner')) return;

        wpbody.classList.add('metaslider-blur');

        const overlay = document.createElement('div');
        overlay.id = 'metaslider-spinner';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.4);
            pointer-events: none;
        `;
        overlay.innerHTML = `
            <div style="text-align:center; pointer-events:auto;">
                <div style="color:white; font-size:1.5rem; margin-bottom:1rem;">Loading...</div>
                <div style="
                    width: 48px;
                    height: 48px;
                    border: 5px solid white;
                    border-top: 5px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                "></div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg);}
                        100% { transform: rotate(360deg);}
                    }
                    #wpbody.metaslider-blur {
                        filter: blur(5px) brightness(0.9);
                        pointer-events: none;
                    }
                </style>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    function hideLoading() {
        const wpbody = document.getElementById('wpbody');
        wpbody?.classList.remove('metaslider-blur');
        const spinner = document.getElementById('metaslider-spinner');
        if (spinner) spinner.remove();
    }

    function addCheckboxToSlideRow(row) {
        const control = row.querySelector('.metaslider-ui-controls');
        const editBtn = control?.querySelector('.toolbar-button.update-image');
        if (!editBtn || control.querySelector('.metaslider-extra-control-wrapper')) return;

        const slideId = (row.id || '').replace(/^slide-/, '');
        if (!slideId) return;

        const wrapper = document.createElement('span');
        wrapper.className = 'metaslider-extra-control-wrapper';
        wrapper.style.cssText = 'display:inline-flex;align-items:center;margin-right:10px;';
        wrapper.innerHTML = `
            <span style="color:#666;font-size:13px;">非表示</span>
            <input type="checkbox" class="tab-extra-checkbox" style="margin-left:6px;">
            <input type="hidden" name="attachment[${slideId}][hide_from_slider]" value="0">
        `;
        const [label, checkbox, hiddenInput] = wrapper.children;

        function setGrayout(isChecked) {
            const col2 = row.querySelector('td.col-2');
            const inner = row.querySelectorAll('.metaslider-ui-inner');
            if (isChecked) {
                col2?.classList.add('grayout');
                inner.forEach(el => el.classList.add('grayout'));
                hiddenInput.value = '1';
            } else {
                col2?.classList.remove('grayout');
                inner.forEach(el => el.classList.remove('grayout'));
                hiddenInput.value = '0';
            }
        }
        checkbox.addEventListener('change', () => setGrayout(checkbox.checked));
        editBtn.parentNode.insertBefore(wrapper, editBtn);
        row._metasliderCheckbox = checkbox;
        row._metasliderSetGrayout = setGrayout;
    }

    function setupMetasliderHideCheckboxes() {
        const slideRows = Array.from(document.querySelectorAll('tr.slide[data-attachment-id]'));

        if (!slideRows.length) {
            if (initialLoading) {
                hideLoading();
                initialLoading = false;
            }
            return;
        }

        if (!document.getElementById('metaslider-block-grayout-style')) {
            const style = document.createElement('style');
            style.id = 'metaslider-block-grayout-style';
            style.textContent = `
                td.col-2.grayout,
                .metaslider-ui-inner.grayout {
                    opacity: 0.5 !important;
                    pointer-events: none !important;
                    background: #f4f4f4 !important;
                }
            `;
            document.head.appendChild(style);
        }

        slideRows.forEach(addCheckboxToSlideRow);

        const ids = slideRows.map(row => (row.id || '').replace(/^slide-/, '')).filter(Boolean);
        if (!ids.length) {
            if (initialLoading) {
                hideLoading();
                initialLoading = false;
            }
            return;
        }

        fetch(ajaxurl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=get_slide_hide_flags&ids[]=' + ids.join('&ids[]=')
        })
        .then(res => res.json())
        .then(json => {
            const flags = json?.success && json.data ? json.data : {};
            slideRows.forEach(row => {
                const id = (row.id || '').replace(/^slide-/, '');
                const flag = flags[id] === '1';
                if (row._metasliderCheckbox && row._metasliderSetGrayout) {
                    row._metasliderCheckbox.checked = flag;
                    row._metasliderSetGrayout(flag);
                }
            });
        })
        .finally(() => {
            if (initialLoading) {
                hideLoading();
                initialLoading = false;
            }
        });
    }

    function watchForSlideRows() {
        setupMetasliderHideCheckboxes();
        const observer = new MutationObserver((mutations) => {
            let addedRows = [];
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches && node.matches('tr.slide[data-attachment-id]')) {
                            addCheckboxToSlideRow(node);
                            addedRows.push(node);
                        }
                        node.querySelectorAll && node.querySelectorAll('tr.slide[data-attachment-id]').forEach(subNode => {
                            addCheckboxToSlideRow(subNode);
                            addedRows.push(subNode);
                        });
                    }
                });
            });

            if (addedRows.length > 0) {
                const ids = addedRows.map(row => (row.id || '').replace(/^slide-/, '')).filter(Boolean);
                if (ids.length) {
                    fetch(ajaxurl, {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'action=get_slide_hide_flags&ids[]=' + ids.join('&ids[]=')
                    })
                    .then(res => res.json())
                    .then(json => {
                        const flags = json?.success && json.data ? json.data : {};
                        addedRows.forEach(row => {
                            const id = (row.id || '').replace(/^slide-/, '');
                            const flag = flags[id] === '1';
                            if (row._metasliderCheckbox && row._metasliderSetGrayout) {
                                row._metasliderCheckbox.checked = flag;
                                row._metasliderSetGrayout(flag);
                            }
                        });
                    });
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    document.addEventListener('DOMContentLoaded', () => {
        showLoading();
        watchForSlideRows();
    });
})();

// Add for TEL to phone number
document.addEventListener("DOMContentLoaded", function() {
    let telElem = document.querySelector('.tel');
    if (!telElem) {
        return;
    }
    const origInnerHTML = telElem.innerHTML;

    function hasWideTelText() {
        const width = telElem.offsetWidth;
        return width >= 80;
    }

    function isPortrait() {
        const result = window.matchMedia("(orientation: portrait)").matches;
        return result;
    }
    function isPortraitAndInWidth() {
        const result = isPortrait() && window.innerWidth < 1000;
        return result;
    }
    function isLandscapeMode() {
        const result = window.innerWidth < 1200 && !isPortrait();
        return result;
    }
    function isTelNumber(str) {
        const result = /^\d{2,4}-\d{2,4}-\d{3,4}$/.test(str.trim()) || /^\d{10,11}$/.test(str.replace(/-/g, '').trim());
        return result;
    }

    function renderTelContent() {
        let isParentATag = telElem.parentElement && telElem.parentElement.tagName.toLowerCase() === 'a';
        let parentATag = isParentATag ? telElem.parentElement : null;

        if (isParentATag) {
            let aText = parentATag.textContent;
            let hasNumber = /\d{2,4}-\d{2,4}-\d{3,4}|\d{10,11}/.test(aText);

            if (!hasNumber && hasWideTelText()) {
                let telNumber = '';
                let href = parentATag.getAttribute('href');
                if (href && href.indexOf('tel:') === 0) {
                    telNumber = href.replace('tel:', '');
                }
                telElem.innerHTML = `<i class="material-icons">local_phone</i> ${telNumber}`;
                return;
            } else {
                telElem.innerHTML = origInnerHTML;
            }
        }

        let aTag = isParentATag ? parentATag : telElem.querySelector('a');
        if (!aTag) {
            return;
        }

        const href = aTag.getAttribute('href');
        const telNumber = href ? href.replace(/^tel:/, '') : '';
        const gaAttr = aTag.getAttribute('onclick') || '';

        if ((isLandscapeMode() && !hasWideTelText()) || 
            (isLandscapeMode() && aTag.textContent.trim() === 'TEL')
        ) {
            const telLinkHTML = `<a href="tel:${telNumber}"${gaAttr ? ` onclick="${gaAttr}"` : ''}><span class="tel-number">${telNumber}</span></a>`;
            telElem.innerHTML = `<i class="material-icons">local_phone</i> ${telLinkHTML}`;
            return;
        }

        if (isPortraitAndInWidth()) {
            if (isTelNumber(aTag.textContent) && !hasWideTelText()) {
                aTag.textContent = 'TEL';
            }
            return;
        }

        telElem.innerHTML = origInnerHTML;
    }

    renderTelContent();

    window.addEventListener('resize', function() {
        renderTelContent();
    });
    window.addEventListener('orientationchange', function() {
        renderTelContent();
    });
});

(function () {
    if (location.pathname.indexOf('/wp-admin/') !== -1) return;
    const TARGET_FORM_ID = 'searchform';

    function isTargetSearchForm(form) {
        return !!form && form.tagName && form.tagName.toLowerCase() === 'form' && form.id === TARGET_FORM_ID;
    }

    function isEmptySearchForm(form) {
        if (!isTargetSearchForm(form)) return false;
        const s = form.querySelector('input[name="s"]');
        if (!s) return false;
        return s.value.trim() === '';
    }

    function block(event) {
        console.warn('Empty search blocked');
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
        return false;
    }

    document.addEventListener(
        'submit',
        function (event) {
            if (isEmptySearchForm(event.target)) return block(event);
        },
        true
    );

    document.addEventListener(
        'click',
        function (event) {
            const eventTarget = event.target;
            if (!eventTarget) return;

            const isSubmitLike =
                (eventTarget.tagName === 'INPUT' && (eventTarget.type === 'submit' || eventTarget.type === 'image')) ||
                (eventTarget.tagName === 'BUTTON' && (eventTarget.type === 'submit' || eventTarget.type === ''));
            
            if (!isSubmitLike) return;

            const form = eventTarget.form;
            if (!form) return;

            if (isEmptySearchForm(form)) return block(event);
        },
        true
    );
})();
