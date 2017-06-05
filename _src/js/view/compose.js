/*

  Default application template.

*/

define([
  "framework",
  "text!template/compose.html",
], function (MediumFramework, Template) {

  return MediumFramework.View.extend({

    name: "compose",

    el: {
      selector: ".stage-compose",

      bind: {
        "$el:remain": ".remain",
        "$el:msg": "#msg",
      },

      on: {
        'input.msg': {
          delegate: "#msg",
          fn: "on:msg",
        },

        'click.send': {
          delegate: '.send',
          fn: 'on:send'
        },

        'click.cancel': {
          delegate: '.cancel',
          fn: 'on:cancel'
        }
      }
    },

    props: {

    },

    fn: {

      init: function() {
        // this.on(":list:selected", this.fn.render);
        this.on(":list:selected :send:recipient :send:complete", this.fn.render);
        // this.on(":send:complete", this.fn.complete);
        // this.fn.render();
        this.autoBind();
      },

      on: {
        cancel: function () {
          this.trigger("cancel");
        },

        msg: function (e) {
          var msg = this.props.$el.msg.eq(0).value,
          remain = 160 - msg.replace(/%NAME%/g, "XXXXXXXXXX").length;

          this.props.msg = msg;

          this.set(":storage:local:msg", msg);
          this.props.$el.remain.text(`${remain} remain`).eq(0).dataset.remain = remain;
        },

        send: function () {
          this.trigger("send", this.props.$el.msg.eq(0).value, this.props.recipients);
        }
      },

      render: function (recipient) {
        if(this.get(":router:current:href")!==this.name) return;

        var msg = this.get(":storage:local:msg");

        this.props.recipients = (this.get(":list:selected:active") || []).map(function (recipient) {
          return recipient.dataset;
        });

        this.$el.html(this._.template(Template)({
          sending: recipient,
          msg: msg,
          recipients: this.props.recipients
        }));
        this.bind();
      }
    }
  });

});
