/*

  Default application template.

*/

define([
  "framework",
], function (MediumFramework) {

  return MediumFramework.Module.extend({

    name: "storage",

    props: {

    },

    fn: {

      init: function() {
        this.on(":logout", this.fn.clear);
        this.on("local session", this.fn.store);

        ['local', 'session'].forEach(function (type) {
          this.set(type, this._.storage[type].getItem("data") || {});
        }.bind(this));
      },

      clear: function () {
        this.props.session = {};
      },

      store: function (props, storage) {
        var type = Object.keys(storage)[0];
        this._.storage[type].setItem("data", this.props[type]);
      }
    }
  });

});
