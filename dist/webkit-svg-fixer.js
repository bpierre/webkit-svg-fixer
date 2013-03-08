;(function(){


/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("webkit-svg-fixer/index.js", function(exports, require, module){
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

});

if (typeof exports == "object") {
  module.exports = require("webkit-svg-fixer");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("webkit-svg-fixer"); });
} else {
  window["webkitSvgFixer"] = require("webkit-svg-fixer");
}})();