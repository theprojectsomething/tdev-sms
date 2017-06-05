/*

  Application Router

*/

define([
  "framework",
], function (MediumFramework) {
  return MediumFramework.Router.extend({

    name: 'router',

    props: {
      routes: {
        'home': {
          route: '',
          // title: 'HOME'
        },
        'compose': {
          route: 'compose',
          // title: 'COMPOSE'
        },
        'drive': {
          route: 'drive',
          // title: 'DRIVE'
        },
        'list': {
          route: 'list',
          // title: 'LIST'
        },
        'missing': '*missing'
      }
    },

    fn: {
      init: function () {
        this.on(":ready", this.fn.on.ready);
        this.on(":router:before", this.fn.on.before);
        this.start();
      },

      on: {
        ready: function (ready) {
          this.trigger("href", ready ? "compose" : "");
        },

        before: function () {
          $('body').attr('data-route-prev', this.props.current ? this.props.current.name : "");
        }
      }
    }
  });

});
