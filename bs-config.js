module.exports = {
    ui: false,
    notify: false,
    open: false,
    port: 3000,
    files: [
        "*.html",
        "css/**/*.css",
        "js/**/*.js",
        "assets/**",
        "vendor/**",
        "partials/**"
    ],
    ignore: ["node_modules"],
    server: {
        baseDir: ".",
        serveStaticOptions: {
            extensions: ["html"]
        }
    }
};
