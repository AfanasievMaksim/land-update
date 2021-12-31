import $ from "jquery";
import LazyLoad from "vanilla-lazyload";
import screenfull from 'screenfull';

const lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy",
});

if (!screenfull.isEnabled) {
  $('body').addClass('unsupported-fullscreen')
}

let currentVR = 'ext'
let currentView = '3d'

const iframes = document.querySelectorAll('.iframes iframe')
const iframesCollection = {}

for (let i = 0; i < iframes.length; i += 1) {
  iframesCollection[iframes[i].id] = iframes[i].contentWindow
}
console.log(iframesCollection);
let isInitDone = false;

let cb3dlayouts = (vr) => (e) => {
  let d = e.data;
  
  if (d.type !== 'buttons') return;

  if (d.action === 'init') {
    isInitDone = true;
    iframesCollection[vr].postMessage({type: "buttons", action: "logo", fullsize: false, position: "bottomleft", borderX: -50, borderY: -50 }, "*");
  }

  if (d.action === 'visibility' && d.visible) {
    $(`#${vr}`).addClass('activated')
    if ($(`#${currentVR}`).hasClass('activated')) {
      $('.iframes__buttons').addClass('active')
    }
  }

  console.log('work', d);
}

const init3dLayout = (vr) => {
  const timer = setInterval(() => {
    if (isInitDone) {
      clearInterval(timer);
      return;
    } else {
      iframesCollection[currentVR].postMessage({ type: 'buttons', action: 'init' }, '*');
    }
  }, 100)

  window.removeEventListener("message", cb3dlayouts(vr));
  window.addEventListener("message", cb3dlayouts(vr));
}

init3dLayout(currentVR)

$('.iframes__buttons [data-action]').on('click', function() {
  const action = $(this).data('action');

  if (action === 'walk') {
    $(this).addClass('active').siblings().removeClass('active')
    iframesCollection[currentVR].postMessage({ type: 'buttons', action: 'movemode', name: 'Walk' }, '*')
  }

  if (action === 'orbit') {
    $(this).addClass('active').siblings().removeClass('active')
    iframesCollection[currentVR].postMessage({ type: 'buttons', action: 'movemode', name: 'Orbit' }, '*')
  }

  if (action === 'screenshot') {
    iframesCollection[currentVR].postMessage({ type: 'buttons', action: 'action', name: "Screenshot", event: "click" }, '*')
  }

  if (action === 'fullscreen') {
    if (screenfull.isEnabled) {
      screenfull.toggle(document.querySelector(`.iframes`));
    }
  }

  console.log(action);
})

//
$('.section-col--actions .btn').on('click', function() {
  const iframeId = $(this).data('iframe');
  isInitDone = false

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
    currentView = '3d'
  } else {
    $('.js-toggle-views').removeClass('hide');
  }

  $('[data-id]').removeClass('active')
  $(`[data-id="${iframeId}"]`).addClass('active')
  $(this).addClass('active').siblings().removeClass('active')
  iframesCollection[currentVR].postMessage({ type: 'buttons', action: 'movemode', name: 'Orbit' }, '*')
  currentVR = iframeId
  $('[data-action="orbit"]').addClass('active').siblings().removeClass('active')

  if ($(`#${iframeId}`).hasClass('activated') && currentView !== '2d') {
    $('.iframes__buttons').addClass('active')
  } else {
    $('.iframes__buttons').removeClass('active')
    if(currentView === '3d') {
      init3dLayout(iframeId)
    }
  }
});

$('.js-toggle-views .toggle-views__item').on('click', function() {
  $(this).addClass('active').siblings().removeClass('active');
  currentView = $(this).data('view')
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
