sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Image",
    "sap/ui/model/Sorter"
  ], (BaseController,JSONModel,Filter,FilterOperator,Image,Sorter) => {
    "use strict";
    var that, appModulePath;
    return BaseController.extend("com.ibs.ibsidealtoolpage.controller.Welcome", {
        onInit() {
            that=this;
            // const oRouter = this.getOwnerComponent().getRouter();
			// oRouter.getRoute("Welcome").attachRouteMatched(this.onObjectMatched, this);
            
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            // appModulePath = jQuery.sap.getModulePath(appPath);
            appModulePath = sap.ui.require.toUrl(appPath);
            this.onWelcomePage();

        },
        // onObjectMatched:function(){
           
        // },
        onWelcomePage: function(){
         
            var oList =  this.getOwnerComponent().getModel().bindList("/resourceApplicationMaster",undefined,
                [new Sorter("SEQUENCE")],
                [new Filter("RESOURCE_TYPE", FilterOperator.EQ, "WLC")],{});
                oList.requestContexts().then((odata) => {
                  
                    var resources = [];
                    // for(let i=0; i<odata.length; i++){
                    //     odata[i].getObject().LOGO = appModulePath + odata[i].getObject().LOGO;
                    //     resources.push(odata[i].getObject());
                    // }
                    const count = odata.length;
                    let i= 0;
                    odata.forEach(element => {
                        if(count>i){
                        resources.push(element.getObject());
                        resources[i].LOGO = appModulePath + resources[i].LOGO;
                        i++;
                    }
                    });
                var oModel = new JSONModel(resources);
                this.getView().setModel(oModel,"resourcemodel");
                this._setImagesInCarousel(resources)
            });
        },
        _setImagesInCarousel: function (imagedata) {
		
			var oCarousel = this.byId("carouselSample");
			oCarousel.destroyPages();

			for (var i = 0; i < imagedata.length; i++) {
				var imagemodel = i + 1;

				oCarousel.addPage(new Image("img" + imagemodel, {
					src: "{resourcemodel>/"+i+"/LOGO}"
				}));
			}
		},

    });
  });