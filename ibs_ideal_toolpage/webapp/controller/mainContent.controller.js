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
    return BaseController.extend("com.ibs.ibsidealtoolpage.controller.mainContent", {
        onInit: function() {
          that = this;
          var oRouter= this.getOwnerComponent().getRouter();
          oRouter.getRoute("RouteMainContent").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched : function(){
        //   var appdata = this.getOwnerComponent().getModel("accessAppModel");
          this.onManageSite();
        },
        onManageSite:function(){
          var oList =  this.getOwnerComponent().getModel().bindList("/applicationMaster",undefined,[],
              [new Filter("APPLICATION_TYPE", FilterOperator.EQ, "PLG")],
              {   $expand: "TO_SA_APPLICATION" 
              });
              oList.requestContexts().then((odata) => {
                  var pluginApp = [];
                  odata.forEach(element => {
                  pluginApp.push(element.getObject());
              });
              var oModel = new JSONModel(pluginApp);
              this.getView().setModel(oModel,"pluginAppModel");
              this._getManageSiteiFrame(pluginApp);

          });
      },
      _getManageSiteiFrame: function(plugindata){
          // this.destroy();
          var pluginLink= plugindata[0].TO_SA_APPLICATION[0].SA_APPLICATION_LINK;
          var oCarousel = this.byId("appPage");
          var container = new sap.ui.core.HTML({
              preferDOM: true,
             content: "<iframe src='"+pluginLink+"' '></iframe>"
                        });
          oCarousel.addPage(container)
      }

        
    });
});