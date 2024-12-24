sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ], (Controller,JSONModel,Filter,FilterOperator) => {
    "use strict";
    var that;
    return Controller.extend("com.ibs.ibsidealtoolpage.controller.Help", {
        onInit : function() {
          debugger
          that = this;
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("RouteHelp").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function(){
          debugger
          this.onPdfReader();
        },
        onPdfReader:function(){
          debugger
          var oList =  this.getOwnerComponent().getModel().bindList("/resourceApplicationMaster",undefined,[],
            [new Filter("RESOURCE_TYPE", FilterOperator.EQ, "HLP")],
            {});
            oList.requestContexts().then((odata) => {
                var resources = [];
                odata.forEach(element => {
                resources.push(element.getObject());
            });
            var oModel = new JSONModel(resources);
            this.getView().setModel(oModel,"helpmodel");
        });

         
        }


    });
  });