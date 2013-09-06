YUI.add('templates', function (Y) {
    function Templates(item) {
        var arr = [],
            arrPagesNames = [],
            schemsStr = window.location.hash.toString(),
            clearShema = schemsStr.substring(1),
            pageNumber = 0,
            pagesTempl = item,
            div = Y.one('#Pages'),
            imageSRC = [];

        for (var elem in pagesTempl) {
            pagesTempl[elem].content = pagesTempl[elem].content.replace(/img src=/g, 'img waitSrc=');
            arr.push(pagesTempl[elem]);
            arrPagesNames.push(elem);
        }

        for (var isPresent in arrPagesNames) {
            if (arrPagesNames[isPresent] == clearShema) {
                pageNumber = parseInt(isPresent);
            }
        }

        for (var arrItem in arr) {
            var width = window.innerWidth;
            div.set('innerHTML', div.get('innerHTML') + arr[arrItem].content);
            div._node.childNodes[arrItem].setAttribute('id', "page_" + arrItem);
            Y.one("#page_" + arrItem).addClass('container');
            Y.one("#page_" + arrItem)._node.style.width = width + "px";
            document.title = arr[arrItem].title;
        }

        var widthEl = window.innerWidth;
        var divEl = Y.one('#Pages')._node;
        var imagesEl = Y.all('IMG');

        if (imagesEl._nodes.length > 0) {
            setImgAttr(imagesEl._nodes);
            loadOrderListOfImages(pageNumber, arr.length);
        }

        var transform;

        divEl.style.width = widthEl * arr.length + "px";

        var transformVersion = SetStyleProp();
        widthEl = widthEl * pageNumber;
        transform = 'translateX(-' + widthEl + 'px)';
        divEl.style[transformVersion] = transform;
        document.title = arr[pageNumber].title;
        setTimeout(function () {
            divEl.className = divEl.className + ' divTransition';
        }, 50);

        bindKeyAndClick(pageNumber, div._node, arr, arrPagesNames);
        bindOnResize();
    }

    function bindKeyAndClick(pageNumber, div, arr, arrPagesNames) {
        var arrIdx = pageNumber,
            nextBttn = Y.one('#nxtBttn'),
            prevBttn = Y.one('#prvBttn'),
            widthEl = window.innerWidth,
            transformVersion = SetStyleProp(),
            transform;

        nextBttn.on('click', function(ev) {
            widthEl = window.innerWidth;
            transform = 'translateX(-' + widthEl + 'px)';

            arrIdx++;
            if (arrIdx > arr.length - 1) arrIdx = 0;
            if (arrIdx != 0) {
                widthEl = widthEl * arrIdx;
            } else {
                widthEl = 0;
            }
            transform = 'translateX(-' + widthEl + 'px)';
            div.style[transformVersion] = transform;
            document.title = arr[arrIdx].title;
            window.location.hash = arrPagesNames[arrIdx];
        });

        prevBttn.on('click', function (ev) {
            widthEl = window.innerWidth;
            transform = 'translateX(-' + widthEl + 'px)';

            arrIdx--;
            if (arrIdx < 0) arrIdx = arr.length - 1;
            if (arrIdx != 0) {
                widthEl = widthEl * arrIdx;
            } else {
                widthEl = 0;
            }
            transform = 'translateX(-' + widthEl + 'px)';
            div.style[transformVersion] = transform;
            document.title = arr[arrIdx].title;
            window.location.hash = arrPagesNames[arrIdx];
        });

        window.onkeydown = function () {
            widthEl = window.innerWidth;
            transform = 'translateX(-' + widthEl + 'px)';
            var eventForBrowser;

            if (DetectBrowser() == "FireFox") {
                eventForBrowser = arguments[0].keyCode; //Fix for FF;
            } else {
                eventForBrowser = window.event.keyCode;
            }

            switch (eventForBrowser) {
                case 39:
                    arrIdx++;
                    if (arrIdx > arr.length - 1) arrIdx = 0;
                    if (arrIdx != 0) {
                        widthEl = widthEl * arrIdx;
                    } else {
                        widthEl = 0;
                    }
                    transform = 'translateX(-' + widthEl + 'px)';
                    div.style[transformVersion] = transform;
                    document.title = arr[arrIdx].title;
                    window.location.hash = arrPagesNames[arrIdx];
                    break;
                case 37:
                    arrIdx--;
                    if (arrIdx < 0) arrIdx = arr.length - 1;
                    if (arrIdx != 0) {
                        widthEl = widthEl * arrIdx;
                    } else {
                        widthEl = 0;
                    }
                    transform = 'translateX(-' + widthEl + 'px)';
                    div.style[transformVersion] = transform;
                    document.title = arr[arrIdx].title;
                    window.location.hash = arrPagesNames[arrIdx];
                    break;
            }
        };
    }

    function setImgAttr(item) {
        for (var i = 0; i < item.length; i++) {
            var t = item[i].parentNode;
            var isParent = false;
            while (isParent == false) {
                if (t.id.indexOf("page_") == 0) {
                    isParent = true;
                    item[i].setAttribute('relativeTo', t.id);
                } else {
                    t = t.parentNode;
                }
            }
        }
        return item;
    }

    function bindOnResize() {
        window.onresize = function () {
            var width = window.innerWidth + "px";
            var elements = Y.all(".container")._nodes;
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.width = width;
            }
        };
    }

    function loadOrderListOfImages(currentPage, numberOfPages) {
        var nextPage;
        var orderList = [];
        var image = Y.all('img[relativeTo=page_' + currentPage + ']')._nodes;
        orderList.push(image);

        for (var idx = 1; idx <= numberOfPages; idx++) {
            if (currentPage - idx >= 0 && currentPage != currentPage - idx) {
                nextPage = currentPage - idx;
                image = Y.all('img[relativeTo=page_' + nextPage + ']');
                if (image != null) orderList.push(image._nodes);
                //leftpage
            }

            if (currentPage + idx <= numberOfPages && currentPage != currentPage + idx) {
                nextPage = currentPage + idx;
                image = Y.all('img[relativeTo=page_' + nextPage + ']');
                if (image != null) orderList.push(image._nodes);
                //rightpage
            }
        }

        loadImage(orderList);
    }

    function CreateElements() {
        Y.Node.create('<div/>').set('id', 'containerForTempl').appendTo(Y.one('body')).addClass('divCont');
        Y.Node.create('<div/>').set('id', 'Pages').appendTo(Y.one('#containerForTempl')).addClass('bigDiv');
        Y.Node.create('<div/>').set('id', 'containerForBttns').appendTo(Y.one('body')).addClass('buttons');
        Y.Node.create('<div/>').set('id', 'prvBttn').set('innerHTML', 'PREV').appendTo(Y.one('#containerForBttns'));
        Y.Node.create('<div/>').set('id', 'nxtBttn').set('innerHTML', 'NEXT').appendTo(Y.one('#containerForBttns'));
    };

    function loadImage(image) {
        if (image.length > 0) {
            if (image[0].length > 0) {
                image[0][0].src = image[0][0].getAttribute('waitSrc');
                image[0][0].onload = function () { loadImage(image); };
                image[0][0].removeAttribute('waitSrc');
                image[0].splice(0, 1);
            } else {
                image.splice(0, 1);
                loadImage(image);
            }
        }
    }

    function SetStyleProp() {
        var result = '';
        switch (DetectBrowser()) {
            case "Chrome":
                result = 'webkitTransform';
                break;
            case "IE":
                result = 'msTransform';
                break;
            case "FireFox":
                result = 'MozTransform';
                break;
            case "Opera":
                result = 'webkitTransform';
                break;
        }
        return result;
    }

    function DetectBrowser() {
        if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) return "Opera";
        if (typeof InstallTrigger !== 'undefined') return "FireFox";
        if (!!window.chrome && !(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)) return "Chrome";
        if (/*@cc_on!@*/false || document.documentMode) return "IE";
        return 'Unknown';
    }

    Y.namespace('Templates').GetTemplate = function (PAGES) {
        CreateElements();
        Templates(PAGES);
    }
}, '0.0.1', {requires: ['node-base']});
