/*

  Default application template.

*/

define([
  "framework",
], function (MediumFramework) {

  return MediumFramework.Module.extend({

    name: "user",

    props: {
      clientID: "637625075890-br48hr4boqrgmqp0a2bcvs5o35llkn7j.apps.googleusercontent.com",
      scope: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/drive'
      ],
      url: {
        auth: "https://accounts.google.com/o/oauth2/v2/auth?prompt=<%= prompt %>&response_type=token&client_id=<%= id %>&scope=<%= scope %>&redirect_uri=<%= redirect %>",
        user: "api/auth/?access_token=<%= token %>",
      }
    },

    fn: {

      init: function() {
        this.on(":login", this.fn.login);

        // get auth-redirect or stored hash 
        var hash = location.hash || this.get(":storage:session:user");
        if(!hash) return;

        // hash (URL params) to object
        var response = JSON.parse('{' + hash.slice(1).split('&').map(function (val) {
          return val.replace(/^([^=]+)=(.+)/, '"$1":"$2"');
        }).join(",") + '}');

        // auth error
        if(response.error) {
          location.hash = "";
          console.warn(response);
          return alert(response.error);
        }

        // invalid response
        if(!response.access_token || !response.expires_in) return;

        // stored token
        this.props.expires = response.expires || Date.now() + (response.expires_in - 5*60)*1000;

        // token expired?
        if(this.fn.expired(true)) return;
        
        // if auth-redirect store token + expiry
        if(!response.expires) {
          location.hash = "";
          this.set(":storage:session:user", `${hash}&expires=${this.props.expires}`);
        }

        this.trigger(":loading");
        this.XHR.get({
          url: this.props.url.user,
          headers: {
            Authorization: `Bearer ${response.access_token}`
          },
          complete: this.fn.on.user
        });
      },

      expired: function (init) {
        clearTimeout(this.props.timeout);

        var remain = Math.max(0, this.props.expires - Date.now()),
            expired = !remain,
            s = (remain/1000|0),
            m = s/60|0;
        console.log(`Logout in: ${m}m ${s % 60}s`);

        if(expired) {
          /*this.props.warned = false;*/

          // remove the old hash
          this.fn.logout(false);

          // alert the user if a reload (hash must have been stored)
          if(init) alert("Your session has timed out");

          // if it's an active session ask if they want to auto refresh
          else this.fn.login(false);
        } else {
          /*if(!this.props.warned && remain < 1*60*1000) {
            this.props.warned = true;
            if(confirm("Your session will time out in 5 minutes. Click OK to refresh now or cancel to continue working")) {
              return this.fn.login(true);
            }
          }*/

          // check again in a minute
          this.props.timeout = setTimeout(this.fn.expired, 60*1000);
        }
        return expired;
      },

      on: {
        user: function (e) {
          if(e.error) {
            this.fn.logout(false);
            console.warn(e);
            return alert(e.status);
          }

          this.set(e, true);
          console.log(e);
        }
      },

      logout: function (reload) {
        this.trigger(":logout");
        if(reload!==false) {
          location.reload();
        }
      },

      login: function (prompt) {
        this.trigger(":router:href", "");
        if(!prompt && this.props.token) return this.fn.logout();

        location = this._.template(this.props.url.auth)({
          id: this.props.clientID,
          scope: encodeURIComponent(this.props.scope.join(" ")),
          redirect: encodeURIComponent(this.Props.props.router.base),

          // select account on initial login or after logout only
          prompt: prompt===false ? 'none' : 'select_account'
        });
      }
    }
  });

});
