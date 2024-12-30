sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ], (Controller,JSONModel,Filter,FilterOperator) => {
    "use strict";
    var that,appModulePath;
    return Controller.extend("com.ibs.ibsidealtoolpage.controller.Help", {
        onInit : function() {
           
          that = this;
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          appModulePath = sap.ui.require.toUrl(appPath);
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("RouteHelp").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function(){
           
          this.onPdfReader();
        },
        onPdfReader:function(){
           
          var oList =  this.getOwnerComponent().getModel().bindList("/resourceApplicationMaster",undefined,[],
            [new Filter("RESOURCE_TYPE", FilterOperator.EQ, "HLP")],
            {});
            oList.requestContexts().then((odata) => {
                var resources = [];
                odata.forEach(element => {
                resources.push(element.getObject());
                resources[0].LOGO = appModulePath + resources[0].LOGO;
            });
            var oModel = new JSONModel(resources);
            this.getView().setModel(oModel,"helpmodel");
        });

         
        }


    });
  });