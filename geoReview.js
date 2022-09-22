import InteractiveMap from './interactiveMap.js';

export default class GeoReview {
  constructor() {
    this.reviewTemplate = document.querySelector('#reviewTemplate').innerHTML;
    this.map = new InteractiveMap('map', this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));
  }

  onInit() {
    const coords = this.getReviewsFromStorage();

    for (const item of coords) {
      for (let i = 0; i < item.total; i++) {
        this.map.createPlacemark(item.coords);
      }
    }

    document.body.addEventListener('click', this.onDocumentClick.bind(this));
  }

  validateCoords(coords) {
    if (!Array.isArray(coords) || coords.length !== 2) {
      throw new Error('Invalid coords data');
    }
  }

  validateReview(review) {
    if (!review || !review.name || !review.place || !review.text) {
      throw new Error('Invalid review data');
    }
  }

  getIndex(coords) {
    return `${coords[0]}_${coords[1]}`;
  }

  getReviewsFromStorage() {
    const storageData = JSON.parse(localStorage.reviews || '{}');
    const coords = [];

    for (const item in storageData) {
      coords.push({
        coords: item.split('_'),
        total: storageData[item].length,
      });
    }

    return coords;
  }

  getReviewsByCoords(coords) {
    this.validateCoords(coords);
    const storageData = JSON.parse(localStorage.reviews || '{}');
    const index = this.getIndex(coords);
    return storageData[index] || [];
  }

  addReviewToStorage(data) {
    this.validateCoords(data.coords);
    this.validateReview(data.review);
    const storageData = JSON.parse(localStorage.reviews || '{}');
    const index = this.getIndex(data.coords);
    storageData[index] = storageData[index] || [];
    storageData[index].push(data.review);
    localStorage.reviews = JSON.stringify(storageData);
  }

  createForm(coords, reviews) {
    const root = document.createElement('div');
    root.innerHTML = this.reviewTemplate;
    const reviewList = root.querySelector('.review__list');
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);

    for (const item of reviews) {
      const div = document.createElement('div');
      div.classList.add('review__item');
      div.innerHTML = `
    <div>
      <span class="review__name">${item.name}</span> ${item.place} ${item.date}
    </div>
    <div>${item.text}</div>
    `;
      reviewList.appendChild(div);
    }

    return root;
  }

  onClick(coords) {
    const list = this.getReviewsByCoords(coords);
    const form = this.createForm(coords, list);
    this.map.openBalloon(coords, form.innerHTML);
  }

  onDocumentClick(e) {
    if (e.target.dataset.role === 'review-add') {
      const reviewForm = document.querySelector('[data-role=review-form]');
      const coords = JSON.parse(reviewForm.dataset.coords);
      const today = new Date();
      const date = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
      const data = {
        coords,
        review: {
          name: document.querySelector('[data-role=review-name]').value,
          place: document.querySelector('[data-role=review-place]').value,
          text: document.querySelector('[data-role=review-text]').value,
          date: date
        },
      };

      this.addReviewToStorage(data);
      this.map.createPlacemark(coords);
      this.map.closeBalloon();
    }
  }
}