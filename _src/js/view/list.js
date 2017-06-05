/*

  Default application template.

*/

define([
  "framework",
  "text!template/list.html",
], function (MediumFramework, Template) {

  return MediumFramework.View.extend({

    name: "list",

    el: {
      selector: ".stage-list",

      bind: {
        "$el:filter": ".stage-list .filter",
        "$el:list": "[data-row]:not(:first-child)",
        "$el:items": ".checkbox-row",
      },

      on: {
        'input.filter': {
          delegate: ".filter",
          fn: "on:filter"
        },

        'change.toggle': {
          delegate: '.checkbox-toggle',
          fn: "on:toggle",
        },

        'change.row': {
          delegate: '.checkbox-row',
          fn: "on:select"
        },

        'change.hidden': {
          delegate: 'input[data-column]',
          fn: "on:hidden"
        }
      }
    },

    props: {
      hidden: {}
    },

    fn: {

      init: function() {
        this.on(":google:sheetdata", this.fn.render);
        // this.on(":drive:spreadsheet", this.fn.on.spreadsheet);
        // this.on(":auth:sheetdata", this.fn.on.data);

        this.props.hidden = this.get(":storage:local:list:hidden") || {};
      },

      on: {
        filter: function () {
          var filter = this.props.$el.filter.eq(0).value.toLowerCase().replace(/,/g, ' '),
          terms = filter.split(/\s+/);

          this.props.$el.list.forEach(function ($el, i) {
            var show = !filter || terms.find(function (term) {
              return term && $el.dataset.text.indexOf(term) >= 0;
            });
            $el.style.display = show ? '' : 'none';
            return show;
          });

          this.fn.selected();
        },

        toggle: function (e) {
          var checked = e.target.checked;
          this.props.$el.items.forEach(function ($el) {
            $el.checked = checked;
            $el.closest('[data-row]').dataset.status = checked ? 'active' : '';
          });
          this.fn.selected();
        },

        select: function (e) {
          var $el = e.target.closest('[data-row]');
          $el.dataset.status = e.target.checked ? 'active' : '';
          this.fn.selected();
        },

        hidden: function (e) {
          this.props.hidden[e.target.dataset.name] = !e.target.checked;
          this.set(":storage:local:list:hidden", this.props.hidden);
        }
      },

      selected: function () {
        var selected = {
          filter: this.props.$el.filter.eq(0).value,
          active: []
        },
        numbers = [];
        selected.all = this.$el.find('[data-status="active"]').map(function ($el) {
          if(!$el.matches('[style*="display: none;"]') && numbers.indexOf($el.dataset.phone)<0) {
            numbers.push($el.dataset.phone);
            selected.active.push($el);
          }
          return +$el.dataset.row;
        });

        this.set(":storage:session:list:selected", {
          list: selected.all,
          filter: selected.filter
        });
        this.set("selected", selected, true);
      },

      render: function (sheetdata) {
        var selected = this.get(":storage:session:list:selected");

        this.$el.html(this._.template(Template)({
          spreadsheet: this.get(":google:spreadsheet"),
          rows: sheetdata,
          hidden: this.props.hidden,
          selected: selected || {},
        }));
        
        this.bind();
        if(selected) this.fn.on.filter();
      }
    }
  });

});
