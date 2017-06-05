/*

  Default application template.

*/

define([
  "framework",
  "text!template/header.html",
], function (MediumFramework, Template) {

  return MediumFramework.View.extend({

    name: "header",

    el: {
      selector: ".header",

      bind: {

      },

      on: {
        'click.login': {
          delegate: '.btn-login',
          fn: 'on:login'
        }
      }
    },

    props: {

    },

    fn: {

      init: function() {
        this.on(":user:token", this.fn.render);
        this.fn.render();
      },

      on: {
        login: function (e) {
          this.trigger(":login");
        }
      },

      render: function () {
        this.$el.html(this._.template(Template)({
          user: this.Props.data.user
        }));
        this.bind();
      }
    }
  });

});
