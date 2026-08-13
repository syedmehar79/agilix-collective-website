module.exports = {
    ui: false,
    notify: false,
    open: false,
    port: 3000,
    files: [
        "*.html",
        "agilix-collective/**/*.html",
        "agilix-collective/**/*.css",
        "agilix-collective/**/*.js",
        "agilix-collective/assets/**"
    ],
    ignore: ["node_modules"],
    server: {
        baseDir: ".",
        serveStaticOptions: {
            extensions: ["html"]
        }
    }
};
