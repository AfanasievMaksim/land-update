import $ from "jquery";
import LazyLoad from "vanilla-lazyload";

const lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy",
});

let currentApartment = 'ext';

$('.section-col--actions .btn').on('click', function() {
  const iframeId = $(this).data('iframe');

  if (iframeId === 'ext') {
    $('.iframes').removeClass('hide');
    $('.instructions').removeClass('hide');
    $('.floor-plans').addClass('hide');
    $('.js-toggle-views').addClass('hide');
    $('[data-view="3d"]').addClass('active').siblings().removeClass('active')
  } else {
    $('.js-toggle-views').removeClass('hide');
  }

  $('[data-id]').removeClass('active')
  $(`[data-id="${iframeId}"]`).addClass('active')
  $(this).addClass('active').siblings().removeClass('active')
});

$('.js-toggle-views .toggle-views__item').on('click', function() {
  $(this).addClass('active').siblings().removeClass('active');
  if ($(this).data('view') === '2d') {
    $('.iframes').addClass('hide');
    $('.instructions').addClass('hide');
    $('.floor-plans').removeClass('hide');
  } else {
    $('.iframes').removeClass('hide');
    $('.instructions').removeClass('hide');
    $('.floor-plans').addClass('hide');
  }
});
