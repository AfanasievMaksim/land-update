import $ from "jquery";
import LazyLoad from "vanilla-lazyload";

const lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy",
});

$('.section-col--actions .btn').on('click', function() {
  const iframeId = $(this).data('iframe')
  $('.iframe').removeClass('active')
  $(`#${iframeId}`).addClass('active')
  $(this).addClass('active').siblings().removeClass('active')
});