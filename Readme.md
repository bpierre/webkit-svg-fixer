# WebKit SVG Fixer

Fix SVG images in WebKit browsers.

When an SVG file is not directly in the HTML document (img element, CSS background), WebKit do not display the embedded xlink references (e.g. images), unless the SVG has already been displayed directly in the document.
WebKit SVG Fixer uses this to force the display on WebKit, by inserting hidden SVGs in the document (as `<objects>` elements).

- Info ☞ http://www.eleqtriq.com/2012/01/enhancing-css-sprites-and-background-image-with-svg/
- Demo ☞ http://pierrebertet.net/webkit-svg-fixer/demo/

## Installation

### With [component](https://github.com/component/component#readme)

    $ component install bpierre/webkit-svg-fixer

### Old Fashion (standalone, AMD)

- Development: [dist/webkit-svg-fixer.js](https://raw.github.com/bpierre/webkit-svg-fixer/master/dist/webkit-svg-fixer.js)
- Production: [dist/webkit-svg-fixer.min.js](https://raw.github.com/bpierre/webkit-svg-fixer/master/dist/webkit-svg-fixer.min.js)

**Note**: if you use this library standalone, the main object, `webkitSvgFixer`, will be attached to the `window`. You can access it with `window.webkitSvgFixer` or just `webkitSvgFixer`, and call the functions on it, e.g. `webkitSvgFixer.fixall()`.

## Quick Start

Just call the main object directly: `require('webkit-svg-fixer')()`, or `window.webkitSvgFixer()`.

## API

### fixall(options)

Fix images in all SVGs embedded as `<img src="something.svg">`. If the browser is not webkit, it does nothing.

You can provide some options:

 - `webkitTest` ☞ Custom WebKit test (Function or Boolean, default: tests `/webkit/` in the user agent string)
 - `fixImages` ☞ Fix SVG in image elements (Boolean, default: true)
 - `fixBackgrounds` ☞ Fix SVG in CSS backgrounds (Boolean, default: true)

### fixsvg(url)

Fix a single SVG URL. You can safely call it multiple times with the same URL, only one `<object>` will be inserted. **You have to test WebKit before calling this function.**

### fiximages(images)

Fix all `<img>` ending with `.svg` in the document. You can also provide the images you want, as a CSS selector or a NodeList. **You have to test WebKit before calling this function.**

## FAQ

### What are the differences with [dirkweber’s flattensvg](https://github.com/dirkweber/flattensvg.js)?

WebKit SVG Fixer does less. The main goal of flatten SVG is to convert external images in base64. Also, it does Ajax requests for testing the browser cache. WebKit SVG Fixer exposes an API which lets you do what you want.

## Credits

* [flattensvg](https://github.com/dirkweber/flattensvg.js)

## License

  [MIT](http://pierre.mit-license.org/)
