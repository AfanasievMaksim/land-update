import $ from 'jquery';

const openMenu = $('.header-burger');
const closeMenu = $('.menu__close');

$(openMenu).on('click', function() {
  $('.menu').addClass('active');
});

$(closeMenu).on('click', function() {
  $('.menu').removeClass('active');
});

$(document).ready(function() {
  if ($(window).scrollTop() > 0) {
    $('header').addClass('active');
  }
  
  $(document).on('scroll', function() {
    if ($(window).scrollTop() > 0) {
      $('header').addClass('active');
    } else {
      $('header').removeClass('active');
    }
  });

  $('.menu-nav__item').on( 'click', function(){ 
    var el = $(this);
    var dest = el.attr('href');
    $('.menu').removeClass('active');

    if(dest !== undefined && dest !== '') {
      $('html').animate({ 
        scrollTop: $(dest).offset().top - 56
      }, 500);
    }
    return false;
});
});