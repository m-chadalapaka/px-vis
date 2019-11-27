/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import './px-vis-polyfills.js';

import './px-vis-behavior-colors.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
var PxVisBehavior = window.PxVisBehavior = (window.PxVisBehavior || {});

/**
    Name:
    PxVisBehavior.observerCheck

    Description:
    Polymer behavior that provides a function used to check if any argument
    in an observer is undefined


    @polymerBehavior PxVisBehavior.observerCheck
*/
PxVisBehavior.observerCheck = {
  hasUndefinedArguments: function(args) {
    for(var i=0; i<args.length; i++) {

      //check if arg is undefined or if it's a 'var.*' undefined type of arg
      if(args[i] === undefined || (args[i] && args[i].path && args[i].hasOwnProperty('base') && args[i].base === undefined)) {
        return true;
      }
    }
    return false;
  }
};

/*
    Name:
    PxVisBehavior.baseSize

    Description:
    Polymer behavior that provides height and width

    @polymerBehavior PxVisBehavior.baseSize
*/
PxVisBehavior.baseSize = {

  properties: {
    /**
    * The width of the elem; generally the width of the charting area for most components
    *
    */
    width: {
      type: Number,
      notify: true
    },

    /**
    * The height of the component; generally the height of the charting area for most components.
    *
    */
    height: {
      type: Number,
      notify: true
    }
  }
};

/*
    Name:
    PxVisBehavior.margins

    Description:
    Polymer behavior that provides margin definitions

    @polymerBehavior PxVisBehavior.margins
*/
PxVisBehavior.margins = {

  properties: {
    /**
    * Copy of the default margin for checking if it has changed
    *
    */
    _defaultMargin:{
      type:Object,
      value: function() {
        return {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        };
      }
    },
    /**
    * Defines the base margin for the chart. Calcs are run to add to the margin to accommodate axes and other elements which exist within the SVG frame, but outside the chart frame.
    *
    */
    margin:{
      type:Object,
      value: function() {
        return {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        };
      }
    }
  }
};

/*
    Name:
    PxVisBehavior.sizing

    Description:
    Polymer behavior that provides the basic sizing properties for px-vis components.

    Dependencies:
    - none

    @polymerBehavior PxVisBehavior.sizing
*/
PxVisBehavior.sizing = [{
  properties: {
    /**
     * An optional offset for a variety of elements
     *
     *
     */
    offset: {
      type: Array,
      value: function() {
        return [0,0];
      }
    }
  }
}, PxVisBehavior.baseSize, PxVisBehavior.margins];

/*
    Name:
    PxVisBehavior.truncating

    Description:
    Polymer behavior that provides the string truncation method

    @polymerBehavior PxVisBehavior.truncating
*/
PxVisBehavior.truncating = {
  properties: {
    /**
     * Defines if the label should get truncated and to how many characters.
     *
     * Default length is 10 characters, not including the ellipsis which gets inserted.
     *
     * The length must be at least 2.
     *
     * To disable truncation, set the value to -1
     *
     * @property truncationLength
     * @type Number
     * @default 10
    */
    truncationLength: {
      type: Number,
      value: 10
    },
  },
  /**
   * _truncateName takes a string and string length [optional].
   * Returns a truncated string with the middle replaced by an ellipsis. The ellipsis does not count towards the total character count.
   * Follows these truncation principles: http://www.gesdh.com/predix/product/principles/truncation/
   * Example: LNG_BAH_HOT_EFFECTIVENESS_CORE8 --> LNG_B...CORE8
   *
   * Length cannot be less than 2 characters.
   * Default length is 10 characters.
   *
   * If the string is less than or equal to the length or the length is invalid, returns the original string.
   *
   * @param {String} name, {Integer} len
   * @return {String} truncatedString
  */
  _truncateName:function(name,len) {
    var len = len || this.truncationLength;

    // make sure length is legit
    if(len < 2) {
      return name;
    }

    //check that name is greater than length; if not, return it
    if(name.length <= len) {
      return name;
    }

    // truncate
    var frontLen = Math.ceil(len / 2),
        backLen = Math.floor(len / 2),
        front = name.slice(0,frontLen),
        back = name.slice(-backLen);

    return front + '...' + back;
  }
};

/*
    Name:
    PxVisBehavior.formatting

    Description:
    Polymer behavior that provides the string and number formating options and methods. Includes name truncation and numbro-element number formating options.

    Dependencies:
    - numbro-element components

    @polymerBehavior PxVisBehavior.formatting
*/
PxVisBehavior.formatting = [{
  properties: {
    /**
     * Defines how a display number should be formatted:
     * Provide localization for currency formatting
     *
     * For valid formats and features, see: http://numbrojs.com/languages.html
     * For docs on the component, see: https://www.predix-ui.com/#/components/px-number-formatter/
     *
     * @property numberFormatCulture
     * @type String
     * @default 'en-US'
     */
    numberFormatCulture: {
      type:String
    },
    /**
     * Defines how a display number should be formatted:
     * Specify whether the value should be formatted as a currency
     *
     * For valid formats and features, see: http://numbrojs.com/format.html
     * For docs on the component, see: https://www.predix-ui.com/#/components/px-number-formatter/
     *
     * @property numberFormatIsCurrency
     * @type Boolean
     * @default false
     */
    numberFormatIsCurrency: {
      type :Boolean,
      value: false
    },
    /**
     * Defines how a display number should be formatted:
     * Provide a new default format for currency
     *
     * For valid formats and features, see: http://numbrojs.com/format.html
     * For docs on the component, see: https://www.predix-ui.com/#/components/px-number-formatter/
     *
     * @property numberFormatCurrency
     * @type String
     * @default '$0,0.00'
     */
    numberFormatCurrency: {
      type: String,
      value:'$0,0.00'
    },
    /**
     * Defines how a display number should be formatted:
     * Provides a new default format
     *
     * For valid formats and features, see: http://numbrojs.com/format.html
     * For docs on the component, see: https://www.predix-ui.com/#/components/px-number-formatter/
     *
     * @property numberFormatDefault
     * @type String
     * @default '0,0.0000'
     */
    numberFormatDefault: {
      type: String,
      value: '0,0.0000'
    },
    /**
     * Defines how a display number should be formatted:
     * The format used to generate the output
     *
     * For valid formats and features, see: http://numbrojs.com/format.html
     * For docs on the component, see: https://www.predix-ui.com/#/components/px-number-formatter/
     *
     * @property numberFormat
     * @type String
     * @default '0,0.00'
     */
    numberFormat: {
      type: String,
      value: '0,0.00'
    },
    /**
     * Defines how a display number should be converted back to a Number:
     * A formatted String to extract a value from
     *
     * For valid formats and features, see: http://numbrojs.com/format.html#unformat
     * For docs on the component, see: https://www.predix-ui.com/#/components/px-number-formatter/
     *
     * @property numberFormatUnformat
     * @type String
     * @default '0,0.0000'
     */
    numberFormatUnformat: {
      type: String,
      value: '0,0.0000'
    },
    /**
     * Defines how to display 0 values
     *
     * For valid formats and features, see: http://numbrojs.com/format.html
     * For docs on the component, see: https://www.predix-ui.com/#/components/px-number-formatter/
     *
     * @property numberFormatZero
     * @type String
     * @default ''
     */
    numberFormatZero: {
      type: String,
      value:'0'
    }
  }
}, PxVisBehavior.truncating];

/*
  Name:
  PxVisBehavior.dataChecks

  Description:
  Polymer behavior that provides the data checkting methods

  Dependencies:
  - D3.js

  @polymerBehavior PxVisBehavior.dataChecks
*/
PxVisBehavior.dataChecks = {
  /**
   * returns true if the data is valid: non NaN, null or undefined
   */
    _isValidData: function(d) {
    //false and "" will return false, which is fine as they're not valid data
    return d || d === 0;
  },

  /**
   * returns true if the data is not null
   */
  _isDataNotNull: function(d) {
    //false and "" will return false, which is fine as they're not valid data
    return d !== null;
  }
};

/*
    Name:
    PxVisBehavior.dataset

    Description:
    Polymer behavior that provides the data object for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.dataset
*/
PxVisBehavior.dataset = [{
    properties: {
      /**
       * container for the data object that drives the chart / component
       * Generally loaded with an iron-ajax tag (but doesnt have to be)
       * This can be set declaratively
       *
       * @property chartData
       * @type Object
       */
      chartData:{
        type: Array
      }
    }
}, PxVisBehavior.dataChecks];

/*
    Name:
    PxVisBehavior.completeSeriesConfig

    Description:
    Polymer behavior that provides a computed series configuration object to components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.completeSeriesConfig
*/
PxVisBehavior.completeSeriesConfig = {
    properties: {
      /**
       * A configuration file generated by the chart behavior based on seriesConfig and defaultSeriesConfig.
       *
       */
       completeSeriesConfig: {
         type: Object,
         notify: true
       }
    }
};

/*
    Name:
    PxVisBehavior.combinedMutedSeries

    Description:
    Polymer behavior that provides the combinedMutedSeries property px-vis components.

    Dependencies:
    -

    @polymerBehavior PxVisBehavior.combinedMutedSeries
*/
PxVisBehavior.combinedMutedSeries = {
  properties: {
    /**
     * Aimed at regrouping all muted series when different behavior can mute
     * series (multi series for example: brush + navigator + categories)
     */
    combinedMutedSeries:{
      type:Object,
      notify: true,
      value:function(){ return {}; },
    }
  }
};

/*
    Name:
    PxVisBehavior.mutedSeries

    Description:
    Polymer behavior that provides the mutedSeries property px-vis components.

    Dependencies:
    -

    @polymerBehavior PxVisBehavior.mutedSeries
*/
PxVisBehavior.mutedSeries = [{
  properties: {
    /**
     * A list of user selected muted series. Tied declaratively to series components
     *
     * The series name is the key and the value is a boolean for whether it is muted or not:
     *
     *```
     * {
     *     'seriesId1':true,
     *     'seriesId2':false,
     *  }
     *```
     *
     * In this example, seriesId1 is muted. seriesId2 was muted, but has been turned back on.
     *
     */
    mutedSeries:{
      type:Object,
      notify: true,
      value:function(){ return {}; },
    },
    /**
     * Allows for a "hard" muting of the series/categories: the
     * series/category won't show up
     * in the tooltip anymore, it's tooltip data won't be shown in the register
     * and its extents won't be taken into account by the chart
     */
     hardMute: {
      type: Boolean,
      value: false
    }
  }
}, PxVisBehavior.completeSeriesConfig];

/*
    Name:
    PxVisBehavior.seriesKeys

    Description:
    Polymer behavior that provides the seriesKeys definition

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.seriesKeys
*/
PxVisBehavior.seriesKeys = {
  properties: {
    /**
     *  Representes the keys avaiable in completeSeriesConfig.
     */
    seriesKeys: {
      type: Array,
      value: function() {
        return [];
      }
    }
  }
};

/*
    Name:
    PxVisBehavior.mutedCompleteSeriesConfig

    Description:
    Polymer behavior that provides the _mutedCompleteSeriesConfig property

    Dependencies:
    -

    @polymerBehavior PxVisBehavior.mutedCompleteSeriesConfig
*/
PxVisBehavior.mutedCompleteSeriesConfig = [{
  properties: {
    _mutedCompleteSeriesConfig: {
      type: Object,
      computed: '_computeMutedCompleteSeriesConfig(completeSeriesConfig, hardMute, mutedSeries.*)'
    },
    _nonMutedSeriesKeys: {
      type: Array,
      computed: '_computeNonMutedSeriesKeys(_mutedCompleteSeriesConfig,seriesKeys)'
    }
  },

  _computeNonMutedSeriesKeys: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(!(this._mutedCompleteSeriesConfig === undefined || this.seriesKeys === undefined)) {

      var keys = Object.keys(this._mutedCompleteSeriesConfig);

      //ensure all keys exists in case we deleted some but haven't updated
      //the completeSeriesConfig yet
      return keys.filter(function(key) {
        return this.seriesKeys.indexOf(key) !== -1;
      }.bind(this));
    }
  },

  _computeMutedCompleteSeriesConfig: function(completeSeriesConfig, hardMute, mutedSeries) {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(!(this.completeSeriesConfig === undefined || this.hardMute === undefined || this.mutedSeries === undefined)) {
      if(!this.hardMute) {
        return this.completeSeriesConfig;
      } else {

        //create a new conf without the muted series
        var newConf = {},
            keys = Object.keys(this.completeSeriesConfig);

        for(var i=0; i<keys.length; i++) {
          if(!this.mutedSeries[keys[i]]) {
            newConf[keys[i]] = this.completeSeriesConfig[[keys[i]]];
          }
        }
        return newConf;
      }
    }
  },
}, PxVisBehavior.observerCheck, PxVisBehavior.completeSeriesConfig, PxVisBehavior.mutedSeries, PxVisBehavior.seriesKeys];


/*
    Name:
    PxVisBehavior.muteUnmuteSeries

    Description:
    Polymer behavior that provides the mutedSeries property and methods to mute/unmute series for px-vis components.

    Dependencies:
    -

    @polymerBehavior PxVisBehavior.muteUnmuteSeries
*/
PxVisBehavior.muteUnmuteSeries = [{
  properties: {},

  /**
   * Method to mute or umute
   *
   */
  muteUnmuteSeries: function(series, fromRegister) {
    //TODO Polymer 2.0: fix this
    // make sure we are not dealing with APM's IDs
    if(series.indexOf('.') === -1) {
      // if it doesnt exist, let's add it and set to true
      if( typeof(this.mutedSeries[series]) === 'undefined' ) {
        this.set('mutedSeries.' + series, true);
      } else {
        //if does exist, flip the bit
        this.set('mutedSeries.' + series, !this.mutedSeries[series]);
      }
    } else {
      var muted = this.mutedSeries;
      this.mutedSeries = [];
      muted[series] = typeof(muted[series]) === 'undefined' ? true : !muted[series];
      this.set('mutedSeries', muted);
    }

    this.fire('px-vis-muted-series-updated', { 'name': series, 'value': this.mutedSeries[series], 'fromRegister': fromRegister});
  }
}, PxVisBehavior.mutedSeries];

/*
    Name:
    PxVisBehavior.tooltipData

    Description:
    Polymer behavior that provides the tooltipData property px-vis components.

    Dependencies:
    -

    @polymerBehavior PxVisBehavior.tooltipData
*/
PxVisBehavior.tooltipData = {
  properties: {
    /**
     * Data reported back by the interaction space component. Displays the series name, values, and timestamp in the register. tooltipData is in the form:
     *
     *```
     *    {
     *        "time": "2015-03-25T20:34:47.085Z",
     *        "hidden": false,
     *        "series":[{
     *            "name":"seriesId1",
     *            "coord":[xCoord1, yCoord1],  //in pixel space
     *            "value":{
     *                "x":xVal1,             //in data space
     *                "seriesId1":yVal1    //in data space
     *            }
     *        },{
     *            "name":"seriesId2",
     *            "coord":[xCoord2, yCoord2],  //in pixel space
     *            "value":{
     *                "x":xVal2,             //in data space
     *                "seriesId2":yVal2    //in data space
     *            },
     *        }],
     *        "mouse":[ mouseX, mouseY ],   //in pixel space
     *        "xArr":[xCoord1 , xCoord2],   //in pixel space
     *        "yArr":[yCoord1 , yCoord2],   //in pixel space
     *    }
     *```
     *
     * When not hovering on a chart, the tooltipData should still have the series names in order for them to still appear in the register. IE:
     *
     *```
     *    {
     *        "time": null,
     *        "hidden": true,
     *        "series":[{
     *            "name":"seriesId1",
     *            "value": null
     *        },{
     *            "name":"seriesName1",
     *            "value": null
     *        }],
     *        "mouse": null,
     *        "xArr": null,
     *        "yArr": null
     *    }
     *```
     *
     * @property tooltipData
     * @type Object
     */
    tooltipData:{
      type:Object,
      notify:true
    },

    /**
     * The "empty" dataset that should be used for tooltipData when not hovering
     */
    defaultEmptyData: {
      type: Object,
      value: null,
      notify:true
    }
  }
};

/*
    Name:
    PxVisBehavior.crosshairData

    Description:
    Polymer behavior that provides the crosshairData property px-vis components.

    Dependencies:
    -

    @polymerBehavior PxVisBehavior.crosshairData
*/
PxVisBehavior.crosshairData = {
  properties: {
    /**
     * Data reported back by the interaction space component so charts can share a crosshair. Has two sets of data: 1) the full data retrieved at the shared key so if all charts use the same datasets, this data can just be displayed on all the charts. 2) a list of just the shared key so if they use different datasets, a search for the closest data at each point can be made. crosshairData is in the form:
     *
     *```
     *    {
     *        "rawData":[{
     *            "[[sharedKey]]": [[sharedKeyVal1]],
     *            "[[key1]]":[[val]],
     *            "[[key2]]":[[val]]
     *        },{
     *            "[[sharedKey]]": [[sharedKeyVal2]],
     *            "[[key1]]":[[val]],
     *            "[[key2]]":[[val]]
     *        }],
     *        "timeStamps":[ timeStamp1, timeStamp2 ]
     *    }
     *```
     * @property crosshairData
     * @type Object
     */
    crosshairData: {
      type: Object,
      notify: true
    },

    /**
    *  Bool indicating if interaction space is currently generating data
    *
    **/
    generatingCrosshairData: {
      type: String,
      value: false,
      notify: true
    },

    /**
     * Allows the crosshair to search all datapoints within a pixel radius. If set
     * to 0 will only pick up the closest point
     */
    crosshairPixelSearch: {
      type: Number,
      value: 0
    }
  }
};

/*
    Name:
    PxVisBehavior.extentsData

    Description:
    Polymer behavior that provides the extentsData property px-vis components.

    Dependencies:
    -

    @polymerBehavior PxVisBehavior.extentsData
*/
PxVisBehavior.extentsData = {
  properties: {
    /**
     * Data reported back by the interaction space. Displays the interpreted x & y coords, width and height, and domain extents. extentsData is in the form:
     *
     *```
     *   {
     *     x1 = {pixel-space}
     *     y1 = {pixel-space}
     *     x2 = {pixel-space}
     *     y2 = {pixel-space}
     *     w = {pixels}
     *     h = {pixels}
     *     eX = [{domain}, {domain}];
     *     eY = [{domain}, {domain}];
     *   }
     *```
     *
     * @property extentsData
     * @type Object
     */
    extentsData:{
      type:Object,
      notify:true
    },
    /**
     * Used by the chart to interpret if extentsData is strip or zoom
     */
    extentsAction: {
      type: String,
      notify: true
    }
  }
};

/*
    Name:
    PxVisBehavior.commonMethods

    Description:
    Polymer behavior that provides the commonMethods properties px-vis components.

    Dependencies:
    -

    @polymerBehavior PxVisBehavior.commonMethods
*/
PxVisBehavior.commonMethods = [{
  /**
   * Checks to see if an object is empty
   *
   * @param {object}
   * @return {bool}
   */
  _isObjEmpty:function(obj){
    if(typeof(obj) === 'undefined' || obj === null) {
      return true;
    }
    if(obj.length) {
      return !obj.length;
    }
    return !this._hasProps(obj);
  },

  /**
   * Checks to see if an d3 obj is empty
   *
   * @param {object}
   * @return {bool}
   */
  _isD3Empty:function(obj) {
    if(this._isObjEmpty(obj)) {
      return true;
    }
    return obj.empty();
  },

  /**
   * Checks to see if an d3 obj has something
   *
   * @param {object}
   * @return {bool}
   */
  _doesD3HaveValues:function(obj){
    if(this._isObjEmpty(obj)) {
      return false;
    }
    return !obj.empty();
  },

  /**
   * Checks to see if an object has values
   *
   * @param {object}
   * @return {bool}
   */
  _doesObjHaveValues:function(obj){
    if(typeof(obj) === 'undefined' || obj === null) {
      return false;
    }
    if(obj.length) {
      return !!obj.length;
    }

    return this._hasProps(obj);
  },

  _hasProps: function(obj) {
    //use iterator over object to find out if we have any property,
    //faster than Object.keys for big objects
    var i = 0;
    for(var prop in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, prop)) {
        i++;
        break;
      }
    }

    return i!==0;
  },

  /**
   * Checks to see if an object is defined
   *
   * @param {object}
   * @return {bool}
   */
  _isVarDefined:function(obj){
    if(typeof(obj) === 'undefined'){
      return false;
    }
    return true;
  },
  /**
   * Checks to see if an object is defined
   *
   * @param {object}
   * @return {bool}
   */
  _isVarUndefined:function(obj){
    if(typeof(obj) === 'undefined'){
      return true;
    }
    return false;
  },

  /**
   * escapes '.' in css selectors so that we can appropriately select stuff with dots in thei ids
   */
  _escapeCssSelector: function(selector) {
    return selector.replace('.', '\\.');
  },

  /**
   * Checks if a theme variable exists, if so, returns the theme value, if not, returns the default
   */
  _checkThemeVariable: function(varName, defaultValue) {
    var themeVar;

    if (PolymerElement) {
      // 2.0 code
      if (window.ShadyCSS) {
        themeVar = ShadyCSS.getComputedStyleValue(this, varName);
      } else {
        themeVar = getComputedStyle(this).getPropertyValue(varName);
      }
    } else {
      // 1.0 code
      themeVar = this.getComputedStyleValue(varName);
    }


    return (!themeVar || themeVar.length === 0) ? defaultValue : themeVar;
  },

  /**
   * converts a hex to rgb color
   */
  _hexToRgb: function(hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
          return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? 'rgb(' + parseInt(result[1], 16) + ',' +
                               parseInt(result[2], 16)+ ',' +
                               parseInt(result[3], 16) + ')' : null;
  },

  /**
   * Binary search through sorted chartData
   */
  _binarySearch: function(data, key, val, lowerIndex, upperIndex) {
    if(this.isVarNumber(lowerIndex) && this.isVarNumber(upperIndex) && lowerIndex === upperIndex) {
      return null;
    }

    var upperIndex = this.isVarNumber(upperIndex) ? upperIndex : data.length,
        lowerIndex = this.isVarNumber(lowerIndex) ? lowerIndex : 0,
        index = Math.floor((upperIndex - lowerIndex) / 2) + lowerIndex,
        dataVal = Number(data[index][key]);

    if(dataVal === val) {
      return data[index];
    } else if(val < dataVal) {
      return this._binarySearch(data, key, val, lowerIndex, index);
    } else if(val > dataVal) {
      return this._binarySearch(data, key, val, index+1, upperIndex);
    }
    return null;
  },

  /**
   * Binary search through sorted chartData returning all vals within a window
   */
  _fuzzyBinarySearch: function(data, key, lowerFuzz, upperFuzz, lowerIndex, upperIndex) {
    if(this.isVarNumber(lowerIndex) && this.isVarNumber(upperIndex) && lowerIndex >= upperIndex) {
      return null;
    }

    var upperIndex = this.isVarNumber(upperIndex) ? upperIndex : data.length,
        lowerIndex = this.isVarNumber(lowerIndex) ? lowerIndex : 0,
        index = Math.floor((upperIndex - lowerIndex) / 2) + lowerIndex,
        dataVal = Number(data[index][key]);

    if(dataVal >= lowerFuzz && dataVal <= upperFuzz) {
      return this._getAdjacentValues(data, key, lowerFuzz, upperFuzz, lowerIndex, upperIndex, index);
    } else if(upperFuzz < dataVal) {
      return this._fuzzyBinarySearch(data, key, lowerFuzz, upperFuzz, lowerIndex, index);
    } else if(lowerFuzz > dataVal) {
      return this._fuzzyBinarySearch(data, key, lowerFuzz, upperFuzz, index+1, upperIndex);
    }
    return null;
  },

  _getAdjacentValues: function(data, key, lowerFuzz, upperFuzz, lowerIndex, upperIndex, index) {
    var d = [];

    //Make sure we keep the ordered so that the fuzzy search
    //can rely on the last item the be the latest in time
    //start by "going back in time"
    for(var i = index-1; i > lowerIndex; i--) {
      if(data[i][key] < lowerFuzz) {
        break;
      }
      //prepend point
      if(!this.hardMute || !this.mutedSeries[data[i][key]]) {
        d.splice(0, 0, data[i]);
      }
    }

    if(!this.hardMute || !this.mutedSeries[data[index][key]]) {
      d.push(data[index]);
    }

    for(var i = index+1; i < upperIndex; i++) {
      if(data[i][key] > upperFuzz) {
        break;
      }
      if(!this.hardMute || !this.mutedSeries[data[i][key]]) {
        d.push(data[i]);
      }
    }

    return d;
  },

  /*
   * deep-copy object into newObject
  */
  clone: function(object, newObject) {
    var newObject = newObject || {};
    for (var i in object) {
      if (object.hasOwnProperty(i)) {
        if (typeof object[i] === 'object' && object[i] !== null) {
          newObject[i] = Array.isArray(object[i]) ? [] : {};
          this.clone(object[i], newObject[i])
        } else {
          newObject[i] = object[i];
        }
      }
    }
    return newObject;
  },

  isVarNumber: function(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }
}, PxVisBehavior.dataChecks];

/*
    Name:
    PxVisBehavior.axisTypes

    Description:
    Polymer behavior that provides 2 properties defining the type of axis of a
    px-vis components.

    Dependencies:
    -

    @polymerBehavior PxVisBehavior.axisTypes
*/
PxVisBehavior.axisTypes = {
  properties: {
    /**
     * Sets the type of data for the x values
     *
     * Valid entries are:
     * - `ordinal`: for discrete input domains, such as names or categories.
     * - `scaleBand`: another ordinal type meant to create a bar instead of a point.
     * - `time`: for time domains.
     * - `timeLocal`: for local time domains.
     * - `linear`: for continuous input domains, such as numbers.
     * - `log`: for continuous input domains displayed logarithmicly. NOTE: Per d3 docs, this scale cannot cross or include 0.
     * - `pie`: for pie/donut charts
     */
    xAxisType: {
      type: String,
      value: "linear"
    },
    /**
     * Sets the type of data for the y values
     *
     * Valid entries are:
     * - `ordinal`: for discrete input domains, such as names or categories.
     * - `scaleBand`: another ordinal type meant to create a bar instead of a point.
     * - `linear`: for continuous input domains, such as numbers.
     * - `log`: for continuous input domains, such as numbers.
     * - `pie`: for pie/donut charts
     */
    yAxisType: {
      type: String,
      value: "linear"
    }
  }
};

/*
    Name:
    PxVisBehavior.zoomSelection

    Description:
    Polymer behavior that provides 1 property defining how the selection should
    behave when user draw a box for zooming

    Dependencies:
    -

    @polymerBehavior PxVisBehavior.zoomSelection
*/
PxVisBehavior.zoomSelection = {
  properties: {
    /**
     *
     * The shape of selection (zoom) the user can do. Can be:
     * - 'xy': user can draw a rectangle freely
     * - 'xAxis': user can select a range within the X axis, the Y axis always
     *   being entirely selected
     * - 'yAxis': user can select a range within the Y axis, the X axis always
     *   being entirely selected
     */
    selectionType: {
      type: String,
      value: 'xy'
    }
  }
};

/*
     Name:
    PxVisBehavior.chartExtents

    Description:
    Polymer behavior that provides a chartExtents object to components.


    @polymerBehavior PxVisBehavior.chartExtents
*/
PxVisBehavior.chartExtents = {
  properties: {
    /**
    * Developer set chart extents for the chart. The chart will draw to whatever values are specified in the chartExtents.
    * Setting this and not using "dynamic" will prevent the chart from
    * having to parse the data to find the extents and therefore improve
    * performance for initial rendering
    *```
    *  {
    *      "x": [0,100],
    *      "y": [5,50],
    *  }
    *```
    *
    * To force the chart to calculate based on data, use "dynamic".
    *```
    *  {
    *      "x": [0,"dynamic"],
    *      "y": [-10,"dynamic"],
    *  }
    *```
    *
    * For an ordinal dataset, chart extents can be set like this:
    *```
    *  {
    *      "x": ['low','medium','high'],
    *      "y": [5,50],
    *  }
    *```
    */
    chartExtents: {
      type: Object,
      notify: true
    }
  }
};

/*
     Name:
    PxVisBehavior.dataExtents

    Description:
    Polymer behavior that provides a dataExtents object to components.


    @polymerBehavior PxVisBehavior.dataExtents
*/
PxVisBehavior.dataExtents = {
  properties: {
    /**
    *
    *```
    *  {
    *      "x": [0,100],
    *      "y": [5,50],
    *  }
    *```
    *
    * For an ordinal dataset, chart extents can be set like this:
    *```
    *  {
    *      "x": ['low','medium','high'],
    *      "y": [5,50],
    *  }
    *```
    */
    dataExtents: {
      type: Object,
      notify: true
    }
  }
};

/*
     Name:
    PxVisBehavior.amplitudeExtents

    Description:
    Polymer behavior that provides a amplitudeExtents object to components.


    @polymerBehavior PxVisBehavior.amplitudeExtents
*/
PxVisBehavior.amplitudeExtents = {
  properties: {
    /**
    * Polar's equivalant to chartExtents. Adjusts the max to the given value and takes the min of the min value given and the data's min val: Math.min(amplitudeExtents[0], chartDataMin)
    *
    * Polar coords must start at the minimum value or else the angle is irrelevant. It also cannot be less than 0.
    *
    * ```
    *  [minNumber, maxNumber]
    * ```
    */
    amplitudeExtents: {
      type: Array,
      value: function() { return []; }
    }
  }
};

/*
     Name:
    PxVisBehavior.events

    Description:
    Polymer behavior that provides config and data to manage "events" (px-vis-event) on the chart


    @polymerBehavior PxVisBehavior.events
*/
PxVisBehavior.events = {
  properties: {
    /**
     * Configuration object to define what event should map to what icon and color.
     * The object has a key being the event name, the value being a configuration object for that event. The configuration object has four properties:
     * - `color`: A valid color name found in the px-colors-design
     * - `icon`: the reference to the icon; for 'px' it is an icon set and an icon name; for an image, it is a path
     * - `type`: 'px', or 'image'.
     * - `offset`: a 2 element array with the number of pixels to offset the icon. offset[0] is along the x-axis; offset[1] is along the y-axis; necessary for some icons to adjust their values to achieve a better alignment over the event line.
     * - `size`: a size in pixels for images.
     * - `enableTooltip` enable/disable tooltip on the event, useful when using a lot of events
     * - `firstDateTimeFormat`: moment.js format string for the first part of the timestamp if the x Axis is time based
     * - `separator`: the separator character between the two datetime strings
     * - `secondDateTimeFormat`: moment.js format string for the second part of the timestamp if the x Axis is time based
     * - `tooltipOrientation`: orientation of the tooltip
     * - `timezone`: the moment.js timezone to be used for the timestamp
     * - `lineWeight`: thickness of the line
     * - `dataKey`: the access key for the eventData value to be used to position the event
     * ```
     * Format: {
     *   "Event-Name-A":{
     *     "color": "a color, rgb or hex",
     *     "icon": "a px icon",
     *     "type": "px",
     *     "offset":[0,0],
     *     'enableTooltip': true
     *   },
     *   "Event-Name-C":{
     *     "color": "a color, rgb or hex",
     *     "icon": "path-to-an-img",
     *     "type": "image",
     *     "offset":[0,0]
     *   },
     * }
     * ```
     *
     * ```
     * Example: {
     *   "Recalibrate":{
     *     "color": "rgb(0,0,255)",
     *     "icon": "px-vis:mov",
     *     "type": "px",
     *     "offset":[-3,0]
     *   },
     *   "Fan stop":{
     *     "icon": "Dancing_banana.gif",
     *     "type": "image",
     *     "offset":[-2,-20],
     *     "size":"25"
     *    }
     * }
     *```
     *
     * @property eventConfig
     * @type Object
     */
    eventConfig: {
      type: Object
    },
    /**
     * Configuration object to define what the default icon should be. This gets used if a) no eventConfig is defined or b) the particular event is not defined in the eventConfig object.
     *
     *```
     * Default: {
     *   'color': 'grey7', //or theme var
     *   'icon': 'px-vis:mov',
     *   'type': 'px',
     *   'offset': 0,
     *   'lineColor': 'grey9',
     *   'lineWeight': 1,
     *   'enableTooltip': true
     *   'firstDateTimeFormat': 'HH:mm:ss ZZ',
     *   'secondDateTimeFormat': 'DD MMM YYYY',
     *   'separator': '|',
     *   'timezone': 'utc',
     *   'tooltipOrientation': 'left'
     * }
     *```
     *
     * @property defaultEventConfig
     * @type Object
     */
    defaultEventConfig: {
      type: Object
    },

    /**
     * Data representing the events. Example:
     * [
     *    {
     *      "id": "123",
     *      "x": 2,
     *      "label": "Recalibrate"
     *    },
     *    {
     *      "id": "456",
     *      "x": 3,
     *      "label": "Fan start"
     *    },
     *    {
     *      "id": "789",
     *      "x": 4,
     *      "label": "Fan stop"
     *    },
     *    {
     *      "id": "333",
     *      "x": 8,
     *      "label": "Default"
     *    }
     *  ]
     */
    eventData: {
      type: Array
    }
  }
};

/*
     Name:
    PxVisBehavior.markers

    Description:
    Polymer behavior that provides config and data to manage "markers" on the chart

    @polymerBehavior PxVisBehavior.markers
*/
PxVisBehavior.markers = {
  properties: {
    /**
     * Configuration object to define what marker should map to what icon, color, and row.
     * The object has a key being the marker name, the value being a configuration object for that marker. The configuration object has four properties:
     * - `color`: A rgb color value for the fill or stroke.
     * - `priority`: relative priority is used to decide which type of markers draw on top of each other. priority 0 => smaller priority. 2 draws over 1, which itself draws over 0, etc..
     * - `markerFillOpacity`: the opacity of the inside of the marker
     * - `markerStrokeOpacity`: the opacity of the outside of the marker
     * - `markerSymbol`: the symbol type; see below
     * - `markerSize`: specifies the size of markers
     * - `markerScale`: allows to scale the size of markers
     * - `location`: "top" or "bottom"
     * - `row`: the row number on the top or the bottom, starting at 0
     * - `showTooltip`: whether a tooltip should be shown on hover
     * - `firstDateTimeFormat`: used to format the date part of the timestamp in the tooltip
     * - `secondDateTimeFormat`: used to format the time part of the timestamp in the tooltip
     * - `separator`: symbol between date and time in the tooltip
     * - `timezone`: timezone to use for the timestamp in the tooltip
     * - `tooltipOrientation`: orientation of the tooltip: "left", "right", "bottom", "top"
     * - `tooltipLabel`: label to be used in the tooltip for this type. If not defined the key
     * of this type will be used (which should match 'label' in the markerData)
     *
     * The symbol used for the marker. Supported symbols:
     * - 'circle'
     * - 'cross'
     * - 'diamond'
     * - 'square'
     * - 'triangle-up'
     * - 'star'
     * - 'wye'
     * more info at https://github.com/d3/d3-shape/blob/master/README.md#symbols
     *
     * Some additional "custom" types are also available:
     * - 'bar'
     * - 'thin-bar'
     * - 'thick-bar'
     * - 'x'
     * ```
     * Example: {
     *   'myMarkerType':{
     *       'fillColor': 'rgb(123,0,0)',
     *       'markerFillOpacity': 0.5,
     *       'markerSymbol': 'square',
     *       'markerSize': 4,
     *       'location': 'top',
     *       'row': 1,
     *       'priority': 10,
     *       'showTooltip': true,
     *       'tooltipOrientation': 'top'
     *   }
     * }
     * ```
     *
     */
    markerConfig: {
      type: Object
    },
    /**
     * Data representing the markers. Example:
     * [
     *    {
     *      "time": 2,
     *      "label": "Recalibrate"
     *    },
     *    {
     *      "time": 3,
     *      "label": "Fan start"
     *    },
     *    {
     *      "time": 4,
     *      "label": "Fan stop"
     *    },
     *    {
     *      "time": 8,
     *      "label": "Default"
     *    }
     *  ]
     */
    markerData: {
      type: Array
    }
  }
};


/*
     Name:
    PxVisBehavior.thresholds

    Description:
    Polymer behavior that provides config and data to manage "thresholds" (px-vis-threshold) on the chart


    @polymerBehavior PxVisBehavior.thresholds
*/
PxVisBehavior.thresholds = {
  properties: {
    /**
     * Configuration object to define what threshold should map to what color and line style.
     * The object has a key being the threshold name, the value being a configuration object for that threshold. The configuration object has four properties:
     * - `color`: A valid color name found in the px-colors-design. If no color is supplied, then it will match the series color or fallback to a default color.
     * - `strokeWidth`: the stroke width for the line.
     * - `dashPattern`: string for the dash pattern for the line in the form of stroke,gap. `5,2` would be a 5px dash with 2px gap. `5,2,1,2` would be a 5px dash, 2px gap, 1px dash, 2px gap. '5,0' would be effectively create a solid line.
     * - `title`: The display title
     *
     *
     * ```
     * Example: {
     *   "max":{
     *     "color": "blue",
     *     "strokeWidth": "2",
     *     "dashPattern": "5",
     *     "title": "Maximum"
     *   },
     *   "avg":{
     *     "color": "green",
     *     "strokeWidth": "1",
     *     "dashPattern": "5,2,1,2",
     *     "title": "Fleet Average"
     *   },
     *   "min":{
     *     "title": "Min"
     *    }
     * }
     *```
     *
     */
    thresholdConfig: {
      type: Object,
      value: function() { return {}; }
    },
    /**
     * Configuration object to define what the default icon should be. This gets used if a) no eventConfig is defined or b) the particular event is not defined in the eventConfig object.
     *
     *```
     * Default: {
     *   'strokeWidth': '1',
     *   'dashPattern': '5,2'
     * }
     *```
     *
     */
    _defaultThresholdConfig: {
      type: Object,
      value: function() {
        return {
          'strokeWidth': '1',
          'dashPattern': '5,2'
        };
      }
    },
    /**
     * Data representing the events. Example:
     * ```
     * [
     *      { "for":"y0", "type":"max", "value":35.4784 },
     *      { "for":"y0", "type":"min", "value":7.6531 },
     *      { "for":"y0", "type":"mean", "value":15.330657585139331 },
     *      { "for":"y1", "type":"mean", "value":75 },
     *      { "for":"", "type":"quartile", "value":17 }
     *  ]
     * ```
     */
    thresholdData: {
      type: Array
    }
  }
};

/*
     Name:
    PxVisBehavior.dimensions

    Description:
    Polymer behavior that provides dimension behaviors


    @polymerBehavior PxVisBehavior.dimensions
*/
PxVisBehavior.dimensions = {
  properties: {
    /**
     * Represents all axes plotted by the chart, including muted ones.
     * It doesn't guarantee to have the same order as the current visual
     * representation.
     * Can be set by the developer to define which axes to plot
     */
    axes: {
      type: Array
    },
    /**
    * An array of dimensions (axes) which the chart uses. This array represents
    * the current state of all axes: muted axes won't be included and the
    * array is ordered based on the current visual representation.
    * Do not set at a chart level, only read
    */
    dimensions: {
      type: Array,
      notify: true
    },
    /**
    * A string specifying which key to use as the series
    *
    */
    seriesKey: {
      type: String
    },
  }
};

/*
     Name:
    PxVisBehavior.categories

    Description:
    Polymer behavior that provides categories definitions which can be used to color the series lines by category


    @polymerBehavior PxVisBehavior.categories
*/
PxVisBehavior.categories = {
  properties: {
    /**
     * A dev set string speciying which key to use as the category to use to color the series lines
     *
     */
    categoryKey: {
      type: String
    },
    /**
     * A dev set array defining the categories values.
     *
     */
    categories: {
      type: Array,
      value: function(){ return []; }
    }
  }
};


/*
    Name:
    PxVisBehavior.commonAxis

    Description:
    Polymer behavior that provides a boolean to specify a common axis for a chart.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.commonAxis
*/
PxVisBehavior.commonAxis = {
  properties: {
    /**
     * A boolean specifying if all axes should share the same range
     *
     */
    commonAxis: {
      type: Boolean,
      value: false
    }
  }
};

/*
    Name:
    PxVisBehaviorD3.polarData

    Description:
    Polymer behavior that provides properties used when working with polar data

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.polarData
*/
PxVisBehavior.polarData = {
  properties: {
    /**
     * whether the polar data should be interpreted clockwise or counter-clockwise
     */
    counterClockwise: {
      type: Boolean,
      value: false
    },
    /**
     * Whether the angle data should be processed as degrees, as opposed to be processed as radians
     */
    useDegrees: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Returns pixel coordinates for data values. [0,0] is the center of the
   * radial drawing, not the top left corner
   */
  _getPixelCoordForRadialData: function(dataX, dataY, yRange, yDomain, yDomainTot) {
    var result = [];

    //process angle and amplitude in pxel
    var angle = dataX,
        pixelAmplitude = yRange * (dataY - yDomain[0])/yDomainTot;

    angle = this._adjustAngleForPolarChart(angle, false);

    //sin * pixel range * percentage of data range
    result[1] = Math.cos(angle) * pixelAmplitude;
    result[0] = Math.sin(angle) * pixelAmplitude;

    return result;
  },
  /**
   * adjusts the angle for the polar chart, taking counterClockwise into account
   * and returning it in the asked unit (degrees if toDegrees is true)
   */
  _adjustAngleForPolarChart: function(angle, toDegrees) {

    //add 180 deg to offset chart 0 being on top
    var offset = toDegrees ? 180 : Math.PI;

    if((!this.counterClockwise && !toDegrees) ||
       (this.counterClockwise && toDegrees)) {
      angle *= -1;
    }

    //convert to appropriate unit and
    if(this.useDegrees) {
      if(toDegrees) {
        return angle + offset;
      } else {
        return angle / 360 * 2 * Math.PI + offset;
      }
    } else {
      if(toDegrees) {
        return angle / (2 * Math.PI) * 360 + offset;
      } else {
        return angle + offset;
      }
    }
  }
};

/*
    Name:
    PxVisBehavior.seriesId

    Description:
    Polymer behavior that provides seriesId property

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.seriesId
*/
PxVisBehavior.seriesId = {
  properties: {
  /**
    * A unique ID for each line series
    *
    */
    seriesId:{
      type:String
    }
  }
};

/*
    Name:
    PxVisBehavior.dynamicConfigProperties

    Description:
    Polymer behavior that allows the dynamic creation of properties that will be
    searched for in the completeSeriesConfig

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.dynamicConfigProperties
*/
PxVisBehavior.dynamicConfigProperties = [{
  properties: {
    /**
      * A list of the dynamic properties
      *
      */
    _dynamicProperties: {
      type: Array,
      value: function() {
        return [];
      }
    }
  },

  observers: ['_processConfig(completeSeriesConfig.*, seriesId)'],

  /**
    * Decides if it should use a default or user specified value
    *
    */
  _computeValue: function(configValue, def) {
    return (typeof configValue !== 'undefined' && configValue !== null) ?
                              configValue : def;
  },

  /**
    * sets each property listed in dynamicProperies
    *
    */
  _processConfig: function(completeSeriesConfig, seriesId) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }


    var conf = this.completeSeriesConfig[this.seriesId],
        name;

    if(conf) {
      for(var i=0; i<this._dynamicProperties.length; i++) {
        name = this._dynamicProperties[i];
        this.set(name, this._computeValue(conf[name], this['_default' + name]));
      }
    }
  },

  /**
    * Cycles through properties and adds them to dynamic properties
    *
    */
  _watchConfigProperty: function(name, defValue) {
    this._dynamicProperties.push(name);
    this['_default' + name] = defValue;

    //if we have the config compute value now. If we don't it will be processed
    //when the config comes in
    if(this.completeSeriesConfig && this.seriesId) {
      var conf = this.completeSeriesConfig[this.seriesId];
      this[name] = this._computeValue(conf[name], defValue);
    }
  }

}, PxVisBehavior.observerCheck,PxVisBehavior.completeSeriesConfig, PxVisBehavior.seriesId];



/*
    Name:
    PxVisBehavior.radial

    Description:
    Polymer behavior that provides the radial definition

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.radial
*/
PxVisBehavior.radial = {
  properties: {
    /**
     * Boolean specifying if the chart is a polar chart or a cartesian chart
     *
     */
    radial: {
      type: Boolean,
      value: false
    }
  }
};


/*
    Name:
    PxVisBehavior.forceDateTimeDisplay

    Description:
    Polymer behavior that provides the forceDateTimeDisplay definition

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.forceDateTimeDisplay
*/
PxVisBehavior.forceDateTimeDisplay = {
  properties: {
    /**
     * Forces the use of the timestamp at the top
     */
    forceDateTimeDisplay: {
      type: Boolean,
      value: false
    }
  }
};

/*
    Name:
    PxVisBehavior.serieToRedrawOnTop

    Description:
    Polymer behavior that provides the serieToRedrawOnTop definition

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.serieToRedrawOnTop
*/
PxVisBehavior.serieToRedrawOnTop = {
  properties: {
    /**
     *  Array containing a set of series to redraw on top of everything (in the order
     * they are found in this array)
     */
    serieToRedrawOnTop: {
      type: Array
    }
  },
};

/*
    Name:
    PxVisBehavior.svgDefinition

    Description:
    Polymer behavior that provides the svg property

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.svgDefinition
*/
PxVisBehavior.svgDefinition = {
  properties: {
    /**
     * svg is a holder for the d3 instantiated svg container to draw to.
     * Must be set in ready and passed to all components so they know whom to draw to.
     *
     * FUTURE: when Polymer supports SVG, this only need be set on the SVG element.
     *
     * @property svg
     * @type Object
     */
    svg: {
      type: Object
    }
  }
};

/*
    Name:
    PxVisBehavior.svgLowerDefinition

    Description:
    Polymer behavior that provides the svg property

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehavior.svgLowerDefinition
*/

PxVisBehavior.svgLowerDefinition = {
  properties: {
    /**
     * svg is a holder for the d3 instantiated svg container to draw to.
     * Must be set in ready and passed to all components so they know whom to draw to.
     *
     * FUTURE: when Polymer supports SVG, this only need be set on the SVG element.
     *
     * @property svg
     * @type Object
     */
    svgLower: {
      type: Object,
      notify:true
    }
  }
};

/*
    Name:
    PxVisBehavior.dynamicMenuConfig

    Description:
    Polymer behavior that provides the dynamicMenuConfig property

    @polymerBehavior PxVisBehavior.dynamicMenuConfig
*/
PxVisBehavior.dynamicMenuConfig = {
  properties: {
    /**
     *  The config used by a dynamic menu to create menu entries. Example:
     * ```
     * [
     *     {
     *      'name': 'Delete',
     *       'action': function(data) {
     *         console.log('run delete');
     *       },
     *       'actionContext': aComponent,
     *       'eventName': 'delete',
     *       'icon': 'fa-trash'
     *     },
     *     {
     *       'name': 'Bring To Front',
     *       'action': function(data) {
     *         console.log('run bring to front');
     *       },
     *       'eventName': 'bring-to-front',
     *       'icon': 'fa-arrow-up'
     *     }
     *   ];
     * ```
     *
     * - `action` is function that will be run when a menu item is clicked. You can pass
     * a specific context to be used in that function through `actionContext`. Otherwsie the
     * context is going to be the chart itself. The `data` parameter has 2 properties: `itemConfig`
     * which is this specific menu item config object and `additionalDetail` which represents the
     * register item: `value` and `name` (name is the serie id). Please note that because `itemConfig`
     * is being passed back you could tie anything to it and have it available in this function.
     * If dynamicMenuConfig is passed in directly in the HTML then `action` will have to be passed in
     * as a string with quotes escaped rather than directly as a function.
     * - `name` is the menu item displayed text
     * - if `eventName` is defined then an event with this name will be fired when clicking the item
     * the detail of this event will include `data` which ahs 2 properties: `itemConfig` and `additionalDetail`
     * just like `action` is getting. The event is fired from the chart
     * - `icon` is optional and defines a font-awesome icon to be used for the menu entry
     *
     */
    dynamicMenuConfig: {
      type: Array
    }
  }
};

/*
    Name:
    PxVisBehavior.actionConfig

    Description:
    Polymer behavior that provides the actionConfig property

    @polymerBehavior PxVisBehavior.actionConfig
*/
PxVisBehavior.actionConfig = {
  properties: {
    /**
      * Configuration used to define what actions happen on events. Each key represents an event,
      * each value can be:
      * - a predefined action found as a key in px-vis-interaction-space `actionMapping`
      * - a function, where `this` will be bound to the chart and the function's argument will be the mouse position on the chart
      */
    actionConfig: {
      type: Object,
      notify: true
    }
  }
};

/*
    Name:
    PxVisBehavior.toolbarConfig

    Description:
    Polymer behavior that provides the toolbarConfig property

    @polymerBehavior PxVisBehavior.toolbarConfig
*/
PxVisBehavior.toolbarConfig = {
  properties: {
    /**
       * Configuration object for the toolbar. This object drives what buttons are available on
       * the toolbar and what they do. Three actions can be used out of the box by passing them
       * as keys in this config: 'zoom', 'pan' and 'tooltip'. Any other kind of actions and
       * buttons can be defined through this object.
       * Example of a custom config:
       * ```
       * {
       *   "customzoom": {
       *     "tooltipLabel": "zoom",          //label used for the tooltip for this button
       *     "icon": "px-vis:zoom-toolbar",   //icon to use for this button
       *     "buttonGroup": 1,                //if a button is part of a button group then it
       * becomes blue when clicked and all other buttons with the same button group in the
       * same row become deselected (not blue)
       *     "selected": true,                //force this button to be selected at start
       *     "actionConfig": {                 //this config will be propagated to
       * px-vis-interaction-space
       *       "mousedown": "startZooming",   //key is an event, value is either a
       * predefined action defined in `actionMapping` in px-vis-interaction-space or a
       * function which context is bound to the chart
       *         "mouseup": "stopZooming",
       *         "mouseout": "null",          //by specifying null it ensures previous
       * actions registered against this event will be removed
       *         "mousemove": "function() { console.log(\"Mouse moved on the chart!\");}"
       *       },
       *       "subConfig": {                 //subConfig allows you to defined a second row
       * of buttons which will be displayed when clicking the main button
       *         "x": {
       *           "title": "X",              //you can use a title instead of/in addition to
       * the icon
       *           "tooltipLabel": "Zoom on X axis only",
       *           "eventName": "my-custom-click", //an event will be fired when clicking on
       * this button
       *           "selectable": true,
       *           "selected": true,
       *           "onClick": "function() { this.set(\"selectionType\", \"xAxis\");}" //this
       * function will be run when clicking the button. The chart will be the context of this
       * function. If defined in HTML this needs to be a string, but if defined in javascript
       * this can be a function
       *         },
       *         "y": {
       *           "title": "Y",
       *           "tooltipLabel": "Zoom on Y axis only",
       *           "selectable": true,
       *           "onClick": "function() { this.set(\"selectionType\", \"yAxis\");}"
       *         },
       *         "xy": {
       *           "title": "XY",
       *           "tooltipLabel": "Zoom on X and Y axis",
       *           "selectable": true,
       *           "onClick": "function() { this.set(\"selectionType\", \"xy\");}"
       *         },
       *         "zoomIn": {
       *           "icon": "px-vis:zoom-in",
       *           "tooltipLabel": "zoom in",
       *           "eventName": "px-vis-toolbar-zoom-in" //those events are vis specific
       * events and are automatically caught by the chart to do something
       *         },
       *         "zoomOut": {
       *           "icon": "px-vis:zoom-out",
       *           "tooltipLabel": "zoom out",
       *           "eventName": "px-vis-toolbar-zoom-out"
       *         },
       *         "undoZoom": {
       *           "icon": "px-vis:zoom-out-one-level",
       *           "tooltipLabel": "undo zoom",
       *           "eventName": "px-vis-toolbar-undo-zoom"
       *         },
       *         "resetZoom": {
       *           "icon": "px-vis:full-screen",
       *           "tooltipLabel": "reset zoom to inital value",
       *           "eventName": "px-vis-toolbar-reset-zoom"
       *         }
       *       }
       *     },
       *     "pan": true,           //default "out of the box" panning button
       *     "tooltip": true        //default "out of the box" tooltip button
       * ```
       */
      toolbarConfig: {
        type: Object,
        value: function() {
          return {"zoom": true, "pan": true, "tooltip": true};
        }
      }
  }
};

/*
    Name:
    PxVisBehavior.seriesToAxes

    Description:
    Polymer behavior that provides the seriesToAxes property

    Dependencies:
    - none

    @polymerBehavior PxVisBehavior.seriesToAxes
*/
PxVisBehavior.seriesToAxes = {
  properties: {
    /**
     * Object linking which series belong to which axis
     */
     seriesToAxes: {
       type: Object
     }
  }
};

/*
    Name:
    PxVisBehavior.uniqueIds

    Description:
    Polymer behavior that provides ability to clean d3/native objects on detached

    Dependencies:
    - none

    @polymerBehavior PxVisBehavior.uniqueIds
*/
PxVisBehavior.uniqueIds = {
  properties: {
    /**
     * Array of unique IDs generated for this comp. cleaned from global
     * store on detached
     */
     _uniqueIdsUsed: {
       type: Array,
       value: function() {
         return [];
       }
     },
  },
  detached: function () {
    if(this._uniqueIdsUsed) {
      for(var i=0; i<this._uniqueIdsUsed.length; i++) {
        Px.uniqueIds.splice(Px.uniqueIds.indexOf(this._uniqueIdsUsed[i]), 1);
      }
      this._uniqueIdsUsed = [];
    }
  },
  /**
   * Generates a random id string.
   *
   * Takes a string prefix, then adds 10 random chars
   *
   * @param {string}
   * @return {id string}
   */
  generateRandomID: function(baseStr) {

    var id = baseStr,
        abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        len = abc.length;

    for(var i = 0; i < 10; i++){
      id += abc.charAt(Math.floor(Math.random() * len));
    }

    Px.uniqueIds = Px.uniqueIds || [];
    if(Px.uniqueIds.indexOf(id) !== -1) {
      //id exists, recreate it.
      return this.generateRandomID(baseStr);
    } else {
      Px.uniqueIds.push(id);
    }

    this._uniqueIdsUsed.push(id);
    return id;
  }
};

/*
    Name:
    PxVisBehavior.preventInitialDrawing

    Description:
    Polymer behavior that provides the preventInitialDrawing property,
    used to block an element from drawing until set to false

    Dependencies:
    - none

    @polymerBehavior PxVisBehavior.preventInitialDrawing
*/
PxVisBehavior.preventInitialDrawing = {
  properties: {
    /**
    * blocks initial drawings of axis until set to false
    */
    preventInitialDrawing: {
      type: Boolean,
      value: false
    }
  }
};

/*
    Name:
    PxVisBehavior.selectionType

    Description:
    Behavior providing the selectionType property
    @polymerBehavior PxVisBehavior.selectionType
*/
PxVisBehavior.selectionType = {
  properties: {
    /**
     * The zoom selection type:
     * - xy
     * - xAxis
     * - yAxis
     */
    selectionType: {
      type: String,
      notify: true,
      value: 'xy'
    }
  }
};

/*
    Name:
    PxVisBehavior.measureText

    Description:
    Behavior providing the ability to measure text
    @polymerBehavior PxVisBehavior.measureText
*/
PxVisBehavior.measureText = {
  properties: {
    /**
     * The zoom selection type:
     * - xy
     * - xAxis
     * - yAxis
     */
    _measurementCanvas: {
      type: Object
    },
    _measurementCanvasContext: {
      type: Object
    }
  },

  _createMeasurementCanvas: function(width, height, font) {
    var canvas = document.createElement('canvas');
    canvas.height = height || this.height;
    canvas.width = width || 9999;

    this._measurementCanvas = canvas;

    if(font) {
      var ctx = this._measurementCanvas.getContext('2d');
      ctx.font = font;
    }
  },

  _measureTextOnCanvas: function(text) {
    if(!this._measurementCanvas) {
      this._createMeasurementCanvas();
    }

    var context = this._measurementCanvas.getContext('2d'),
    textSize = context.measureText(text);

    return textSize;
  }

};

/*
    Name:
    PxVisBehavior.isAttached

    Description:
    Behavior providing the ability to track if the component is attached to the document
    @polymerBehavior PxVisBehavior.isAttached
*/
PxVisBehavior.isAttached = {
  properties: {
    /**
     * Boolean tracking if we are attached
     */
    _isAttached: {
      type: Boolean,
      value: false
    }
  },

  detached: function() {
    this._isAttached = false;
  },

  attached: function() {
    this.set('_isAttached', true);
  }
};

/*
    PxVisBehavior.waitForAnimationFrame

    Description:
    Behavior providing the _animationFrameDone property and sets to true
    @polymerBehavior PxVisBehavior.waitForAnimationFrame
*/
PxVisBehavior.waitForAnimationFrame = {
  properties: {
    _animationFrameDone: {
      type: Boolean,
      value: false
    }
  },

  ready: function() {
    window.requestAnimationFrame(function() {
      this._animationFrameDone = true;
    }.bind(this));
  }
};

/*
    PxVisBehavior.actionConfigGeneric

    Description:
    Behavior providing the actionConfig property
    @polymerBehavior PxVisBehavior.actionConfigGeneric
*/
PxVisBehavior.actionConfigGeneric = {
  properties: {
    /**
    * Configuration used to define what actions happen on events. Each key represents an event,
    * each value can be:
    * - a predefined action found in px-vis-interaction-space `actionMapping`
    * - a function which context will be bound to the chart. The function argument will be the mouse position on the chart
    */
    actionConfig: {
      type: Object
    }
  }
};

/*
    PxVisBehavior.applyActionConfig

    Description:
    Intended for the interaction spaces, method to apply the actionConfig to the listener elem
    @polymerBehavior PxVisBehavior.applyActionConfig
*/
PxVisBehavior.applyActionConfig = [{
  properties: {
    /**
    * how many handlers are currently setup for each event type
    */
    handlersCount: {
      type: Object,
      value: function() {
        return {};
      }
    }
  },

  _deletePreviousActions: function(d3Elem, eventType) {
    var keys = Object.keys(this.handlersCount),
        count = this.handlersCount[eventType] ? this.handlersCount[eventType] : 0;

    //delete all handlers
    for(var j=0; j<count; j++) {
      d3Elem.on(eventType + '.' + j, null);
    }

    this.handlersCount[eventType] = 0;
  },
  /**
   * Set up normal listener actions
   *
   */
  _setupRegularActions: function(d3Elem, elem, dontDoUpDown) {
    var keys = Object.keys(this.actionConfig),
        mouseEvent,
        action,
        mappedAction,
        allActions,
        bindingContext = this,
        toBeUsed,
        noChartContext;

    for(var i=0; i<keys.length; i++) {
      mouseEvent = keys[i];

      //make sure we delete all previous handlers
      this._deletePreviousActions(d3Elem, mouseEvent);

      // if we already setup mousedown && up via our d3 caller, skip it
      if(dontDoUpDown && (mouseEvent === 'mousedown' || mouseEvent === 'mouseup')) {
        continue;
      }

      allActions = Array.isArray(this.actionConfig[keys[i]]) ? this.actionConfig[keys[i]] : [this.actionConfig[keys[i]]];

      for(var j=0; j<allActions.length; j++) {
        action = allActions[j];
        mappedAction = this[this.actionMapping[action]];
        noChartContext = false;

        //is this a function defined heere
        if(mappedAction && typeof mappedAction === 'function') {

          toBeUsed = mappedAction;
          noChartContext = true;
        } else if(typeof action === 'function') {
          toBeUsed = action;
        } else if(typeof action === 'string' && action && action != 'null') {
          toBeUsed = eval('var f = function() { return ' + action + ';}; f();');
        } else {
          toBeUsed = null;
        }

        if(toBeUsed) {
          var wrapper;
          if(noChartContext) {
            wrapper = toBeUsed.bind(this);
          } else {
            //now ensure the action will be run within the context of the chart
          var _this = this;

          wrapper = function(evt) {
              _this.fire('px-vis-action-request', {'function': this, 'data': {'mouseCoords': Px.d3.mouse(elem), 'target': elem}});
            }.bind(toBeUsed);
          }

          d3Elem.on(mouseEvent + '.' + j, wrapper);
          this.handlersCount[mouseEvent]++;
        }
      }
    }
  }
}, PxVisBehavior.actionConfigGeneric];


/*
    PxVisBehavior.interactionSpaceConfigGeneric

    Description:
    Behavior providing the interactionSpaceConfig property
    @polymerBehavior PxVisBehavior.interactionSpaceConfigGeneric
*/
PxVisBehavior.interactionSpaceConfigGeneric = {
  properties: {
    interactionSpaceConfig: {
      type: Object
    }
  }
};


/*
    PxVisBehavior.interactionSpaceShared

    Description:
    Behavior providing shared methods and props for interaction space
    @polymerBehavior PxVisBehavior.interactionSpaceShared
*/
PxVisBehavior.interactionSpaceShared = [{
  /**
   * Helper function called on mouseout
   * resets tooltipData
   *
   * @method _resetTooltipData
   */
  _resetTooltipData: function() {
    if(this.seriesKeys === undefined) {
      return;
    }
    var ttD;
    this.set('_calculatingData', false);

    if(this.defaultEmptyData) {
      ttD = this.defaultEmptyData;

    } else {
      ttD = {
            'time': null,
            'timeSeriesKey': null,
            'hidden': true,
            'series': [],
            'seriesObj': {},
            'mouse': null,
            'xArr': null,
            'yArr': null
          };
      var keys = this.seriesKeys,
          len = keys.length;

      for(var i = 0; i < len; i++){
        ttD.series.push({'name': keys[i],'value': null });
      }
    }

    this.set('tooltipData',ttD);
    this.fire('px-vis-tooltip-updated', { 'dataVar': 'tooltipData', 'data': ttD, 'method':'set' });
  },

  _createTooltipDataStub: function(mousePos, timestamp, showTooltip) {
    return {
      'time': timestamp,
      'timeSeriesKey': null,
      'hidden': showTooltip,
      'series': [],
      'seriesObj': {},
      'mouse': mousePos,
      'xArr': [],
      'yArr': [],
      'rawData': [],
      'timeStamps': [],
      'timeStampsTracker': {},
      'additionalPoints': []
    }
  }
}, PxVisBehavior.observerCheck, PxVisBehavior.polarData];

/*
    PxVisBehavior.highlightShared

    Description:
    Behavior providing shared methods and props for highligh compoennts
    @polymerBehavior PxVisBehavior.highlightShared
*/
PxVisBehavior.highlightShared = [{
  properties: {
    /**
     * Boolean indicating if the dataset on this chart is different than the one on the crosshairData's origin chart.
     *
     * NOTE: The chartData passed into the chart MUST be sorted by the timeData for differentDataset to work. This component will not work with unsorted data.
     */
    differentDataset: {
      type: Boolean,
      value: false
    },

    /**
     * The amount +/- around the datapoint
     */
    fuzz: {
      type: Number,
      value: 0
    },

    /**
     * Name of the variable holding the time stamp in the data
     */
    timeData: {
      type: String,
      value: 'Timestamp'
    },

    /**
     * The layers where the series are drawn if you want them to mute on crosshair data
     */
    layersToMask: {
      type: Array
    },

    /**
     * By default, a highlighter will not react to crosshairData if generatingCrosshairData is true. This boolean forces it to draw the crosshairData regardless of the value of generatingCrosshairData
     */
    drawWithLocalCrosshairData: {
      type: Boolean,
      value: false,
      notify: true
    }
  },

  /**
   * Determines if we should do a regular binary search or a fuzzy binary search
   */
  _calcDataset: function() {
    var d = [],
        lowerFuzz,
        upperFuzz;

    for(var i = 0; i < this.crosshairData.timeStamps.length; i++) {

      if(!this.hardMute || !this.mutedSeries[this.crosshairData.timeStamps[i]]) {
        if(this.fuzz) {
          lowerFuzz = this.crosshairData.timeStamps[i] - Number(this.fuzz);
          upperFuzz = this.crosshairData.timeStamps[i] + Number(this.fuzz);

          if(d.length) {
            lowerFuzz = lowerFuzz <= d[d.length-1][this.timeData] ? d[d.length-1][this.timeData] + 1 : lowerFuzz;
          }

          //merge 2 arrays without creating a new one. DON'T use concat here as the GC implications + array
          //duplication are killing perf
          //the only limitation is if the fuzzy search returns more than a few tens of thousands
          //of points since argument length is arbitrarily limited in different  browsers:
          //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
          //in practice we should be ok since each fuzzy search returns result for 1 point, if each point
          //returns tens of thousands we are in an absolutely crazy scenario
          Array.prototype.push.apply(d,this._fuzzyBinarySearch(this.chartData, this.timeData, Number(lowerFuzz), Number(upperFuzz), null, null));
        } else {
          d.push(this._binarySearch(this.chartData, this.timeData, Number(this.crosshairData.timeStamps[i]), null, null));
        }
      }
    }

    return d[0] === null ? [] : d ;
  },


  _generateSeries: function(dataset) {
    var keys = this.seriesKeys,
        arr = [];

    for(var i = 0; i < keys.length; i++) {

      if(!this.hardMute || !this.mutedSeries[keys[i]]) {
        var val = {},
            x = this.completeSeriesConfig[keys[i]]["x"],
            y = this.completeSeriesConfig[keys[i]]["y"],
            coords = [],
            axis = typeof this.y === 'function' ? this.y : this.y[this.completeSeriesConfig[keys[i]]["axis"]['id']];

        val[x] = dataset[x];
        val[y] = dataset[y];

        if(this.radial) {
          var domain = axis.domain(),
              range = axis.range(),
              dr = range[1] - range[0],
              dd = domain[1] - domain[0];
          coords = this._getPixelCoordForRadialData(dataset[x], dataset[y], dr, domain, dd);
        } else {
          coords.push(this.x(val[x]));
          coords.push(axis(val[y]));
        }

        arr.push({
          "name": keys[i],
          "value": val,
          "coord": coords
        });
      } else {
        arr.push({
          "name": keys[i],
          "value": null,
          "coord": []
        });
      }
    }

    return arr;
  },

  _setTooltipData: function(dataset) {
    var ttd = null;

    if(dataset && dataset.length) {
      var timestamp = this.timeData ? dataset[0][this.timeData] : null,
          series = this._generateSeries(dataset[0]);

      if(series.length) {
        ttd = this._createTooltipDataStub(series[0]["coord"], timestamp, !this.hideTooltip);
        ttd.series = series;
        ttd.seriesObj = {};

        ttd.series.forEach(function(item) {
          ttd.seriesObj[item.name] = item;
        });
      }
    }
    this.set("defaultEmptyData", ttd);
  }
}, PxVisBehavior.interactionSpaceShared];

/*
    PxVisBehavior.canvasLayersConfig

    Description:
    Behavior providing the canvasLayersConfig property
    @polymerBehavior PxVisBehavior.canvasLayersConfig
*/
PxVisBehavior.canvasLayersConfig = {
  properties: {
    canvasLayersConfig: {
      type: Object,
      value: function() { return {}; }
    }
  }
};

/*
    PxVisBehavior.highlightCanvasShared

    Description:
    Behavior providing shared methods and props for highligh components
    @polymerBehavior PxVisBehavior.highlightCanvasShared
*/
PxVisBehavior.highlightCanvasShared = [{

  observers: [
    '_requestCanvasCreation(_highlightData, canvasLayersConfig)',
    '_muteDataSeries(_highlightData, layersToMask)',
    '_addTransition(layersToMask)'
  ],

  _muteDataSeries: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(this.layersToMask) {

      if(!Array.isArray(this.layersToMask)) {
        this.toggleClass('secondaryDataMask', this._highlightData.length,this.layersToMask.canvas);

      } else {
        for(var i=0; i<this.layersToMask.length; i++) {
          this.toggleClass('secondaryDataMask', this._highlightData.length, this.layersToMask[i].canvas);
        }
      }
    }
  },

  _addTransition: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(Array.isArray(this.layersToMask)) {
      for(var i=0; i<this.layersToMask.length; i++) {
        this.layersToMask[i].canvas.style.transition = 'opacity 0.2s';
      }
    } else {
      this.layersToMask.canvas.style.transition = 'opacity 0.2s';
    }
  },

  _requestCanvasCreation: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(!this.canvasLayersConfig.highlighter) {
      this.set('canvasLayersConfig.highlighter', {});
    }
  }

}, PxVisBehavior.observerCheck, PxVisBehavior.highlightShared, PxVisBehavior.canvasLayersConfig];


/*
    PxVisBehavior.highlightSvgShared

    Description:
    Behavior providing shared methods and props for highligh compoennts
    @polymerBehavior PxVisBehavior.highlightSvgShared
*/
PxVisBehavior.highlightSvgShared = [{

  observers: [
    '_muteDataSeries(_highlightData, layersToMask)',
    '_addTransition(layersToMask)'
  ],

  _muteDataSeries: function(data) {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(this.layersToMask) {
      if(!Array.isArray(this.layersToMask)) {
        this.toggleClass('secondaryDataMask', data.length, this.layersToMask.node());
      } else {
        for(var i=0; i<this.layersToMask.length; i++) {
          this.toggleClass('secondaryDataMask', data.length, this.layersToMask[i].node());
        }
      }
    }
  },

  _addTransition: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(!Array.isArray(this.layersToMask)) {
      this.layersToMask.node().style.transition = 'opacity 0.2s';
    } else {
      for(var i=0; i<this.layersToMask.length; i++) {
        this.layersToMask[i].node().style.transition = 'opacity 0.2s';
      }
    }
  }

}, PxVisBehavior.observerCheck, PxVisBehavior.highlightShared];

/*
    PxVisBehavior.highlightLineShared

    Description:
    Behavior providing shared methods and props for highlight line compoennts
    @polymerBehavior PxVisBehavior.highlightLineShared
*/
PxVisBehavior.highlightLineShared = [{
  properties: {
    _highlightData: {
      type: Object,
      notify: true
    },

    /**
    * A dev set boolean specifying if the chart is for a parallel coordinates chart
    *
    */
    parallelCoordinates: {
      type: Boolean,
      value: false
    },
    /**
    * A dev set boolean specifying if the line is using radial(polar) data
    *
    */
    radialLine: {
      type: Boolean,
      value: false
    }
  },
  observers: ['_computeChartData(crosshairData.timeStamps.*, drawWithLocalCrosshairData, differentDataset, domainChanged, completeSeriesConfig)'],

  /**
   * Draws the crosshair elements and sets up listeners and callbacks on chart hover
   * Sets the crosshairData property which gets passed to the register.
   *
   */
  _computeChartData: function() {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    this.debounce('_computeHighlightData', function() {
      //if we are generating data locally and not being told to draw anyways, dont draw
      // but if we have cleared our dataset, then we do want to clear our datapoints
      if(this.generatingCrosshairData && !this.drawWithLocalCrosshairData && this.crosshairData.rawData.length > 0) {
        return [];
      }

      var dataset;
      if(this.differentDataset) {
        dataset = this._calcDataset();
      } else {
        if(this.hardMute && this._doesObjHaveValues(this.mutedSeries)) {

          var newRawData = [];
          for(var i=0; i<this.crosshairData.rawData.length; i++) {
            if(!this.mutedSeries[this.crosshairData.rawData[i][this.timeData]]) {
              newRawData.push(this.crosshairData.rawData[i]);
            }
          }
          dataset = newRawData;
        } else {
          dataset = this.crosshairData.rawData;
        }
      }

      if(this.showTooltipData) {
        this._setTooltipDataMultiLine(dataset);
      }

      this.set('_highlightData', dataset);
      this.fire('px-vis-highlight-data-changed');
    }.bind(this), 5);
  },


  _setTooltipDataMultiLine: function(dataset) {
    if(!this.canvasContext && this._isD3Empty(this.svg)) { return; }

    var d;
    if(dataset.length && dataset[0]) {
      d = this._createMultilineTooltipData(dataset[0], false);
      this.set('defaultEmptyData', d);
      this.dispatchEvent(new CustomEvent('px-vis-axis-interaction-space-tooltip-data', { bubbles: true, composed: true, detail: this.defaultEmptyData }));

    } else {
      d = this._resetMultilineTooltipData();
      this.set('defaultEmptyData', d);
      this.dispatchEvent(new CustomEvent('px-vis-axis-interaction-space-reset-tooltip', { bubbles: true, composed: true, detail: this.defaultEmptyData}));
    }
  },

  _resetMultilineTooltipData: function() {

    return {
        "mouse": null,
        "dataPos": [-1000, -1000],
        "time": null,
        "dataset": null,
        'series': [],
        'seriesObj': {},
        "color": null,
        "tooltipConfig": null
      };
  },

  _createMultilineTooltipData: function(dataset, svg) {
    var last = this.dimensions[this.dimensions.length-1],
        data,     //our tooltipData obj
        screenX,  //the mouse x on the scree
        screenY,  //the mouse y on the scree
        svgBounding,  //bounding rect of our svg
        tooltipConfig = {},  //a fake configuration object we will build
        value = {},          //the series obj within tooltipData
        series = [],
        seriesObj = {},
        max = -Number.MAX_VALUE,
        val,
        dim;

      //calc the screen positions for the tooltip
      if(this.radialLine) {

        //find the most right axis in an attempt to not have the tooltip cover the chart
        for(var i=0; i<this.dimensions.length; i++) {
          dim = this.dimensions[i];
          val = this.y(dataset[dim]) * Math.sin(this.x(dim));
          if(val > max) {
            last = dim;
            max = val;
          }
        }
      }

      for(var i = 0; i < this.dimensions.length; i++) {
        var aid = this.dimensions[i];
        value = {};
        //create our fake configuration object
        tooltipConfig[aid] = {};

        //if using categories, use it, otherwise default
        if(this.categoryKey && dataset[this.categoryKey]) {
          tooltipConfig[aid]["color"] = this.completeSeriesConfig[dataset[this.categoryKey]].color;
        } else {
          tooltipConfig[aid]["color"] = this.completeSeriesConfig[this.seriesId]["color"];
        }

        //if title is specified, use it, otherwiuse id
        tooltipConfig[aid]["name"] = this.completeSeriesConfig[aid] && this.completeSeriesConfig[aid]['title'] ?                          this.completeSeriesConfig[aid]["title"] : aid;

        //if there is a unit, add it
        tooltipConfig[aid]["yAxisUnit"] = this.completeSeriesConfig[aid] && this.completeSeriesConfig[aid]["yAxisUnit"] ? this.completeSeriesConfig[aid]["yAxisUnit"] : '';

        //add the y series id
        tooltipConfig[aid]['y'] = aid;

        //create our value obj
        value[aid] = dataset[aid];
        series.push({ 'name': aid, 'value': value });
        seriesObj[aid] = {'name': aid, 'value': value};
      }

      //create our tooltipData obj
      data = {
        'mouse': null,
        'time': dataset[this.timeData],
        'dataset': dataset,
        'yVal': dataset[last],
        'series': series,
        'seriesObj': seriesObj,
        'color': tooltipConfig[aid]['color'],
        'tooltipConfig': tooltipConfig,
        'axis': last
      };

    return data;
  }
}, PxVisBehavior.observerCheck, PxVisBehavior.highlightShared, PxVisBehavior.margins];

/*
    Name:
    PxVisBehavior.preventWebWorkerSynchronization

    Description:
    Polymer behavior that provides the preventWebWorkerSynchronization property

    @polymerBehavior PxVisBehavior.preventWebWorkerSynchronization
*/
PxVisBehavior.preventWebWorkerSynchronization = {
  properties: {
      /**
       * Prevents the chart from synchronizing its data with a webworker.
       * This can be turned on to minimize the memory footprint of the
       * chart
       * WARNING: turning the synchronization off will:
       * - prevent the chart from being able to use crosshair feature
       * - slow down data search for tooltip/register
       * - slow down calculating extents for the chart if it needs to
       *
       * We advise against turning it off but it might be beneficial in
       * specific scenarios (high number of small charts with minimum
       * interaction for example)
       */
      preventWebWorkerSynchronization: {
        type: Boolean,
        value: false
      }
  }
};

/*
    Name:
    PxVisBehavior.wwDataSyncCounter

    Description:
    Polymer behavior that provides the wwDataSyncCounter property

    @polymerBehavior PxVisBehavior.wwDataSyncCounter
*/
PxVisBehavior.wwDataSyncCounter = {
  properties: {
    /**
     *  Updated every time the chart gets new data and a sync request
     * to the web worker happened. Use it for triggering observers
     * instead of chartData if the observer needs the data in the webworker
     * (i.e kicking another webworker processing)
     */
    wwDataSyncCounter: {
      type: Number
      //don't set a default value unless you really know what you're doing
    }
  }
};

/*
    Name:
    PxVisBehavior.stripProperties

    Description:
    Polymer behavior that provides the stripProperties property

    @polymerBehavior PxVisBehavior.stripProperties
*/
PxVisBehavior.stripProperties = {
  properties: {
    /**
     * Configuration file for the striping.
     *
     * Example:
     * {
     *  "stripe1": {
     *       fillColor: "rgb(255,0,0)",
     *       fillOpacity: 0.5
     *  },
     *  "stripe2": {
     *       fillColor: "rgb(0, 255,0)",
     *       fillOpacity: 0.5
     *       dash: [5,2]
     *   }
     * }
     *
     * `dash` option is for single timestamp entries. This will draw a dashed line instead of an area. Default dash pattern is [5,2]. To create a solid line instead, put [0]
     */
    stripeConfig: {
      type: Object
    },
    /**
     * Data to create the striping. A list of start and end pairs for each strip type
     *
     * Example:
     * {
     *  "stripe1": [
     *    [t1, t2],
     *    [t3, t4]
     * ],
     *  "stripe2": [
     *    [t5, t6],
     *    [t7, t8]
     * ]
     * }
     */
    stripeData: {
      type: Object,
      notify: true,
      value: function() { return {}; }
    },
    stripeType: {
      type: String
    }
  }
};

/**
    Name:
    PxVisBehavior.rendererType

    Description:
    Polymer behavior that provides a rendererType property to components.


    @polymerBehavior PxVisBehavior.rendererType
*/
PxVisBehavior.rendererType = {
  properties: {
    /**
    * Type of renderer this drawing element should be using. Determines on what
    * condition the element is going to be drawn
    * - chartData
    * - filteredChartData
    * - highlightData
    */
    rendererType: {
      type: String,
      value: 'chartData'
    }
  }
};


/**
    Name:
    PxVisBehavior.updateStylesOverride

    Description:
    Polymer behavior that overrides updateStyles so we can trigger a redraw.


    @polymerBehavior PxVisBehavior.updateStylesOverride
*/
PxVisBehavior.updateStylesOverride = {
  properties: {
    _updateStyles: {
      type: Function
    },
    _stylesUpdated: {
      type: Number,
      value: 0
    }
  },

  created: function() {
    /*
      Polymer provides the updateStyles method.
      This method is called when we reload a theme.
      We want to update our _stylesUpdated prop when it is called
      so, remap Polymer.updateStyles to _updateStyles and then rewrite
      this.updateStyles to do what we want
    */
    this._updateStyles = this.updateStyles;
    this.updateStyles = function() {
      this.debounce('styleupdate', function() {
        this._updateStyles();

        var t = this.drawDebounceTime;
        this.drawDebounceTime = 0;

        this.set('_stylesUpdated',  this._stylesUpdated+ 1);

        this.drawDebounceTime = t;
      }, 50);
    }
  }
};


/**
    Name:
    PxVisBehavior.timeDomain

    Description:
    Polymer behavior that providse the timeDomain property.


    @polymerBehavior PxVisBehavior.timeDomain
*/
PxVisBehavior.timeDomain = [{
  properties: {
    /**
     * Can be used to define a time domain to be used, typically to restrain/filter the amount
     * of data displayed. Can be used in combination with a px-vis-chart-navigator
     */
    timeDomain: {
      type: Object,
      value: function() {
        return {};
      }
    },
    timeKey: {
      type: String
    }
  },
  observers: [
    '_timeDomainChartData(chartData, timeKey)'
  ],

  _timeDomainChartData: function() {
    if(this.timeKey && this.chartData && this.chartData.length && (!this._doesObjHaveValues(this.timeDomain) || !this.timeDomain.x || this.timeDomain.x.length === 0)) {

      let domain = {};
      if(this.timeDomain && this.timeDomain.y) {
        domain.y = this.timeDomain.y;
      }
      domain.x = [this.chartData[0][this.timeKey], this.chartData[this.chartData.length - 1][this.timeKey]];
      this.set('timeDomain', domain);
    }
  }
}, PxVisBehavior.dataset, PxVisBehavior.commonMethods];

/**
    Name:
    PxVisBehavior.axesDomain

    Description:
    Polymer behavior that providse the axesDomain property.


    @polymerBehavior PxVisBehavior.axesDomain
*/
PxVisBehavior.axesDomain = {
  properties: {
    /**
     * New chart extents selected by the user
     *
     * Serves as a trigger for the scale component to redefine the chart extents
     *
     */
    axesDomain: {
      type: Object,
      value: function() {
        return {};
      }
    }
  }
};

/**
    Name:
    PxVisBehavior.brushDomains

    Description:
    Polymer behavior that providse the brushDomains property.


    @polymerBehavior PxVisBehavior.brushDomains
*/
PxVisBehavior.brushDomains = {
  properties: {
    /**
     * Holder for all domains from brushes
     *
     * Chart expects a set of brushDomains by type
     * {
     *    type1: {
     *      axis1: [min, max],
     *      axis2: [min, max]
     *    },
     *    type2: {
     *      axis1: [min, max],
     *      axis2: [min, max]
     *    }
     * }
     */
    brushDomains: {
      type: Object,
      value: function() {
        return {};
      }
    }
  }
};

/**
    Name:
    PxVisBehavior.annotationData

    Description:
    Polymer behavior that providse the annotationData property.


    @polymerBehavior PxVisBehavior.annotationData
*/
PxVisBehavior.annotationData = {
  properties: {
    /**
     * The annotation data: x and y values + the series which scale should be used.
     * Data is an arbitrary object you want to store for use when showing the
     * annotation
     * ```
     *    [{
     *        x: 1325897523,
     *        y: 15.7,
     *        series: y0,
     *        data: {...}
     *    },{
     *     ...
     *     }]
     * ```
     */
    annotationData: {
      type: Array,
      value: function() {
        return [];
      }
    },

    showStrongIcon: {
      type: Boolean,
      value: false
    }
  }
};

/**
    Name:
    PxVisBehavior.titleTruncation

    Description:
    Polymer behavior that providse the titleTruncation property.


    @polymerBehavior PxVisBehavior.titleTruncation
*/
PxVisBehavior.titleTruncation = {
  properties: {
    /**
    * A boolean specifying if the axis title should truncate when too long
    *
    */
    titleTruncation: {
      type: Boolean,
      value: false
    },
  }
};

/**
    Name:
    PxVisBehavior.scaleTypeCheck

    Description:
    Polymer behavior that providse the scaleTypeCheck property.


    @polymerBehavior PxVisBehavior.scaleTypeCheck
*/
PxVisBehavior.scaleTypeCheck = {
  _isTimeType: function(scale) {
    return scale === 'time' || scale === 'timeLocal'
  },

  _isOrdinalType: function(scale) {
    return scale === 'ordinal' || scale === 'scaleBand'
  }
};

/**
    Name:
    PxVisBehavior.referenceCurveProps

    Description:
    Polymer behavior that provide the properties for the reference curve.


    @polymerBehavior PxVisBehavior.referenceCurveProps
*/
PxVisBehavior.referenceCurveProps = {
  properties: {
    /**
    * Data to create reference curves. Format matches chartData and requires a referenceConfig with similar props to seriesConfig.
    *
    */
    referenceData: Array,

    /**
    * A configuration object needed to draw reference curves. Format is similar to seriesConfig. Valid entries:
    * - `x` : default: 'x'
    * - `y`: default: 'y'
    * - `interpolationFunction` : default: Px.d3.curveCardinal
    * - `color` :
    * - `strokeWidth` default: 1
    *
    */
    referenceConfig: Object,
  }
};

/**
    Name:
    PxVisBehavior.showHideClasses

    Description:
    Polymer behavior that providse the _show and _hide methods used for
    hiding an element through css classes


    @polymerBehavior PxVisBehavior.showHideClasses
*/
PxVisBehavior.showHideClasses = {

  /**
   * Will add 'hide' class if any of the arguments is falsy
   * (so shows if everything truthy)
   */
  _show: function() {

    for(var i=0; i<arguments.length; i++) {
      if(!arguments[i]) {
        return 'hide';
      }
    }

    return '';
  },

  /**
   * Will add 'hide' class if all arguments are not falsy
   * (so hides if everything truthy)
   */
  _hide: function() {

    for(var i=0; i<arguments.length; i++) {
      if(!arguments[i]) {
        return '';
      }
    }

    return 'hide';
  },
};

/**
    Name:
    PxVisBehavior.gradientColorsProperty

    Description:
    Polymer behavior that defines the color gradient Array/String/Function input


    @polymerBehavior PxVisBehavior.gradientColorsProperty
*/
PxVisBehavior.gradientColorsProperty = {
  properties: {
    /**
     * Colors used to create a gradient. Can be one of the folowing:
     * - A single color (string), resulting in that color being applied for the whole "gradient"
     * - An Array of colors from which a linear gradient while be created
     * - A custom function that defined a gradient. The function takes an input that will be between 0 and 1 and should return a color based on that input.
     * - A d3 chromatic scale, which is effectively a function as described above with predefined colors. Please see the "interpolate" functions at https://github.com/d3/d3-scale-chromatic
     * @type {Array|String|Function}
     */
     gradientColors: {
      type: Array
    }
  }
};

/**
    Name:
    PxVisBehavior.gradientColorsFunction

    Description:
    Polymer behavior that defines the color gradient function based on an
    Array/String/Function input


    @polymerBehavior PxVisBehavior.gradientColorsFunction
*/
PxVisBehavior.gradientColorsFunction = {
  properties: {
    /**
     *
     */
    gradientColorsMin :{
      type: Number,
      value: 0
    },
    /**
     *
     */
    gradientColorsMax: {
      type: Number,
      value: 1
    },
  },

  /**
   * Computes the data range.
   *
   */
   _computeGradientRange: function(timeDomain) {

    if(timeDomain && timeDomain.x && timeDomain.x.length > 0) {
      this.set('gradientColorsMin', Number(timeDomain.x[0]));
      this.set('gradientColorsMax', Number(timeDomain.x[1]));
    }
  },

  createGradientFunction: function(colors) {
    if(colors) {
      if(typeof colors === 'string') {
        return function() {
          return colors;
        }
      } else if(Array.isArray(colors)) {

        let fn;
        if(colors.length === 2) {
          fn = Px.d3.interpolateRgb(colors[0], colors[1]);
        } else {
          fn = Px.d3.interpolateRgbBasis(colors);
        }
        return function(val) {
          return fn(this._normalizeValue(val));
        }.bind(this);
      } else if(typeof colors === 'function') {
        return function(val) {
          return colors(this._normalizeValue(val));
        }.bind(this);
      } else {
        console.warn('Color gradient ' + colors + ' has an invalid type. Should be string, array or function');
      }
    }
  },

  _normalizeValue: function(val) {
    if(this.gradientColorsMin === this.gradientColorsMax) {
      return 0;
    } else {
      return (val - this.gradientColorsMin) / (this.gradientColorsMax - this.gradientColorsMin);
    }
  }
};