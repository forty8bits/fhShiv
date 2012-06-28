/**
 * @version 0.0.1
 *
 * @fileOverview A 'shiv' for the various FeedHenry APIs, to facilitate a much better local
 * development workflow.
 *
 * @author Gareth Murphy (gareth.cpm@gmail.com)
 */

var $fh = {

  /**
   * Implementation of the $fh.data() method, which gets, sets or deletes simple key/value data to
   * localStorage in the browser.
   *
   * @param {Object} config An object containing the key (required), as well as the act and val
   * parameters when relevant.
   * @param {Function} successCb Callback to be called on success and given a res object upon a get.
   * @param {Function} failCb Callback to be called on failure for some reason. Note however, that
   * because of how localStorage works, in cases where you requested a key which isn't present, a
   * null value is returned as a success rather than being counted as a failure!
   *
   * @throws {Error} Blows up upon a lack of sufficient arguments, a missing key or a bad act type.
   */
  data: function (config, successCb, failCb) {
    // If we're not given the callbacks, blow up.
    if (arguments.length < 3) {
      throw new Error("You need to provide the required arguments!");
    }
    // Fail if no localStorage available.
    if (!localStorage) {
      return failCb("localStorage not supported!");
    }

    /**
     * Helper function which parses the given config object, throwing errors where necessary and
     * providing default values.
     *
     * @param {Object} userConfig The standard config object as defined in the FeedHenry docs.
     *
     * @return {Object} The processed config object, ready for use.
     *
     * @throws {Error} When a mandatory parameter or invalid value are provided.
     */
    function buildConfig(userConfig) {
      var newConfig = {};

      // Check the only mandatory config.
      if (!userConfig.key) {
        throw new Error("Missing key; Make sure you include the appropriate config!");
      }
      newConfig.key = userConfig.key;

      if (userConfig.act) {
        if (userConfig.act !== 'load' &&
          userConfig.act !== 'save' &&
          userConfig.act !== 'remove') {
          throw new Error("Invalid act value; must be either 'load', 'save' or 'remove'!");
        }
        newConfig.act = userConfig.act;
      } else {
        newConfig.act = "load";
      }

      if (userConfig.act === "save") {
        newConfig.val = "" || userConfig.val;
      }

      return newConfig;
    }

    function buildRes(key, val) {
      return {
        key:key,
        val:val
      };
    }

    config = buildConfig(config);

    switch (config.act) {
      case "load":
        successCb(buildRes(config.key, localStorage.getItem(config.key)));
        break;
      case "save":
        localStorage.setItem(config.key, config.val);
        successCb(); // 'res' being undefined here, in accordance with actual behaviour.
        break;
      case "remove":
        localStorage.removeItem(config.key);
        successCb(); // TODO: Check if this actually returns undefined 'res'.
        break;
    }
  }
};
