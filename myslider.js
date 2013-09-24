YUI.add('myslider', function (Y) {

    function mySlider(config) {
        var mySliderList, app,
		    object = config['content'],
            currentPage = 0;

        Y.SliderModel = Y.Base.create('sliderModel', Y.Model, [], {}, {
            ATTRS: {
                title: { value: '' },
                content: { value: '' },
		        name: { value: ''}
            }
        });

        Y.SliderList = Y.Base.create('sliderList', Y.ModelList, [], {
            model: Y.SliderModel,
            checkPages: function (name, number) {
                var model = this.item(number),
                    modelList = this.toArray();
                if(model.get('name') != name) {
                    for(var i in modelList) {
                        if(modelList[i].get('name') == name) {
                            return modelList[i];
                        }
                    }
                }
                return model;
            }
        });

        Y.SliderView = Y.Base.create('sliderView', Y.View, [], {
            events: {
                '.next' : { click: 'nextPage' },
                '.prev' : { click: 'prevPage'}
            },
		    template: Y.one('#templateForSlider').getHTML(),
            initializer: function () {
                var model = this.get('model');
                    model.after('change', this.render, this);
               	    model.after('destroy', this.render, this);
            },
            render: function () {
                var container = this.get('container'),
                    model = this.get('model'),
                    //view = new Y.SlideView({model: model}),
                    data = {content: this.get('model').toJSON().content /**view.render().get('container')*/, title: this.get('model').toJSON().title},
                    contData = Y.Lang.sub(this.template, data);
                    //height = window.innerHeight;

                container.setHTML(contData);
                Y.one('body').appendChild(container);
                //Y.all('.slideTMPL').setStyle('height', height - 62 + 'px');
            },
            nextPage: function () {
                var numPages = mySliderList.size() - 1;
                currentPage++;
                if(currentPage > numPages) currentPage = 0;
                app.navigate('/' + mySliderList.item(currentPage).get('name'));
            },
            prevPage: function () {
                var numPages = mySliderList.size() - 1;
                currentPage--;
                if(currentPage < 0) currentPage = numPages;
                app.navigate('/' + mySliderList.item(currentPage).get('name'));
            }
        });

        /**Y.SlideView = Y.Base.create('slideView', Y.View, [], {
            initializer: function () {
                var model = this.get('model');
                    model.after('change', this.render, this);
                    model.after('destroy', this.render, this);
            },
            render: function () {
                var container = this.get('container'),
                    model = this.get('model').toJSON().content;

                container.setHTML(model);
                return this;
            }
        });*/

        mySliderList = new Y.SliderList();
        for (var i in object) {
            mySliderList.add([{ title: object[i].title, content: object[i].content, name: i }]);
        }

        app = new Y.App({
            transitions: false,
            viewConteiner: '#content',
            views: {
                slider: {
                    type: 'SliderView'
                }
                /**slide : {
                    type: 'SlideView',
                    parent: 'SliderView'
                }*/
            },
            routes: [{
                path: '/',
                callback: function () {
                    var pageModel = mySliderList.item(currentPage);
                    this.showView('slider', { model: pageModel });
                }
            }, {
                path: '/:pageName',
                callback: function (req) {
                    var pageModel = mySliderList.checkPages(req.params.pageName, currentPage);
                    this.showView('slider', { model: pageModel });
                }
            }]
        });

        app.navigate('/');
	    app.render();

        Y.on('keydown', function (e) {
            var numPages = mySliderList.size() - 1;
            if(e.keyCode == 37) {
                currentPage--;
                if(currentPage < 0) currentPage = numPages;
                app.navigate('/' + mySliderList.item(currentPage).get('name'));
            }
            if(e.keyCode == 39) {
                currentPage++;
                if(currentPage > numPages) currentPage = 0;
                app.navigate('/' + mySliderList.item(currentPage).get('name'));
            }
        }, window);
    };

    Y.namespace('MySlider').Start = function (config) {
        return new mySlider(config);
    };

}, '1.0.0', { requires: ['view', 'model', 'model-list', 'router', 'app']});


