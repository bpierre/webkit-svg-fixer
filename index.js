/*!
 * WebKit SVG Fixer
 * Copyright(c) 2013 Pierre Bertet <bonjour@pierrebertet.net>
 * MIT Licensed
 */
/*jshint node:true, boss:true */

'use strict';

module.exports = {
  fixsvg: fixsvg,
  fiximages: fiximages,
  fixall: fixall
};

var window = this;
var document = window.document;
var body = document.body;
var objectElt = null;
var fixedUrls = [];

/**
 * Returns a pre-configured <object> element.
 *
 * @return {Element}
 * @api private
 */
function mkObject(){
  if (!objectElt) {
    objectElt = document.createElement('object');
    objectElt.type = 'image/svg+xml';
    objectElt.style.width = objectElt.style.height = '0';
    objectElt.style.position = 'absolute';
  }
  return objectElt.cloneNode(false);
}

/**
 * Fix an SVG given its `url`.
 *
 * @param {String} url
 * @api public
 */
function fixsvg(url) {
  if (fixedUrls.indexOf(url) > -1) return;
  body.appendChild(mkObject()).data = url;
}

/**
 * Fix SVG images.
 *
 * @param {String|NodeList} SVG images
 * @api public
 */
function fiximages(images) {
  if (!images) images = 'img[src$=.svg]';
  if (typeof images == 'string') {
    images = document.querySelectorAll(images);
  }
  for (var i=0, img; img = images[i]; i++) {
    fixsvg(img.src);
  }
}

/**
 * Fix all SVGs if the browser is WebKit.
 *
 * @param {Function} WebKit test
 * @api public
 */
function fixall(wkTest) {
  if (!(wkTest? wkTest() : /webkit/i.test(window.navigator.userAgent))) return;
  fiximages();
}
