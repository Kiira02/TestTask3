YUI.add('myslider', function (Y) {

    function mySlider(config) {
        var mySliderList, app;

        Y.SliderModel = Y.Base.create('sliderModel', Y.Model, [], {
            test: function () {
                //to do
            }
        }, {
            ATTRS: {
                title: { value: '' },
                content: { value: '' }
            }
        });

        Y.SliderList = Y.Base.create('sliderList', Y.ModelList, [], {
            model: Y.SliderModel,
            getTotalPages: function () {
                var numPages = 0;
                this.each(function (item) {
                    numPages++
                });
                return numPages;
            },
            getPage: function (page) {
                var filteredPage = this.filter(function (item) {
                    return item.get('title') === page;
                });
                if (filteredPage.length !== 0) {
                    return filteredPage[0];
                }
            }
        });

        Y.SliderView = Y.Base.create('sliderView', Y.View, [], {
            events: { '#demo' : {click: function() {alert('fire!')} }},
            template: '<div>{content}</div><button id="demo">TEST</button>',
            initializer: function () {
                var model = this.get('model');
                model.after('change', this.render, this);
                model.after('destroy', this.render, this);
            },
            render: function () {
                var container = this.get('container'),
                    data = { content: this.get('model').toJSON().content },
                    contData = Y.Lang.sub(this.template, data);

                container.setHTML(contData);
                if (! container.inDoc()) {
                    Y.one('body').append(container);
                }
                return this;

                /**var model = this.get('model'),
                    data = { content: this.get('model').toJSON().content },
                    content = Y.Lang.sub(this.template, data),
                    container = this.get('container');

                container.setHTML(content);
                if (! container.inDoc()) {
                    Y.one('body').append(container);
                }
                return this;*/
            }
        }, {
            ATTRS: {
                container: { value: Y.Node.create('<div/>')}
            }
        });

        mySliderList = new Y.SliderList();
        for (var i in config['content']) {
            mySliderList.add([{ title: config['content'][i].title, content: config['content'][i].content }]);
        }

        app = new Y.App({
            transitions: true,
            viewConteiner: '#content',
            views: {
                slider: {
                    type: 'SliderView'
                }
            },
            routes: [{
                path: '/',
                callback: function () {
                    var pageModel = mySliderList.getPage('Pagetitle');
                    this.showView('slider', { model: pageModel });
                }
            }, {
                path: '/:pageName',
                callback: function () {
                    var pageModel = mySliderModelList.getPage('Pagetitle2');
                    this.showView('slider', { model: pageModel });
                }
            }]
        });

        app.navigate('/');

    }

    Y.namespace('MySlider').Start = function (config) {
        return new mySlider(config);
    };

}, '1.0.0', { requires: ['view', 'model', 'model-list', 'router', 'app']});


