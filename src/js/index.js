import "./import/modules";
import "ion-rangeslider";
import $ from "jquery";
import Inputmask from "inputmask";
import LazyLoad from "vanilla-lazyload";
import Flickity from "flickity-as-nav-for";
import "bootstrap/js/dist/modal";
import Chart from "chart.js";
import data from "../blocks/modules/filter";

$(document).ready(function () {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  $(".menu").addClass("visible");

  let COLORS;

  if ($('body').hasClass('blue')) {
    COLORS= ["#4A4AA1", "#AC64A9", "#E9BAC9"];
  } else if ($('body').hasClass('green')) {
    COLORS = ["#699EC5", "#73D1CC", "#4F5299"];
  }


  //section-nav__counter
  const sliderSecond = document.querySelector(".block-slider .section-slider");

  var flktySlider = new Flickity(sliderSecond, {
    pageDots: false,
    cellAlign: "left",
    prevNextButtons: false,
    lazyLoad: 4,
    wrapAround: false,
    on: {
      ready: function () {
        $(".js-all-slide").text(
          $(".block-slider .section-slider .slide").length
        );
        $(".section-nav__counter").addClass("active");
      },
      change: function (index) {
        $(".js-current-slide").text(index + 1);

        if (index == 0) {
          $(".block-slider .section-nav__prev").addClass("inactive");
        } else {
          $(".block-slider .section-nav__prev").removeClass("inactive");
        }
      },
    },
  });

  $(".block-slider .section-nav__prev").on("click", function () {
    flktySlider.previous();
  });

  $(".block-slider .section-nav__next").on("click", function () {
    flktySlider.next(true);
  });

  $(".block-slider .section-tag").on("click", function () {
    let index = $(this).data("group") - 1;
    flktySlider.selectCell(index);
  });

  //filters
  $(".js-show-filter").on("click", function () {
    $(this).hide();
    $(".filter .section-filter").addClass("show").show();
  });

  $(".filter .section-filter__close").on("click", function () {
    $(".js-show-filter").show();
    $(".filter .section-filter").removeClass("show").hide();
  });

  $(document).on("click", function (e) {
    if (
      $(e.target).closest(".filter .js-apend-item .section-table__row")
        .length == 0
    ) {
      $(".filter .js-apend-item .section-table__row").removeClass("active");
      $(".section-download-btn").removeClass("active");
    } else if (
      $(e.target).closest(".filter .js-apend-item .section-table__row").length >
      0
    ) {
      let target = $(e.target).closest(
        ".filter .js-apend-item .section-table__row"
      );
      if (target.hasClass("active")) {
        target.removeClass("active");
        $(".section-download-btn").removeClass("active");
      } else {
        target.addClass("active").siblings().removeClass("active");
        $(".section-download-btn").addClass("active");
        $("#modal-filter .js-modal-title").text(target.data("title"));
        $("#modal-filter .js-modal-area").text(target.data("area"));
        $("#modal-filter .js-modal-floor").text(target.data("floor"));
        $("#modal-filter .js-modal-price").text(target.data("price"));
      }
    }

    if (
      $(e.target).closest(".menu").length == 0 &&
      $(".menu").hasClass("active") &&
      $(e.target).closest(".header-burger").length == 0
    ) {
      $(".menu").removeClass("active");
    }

    if (
      $(".filter .section-filter__dropdown-items").hasClass("active") &&
      !$(e.target).hasClass("section-filter__dropdown-title")
    ) {
      $(".filter .section-filter__dropdown-items").removeClass("active");
    }

    if (
      $(".threesixty__dropdown").hasClass("active") &&
      !$(e.target).hasClass("threesixty__dropdown-title")
    ) {
      $(".threesixty__dropdown").removeClass("active");
    }
    
  });

  let showRecalModal = false;

  $(".modal-expert__btn").on("click", function () {
    showRecalModal = true;
  });

  $("#modal-filter").on("hidden.bs.modal", function (e) {
    if (showRecalModal) {
      $("#modal-recall").modal("show");
      showRecalModal = false;
    }
  });

  //filtering
  let cursDol = 0.00004;
  let cursEur = 0.00004;

  $.ajax({
    url: "/rates",
    type: "GET",
    success: function(response) {
      cursDol = response.VND_USD;
      cursEur = response.VND_EUR;
    },
    error: function() {
      console.error("error");
    }
  });

  function formatedNum(num) {
    let tmp = String(new Intl.NumberFormat("en").format(Math.round(num)));
    return tmp;
  }

  let minFloor = data[0].floor;
  let maxFloor = data[0].floor;
  let minArea = data[0].areaFrom;
  let maxArea = data[0].areaTo;
  let minAreaPrice = data[0].areaPrice;
  let maxAreaPrice = data[0].areaPrice;
  let minPrice = data[0].areaFrom * data[0].areaPrice;
  //let maxPrice = data[0].areaTo * data[0].areaPrice;
  let maxPrice = data[0].areaFrom * data[0].areaPrice;

  const findEl = (arr) => {
    for (let i = 1; i < arr.length; ++i) {
      if (data[i].floor < minFloor) minFloor = data[i].floor;
      if (data[i].floor > maxFloor) maxFloor = data[i].floor;
      if (data[i].areaFrom < minArea) minArea = data[i].areaFrom;
      if (data[i].areaTo > maxArea) maxArea = data[i].areaTo;
      if (data[i].areaPrice < minAreaPrice) minAreaPrice = data[i].areaPrice;
      if (data[i].areaPrice > maxAreaPrice) maxAreaPrice = data[i].areaPrice;
      if (data[i].areaFrom * data[i].areaPrice < minPrice)
        minPrice = data[i].areaFrom * data[i].areaPrice;
      //if (data[i].areaTo * data[i].areaPrice > maxPrice) maxPrice = data[i].areaTo * data[i].areaPrice;
      if (data[i].areaFrom * data[i].areaPrice > maxPrice)
        maxPrice = data[i].areaFrom * data[i].areaPrice;
    }
  };

  findEl(data);

  const startedArr = [...data];
  let currentArr = [...data];

  //
  const filterInputPriceMin = $(".section-filter__input--price-min");
  const filterInputPriceMax = $(".section-filter__input--price-max");
  const filterRangePrice = $(".section-filter__range--price");
  const filterInputAreaMin = $(".section-filter__input--area-min");
  const filterInputAreaMax = $(".section-filter__input--area-max");
  const filterRangeArea = $(".section-filter__range--area");
  const filterInputFloorMin = $(".section-filter__input--floor-min");
  const filterInputFloorMax = $(".section-filter__input--floor-max");
  const filterRangeFloor = $(".section-filter__range--floor");
  let currency = "VND";
  let isFilterArea = false;

  const renderTemplate = ({ title, roomImage, areaFrom, areaTo, floor, areaPrice }) => {
    let newPriceFrom;
    let newPriceTo;
    let newAreaPrice;

    if (currency == "VND") {
      newAreaPrice = `${formatedNum(areaPrice)} VND`;
      newPriceFrom = `${formatedNum(areaPrice * areaFrom)} VND`;
      newPriceTo = `${formatedNum(areaPrice * areaTo)} VND`;
    } else if (currency == "dolar") {
      newAreaPrice = `${formatedNum(areaPrice * cursDol)} USD`;
      newPriceFrom = `${formatedNum(areaPrice * areaFrom * cursDol)} USD`;
      newPriceTo = `${formatedNum(areaPrice * areaTo * cursDol)} USD`;
    } else if (currency == "euro") {
      newAreaPrice = `${formatedNum(areaPrice * cursEur)} EUR`;
      newPriceFrom = `${formatedNum(areaPrice * areaFrom * cursEur)} EUR`;
      newPriceTo = `${formatedNum(areaPrice * areaTo * cursEur)} EUR`;
    }

    const template = `<div class="section-table__row" data-title="${title}" data-area="${areaFrom}-${areaTo}" data-floor="${floor}" data-price="Từ ${newPriceFrom}">
      <div class="section-table__col">
        <div class="section-table__checkbox">
        </div>
        <div class="section-table__image">
          <img src="${roomImage}" alt="${title}">
        </div>
      </div>
      <div class="section-table__title section-table__text">
        ${title}
      </div>
      <div class="section-table__area section-table__text">
        ${areaFrom}-${areaTo} m2
      </div>
      <div class="section-table__floor section-table__text">
        Tầng ${floor}
      </div>
      <div class="section-table__area-price section-table__text">
        Từ ${newAreaPrice} / m2
      </div>
      <div class="section-table__price section-table__text">
        <div class="mob">
        Từ ${newPriceFrom}
        </div>
        <div class="desk">
        Từ ${newPriceFrom}
        </div>
      </div>
    </div>`;

    $(".filter .js-apend-item").append(template);
  };

  const filterItems = (arr, callback) => {
    $(".filter .js-apend-item").html("");
    let activeFloor = $(".filter .section-filter__floor.active");
    let newArr = [];
    let res = [];

    if (activeFloor.length != 0) {
      let filtered = [];
      for (let i = 0; i < activeFloor.length; i++) {
        filtered = arr.filter(
          (item) => item.room == $(activeFloor[i]).data("room")
        );
        newArr = [...newArr, ...filtered];
      }
    } else {
      newArr = [...arr];
    }

    let tmp = newArr
      .filter(
        (item) =>
          item.floor >= filterInputFloorMin.val() &&
          item.floor <= filterInputFloorMax.val()
      )
      .filter(
        (item) =>
          item.areaTo >= filterInputAreaMin.val() &&
          item.areaFrom <= filterInputAreaMax.val()
      );

    if (isFilterArea) {
      if (currency == "VND") {
        res = tmp.filter(
          (item) =>
            item.areaPrice >= filterInputPriceMin.val().split(",").join("") &&
            item.areaPrice <= filterInputPriceMax.val().split(",").join("")
        );
      } else if (currency == "dolar") {
        res = tmp.filter((item) => {
          return (
            Math.round(item.areaPrice * cursDol) >=
              filterInputPriceMin.val().split(",").join("") &&
            Math.round(item.areaPrice * cursDol) <=
              filterInputPriceMax.val().split(",").join("")
          );
        });
      } else if (currency == "euro") {
        res = tmp.filter(
          (item) =>
            Math.round(item.areaPrice * cursEur) >=
              filterInputPriceMin.val().split(",").join("") &&
            Math.round(item.areaPrice * cursEur) <=
              filterInputPriceMax.val().split(",").join("")
        );
      }
    } else {
      if (currency == "VND") {
        res = tmp.filter(
          (item) =>
            Math.round(item.areaPrice * item.areaFrom) >=
              filterInputPriceMin.val().split(",").join("") &&
            Math.round(item.areaPrice * item.areaFrom) <=
              filterInputPriceMax.val().split(",").join("")
        );
      } else if (currency == "dolar") {
        res = tmp.filter(
          (item) =>
            Math.round(item.areaPrice * item.areaFrom * cursDol) >=
              filterInputPriceMin.val().split(",").join("") &&
            Math.round(item.areaPrice * item.areaFrom * cursDol) <=
              filterInputPriceMax.val().split(",").join("")
        );
      } else if (currency == "euro") {
        res = tmp.filter(
          (item) =>
            Math.round(item.areaPrice * item.areaFrom * cursEur) >=
              filterInputPriceMin.val().split(",").join("") &&
            Math.round(item.areaPrice * item.areaFrom * cursEur) <=
              filterInputPriceMax.val().split(",").join("")
        );
      }
    }

    if (callback) {
      res.sort(callback);
    }

    return res;
  };

  const renderItems = (arr, num = 10) => {
    let counter = num;

    if (arr.length < 10) {
      counter = arr.length;
    }

    for (let i = 0; i < counter; i++) {
      renderTemplate(arr.shift());
    }

    currentArr = arr;

    let curItems = 10;
    let lostItems = arr.length;
    let allItems =
      Number($(".filter .js-apend-item .section-table__row").length) +
      Number(lostItems);

    if (lostItems <= 10) {
      curItems = lostItems;
    }

    if (lostItems == 0) {
      $(".filter .section-search__text").addClass("hidden");
    } else {
      $(".filter .section-search__text").removeClass("hidden");
    }

    $(".js-curent-items").text(curItems);
    $(".js-lost-items").text(lostItems);
    $(".js-all-items").text(allItems);
  };

  const addedFilterRange = (el, inputElTo, inputElFrom, min, max) => {
    el.ionRangeSlider({
      skin: "round",
      type: "double",
      min: min,
      max: max,
      to: max,
      from: min,
      hide_min_max: true,
      hide_from_to: true,
      prettify_enabled: true,
      onStart: function (data) {
        inputElTo.prop("value", data.from);
        inputElFrom.prop("value", data.to);
      },
      onChange: function (data) {
        inputElTo.prop("value", data.from);
        inputElFrom.prop("value", data.to);
      },
      onUpdate: function (data) {
        inputElTo.prop("value", data.min);
        inputElFrom.prop("value", data.max);
      },
      onFinish: function () {
        renderItems(filterItems([...data]));
      },
    });
  };

  const addedFilterInputMask = (el, group) => {
    Inputmask("decimal", {
      groupSeparator: group,
      inputtype: "text",
    }).mask(el);
  };

  addedFilterRange(
    filterRangePrice,
    filterInputPriceMin,
    filterInputPriceMax,
    minPrice,
    maxPrice
  );
  addedFilterInputMask(filterInputPriceMin, ",");
  addedFilterInputMask(filterInputPriceMax, ",");
  let priceRange = filterRangePrice.data("ionRangeSlider");
  addedFilterRange(
    filterRangeArea,
    filterInputAreaMin,
    filterInputAreaMax,
    minArea,
    maxArea
  );
  addedFilterInputMask(filterInputAreaMin, "");
  addedFilterInputMask(filterInputAreaMax, "");
  let areaRange = filterRangeArea.data("ionRangeSlider");
  addedFilterRange(
    filterRangeFloor,
    filterInputFloorMin,
    filterInputFloorMax,
    minFloor,
    maxFloor
  );
  addedFilterInputMask(filterInputFloorMin, "");
  addedFilterInputMask(filterInputFloorMax, "");
  let floorRange = filterRangeFloor.data("ionRangeSlider");

  renderItems(startedArr);

  const priceRangeUpdate = (min, max) => {
    priceRange.update({
      min,
      max,
      to: max,
      from: min,
    });
  };

  $(".filter .section-search__text").on("click", function () {
    renderItems(currentArr);
  });

  $(".filter .section-filter__floor").on("click", function () {
    $(this).toggleClass("active");

    renderItems(filterItems([...data]));
  });

  $(".filter .section-table__reset, .filter .section-filter__reset").on(
    "click",
    function () {
      $(".filter .section-filter__floor").removeClass("active");
      $(".filter .section-table__item")
        .removeClass("active")
        .removeClass("rotated");
      $(".filter .section-filter__dropdown-title--first").text(
        $(".filter .section-filter__dropdown-title--first").data("default")
      );
      $(".filter .section-filter__dropdown-title--second").text(
        $(".filter .section-filter__dropdown-title--second").data("default")
      );
      currency = "VND";
      isFilterArea = false;
      priceRange.update({
        min: minPrice,
        max: maxPrice,
        to: maxPrice,
        from: minPrice,
      });
      areaRange.reset();
      areaRange.update();
      floorRange.reset();
      floorRange.update();
      renderItems(filterItems([...data]));
    }
  );

  $(".filter .section-table__item").on("click", function () {
    let dataSort = $(this).data("sorting");
    let callbackToSmall;
    let callbackToBig;

    if (dataSort == "room") {
      callbackToSmall = (a, b) => a.room - b.room;
      callbackToBig = (a, b) => b.room - a.room;
    } else if (dataSort == "area") {
      callbackToSmall = (a, b) => a.areaFrom - b.areaFrom;
      callbackToBig = (a, b) => b.areaFrom - a.areaFrom;
    } else if (dataSort == "floor") {
      callbackToSmall = (a, b) => a.floor - b.floor;
      callbackToBig = (a, b) => b.floor - a.floor;
    } else if (dataSort == "price") {
      callbackToSmall = (a, b) =>
        a.areaFrom * a.areaPrice - b.areaFrom * b.areaPrice;
      callbackToBig = (a, b) =>
        b.areaFrom * b.areaPrice - a.areaFrom * a.areaPrice;
    }

    if ($(this).hasClass("active")) {
      $(this).addClass("rotated");
      renderItems(filterItems([...data], callbackToBig));
    } else {
      $(this)
        .addClass("active")
        .siblings()
        .removeClass("active")
        .removeClass("rotated");
      renderItems(filterItems([...data], callbackToSmall));
    }
  });

  $(".filter .section-filter__dropdown-title").on("click", function () {
    $(".filter .section-filter__dropdown-items").removeClass("active");
    $(this).next().addClass("active");
  });

  $(".filter .section-filter__dropdown-item").on("click", function () {
    $(this).parent().prev().text($(this).text());

    if ($(this).data("filter-area") == true) {
      isFilterArea = true;
    } else if ($(this).data("filter-area") == false) {
      isFilterArea = false;
    }

    if ($(this).data("currency") == "VND") {
      currency = "VND";
    }

    if ($(this).data("currency") == "dolar") {
      currency = "dolar";
    }

    if ($(this).data("currency") == "euro") {
      currency = "euro";
    }

    if (isFilterArea) {
      if (currency == "VND") {
        priceRangeUpdate(minAreaPrice, maxAreaPrice);
        renderItems(filterItems([...data]));
      } else if (currency == "dolar") {
        priceRangeUpdate(
          Math.round(minAreaPrice * cursDol),
          Math.round(maxAreaPrice * cursDol)
        );
        renderItems(filterItems([...data]));
      } else if (currency == "euro") {
        priceRangeUpdate(
          Math.round(minAreaPrice * cursEur),
          Math.round(maxAreaPrice * cursEur)
        );
        renderItems(filterItems([...data]));
      }
    } else {
      if (currency == "VND") {
        priceRangeUpdate(minPrice, maxPrice);
        renderItems(filterItems([...data]));
      } else if (currency == "dolar") {
        priceRangeUpdate(
          Math.round(minPrice * cursDol),
          Math.round(maxPrice * cursDol)
        );
        renderItems(filterItems([...data]));
      } else if (currency == "euro") {
        priceRangeUpdate(
          Math.round(minPrice * cursEur),
          Math.round(maxPrice * cursEur)
        );
        renderItems(filterItems([...data]));
      }
    }
  });
  // end

  //review
  const sliderReviews = document.querySelector(".reviews .slider");

  var flktyReviews = new Flickity(sliderReviews, {
    pageDots: false,
    cellAlign: "center",
    prevNextButtons: true,
    wrapAround: true,
    dragThreshold: 1,
    on: {
      ready: function () {
        $(sliderReviews).addClass("ready");
      },
      change: function (index) {
        $(".reviews .slider-nav__num").removeClass("active");
        $(".reviews .slider-nav__num").eq(index).addClass("active");
      },
    },
  });

  const lazyLoadInstanceReview = new LazyLoad({
    elements_selector: ".lazy-review",
    threshold: 50,
    callback_loaded: () => {
      lazyLoadInstanceReview.loadAll();
      flktyReviews.resize();
    },
  });

  $(".reviews .slider-nav__btn--prev").on("click", function () {
    flktyReviews.previous();
  });

  $(".reviews .slider-nav__btn--next").on("click", function () {
    flktyReviews.next();
  });

  $(".reviews .slider-nav__num").on("click", function () {
    $(this).addClass("active").siblings().removeClass("active");
    flktyReviews.selectCell($(this).data("index"));
  });

  //presentation
  const mouseenterImage = () => {
    $(".presentation").addClass("is-hover");
  };

  const mouseleaveImage = () => {
    $(".presentation").removeClass("is-hover");
  };

  $(".presentation .section__img").hover(mouseenterImage, mouseleaveImage);
  $(".presentation .section-decor__icon").hover(
    mouseenterImage,
    mouseleaveImage
  );

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

  const calcPayment = (sumHyp, yearCount, bankPercent, startedSum) => {
    let monthPayment = startedSum / (yearCount * 12);
    let monthCost = sumHyp * bankPercent;
    let res = monthCost + monthPayment;
    return { res, monthCost, monthPayment };
  };

  function calculatedPrice() {
    const resultValue = $(".hypothec .js-result");
    const allSumValue = $(".hypothec .js-all-sum");
    const prepaymentValue = $(".hypothec .js-prepayment");
    const paymentValue = $(".hypothec .js-payment");
    const percentValue = $(".hypothec .js-percent");
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

  /// gallery
  const slider = document.querySelector(".gallery .slider");
  const sliderNav = document.querySelector(".gallery .slider-nav");

  var glrFlkty = new Flickity(slider, {
    contain: true,
    pageDots: false,
    cellAlign: "center",
    prevNextButtons: true,
    lazyLoad: 2,
    wrapAround: true,
    dragThreshold: 1,
    on: {
      change: function (index) {
        flktySecond.selectCell(index + 3);
      },
    },
  });

  let flag = false;

  var flktySecond = new Flickity(sliderNav, {
    pageDots: false,
    cellAlign: "center",
    prevNextButtons: false,
    wrapAround: false,
    lazyLoad: 4,
    initialIndex: 3,
    dragThreshold: 1,
    on: {
      ready: function () {
        flag = true;
      },
      change: function (index) {
        let lastIndexNav = $(".gallery .slider-nav .slide").length - 1;
        let pos = index;

        if (index == 2) {
          pos = lastIndexNav - 3;
        } else if (index == 1) {
          pos = lastIndexNav - 4;
        } else if (index == 0) {
          pos = lastIndexNav - 5;
        } else if (index == lastIndexNav) {
          pos = 3;
        } else if (index == lastIndexNav - 1) {
          pos = 4;
        } else if (index == lastIndexNav - 2) {
          pos = 5;
        }

        if (flag) {
          flktySecond.selectCell(pos);
          glrFlkty.selectCell(pos - 3);
        }
      },
    },
  });

  $(sliderNav).on("click", ".slide", function () {
    let lastIndexNav = $(".gallery .slider-nav .slide").length - 1;
    let pos = $(this).index();

    if ($(this).index() == 2) {
      pos = lastIndexNav - 3;
    } else if ($(this).index() == 1) {
      pos = lastIndexNav - 4;
    } else if ($(this).index() == 0) {
      pos = lastIndexNav - 5;
    } else if ($(this).index() == lastIndexNav) {
      pos = 5;
    } else if ($(this).index() == lastIndexNav - 1) {
      pos = 4;
    } else if ($(this).index() == lastIndexNav - 2) {
      pos = 3;
    }

    flktySecond.selectCell(pos);
    glrFlkty.selectCell(pos - 3);
  });

  ///end gallery
  const lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
  });

  // btn

  $(".btn, .btn-new").each(function () {
    var $this = $(this);
    $this.css("overflow", "hidden");
    var ink, d, x, y;
    setInterval(function () {
      if ($this.find(".ink").length === 0) {
        $this.prepend("<span class='ink'></span>");
      }
      ink = $this.find(".ink");
      ink.removeClass("animate");
      if (!ink.height() && !ink.width()) {
        d = Math.max($this.outerWidth(), $this.outerHeight());
        ink.css({
          height: d,
          width: d,
        });
      }
      x = Math.round(Math.random() * ink.width() - ink.width() / 2);
      y = Math.round(Math.random() * ink.height() - ink.height() / 2);

      ink
        .css({
          top: y + "px",
          left: x + "px",
        })
        .addClass("animate");
    }, 3000);
  });

  const modalSlider = document.querySelector(".modal .modal-slider");

  var flktyModal = new Flickity(modalSlider, {
    pageDots: false,
    cellAlign: "center",
    prevNextButtons: true,
    wrapAround: true,
    //fade: true,
    lazyLoad: 2,
    dragThreshold: 1,
    on: {
      settle: function () {
        $(modalSlider).addClass("activeOp");
      },
    },
  });

  $("#modal-galerry").on("hiden.bs.modal", function (e) {
    $(modalSlider).removeClass("active").removeClass("activeOp");
  });

  const lazyLoadInstanceModal = new LazyLoad({
    elements_selector: ".lazy-modal",

    callback_loaded: () => {
      flktyModal.resize();
      $(".loader").hide();
    },
  });

  $("#modal-galerry").on("shown.bs.modal", function (e) {
    modalSlider.style.display = "block";
    // Flickity resize
    lazyLoadInstanceModal.loadAll();
    $(modalSlider).addClass("activeOp");
    flktyModal.resize();
    $(modalSlider).addClass("active");
  });

  $(".block-slider .slide").on("click", function () {
    flktyModal.selectCell($(this).index(), false, true);

    $("#modal-galerry").modal("show");
  });

  $(".modal").on("show.bs.modal", function (e) {
    $(document.documentElement).addClass("modal-open");
  });

  $(".modal").on("hide.bs.modal", function (e) {
    $(document.documentElement).removeClass("modal-open");
  });

  //mask
  const maskedInput = document.querySelectorAll(".js-mask-tel");

  var im = new Inputmask({
    mask: "999 999 99 99 99 99 99 99 99 99",
    placeholder: " ",
    showMaskOnHover: false,
    oncleared: function () {
      //$(this).removeClass('valid');
      //$(this).removeClass('typed');
    },
    oncomplete: function () {
      //$(this).removeClass('typed');
      //$(this).addClass('valid');
    },
  });
  im.mask(maskedInput);

  $(".js-mask-tel").hover(
    function () {
      $(this).attr("placeholder", "___ ___ __ __");
    },
    function () {
      $(this).attr("placeholder", "Số điện thoại");
    }
  );

  $("input").on("input", function () {
    if ($(this).hasClass("js-mask-tel")) {
      $(this).parent().find(".form-validation-error").addClass("hidden");
      //$(this).addClass('typed');
    } else if ($(this).closest('.form-new-design').length) {
      $(this).closest('.form-new-design').find(".form-validation-error").addClass("hidden");
      return
    } else {
      $(this).addClass("valid");
    }
  });

  const validationTel = (telSelector) => {
    const telArr = telSelector.val().split(" ");

    if (telSelector.val().length == 0) {
      return false;
    }
    if (telSelector.val().trim().length < 13) {
      return false;
    }

    return true;
  };

  //progress
  const progressSlider = document.querySelector(".progres .slider");

  if (progressSlider) {
    var flkty = new Flickity(progressSlider, {
      contain: true,
      pageDots: false,
      cellAlign: "center",
      prevNextButtons: true,
      wrapAround: true,
      lazyLoad: 2,
      dragThreshold: 1,
    });
  
    $(".progres .slide").on("click", function () {
      flkty.selectCell($(this).index());
    });
  
    const lazyLoadInstanceSecond = new LazyLoad({
      elements_selector: ".lazy-progress",
  
      callback_loaded: () => {
        lazyLoadInstanceSecond.loadAll();
        flkty.resize();
      },
    });
  }

  // FORM SUBMIT
  $(".intro form").on("submit", function (e) {
    e.preventDefault();

    const formDataTel = $("#form-input-phone-intro");

    if (validationTel(formDataTel)) {
      $(this).find(".form-validation-error").addClass("hidden");
      formDataTel.val("");
      formDataTel.removeClass("valid");

      setTimeout(() => {
        $("#modal-thanks-pdf").modal("show");
      }, 0);

      setTimeout(() => {
        window.open($(".download-pdf-link").attr("href"), "_blank");
        //window.location.href = $('.download-pdf-link').attr('href');
      }, 500);
    } else {
      $(this).find(".form-validation-error").removeClass("hidden");
    }
  });

  $(".form-pdf").on("submit", function (e) {
    e.preventDefault();

    const formDataTel = $(this).find('input[name="phone"]');
    const formDataName = $(this).find('input[name="name"]');

    if (validationTel(formDataTel)) {
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
        //window.location.href = $('.download-pdf-link').attr('href');
      }, 500);
    } else {
      $(this).find(".form-validation-error").removeClass("hidden");
    }
  });

  $(".form-pdf-other").on("submit", function (e) {
    e.preventDefault();

    const formDataTel = $(this).find('input[name="phone"]');
    const formDataName = $(this).find('input[name="name"]');

    if (validationTel(formDataTel)) {
      $(".modal").modal("hide");
      formDataTel.val("");
      formDataName.val("");
      formDataTel.removeClass("valid");
      formDataName.removeClass("valid");

      setTimeout(() => {
        $("#modal-thanks-pdf").modal("show");
      }, 0);

      setTimeout(() => {
        window.open($(".download-pdf-link-filter").attr("href"), "_blank");
        //window.location.href = $('.download-pdf-link').attr('href');
      }, 500);
    } else {
      $(this).find(".form-validation-error").removeClass("hidden");
    }
  });

  $(".form-submit-user-data").on("submit", function (e) {
    e.preventDefault();

    const formDataTel = $(this).find('input[name="phone"]');
    const formDataName = $(this).find('input[name="name"]');

    if (validationTel(formDataTel)) {
      $(".modal").modal("hide");

      formDataTel.val("");
      formDataName.val("");
      formDataTel.removeClass("valid");
      formDataName.removeClass("valid");

      setTimeout(() => {
        $("#modal-thanks").modal("show");
      }, 500);
    } else {
      $(this).find(".form-validation-error").removeClass("hidden");
    }
  });
});

/// redesign
import intlTelInput from 'intl-tel-input';
import utils from 'intl-tel-input/build/js/utils';

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
import screenfull from 'screenfull'

$('#js-toogle-fullscreen').on('click', function() {
  if (screenfull.isEnabled) {
    screenfull.toggle(document.querySelector('.threesixty-container'));
  }
});

screenfull.on('change', () => {
  if (screenfull.isFullscreen) {
    $('#js-toogle-fullscreen').addClass('open');
  } else {
    $('#js-toogle-fullscreen').removeClass('open');
  }
});

$('.threesixty__dropdown').on('click', function() {
  $(this).addClass('active');
})

$('.threesixty__dropdown-item').on('click', function() {
  $('.threesixty__dropdown-item').removeClass('active');
  $('.threesixty__dropdown-title').text($(this).text())
  $(this).addClass('active');
})

// 3d
// const ifwin = document.querySelector('.VR-layout').contentWindow;
// let isInitDone = false;

// console.log(ifwin);

// const timer = setInterval(() => {
//   console.log(123);
//   if (isInitDone) {
//     clearInterval(timer);
//     return;
//   } else {
//     ifwin.postMessage({ type: 'buttons', action: 'init' }, '*');
//   }
// }, 100)


// window.addEventListener("message", function(e) {
//   let d = e.data;

//   if (d.type !== 'buttons') return;

//   if (d.action === 'init') {
//     isInitDone = true;

//     ifwin.postMessage({ type: 'buttons', action: 'movemode', name: 'Walk' }, '*');
//   }

//   // if (d.type === 'movemode') {
//   //   ifwin.postMessage({ type: 'buttons', action: 'movemode', name: 'Orbit' }, '*');
//   // }

//   console.log('work', d);
// });
