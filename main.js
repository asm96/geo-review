const reviewTemplate = ['<div class="review">',
  '<form class="review__form">',
  '<h3 class="review__title">Отзыв:</h3>',
  '<input class="review__input" type="text" name="name" placeholder="Укажите ваше имя">',
  '<input class="review__input" type="text" name="place" placeholder="Укажите место">',
  '<textarea class="review__input review__input_text" name="comment" placeholder="Оставить отзыв"></textarea>',
  '<button class="review__send">Добавить</button>',
  '</form>',
  '</div>'].join('');

function init() {
  const map = new ymaps.Map('map', {
    center: [59.93722113, 30.37746838],
    zoom: 13,
    controls: ['geolocationControl', 'searchControl', 'zoomControl']
  });
  map.behaviors.disable('scrollZoom');
  map.cursors.push('crosshair');

  map.events.add('click', e => {
    var coords = e.get('coords');
    fillBalloon(coords);
  });

  function fillBalloon(coords) {
    map.balloon.open(coords, reviewTemplate);
  }
}

ymaps.ready(init);