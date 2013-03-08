/*!
 * WebKit SVG Fixer
 * Copyright(c) 2013 Pierre Bertet <bonjour@pierrebertet.net>
 * MIT Licensed
 */
/*jshint node:true, boss:true */

'use strict';

module.exports = function(){ fixall(); };
module.exports.fixsvg = fixsvg;
module.exports.fiximages = fiximages;
module.exports.fixall = fixall;

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
  var objectElt = mkObject();
  objectElt.data = url;
  objectElt.addEventListener('load', function(){
    objectElt.parentNode.removeChild(objectElt);
  }, false);

  body.appendChild(objectElt);
  fixedUrls.push(url);
}

/**
 * Fix SVG images.
 *
 * @param {String|NodeList} SVG images
 * @api public
 */
function fiximages(images) {
  if (!images) images = 'img[src$=".svg"]';
  if (typeof images == 'string') {
    images = document.querySelectorAll(images);
  }
  for (var i=0, img; img = images[i]; i++) {
    fixsvg(img.src);
  }
}

/**
 * Fix SVG backgrounds.
 *
 * @api public
 */
function fixbackgrounds() {
  var bgRe = /background.*?url\(.*?\.svg.*?\;/;
  var svgUrlRe = /url\((.*?\.svg)/;
  var res;
  for (var i=0, stylesheet; stylesheet = document.styleSheets[i]; i++) {
    try {
      if (!stylesheet.cssRules) continue;
      for (var j=0, cssrule; cssrule = stylesheet.cssRules[j]; j++) {
        if (bgRe.test(cssrule.cssText)) { // first test: background-something
          res = cssrule.cssText.match(svgUrlRe); // ok, get the URL
          if (res) fixsvg(res[1].trim()); // fix it!
        }
      }
    } catch(err) {
      // 18 = not the same domain
      if (err.code !== 18) throw err;
    }
  }
}

/**
 * Fix all SVGs if the browser is WebKit.
 *
 * Options:
 *
 *  - `webkitTest` Custom WebKit test (Function or Boolean, default: tests `/webkit/` in the user agent string)
 *  - `fixImages` Fix SVG in image elements (Boolean, default: true)
 *  - `fixBackgrounds` Fix SVG in CSS backgrounds (Boolean, default: true)
 *
 * @param {Object} options
 * @api public
 */
function fixall(opts) {
  if (!opts) opts = {};

  if (!( opts.webkitTest === true ||
    (typeof opts.webkitTest == 'function' && opts.webkitTest()) ||
    /webkit/i.test(window.navigator.userAgent))) {
    return;
  }

  if (opts.fixImages || opts.fixImages === undefined) {
    fiximages();
  }
  if (opts.fixBackgrounds || opts.fixBackgrounds === undefined) {
    fixbackgrounds();
  }
}
