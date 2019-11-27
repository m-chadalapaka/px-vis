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
import './px-vis-behavior-common.js';

import './px-vis-behavior-d3.js';
import './px-vis-behavior-datetime.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { flush, dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
var PxVisBehaviorChart = window.PxVisBehaviorChart = (window.PxVisBehaviorChart || {});

/*
    Name:
    PxVisBehaviorChart.searchToolbar

    Description:
    Behavior providing a convenience function for searching for a toolbar in a chart
    @polymerBehavior PxVisBehaviorChart.searchToolbar
*/
PxVisBehaviorChart.searchToolbar = {

  /**
   * Convenience method for searching for a toolbar in a chart.
   */
  getToolbar: function() {
    return this.$$('px-vis-toolbar');
  }
};

/*
    Name:
    PxVisBehaviorChart.chartCommonMethods

    Description:
    Polymer behavior that provides some general methods used accross charts

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.chartCommonMethods
*/
PxVisBehaviorChart.chartCommonMethods = [{
  /**
  * Goes through an array of objects and gathers all unique keys. Returns a list of keys
  *
  * Expects and array of objects
  *
  * Returns an array of strings
  */
  _returnAllKeys: function(d) {
    var o = {},
        k;
    for(var i = 0; i < d.length; i++) {
      k = Object.keys(d[i]);
      for(var j = 0; j < k.length; j++) {
        o[k[j]] = true;
      }
    }
    return Object.keys(o)
  },
}, PxColorsBehavior.getSeriesColors, PxVisBehaviorChart.searchToolbar];

/*
    Name:
    PxVisBehaviorChart.chartCommon

    Description:
    Polymer behavior that provides the basic listeners and methods for charts built with px-vis.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.chartCommon
*/
PxVisBehaviorChart.chartCommon = [{
    properties: {
      /**
      * A configuration file to associate series order, name, type, and colors.
      *
      * Association of name, type, and seriesNumber should be developer set. Color and axis are optional.
      *
      *```
      *  {
      *     "seriesKey": {  //seriesKey is a unique identifier for the configuration
      *         "type": "line",  //line or scatter or both
      *         "priority": 0, //relative priority is used to decide which series draw on top of each other. priority 0 => smaller priority. 2 draws over 1, which itself draws over 0, etc.. CANVAS ONLY
      *         "markerSymbol": "diamond" //if using scatter different markerSymbol can be used. See "markerSymbol" in px-vis-scatter
      *         "markerSize": "64" //if using scatter allows to change the size of markers
      *         "markerScale": "2" //if using scatter allows to scale the size of markers
      *         "markerFillOpacity": "0.5" //if using scatter allows to specify the opacity of the inside of the marker
      *         "markerStrokeOpacity": "1" //if using scatter allows to specify the opacity of the outside of the marker
      *         "strokeWidth": "1" //if using line, allows you to specify the thickness of the line
      *         "mutedOpacity": "0.3" //opacity value to use when muting a serie
      *         "name": "My Series",  //human readable name
      *         "x": "x",  //index or key name for independent variable
      *         "y": "y",  //index or key name for dependent variable
      *         "xAxisUnit": "Volt" //Unit to be used for the X axis. Can be ignored if x axis is time based
      *         "yAxisUnit": "Oranges" //unit to be used for the Y axis.
      *         "xMin": 0,  // minimum x value
      *         "xMax": 100,  //maximum x value
      *         "yMin": 5,  //minimum y value
      *         "yMax": 50,  //maximum y value
      *         "hideInRegister": true, //dont show in the register
      *         "color": "rgb(0,0,0)", //color you want for the series
      *         "negativeColor": "rgb(255,255,255)", //color you want negative values of the series to be (not all charts)
      *         "interpolationFunction": Px.d3.curveBasis, //The line interpretor you want to use. See property 'interpolationFunction'
      *         "axis": {
      *             "id": "AXIS_ID"   //a unique identifier
      *             "side": "left"    //the side that you want the axis to draw on, `left` or `right`
      *             "number": 1       //the order of the axis on each side
      *          }
      *     }
      *  }
      *```
      */
      seriesConfig: {
        type: Object,
        value: function() {
          return {}
        }
      },

      /**
      * A default configuration file. It fills in the missing parts of seriesConfig. Any options from seriesConfig can be specified in the defaultSeriesConfig and will be automatically used if not defined in the seriesConfig
      *
      * Default:
      *
      * ```
      *  {
      *     "type": "line",
      *     "x": 'x',
      *     "axis": {
      *       "id": "defaultAxis",
      *       "side": "left",
      *       "number": 1
      *   }}
      * ```
      */
      _defaultSeriesConfig: {
        type: Object,
        value: function() {
          return {
            "type": "line",
            "x": 'x',
            "axis": {
              "id": "defaultAxis",
              "side": "left",
              "number": 1
            }
          }
        }
      },

      /**
      * Overwrites to the default configuration file. The defaultSeriesConfig is used to fill in the missing parts of seriesConfig. Any option from seriesConfig can be specified in the defaultSeriesConfig and will be automatically used if not defined in the seriesConfig
      *
      */
      defaultSeriesConfig: {
        type: Object,
        value: function() { return {}; },
        observer: '_updateDSC'
      },

      /**
      * A boolean flag on whether to include all the series in the data.
      * - `false`: only series defined in the seriesConfig file will be drawn
      * - `true`: All series in the dataset will be drawn. Defaults will be used for the seriesConfig. If this is used do not specify a seriesConfig
      */
      includeAllSeries: {
        type: Boolean,
        value: false
      },
      /**
       *  Representes the keys avaiable in completeSeriesConfig. It's being set
       *  before completeSeriesConfig is set
       */
      _seriesKeys: {
        type: Array
      },

      preventCompleteSeriesConfigCalc: {
        type: Boolean,
        value: false
      }
    },

    observers: [
      '_setCompleteSeriesConfig(_defaultSeriesConfig.*,chartData.*,seriesConfig.*,seriesColorList.*)'
    ],

    /**
    * Calcs the extents of the charts
    */
    _calcChartExts: function(mins,maxes,axis) {
      if(this._isOrdinalType(this[axis + 'AxisType'])) {
        return [];
      }
      //make sure we have at lease one valid number
      mins.push(Infinity);
      maxes.push(-Infinity);

      return [ Math.min.apply(null, mins) , Math.max.apply(null, maxes) ];
    },

    /**
    * Creates the real series confit object based on the default settings, the dev defined series config, and the includeAllSeries flag.
    *
    */
    _setCompleteSeriesConfig: function() {
      if(this.hasUndefinedArguments(arguments)) {
        return;
      }

      if(this._doesObjHaveValues(this._defaultSeriesConfig) && this._doesObjHaveValues(this.chartData) && this._doesObjHaveValues(this.seriesColorList) && !this.preventCompleteSeriesConfigCalc) {
        // FUTURE TODO refactor: use MAPs and SETs instead of Objects when IE has support / is no longer supported by us
        // We could use d3 sets and maps... worth it?
        var fullConfig = (this.seriesConfig) ? this.clone(this.seriesConfig) : {},
            k = Object.keys(fullConfig),
            kLen = k.length,
            allYs = (this.includeAllSeries) ? this._returnAllKeys(this.chartData) : [],
            // create a new object with the y keys as config keys
            objYs = allYs.reduce(function(obj, item) {
              obj[item] = {};
              return obj;
            }, {}),
            defaultConfigProps = Object.keys(this._defaultSeriesConfig),
            xMins = [],
            xMaxes = [],
            yMins = [],
            yMaxes = [],
            missingYs,
            x,
            isUpdate = this.completeSeriesConfig ? true : false,
            addedSeriesKeys = [],
            removedSeriesKeys = [],
            updatedSeriesKeys = [],
            extsObj = {},
            skipProperties = ['xMin','xMax','yMin','yMax'];

        // First, fill in the series specified in seriesConfig.
        for(var i = 0; i < kLen; i++) {
          if(!fullConfig[k[i]].hasOwnProperty('y')) {
            console.warn("(✿◠‿◠) Configuration " + k[i] + " does not have a y-value associated with it. Falling back to ID (✿◠‿◠)");
            fullConfig[k[i]]['y'] = k[i];
          }

          if(!fullConfig[k[i]].hasOwnProperty('x')) {
            if(!this.defaultSeriesConfig['x']) {
              console.warn("(｡◕‿◕｡) Configuration " + k[i] + " does not have a x-value associated with it. Falling back to default (｡◕‿◕｡)");
            }
            fullConfig[k[i]]['x'] = this._defaultSeriesConfig['x'];
          }

          if(!fullConfig[k[i]]['name']) {
            fullConfig[k[i]]['name'] = k[i];
          }
          if(!fullConfig[k[i]]['color'] && !this._dontCalcColors) {
            fullConfig[k[i]]['color'] = this._getColor(i);
          }

          //copy values from default config if needed
          for(var j = 0; j < defaultConfigProps.length; j++) {
            var property = defaultConfigProps[j];

            //if we dont already have the property, the default exists, and we want to copy the property
            if(typeof fullConfig[k[i]][property] === 'undefined' && typeof this._defaultSeriesConfig[property] !== 'undefined' && skipProperties.indexOf(property) === -1) {
              fullConfig[k[i]][property] = this._defaultSeriesConfig[property];
            }
          }

          if(fullConfig[k[i]]['xMin']) {
            xMins.push(fullConfig[k[i]]['xMin']);
          }
          if(fullConfig[k[i]]['xMax']) {
            xMaxes.push(fullConfig[k[i]]['xMax']);
          }
          if(fullConfig[k[i]]['yMin']) {
            yMins.push(fullConfig[k[i]]['yMin']);
          }
          if(fullConfig[k[i]]['yMax']) {
            yMaxes.push(fullConfig[k[i]]['yMax']);
          }

          // delete this y / key from objYs if includeAllSeries is on so we have a unique set
          delete objYs[ fullConfig[k[i]]['y'] ];
        }

        // delete the 'x' key from our all y keys obj

        //figure out what x is, either a config value (assuming all x are the same) or the default
        if(this.includeAllSeries) {
          x = this.defaultSeriesConfig['x'] ? this.defaultSeriesConfig['x'] : this._defaultSeriesConfig['x'];
        } else {
          x = (k.length > 0) ? fullConfig[k[0]]['x'] : this._defaultSeriesConfig['x'];
        }

        delete objYs [x];

        // create a new set of whatever Ys are left so we can iterate over it
        missingYs = Object.keys(objYs);
        // add the missing keys to our configuration, use y as the config key by default
        for(var i = 0; i < missingYs.length; i++) {
          // copy all vals from the default
          objYs[ missingYs[i] ] = JSON.parse(JSON.stringify(this._defaultSeriesConfig));
          //overwrite specific keys
          objYs[ missingYs[i] ]['name'] = missingYs[i];
          objYs[ missingYs[i] ]['x'] = x;
          objYs[ missingYs[i] ]['y'] = missingYs[i];
          if(!this._dontCalcColors) {
            objYs[ missingYs[i] ]['color'] = this._getColor(kLen + i);
          }

          // copy the obj to our config
          fullConfig[ missingYs[i] ] = objYs[ missingYs[i] ];
        }

        if(this.range) {
          var min = Number(Px.moment(this.range.from, Px.moment.ISO_8601).format('x')),
              max = Number(Px.moment(this.range.to, Px.moment.ISO_8601).format('x'));
          extsObj["x"] = [min,max];
        }

        if(!extsObj.x) {
          extsObj['x'] = this._calcChartExts(xMins,xMaxes,'x');
        }
        if(!extsObj.y) {
          extsObj['y'] = this._calcChartExts(yMins,yMaxes,'y');
        }

        //if this is an update bof series config find out additions/deletions
        var deletion = false,
            addition = false,
            mutedKeys = [];

        if(isUpdate) {
          var currKeys = Object.keys(this.completeSeriesConfig),
              newKeys = Object.keys(fullConfig);

          //process updates and additions
          for(var i=0; i<newKeys.length; i++) {
            if(currKeys.includes(newKeys[i])) {
              updatedSeriesKeys.push(newKeys[i]);
            } else {
              addedSeriesKeys.push(newKeys[i]);
              addition = true;
            }
          }

          //process deletions
          for(var i=0; i<currKeys.length; i++) {
            if(!newKeys.includes(currKeys[i])) {
              removedSeriesKeys.push(currKeys[i]);
              deletion = true;
            }
          }
        }

        if(deletion) {
          // check mutedSeries
          if(this.mutedSeries) {
            for(var i = 0; i < removedSeriesKeys.length; i++) {
              //if it is currently muted, unmute it.
              if(this.mutedSeries[removedSeriesKeys[i]]) {
                this.muteUnmuteSeries(removedSeriesKeys[i]);
                mutedKeys.push(removedSeriesKeys[i]);
              } else if(typeof this.mutedSeries[removedSeriesKeys[i]] === 'boolean') {
                mutedKeys.push(removedSeriesKeys[i]);
              }
            }
          }

          //we need to flush before setting completeSeriesConfig for deletion
          //but need setting completeSeriesConfig before flushing for additions.
          //Process the deletions first and we will process the addtions after setting
          //completeseriesconfig (if needed)
          this.set('_seriesKeys', updatedSeriesKeys);

          //make sure we flush for all the components dom-repeating over _seriesKeys:
          //if a serie needs to be removed this should be processed before we pass
          //the new completeSeriesConfig or observers will run on the not-yet deleted serie
          flush();

          //clear out mutedSeries of the deleted stuff
          if(mutedKeys.length > 0) {
            for(var i = 0; i < mutedKeys.length; i++) {
              delete this.mutedSeries[mutedKeys[i]];
            }
          }
        } else {
          //update or addition
          this.set('_seriesKeys', Object.keys(fullConfig));
        }

        this.fire('px-vis-data-extents', { 'dataVar': 'dataExtents', 'data': extsObj, 'method':'set' });
        this.set('dataExtents', extsObj);

        this.fire('px-vis-complete-series-config', { 'dataVar': 'completeSeriesConfig', 'data': fullConfig, 'method':'set' });
        this.set('completeSeriesConfig', fullConfig);

        if(deletion && addition) {
          //we have processed updates and deleton, now need to process the additions
          //now that we have the new completeSeriesConfig process the additions
          this.set('_seriesKeys', Object.keys(fullConfig));
        }

      } else if(this.chartData && this.chartData.length === 0) {
        this.set('_seriesKeys', []);
        flush();
      }
    },

    /**
     * Helper function for the register. Returns true if the side register should exist
     *
     */
    _sideRegister:function(location) {
      return location === 'side' || location === 'both';
    },

    /**
     * Helper function for the register. Returns true if the top register should exist
     *
     */
    _topRegister:function(location) {
      return location === 'top' || location === 'both';
    },

    /**
     * Helper function for the line series. Returns true if the series is a line
     *
     */
    _chartTypeLine: function(key,obj) {
      if(this.hasUndefinedArguments(arguments)) {
        return;
      }
      return obj && obj[key] && (obj[key]['type'] === 'line' || obj[key]['type'] === 'both');
    },

    /**
     * Helper function for the line series. Returns true if the series is a line
     *
     */
    _chartTypeScatter: function(key,obj) {
      if(this.hasUndefinedArguments(arguments)) {
        return;
      }
      return obj && obj[key] && (obj[key]['type'] === 'scatter' || obj[key]['type'] === 'both');
    },

    /**
     * returns the keys of an object
     *
     */
    _returnKeys: function(obj) {
      return Object.keys(obj);
    },

    _updateDSC: function(dsc) {
      if(dsc === undefined) {
        return;
      }

      var k = Object.keys(this.defaultSeriesConfig),
          val;

      for(var i = 0; i < k.length; i++) {
        val = this.defaultSeriesConfig[k[i]];
        this._defaultSeriesConfig[k[i]] = val;
      }

      this.notifyPath('_defaultSeriesConfig');
    }

},
  PxVisBehavior.observerCheck,
  PxColorsBehavior.dataVisColors ,
  PxVisBehaviorChart.chartCommonMethods,
  PxVisBehavior.commonMethods,
  PxVisBehavior.completeSeriesConfig,
  PxVisBehavior.axisTypes,
  PxVisBehavior.muteUnmuteSeries,
  PxVisBehavior.scaleTypeCheck
];


/*
    Name:
    PxVisBehaviorChart.chartId

    Description:
    Polymer behavior that allows the chart to have a unique ID

    @polymerBehavior PxVisBehaviorChart.chartId
*/
PxVisBehaviorChart.chartId = [{

  properties: {
      /**
       * Internal unique ID
       */
      chartId: {
        type: String
      },
  }
},  PxVisBehavior.uniqueIds];

/*
    Name:
    PxVisBehaviorChart.webWorkerSynchronization

    Description:
    Polymer behavior that allows the chart to keep its data synced in a web worker

    @polymerBehavior PxVisBehaviorChart.webWorkerSynchronization
*/
PxVisBehaviorChart.webWorkerSynchronization = [{
    properties: {
      _wwSyncRequestDataDeletion: {
        type: Boolean,
        value: false
      },
      _wwSyncDataDeleted: {
        type: Boolean,
        value: false
      },
      /**
       * After detaching the chart time after which we will delete
       * the synced data of the chart from the webworker. If the
       * chart is re-attached in the meantime the deletion will
       * be canceled to avoid a re-sync
       */
      _wwSyncDataDeletionTimeout: {
        type: Number,
        value: 1500
      },
      /**
       * Name of the property to be kept in sync. Usually chartData but can
       * be overriden for a filtered dataset instead for example
       */
      _wwSyncDataPropName: {
        type: String,
        value: 'chartData'
      }
    },
    ready: function() {
      this.chartId = this.generateRandomID('chart');
    },
    attached: function() {
      if(!this.preventWebWorkerSynchronization) {
        this._wwSyncRequestDataDeletion = false;

        //request a data update if we have been detached, data has
        //been deleted and then re attached
        if(this.chartData && this._wwSyncDataDeleted) {

          this._keepDataInSync();
        }
      }
    },
    detached: function() {
      if(!this.preventWebWorkerSynchronization) {

        this._wwSyncRequestDataDeletion = true;

        window.setTimeout(function() {

          //only process if we haven't been re attached
          if(this._wwSyncRequestDataDeletion) {
          Px.vis.scheduler.process({
            'action': 'unregisterChart',
            'originatorName': this.nodeName,
            'chartId': this.chartId,
            'data': null});

            //async, the data hasn't been actually deleted yet but we
            //don't have a way to cancel it anymore and an update
            //request would always queue after this request
            this._wwSyncDataDeleted = true;

            //do we need this?
            //this.set('wwDataSyncCounter', 0);
          }
        }.bind(this), this._wwSyncDataDeletionTimeout);
      }
    },
    _keepDataInSync: function() {
      if(this.hasUndefinedArguments(arguments)) {
        return;
      }
      if(!this.preventWebWorkerSynchronization && this[this._wwSyncDataPropName]) {
        this._wwSyncDataDeleted = false;
        Px.vis.scheduler.process({
            'action': 'updateData',
            'originatorName': this.nodeName,
            'chartId': this.chartId,
            'data': {'chartData': this[this._wwSyncDataPropName]}});
        this.set('wwDataSyncCounter', this.wwDataSyncCounter ? this.wwDataSyncCounter+1 : 1);
      }
    }
}, PxVisBehavior.observerCheck, PxVisBehavior.dataset, PxVisBehavior.preventWebWorkerSynchronization, PxVisBehavior.wwDataSyncCounter];

/*
    Name:
    PxVisBehaviorChart.saveImage

    Description:
    Polymer behavior that allows the chart to return an image of itself based on
    its canvas and/or SVG

    @polymerBehavior PxVisBehaviorChart.saveImage
*/
PxVisBehaviorChart.saveImage = [{
    /**
     * Takes a graphic "snapshot" of the component and pass results through a callback:
     * - a canvas containing the graphical snapshot
     * - a png base 64 data uri
     *
     * callback object:
     * {
     *  canvas: theCanvasObject
     *  image: "data:image/png;base64;iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACN..."
     * }
     *
     * the data uri can be used to save the image and the canvas object to do
     * further processing, such as combining different elements snapshot into one image
     *
     */
    getImage: function(callback, renderLegend) {
      //create a new canvas to render both the canvas and svg elements on it
      var canvas = document.createElement('canvas'),
          context,
          result,
          svgData,
          elementsToRender = [],
          canvasKeys = Object.keys(this.canvasLayers),
          //try to fetch extendeWwidth, then smaller side, then width
          drawingWidth = this._extendedWidth ? this._extendedWidth : (this._smallerSide ? this._smallerSide : this.width),
          drawingHeight = this._smallerSide ? this._smallerSide : this.height;

      canvas.width = drawingWidth + (renderLegend ? this._getRegisterWidth(drawingWidth, drawingHeight) : 0);

      canvas.height = drawingHeight;
      context = canvas.getContext('2d');

      //draw in the same order as px-vis-svg-canvas....
      //true = svg, false = canvas
      elementsToRender.push([this.pxSvgElemLower, true]);
      elementsToRender.push([this.canvasContext, false]);
      for(var i=0; i<canvasKeys.length; i++) {
        elementsToRender.push([this.canvasLayers[canvasKeys[i]], false]);
      }
      elementsToRender.push([this.pxSvgElem, true]);

      //now render all elements found
      var fn = function() {

        if(elementsToRender.length>0) {
          var target = elementsToRender.shift();

          //if this element is defined
          if(target[0]) {
            if(!target[1]) {
              //canvas
              var opacity = getComputedStyle(target[0].canvas).getPropertyValue('opacity'),
                  context = canvas.getContext('2d'),
                  oldAlpha = context.globalAlpha;

              context.globalAlpha = opacity;
              context.drawImage(target[0].canvas, 0, 0);
              context.globalAlpha = oldAlpha;

              //if we have more element keep drawing, else finish
              if(elementsToRender.length > 0) {
                fn();
              } else {
                this._finishGetImage(callback, canvas, renderLegend, drawingWidth, drawingHeight);
              }
              fn();
            } else {
              //svg
              this._drawSVGOnCanvas(canvas, target[0], function(resultCanvas) {
                canvas = resultCanvas;

                //if we have more element keep drawing, else finish
                if(elementsToRender.length > 0) {
                  fn();
                } else {
                  this._finishGetImage(callback, canvas, renderLegend, drawingWidth, drawingHeight);
                }
              }.bind(this));
            }
          } else {
            //ellement is null, continue iterating
            fn();
          }
        }
      }.bind(this);
      fn();
    },
    _finishGetImage: function(callback, canvas, renderLegend, drawingWidth, drawingHeight) {
      if(renderLegend) {
        this._drawRegister(canvas.getContext('2d'), drawingWidth, drawingHeight);
      }
      callback({canvas: canvas, image: canvas.toDataURL()});
    },
    _getRegisterWidth: function(drawingWidth, drawingHeight) {
      if(this.completeSeriesConfig) {

        var canvas = document.createElement('canvas');
        canvas.height = drawingHeight;
        canvas.width = 9999;

        var curY = 0,
            curX = drawingWidth + 5,
            keys = Object.keys(this.completeSeriesConfig),
            maxWidth = 0,
            maxTotalWidth = 5,
            context = canvas.getContext('2d');
            curTextWidth = 0;

        for(var i=0; i<keys.length; i++) {
          curY += 30;

          curTextWidth = context.measureText(this.completeSeriesConfig[keys[i]].name).width;
          maxWidth = Math.max(maxWidth, curTextWidth);

          if( (curY + 30) > drawingHeight) {
            curX += maxWidth + 15;
            curY = 0;
            maxTotalWidth += maxWidth + 15;
            maxWidth = 0;
          }
        }
        maxTotalWidth += maxWidth + 30;

        return maxTotalWidth;
      } else {
        return 0;
      }
    },
    /**
     * Draws a fake representation of the registers
     */
    _drawRegister: function(context, startWidth, drawingHeight) {

      if(this.completeSeriesConfig) {
        var curY = 0,
            lineLength = 25,
            strokeWidth = 3,
            curX = startWidth + 5,
            keys = Object.keys(this.completeSeriesConfig),
            maxWidth = 0,
            curTextWidth = 0;

        //draw each serie
        for(var i=0; i<keys.length; i++) {
          curY += 30;

          context.fillStyle = this.completeSeriesConfig[keys[i]].color;
          context.fillRect(curX,curY,strokeWidth, lineLength);
          context.fillStyle = this._checkThemeVariable("--px-vis-register-data-value", 'rgb(0,0,0)');
          context.fillText(this.completeSeriesConfig[keys[i]].name, curX + strokeWidth + 5, curY + 10);
          curTextWidth = context.measureText(this.completeSeriesConfig[keys[i]].name).width;
          maxWidth = Math.max(maxWidth, curTextWidth);

          if( (curY + 30) > drawingHeight ) {
            curX += maxWidth + 15;
            curY = 0;
          }
        }
      }
    }
}, PxVisBehavior.completeSeriesConfig];

/**
    Name:
    PxVisBehaviorChart.chartAutoResize

    Description:
    Polymer behavior that provides auto resize options for charts. Charts
    implementing this behavior can define a `_resizeCalculations` function
    which will be called when the chart needs to redo its size calculations
    (typically measure its parents and adjust its height/width)

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.chartAutoResize
*/
PxVisBehaviorChart.chartAutoResize = [{
    properties: {
      /**
      * Prevents the chart from automatically resizing to fit its container
      */
      preventResize: {
        type: Boolean,
        value: false,
        observer: '_preventResizeChanged'
      },
      /**
       * This allows to decide how the chart
       * drawing will be horizontally aligned when smaller than its container. Values:
       * - center
       * - left
       * - right
       *
       * if any other value is used then left alignment will be chosen
       */
      chartHorizontalAlignment: {
        type: String,
        value: 'center'
      },
      /**
       * This allows to decide how the chart
       * drawing will be vertically aligned when smaller than its container. Values:
       * - center
       * - top
       * - bottom
       *
       * if any other value is used then top alignment will be chosen
       */
      chartVerticalAlignment: {
        type: String,
        value: 'center'
      },
      /**
       * Class to be used on the external wrapper within the chart
       */
      _chartWrapperClass: {
        type: String,
        computed: '_getChartWrapperClass(chartHorizontalAlignment, chartVerticalAlignment)'
      },
      /**
       * Timing (in ms) to be used for iron resize when the chart auto size
       * (preventResize = false)
       */
      debounceResizeTiming: {
        type: Number,
        value: 250
      }
    },
    listeners: {'iron-resize': '_onIronResize'},
    _preventResizeChanged: function() {
     if(this.hasUndefinedArguments(arguments)) {
       return;
     }

      if(!this.preventResize) {
        this.notifyResize();
      }
    },
    _getChartWrapperClass: function(hor, vert) {
     if(this.hasUndefinedArguments(arguments)) {
       return;
     }

      var base = 'flex wrapper ';

      if(hor === 'center') {
        base += 'flex--center ';
      } else if(hor === 'right') {
        base += 'flex--right ';
      } else {
        base += 'flex--left ';
      }

      if(vert === 'center') {
        base += 'flex--middle';
      } else if(vert === 'bottom') {
        base += 'flex--bottom';
      } else {
        base += 'flex--top';
      }

      return base;
    },

    _onIronResize: function() {
      if(this.preventResize) {
        return;
      }

      this.debounce('ironresize', () => {
        requestAnimationFrame(this._resizeCalculations.bind(this));
      }, this.debounceResizeTiming);
    }
}, PxVisBehavior.observerCheck, IronResizableBehavior];

/**
    Name:
    PxVisBehaviorChart.subConfiguration

    Description:
    Polymer behavior that provides subConfiguration for elements such as axes, register, etc.

    Dependencies:

    @polymerBehavior PxVisBehaviorChart.subConfiguration
*/
PxVisBehaviorChart.subConfiguration = {
    properties: {
    },
    /**
     * Applies the config object to the element. Each key in the config object
     * is the name of the property to be applied
     *
     */
    _applyConfigToElement: function(config, element) {
      if(typeof(config) === 'string') {
        config = JSON.parse(config);
      }
      if(typeof(config) !== 'object') {
        console.error('Configuration object must be valid JSON: ' + config);
        return;
      }
      if(!element) {
        console.error('Cannot apply config to undefined element');
        return;
      }

      var keys = Object.keys(config);
      for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        element.set(key, config[key])
      }
    },
};

/**
    Name:
    PxVisBehaviorChart.timeFiltering

    Description:
    Polymer behavior that allows to filter chartData based on time, providing a _filteredData object

    Dependencies:

    @polymerBehavior PxVisBehaviorChart.timeFiltering
*/
PxVisBehaviorChart.timeFiltering = [{
  properties: {
    /**
     * Name of the variable holding the time stamp in the data
     */
    timeData: {
      type: String,
      value: 'Timestamp'
    },
    /**
     * Data that has been time filtered
     */
    _filteredData: {
      type: Object,
      computed: '_filterData(chartData, timeDomain, timeData)'
    }
  },

  observers: [
    '_setTimeKey(timeData)'
  ],

  _setTimeKey: function() {
    if(this.timeData) {
      //harmonise key referencing time across charts
      this.set('timeKey', this.timeData);
    }
  },

  /**
   * returns a filtered dataset based on the time domain
   */
  _filterData: function(chartData, timeDomain, timeData) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    if(timeDomain.x && timeDomain.x.length === 2) {
      var min = Number(timeDomain.x[0]),
          max = Number(timeDomain.x[1]);
      return chartData.filter(function(val) {
        var timeVal = Number(val[timeData]);
        // if the data doesn't have Date value, return the data as it is
        if (typeof(val[timeData]) === 'undefined') {
          return val;
          // Otherwise return the data matching the selected time range
        } else {
          return (timeVal >= min && timeVal <= max);
        }
      });
    } else {
      return chartData;
    }
  }
}, PxVisBehavior.observerCheck, PxVisBehavior.dataset, PxVisBehavior.timeDomain];

/*
    Name:
    PxVisBehaviorChart.waitForAttach

    Description:
    Polymer behavior that provides the the ability for the chart to delay running until attached.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.waitForAttach
*/
PxVisBehaviorChart.waitForAttach = {
    properties: {
      /**
      * Boolean holding loading until the chart is actually attached
      */
      _loadedOnPage: {
        type: Boolean
      }
    },

    attached: function() {
      this._loadedOnPage = true;
    },

    /**
     * checks if the chart is attached, otherwise waits and recalls
     */
    _isLoadedOnPage: function() {
      var rect = this.getBoundingClientRect();
      if(rect.height > 0 && rect.width > 0) {
        this.set('_loadedOnPage', true);
      } else {
        this.async(this._isLoadedOnPage, 50);
      }
    }

};

/*
    Name:
    PxVisBehaviorChart.getHideClass

    Description:
    Behavior allowing a chart to get the class to hide a register

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.getHideClass
*/
PxVisBehaviorChart.getHideClass = [{
  _getHideClass: function(hide) {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }
    if(hide === true) {
      return 'hideAxis';
    }
    return '';
  }
}, PxVisBehavior.observerCheck];

/*
    Name:
    PxVisBehaviorChart.registerPositioning

    Description:
    Behavior allowing a chart to position its registers

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.registerPositioning
*/
PxVisBehaviorChart.registerPositioning = [{
  properties: {
     /**
      *
      * Allows to hide the register
      */
    hideRegister: {
      type: Boolean,
      value: false,
      observer: '_hideRegisterChanged'
    },
    _registerType: {
      type: String
    },
    _registerWrapperClass: {
      type: String,
      computed: '_getRegisterWrapperClass(_registerType)'
    }
  },
 /**
  * determine the flex class on the wrapper depending on where the register is
  */
  _getRegisterWrapperClass: function() {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    var classList = "flex ";

    if(!this.hideRegister) {
      if(this._registerType === 'vertical') {
        classList += "flex--row--rev";
      }
      else {
        classList += "flex--col";
      }
    }

    return classList;
  },
  _hideRegisterChanged: function() {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    this.notifyResize();
  }
}, PxVisBehavior.observerCheck, PxVisBehaviorChart.getHideClass];

/*
    Name:
    PxVisBehaviorChart.registerConfigs

    Description:
    Behavior allowing providing component config declarations

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.registerConfigs
*/
PxVisBehaviorChart.registerConfigs = {
  properties: {
    /**
     * Configuration object used to customize the tooltip cosmetic properties.
     * Please refer to px-vis-tooltip and px-vis-register (https://github.com/PredixDev/px-vis) for a list of supported properties
     * Most interesting properties include:
     * - width
     * - height
     * - tooltipStyle
     * - forceDateTimeDisplay
     */
    tooltipConfig: {
      type: Object
    },
    /**
     * Configuration object used to customize the register cosmetic properties.
     * Please refer to px-vis-register (https://github.com/PredixDev/px-vis) for a list of supported properties
     *
     */
    registerConfig: {
      type: Object
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.interactionSpaceConfig

    Description:
    Behavior providing configuration for a interaction space for a chart

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.interactionSpaceConfig
*/
PxVisBehaviorChart.interactionSpaceConfig = {
  properties: {
      /**
      * Configuration object used to customize the interaction space
      * Please refer to px-vis-interation space (https://github.com/PredixDev/px-vis) for a list of supported properties.
      */
    interactionSpaceConfig: {
      type: Object,
      value: function() { return {}; }
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.chartToolbarConfig

    Description:
    Behavior providing configuration for a toolbar for a chart

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.chartToolbarConfig
*/
PxVisBehaviorChart.chartToolbarConfig = [{
  properties: {
      /**
      * Configuration object used to customize the toolbar
      * Please refer to px-vis-toolbar (https://github.com/PredixDev/px-vis) for a list of supported properties.
      * Most interesting properties include:
      * - config (complex object for customizing the toolbar)
      * - horizontalAlignment
      * - subToolbarAlignment
      */
    toolbarConfig: {
      type: Object
    }
  }
}, PxVisBehaviorChart.interactionSpaceConfig];

/*
    Name:
    PxVisBehaviorChart.axisConfigs

    Description:
    Behavior allowing providing component config declarations

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.axisConfigs
*/
PxVisBehaviorChart.axisConfigs = {
  properties: {
    /**
     * Configuration object used to customize the X axis cosmetic properties.
     * Please refer to px-vis-axis (https://github.com/PredixDev/px-vis) for a list of supported properties
     *
     */
    xAxisConfig: {
      type: Object
    },
    /**
     * Configuration object used to customize the Y axis cosmetic properties.
     * Please refer to px-vis-axis (https://github.com/PredixDev/px-vis) for a list of supported properties
     *
     */
    yAxisConfig: {
      type: Object
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.navigatorConfig

    Description:
    Behavior allowing providing component config declarations

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.navigatorConfig
*/
PxVisBehaviorChart.navigatorConfig = {
  properties: {
    /**
     * Configuration object used to customize the navigator cosmetic properties.
     *
     * This can be a collection of other configureation properties, such as axisConfig
     *
     */
    navigatorConfig: {
      type: Object
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.highlighterConfigs

    Description:
    Behavior allowing providing component config declarations

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.highlighterConfigs
*/
PxVisBehaviorChart.highlighterConfigs = {
  properties: {
    /**
     * Configuration object used to customize the highlighter properties.
     * Please refer to px-vis-point-highlighter and px-vis-line-highlighter (https://github.com/PredixDev/px-vis) for a list of supported properties
     * Most interesting properties include:
     * - `fuzz` : +/- search window around the datapoint value
     * - 'differenDataset' : if this chart has a different dataset from the crosshair data origin chart
     */
    highlighterConfig: {
      type: Object
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.mouseCusorConfig

    Description:
    Behavior allowing providing component config declarations

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.mouseCusorConfig
*/
PxVisBehaviorChart.mouseCusorConfig = {
  properties: {
    /**
     * Configuration object used to customize the mouse cursor properties.
     * Please refer to px-vis-mouseCursor (https://github.com/PredixDev/px-vis) for a list of supported properties
     */
    mouseCursorConfig: {
      type: Object
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.circleChart

    Description:
    Behavior providing attributes helping to position a circle based chart such as polar or pie.
    for exmaple provides the center, radius... based on size and margin

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.circleChart
*/
PxVisBehaviorChart.circleChart = [{
  properties: {
     /**
      * Min between width and height
      */
     _smallerSide: {
        type: Number,
        computed: '_computeSmallerSide(width, height)'
      },
      /**
       * diameter of the chart drawing, adjusted with margins
       */
      _diameter: {
        type: Number
      },
      /**
       * radius of the chart drawing, adjusted with margins
       */
      _radius: {
        type: Number
      },
      /**
       * center of the chart, based on radius and margins
       */
      _center: {
        type: Array
      },
      /**
       * internal margins we can use in addition to "margin",
       * used to offset chart labels for example
       */
      _internalCircleMargins: {
        type: Object,
        value: function() {
          return {top: 0, left:0, right: 0, bottom:0};
        }
      }
  },
  observers: [
    '_sizeChanged(_smallerSide, margin.*, _internalCircleMargins.*)'
      ],
  _computeSmallerSide: function(width, height) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    return Math.max(Math.min(height,width), 0);
  },
  _sizeChanged: function(_smallerSide, margin, internalMargin) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

      //measure appropriate width and height based on the smaller sides and margins
      var ml = Number(this.margin.left) + Number(this._internalCircleMargins.left),
          mr = Number(this.margin.right) + Number(this._internalCircleMargins.right),
          mt = Number(this.margin.top) + Number(this._internalCircleMargins.top),
          mb = Number(this.margin.bottom) + Number(this._internalCircleMargins.bottom),
          adjWidth = Math.max(0, this._smallerSide - ml - mr),
          adjHeight =  Math.max(0, this._smallerSide - mt - mb),
          diameter = Math.min(adjWidth,adjHeight) ,
          radius = diameter / 2,
          center = [];

      center[0] = ml + adjWidth/2;
      center[1] = mt + adjHeight/2;

      //For Polar, if we are zoomed, then we need to:
      //  1) change the calculated vals for the entire stack
      //  2) make the "new" radius and center our current zoom
      if(this.polar && this.zoomStack && this.zoomStack.length) {
        var originalRadius = this.zoomStack[0]['radius'],
            originalCenter = this.zoomStack[0]['center'],
            end = this.zoomStack.length - 1;

        // Dont start with first because that will be the above calc radius and center
        for(var i = 1; i < this.zoomStack.length; i++) {
          var s = this.zoomStack[i].radius / originalRadius,
              r = s * radius,
              c0 = this.zoomStack[i].center[0] / originalRadius * radius,
              c1 = this.zoomStack[i].center[1] / originalRadius * radius;

          this.zoomStack[i].radius = r;
          this.zoomStack[i].center = [c0,c1];
        }

        this.zoomStack[0]['radius'] = radius;
        this.zoomStack[0]['center'] = center;

        radius = this.zoomStack[end]['radius'];
        center = this.zoomStack[end]['center'];
      }

      this.set('_diameter', diameter);
      this.set('_radius', radius);
      this.set('_center', center);
  }
}, PxVisBehavior.observerCheck, PxVisBehavior.sizing];

/*
    Name:
    PxVisBehaviorChart.cursorConfig

    Description:
    Behavior providing the cursorConfig property
    @polymerBehavior PxVisBehaviorChart.cursorConfig
*/
PxVisBehaviorChart.cursorConfig = {
  properties: {
    /**
     * Configuration object used to customize the cursor properties.
     * Please refer to px-vis-cursor (https://github.com/PredixDev/px-vis) for a list of supported properties
     *
     */
    cursorConfig: {
      type: Object
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.layers

    Description:
    Behavior providing the layers property and layer generation
    @polymerBehavior PxVisBehaviorChart.layers
*/
PxVisBehaviorChart.layers = [{
  properties: {
    /**
     * Array of the svg layers
     *
     */
    layer: {
      type: Array,
      notify: true
    },
    numberOfLayers: {
      type: Number
    },
    generateLayers: {
      type: Boolean,
      value: true
    }
    //TODIO: array of event allowed to pierce
  },
  observers: [
    '_createLayersOnce(svg, numberOfLayers)'
  ],
  /**
   * Creates <g> layers
   *
   */
  _createLayers: function(svg, numberOfLayers, propName) {
    var layers = [],
        name = propName ? propName : 'layer';

    for(var i = 0; i < numberOfLayers; i++) {
      var layer;

      /*
        if we are in shady dom, need to use Polymer.dom append child to get the shady scope. Matters for these elements because they can have classes applied by highlight and cursor components and using the Polymer.dom method is twice as slow as the d3 method.
      */
      if(undefined.useNativeShadow) {
        layer = svg.append('g');
      } else {
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        layer = Px.d3.select(dom(svg.node()).appendChild(g));
      }

      layer.attr('id', "layer" + i)
      layers.push(layer);
    }

    this.set(name,layers);
    this.fire('px-vis-' + name + '-updated',{ 'data': layers, 'dataVar': name, 'method': 'set' });
  },
  _createLayersOnce: function(svg, numberOfLayers, generateLayers, propName) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    var gen = generateLayers ? generateLayers : 'generateLayers';

    if(this[gen] && this._doesD3HaveValues(svg) && numberOfLayers > 0) {
      this._createLayers(svg, numberOfLayers, propName);
      this.set(gen, false);
    }
  }
}, PxVisBehavior.observerCheck, PxVisBehaviorD3.svg, PxVisBehavior.commonMethods];

/*
    Name:
    PxVisBehaviorChart.mutedAxes

    Description:
    Behavior providing property for muting axes
    @polymerBehavior PxVisBehaviorChart.mutedAxes
*/
PxVisBehaviorChart.mutedAxes = {
  properties: {
    /**
       * An object to hold which axes should be muted.
       *
       * *When adding keys to this, be sure to use Polymer set methods or notifyPath*
       *
       * ```
       *    {
       *        "Axes_to_skip_1":true,
       *        "Axes_to_skip_2":true
       *    }
       * ```
       */
      mutedAxes: {
        type: Object,
        notify: true,
        value: function() { return {}; }
      },
  },
};

/*
    Name:
    PxVisBehaviorChart.multiAxisLasso

    Description:
    Behavior providing property lasso methods for multi-axis charts
    @polymerBehavior PxVisBehaviorChart.multiAxisLasso
*/
PxVisBehaviorChart.multiAxisLasso = {
  properties: {
    _lassoCrosshairData: {
      type: Object,
      value: function() { return {}; }
    },
    /**
     * When switched clears all the previous selection made
     * (in _lassoCrosshairData)
     */
     resetLassoData: {
      type: Boolean,
      value: false,
      observer: '_resetLasso'
    }
  },

  lasso: function() {
    var yScale = this.isMultiY ? this.y[this.extentsData.dimension] : this.y;

    for(var i = 0; i < this.chartData.length; i++) {
      this._searchForDataInArea(this.extentsData.dimension, yScale, this.chartData[i], this.extentsData.extents);
    }

    this._calcLassoData(this.extentsData.dimension);
  },

  _searchForDataInArea: function(dim, y, d, ext) {
    if(this._combinedMutedSeries[d[this.seriesKey]]) {
      return;
    }
    if(y.domain()[0] > d[dim] || d[dim] > y.domain()[1]) {
      return;
    }
    if(this.timeDomain && this.timeDomain.x &&
        (d[this.seriesKey] < this.timeDomain.x[0] || d[this.seriesKey] > this.timeDomain.x[1])) {
      return;
    }

    var dpx = y(d[dim]);
    if(dpx >= ext[0] && dpx <= ext[1]) {
      this._lassoCrosshairData[d[this.seriesKey]] = d;
    }
  },

  _calcLassoData: function(dim) {
    var keys = Object.keys(this._lassoCrosshairData),
        combined = {detail: {
          rawData: [],
          timeStamps: keys
        }};

    for(var i=0; i< keys.length; i++) {
      combined.detail.rawData.push(this._lassoCrosshairData[keys[i]]);
    }

    this._calcCrosshair(combined);
  },

  _resetLasso: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    this._lassoCrosshairData = {};
  },
};

/*
    Name:
    PxVisBehaviorChart.extentsDataRouter

    Description:
    Behavior providing the extentsDataRouter
    @polymerBehavior PxVisBehaviorChart.extentsDataRouter
*/
PxVisBehaviorChart.extentsDataRouter = [{
  properties: {
    _extentsDataRoutes: {
      type: Object,
      value: function() {
        return {
          zoom: 'zoom',
          pan: 'pan',
          lasso: 'lasso'
        }
      }
    }
  },

  observers: [
    '_extentsDataRouter(extentsData.*)'
  ],
// FIXME import extentsAction
  _extentsDataRouter: function() {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    if(!this.extentsAction) { return; }
    var fn = this._extentsDataRoutes[this.extentsAction];

    if(!fn) {
      console.warn("_extentsDataRoutes does not have a method to call " + this.extentsAction);
      return;
    }

    if(!this[fn]) {
      console.warn("Method " + fn + " is not defined");
      return;
    }

    // run the function
    this[fn]();
  }
}, PxVisBehavior.observerCheck, PxVisBehavior.extentsData];

/*
    Name:
    PxVisBehaviorChart.zoomGeneric

    Description:
    Behavior providing some generic properties for zooming
    @polymerBehavior PxVisBehaviorChart.zoomGeneric
*/
PxVisBehaviorChart.zoomGeneric = [{
   properties: {
    /**
     * Stack of previous zooms
     */
    zoomStack: {
      type: Array,
      value: function() {
        return [];
      }
    },
    /**
     * Percentage used to calculate new extents when using zoomIn feature.
     * The higher the number the more it will zoom in. should be less than 1.
     */
    zoomInPercentage: {
      type: Number,
      value: 0.5
    },
    /**
     * Percentage used to calculate new extents when using zoomOut feature.
     * The higher the number the more it will zoom out. should be less than 1.
     */
    zoomOutPercentage: {
      type: Number,
      value: 0.5
    },

    _isPanning: {
      type: Boolean,
      value: false
    }
  },
  zoomIn: function() {
    this.set('extentsAction', 'zoom');
    this._autoZoom(true);
  },
  zoomOut: function() {
    this.set('extentsAction', 'zoom');
    this._autoZoom(false);
  },
  _intSpaceStartPan: function() {
    this.set('_isPanning', true);
  },
  _intSpaceStopPan: function() {
    this.set('_isPanning', false);
  }

}, PxVisBehavior.extentsData, PxVisBehaviorChart.extentsDataRouter];

/*
    Name:
    PxVisBehaviorChart.zooming

    Description:
    Behavior providing properties and logic for chart zooming
    @polymerBehavior PxVisBehaviorChart.zooming
*/
PxVisBehaviorChart.zooming = [{

  /*
  * fires when the chart has been zoomed in or out. contains an object
  * with 'x' and 'y' values, a 'reset' boolean flag and a 'panning' boolean
  * - x: array containing the domain for X
  * - y: when only 1 y axis is defined, array containing the domain for Y
  *      when multi Y axis, object with 1 key per axis, each value being
  * - reset: true if the event is a zoom reset, false otherwise
  * - panning: true if the event comes from a panning action, false otherwise
  * an array containing the domain for this specific axis
  * @event px-vis-zoomed
  */

  /**
   * Properties block, expose attribute values to the DOM via 'reflect'
   *
   * @property properties
   * @type Object
   */
  properties: {
    /**
     * Original extents before zooming if one of the axis is ordinal
     */
    _originalOrdinalExtents: {
      type: Array
    }
  },

  listeners: {
    'px-vis-toolbar-reset-zoom': 'resetZoom',
    'px-vis-toolbar-zoom-in': 'zoomIn',
    'px-vis-toolbar-zoom-out': 'zoomOut',
    'px-vis-toolbar-undo-zoom': 'undoZoom',
    'px-vis-interaction-space-start-panning': '_intSpaceStartPan',
    'px-vis-interaction-space-stop-panning': '_intSpaceStopPan'
  },

  /**
   * Restore zoom to its previous value, do nothing if no previous value
   */
  undoZoom: function() {
    if(this.zoomStack.length === 1) {
      this.resetZoom();
    }

    var extentsData = this.pop('zoomStack');
    if(extentsData) {
      this.set('selectedDomain', extentsData);
      this.fire('px-vis-selected-domain-updated', { 'data':extentsData, 'method': 'set', 'dataVar': 'selectedDomain' });
      this._notifyZoomed(false);
    }
  },
  _saveZoomState: function() {

    this._saveOrdinalOriginalExtents();

        var selectedDomain = this.selectedDomain === 'reset' ? {} : this.selectedDomain;

    if(!this.selectedDomain.y || this.selectedDomain.y.length === 0) {
      var newY = this._processYValues(function(axis, index) {
        return axis.domain();
      });
            selectedDomain.y = newY;
        }

    this.push('zoomStack', selectedDomain);
  },
  _saveOrdinalOriginalExtents: function() {
    //save ordinal domain if we aren't zoomed
    if(this.zoomStack.length === 0 && (this.xAxisType === 'ordinal' || this.yAxisType === 'ordinal')) {

      var domains;
      domains = this._processYValues(function(axis, index) {
        return axis.domain();
      });

      this.set('_originalOrdinalExtents', [this.x.domain(), domains]);
    }
  },
  _autoZoom: function(isZoomIn) {

    var xMin = this.x.domain()[0],
        xMax = this.x.domain()[1],
        newExtents = {},
        zoomSelection = this.selectionType || 'xy';

    this._saveOrdinalOriginalExtents();

    if(zoomSelection === 'xy' || zoomSelection === 'xAxis') {

      if(this.xAxisType === 'ordinal') {
        //add and remove values for ordinal
        newExtents.eX = this._calcNewOrdinalExtents(this.x.domain(), this._originalOrdinalExtents[0], isZoomIn);
      } else {

        //because we're going to apply a percentage to values we need to
        //make sure those values are linear
        xMin = this._convertValue(xMin, this.xAxisType, true);
        xMax = this._convertValue(xMax, this.xAxisType, true);

        newExtents.eX = this._calcNewLinearExtents(xMin, xMax, isZoomIn);

        //make sure values are in the right format
        newExtents.eX[0] = this._convertValue(newExtents.eX[0], this.xAxisType, false);
        newExtents.eX[1] = this._convertValue(newExtents.eX[1], this.xAxisType, false);
      }
    } else {

      //preserve current extents
      newExtents.eX = [xMin, xMax];
    }

    if(zoomSelection === 'xy' || zoomSelection === 'yAxis') {
      if(this.yAxisType === 'ordinal') {
        //add and remove values for ordinal
        newExtents.eY = this._processYValues(function(axis, index) {
          var originalDomain = this._originalOrdinalExtents[1];
          //multi Y
          if(index || index === 0) {
            originalDomain = originalDomain[index];
          }
          return this._calcNewOrdinalExtents(axis.domain(), originalDomain, isZoomIn);
        });
      } else {
        //linear
        newExtents.eY = this._processYValues(function(axis, index) {
          return this._calcNewLinearExtents(axis.domain()[0], axis.domain()[1], isZoomIn);
        });
      }
    } else {

      //preserver current extents
      newExtents.eY = this._processYValues(function(axis, index) {
        return [axis.domain()[0], axis.domain()[1]];
      });
    }

    //this will kick zoom()
    this.set('extentsData', newExtents);
  },
  _calcNewOrdinalExtents: function(currentDomain, originalDomain, isZoomIn) {
    if(isZoomIn) {
      return this._calcNewZoomedInOrdinal(currentDomain);
    } else {
      return this._calcNewZoomedOutOrdinal(currentDomain, originalDomain);
    }
  },
  _calcNewZoomedInOrdinal: function(currentDomain) {

    var newCount = Math.ceil(currentDomain.length * this.zoomInPercentage),
        removeCount = currentDomain.length - newCount,
        removeOnLeft = Math.ceil(removeCount/2),
        removeOnRight = Math.floor(removeCount/2);

    currentDomain.splice(0, removeOnLeft);
    currentDomain.splice(currentDomain.length - removeOnRight);

    return currentDomain;
  },
  _calcNewZoomedOutOrdinal: function(currentDomain, originalDomain) {
    var newCount = Math.min(Math.ceil(currentDomain.length / this.zoomOutPercentage), originalDomain.length),
        addCount = newCount - currentDomain.length,
        addOnLeft = Math.ceil(addCount/2),
        addOnRight = Math.floor(addCount/2),
        mostLeftIndex = originalDomain.indexOf(currentDomain[0]),
        mostRightIndex = originalDomain.indexOf(currentDomain[currentDomain.length-1]);

    //make sure we have enough columns on left
    if(mostLeftIndex < addOnLeft) {
      var diff = addOnLeft - mostLeftIndex;
      addOnLeft -= diff;
      addOnRight += diff;
    }

    //make sure we have enough columns on right
    if(mostRightIndex < addOnRight) {
      var diff = addOnRight - mostRightIndex;
      addOnRight -= diff;
      addOnLeft += diff;
    }

    //add on left
    for(var i=1; i < addOnLeft + 1; i++) {
      currentDomain.splice(0, 0, originalDomain[mostLeftIndex-i])
    }

    //add on right
    for(var i=1; i < addOnRight + 1; i++) {
      currentDomain.splice(currentDomain.length, 0, originalDomain[mostRightIndex+i])
    }

    return currentDomain;
  },
  _calcNewLinearExtents: function(min, max, isZoomIn) {
    var range = max - min,
        result = [];

    result[0] = isZoomIn ? (min + (range * this.zoomInPercentage/2)) :
                            (min - (range * this.zoomOutPercentage/2));
    result[1] = isZoomIn ? (max - (range * this.zoomInPercentage/2)) :
                            (max + (range * this.zoomOutPercentage/2));

    return result;
  },
  _convertValue: function(value, axisType, convertFrom) {
    if(convertFrom) {
      return (axisType === 'time' || axisType === 'timeLocal') ? Number(value) : value;
    } else {
      return (axisType === 'time' || axisType === 'timeLocal') ? new Date(value) : value;
    }
  },

  _zoomOrPan: function() {
    this.set('selectedDomain', {x: this.extentsData.eX, y: this.extentsData.eY});
    this.fire('px-vis-selected-domain-updated', { 'data':{x: this.extentsData.eX, y: this.extentsData.eY}, 'method': 'set', 'dataVar': 'selectedDomain' });
    this._notifyZoomed(false);
  },
  /**
   * Sets the selectedDomain to the drawn zoom and shows the button
   *
   */
  zoom: function() {
    this._saveZoomState();
    this._zoomOrPan()
  },

  pan: function() {
    this._zoomOrPan();
  },

  /**
   * resets the extents
   *
   */
  resetZoom: function() {
    //we still want to reset even if we were already reset, in case data has been filtered
    if(this.selectedDomain === 'reset') {
      this.set('selectedDomain', 'rereset');
    } else {
      this.set('selectedDomain', 'reset');
    }

    //ensure the zoom stack is reset
    this.splice('zoomStack', 0, this.zoomStack.length);

    this.fire('px-vis-selected-domain-updated', { 'data':'reset', 'method': 'set', 'dataVar': 'selectedDomain' });
    this._notifyZoomed(true);
  },
  _notifyZoomed: function(isReset) {
    var domains = this._processYValues(function(axis, index) {
        return axis.domain();
      });
    this.fire('px-vis-zoomed', {x: this.x.domain(), y: domains, reset: isReset, panning: this._isPanning});
  }
}, PxVisBehavior.extentsData, PxVisBehaviorD3.selectedDomain, PxVisBehavior.axisTypes, PxVisBehaviorD3.axes, PxVisBehavior.zoomSelection, PxVisBehaviorChart.zoomGeneric];


/*
    Name:
    PxVisBehaviorChart.actionRequest

    Description:
    Behavior providing properties and logic running a function or firing an event within
    the context of the chart
    @polymerBehavior PxVisBehaviorChart.actionRequest
*/
PxVisBehaviorChart.actionRequest = {

  listeners: {
    'px-vis-action-request': '_actionRequest',
    'px-vis-event-request': '_eventRequest'
  },

  /**
   * Runs a custom function within the context of the chart
   */
  _actionRequest: function(evt) {

   var fn = evt.detail.function,
       data = evt.detail.data;
   if(fn) {

     fn = fn.bind(this);
     fn(data);
   }

   evt.stopPropagation();
  },
  /**
   * Fires a custom event within the context of the chart
   */
  _eventRequest: function(evt) {

    var eventName = evt.detail.eventName ? evt.detail.eventName : 'px-vis-event';
    this.fire(evt.detail.eventName, {'data': evt.detail.data})

    evt.stopPropagation();
  },
};

/*
    Name:
    PxVisBehaviorChart.toolbarSubConfig

    Description:
    Behavior providing properties for the toolbar subconfig
    @polymerBehavior PxVisBehaviorChart.toolbarSubConfig
*/
PxVisBehaviorChart.toolbarSubConfig = {

  properties: {
    /**
     * toolbarSubConfig can be passed around from a toolbar to another so that clicking
     * on a "global" toolbar drives the sub row state for other toolbars
     */
    toolbarSubConfig: {
      type: Object
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.noDebounceOnPanning

    Description:
    Behavior removing debouynce on line drawing when panning
    @polymerBehavior PxVisBehaviorChart.noDebounceOnPanning
*/
PxVisBehaviorChart.noDebounceOnPanning = {

  properties: {
    /**
      * holds the previous drawing debounce timing (before panning)
      */
    _oldLinesDrawDebounceTime: {
      type: Number
    },
    /**
      * holds the previous drawing debounce timing (before panning)
      */
    _oldScatterDrawDebounceTime: {
      type: Number
    },
    /**
      * holds the previous drawing debounce timing (before panning)
      */
    _oldThresholdDrawDebounceTime: {
      type: Number
    }
  },
  listeners: {
    'px-vis-interaction-space-start-panning': '_startPanning',
    'px-vis-interaction-space-stop-panning': '_stopPanning'
  },
  _startPanning: function() {

    //remove draw debounce to have a smooth panning
    var lines = dom(this.root).querySelectorAll('px-vis-line-svg'),
        scatter = dom(this.root).querySelectorAll('px-vis-scatter'),
        threshold = dom(this.root).querySelector('px-vis-threshold');

    if(lines && lines.length > 0) {
      this._oldLinesDrawDebounceTime = lines[0].drawDebounceTime;
      for(var i=0; i<lines.length; i++) {
        lines[i].set('drawDebounceTime', 0);
      }
    }

    if(scatter && scatter.length) {
      this._oldScatterDrawDebounceTime = scatter[0].drawDebounceTime;
      for(var i=0; i<scatter.length; i++) {
        scatter[i].set('drawDebounceTime', 0);
      }
    }

    if(threshold) {
      this._oldThresholdDrawDebounceTime = threshold.drawDebounceTime;
      threshold.set('drawDebounceTime', 0);
    }
  },
  _stopPanning: function() {

    var lines = dom(this.root).querySelectorAll('px-vis-line-svg'),
        scatter = dom(this.root).querySelectorAll('px-vis-scatter'),
        threshold = dom(this.root).querySelector('px-vis-threshold');

    if(lines) {
      for(var i=0; i<lines.length; i++) {
        lines[i].set('drawDebounceTime', this._oldLinesDrawDebounceTime);
      }
    }

    if(scatter) {
      for(var i=0; i<scatter.length; i++) {
        scatter[i].set('drawDebounceTime', this._oldScatterDrawDebounceTime);
      }
    }

    if(threshold) {
      threshold.set('drawDebounceTime', this._oldThresholdDrawDebounceTime);
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.showTooltip

    Description:
    Behavior allowing to have an internal and external properties driving tooltip
    visibility
    @polymerBehavior PxVisBehaviorChart.showTooltip
*/
PxVisBehaviorChart.showTooltip = [{

  properties: {
    /**
      * Whether to display the tooltip
      */
    showTooltip: {
      type: Boolean,
      value: false
    },
    _internalShowTooltip: {
      type: Boolean,
      value: true
    },
    _computedShowTooltip: {
      type: Boolean,
      computed: '_computeShowTooltip(showTooltip, _internalShowTooltip)'
    }
  },
  _computeShowTooltip: function(showTooltip, _internalShowTooltip) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    return showTooltip && _internalShowTooltip;
  }

}, PxVisBehavior.observerCheck];

/**
    Name:
    PxVisBehaviorChart.multiAxis

    Description:
    Provides propterty definitions and methods for multi axis charts

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorChart.multiAxis
*/
PxVisBehaviorChart.multiAxis = [{
  properties: {

    /**
     * The size of an individual axis
     *
     */
    leftAxisSize: {
      type: Number,
      notify: true
    },

    /**
     * The size of an individual axis
     *
     */
    rightAxisSize: {
      type: Number,
      notify: true
    },

    /**
     * Number of axes on the left
     *
     */
    numLeftAxes: {
      type: Number,
      notify: true
    },

    /**
     * Number of axes on the right
     *
     */
    numRightAxes: {
      type: Number,
      notify: true
    },

    _axisX: {
      type: Object,
      notify: true
    },

    _axisDomainChanged: {
      type: Number,
      value: 0
    },

    _multiAxisSeriesConfig: {
      type: Object,
      notify: true
    }
  },

  _addAxisToList: function(axisId, axisNum, thisSet, otherSet, dims) {
    //confirm side is not duplicated
    if(otherSet[axisId] || otherSet[axisId] === 0) {
      console.warn(axisId + ' is defined on both the left and right side. Defaulting to first side (≧ω≦)');
      return;
    }

    // Is there an axis currently at that location
    if(dims[axisNum]) {
      // is the axis a different axis?
      if(dims[axisNum] !== axisId) {
        console.warn(axisId + ' & ' + dims[axisNum] + ' are both defined at axis number ' + axisNum);

        // have we not already added this axis onto the end?
        if(!thisSet[axisId] && thisSet[axisId] !== 0) {
          thisSet[axisId] = dims.length;
          dims.push(axisId);
        }
      }
      return;
    }

    //add to right set of axes
    thisSet[axisId] = axisNum;

    //Add to order of axes
    dims[axisNum] = axisId;
  },

  _calcAxes: function(completeSeriesConfig) {
    if(this._doesObjHaveValues(this.completeSeriesConfig)) {
      var keys = Object.keys(this.completeSeriesConfig),
          lSet = {},
          rSet = {},
          lDims = [],
          rDims = [],
          seriesToAxes = {};

      for(var i = 0; i < keys.length; i++) {
        if(this.completeSeriesConfig[keys[i]]['axis']) {
          var k = keys[i],
              axis = this.completeSeriesConfig[k]['axis'],
              axisId = axis.id;

          // associates a series with an axes
          if(seriesToAxes[axisId]) {
            seriesToAxes[axisId].push(k);
          } else {
            seriesToAxes[axisId] = [ k ];
          }

          // count how many axes on each side
          if(axis.side === 'right') {
            this._addAxisToList(axisId, axis.number, rSet, lSet, rDims);
          } else {
            this._addAxisToList(axisId, axis.number, lSet, rSet, lDims);
          }
        }
      }

      // strip out undefines
      lDims = lDims.filter(Boolean);
      rDims = rDims.filter(Boolean);

      this.set('numLeftAxes', lDims.length);
      this.set('numRightAxes', rDims.length);

      this.set('axes', lDims.concat(rDims));
        // need to set this before setting dimensions because the dimensions observer calls this for multi-axis
        this.set('_axisX', this._setAxisScale(lDims.sort(), rDims.sort(), this.leftAxisSize, this.rightAxisSize));
      this.set('dimensions', this.axes);
      this.set('seriesToAxes', seriesToAxes);

      if(typeof this._axisX === 'function') {
        this.set('_axisDomainChanged', this._axisDomainChanged + 1);
      }

      // must decouple completeSeriesConfig from px-vis-multi-axis for timing reasons. Needs to set after dimensions
      this.set('_multiAxisSeriesConfig', this.completeSeriesConfig);
    }
  },

  _calcMultiMargins: function(margin, leftAxisWidth, rightAxisWidth) {
    var leftAxisWidth = leftAxisWidth || 50,
        rightAxisWidth = rightAxisWidth || 50;

    // width dependent on number of axes on each
    // axes fit into the margin section of the chart
    margin.left = Math.max(leftAxisWidth * this.numLeftAxes, margin.left);
    margin.right = Math.max(rightAxisWidth * this.numRightAxes, margin.right);

    this.set('leftAxisSize', leftAxisWidth);
    this.set('rightAxisSize', rightAxisWidth);
  },



  _returnYScale: function(seriesId, config) {
    if(this.domainChanged) {
      if(typeof this.y === 'object') {
        var d = config[seriesId]['axis']['id'];
        if(this.y && this.y[d]) {
          return this.y[d];
        }
      } else if(typeof this.y === 'function') {
        return this.y;
      }
   }
    return;
  }
}, PxVisBehavior.dimensions, PxVisBehavior.seriesToAxes];

/*
    Name:
    PxVisBehaviorChart.sizeVerticalRegister

    Description:
    Behavior providing the ability to size the height of a vertical register
    @polymerBehavior PxVisBehaviorChart.sizeVerticalRegister
*/
PxVisBehaviorChart.sizeVerticalRegister = [{

properties: {
  /**
  * the calculated height that can be used by the vertical register
  *
  */
  _verticalRegisterHeight: {
    type: Number
  },
  /**
   * The register height based on its type, config and calculated size
   */
  _registerHeight: {
    type: Number,
    computed: '_computeRegisterHeight(_verticalRegisterHeight, registerConfig.*)'
  },
    /**
    * When calculating the register height if the height deductions to do
    * haven't been passed in (i.e height changed rather than ironResize being called)
    * then this list of string will be used to search for elements IDs and calculate
    * their height, deducting them
    */
    _verticalRegisterHeightDeductions: {
      type: Array
    },
    /**
     * ID of the element where the drawing happens. used to get its height property
     */
    _verticalRegisterDrawingCanvasId: {
      type: String
    }
  },
  observers: [
    '_heightChanged(height, _verticalRegisterDrawingCanvasId, _verticalRegisterHeightDeductions)'
  ],
  ready:function() {
      this.set('_verticalRegisterHeight', this.height);
  },
  _heightChanged: function() {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    this._computeVerticalRegisterHeight();
  },
  _computeVerticalRegisterHeight: function(deductions) {

    this.debounce('_computeVerticalRegisterHeight', function() {

      var deductionsTotal = 0;
      if(!deductions) {
        if(this._verticalRegisterHeightDeductions && this._verticalRegisterHeightDeductions.length) {

          window.requestAnimationFrame(() => {
            //try to get each eleme we want to add
            for(var i=0; i<this._verticalRegisterHeightDeductions.length; i++) {
              var el = this.$$('#' + this._verticalRegisterHeightDeductions[i]);

              //if we found the item get its height
              if(el) {
                deductionsTotal += el.getBoundingClientRect().height;
              }
            }

            this.set('_verticalRegisterHeight', Math.max(Number(this.$[this._verticalRegisterDrawingCanvasId].height) + deductionsTotal, 0));
          });
        }
      } else {
        //just add all deductions
        for(var i=0; i<deductions.length; i++) {
          deductionsTotal += deductions[i];
        }
        this.set('_verticalRegisterHeight', Math.max(Number(this.$[this._verticalRegisterDrawingCanvasId].height) + deductionsTotal, 0));
      }
    }.bind(this), 5);
  },

  _computeRegisterHeight: function() {
    if(this.registerConfig && this.registerConfig.type === 'horizontal') {
      return this.registerConfig.height ? this.registerConfig.height : '';
    }

    return this._verticalRegisterHeight;
  }
}, PxVisBehavior.observerCheck, PxVisBehavior.baseSize];


/*
    Name:
    PxVisBehaviorChart.axisRegister

    Description:
    Behavior providing properties for dealing with an axis register (// coordinates and radar)
    @polymerBehavior PxVisBehaviorChart.axisRegister
*/
PxVisBehaviorChart.axisRegister = [{
  properties: {
    /**
    *
    * Allows to hide the axis register
    */
    hideAxisRegister: {
      type: Boolean,
      value: false
    },
    _axisRegisterConfig: {
      type: Object
    },
    _axisRegisterTooltipData: {
      type: Object
    }
  },

  observers: ['_computedAxisRegisterConf(axes, completeSeriesConfig, hideAxisRegister)'],

  /**
  *
  * configures the register config and empty data series
  */
  _computedAxisRegisterConf: function(axes, completeSeriesConfig) {
   if(this.hasUndefinedArguments(arguments) || this.hideAxisRegister) {
     return;
   }

// TODO maybe need an axes check?
    //first set new config
    var axisConfig = {},
        configTitle,
        tooltipData = {};

    tooltipData.series = [];
    tooltipData.seriesObj = {};

    for(var i=0; i<axes.length; i++) {
      configTitle = completeSeriesConfig[axes[i]] ? completeSeriesConfig[axes[i]].title : axes[i];

      axisConfig[axes[i]] = {
        'name': configTitle,
        'y': axes[i],
        'yAxisUnit': completeSeriesConfig[axes[i]] && completeSeriesConfig[axes[i]]['yAxisUnit'] ? completeSeriesConfig[axes[i]]['yAxisUnit'] : ''
      };

      tooltipData.series.push({ 'name': axes[i]});
      tooltipData.seriesObj[axes[i]] = {};
    }

    this.set('_axisRegisterConfig', axisConfig);
    if(!this._ttDataHaveSameSeries(this._axisRegisterTooltipData, tooltipData)) {
      this.set('_axisRegisterTooltipData', tooltipData);
    }
  },

  _ttDataHaveSameSeries: function(data1, data2) {

    if((!data1 && data2) || (!data2 && data1)) {
      return false;
    }

    if(data1.series && data2.series && data1.series.length !== data2.series.length) {
      return false;
    }

    if(JSON.stringify(data1.seriesObj) === JSON.stringify(data2.seriesObj)) {
      return true;
    }

    return false;
  },

  /**
  *
  * Resuses existing register dataset for series names and adds or removes values
  */
  _buildAxisTooltipData: function(values, time) {
    //update axis register with the value
    if(this._axisRegisterTooltipData && this._axisRegisterTooltipData.series && !this.hideAxisRegister) {
      //rebuild object from scratch to avoid Polymer dirty check
      var copy = {};
      copy.series = [];
      copy.seriesObj = {};
      copy.time = time || null;
      copy.dataset = values;

      for(var i=0; i<this._axisRegisterTooltipData.series.length; i++) {
        var newSeries = {},
            name = this._axisRegisterTooltipData.series[i].name;

        newSeries.name = name;

        if(values &&
            (values[name] || values[name] === 0) &&
            (!this.hardMute || !this.mutedAxes[name])) {

          newSeries.value = {};
          newSeries.value[name] = values[name];
        }

        copy.series.push(newSeries);
        copy.seriesObj[name] = newSeries;
      }

      this.set('_axisRegisterTooltipData', copy);
    } else {

      //make sure we still update it in case something else is looking for it
      if(!this._axisRegisterTooltipData) {
        this._axisRegisterTooltipData = {};
      }

      this.set('_axisRegisterTooltipData.dataset', values ? values : null);
    }
  }
}, PxVisBehavior.observerCheck, PxVisBehavior.dimensions, PxVisBehavior.completeSeriesConfig, PxVisBehaviorChart.mutedAxes, PxVisBehaviorChart.getHideClass];

/*
    Name:
    PxVisBehaviorChart.categoryRegister

    Description:
    Behavior providing properties for dealing with a category register (// coordinates and radar)
    @polymerBehavior PxVisBehaviorChart.categoryRegister
*/
PxVisBehaviorChart.categoryRegister = [{
  properties: {
    /**
    *
    * Allows to hide the axis register
    */
    hideCategoryRegister: {
      type: Boolean,
      value: false
    },
    _hideCategoryRegister: {
      type: Boolean,
      value: true
    },
    _categoryRegisterConfig: {
      type: Object
    },
    _categoryRegisterTooltipData: {
      type: Object
    }
  },
  observers: [
    '_computeCategoryRegisterConfig(categoryKey, completeSeriesConfig, categories, _hideCategoryRegister)',
    '_computeHideCategoryRegister(hideCategoryRegister, categoryKey)'
  ],

  _computeCategoryRegisterConfig: function() {
    if(this.hasUndefinedArguments(arguments) || this._hideCategoryRegister) {
      return;
    }

    if(typeof(this.categoryKey) !== 'undefined') {
      var tooltipData = {},
          config = {},
          currentCat,
          catName;
      tooltipData.series = [],
      tooltipData.seriesObj = {};

      for(var i = 0; i < this.categories.length; i ++) {

        currentCat = this.categories[i].toString();
        if(this.completeSeriesConfig[currentCat] && this.completeSeriesConfig[currentCat].name.toString() !== currentCat) {
          catName = this.completeSeriesConfig[currentCat].name;
        } else {
          catName = this.categoryKey + ' - ' + currentCat;
        }

        //if config defined try to reuse color
        if(this.completeSeriesConfig[currentCat]) {
          config[currentCat] = {};
          config[currentCat].name = catName;
          config[currentCat].color = this.completeSeriesConfig[currentCat].color ? this.completeSeriesConfig[currentCat].color : this._getColor(this.startColorIndex + i);
        } else {
          config[currentCat] = {
            'name': catName,
            "color": this._getColor(this.startColorIndex + i),
          };
        }

        tooltipData.series.push({"name": currentCat});
        tooltipData.seriesObj[currentCat] = {};
      }

      //set our confs
      this.set('_categoryRegisterConfig', config);
      this.set('_categoryRegisterTooltipData', tooltipData);
    }
  },
  _computeHideCategoryRegister: function() {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    this.set('_hideCategoryRegister', this.hideCategoryRegister || !this.categoryKey);
  }
}, PxVisBehavior.observerCheck, PxVisBehavior.completeSeriesConfig, PxVisBehavior.categories, PxVisBehaviorChart.getHideClass];

/*
    Name:
    PxVisBehaviorChart.categoryAndAxisRegisterConfigs

    Description:
    Behavior providing properties for configuring category and axis register (// coordinates and radar)
    @polymerBehavior PxVisBehaviorChart.categoryAndAxisRegisterConfigs
*/
PxVisBehaviorChart.categoryAndAxisRegisterConfigs = [{

  properties: {
    /**
    * Configuration object used to customize the register cosmetic properties.
    * Please refer to px-vis-register (https://github.com/PredixDev/px-vis) for a list of supported properties
    *
    */
    axisRegisterConfig: {
      type: Object
    },
    /**
    * Configuration object used to customize the register cosmetic properties.
    * Please refer to px-vis-register (https://github.com/PredixDev/px-vis) for a list of supported properties
    *
    */
    categoryRegisterConfig: {
      type: Object
    }
  },
  observers: [
    '_axisRegisterConfigChanged(axisRegisterConfig.*)',
    '_categoryRegisterConfigChanged(categoryRegisterConfig.*)',
  ],
  _categoryRegisterConfigChanged: function(conf) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    this._applyConfigToElement(this.categoryRegisterConfig, this.$.categoryRegister);
  },
  _axisRegisterConfigChanged: function(conf) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    this._applyConfigToElement(this.axisRegisterConfig, this.$.axisRegister);
  },
}, PxVisBehavior.observerCheck, PxVisBehaviorChart.subConfiguration];

/*
    Name:
    PxVisBehaviorChart.registerPagnationBase

    Description:
    Behavior providing the register pagnation properties and methods
    @polymerBehavior PxVisBehaviorChart.registerPagnationBase
*/
PxVisBehaviorChart.registerPagnationBase = {

  properties: {
    _currentPage: {
      type: Number,
      value: 0
    },

    _registerCurrentPage: {
      type: Number,
      value: 1
    },

    _registerTotalPages: {
      type: Number,
      value: 1
    },

    _registerDisplayPageArrows: {
      type: Boolean,
      value: false
    }
  },

  ready: function() {
    this.addEventListener('px-vis-register-page-change', this._changePage.bind(this));
  },

  _changePage: function(evt) {
    this._currentPage += evt.detail.direction;

    if(this._currentPage < 0) {
      this._currentPage = this.tooltipData.additionalPoints.length;
    } else if(this._currentPage > this.tooltipData.additionalPoints.length) {
      this._currentPage = 0;
    }

    this.set('_registerCurrentPage', this._currentPage + 1);
    this._updateRegisterData();
  },

  _resetPages: function() {
    this._currentPage = 0;
    this.set('_registerCurrentPage', 1);

    if(this.tooltipData.additionalPoints && this.tooltipData.additionalPoints.length) {
      this.set('_registerDisplayPageArrows', true);
      this.set('_registerTotalPages', this.tooltipData.additionalPoints.length + 1);
    } else {
      this.set('_registerDisplayPageArrows', false);
      this.set('_registerTotalPages', 1);
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.registerPagnation

    Description:
    Behavior providing the register pagnation properties and methods
    @polymerBehavior PxVisBehaviorChart.registerPagnation
*/
PxVisBehaviorChart.registerPagnation = [{
  properties: {
    _registerTooltipData: {
      type: Object
    }
  },

  _tooltipDataUpdated: function() {
    this._resetPages();

    this.set('_registerTooltipData', this.tooltipData);

  },

  _updateRegisterData: function() {
    if(this._currentPage === 0) {
      this.set('_registerTooltipData', this.tooltipData);
    } else {
      this.set('_registerTooltipData', this.tooltipData.additionalPoints[this._currentPage - 1]);
    }
  }
}, PxVisBehaviorChart.registerPagnationBase];

/*
    Name:
    PxVisBehaviorChart.registerPagnationMultiAxis

    Description:
    Behavior providing the register pagnation properties and methods
    @polymerBehavior PxVisBehaviorChart.registerPagnationMultiAxis
*/
PxVisBehaviorChart.registerPagnationMultiAxis = [{
  _updateRegisterData: function() {
    if(this._currentPage === 0) {
      this._buildAxisTooltipData(this.tooltipData.dataset, this.tooltipData.time);
      this.set('_axisRegisterIconColor', this.tooltipData.color);
    } else {
      this._buildAxisTooltipData(
        this.tooltipData.additionalPoints[this._currentPage - 1].dataset, this.tooltipData.additionalPoints[this._currentPage - 1].time
      );
      this.set('_axisRegisterIconColor', this.tooltipData.additionalPoints[this._currentPage - 1].color);
    }
  }
}, PxVisBehaviorChart.registerPagnationBase];

/*
    Name:
    PxVisBehaviorChart.tooltipFollowMouseCalculation

    Listen/unlisten mousemove on a target (based on _computedShowTooltip) and caculates mouse pos for it,
    storing it in mousePosition

    Description:
    Behavior providing property for muting axes
    @polymerBehavior PxVisBehaviorChart.tooltipFollowMouseCalculation
*/
PxVisBehaviorChart.tooltipFollowMouseCalculation = [{
  properties: {
    /**
      * handler to the function for calculating tooltip pos
      */
      _tooltipCalcMousePosHandler: {
        type: Function
      },
      /**
       * Id of the target of hovering
       */
      _tooltipCalcHoverTargetId: {
        type: String
      },
      /**
       * The mouse position in pixel coordinates. Only valid if _computedShowTooltip is true
       */
      mousePosition: {
        type: Array
      },
  },
  observers: [
    '_computedShowTooltipChanged(_computedShowTooltip)'
  ],
  _computedShowTooltipChanged: function() {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    if(!this._tooltipCalcMousePosHandler) {
      this._createHandler();
    }

    //listen or unlisten mousemove
    if(this._computedShowTooltip) {
      this.$[this._tooltipCalcHoverTargetId].addEventListener('mousemove', this._tooltipCalcMousePosHandler);
    } else {
      this.$[this._tooltipCalcHoverTargetId].removeEventListener('mousemove', this._tooltipCalcMousePosHandler);
    }
  },
  _calcMousePos: function(evt) {
    this.set('mousePosition',[evt.pageX,evt.pageY]);
  },
  _createHandler: function() {
    this._tooltipCalcMousePosHandler = this._calcMousePos.bind(this);
  }
}, PxVisBehavior.observerCheck, PxVisBehaviorChart.showTooltip];

/*
    Name:
    PxVisBehaviorChart.thresholdConfig

    Description:
    Behavior providing the thresholdConfig property
    @polymerBehavior PxVisBehaviorChart.thresholdConfig
*/
PxVisBehaviorChart.thresholdConfig = {
  properties: {
    /**
     * Configuration object used to customize the threshold properties.
     * Please refer to px-vis-threshold (https://github.com/PredixDev/px-vis) for a list of supported properties
     *
     */
    thresholdConfig: {
      type: Object
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.combineMutes

    Description:
    Behavior providing ways to combine different type of muting into one array
    @polymerBehavior PxVisBehaviorChart.combineMutes
*/
PxVisBehaviorChart.combineMutes = [{
  properties: {
    _combinedMutedSeries: {
      type: Object,
      value: function() { return {}; }
    },
    /**
     * An object which holds the series lines that have been muted based on the selected domain
     *
     */
    mutedSeriesDomain: {
      type:Object,
      value: function() { return {} }
    },
    /**
     * An object which holds the series lines that have been muted based on the axes brushes
     *
     */
    mutedSeriesBrush: {
      type:Object,
      value: function() { return {} }
    },
    /**
     * An object which holds the series lines that have been muted based on
     * the categories
     *
     */
    mutedSeriesCategories: {
      type: Object,
      value: function() { return {} }
    }
  },
  observers: ['_combineMutes(mutedSeriesBrush, mutedSeriesDomain, mutedSeriesCategories.*)'],

  /**
   * Takes the muted series from the axis brush and the selected domain and returns a merged copy of them
   *
   */
  _combineMutes: function(m1,m2) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    var muted = {},
        mutedCategories = Object.keys(this.mutedSeriesCategories).filter(function(cat) {
          return this.mutedSeriesCategories[cat];
        }.bind(this));
    // for these, we assume that "false" items will just have been removed
    for(var k in m1) {
      muted[k] = m1[k];
    }
    for(var k in m2) {
      muted[k] = m2[k];
    }

    if(mutedCategories.length && this.chartData) {

      //for each point
      for(var i=0; i<this.chartData.length; i++) {

        //search for each muted category
        for(var j=0; j<mutedCategories.length;j++) {
          if(this.chartData[i][this.categoryKey] ===mutedCategories[j]) {
            muted[this.chartData[i][this.seriesKey]] = true;
            break;
          }
        }
      }
    }
    this.set('_combinedMutedSeries', muted);
    this.set('_combinedMutedChanged', this._combinedMutedChanged ? false : true);
  }
}, PxVisBehavior.observerCheck];

/*
    Name:
    PxVisBehaviorChart.multiAxisMuting

    Behavior for multi-axis charts (radar, parallel) to handle brush muting

    Description:
    Behavior providing property for muting axes
    @polymerBehavior PxVisBehaviorChart.multiAxisMuting
*/
PxVisBehaviorChart.multiAxisMuting = [{
  properties: {
    _mutedExtents: {
      type: Object,
      value: function() {
        return {};
      }
    }
  },

  ready: function() {
    this._extentsDataRoutes['mute'] = '_addToMutedExtents';
  },

  _addToMutedExtents: function() {
    this._mutedExtents[this.extentsData.dimension] = this.extentsData.extents;

    this._calcMutedSeries();
  },

  _calcMutedSeries: function() {
    var dims = Object.keys(this._mutedExtents),
        mutedSeries = {},
        brushDomains = {},
        k;

    for(var i = 0; i < dims.length; i++) {
      k = dims[i];
      this._calcSingleMutedSeries(this._mutedExtents[k], k, mutedSeries, brushDomains);
    }

    this.set('mutedSeriesBrush', mutedSeries);
    this.set('brushDomains.muted', brushDomains);
  },

  /**
   * calc muted series based on the extents
   */
  _calcSingleMutedSeries: function(extents, dim, series, brushDomains) {
    // if the brush has been cleared
    if(!extents || extents.length === 0) {
      return;
    }

    if(this.chartData && this.chartData.length > 0) {
      var domain = [],
          lower = 0,
          upper = 1,
          y0, y1;

      if(this._flipAxisLogic) {
        lower = 1;
        upper = 0
      }

      if(typeof this.y === 'function') {
        y0 = this.y.invert(extents[lower]);
        y1 = this.y.invert(extents[upper]);
      } else {
        y0 = this.y[dim].invert(extents[lower]);
        y1 = this.y[dim].invert(extents[upper]);
      }

      for(var i = 0; i < this.chartData.length; i++) {
        if(this.brushToRemove) {
          if(y0 >= this.chartData[i][dim] && this.chartData[i][dim] >= y1) {
            series[this.chartData[i][this.seriesKey]] = true;
          }
        } else {
          if(y0 <= this.chartData[i][dim] || this.chartData[i][dim] <= y1) {
            series[this.chartData[i][this.seriesKey]] = true;
          }
        }
        domain = [y0, y1];
      }

      brushDomains[dim] = domain;
    }
  },

  deleteMutedBrushes: function() {
    this.set('_brushDomains.muted', {});
  }
}, PxVisBehaviorChart.extentsDataRouter ];

/*
    Name:
    PxVisBehaviorChart.multiAxisZoom

    Description:
    Behavior providing properties for zooming on multi-axis charts (radar, parallel)
    @polymerBehavior PxVisBehaviorChart.multiAxisZoom
*/
PxVisBehaviorChart.multiAxisZoom = [{
  listeners: {
    'px-vis-toolbar-reset-zoom': 'resetZoom',
    'px-vis-toolbar-zoom-in': 'zoomIn',
    'px-vis-toolbar-zoom-out': 'zoomOut',
    'px-vis-toolbar-undo-zoom': 'undoZoom',
    'px-vis-interaction-space-start-panning': '_saveZoomState'
  },

  /**
   * Sets the selectedDomain to the drawn zoom and shows the button
   *
   */
  zoom: function() {
    if(this.extentsData.extents.length) {
      this._saveZoomState();
      this._zoomOrPan();
    }
  },

  pan: function() {
    this._zoomOrPan();
  },

  _saveZoomState: function() {
    var domains = this._processYValues(function(axis, index) {
      return axis.domain();
    });

    this.zoomStack.push(domains);
  },

  _zoomOrPan: function() {
    var exts = this.extentsData.extents,
        domains;
    if(typeof this.y === 'function') {
      domains = [ this.y.invert(exts[0]), this.y.invert(exts[1]) ];

    } else if(this.commonAxis) {
      var dims = Object.keys(this.y),
          dim;
      domains = {};

      for(var i =0; i < dims.length; i++) {
        dim = dims[i];
        domains[dim] = [ this.y[dim].invert(exts[1]), this.y[dim].invert(exts[0]) ];
      }

    } else {
      var dim = this.extentsData.dimension;
      domains = {};
      domains[dim] = [ this.y[dim].invert(exts[1]), this.y[dim].invert(exts[0]) ];

    }

    this.set('axesDomain', domains);
  },

  _autoZoom: function(isZoomIn) {
    this._saveZoomState();

    var perc = isZoomIn ? 1 - this.zoomInPercentage : 1 + this.zoomOutPercentage,
        domains = this._processYValues(function(axis, index) {
          var d = axis.domain();
          d[0] = d[0] * perc;
          d[1] = d[1] * perc;
          return d;
        });

    this.set('axesDomain', domains);
  },

  undoZoom: function() {
    if(!this.zoomStack.length) { return; }

    this.set('axesDomain', this.zoomStack.pop());
  },

  /**
   * resets the extents
   *
   */
  resetZoom: function() {
    if(!this.zoomStack.length) { return; }

    this.set('axesDomain', this.zoomStack[0]);

    //empty the zoom stack
    this.zoomStack = [];
  }

}, PxVisBehaviorChart.zoomGeneric];

/*
    Name:
    PxVisBehaviorChart.useCategoryInTooltip

    Description:
    Behavior providing useCategoryInTooltip property
    @polymerBehavior PxVisBehaviorChart.useCategoryInTooltip
*/
PxVisBehaviorChart.useCategoryInTooltip = {
  properties: {
    /**
     * Whether the tooltip should show the category name for each
     * value rather than the axis name.
     * Will use the category name if defined in seriesConfig, otherwise
     * a string with the following formatting: 'categoryKey - category'
     */
    useCategoryInTooltip: {
      type: Boolean,
      value: false
    }
  }
};

/*
    Name:
    PxVisBehaviorChart.tooltipSizing

    Description:
    Behavior providing tooltipSizing property
    @polymerBehavior PxVisBehaviorChart.tooltipSizing
*/
PxVisBehaviorChart.tooltipSizing = [{
  properties: {
    _svgClientRect: Object,
    _canvasClientRect: Object,
    _winX: Number,
    _winY: Number
  },

  observers: [
    '_setupSizingListener(showTooltip)'
  ],

  detached: function() {
    this.removeEventListener('px-vis-tooltip-sizing-request', this._getSizingBound);
  },

  attached: function() {
    this._getSizingBound = this._getSizing.bind(this);
    this._setupSizingListener();
  },

  _setupSizingListener: function() {
    if(this.showTooltip) {
      this.addEventListener('px-vis-tooltip-sizing-request', this._getSizingBound);

    } else {
      this.removeEventListener('px-vis-tooltip-sizing-request', this._getSizingBound);

    }
  },

  _getSizing: function() {
    requestAnimationFrame(this._getImmediateSizing.bind(this));
  },

  _getImmediateSizing: function() {
    if(this.pxSvgElem) {
      this._svgClientRect = this.pxSvgElem.getBoundingClientRect();
    }

    if(this.canvasContext && this.canvasContext.canvas) {
      this._canvasClientRect = this.canvasContext.canvas.getBoundingClientRect();
    }

    this._winX = window.pageXOffset;
    this._winY = window.pageYOffset;
  }
},
PxVisBehaviorChart.showTooltip];


/*
    Name:
    PxVisBehaviorChart.centralTooltip

    Description:
    Behavior providing properties and methods to show and hide a centralized tooltip

    @polymerBehavior PxVisBehaviorChart.centralTooltip
*/
PxVisBehaviorChart.centralTooltip = [{
  properties: {
    /**
     * Whether the tooltip should be shown or hidden
     */
     tooltipRequested: {
      type: Boolean,
      value: false
    },
    /**
     * Specifies the orientation of the event tooltip.
     *
     * @property tooltipOrientation
     * @type String
     */
      tooltipOrientation: {
      type: String,
      value: 'left'
    },

    /**
     * List of keys & values used for translating this component.
     */
      resources: {
      type: Object,
      value: function() {
        return {
          'en': {
            'Event': 'Event',
            'ID': 'ID',
            'Timestamp': 'Timestamp',
            'X': 'X'
          }
        };
      }
    },

    /**
    * Use the key for localization if value for language is missing.
    * Should always be true for Predix components.
    */
    useKeyIfMissing: {
      type: Boolean,
      value: true
    },

    /**
     * A valid IETF language tag as a string that will be
     * used to localize this component.
     *
     * See https://github.com/PolymerElements/app-localize-behavior for API
     * documentation and more information.
     */
    language: {
      type: String,
      value: 'en'
    },
    /**
    * Use the key for localization if value for language is missing.
    * Should always be true for Predix components.
    */
    useKeyIfMissing: {
      type: Boolean,
      value: true
    },

    _availableTooltips: {
      type: Array,
      value: () => { return []; }
    },

    _usedTooltipMap: {
      type: Map,
      value: () => { return new Map(); }
    },

    _lockedTooltips: {
      type: Set,
      value: () => { return new Set(); }
    }
  },

  listeners: {
    'central-tooltip-display-request': '_centralTooltipDisplayRequest',
    'central-tooltip-cancel-request': '_centralTooltipCancelRequest',
    'central-tooltip-lock-request': '_centralTooltipLockRequest',
    'central-tooltip-lock-cancel': '_centralTooltipLockCancel'
  },

  observers: [
    '_updateTooltipProps(tooltipOrientation, resources, useKeyIfMissing, language, firstDateTimeFormat, secondDateTimeFormat, separator, timezone)'
  ],

  ready: function() {
    this._availableTooltips.push(this.$.centralTooltip);
  },

  _getTooltipToUse: function() {
    // look for first available tooltip
    for(var i=0; i<this._availableTooltips.length; i++) {
      if(!this._lockedTooltips.has(this._availableTooltips[i])){
        return this._availableTooltips[i];
      }
    }

    return this._createTooltip();
  },

  _createTooltip: function() {
    const copy = this._availableTooltips[0].cloneNode(true);

    copy.setAttribute('id', `centralTooltip${this._availableTooltips.length}`);

    this._availableTooltips.push(copy);
    this.appendChild(copy);

    return copy;
  },

  _centralTooltipDisplayRequest: function(evt) {
    const tooltip = this._getTooltipToUse();
    const content = tooltip.querySelector('px-vis-central-tooltip-content');

    this._usedTooltipMap.set(evt.detail.origin, tooltip);

    if(evt.detail.element) {
      tooltip.set('for', evt.detail.element);
    }

    if(evt.detail.mouseCoords) {
      tooltip.set('followMouse', true);
      tooltip.set('mouseCoords', evt.detail.mouseCoords);
    }

    if(evt.detail.orientation) {
      tooltip.set('orientation', evt.detail.orientation);
    }

    if(evt.detail.data) {
      content.set('tooltipDataResult', evt.detail.data);
    }

    tooltip.set('opened', true);

    evt.preventDefault();
    evt.stopPropagation();
  },

  _centralTooltipCancelRequest: function(evt) {
    const tooltip = this._usedTooltipMap.get(evt.detail.origin);
    const content = tooltip.querySelector('px-vis-central-tooltip-content');

    tooltip.set('opened', false);

    tooltip.set('for', undefined);
    tooltip.set('followMouse', false);
    tooltip.set('mouseCoords', undefined);

    content.set('tooltipDataResult', []);

    this._usedTooltipMap.delete(evt.detail.origin);

    evt.preventDefault();
    evt.stopPropagation();
  },

  _centralTooltipLockRequest: function(evt) {
    const tooltip = this._usedTooltipMap.get(evt.detail.origin);
    this._lockedTooltips.add(tooltip);

    evt.preventDefault();
    evt.stopPropagation();
  },

  _centralTooltipLockCancel: function(evt) {
    this._lockedTooltips.delete(evt.detail.origin);

    evt.preventDefault();
    evt.stopPropagation();
  },

  _resizeTooltip: function() {
    // if the content changes, we need to resize to make sure
    // stuff fits / is aligned
    this.$.tooltip.setPosition();
  },

  _updateTooltipProps: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    // base tooltip is data bound
    if(this._availableTooltips.length === 1) {
      return;
    }

    for(var i=1; i<this._availableTooltips.length; i++) {
      this._availableTooltips[i].set('tooltipOrientation', this.tooltipOrientation);

      const content = this._availableTooltips[i].querySelector('px-vis-central-tooltip-content');
      content.set('resources', this.resources);
      content.set('useKeyIfMissing', this.useKeyIfMissing);
      content.set('language', this.language);
      content.set('firstDateTimeFormat', this.firstDateTimeFormat);
      content.set('secondDateTimeFormat', this.secondDateTimeFormat);
      content.set('separator', this.separator);
      content.set('timezone', this.timezone);
    }
  }


}, PxVisBehaviorTime.datetime];