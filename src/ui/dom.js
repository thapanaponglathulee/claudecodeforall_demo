const id = (name) => document.getElementById(name);

export const els = {
  search: id('search'),
  searchClear: id('search-clear'),
  recOnly: id('rec-only'),
  chips: id('chips'),
  menu: id('menu'),
  empty: id('empty'),
  resultCount: id('result-count'),

  orderBar: id('order-bar'),
  orderToggle: id('order-toggle'),
  orderPanel: id('order-panel'),
  orderList: id('order-list'),
  orderCount: id('order-count'),
  orderTotal: id('order-total'),
  orderClear: id('order-clear'),
  orderLink: id('order-link'),
  orderLink2: id('order-link-2'),

  nav: id('nav'),
  navList: id('nav-list'),
  heroPhoto: id('hero-photo'),

  preview: id('preview'),
  previewClose: id('preview-close'),
  previewFigure: id('preview-figure'),
  previewTag: id('preview-tag'),
  previewName: id('preview-name'),
  previewDesc: id('preview-desc'),
  previewPrice: id('preview-price'),
  previewQty: id('preview-qty'),

  hoursText: id('hours-text'),
  hoursDot: id('hours-dot'),
  shopPhones: id('shop-phones'),
  mapLink: id('map-link'),
  footerNote: id('footer-note'),
};
