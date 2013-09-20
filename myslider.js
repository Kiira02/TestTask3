YUI.add('myslider', function (Y) {

    function mySlider(config) {
        var mySliderList, app,
		    object = config['content'],
            currentPage = 0;

        Y.SliderModel = Y.Base.create('sliderModel', Y.Model, [], {
		nextPage: function () {
			app.navigate('/:next');
		}
        }, {
            ATTRS: {
                title: { value: '' },
                content: { value: '' },
		    button: { value: '<button class="prev">PREV</button><button class="next">NEXT</button>'},
		    name: { value: ''}
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
                    return this._items[page];
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
			    data = {content: this.get('model').toJSON().content, buttons: this.get('model').toJSON().button, title: this.get('model').toJSON().title},
			    contData = Y.Lang.sub(this.template, data);

		    	container.setHTML(contData);
		    	Y.one('body').appendChild(container);
            },
		nextPage: function () {
            var numPages = mySliderList.getTotalPages() - 1;
            currentPage++;
            if(currentPage > numPages) currentPage = 0;
            app.navigate('/' + mySliderList._items[currentPage].get('name'));
		},
		prevPage: function () {
            var numPages = mySliderList.getTotalPages() - 1;
            currentPage--;
            if(currentPage < 0) currentPage = numPages;
			app.navigate('/' + mySliderList._items[currentPage].get('name'));
		}
        });

        mySliderList = new Y.SliderList();
        for (var i in object) {
            mySliderList.add([{ title: object[i].title, content: object[i].content, name: i }]);
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
                    var pageModel = mySliderList.getPage(currentPage);
                    this.showView('slider', { model: pageModel });
                }
            }, {
                path: '/:pageName',
                callback: function (req) {
                    var pageModel = mySliderList.getPage(currentPage);
                    this.showView('slider', { model: pageModel });
                }
            }]
        });

        app.navigate('/');
	    app.render();
    };

    Y.namespace('MySlider').Start = function (config) {
        return new mySlider(config);
    };

}, '1.0.0', { requires: ['view', 'model', 'model-list', 'router', 'app']});


