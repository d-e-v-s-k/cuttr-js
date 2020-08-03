# Cuttr.js
![preview](https://raw.githubusercontent.com/d-e-v-s-k/cuttr-js/master/examples/img/cuttr-intro.png)

<p align="center">
    <a href="https://www.npmjs.com/package/cuttr">
        <img src="https://badge.fury.io/js/cuttr.svg" alt="npm" />
    </a>
    <a href="https://www.gnu.org/licenses/gpl-3.0.html">
        <img alt="License" src="https://img.shields.io/badge/License-GPL-blue.svg">
    </a>
    <a href="https://snyk.io/test/npm/cuttr/1.0.2">
        <img src="https://snyk.io/test/npm/cuttr/1.0.2/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/npm/cuttr/1.0.2" style="max-width:100%;">
    </a>
    <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=K9X3RW27WJHWE&source=url">
        <img alt="License" src="https://img.shields.io/badge/donate-PayPal.me-ff69b4.svg">
    </a>
</p>

<p align="center">Cuttr is a zero dependency, easy to use library that truncates multiple line text content (Line Clampin’) to fit within given specifications. It adds an ending string like a ellipsis (...) to indicate that there is more text available than currently visible.</p>

* Multiple truncation methods
* Truncate text without breaking the HTML <!-- * Option to maintain original text after truncation -->
* Custom ellipsis strings
* Optional "Read more" anchor

[Demos online](https://cuttr.kulahs.de/examples.html) | [Codepen Example](https://codepen.io/herkulas/pen/xxZNXGv)

---

## Install
### Download

- [cuttr.min.js](https://unpkg.com/cuttr@1.0.2/dist/cuttr.min.js) minified, or
- [cuttr.js](https://unpkg.com/cuttr@1.0.2/dist/cuttr.js) un-minified


### CDN

Link directly to Cuttr files on [unpkg](https://unpkg.com).

``` html
<script src="https://unpkg.com/cuttr@1.0.2/dist/cuttr.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/cuttr@1.0.2/dist/cuttr.js"></script>
```

### Package managers
npm

```sh
npm install cuttr --save
```

yarn

```sh
yarn add cuttr
```

bower

```sh
bower install d-e-v-s-k/cuttr-js --save
```
<!--
yarn

```sh
yarn add cuttr
```
-->

## License

### Commercial license

If you want to use Cuttr to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. [[Purchase a Cuttr Commercial License]](https://cuttr.kulahs.de)

### Open source license

If you are creating an open source application under a license compatible with the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html), you may use Cuttr under the terms of the GPLv3.

[Read more about Cuttr's licenses](https://cuttr.kulahs.de/pricing.html).

## Usage
As you can see in the example files, you will need to include:
 - The JavaScript file `cuttr.js` (or its minified version `cuttr.min.js`)

### Including files:
```html
<script type="text/javascript" src="cuttr.js"></script>
```

### Initialization

#### Initialization with Vanilla Javascript
All you need to do is call cuttr.js before the closing `</body>` tag.

```javascript
new Cuttr('.cuttr', {
    //options here
    truncate: 'words',
    length: 12
});
```
<!--
#### Initialization with jQuery
You can use cuttr.js also as a jQuery plugin if you want to!

```javascript
$(document).ready(function() {
    $('.cuttr').Cuttr({
        //options here
        truncate: 'words',
        length: 12
    });
});
```
-->
### Options

```javascript
var truncateText = new Cuttr( '.container', {
    // DEFAULTS LISTED
    
    truncate: 'characters',
    // Truncate method
    // How to truncate the text
    // ['characters'|'words'|'sentences']
    
    length: 100,
    // Truncation limit
    // After how much [characters|words|sentences] should the text be truncated
    // note: character truncation also counts html characters
    
    ending: '...',
    // Truncation ending string
    
    loadedClass: 'cuttr--loaded',
    // Class to set on truncated element when truncation finished
    
    readMore: false,
    // enables / disables the "read more" button
    // [true|false]
    
    readMoreText: 'Read more',
    // text to show as "Read more" button to show full content
    
    readLessText: 'Read less',
    // text to show as "Read less" button to show truncated content
    
    readMoreBtnPosition: 'after',
    // "Read more" button position
    // ['after'|'inside']
    // 'after' = button will be appended after the truncated element
    // 'inside' = button will be appended inside the truncated element, at the end of the truncated content
    
    readMoreBtnTag: 'button',
    // "Read-more" button HTML tag
    //  ['button'|'a'|...]
    
    readMoreBtnSelectorClass: 'cuttr__readmore',
    // "Read-more" button class selector
    
    readMoreBtnAdditionalClasses: '',
    // "Read-more" button additional classes to be added
})
```

## Demos & Examples

[Checkout our demos & examples page](https://cuttr.kulahs.de/examples.html)

## Browser support
The Cuttr javascript/jQuery plugin targets modern browsers that support ES5, meaning Internet Explorer 10 and earlier are not supported.

---

Created and maintained by [DEVSK](https://github.com/d-e-v-s-k).
