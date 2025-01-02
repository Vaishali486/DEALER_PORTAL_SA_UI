sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"

],
 (Controller,JSONModel,Filter,FilterOperator,Fragment,MessageBox) => {
    "use strict";
    var that, oAppDataModel,appId,appPath, appModulePath , oRouter;
    return Controller.extend("com.ibs.ibsidealtoolpage.controller.Master", {
        
        onInit: function() {
            that= this;
            oRouter = this.getOwnerComponent().getRouter(); 
            oAppDataModel = this.getOwnerComponent().getModel();
            this._onReadResource();
            this._getAccessApps();
            appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            appPath = appId.replaceAll(".", "/");
            // appModulePath = jQuery.sap.getModulePath(appPath);
            appModulePath = sap.ui.require.toUrl(appPath);
            this._getUserAttributes();

        },
        _onReadResource: function(){
             
            var oList =  this.getOwnerComponent().getModel().bindList("/resourceApplicationMaster",undefined,[],
                [new Filter("RESOURCE_TYPE", FilterOperator.EQ, "LGO")],
                {});
                oList.requestContexts().then((odata) => {
                    var resources = [];
                    
                    odata.forEach(element => {
                    resources.push(element.getObject());
                    resources[0].LOGO = appModulePath + resources[0].LOGO;
                });
                var oModel = new JSONModel(resources);
                this.getView().setModel(oModel,"resourcemodel");
            });
        },
        onSideNavButtonPress: function () {
			var oToolPage = this.getView().byId("toolPage");
			var bSideExpanded = oToolPage.getSideExpanded();

			// this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
        onPressWelcome: function() {
            const oRouter = this.getOwnerComponent().getRouter(); 
            oRouter.navTo("RouteWelcome"); 		
        },
        onHelpPress:function () {
            const oRouter = this.getOwnerComponent().getRouter(); 
            oRouter.navTo("RouteHelp");     
        },
        
        onClickAvatar: async function(oEvent){
             
            var oEventSource = oEvent.getSource();
            var pFragment = await this.loadFragment({
                name: "com.ibs.ibsidealtoolpage.view.Fragment.Popover"
            });
            pFragment.openBy(oEventSource);
        },
        onAbout : async function(oEvent){
            // var oEventSource = oEvent.getSource();
            this.aboutFragment = await this.loadFragment({
                name: "com.ibs.ibsidealtoolpage.view.Fragment.UserDetail"
            });
            
            this.aboutFragment.open();
        },
        OnCloseAbout : function(){
            this.aboutFragment.close();
            this.aboutFragment.destroy();
        },
        onSignOut: function () {
            sap.m.URLHelper.redirect("/logout", false);
        },
        onItemSelect : function(oEvent){
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteMainContent");
        },
        onAppItemSelect : function(oEvent){
      

            var oModelData = {
                appURLPATH : null,
                applicationName: null
            };
            var appModel = oEvent.getParameters().item.getBindingContext('accessAppModel').getObject();
            if(appModel.SA_APPLICATION_LINK){
                oModelData.appURLPATH = appModel.SA_APPLICATION_LINK;
                oModelData.applicationName = appModel.SA_APPLICATION_NAME;
            }
            else if(!appModel.TO_SA_APPLICATION){
                oModelData.appURLPATH = appModel.APPLICATION_ICON_URL;  
                oModelData.applicationName = appModel.APPLICATION_NAME; 
            }
            if(oModelData){
                var oModel = new JSONModel(oModelData);
                this.getOwnerComponent().setModel(oModel,"sideAppModel"); 
                
            }
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteAppContent");

        },
        
        _getUserAttributes: function () {
             
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
           
            var appModulePath = sap.ui.require.toUrl(appPath);
            
            var attr = appModulePath + "/user-api/attributes";

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: attr,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data, response) {
                         
                        
                        data.fullname = data.firstname + " " + data.lastname;
                        var _firstletter = data.firstname[0];
                        var _lastletter = data.lastname[0];
                        data.initials = _firstletter + _lastletter;
                        var oModel = new JSONModel(data);
                        that.getView().setModel(oModel,"userModel");    
                    },
                    error: function (oError) {
                        MessageBox.error("Error while reading User Attributes");
                    }
                });
              
            });
        },
        _getAccessApps:function(){
             
            var ContextBinding = oAppDataModel.bindContext("/getAccessApps(...)"); 
            ContextBinding.execute().then(
                function () {
                    var oData = ContextBinding.getBoundContext().getObject().value;
                    var aAppType = ['GRP','APP','LNK']
                    var groupApplication =[];
                    for(let i=0 ; i< oData.length; i++){
                        if(aAppType.includes(oData[i].APPLICATION_TYPE)){
                            groupApplication.push(oData[i])
                        }
                        if(oData[i].APPLICATION_TYPE == 'APP'){
                            oData[i].APPLICATION_ICON_URL = oData[i].TO_SA_APPLICATION[0].SA_APPLICATION_LINK;
                            oData[i].TO_SA_APPLICATION = null;
                        }
                    }
                    var oModel = new JSONModel(groupApplication);
                    this.getOwnerComponent().setModel(oModel,"accessAppModel");
                    
                }.bind(this), function (oError) {
                    MessageBox.error("Error: ",oError);
                }); 

        },
  
    });
});