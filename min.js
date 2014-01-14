/**
 * The min plugin module is used with require js to extend its functionality
 * to support fallback loading of minimzed and non-minmized versions of the 
 * same resources. The plugin is designed to help speed up development in these
 * kinds of enviornments in that it will fall back to the non-minimzed version 
 * automatically if you have not defined any configuration or run your code
 * minimizer yet.
 * 
 * @module min
 * @example
 *
 * require(["min!app"], function(app) {
 *      // code
 * });
 *
 * Will load app.min.js if its available, or app.js if app.min.js fails to load.
 * 
 */

define({
    
    /**
     * Load the correct version of the library based on the configuration and the
     * fallback rules. Attempts to load the minimized verion of the library first
     * if the config.debug flag is not defined or is false. Loads the non-minimized
     * version of the library if either the config.debug is true or the minimized 
     * version of the libaray fails to load from the server.
     * @param  {String} name     Name of the module to attempt to load.
     * @param  {Function} req    Current require() reference for this request.
     * @param  {Function} onload Function callback to call on sucessfull load.
     * @param  {Object} config   Current require js configuration.
     *     @param  {Boolean} config.debug   If true, will load the non-minimized version, 
     *     otherwise will load the minimized verions of the resource. 
     */
    load: function (name, req, onload, config) {
        var minName = name;
        // Extent the name with the .min
        if (!config.debug) {
            minName += ".min";
        }

        req([minName], onload, function (err) {
            // Handle gracefule fallback to the unminified version
            var failedId = err.requireModules && err.requireModules[0];
            if (failedId) {
                requirejs.undef(failedId);
                // fall back to the non-minififed version
                req([name], onload, function(err) {
                    // Handle gracefule fallback to the unminified version
                    var failedId = err.requireModules && err.requireModules[0];
                    if (failedId) {
                        requirejs.undef(failedId);
                    }
                    console.log ("Could not load either " + minName + " or " + name + " dependenices.");
                });
            }
        });
    }
});
