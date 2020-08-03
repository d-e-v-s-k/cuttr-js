/*!
 * Cuttr 1.0.2
 * https://github.com/d-e-v-s-k/cuttr-js
 *
 * @license GPLv3 for open source use only
 * or Cuttr Commercial License for commercial use
 * https://cuttr.kulahs.de/pricing/
 *
 * Copyright (C) 2020 https://cuttr.kulahs.de/ - A project by DEVSK
 **/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Cuttr = factory();
  }
})(this, function () {
  var Cuttr = function Cuttr(el, options) {
    'use strict';

    var self = Object.create(Cuttr.prototype);
    /**
     * Default settings
     */

    self.options = {
      elementsToTruncate: el ? document.querySelectorAll(el) : document.querySelectorAll('.cuttr'),
      originalContent: [],
      contentVisibilityState: [],
      contentTruncationState: [],
      //  set default options
      truncate: 'characters',
      // truncate method [characters|words|sentences]
      length: 100,
      //  truncation limit
      ending: '...',
      //  truncation ending string
      loadedClass: 'cuttr--loaded',
      //  class to set when truncation finished
      readMore: false,
      // read more button enabled/disabled
      readMoreText: 'read more',
      readLessText: 'read less',
      readMoreBtnPosition: 'after',
      // [after|inside]
      readMoreBtnTag: 'button',
      //  read-more button tag [button|a|...]
      readMoreBtnSelectorClass: 'cuttr-readmore',
      //  read-more button selector
      readMoreBtnAdditionalClasses: '',
      //  private options
      dataIndex: 'data-cuttr-index' // cuttr index data attribute

    };
    /**
     * User defined options
     */

    if (options) {
      Object.keys(options).forEach(function (key) {
        self.options[key] = options[key];
      });
    }

    var init = function init() {
      prepare.call(this);
    };
    /*
        prepare cuttable elements
     */


    function prepare() {
      for (var i = 0; i < self.options.elementsToTruncate.length; i++) {
        var currentElement = self.options.elementsToTruncate[i];
        var currentContent = currentElement.innerHTML;
        var truncateLength = currentElement.dataset.cuttrLength ? currentElement.dataset.cuttrLength : self.options.length;
        var truncateEnding = currentElement.dataset.cuttrEnding ? currentElement.dataset.cuttrEnding : self.options.ending;
        var trancatedContent = void 0; //  add truncate-element index to element

        currentElement.setAttribute(self.options.dataIndex, i); //  temporary save elements original content

        self.options.originalContent.push(currentContent); //  truncate content

        trancatedContent = truncateIt(currentElement, currentContent.trim(), truncateLength, truncateEnding);
        currentElement.innerHTML = trancatedContent; //  add read-more button if current content is truncated

        if (self.options.contentTruncationState[i]) {
          if (self.options.readMore) addReadMore(currentElement);
          currentElement.classList += ' ' + self.options.loadedClass;
        }
      }
    }
    /*
        truncate text to specific length
    */


    function truncateIt(thisElement, str, length, ending) {
      var thisIndex = thisElement.dataset.cuttrIndex;
      var truncateMethod = thisElement.dataset.cuttrMethod ? thisElement.dataset.cuttrMethod : self.options.truncate; //  set defaults

      if (length == null) {
        length = 100;
      } //  set defaults


      if (ending == null) {
        ending = '...';
      } //  truncate content based on method


      switch (truncateMethod) {
        //  truncate characters only
        case 'characters':
          //  check if content (string) is longer than truncation limit
          if (str.length > length) {
            //  set current content truncation true and return truncated string
            self.options.contentTruncationState[thisIndex] = true; //  set visibility state

            self.options.contentVisibilityState[thisIndex] = false; //  return new string

            return str.substring(0, length - ending.length) + ending + ' ';
          } else {
            return str;
          }

          break;
        //  truncate words

        case 'words':
          var words = str.split(/ (?=[^>]*(?:<|$))/); //  check if content (string) is longer than truncation limit

          if (words.length > length) {
            //  set current content truncation true and return truncated string
            self.options.contentTruncationState[thisIndex] = true; //  set visibility state

            self.options.contentVisibilityState[thisIndex] = false; //  return new string
            //  split spaces followed by sequence of characters are NOT greater-than signs, less-than sign

            return words.splice(0, length).join(' ') + ' ' + ending + ' ';
          } else {
            return str;
          }

          break;
        //  truncate full sentences

        case 'sentences':
          var sentences = str.match(/[^\.!\?]+[\.!\?]+/g); //  check if content (string) is longer than truncation limit

          if (sentences.length > length) {
            //  set current contetn truncation true and return truncated string
            self.options.contentTruncationState[thisIndex] = true; //  set visibility state

            self.options.contentVisibilityState[thisIndex] = false; //  return new string

            return sentences.splice(0, length).join(' ') + ' ' + ending + ' ';
          } else {
            return str;
          }

          break;
        //  truncate characters by default

        default:
          //  check if content (string) is longer than truncation limit
          if (str.length > length) {
            //  set current contetn truncation true and return truncated string
            self.options.contentTruncationState[thisIndex] = true; //  set visibility state

            self.options.contentVisibilityState[thisIndex] = false; //  return new string

            return str.substring(0, length - ending.length) + ending;
          } else {
            return str;
          }

      }
    }
    /*
        append read more button
    */


    function addReadMore(thisElement, updated) {
      var currentElement = thisElement;
      var thisIndex = currentElement.dataset.cuttrIndex;
      var readMoreText = currentElement.dataset.cuttrReadmore ? currentElement.dataset.cuttrReadmore : self.options.readMoreText;
      var readLessText = currentElement.dataset.cuttrReadmore ? currentElement.dataset.cuttrReadless : self.options.readLessText;
      var btnPosition = currentElement.dataset.cuttrReadmorePosition ? currentElement.dataset.cuttrReadmorePosition : self.options.readMoreBtnPosition;
      var btnTag = currentElement.dataset.cuttrReadmoreTag ? currentElement.dataset.cuttrReadmoreTag : self.options.readMoreBtnTag;
      var btnSelectorClass = '.' + self.options.readMoreBtnSelectorClass;
      var btnAdditionalClasses = currentElement.dataset.cuttrReadmoreAdditionalClasses ? currentElement.dataset.cuttrReadmoreAdditionalClasses : self.options.readMoreBtnAdditionalClasses;
      var btnText = self.options.contentVisibilityState[thisIndex] ? readLessText : readMoreText;
      var btnAriaExpanded = self.options.contentVisibilityState[thisIndex] ? 'true' : 'false';
      var btnMarkup = ' <' + btnTag + ' aria-expanded="' + btnAriaExpanded + '" class="' + self.options.readMoreBtnSelectorClass + ' ' + btnAdditionalClasses + '">' + btnText.replace(/<[^>]*>/g, "") + '</' + btnTag + '>';
      var btnExists; //  check for button existence depending on btn position

      if (btnPosition == 'after' && currentElement.nextElementSibling) {
        btnExists = currentElement.nextElementSibling.matches(btnSelectorClass);
      } else if (btnPosition == 'inside') {
        btnExists = currentElement.querySelector(btnSelectorClass);
      } //  insert element only if it doesn't exist


      if (!btnExists) {
        //  add read-more button to dom
        switch (btnPosition) {
          case 'after':
            currentElement.insertAdjacentHTML('afterend', btnMarkup);
            break;

          case 'inside':
            currentElement.insertAdjacentHTML('beforeend', btnMarkup);
            break;

          default:
            console.log('no matching read-more button position defined');
        } //  listen to read-more clicks - show/hide content


        if (!updated) {
          if (btnPosition == 'after') {
            currentElement.nextElementSibling.addEventListener('click', function (event) {
              if (event.target && event.target.classList.contains(self.options.readMoreBtnSelectorClass)) {
                updateContent(event, btnPosition);
              }
            });
          } else if (btnPosition == 'inside') {
            currentElement.addEventListener('click', function (event) {
              if (event.target && event.target.classList.contains(self.options.readMoreBtnSelectorClass)) {
                updateContent(event, btnPosition);
              }
            });
          }
        }
      }
    }
    /*
        display original/truncated content
    */


    function updateContent(event, btnPosition) {
      var currentElement = btnPosition == 'after' ? event.target.previousElementSibling : event.target.parentNode;
      var currentContent = currentElement.innerHTML;
      var thisIndex = currentElement.dataset.cuttrIndex;
      var readMoreText = currentElement.dataset.cuttrReadmore ? currentElement.dataset.cuttrReadmore : self.options.readMoreText;
      var readLessText = currentElement.dataset.cuttrReadmore ? currentElement.dataset.cuttrReadless : self.options.readLessText;
      var truncateLength = currentElement.dataset.cuttrLength ? currentElement.dataset.cuttrLength : self.options.length;
      var truncateEnding = currentElement.dataset.cuttrEnding ? currentElement.dataset.cuttrEnding : self.options.ending;
      var trancatedContent; //  show content if its currently truncated

      if (!self.options.contentVisibilityState[thisIndex]) {
        //  replace content with original content from element at specific index
        currentElement.innerHTML = self.options.originalContent[thisIndex]; //  set visibility state

        self.options.contentVisibilityState[thisIndex] = true;
        if (btnPosition == 'inside' && self.options.readMore) addReadMore(currentElement, true); //  update button text and aria

        event.target.innerHTML = readLessText.replace(/<[^>]*>/g, ""); //event.target.setAttribute('aria-expanded', 'true');
        //  truncate content if its shown completely currently
      } else {
        //  truncate content
        trancatedContent = truncateIt(currentElement, currentContent.trim(), truncateLength, truncateEnding);
        currentElement.innerHTML = trancatedContent; //  set visibility state

        self.options.contentVisibilityState[thisIndex] = false;
        if (btnPosition == 'inside' && self.options.readMore) addReadMore(currentElement, true); //  update button text and aria

        event.target.innerHTML = readMoreText.replace(/<[^>]*>/g, ""); //event.target.setAttribute('aria-expanded', 'false');
      }
    }

    init();
    return self;
  };

  return Cuttr;
});