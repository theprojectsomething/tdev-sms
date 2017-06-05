/*

  Main config file for the JS application, loaded in the index.

*/

(function (require){

require.config({

  urlArgs: "bust=" + (new Date()).getTime(),

  // prevent timeout of loading modules
  waitSeconds: 0,

  paths: {

    // medium framework
    framework: 'vendor/medium-framework-0.1.2',

    // utilities

    // libraries

    // require plugins
    text:      'vendor/require/require.text-2.0.10',

    // shortcuts
    template:  '../templates'

  }

});

require(['app'], function (App) {
  App.init();
});

})(require);
