import $ from "jquery";
import LazyLoad from "vanilla-lazyload";

const lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy",
});

let currentApartment = 'ext';

$('.section-col--actions .btn').on('click', function() {
  const iframeId = $(this).data('iframe');

  const fa = $(this).data('fa');
  const ua = $(this).data('ua');

  if (fa && ua) {
    $('.info-2d').removeClass('hide')
    $('.js-fa').text(fa)
    $('.js-ua').text(ua)
  } else {
    $('.info-2d').addClass('hide')
  }

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

$(document).on('click', function(e) {
  if ($(e.target).closest('.lang-switcher-head').length === 0) {
    $('.lang-switcher').removeClass('is-open');
  }
  console.log(e.target);
})

$('.lang-switcher .lang-switcher-head').on('click', function() {
  $('.lang-switcher').toggleClass('is-open');
});

$('.lang-switcher .lang-switcher-body').on('click', function() {
  const langImg = $(this).find('img').attr('src');
  const selectedLang = $(this).find('p').text();

  $('.lang-switcher .lang-switcher-head').find('img').attr('src', langImg);
  $('.lang-switcher .lang-switcher-head').find('p').text(selectedLang);
});
