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
    return BaseController.extend("com.ibs.ibsidealtoolpage.controller.Logo", {
        onInit() {
            that=this;
            // const oRouter = this.getOwnerComponent().getRouter();
			// oRouter.getRoute("Welcome").attachRouteMatched(this.onObjectMatched, this);
            
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            // appModulePath = jQuery.sap.getModulePath(appPath);
            appModulePath = sap.ui.require.toUrl(appPath);
            this.onLogoPage();
        },
        // onObjectMatched:function(){
           
        // },
        onLogoPage: function(){
            var imageData ={
                FirstImage : null,
                SecondImage: null,
                ThirdImage: null,
                FourthImage: null,
                CoolerImage : null,

            }
            imageData.FirstImage = sap.ui.require.toUrl("com/ibs/ibsidealtoolpage/Content/LogoFirst.png");
            imageData.SecondImage = sap.ui.require.toUrl("com/ibs/ibsidealtoolpage/Content/LogoSecond.jpg");
            imageData.ThirdImage = sap.ui.require.toUrl("com/ibs/ibsidealtoolpage/Content/LogoThird.jpg");
            imageData.FourthImage = sap.ui.require.toUrl("com/ibs/ibsidealtoolpage/Content/LogoFourth.jpg");
            imageData.CoolerImage = sap.ui.require.toUrl("com/ibs/ibsidealtoolpage/Content/Cooler.png");

            var pluginLink= sap.ui.require.toUrl("com/ibs/ibsidealtoolpage/Content/Catalog.html");;
            var oPage = this.byId("vBoxiFrame");
            // oPage.destroyContent();
            var container = new sap.ui.core.HTML({
               content: "<iframe height='100%' width='100%' src='"+pluginLink+"' ></iframe>"
                          });
            oPage.insertItem(container,1);

            var pluginActivity= sap.ui.require.toUrl("com/ibs/ibsidealtoolpage/Content/Activities.html");;
            var oPage = this.byId("vBoxActivityiFrame");
            // oPage.destroyContent();
            var activityContainer = new sap.ui.core.HTML({
               content: "<iframe height='100%' width='100%' src='"+pluginActivity+"' ></iframe>"
                          });
            oPage.insertItem(activityContainer,1)
        
            var oModel = new JSONModel(imageData);
            this.getView().setModel(oModel,"resourcemodel");
                // this._setImagesInCarousel(resources)
        }

    });
  });