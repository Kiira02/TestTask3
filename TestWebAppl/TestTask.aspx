<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TestTask.aspx.cs" Inherits="TestWebAppl.TestTask" %>

<!DOCTYPE html>

<html id="test1" xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link href="StyleCss.css" rel="stylesheet" />
    <script type="text/javascript">
        window.onload = function () {
            var PAGES = {
                firstPage: {
                    title: 'Pagetitle',
                    content: '<div><div><img src="http://www.motto.net.ua/old_site//img/summer/1312791996_EFF0E8F0EEE4E020E1EBE0E3EEF2E2EEF0E8F2.jpg"/><div/></div>'
                },
                secondPage: {
                    title: 'Pagetitle2',
                    content: '<div><img src="http://wp-kurs.com/wp-content/gallery/priroda/priroda_bwua_24-06-2012_007__1920x1200.jpg"/></div>'
                },
                thirdPage: {
                    title: 'Pagetitle3',
                    content: '<div><div><img src="http://stat17.privet.ru/lr/09217069c5fd46a9c16c0b7aa5a20675"/><img src="http://download-multimedia.com/images/wallpaper/medium/1/priroda_1280x1024_232_download-multimedia.com.jpg"/></div></div>'
                },
                fourPage: {
                    title: 'Pagetitle4',
                    content: '<div><div><img src="http://www.bestwall.com.ua/data/media/3/priroda_bwua_24.06.2012_046__1802x1207.jpg"/></div></div>'
                },
                fivePage: {
                    title: 'Pagetitle5',
                    content: '<div><div><img src="http://vmonitor.ru/pic/nature/17412/Priroda-1920x1200.jpg"/></div></div>'
                },
            };
            Template(PAGES);
        };

        function Template(item) {
            var arr = [];
            var arrPagesNames = [];
            var schemsStr = window.location.hash.toString();
            var clearShema = schemsStr.substring(1);
            var pageNumber = 0;

            createElements();

            var pagesTempl = item;

            for (var elem in pagesTempl) {
                arr.push(pagesTempl[elem]);
                arrPagesNames.push(elem);
            }

            for (var isPresent in arrPagesNames) {
                if (arrPagesNames[isPresent] == clearShema) {
                    pageNumber = parseInt(isPresent);
                }
            }

            var div = document.getElementById('Pages');
            div.style.margin = 0;

            for (var arrItem in arr) {
                div.innerHTML = div.innerHTML + arr[arrItem].content;
                div.childNodes[arrItem].setAttribute('id', "page_" + arrItem);
                document.getElementById("page_" + arrItem).className = 'container';
                document.title = arr[arrItem].title;
            }

            var widthEl = window.innerWidth;
            var divEl = document.getElementById('Pages');
            var imagesEl = div.getElementsByTagName('IMG');

            if (imagesEl.length > 0) {
                setImgAttr(imagesEl);
                loadOrderListOfImages(pageNumber, arr.length);
            }

            var transform;

            var transformVersion = SetStyleProp();
            widthEl = widthEl * pageNumber;
            transform = 'translateX(-' + widthEl + 'px)';
            divEl.style[transformVersion] = transform;
            document.title = arr[pageNumber].title;
            setTimeout(function () {
                divEl.className = divEl.className + ' divTransition';
            }, 50);

            bindKeyAndClick(pageNumber, div, arr, arrPagesNames);

        };

        function bindKeyAndClick(pageNumber, div, arr, arrPagesNames) {
            var arrIdx = pageNumber;
            var nextBttn = document.getElementById('nxtBttn');
            var prevBttn = document.getElementById('prvBttn');
            var widthEl = window.innerWidth;
            var transformVersion = SetStyleProp();
            var transform;

            nextBttn.onclick = function () {
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
            };

            prevBttn.onclick = function () {
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
            };

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

        function createElements() {
            var contDiv = document.createElement('div');
            contDiv.id = 'containerForTempl';
            contDiv.className = 'divCont';
            document.getElementsByTagName('form')[0].appendChild(contDiv);

            var template = document.createElement('div');
            template.id = 'Pages';
            template.className = 'bigDiv';
            document.getElementById('containerForTempl').appendChild(template);

            var bttnContainer = document.createElement('div');
            bttnContainer.id = 'containerForBttns';
            bttnContainer.className = 'buttons';
            document.getElementsByTagName('form')[0].appendChild(bttnContainer);

            var prevBttn = document.createElement('div');
            prevBttn.id = 'prvBttn';
            prevBttn.innerHTML = 'PREV';
            document.getElementById('containerForBttns').appendChild(prevBttn);

            var nextBttn = document.createElement('div');
            nextBttn.id = 'nxtBttn';
            nextBttn.innerHTML = 'NEXT';
            document.getElementById('containerForBttns').appendChild(nextBttn);
        }

        function loadImage(image) {
            if (image.length > 0) {
                if (image[0].length > 0) {
                    image[0][0].src = image[0][0].getAttribute('linkToImg');
                    image[0][0].onload = function () { loadImage(image); };
                    image[0][0].removeAttribute('linkToImg');
                    image[0].splice(0, 1);
                } else {
                    image.splice(0, 1);
                    loadImage(image);
                }
            }
        }

        function loadOrderListOfImages(currentPage, numberOfPages) {
            var nextPage;
            var orderList = [];
            var image = getElementsByAttribute(document.body, "*", "relativeTo", "page_" + currentPage);
            orderList.push(image);

            for (var idx = 1; idx <= numberOfPages; idx++) {
                if (currentPage - idx >= 0 && currentPage != currentPage - idx) {
                    nextPage = currentPage - idx;
                    image = getElementsByAttribute(document.body, "*", "relativeTo", "page_" + nextPage);
                    if (image.length != 0) orderList.push(image);
                    //leftpage
                }

                if (currentPage + idx <= numberOfPages && currentPage != currentPage + idx) {
                    nextPage = currentPage + idx;
                    image = getElementsByAttribute(document.body, "*", "relativeTo", "page_" + nextPage);
                    if (image.length != 0) orderList.push(image);
                    //rightpage
                }
            }

            loadImage(orderList);
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
                item[i].setAttribute('linkToImg', item[i].src);
                item[i].removeAttribute('src');
            }
            return item;
        }

        function getElementsByAttribute(oElm, strTagName, strAttributeName, strAttributeValue) {
            var arrElements = (strTagName == "*" && document.all) ? document.all : oElm.getElementsByTagName(strTagName);
            var arrReturnElements = new Array();
            var oAttributeValue = (typeof strAttributeValue != "undefined") ? new RegExp("(^|\\s)" + strAttributeValue + "(\\s|$)") : null;
            var oCurrent;
            var oAttribute;
            for (var i = 0; i < arrElements.length; i++) {
                oCurrent = arrElements[i];
                oAttribute = oCurrent.getAttribute(strAttributeName);
                if (typeof oAttribute == "string" && oAttribute.length > 0) {
                    if (typeof strAttributeValue == "undefined" || (oAttributeValue && oAttributeValue.test(oAttribute))) {
                        arrReturnElements.push(oCurrent);
                    }
                }
            }
            return arrReturnElements;
        }

        function DetectBrowser() {
            if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) return "Opera";
            if (typeof InstallTrigger !== 'undefined') return "FireFox";
            if (!!window.chrome && !(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)) return "Chrome";
            if (/*@cc_on!@*/false || document.documentMode) return "IE";
            return 'Unknown';
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
    </script>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">

    </form>

</body>
</html>
