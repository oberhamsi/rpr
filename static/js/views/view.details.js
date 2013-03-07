define([
    "underscore",
    "backbone",
    "swig"
], function(_, Backbone, swig) {

    var githubRegex = [
        /http(s):\/\/github\.com\/([a-z0-9A-z_]+)\/([a-z0-9A-z_-]+)\.git/,
        /git@github\.com:([a-z0-9A-z_]+)\/([a-z0-9A-z_-]+)\.git/,
        /git:\/\/github\.com\/([a-z0-9A-z_]+)\/([a-z0-9A-z_-]+)\.git/
    ];

    // if repoUrl is a valid github url
    // this will load it's preferred README as html into $container
    var loadGithubReadme = function(repoUrl, $container) {
        var match = null;
        console.log(repoUrl)
        // just try all regex and see if one fits
        _.some(githubRegex, function(re) {
            match = re.exec(repoUrl);
            console.log('got match', match)
            return match;
        });
        if (!match) {
            return;
        }
        $.ajax({
            headers: {
                Accept: "application/vnd.github.v3.html+json"
            },
            url: "https://api.github.com/repos/" + match[2] + "/" + match[3] + "/readme"
        }).done(function(data) {
            console.log('got data! putting it into', $container)
            $container.html(data);
        });
    }

    var DetailsView = Backbone.View.extend({
        "tagName": "div",
        "className": "details",
        "template": swig.compile(document.getElementById("tmpl-details").innerHTML),
        "render": function() {
            var ctx = this.model.toJSON();
            if (ctx.engines != null) {
                ctx.ringoVersion = ctx.engines.ringojs;
            }
            this.$el.html(this.template(ctx));
            loadGithubReadme(ctx.repositories[0].url, this.$el.children('.repo-readme'));
            return this;
        }
    });

    DetailsView.prototype.close = function(animate) {
        if (animate === true) {
            this.$el.slideUp("fast", _.bind(function() {
                this.remove();
            }, this));
        } else {
            this.remove();
        }
    };

    return DetailsView;

});