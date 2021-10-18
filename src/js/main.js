import "./import/modules";
import $ from "jquery";
import "bootstrap/js/dist/modal";
import intlTelInput from 'intl-tel-input';
import utils from 'intl-tel-input/build/js/utils';
import screenfull from 'screenfull';
import LazyLoad from "vanilla-lazyload";

const lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy",
});

$(document).ready(function () {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  $(".menu").addClass("visible");
});

$(document).on("click", function (e) {
  if (
    $(e.target).closest(".menu").length == 0 &&
    $(".menu").hasClass("active") &&
    $(e.target).closest(".header-burger").length == 0
  ) {
    $(".menu").removeClass("active");
  }

  if (
    $(".threesixty__dropdown").hasClass("active") &&
    !$(e.target).hasClass("threesixty__dropdown-title") &&
    $(e.target).closest('.threesixty__dropdown').length === 0
  ) {
    $(".threesixty__dropdown").removeClass("active");
  }
  
});

/// redesign
$("input.new[name=phone]").each((i,e) => {
  intlTelInput(e, {
    initialCountry: "auto",
    autoPlaceholder: "aggressive",
    customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
      return selectedCountryPlaceholder
    },
    separateDialCode: true,
    geoIpLookup: function(callback) {
      $.get('https://ipinfo.io', function() {}, "json").always(function(resp) {
        var countryCode = (resp && resp.country) ? resp.country : "vn"
        callback(countryCode)
      })
    },
    utilsScript: utils
  })
})

const numberValidator = (e) => {
  let iti = window.intlTelInputGlobals.getInstance($(e).find("input[name=phone]")[0])
  return iti.isValidNumber()
}

$("#form-pdf-new").on("submit", function (e) {
  e.preventDefault();

  const formDataTel = $(this).find('input[name="phone"]');
  const formDataName = $(this).find('input[name="name"]');

  if (numberValidator(e.currentTarget)) {
    $(".modal").modal("hide");
    formDataTel.val("");
    formDataName.val("");
    formDataTel.removeClass("valid");
    formDataName.removeClass("valid");

    setTimeout(() => {
      $("#modal-thanks-pdf").modal("show");
    }, 0);

    setTimeout(() => {
      window.open($(".download-pdf-link").attr("href"), "_blank");
    }, 500);
  } else {
    $(this).find(".form-validation-error").removeClass("hidden");
  }
});

$("#form-book").on("submit", function (e) {
  e.preventDefault();

  const formDataTel = $(this).find('input[name="phone"]');
  const formDataName = $(this).find('input[name="name"]');

  if (numberValidator(e.currentTarget)) {
    $(".modal").modal("hide");
    formDataTel.val("");
    formDataName.val("");
    formDataTel.removeClass("valid");
    formDataName.removeClass("valid");

    setTimeout(() => {
      $("#modal-thanks").modal("show");
    }, 0);
  } else {
    $(this).find(".form-validation-error").removeClass("hidden");
  }
});

$('.modal-row-action, .modal-title__anchor').on( 'click', function(){ 
  var el = $(this);
  var dest = el.attr('href');

  console.log($(dest).offset().top);

  if(dest !== undefined && dest !== '') {
    $('#modal-photos').animate({ 
      scrollTop: $(dest).offset().top - $('html').scrollTop()
    }, 500);
  }
  return false;
});

$('#modal-photos').on('scroll', function(e) {
  const titles = $('#modal-photos .modal-column--info .modal-title')
  const htmlScroll = $('html').scrollTop();
  const intPhoto = $('#first-int').offset().top;
  const extPhoto = $('#first-ext').offset().top;

  if (intPhoto > 0 && extPhoto - htmlScroll > 0) {
    if (!$(titles[0]).hasClass('active')) {
      titles.removeClass('active');
      $(titles[0]).addClass('active');
    }
  } else {
    if (!$(titles[1]).hasClass('active')) {
      titles.removeClass('active');
      $(titles[1]).addClass('active');
    }
  }
})

//modal photo
let showNewModal = '';

$("#modal-photos .feature").on("click", function (e) {
  showNewModal = $(this).data('modal');
});

$("#modal-photos").on("hidden.bs.modal", function (e) {
  if (showNewModal) {
    $(`#${showNewModal}`).modal("show");
    showNewModal = '';
  }
});

//360


let imageData = $('#modal-360 .threesixty__dropdown-item.active').data('imageFolder');
let imageDownloaded = 0;

let dragging = false;
let imageIndex = 0;
let dragStart = 0;
let rotation = 0;
let prevRotation = 0;
let rotate = 0;
let pixelsPerDegree = 10;

const loadingImageCB = () => {
  imageDownloaded += 100 / 36;
  if (imageDownloaded >= 99) {
    $('.threesixty-container').addClass('loaded')
    $('.js-loader-percent').text(`0%`)
  } else {
    $('.js-loader-percent').text(`${Math.round(imageDownloaded)}%`)
  }
}

const renderImage = () => {
  const imageContainer = $('.threesixty-images__container')
  imageContainer.empty();
  let classes = 'image'
  for (let i = 1; i < 37; i++) {
    if (i === 1) {
      classes += ' active'
    } else {
      classes = 'image'
    }
    const image = new Image();
    image.src = `${imageData}${i}.jpg`
    image.onload = loadingImageCB
    image.classList = classes
    imageContainer.append( image );
  }
}

$('#js-toogle-fullscreen').on('click', function() {
  if (screenfull.isEnabled) {
    screenfull.toggle(document.querySelector('.threesixty-container'));
  }
});

if (screenfull.isEnabled) {
  screenfull.on('change', () => {
    if (screenfull.isFullscreen) {
      $('#js-toogle-fullscreen').addClass('open');
    } else {
      $('#js-toogle-fullscreen').removeClass('open');
    }
  });
} else {
  $('.threesixty').addClass('unsupported-fullscreen')
}


$('.threesixty__dropdown').on('click', function(e) {
  $(this).toggleClass('active');
})

$('.threesixty__dropdown-item').on('click', function(e) {
  e.stopPropagation();
  $('.threesixty__dropdown-item').removeClass('active');
  $(".threesixty__dropdown").removeClass("active");
  $('.threesixty__dropdown-title').text($(this).text())
  $('.threesixty-container').removeClass('loaded')
  $('.threesixty-container').removeClass('touched');
  imageDownloaded = 0;
  imageData = $(this).data('imageFolder');
  imageIndex = 0;
  dragStart = 0;
  rotation = 0;
  prevRotation = 0;
  rotate = 0;
  $('.image-dron-inner').css({
    transform: ''
  })
  renderImage();
  $(this).addClass('active');
})

$('#modal-360').on('shown.bs.modal', function () {
  renderImage()
  $('.threesixty-container').removeClass('touched');
})

const handleDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let pixelDiff
    if (e.type === 'touchstart') {
      pixelDiff = e.touches[0].screenX
    } else {
      pixelDiff = e.screenX
    }

    dragging = true;
    dragStart = pixelDiff;
  }

const handleUp = () => {
  dragging = false;
}

const updateImageIndex = (currentPosition) => {
  $('.threesixty-container').addClass('touched');
  let dx = dragStart - currentPosition
  let newIndex

  if (dx < 0) {
    newIndex = imageIndex - 1

    if (newIndex < 0) {
      newIndex = 35
    }
  } else if (dx > 0) {
    newIndex = imageIndex + 1
    if (newIndex > 35) {
      newIndex = 0
    }
  }

  imageIndex = newIndex;

  $($('.threesixty-images__container img')[imageIndex]).addClass('active').siblings().removeClass('active');
  dragStart = currentPosition;
  rotation = newIndex;

  if (rotation > prevRotation || (prevRotation === 35 && rotation === 0)) {
    rotate += 1;
  } else if (rotation < prevRotation || (prevRotation === 0 && rotation === 35)) {
    rotate -= 1;
  }

  $('.image-dron-inner').css({
    transform: `rotate(${rotate * 10}deg)`
  })

  prevRotation = rotation
}

const handleMove = (e) => {
  let pixelDiff
  if (e.type === 'touchmove') {
    pixelDiff = e.touches[0].screenX
  } else {
    pixelDiff = e.screenX
  }

  if (dragging && dragStart !== 0) {
    if (Math.abs(dragStart - pixelDiff) > pixelsPerDegree) {
      updateImageIndex(Math.round(pixelDiff))
    }
  }
}

const preventDragHandler = (e) => {
  e.preventDefault()
}

$('.threesixty-images__container').on('dragstart', preventDragHandler);
$('.threesixty-images__container').on('mouseup', handleUp);
$('.threesixty-images__container').on('touchstart', handleDown);
$('.threesixty-images__container').on('mousemove', handleMove);
$('.threesixty-images__container').on('touchmove', handleMove);
$('.threesixty-images__container').on('mousedown', handleDown);
$('.threesixty-images__container').on('touchend', handleUp);

// layouts
const layoutsModal = $('#modal-layouts');
const layoutsModalTitle = layoutsModal.find('.modal-title');
const layoutsModalHeaderBtn = layoutsModal.find('.modal-action--second-screen')
const apartmentsContainer = $('.js-apartments-body');
const apartmentItem = apartmentsContainer.find('.layouts-section__apartment');
const layoutsModalTabs = layoutsModal.find('.layouts-section__tabs');
const layoutsModalTab = layoutsModalTabs.find('.layouts-section__tab');
const layoutsModalTabContent = layoutsModal.find('.layouts-section__tab-content')
let isActivated3d = false;

const renderApartmentsInfo = (bed, bath, square, price) => {
  $('.js-layout-desc-bed').find('span').text(bed)
  $('.js-layout-desc-bath').find('span').text(bath)
  $('.js-layout-desc-square').find('span').text(square)
  $('.js-layout-desc-price').find('span').text(price)
}

const chngeModalTitle = (key) => {
  const data = {
    "intro": "Các layout có sẵn của dự án",
    "2d": "2D Layout",
    "3d": "<span style='color: #EC133A;'>3D</span> Layout",
    "floor": "floor",
    "photo": "photo",
  }

  if ($(window).width() < 1024) {
    layoutsModalTitle.html(data[key])
  } else {
    layoutsModalTitle.html(data['intro'])
  }
}

// 3d
const ifwin = document.querySelector('.VR-layout').contentWindow;
let isInitDone = false;

let cb3dlayouts = (e) => {
  let d = e.data;
  
  if (d.type !== 'buttons') return;

  if (d.action === 'init') {
    isInitDone = true;

    ifwin.postMessage({type: "buttons", action: "logo", fullsize: false}, "*");
  }

  if (d.action === 'visibility' && d.visible) {
    $('.layouts-section__tab-content--3d').addClass('activated')
  }

  // console.log('work', d);
}

const init3dLayout = () => {
  const timer = setInterval(() => {
    console.log(123);
    console.log(isInitDone);
    if (isInitDone) {
      clearInterval(timer);
      return;
    } else {
      ifwin.postMessage({ type: 'buttons', action: 'init' }, '*');
    }
  }, 100)

  window.removeEventListener("message", cb3dlayouts);
  window.addEventListener("message", cb3dlayouts);
}

// layouts-section__tab-content
const activateSecondScreen = () => {
  layoutsModal.addClass('second-screen')
}

layoutsModalHeaderBtn.on('click', function() {
  layoutsModal.removeClass('second-screen')
})

apartmentItem.on('click', function() {
  $(this).addClass('active').siblings().removeClass('active');
  $('.layouts-section__tab-content--3d').removeClass('activated')
  const bed = $(this).data('bed')
  const bath = $(this).data('bath')
  const square = $(this).data('square')
  const price = $(this).data('price')
  const layout2d = $(this).data('layout-2d')
  const layout3d = $(this).data('layout-3d')
  renderApartmentsInfo(bed, bath, square, price)
  showMiniModal('#mini-modal-help')

  chngeModalTitle(layoutsModalTabs.find('.layouts-section__tab.active').data('title'))

  $('.js-layout-2d').attr('data-src', layout2d)
  $('.js-layout-3d').attr('data-src', layout3d)
  const activeLayoutItem = $('.layouts-section__tab-content.active').find('.js-layout-decor')
  const layoutSrc = activeLayoutItem.attr('data-src');
  activeLayoutItem.attr('src', layoutSrc);

  activateSecondScreen()
  if ($('.layouts-section__tab--3d').hasClass('active') && !isActivated3d) {
    isInitDone = false
    init3dLayout();
  } else {
    isActivated3d = false
  }
})

layoutsModalTab.on('click', function() {
  $(this).addClass('active').siblings().removeClass('active');
  layoutsModalTabContent.removeClass('active');
  const activeTab = $(`#${($(this).data('tab'))}`);
  const layoutSrc = activeTab.find('.js-layout-decor').attr('data-src');

  if ($(this).data('tab') === 'tab-3d') {
    if (!isActivated3d) {
      init3dLayout();
      activeTab.find('.js-layout-decor').attr('src', layoutSrc);
    }
    isActivated3d = true
  } else {
    activeTab.find('.js-layout-decor').attr('src', layoutSrc);
  }

  activeTab.addClass('active');
});

$('[data-title]').on('click', function() {
  chngeModalTitle($(this).data('title'))
})

//tour
$('.js-open-tour').on('click', function() {
  $(this).closest('.tour-section__help').remove();
});

// mini modal
function showMiniModal(id) {
  $('.mini-modal').removeClass('show');
  $(id).addClass('show')
}

function closeMiniModal(target) {
  if ($(target).closest('.mini-modal__content').length === 0) {
    $('.mini-modal').removeClass('show');
  }
}
$('[data-close-minimodal]').on('click', function() {
  $('.mini-modal').removeClass('show');
});

$('[data-show-minimodal]').on('click', function() {
  showMiniModal($(this).data('show-minimodal'))
})
$('.mini-modal').on('click', function(e) {
  closeMiniModal(e.target)
});

$(".form-book-mini-modal").on("submit", function (e) {
  e.preventDefault();

  const formDataTel = $(this).find('input[name="phone"]');
  const formDataName = $(this).find('input[name="name"]');

  if (numberValidator(e.currentTarget)) {
    formDataTel.val("");
    formDataName.val("");
    formDataTel.removeClass("valid");
    formDataName.removeClass("valid");

    setTimeout(() => {
      showMiniModal('#mini-modal-thanks')
    }, 0);
  } else {
    $(this).find(".form-validation-error").removeClass("hidden");
  }
});
