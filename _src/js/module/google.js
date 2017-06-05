/*

  Default application template.

*/

define([
  "framework",
], function (MediumFramework) {

  return MediumFramework.Module.extend({

    name: "google",

    props: {
      url: {
        drive: "https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fvnd.google-apps.spreadsheet%27",
        spreadsheet: "https://sheets.googleapis.com/v4/spreadsheets/<%= id %>?includeGridData=false",
        sheetdata: "https://sheets.googleapis.com/v4/spreadsheets/<%= id %>/values/<%= sheet %>",
      }
    },

    fn: {

      init: function() {
        this.on(":user:token", this.fn.token);
        this.on(":drive:spreadsheet", this.fn.spreadsheet);
        this.on(":drive:sheet", this.fn.sheet);

        this.set("stored", this.get(":storage:local:google") || {});
      },

      on: {

        drive: function (drive) {
          this.props.dict = drive.files.reduce(function (dict, file) {
            dict[file.id] = file;
            return dict;
          }, {});
          this.set("drive", drive.files, true);

          this.fn.spreadsheet(this.props.stored.id);
        },

        spreadsheet: function (spreadsheet) {
          this.set("spreadsheet", spreadsheet);
          spreadsheet.name = this.props.dict[spreadsheet.spreadsheetId].name;
          this.fn.sheet(this.props.stored.sheet || 0);
        },

        sheetdata: function (data) {
          var sheetdata = this.fn.parse(data.values);
          if(!sheetdata) {
            alert("Spreadsheets should have at least a 'name' and 'phone' column heading");
            return this.trigger(":router:href", "drive");
          }

          this.set(":storage:local:google", {
            id: this.props.spreadsheet.spreadsheetId,
            sheet: this.props.sheet
          });
          this.set("sheetdata", sheetdata, true);
          this.trigger(':ready', true);
        },
      },

      token: function (token) {
        this.trigger(':ready');
        if(!token) return;
        this.fn.get('drive');
      },

      spreadsheet: function (id) {
        if(!id) return this.trigger(':ready', true);
        this.fn.get('spreadsheet', {
          id: id
        });
      },

      sheet: function (i) {
        this.props.sheet = i;
        this.fn.get('sheetdata', {
          id: this.props.spreadsheet.spreadsheetId,
          sheet: this.props.spreadsheet.sheets[i].properties.title
        });
      },

      parse: function (sheetdata) {
        var index = {};

        // find indexes: 'name' / 'phone' / 'mobile' 
        sheetdata[0].some(function (text, i) {
          if(text.match(/name/i)) index.name = index.name || +i + 1;
          if(text.match(/phone|mobile/i)) index.phone = index.phone || +i + 1;
          return index.name && index.phone;
        });

        // need at least a phone number
        if(!index.phone) return;

        // format rows
        sheetdata.slice(1).forEach(function (row) {

          // capitalise name
          var name = row[index.name - 1].replace(/^\s*(\S+).*$/, "$1").toLowerCase(),

          // format phone
          phone = row[index.phone - 1].replace(/\D/g, "").replace(/^([^0])/, "0$1");

          // if valid phone set data
          row.unshift(/^04\d{8}$/.test(phone) ? {
            name: name && name.length <= 10 ? name.slice(0, 1).toUpperCase() + name.slice(1) : '',
            phone: phone
          } : false);
        });

        return sheetdata;
      },

      get: function (type, attrs) {
        this.trigger(":loading");
        this.XHR.get({
          url: this._.template(this.props.url[ type ])(attrs),
          headers: {
            Authorization: `Bearer ${this.get(":user:token")}`
          },
          complete: this.fn.on[ type ]
        });
      }
    }
  });

});
