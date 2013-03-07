define([
    "underscore",
    "backbone",
    "swig",
    "md5"
], function(_, Backbone, swig, md5) {

    var UNITS = ["bytes", "kB", "MB", "GB", "TB"];

    swig.init({
        "filters": {
            "filesize": function(bytes) {
                if (bytes > 0) {
                    var e = Math.floor(Math.log(bytes) / Math.log(1024));
                    return [(bytes / Math.pow(1024, e)).toFixed(1), UNITS[e]].join(" ");
                }
                return [bytes, UNITS[0]].join(" ");
            },
            "gravatar": function(email) {
                if (!email) return "";
                var emailHash = md5(email.replace(/\s/g, '').toLowerCase());
                return "http://www.gravatar.com/avatar/" + emailHash + "?s=24&d=retro";
            }
        }
    });

    var app = window.app = _.extend({
        "views": {}
    }, Backbone.Events);

    return app;

});