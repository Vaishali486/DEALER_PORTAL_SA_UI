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
    var that, oAppDataModel,appId,appPath, appModulePath;
    return Controller.extend("com.ibs.ibsidealtoolpage.controller.Master", {
        
        onInit: function() {
            that= this;
            oAppDataModel = this.getOwnerComponent().getModel();
            this._onReadResource();
            this._getAccessApps();
            appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            appPath = appId.replaceAll(".", "/");
            // appModulePath = jQuery.sap.getModulePath(appPath);
            appModulePath = sap.ui.require.toUrl(appPath);
            // this._getUserAttributes();

        },
        _onReadResource: function(){
            debugger
            var oList =  this.getOwnerComponent().getModel().bindList("/resourceApplicationMaster",undefined,[],
                [new Filter("RESOURCE_TYPE", FilterOperator.EQ, "LGO")],
                {});
                oList.requestContexts().then((odata) => {
                    var resources = [];
                    odata.forEach(element => {
                    resources.push(element.getObject());
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
            debugger
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
            // this.getView().addDependent(aboutFragment);
            // aboutFragment.open(oEventSource);
            this.aboutFragment.open();
        },
        OnCloseAbout : function(){
            this.aboutFragment.close();
            this.aboutFragment.destroy();
        },
        onSignOut: function () {
            debugger
            sap.m.URLHelper.redirect("/logout", false);

        },
        _getUserAttributes: function () {
            debugger
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            // appModulePath = jQuery.sap.getModulePath(appPath);
            var appModulePath = sap.ui.require.toUrl(appPath);

            var attr = appModulePath + "/user-api/attributes";

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: attr,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data, response) {
                        debugger
                        that._sUserID = data.email.toLowerCase();
                        that._sUserName = data.firstname + " " + data.lastname;
                        that.firstname = data.firstname;
                        that.lastname = data.lastname;
                        that.emailId = data.email; 
                        var oModel = new JSONModel(data);
                        this.getView().setModel(oModel,"userModel");    
                    },
                    error: function (oError) {
                        MessageBox.error("Error while reading User Attributes");
                    }
                });
              
            });
        },
        _getAccessApps:function(){
            debugger
            var ContextBinding = oAppDataModel.bindContext("/getAccessApps(...)"); // BooksByGenre is the function 							      Import to get custom data
            // ContextBinding.setParameter("genre", 'MYS') //  genre is the paramater we are passing to 					 backend which is set in backend which works like filter
            ContextBinding.execute().then(
                function () {
                    var oData = ContextBinding.getBoundContext().getObject().value;
                    var oModel = new JSONModel(oData);
                    this.getView().setModel(oModel,"accessAppModel");
                    
                }.bind(this), function (oError) {
                    MessageBox.error("Error: ",oError);
                }); 

        },
        // onSignOut:function(){
            
        // },
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
            var container = new sap.ui.core.HTML({
                preferDOM: true,
               content: "<iframe src='"+pluginLink+"' '></iframe>"
                          });
        }

    });
});