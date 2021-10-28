import screenfull from 'screenfull';

const init360 = (selector, evt) => {
  const container = $(selector);
  let imageData = container.find('.threesixty__dropdown-item.active').data('imageFolder');
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
      container.find('.threesixty-container').addClass('loaded')
      container.find('.js-loader-percent').text(`0%`)
    } else {
      container.find('.js-loader-percent').text(`${Math.round(imageDownloaded)}%`)
    }
  }

  const renderImage = () => {
    const imageContainer = container.find('.threesixty-images__container')
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

  container.find('#js-toogle-fullscreen').on('click', function() {
    if (screenfull.isEnabled) {
      screenfull.toggle(document.querySelector(`${selector} .threesixty-container`));
    }
  });

  if (screenfull.isEnabled) {
    screenfull.on('change', () => {
      if (screenfull.isFullscreen) {
        container.find('#js-toogle-fullscreen').addClass('open');
      } else {
        container.find('#js-toogle-fullscreen').removeClass('open');
      }
    });
  } else {
    container.find('.threesixty').addClass('unsupported-fullscreen')
  }


  container.find('.threesixty__dropdown').on('click', function(e) {
    $(this).toggleClass('active');
  })

  container.find('.threesixty__dropdown-item').on('click', function(e) {
    e.stopPropagation();
    container.find('.threesixty__dropdown-item').removeClass('active');
    container.find(".threesixty__dropdown").removeClass("active");
    container.find('.threesixty__dropdown-title').text($(this).text())
    container.find('.threesixty-container').removeClass('loaded')
    container.find('.threesixty-container').removeClass('touched');
    imageDownloaded = 0;
    imageData = $(this).data('imageFolder');
    imageIndex = 0;
    dragStart = 0;
    rotation = 0;
    prevRotation = 0;
    rotate = 0;
    container.find('.image-dron-inner').css({
      transform: ''
    })
    renderImage();
    $(this).addClass('active');
  })

  if (evt === 'shown.bs.modal') {
    $('#modal-360').on('shown.bs.modal', function () {
      renderImage()
      container.find('.threesixty-container').removeClass('touched');
    })
  } else {
    let isInit = false;
    var options = {
      rootMargin: '0px',
      threshold: 0.25,
    }
    var callback = function(entries, observer) {
      if (entries[0].isIntersecting && !isInit) {
        renderImage()
        container.find('.threesixty-container').removeClass('touched');
        isInit= true;
      }
    };
    var observer = new IntersectionObserver(callback, options);
    var target = document.querySelector(`${selector} .threesixty-images__container`);
    observer.observe(target);
  }

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
    container.find('.threesixty-container').addClass('touched');
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

    $(container.find('.threesixty-images__container img')[imageIndex]).addClass('active').siblings().removeClass('active');
    dragStart = currentPosition;
    rotation = newIndex;

    if (rotation > prevRotation || (prevRotation === 35 && rotation === 0)) {
      rotate += 1;
    } else if (rotation < prevRotation || (prevRotation === 0 && rotation === 35)) {
      rotate -= 1;
    }

    container.find('.image-dron-inner').css({
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

  container.find('.threesixty-images__container').on('dragstart', preventDragHandler);
  container.find('.threesixty-images__container').on('mouseup', handleUp);
  container.find('.threesixty-images__container').on('touchstart', handleDown);
  container.find('.threesixty-images__container').on('mousemove', handleMove);
  container.find('.threesixty-images__container').on('touchmove', handleMove);
  container.find('.threesixty-images__container').on('mousedown', handleDown);
  container.find('.threesixty-images__container').on('touchend', handleUp);
}

export {
  init360
}

