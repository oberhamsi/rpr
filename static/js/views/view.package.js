define([
    "underscore",
    "backbone",
    "app",
    "swig",
    "md5",
    "views/view.details",
    "views/view.versions"
], function(_, Backbone, app, swig, md5, DetailsView, VersionsView) {

    var emailToGravatar = function(email) {
        if (!email) return null;
        var emailHash = md5(email.replace(/\s/g, '').toLowerCase());
        return "http://www.gravatar.com/avatar/" + emailHash + "?s=24";

    }

    var PackageView = Backbone.View.extend({
        "tagName": "li",
        "template": swig.compile(document.getElementById("tmpl-package").innerHTML),
        "events": {
            "click h2 a": function(event) {
                app.router.navigate($(event.target).attr("href"), true);
                return false;
            },
            "click": "toggle"
        }
    });

    PackageView.prototype.render = function() {
        var ctx = this.model.toJSON();
        // merge author into maintainers
        ctx.maintainers.push(ctx.author);
        _.each(ctx.maintainers, function(m) {
            m.gravatar = emailToGravatar(m.email);
        });
        this.$el.append(this.template(ctx));
        return this;
    };

    PackageView.prototype.toggle = function(event) {
        if ($(event.target).is("a")) {
            return;
        }
        if (this.current != null) {
            this.toggleTab(this.current.constructor);
        } else {
            this.toggleTab(DetailsView);
        }
    };

    PackageView.prototype.toggleDetails = function(event) {
        event.stopImmediatePropagation();
        this.toggleTab(DetailsView);
    };

    PackageView.prototype.toggleVersions = function(event) {
        event.stopImmediatePropagation();
        this.toggleTab(VersionsView);
    };

    PackageView.prototype.toggleTab = function(View) {
        if (this.current != null) {
            if (this.current instanceof View) {
                this.current.close(true);
                this.current = null;
                return;
            } else {
                this.current.close();
            }
        }
        var view = new View({
            "model": this.model
        });
        var $tab = this.$(".tab").html(view.render().el).hide();
        if (this.current == null) {
            $tab.slideDown("fast");
        } else {
            $tab.show();
        }
        this.current = view;
    };

    return PackageView;

});