const initLayouts = (selector, title) => {
  // layouts
  const container = $(selector)
  const layoutsModalTitle = container.find(title);
  const layoutsModalHeaderBtn = container.find('.modal-action--second-screen')
  const apartmentsContainer = container.find('.js-apartments-body');
  const apartmentItem = apartmentsContainer.find('.layouts-section__apartment');
  const layoutsModalTabs = container.find('.layouts-section__tabs');
  const layoutsModalTab = layoutsModalTabs.find('.layouts-section__tab');
  const layoutsModalTabContent = container.find('.layouts-section__tab-content')
  let isActivated3d = false;

  const renderApartmentsInfo = (bed, bath, square, price) => {
    container.find('.js-layout-desc-bed').find('span').text(bed)
    container.find('.js-layout-desc-bath').find('span').text(bath)
    container.find('.js-layout-desc-square').find('span').text(square)
    container.find('.js-layout-desc-price').find('span').text(price)
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

  // mini modal
  function showMiniModal(id) {
    container.find('.mini-modal').removeClass('show');
    container.find(id).addClass('show')
  }

  function closeMiniModal(target) {
    if ($(target).closest('.mini-modal__content').length === 0) {
      container.find('.mini-modal').removeClass('show');
    }
  }
  container.find('[data-close-minimodal]').on('click', function() {
    container.find('.mini-modal').removeClass('show');
  });

  container.find('[data-show-minimodal]').on('click', function() {
    showMiniModal($(this).data('show-minimodal'))
  })

  container.find('.mini-modal').on('click', function(e) {
    closeMiniModal(e.target)
  });

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
      container.find('.layouts-section__tab-content--3d').addClass('activated')
    }

    // console.log('work', d);
  }

  const init3dLayout = () => {
    const timer = setInterval(() => {
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
    container.addClass('second-screen')
  }

  layoutsModalHeaderBtn.on('click', function() {
    container.removeClass('second-screen')
  })

  apartmentItem.on('click', function() {
    $(this).addClass('active').siblings().removeClass('active');
    container.find('.layouts-section__tab-content--3d').removeClass('activated')
    const bed = $(this).data('bed')
    const bath = $(this).data('bath')
    const square = $(this).data('square')
    const price = $(this).data('price')
    const layout2d = $(this).data('layout-2d')
    const layout3d = $(this).data('layout-3d')
    renderApartmentsInfo(bed, bath, square, price)
    showMiniModal('#mini-modal-help')

    chngeModalTitle(layoutsModalTabs.find('.layouts-section__tab.active').data('title'))

    container.find('.js-layout-2d').attr('data-src', layout2d)
    container.find('.js-layout-3d').attr('data-src', layout3d)
    const activeLayoutItem = container.find('.layouts-section__tab-content.active').find('.js-layout-decor')
    const layoutSrc = activeLayoutItem.attr('data-src');
    activeLayoutItem.attr('src', layoutSrc);

    activateSecondScreen()
    if (container.find('.layouts-section__tab--3d').hasClass('active') && !isActivated3d) {
      isInitDone = false
      init3dLayout();
    } else {
      isActivated3d = false
    }
  })

  layoutsModalTab.on('click', function() {
    $(this).addClass('active').siblings().removeClass('active');
    layoutsModalTabContent.removeClass('active');
    const tabId = $(this).data('tab');

    console.log(tabId);
    const activeTab = $(`[data-id='${tabId}']`);
    const layoutSrc = activeTab.find('.js-layout-decor').attr('data-src');

    if ($(this).data('tab') === 'tab-3d') {
      if (!isActivated3d && activeTab.find('.js-layout-decor').attr('src') != layoutSrc) {
        init3dLayout();
        activeTab.find('.js-layout-decor').attr('src', layoutSrc);
      }
      isActivated3d = true
    } else {
      activeTab.find('.js-layout-decor').attr('src', layoutSrc);
    }

    activeTab.addClass('active');
  });

  container.find('[data-title]').on('click', function() {
    chngeModalTitle($(this).data('title'))
  })
}

export {
  initLayouts
}