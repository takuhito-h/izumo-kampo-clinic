jQuery(document).ready(function () {
  jQuery(".mobile_menu").sidr({
    side: menu_slide,
  });

  url = location.protocol + '//' + location.host + location.pathname;
  hash_mobile_sidr = '#sidr a[href^="'+url+'#"]';

  jQuery(hash_mobile_sidr).on("click.sidr", () => {
    jQuery.sidr("close", "sidr");
    $mobile = jQuery("#mobile");
    if ($mobile.hasClass("side-open")) {
      $mobile.delay(300).queue(function () {
        jQuery(this).removeClass("side-open").dequeue();
        jQuery("#header .header_tel").removeClass("side-open").dequeue();
        jQuery("body").css({ overflow: "", height: "" });
      });
    }
  });

  jQuery(".mobile_menu").click(function () {
    jQuery("html,body").animate({ scrollTop: 0 }, "fast", "swing");
  });
});
