import "./import/modules";
import $ from "jquery";
import "bootstrap/js/dist/modal";
import intlTelInput from 'intl-tel-input';
import utils from 'intl-tel-input/build/js/utils';
import Inputmask from "inputmask";
import LazyLoad from "vanilla-lazyload";
import "ion-rangeslider";
import Chart from "chart.js";
import { init360 } from '../blocks/modules/shared/360/index';
import { initLayouts } from '../blocks/modules/shared/layouts/index';

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

$("#form-recall-new").on("submit", function (e) {
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
init360('#modal-360', 'shown.bs.modal');

init360('.construction-monitoring');

// layouts
initLayouts('#modal-layouts', '.modal-title');

initLayouts('.layouts', '.section-title');

//tour
$('.js-open-tour').on('click', function() {
  $(this).closest('.tour-section__help').remove();
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

$('.menu a, .menu .btn-new').on('click', function() {
  $('.menu').removeClass('active');
});

$('.footer .navigation, .menu .navigation').on( 'click', function(){ 
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

///hypoteck-new
const mortgageRange = $(".section-column__range--mortgage");
const mortgageInput = $(".section-column__input--mortgage");

const costRange = $(".section-column__range--cost");
const costInput = $(".section-column__input--cost");

const yearRange = $(".section-column__range--year");
const yearInput = $(".section-column__input--year");

const addedRange = (step, costClb, el, inputEl, min, max, from) => {
  el.ionRangeSlider({
    skin: "round",
    type: "single",
    min: min,
    max: max,
    from: from,
    hide_min_max: true,
    hide_from_to: true,
    prettify_enabled: true,
    step: step,
    onStart: function (data) {
      if (costClb) {
        inputEl.prop("value", data.from / 10);
      } else {
        inputEl.prop("value", data.from);
      }
    },
    onChange: function (data) {
      if (costClb) {
        inputEl.prop("value", data.from / 10);
      } else {
        inputEl.prop("value", data.from);
      }
      calculatedPrice();
    },
  });
};

const addedInputMask = (el, mask) => {
  Inputmask("decimal", {
    groupSeparator: ",",
    inputtype: "text",
    suffix: mask,
  }).mask(el);
};

addedRange(window.costRangeStep, true, costRange, costInput, window.costRangeFrom, window.costRangeTo * 10, window.costRangeStart * 10);
addedRange(window.mortgageRangeStep, false, mortgageRange, mortgageInput, window.mortgageRangeFrom, window.mortgageRangeTo, window.mortgageRangeStart);
addedRange(window.yearRangeStep, false, yearRange, yearInput, window.yearRangeFrom, window.yearRangeTo, window.yearRangeStart);
addedInputMask(costInput, " tỷ");
addedInputMask(mortgageInput, " %");
addedInputMask(yearInput, " năm");
addedInputMask($(".section-column__input--bank"), " %");

$(".section-column__input--bank").val($(".section-column__select").val());

$(".section-column__select").on("change", function () {
  $(".section-column__input--bank").val($(this).val());
  calculatedPrice();
});

// And for a doughnut chart
let COLORS= ["#0E83BE", "#12A3EC", "#92D5F7"];

var ChartData = {
  datasets: [
    {
      data: [10, 20, 30],
      backgroundColor: COLORS,
    },
  ],

  labels: ["Red", "Yellow", "Blue"],
};

var ChartOptions = {
  hover: false,
  legend: {
    display: false,
  },
  cutoutPercentage: 85,
  events: [],
};

var ctx = document.getElementById("myChart").getContext("2d");

var myDoughnutChart = new Chart(ctx, {
  type: "doughnut",
  data: ChartData,
  options: ChartOptions,
});

function formatedNum(num) {
  let tmp = String(new Intl.NumberFormat("en").format(Math.round(num)));
  return tmp;
}

const calcPayment = (sumHyp, yearCount, bankPercent, startedSum) => {
  let monthPayment = startedSum / (yearCount * 12);
  let monthCost = sumHyp * bankPercent;
  let res = monthCost + monthPayment;
  return { res, monthCost, monthPayment };
};

function calculatedPrice() {
  const resultValue = $(".calculator .js-result");
  const allSumValue = $(".calculator .js-all-sum");
  const prepaymentValue = $(".calculator .js-prepayment");
  const paymentValue = $(".calculator .js-payment");
  const percentValue = $(".calculator .js-percent");
  const bankPercentValue =
    Number($(".section-column__input--bank").val().slice(0, -1)) / 100 / 12;
  const yearsCountValue = Number(yearInput.val().slice(0, -3));
  const mortageValue = Number(mortgageInput.val().slice(0, -1));
  const flatCostValue = Number(costInput.val().slice(0, -2)) * 1000000000;
  let sumHypothec = (flatCostValue * mortageValue) / 100;
  let prepayment = flatCostValue - sumHypothec;

  let res = calcPayment(
    sumHypothec,
    yearsCountValue,
    bankPercentValue,
    sumHypothec
  );

  let tmp = sumHypothec;
  let a;
  let sum = 0;

  for (let i = 1; i <= yearsCountValue * 12; i++) {
    a = calcPayment(tmp, yearsCountValue, bankPercentValue, sumHypothec);
    tmp -= Math.round(a.monthPayment);
    sum += Math.round(a.monthCost);
  }

  prepaymentValue.text(formatedNum(prepayment));
  paymentValue.text(formatedNum(sumHypothec));
  resultValue.text(formatedNum(Math.round(res.res)));
  percentValue.text(formatedNum(Math.round(sum / 1000) * 1000));
  allSumValue.text(
    Math.round(
      (prepayment + sumHypothec + Math.round(sum / 1000) * 1000) / 10000000
    ) / 100
  );

  myDoughnutChart.data.datasets[0].data = [
    prepayment,
    sumHypothec,
    Math.round(sum / 1000) * 1000,
  ];

  myDoughnutChart.update();
}

calculatedPrice();