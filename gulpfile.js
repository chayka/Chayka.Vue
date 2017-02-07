require('laravel-elixir-vue-2');
var elixir = require('laravel-elixir');

elixir.config.sourcemaps = false;
elixir.config.assetsPath = 'src';

elixir(function(mix) {
    //The demo js file.
    mix.webpack('./src/index.js', 'dist/index.js')

    //Exposing the component files to the dist folder.
    .copy('src/Components/\**.*', 'dist/Components')
});