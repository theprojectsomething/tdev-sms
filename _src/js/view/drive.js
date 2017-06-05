/*

  Default application template.

*/

define([
  "framework",
  "text!template/drive.html",
], function (MediumFramework, DriveTemplate) {

  return MediumFramework.View.extend({

    name: "drive",

    el: {
      selector: ".stage-drive",

      bind: {
        "$el:filter": ".filter",
        "$el:list": ".list li",
      },

      on: {
        'input.filter': {
          delegate: ".filter",
          fn: "on:filter"
        },

        'click.select': {
          delegate: '.file-select',
          fn: "on:select"
        }
      }
    },

    props: {

    },

    fn: {

      init: function() {
        this.on(":google:drive", this.fn.render);
      },

      on: {
        filter: function () {
          var filter = this.props.$el.filter.eq(0).value.toLowerCase();
          this.props.$el.list.forEach(function ($el) {
            $el.style.display = filter && $el.dataset.name.indexOf(filter) < 0 ? 'none' : '';
          });
        },

        select: function (e) {
          this.trigger("spreadsheet", e.target.dataset.id);
        }
      },

      render: function (files) {
        this.$el.html(this._.template(DriveTemplate)({
          files: files
        }));
        this.bind();
      }
    }
  });

});
