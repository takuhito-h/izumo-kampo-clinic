$(function(){
$('#header , #gNav').wrapAll('<div class="headercontents" />');
$('#main h2').wrapInner('<span></span>');
});

$(function(){

//ブログに著者情報を追加
$(".blogSec h2").after('<a href="/doctor" class="author-area"><div class="author-main-info"><img src="https://izumo-kampo.clinic/wp-content/uploads/2022/04/profile-photo.jpg" alt="" class="author-photo"><div class="author-text"><div class="author-name">執筆：宮本 信宏</div><div class="author-title">医師、出雲漢方クリニック院長</div></div></div><div class="author-link-text">プロフィール ▶︎</div></a>');

//診療時間にアイコン搭載
    $('.header_week').each(function(){
        var txt = $(this).html();
        $(this).html(
            txt.replace(/診療時間はこちら/g,'<i class="material-icons">chevron_right</i>  診療時間'));
    });
});
//TELにアイコン搭載
$(function(){
    $('.header_tel').each(function(){
        var txt = $(this).html();
        $(this).html(
            txt.replace(/TEL/g,'<i class="material-icons">local_phone</i>'));
    });
});
//
$(function () {
  $('#images').insertBefore('#contents');
});
//地図にアイコン搭載
$(function(){
    $('.mapSec_tomappage').each(function(){
        var txt = $(this).html();
        $(this).html(
            txt.replace(/大きい地図はこちら/g,'<i class="material-icons">location_on</i> 大きい地図はこちら'));
    });
});
//スマホにメニューのアイコンを記載
  $(function(){
    $('#mobile a').each(function(){
        var txt = $(this).html();
        $(this).html(
            txt.replace(/<img .*?src="(.*?)".*?>/g,'<i class="material-icons">menu</i>'));
    });
});

$(function(){
$('table').wrap('<div class="scroll-table" />');
});

$(function(){
//以下まとめてfunction

  var headerWeek = $('.header_week p');
  if (headerWeek.length != 0) {
    headerWeek.html(headerWeek.html().replace(/\<br\>/gi,''));
    headerWeek.find('i').appendTo(headerWeek.find('a'));
  }
  var infoData = $('.infoSec .info_date');
  if (infoData.length != 0) {
    infoData.html(infoData.html().replace(/\[|\]|\s/gi,''));
  }
  $('#searchsubmit').attr('src','https://wevery.jp/wp-content/uploads/2019/05/icon_find.png');
  $('.flexslider .slides').append($('.caption-wrap'));
  $('#footer').append($('#footer .address'));



  $('#header .header_tel .tel a').text('TEL');
  $('.banner.smart_phonebottom').before($('.banner.smart_phonetop'));
  $('#menu-main_menu').before('<div class="menu-side_top"></div>');

  //$('.menu-side_top #page_search').attr('id','page_search2');
  //$('.menu-side_top #s').attr('id','s2');
  //$('.menu-side_top #searchsubmit').attr('id','searchsubmit2');
   $('#mobile').on('click', function() {
    if ($(this).hasClass('side-open')) {
      $(this).delay(300).queue(function() {
        $(this).removeClass('side-open').dequeue();
        $('#header .header_tel').removeClass('side-open').dequeue();
      });
    } else {
      $(this).addClass('side-open');
      $('#header .header_tel').addClass('side-open');
    }
  });
  $('#sidr .close').on('click', function() {
    if ($('#mobile').hasClass('side-open')) {
      $('#mobile').delay(300).queue(function() {
        $('#mobile').removeClass('side-open').dequeue();
        $('#header .header_tel').removeClass('side-open').dequeue();
      });
    }
  });
  
  $('#sidr .menu_box h2').on('click', function() {
    $(this).toggleClass('active').next().slideToggle(400);
  });
  $('#sidr ul#menu-main_menu > li').each(function(index, element){
    if ($(this).find('.sub-menu').length > 0) {
      $(this).children('a').after('<div class="accordion-elm">▼</div>');
    }
  });
  $('#sidr ul#menu-main_menu > li .accordion-elm').on('click', function() {
    $(this).toggleClass('active').next().slideToggle(400);
  });

//まとめてfunctionここまで
});

