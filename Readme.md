# WebKit SVG Fixer

Fix SVG images in WebKit browsers.

When an SVG file is not directly in the HTML document (img element, CSS background), WebKit do not display the embedded xlink references (e.g. images), unless the SVG has already been displayed directly in the document.
WebKit SVG Fixer uses this to force the display on WebKit, by inserting hidden SVGs in the document (as objects). when the SVG is not directly in the page.

More info: http://www.eleqtriq.com/2012/01/enhancing-css-sprites-and-background-image-with-svg/

## Installation

    $ component install bpierre/webkit-svg-fixer

## API




## FAQ

### What are the differences with [dirkweber’s flattensvg](https://github.com/dirkweber/flattensvg.js)?

WebKit SVG Fixer does less. No regex searches in the CSS, base64 conversion or Ajax requests for testing the browser cache. Instead, you have an API which lets you do what you want.

## License

  MIT
