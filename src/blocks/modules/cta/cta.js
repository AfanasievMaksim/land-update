$(document).ready(function() {
  let closed = false;
  let opened = false;

  $('.cta-people').on('click', function() {
    $('.cta').addClass('active');
    $('.cta-people').removeClass('active-num');
    opened = true;
  });

  setTimeout(() => {
    if (!opened) {
      $('.cta-people').addClass('active-num');
    }
  }, 5000);

  $('.cta-modal__close').on('click', function() {
    $('.cta').removeClass('active');
    closed = true;
  });

  $(window).on('scroll', function () {
    if (!closed) {
      if ($(window).scrollTop() > $(window).height() * 1.5) {
        if ($(window).width() > 767) {
          $('.cta').addClass('active');
          opened = true;
        }
      } else {
        $('.cta').removeClass('active');
      }
    }
  });
});