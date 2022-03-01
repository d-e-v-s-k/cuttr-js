/*!
 * Cuttr 1.4.1
 * https://github.com/d-e-v-s-k/cuttr-js
 *
 * @license GPLv3 for open source use only
 * or Cuttr Commercial License for commercial use
 * https://cuttr.kulahs.de/pricing/
 *
 * Copyright (C) 2022 https://cuttr.kulahs.de/ - A project by DEVSK
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
}(this, function () {

    //  private global vars
    let CUTTR_LICENSE = true;

    //  init Cuttr
    const Cuttr = function (el, options){
        'use strict';

        const self = Object.create(Cuttr.prototype);

        /**
         * Default settings
         */
        self.options = {
            //  global data
            elementsToTruncate:  typeof el === 'string' ? document.querySelectorAll(el) : el,
            originalContent: [],
            contentVisibilityState: [],
            contentTruncationState: [],

            //  set default options
            truncate: 'characters', // truncate method [characters|words|sentences]
            length: 100,  //  truncation limit
            ending: '...',    //  truncation ending string
            loadedClass: 'cuttr--loaded', //  class to set when truncation finished
            title: false,    //  add original content to elements title tag
            readMore: false, // read more button enabled/disabled
            readMoreText: 'read more',
            readLessText: 'read less',
            readMoreBtnPosition: 'after',  // [after|inside]
            readMoreBtnTag: 'button', //  read-more button tag [button|a|...]
            readMoreBtnSelectorClass: 'cuttr__readmore', //  read-more button selector
            readMoreBtnAdditionalClasses: '',

            //  callback functions
            afterTruncate: function(){},
            afterExpand: function(){},

            //  private options
            dataIndex: 'data-cuttr-index',   // cuttr index data attribute
        };

        /**
         * User defined options
         */
        if (options) {
            Object.keys(options).forEach(function (key){
                self.options[key] = options[key];
            });
        }


        const init = function () {
            prepare.call(this);
        };


        /*
            prepare cuttable elements
         */
        function prepare() {

            const isAuthorized = self.options && new RegExp('([\\d\\w]{8}-){3}[\\d\\w]{8}|^(?=.*?[A-Y])(?=.*?[a-y])(?=.*?[0-8])(?=.*?[#?!@$%^&*-]).{8,}$').test(self.options['li'+'cen'+'seK' + 'e' + 'y']) || document.domain.indexOf('cuttr'+'.' +'kul' + 'ahs' + '.' + 'de') > -1;

            //  return if no target element defined
            if (!self.options.elementsToTruncate) {
                return;
            } else {
                displayWarnings(isAuthorized);
            }

            //  set element type depending on source
            if ( !('length' in self.options.elementsToTruncate) )
                self.options.elementsToTruncate = [self.options.elementsToTruncate];

            //  loop through target elements to truncate
            for (let i = 0; i < self.options.elementsToTruncate.length; i++) {

                const currentElement  = self.options.elementsToTruncate[i];
                const currentContent  = currentElement.innerHTML;
                const truncateLength  = (currentElement.dataset.cuttrLength) ? currentElement.dataset.cuttrLength : self.options.length;
                const truncateEnding  = (currentElement.dataset.cuttrEnding) ? currentElement.dataset.cuttrEnding : self.options.ending;
                const contentToTitle  = (currentElement.dataset.cuttrTitle) ? currentElement.dataset.cuttrTitle : self.options.title;
                let truncatedContent;

                //  add truncate-element index to element
                currentElement.setAttribute(self.options.dataIndex, i);

                //  temporary save elements original content
                self.options.originalContent.push(currentContent);

                //  truncate content
                truncatedContent = truncateIt(currentElement, currentContent.trim(), truncateLength, truncateEnding);

                //  set title attr with original text content
                if (contentToTitle)
                    currentElement.title = currentElement.textContent.trim();

                //  set new content
                currentElement.innerHTML = truncatedContent;

                //  add read-more button if current content is truncated
                if (self.options.contentTruncationState[i]) {

                    if (self.options.readMore)
                        addReadMore(currentElement);

                    currentElement.classList += ' ' + self.options.loadedClass;

                }

                //  here go the callbacks
                self.options.afterTruncate.call(currentElement);

            }

        }


        /*
            truncate text to specific length
        */
        function truncateIt(thisElement, str, length, ending) {

            const thisIndex       = thisElement.dataset.cuttrIndex;
            const truncateMethod  = (thisElement.dataset.cuttrMethod) ? thisElement.dataset.cuttrMethod : self.options.truncate;

            //  set defaults
            if (length == null) {
                length = 100;
            }

            //  set defaults
            if (ending == null) {
                ending = '...';
            }

            //  truncate content based on method
            switch (truncateMethod) {

                //  truncate characters only
                case 'characters':

                    //  check if content (string) is longer than truncation limit
                    if (str.length > length) {

                        //  set current content truncation true and return truncated string
                        self.options.contentTruncationState[thisIndex] = true;
                        //  set visibility state
                        self.options.contentVisibilityState[thisIndex] = false;

                        //  return new string
                        return str.substring(0, length - ending.length) + ending + ' ';

                    } else {
                        return str;
                    }

                    break;

                //  truncate words
                case 'words':

                    const words = str.split(/ (?=[^>]*(?:<|$))/);

                    //  check if content (string) is longer than truncation limit
                    if (words.length > length) {

                        //  set current content truncation true and return truncated string
                        self.options.contentTruncationState[thisIndex] = true;
                        //  set visibility state
                        self.options.contentVisibilityState[thisIndex] = false;
                        //  return new string
                        //  split spaces followed by sequence of characters are NOT greater-than signs, less-than sign
                        return words.splice(0,length).join(' ') + ' ' + ending + ' ';

                    } else {
                        return str;
                    }

                    break;

                //  truncate full sentences
                case 'sentences':

                    const sentences = str.match(/[^\.!\?]+[\.!\?]+/g);

                    //  check if content (string) is longer than truncation limit
                    if (sentences.length > length) {

                        //  set current contetn truncation true and return truncated string
                        self.options.contentTruncationState[thisIndex] = true;
                        //  set visibility state
                        self.options.contentVisibilityState[thisIndex] = false;
                        //  return new string
                        return sentences.splice(0,length).join(' ') + ' ' + ending + ' ';

                    } else {
                        return str;
                    }

                    break;

                //  truncate characters by default
                default:

                    //  check if content (string) is longer than truncation limit
                    if (str.length > length) {

                        //  set current contetn truncation true and return truncated string
                        self.options.contentTruncationState[thisIndex] = true;
                        //  set visibility state
                        self.options.contentVisibilityState[thisIndex] = false;
                        //  return new string
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

            const currentElement      = thisElement;
            const thisIndex           = currentElement.dataset.cuttrIndex;
            const readMoreText        = (currentElement.dataset.cuttrReadmore) ? currentElement.dataset.cuttrReadmore : self.options.readMoreText;
            const readLessText        = (currentElement.dataset.cuttrReadmore) ? currentElement.dataset.cuttrReadless : self.options.readLessText;
            const btnPosition         = (currentElement.dataset.cuttrReadmorePosition) ? currentElement.dataset.cuttrReadmorePosition : self.options.readMoreBtnPosition;
            const btnTag              = (currentElement.dataset.cuttrReadmoreTag) ? currentElement.dataset.cuttrReadmoreTag : self.options.readMoreBtnTag;
            const btnSelectorClass    = '.' + self.options.readMoreBtnSelectorClass;
            const btnAdditionalClasses = (currentElement.dataset.cuttrReadmoreAdditionalClasses) ? currentElement.dataset.cuttrReadmoreAdditionalClasses : self.options.readMoreBtnAdditionalClasses;
            const btnText             = (self.options.contentVisibilityState[thisIndex]) ? readLessText : readMoreText;
            const btnAriaExpanded     = (self.options.contentVisibilityState[thisIndex]) ? 'true' : 'false';
            const btnMarkup           = ' <' + btnTag + ' aria-expanded="' + btnAriaExpanded + '" class="' + self.options.readMoreBtnSelectorClass + ' ' + btnAdditionalClasses + '">' + btnText.replace(/<[^>]*>/g, "") + '</' + btnTag + '>';
            let btnExists;

            //  check for button existence depending on btn position
            if (btnPosition == 'after' && currentElement.nextElementSibling) {
                btnExists = currentElement.nextElementSibling.matches(btnSelectorClass);
            } else if (btnPosition == 'inside') {
                btnExists = currentElement.querySelector(btnSelectorClass);
            }

            //  insert element only if it doesn't exist
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
                }

                //  listen to read-more clicks - show/hide content
                if (!updated) {

                    if (btnPosition == 'after') {
                        currentElement.nextElementSibling.addEventListener('click',function(event) {
                            if (event.target && event.target.classList.contains(self.options.readMoreBtnSelectorClass)) {
                                updateContent(event, btnPosition);
                            }
                        });
                    } else if (btnPosition == 'inside') {
                        currentElement.addEventListener('click',function(event) {
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

            const currentElement      = (btnPosition == 'after') ? event.target.previousElementSibling : event.target.parentNode;
            const currentContent      = currentElement.innerHTML;
            const thisIndex           = currentElement.dataset.cuttrIndex;
            const readMoreText        = (currentElement.dataset.cuttrReadmore) ? currentElement.dataset.cuttrReadmore : self.options.readMoreText;
            const readLessText        = (currentElement.dataset.cuttrReadmore) ? currentElement.dataset.cuttrReadless : self.options.readLessText;
            const truncateLength      = (currentElement.dataset.cuttrLength) ? currentElement.dataset.cuttrLength : self.options.length;
            const truncateEnding      = (currentElement.dataset.cuttrEnding) ? currentElement.dataset.cuttrEnding : self.options.ending;
            let truncatedContent;

            //  show content if its currently truncated
            if (!self.options.contentVisibilityState[thisIndex]) {

                //  replace content with original content from element at specific index
                currentElement.innerHTML = self.options.originalContent[thisIndex];

                //  set visibility state
                self.options.contentVisibilityState[thisIndex] = true;

                if (btnPosition == 'inside' && self.options.readMore)
                    addReadMore(currentElement, true);

                //  update button text and aria
                event.target.innerHTML = readLessText.replace(/<[^>]*>/g, "");
                //event.target.setAttribute('aria-expanded', 'true');

                //  here go the callbacks
                self.options.afterExpand.call(currentElement);

            //  truncate content if its shown completely currently
            } else {

                //  truncate content
                truncatedContent = truncateIt(currentElement, currentContent.trim(), truncateLength, truncateEnding);
                currentElement.innerHTML = truncatedContent;

                //  set visibility state
                self.options.contentVisibilityState[thisIndex] = false;

                if (btnPosition == 'inside' && self.options.readMore)
                    addReadMore(currentElement, true);

                //  update button text and aria
                event.target.innerHTML = readMoreText.replace(/<[^>]*>/g, "");
                //event.target.setAttribute('aria-expanded', 'false');

                //  here go the callbacks
                self.options.afterTruncate.call(currentElement);

            }

        }


        /**
         * Displays warnings
         */
        function displayWarnings(isAuthorized) {

            if (!isAuthorized && CUTTR_LICENSE) {
                //  declare global const to show error only once
                CUTTR_LICENSE = false;
                //  show error message
                showError('error', 'Cuttr.js has a GPLv3 license and it requires a `licenseKey` option. Read about it here:');
                showError('error', 'https://github.com/d-e-v-s-k/cuttr-js#options');
            }

        }


        /*
            public function
            expand / show original content
        */
        self.expandContent = function(selector, btnPosition) {

            let currentElements;

            //  set specific element to expand or use current instance node
            if (selector) {
                currentElements = document.querySelectorAll(selector);
            } else {
                currentElements = self.options.elementsToTruncate;
            }

            for (let i = 0; i < currentElements.length; i++) {

                const currentElement      = currentElements[i];
                const currentContent      = currentElement.innerHTML;
                const thisIndex           = currentElement.dataset.cuttrIndex;
                const readLessText        = (currentElement.dataset.cuttrReadmore) ? currentElement.dataset.cuttrReadless : self.options.readLessText;
                const thisBtnPosition     = (btnPosition) ? btnPosition : self.options.readMoreBtnPosition;
                const btnSelectorClass    = '.' + self.options.readMoreBtnSelectorClass;
                let btnExists;

                //  show content if its currently truncated
                if (!self.options.contentVisibilityState[thisIndex]) {

                    //  replace content with original content from element at specific index
                    currentElement.innerHTML = self.options.originalContent[thisIndex];

                    //  set visibility state
                    self.options.contentVisibilityState[thisIndex] = true;

                    //  read-more handling only if enabled
                    if (self.options.readMore) {

                        if (thisBtnPosition == 'inside')
                            addReadMore(currentElement, true);

                        //  check for button existence depending on btn position
                        if (thisBtnPosition == 'after') {
                            btnExists = currentElement.nextElementSibling;
                        } else if (thisBtnPosition == 'inside') {
                            btnExists = currentElement.querySelector(btnSelectorClass);
                        }

                        //  update button text
                        if(btnExists)
                            btnExists.innerHTML = readLessText.replace(/<[^>]*>/g, "");

                    }

                    //  here go the callbacks
                    self.options.afterExpand.call(currentElement);

                }

            }

        }


        /*
            public function
            truncate / hide original content
        */
        self.truncateContent = function(selector, btnPosition) {

            let currentElements;

            //  set specific element to expand or use current instance node
            if (selector) {
                currentElements = document.querySelectorAll(selector);
            } else {
                currentElements = self.options.elementsToTruncate;
            }

            for (let i = 0; i < currentElements.length; i++) {

                const currentElement      = currentElements[i];
                const currentContent      = currentElement.innerHTML;
                const thisIndex           = currentElement.dataset.cuttrIndex;
                const readMoreText        = (currentElement.dataset.cuttrReadmore) ? currentElement.dataset.cuttrReadmore : self.options.readMoreText;
                const thisBtnPosition     = (btnPosition) ? btnPosition : self.options.readMoreBtnPosition;
                const btnSelectorClass    = '.' + self.options.readMoreBtnSelectorClass;
                const truncateLength      = (currentElement.dataset.cuttrLength) ? currentElement.dataset.cuttrLength : self.options.length;
                const truncateEnding      = (currentElement.dataset.cuttrEnding) ? currentElement.dataset.cuttrEnding : self.options.ending;
                let truncatedContent;
                let btnExists;

                //  hide content if its currently fully visible
                if (self.options.contentVisibilityState[thisIndex]) {

                    //  truncate content
                    truncatedContent = truncateIt(currentElement, currentContent.trim(), truncateLength, truncateEnding);
                    currentElement.innerHTML = truncatedContent;

                    //  set visibility state
                    self.options.contentVisibilityState[thisIndex] = false;

                    //  read-more handling only if enabled
                    if (self.options.readMore) {

                        if (thisBtnPosition == 'inside')
                            addReadMore(currentElement, true);

                        //  check for button existence depending on btn position
                        if (thisBtnPosition == 'after') {
                            btnExists = currentElement.nextElementSibling;
                        } else if (thisBtnPosition == 'inside') {
                            btnExists = currentElement.querySelector(btnSelectorClass);
                        }

                        //  update button text
                        if(btnExists)
                            btnExists.innerHTML = readMoreText.replace(/<[^>]*>/g, "");

                    }

                    //  here go the callbacks
                    self.options.afterTruncate.call(currentElement);

                }

            }

        }


        /*
            public function
            restore the element to a pre-init state
        */
        self.destroy = function(selector, btnPosition) {

            //  expand original content
            self.expandContent(selector, btnPosition);

            let currentElements;

            //  set specific element to expand or use current instance node
            if (selector) {
                currentElements = document.querySelectorAll(selector);
            } else {
                currentElements = self.options.elementsToTruncate;
            }

            for (let i = 0; i < currentElements.length; i++) {

                let currentElement      = currentElements[i];
                const currentContent      = currentElement.innerHTML;
                const thisIndex           = currentElement.dataset.cuttrIndex;
                const thisBtnPosition     = (btnPosition) ? btnPosition : self.options.readMoreBtnPosition;
                const btnSelectorClass    = '.' + self.options.readMoreBtnSelectorClass;
                let btnExists;

                //  set visibility state
                self.options.contentVisibilityState[thisIndex] = true;

                //  remove read-more  if enabled
                if (self.options.readMore) {

                    if (thisBtnPosition == 'inside')
                        addReadMore(currentElement, true);

                    //  check for button existence depending on btn position
                    if (thisBtnPosition == 'after') {
                        btnExists = currentElement.nextElementSibling;
                    } else if (thisBtnPosition == 'inside') {
                        btnExists = currentElement.querySelector(btnSelectorClass);
                    }

                    //  remove button
                    if(btnExists)
                        btnExists.parentNode.removeChild(btnExists);
                    //btnExists.remove();

                }

                //  remove element classes
                currentElement.classList.remove(self.options.loadedClass);

                //  remove truncate-element index from element
                currentElement.removeAttribute(self.options.dataIndex);

                //  reset current truncation instance
                currentElement = null;

            }

        }


        //utils
        /*
            shows console message
        */
        function showError(type, text){
            window.console && window.console[type] && window.console[type]('Cuttr: ' + text);
        }

        init();
        return self;
    };
    return Cuttr;
}));


/**
 * jQuery adapter for Cuttr.js 1.4.0
 */
if(window.jQuery && window.Cuttr){
    (function ($, Cuttr) {
        'use strict';

        // No jQuery No Go
        if (!$ || !Cuttr) {
            //window.cuttr_utils.showError('error', 'jQuery is required to use the jQuery Cuttr adapter!');
            console.log('ERROR - jQuery is required to use the jQuery Cuttr adapter!');
            return;
        }

        $.fn.Cuttr = function (options) {
            return this.each((e, element) => {
                options = $.extend({}, options, {'$': $});
                if (!$.data(element, 'Cuttr')) {
                    $.data(element, 'Cuttr', new Cuttr(element, options));
                }
            });
        };
    })(window.jQuery, window.Cuttr);
}
