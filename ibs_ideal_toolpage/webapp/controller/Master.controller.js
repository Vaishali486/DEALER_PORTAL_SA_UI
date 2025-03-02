sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator"

],
 (Controller,JSONModel,Filter,FilterOperator,Fragment,MessageBox,BusyIndicator) => {
    "use strict";
    var that, oAppDataModel,appId,appPath, appModulePath , oRouter;
    return Controller.extend("com.ibs.ibsidealtoolpage.controller.Master", {
        
        onInit: function() {
            that= this;
            oRouter = this.getOwnerComponent().getRouter(); 
            oAppDataModel = this.getOwnerComponent().getModel();
            that.idNavigationList=this.getView().byId("idNavigationList");
            this._onReadResource();
            this._getAccessApps();
            appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            appPath = appId.replaceAll(".", "/");
            // appModulePath = jQuery.sap.getModulePath(appPath);
            appModulePath = sap.ui.require.toUrl(appPath);
            this._navigationListItem();
            this._getUserAttributes();

        },

        _navigationListItem:function(oEvent){      

            that.idNavigationList.onAfterRendering = function () {
              sap.tnt.NavigationList.prototype.onAfterRendering.apply(this, arguments);
              that.idNavigationList.getItems().forEach(function (oItem) {
                  if (oItem.getItems && oItem.getItems().length > 0) {
                      var iRowCount = 0;
                      oItem.getItems().forEach(function (oSubItem) {  
                        oSubItem.$().css("background-color", "Goldenrod");  
                      });
                  }
              });
            };   
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
        onPressLogo: function(){
            const oRouter = this.getOwnerComponent().getRouter(); 
            oRouter.navTo("RouteLogo"); 	
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
        openImagePopup : async function(){
            that.popupImageFragment = await that.loadFragment({
                name: "com.ibs.ibsidealtoolpage.view.Fragment.Popup"
            });
            that.popupImageFragment.open();
            BusyIndicator.hide();
        },
        OnCloseImagePopup : function(){
            that.popupImageFragment.close();
            that.popupImageFragment.destroy();
        },
        openPdfPopup : async function(){
            that.popupPdfFragment = await this.loadFragment({
                name: "com.ibs.ibsidealtoolpage.view.Fragment.PopupPdf"
            });
            that.popupPdfFragment.open();
        },
        OnClosePdfPopup : function(){
            that.popupPdfFragment.close();
            that.popupPdfFragment.destroy();
        },
        openTextPopup : async function() {
            that.popupTextFragment = await this.loadFragment({
                name: "com.ibs.ibsidealtoolpage.view.Fragment.PopupText"
            });
            that.popupTextFragment.open();
        },
        OnCloseTextPopup : function(){
            that.popupTextFragment.close();
            that.popupTextFragment.destroy();
        },
        
        onAppItemSelect : function(oEvent){
    
            var oModelData = {
                appURLPATH : null,
                applicationName: null
            };
            var oPopupData = {
                imagePopupUrl : null
            }
            // var appType = oEvent.getParameters().item.getBindingContext('accessAppModel').oModel.oData.APPLICATION_TYPE;
            var appModel = oEvent.getParameters().item.getBindingContext('accessAppModel').getObject();
            if(appModel.APPLICATION_TYPE == 'PUP'){
                if(appModel.FILE_MIMETYPE == 'image/png' || appModel.FILE_MIMETYPE == 'image/jpg'){
                    var popupUrl = appModulePath + appModel.CONTENT;
                    oPopupData.imagePopupUrl = popupUrl;
                    BusyIndicator.show();
                    that.openImagePopup();
                }
                else if(appModel.FILE_MIMETYPE == 'application/pdf'){
                    var popupUrl = appModulePath + appModel.CONTENT;
                    oPopupData.imagePopupUrl = popupUrl;
                    that.openPdfPopup();
                }
                else if(!appModel.FILE_MIMETYPE){
                    // var popupUrl = appModulePath + appModel.CONTENT;
                    oPopupData.imagePopupUrl = appModel.POPUP_TEXT;
                    that.openTextPopup();
                }
                // else if(appModel.FILE_MIMETYPE == null){
                //     var popupUrl = appModel.POPUP_TEXT;
                // }
                var oPopupModel = new JSONModel(oPopupData);
                that.getOwnerComponent().setModel(oPopupModel,"PopupModel");  
                // this.openPopupFragment();

                // /odata/v4/ideal-sa-application/resourceApplicationMaster(ID=baa57f86-8e94-48b8-9634-6e7234176c49,IsActiveEntity=true)/FILE_CONTENT
            }
            else if(appModel.APPLICATION_TYPE == 'APP'){
                oModelData.appURLPATH = appModel.APPLICATION_ICON_URL;  
                oModelData.applicationName = appModel.APPLICATION_NAME; 
            }
            else if(appModel.SA_APPLICATION_LINK){
                oModelData.appURLPATH = appModel.SA_APPLICATION_LINK;
                oModelData.applicationName = appModel.SA_APPLICATION_NAME;
            }
            // else if(!appModel.TO_SA_APPLICATION){
            //     oModelData.appURLPATH = appModel.APPLICATION_ICON_URL;  
            //     oModelData.applicationName = appModel.APPLICATION_NAME; 
            // }
            // else if(appModel.APPLICATION_TYPE == 'PUP'){
                
            // }
            if(oModelData.appURLPATH){
                var oModel = new JSONModel(oModelData);
                this.getOwnerComponent().setModel(oModel,"sideAppModel");  
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteAppContent"); 
            }
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
                    var aAppType = ['GRP','APP','LNK','PUP']
                    var groupApplication =[];
                    for(let i=0 ; i< oData.length; i++){
                        if(aAppType.includes(oData[i].APPLICATION_TYPE)){
                            groupApplication.push(oData[i])
                        }
                        if(oData[i].APPLICATION_TYPE == 'APP'){
                            oData[i].APPLICATION_ICON_URL = oData[i].TO_SA_APPLICATION[0].SA_APPLICATION_LINK;
                            oData[i].TO_SA_APPLICATION = null;
                        }
                        
                        // else if(oData[i].APPLICATION_TYPE == 'PUP'){
                        //     oData[i].APPLICATION_ICON_URL = appModulePath + "/odata/v4/ideal-sa-application/applicationMaster("+oData[i].ID +",IsActiveEntity=true)/FILE_CONTENT";
                        //     oData[i].TO_SA_APPLICATION = null;
                        // }
                      }
                    var oModel = new JSONModel(groupApplication);
                    this.getOwnerComponent().setModel(oModel,"accessAppModel");

                    
                    
                }.bind(this), function (oError) {
                    MessageBox.error("Error: ",oError);
            }); 
        },
  
    });
});