YUI.add('mywidget', function (Y, NAME) {
    var Widget = Y.Widget;

    function MyWidget(config) {
        MyWidget.superclass.constructor.apply(this, arguments);
    };

    function loadImage(image) {
        if (image.length > 0) {
            if (image[0].length > 0) {
                image[0][0].src = image[0][0].getAttribute('waitSrc');
                image[0][0].onload = function () { loadImage(image); };
                image[0][0].removeAttribute('waitSrc');
                image[0][0].removeAttribute('relativeTo');
                image[0].splice(0, 1);
            } else {
                image.splice(0, 1);
                loadImage(image);
            }
        }
    };

    MyWidget.NAME = "mywidget";
    MyWidget.ATTRS = {
        strings: {
            value: {
                tooltip: "Press the arrow left/right keys for navigate.",
                prev: "prev",
                next: "next"
            }
        },
        template: {
        },
        sliderSpeed: {
            value: 2
        },
        routes: {
            value: [
                { path: '/test', callback: '_test'}
            ]
        }
    };

    MyWidget.BTN_TEMPLATE = '<button type="button"></button>';
    MyWidget.CurrentStep = 0;

    Y.extend(MyWidget, Widget, {
        initializer: function() {
            var obj = this.get('template'),
                pagesNames = [],
                pageNumb = -1;

            for (var elem in obj) {
                pageNumb++
                obj[elem].content = obj[elem].content.replace(/img src=/g, 'img relativeTo=pg_' + pageNumb + ' waitSrc=');
                pagesNames.push(elem);
            }

            MyWidget.NMB_PAGES = pageNumb;
            MyWidget.NAME_PAGES = pagesNames;
            MyWidget.SCHEMA = window.location.hash.toString().substring(1);

            for (var i in MyWidget.NAME_PAGES) {
                if (MyWidget.NAME_PAGES[i] == MyWidget.SCHEMA) {
                    MyWidget.LOCATION = parseInt(i);
                }
            }

            if(MyWidget.LOCATION === undefined) MyWidget.LOCATION = 0;
        },
        destructor : function() {
        },
        renderUI : function() {
            this._renderTemplate();
            this._renderImages();
            this._renderButtons();
        },
        bindUI : function() {
            var boundingBox = this.get("boundingBox");
            var keyEventSpec = (!Y.UA.opera) ? "down:" : "press:";
            keyEventSpec += "37, 39";
            Y.on("key", Y.bind(this._onDirectionKey, this), window, keyEventSpec);
            Y.on("mousedown", Y.bind(this._onMouseDown, this), Y.one('body'));
        },
        syncUI : function() {
            //sync
        },
        _renderImages: function() {
            var currentPage = MyWidget.LOCATION,
                image = Y.all('img[relativeTo=pg_' + currentPage + ']'),
                nextPage,
                orderList = [];

            image.addClass('mywidget_img');
            orderList.push(image._nodes);

            for (var idx = 1; idx <= MyWidget.NMB_PAGES; idx++) {
                if (currentPage - idx >= 0 && currentPage != currentPage - idx) {
                    nextPage = currentPage - idx;
                    image = Y.all('img[relativeTo=pg_' + nextPage + ']');
                    if (image != null) { orderList.push(image._nodes); image.addClass('mywidget_img'); }
                    //leftpage
                }

                if (currentPage + idx <= MyWidget.NMB_PAGES && currentPage != currentPage + idx) {
                    nextPage = currentPage + idx;
                    image = Y.all('img[relativeTo=pg_' + nextPage + ']');
                    if (image != null) { orderList.push(image._nodes); image.addClass('mywidget_img'); }
                    //rightpage
                }
            }

            this._setPosition();
            loadImage(orderList);
        },
        _renderTemplate: function() {
            var contentBox = this.get("contentBox"),
                template = this.get("template");

            contentBox.addClass('mywidget_container');
            contentBox.setStyle('height', '712px');

            for(var i in template) {
                var cnt = Y.Node.create(template[i].content);
                cnt.addClass('mywidget_children');
                Y.one(contentBox).appendChild(cnt);
            }
        },
        _renderButtons : function() {
            var contentBox = this.get("boundingBox"),
                strings = this.get("strings"),
                prev = this._createButton(strings.prev, 'mywidget_bttn_prev'),
                next = this._createButton(strings.next, 'mywidget_bttn_next');

            this.previusImage = contentBox.append(prev);
            this.nextImage = contentBox.append(next);
        },
        _createButton : function(text, className) {

            var btn = Y.Node.create(MyWidget.BTN_TEMPLATE);
            btn.set("innerHTML", text);
            btn.set("title", text);
            btn.addClass(className);

            return btn;
        },
        _onMouseDown : function(e) {
            var node = e.target,
                width = this.get('contentBox')._node.offsetWidth,
                images = Y.all('.mywidget_children');

            if (node.hasClass("mywidget_bttn_next")) {
                currVal = MyWidget.CurrentStep;
                currVal++;
                if(currVal > MyWidget.NMB_PAGES) currVal = 0;
                MyWidget.CurrentStep = currVal;
                transit(images, width, currVal, this.get('sliderSpeed'));
            } else if (node.hasClass("mywidget_bttn_prev")) {
                currVal = MyWidget.CurrentStep;
                currVal--;
                if(currVal < 0) currVal = MyWidget.NMB_PAGES;
                MyWidget.CurrentStep = currVal;
                transit(images, width, currVal, this.get('sliderSpeed'));
            }
        },
        _onDirectionKey : function(e) {

            e.preventDefault();

            switch (e.charCode) {
                case 39:
                    this._setPosition('next');
                    break;
                case 37:
                    this._setPosition('prev');
                    break;
            }
        },
        _setPosition : function(type) {
            var width = this.get('contentBox')._node.offsetWidth,
                images = Y.all('.mywidget_children'),
                duration = this.get('sliderSpeed');

            switch (type) {
                case "next":
                    currVal = MyWidget.CurrentStep;
                    currVal++;
                    if(currVal > MyWidget.NMB_PAGES) currVal = 0;
                    MyWidget.CurrentStep = currVal;
                    break;
                case "prev":
                    currVal = MyWidget.CurrentStep;
                    currVal--;
                    if(currVal < 0) currVal = MyWidget.NMB_PAGES;
                    MyWidget.CurrentStep = currVal;
                    break;
                default :
                    currVal = MyWidget.LOCATION;
                    MyWidget.CurrentStep = currVal;
                    duration = 0;
                    break;
            }

            transit(images, width, currVal, duration);
        }
    });

    function transit (images, width, currVal, speed) {
        YUI().use('transition', function (Y) {
            images.transition({
                easing: 'linear',
                left: '-' + width * currVal + 'px',
                duration: speed
            }, function() {
                window.location.hash = MyWidget.NAME_PAGES[currVal]
            });
        });
    };

    Y.namespace('MyWidgets').MakeGood = function (config) {
        return new MyWidget(config);
    };

}, "0.1", {requires: ['event-key','widget', 'transition']});
