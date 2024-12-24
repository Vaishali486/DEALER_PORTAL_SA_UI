sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Image",
    "sap/ui/model/Sorter"
  ], (BaseController,JSONModel,Filter,FilterOperator,Image,Sorter) => {
    "use strict";
    var that;
    return BaseController.extend("com.ibs.ibsidealtoolpage.controller.Welcome", {
        onInit() {
            that=this;
            // const oRouter = this.getOwnerComponent().getRouter();
			// oRouter.getRoute("Welcome").attachRouteMatched(this.onObjectMatched, this);
            this.onWelcomePage();
        },
        onObjectMatched:function(){
           
        },
        onWelcomePage: function(){
            debugger
            var oList =  this.getOwnerComponent().getModel().bindList("/resourceApplicationMaster",undefined,
                [new Sorter("SEQUENCE")],
                [new Filter("RESOURCE_TYPE", FilterOperator.EQ, "WLC")],{});
                oList.requestContexts().then((odata) => {
                    debugger
                    var resources = [];
                    odata.forEach(element => {
                    resources.push(element.getObject());
                });
                var oModel = new JSONModel(resources);
                this.getView().setModel(oModel,"resourcemodel");
                this._setImagesInCarousel(resources)
            });
        },
        _setImagesInCarousel: function (imagedata) {
			debugger
			var oCarousel = this.byId("carouselSample");
			oCarousel.destroyPages();

			for (var i = 0; i < imagedata.length; i++) {
				var imagemodel = i + 1;

				oCarousel.addPage(new Image("img" + imagemodel, {
					src: "{resourcemodel>/"+i+"/LOGO}"
					// densityAware: true,
					// decorative: true
				}));
			}
		},

    });
  });