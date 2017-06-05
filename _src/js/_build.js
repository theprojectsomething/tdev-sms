/*

  https://github.com/jrburke/r.js/blob/master/build/example.build.js

  Run with command: r.js -o build.js
  Requires:
   - nodejs : http://nodejs.org
   - r.js : npm install -g requirejs

*/

({
  //By default all the configuration for optimization happens from the command
  //line or by properties in the config file, and configuration that was
  //passed to requirejs as part of the app's runtime "main" JS file is *not*
  //considered. However, if you prefer the "main" JS file configuration
  //to be read for the build so that you do not have to duplicate the values
  //in a separate configuration, set this property to the location of that
  //main JS file. The first requirejs({}), require({}), requirejs.config({}),
  //or require.config({}) call found in that file will be used.
  //As of 2.1.10, mainConfigFile can be an array of values, with the last
  //value's config take precedence over previous values in the array.
  mainConfigFile: '_require.js',


  //How to optimize all the JS files in the build output directory.
  //Right now only the following values
  //are supported:
  //- "uglify": (default) uses UglifyJS to minify the code.
  //- "uglify2": in version 2.1.2+. Uses UglifyJS2.
  //- "closure": uses Google's Closure Compiler in simple optimization
  //mode to minify the code. Only available if running the optimizer using
  //Java.
  //- "closure.keepLines": Same as closure option, but keeps line returns
  //in the minified files.
  //- "none": no minification will be done.
  optimize: 'uglify2',
  // optimize: 'none',

  // Source maps will not work with anything but @license
  // ie. other license comments must not be preserved
  // see # https://developers.google.com/closure/compiler/docs/js-for-compiler#tag-license
  // generateSourceMaps: true,
  // preserveLicenseComments: false,


  //If you only intend to optimize a module (and its dependencies), with
  //a single file as the output, you can specify the module options inline,
  //instead of using the 'modules' section above. 'exclude',
  //'excludeShallow', 'include' and 'insertRequire' are all allowed as siblings
  //to name. The name of the optimized file is specified by 'out'.
  name: 'vendor/require/almond.js',
  // name: 'vendor/require/require-2.1.10.min.js',
  include: ['_require'],
  insertRequire: ['_require'],
  out: '../../assets/js/script.min.js',


  //Another way to use wrap, but uses default wrapping of:
  //(function() { + content + }());
  wrap: true
})
