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
          oAppDataModel = this.getOwnerComponent().getModel();
          var ContextBinding = oAppDataModel.bindContext("/getAccessApps(...)"); // BooksByGenre is the function 							      Import to get custom data
            // ContextBinding.setParameter("genre", 'MYS') //  genre is the paramater we are passing to 					 backend which is set in backend which works like filter
            ContextBinding.execute().then(
                function () {
                    var oData = ContextBinding.getBoundContext().getObject().value;
                    var pluginApp =[];
                    for(let i=0 ; i< oData.length; i++){
                        if(oData[i].APPLICATION_TYPE == 'PLG'){
                          pluginApp.push(oData[i])
                        }
                    }
                    var oModel = new JSONModel(pluginApp);
                    this.getView().setModel(oModel,"pluginAppModel");
                    this._getManageSiteiFrame(pluginApp);
                    
                }.bind(this), function (oError) {
                    MessageBox.error("Error: ",oError);
                }); 
      },
      _getManageSiteiFrame: function(plugindata){
          // this.destroy();
          var pluginLink= plugindata[0].TO_SA_APPLICATION[0].SA_APPLICATION_LINK;
          var oPage = this.byId("appPage");
          oPage.destroyContent();
          var container = new sap.ui.core.HTML({
              // preferDOM: true,
             content: "<iframe height='100%' width='100%' src='"+pluginLink+"' ></iframe>"
                        });
          oPage.addContent(container)
      }

        
    });
});