sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Image",
    "sap/ui/model/Sorter"
  ], (BaseController,JSONModel,Filter,FilterOperator,Image,Sorter) => {
    "use strict";
    var that,oAppDataModel;
    return BaseController.extend("com.ibs.ibsidealtoolpage.controller.appContent", {
        onInit: function() {
          that = this;

          var oRouter= this.getOwnerComponent().getRouter();
          oRouter.getRoute("RouteAppContent").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched : function(){
        
        oAppDataModel = this.getOwnerComponent().getModel("sideAppModel").getProperty('/')
        var applicationLink = oAppDataModel.appURLPATH;
    
        var oPage = this.byId("appDisplayPage");
        if(oPage.getContent().length)
        oPage.destroyContent();
        var container = new sap.ui.core.HTML({
            // preferDOM: true,
           content: "<iframe height='100%' width='100%' src='"+applicationLink+"' ></iframe>"
                      });
        oPage.addContent(container)
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteMaster");
        },




        
        
    });
});