/*

  Default application template.

*/

define([
  "framework",
  "controller/router",
  "module/storage",
  "module/google",
  "module/user",
  "module/send",
  "view/header",
  "view/drive",
  "view/list",
  "view/compose",
], function (MediumFramework, Router, StorageModule, GoogleModule, UserModule, SendModule, HeaderView, ComposeView, DriveView, ListView) {

  return MediumFramework.Module.extend({

    name: 'app',

    fn: {
      init: function () {
        StorageModule.init();
        GoogleModule.init();
        UserModule.init();
        SendModule.init();
        
        Router.init();
        this.trigger(":router:href", "");
        
        HeaderView.init();
        ComposeView.init();
        DriveView.init();
        ListView.init();
      }
    }

  });
});
