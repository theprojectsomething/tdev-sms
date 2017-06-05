/*

  Default application template.

*/

define([
  "framework",
], function (MediumFramework) {

  return MediumFramework.Module.extend({

    name: "send",

    props: {
      delay: 1000,
      queue: false,
    },

    fn: {

      init: function() {
        this.on(":compose:send", this.fn.parse);
        this.on(":compose:cancel", this.fn.cancel);
      },

      on: {
        sent: function () {
          this.props.sending = false;
          this.trigger("sent", this.props.recipient);
          setTimeout(this.fn.process, this.props.delay); 
        }
      },

      cancel: function () {
        this.props.queue = [];
      },

      parse: function (msg, recipients) {

        var queue = this.props.queueID = Date.now();

        if( !confirm(`Send to ${recipients.length} recipients?`) ) return;

        this.props.queue = (recipients || []).map(function (recipient, i) {
          var details = {
            queue: queue,
            i: i,
            total: recipients.length,
            name: recipient.name,
            phone: recipient.phone,
            msg: msg.replace(/(\s?){([^}]+)}/g, function (match, pre, key) {
              key = key.toLowerCase();
              return recipient[key] ? pre + recipient[key] : "";
            })
          };
          return details;
        });

        this.fn.process();
      },

      process: function () {
        if(this.props.sending) return;
        if(this.props.queue.length) {
          var recipient = this.props.queue.shift();
          this.fn.send(recipient);
        } else {
          this.trigger("complete", {
            complete: true,
            i: this.props.recipient.i,
            total: this.props.recipient.total
          });
          this.set("recipient", false, false);
        }
      },

      send: function (recipient) {
        if(!recipient || this.props.queueID!==recipient.queue) return;
        this.props.sending = true;

        this.set("recipient", recipient, true);

        console.log("SENDING", recipient.name, recipient.phone, recipient.msg);

        this.XHR.post({
          url: "http://theprojectsomething.com/tdev/api/",
          url: "https://api.telstra.com/v1/sms/messages",
          url: "api/mirror.php",
          headers: {
            'Authorization': `Bearer ${this.get(":user:telstra").access_token}`
          },
          data: {
            to: recipient.phone,
            body: recipient.msg
          },
          error: this.fn.on.sent,
          complete: this.fn.on.sent
        });

      }
    }
  });

});
