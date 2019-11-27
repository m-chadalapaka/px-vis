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
/**
Sets the tooltipData property, which can then be used to share adjacent datapoint values with other components, such as the register.

### Usage

    <px-vis-interaction-space
        svg="[[svg]]"
        width="[[width]]"
        height="[[height]]"
        margin="[[margin]]"
        chart-data="[[chartData]]"
        x="[[x]]"
        y="[[y]]"
        tooltip-data="{{tooltipData}}"
        extents-data="{{extentsData}}">
    </px-vis-interaction-space>

### Styling
The following custom properties are available for styling:

Custom property | Description | Default
:----------------|:-------------|----------
  `--px-vis-zoom-brush-outline-color` | The stroke (border) color for the on-chart zoom/selection brush | `$grey6`
  `--px-vis-zoom-brush-fill-color` | The fill (background) color for the on-chart zoom/selection brush | `$gray2`
  `--px-vis-zoom-brush-fill-opacity` | The opacity for the on-chart zoom/selection brush | `0.5`

  `--px-vis-lasso-outline-color` | The stroke (border) color for the on-chart lasso selection | `$grey12`
  `--px-vis-lasso-fill-color` | The fill (background) color for the on-chart lasso selection | `none`
  `--px-vis-lasso-fill-opacity` | The opacity for the on-chart lasso selection | `0.5`

@element px-vis-interaction-space
@blurb Element providing on-chart hover functionality to get data values near the mouse cursor.
@homepage index.html
@demo demo.html

TODO implement a dev setting to choose between only showing data at that x, snapping to nearest data, or interpolating value at x

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'px-icon-set/px-icon-set.js';
import './px-vis-behavior-common.js';
import './px-vis-behavior-interaction.js';
import './px-vis-behavior-d3.js';
import './css/px-vis-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
      <style include="px-vis-styles"></style>
`,

  is: 'px-vis-interaction-space',

  behaviors: [
    PxVisBehavior.observerCheck,
    PxVisBehavior.sizing,
    PxVisBehaviorD3.svg,
    PxVisBehaviorD3.axes,
    PxVisBehavior.dataset,
    PxVisBehavior.tooltipData,
    PxVisBehavior.mutedSeries,
    PxVisBehavior.crosshairData,
    PxVisBehavior.extentsData,
    PxVisBehavior.commonMethods,
    PxVisBehavior.axisTypes,
    PxVisBehavior.completeSeriesConfig,
    PxVisBehavior.zoomSelection,
    PxVisBehavior.seriesKeys,
    PxVisBehavior.selectionType,
    PxVisBehavior.polarData,
    PxVisBehavior.applyActionConfig,
    PxVisBehavior.interactionSpaceShared,
    PxVisBehavior.preventWebWorkerSynchronization,
    PxVisBehavior.wwDataSyncCounter,
    PxVisBehaviorD3.cursorIcon,
    PxVisBehaviorInteraction.lasso,
    PxVisBehavior.scaleTypeCheck
  ],

  /***EVENTS****/
  /*
  * Fires an update to the interaction svg.
  * @event px-vis-interaction-svg-updated
  */
  /*
  * Fires an update to the tooltip.
  * @event px-vis-tooltip-updated
  */
  /*
  * Fired when panning starts.
  * @event px-vis-interaction-space-start-panning
  */
  /*
  * Fired when panning stops.
  * @event px-vis-interaction-space-stop-panning
  */
  /*
  * Fired when crosshair data has been generated. Detail contains:
  * {
  *  'crosshairData': the crosshair data
  * }
  * @event px-vis-crosshair-data-generated
  */


  /**
   * Properties block, expose attribute values to the DOM via 'reflect'
   *
   * @property properties
   * @type Object
   */
  properties: {
    /**
     * Holder for the interaction rectangle object.
     *
     */
    _rect:{
      type:Object
    },
    /**
     * An object that contains meta data for the area drawn by the user.
     *
     */
    _actionArea: {
      type: Object,
      value: function() {return {};}
    },

    /**
     * The actual mouse svg rectangle which can be used to activate the tooltip.
     *
     */
    mouseRect: {
      type: Object,
      notify: true
    },
     /**
     * Name of the variable holding the time stamp in the data. Used for non timeseries charts.
     */
    timeData: {
      type: String,
      value: 'Timestamp'
    },
    /**
     * Set of predefined actions that can be used out of the box.
     */
    actionMapping: {
      type: Object,
      readOnly: true,
      value: {
        'startZooming': '_startZooming',
        'stopZooming': '_finishActionBox',
        'startStriping': '_startStriping',
        'stopStriping': '_finishActionBox',
        'calcTooltipData': '_calcTooltipData',
        'calcCrosshairData': '_calcCrosshairData',
        'calcTooltipAndCrosshairData': '_calcTooltipAndCrosshairData',
        'resetTooltipAndCrosshairData': '_resetTooltipAndCrosshairData',
        'resetTooltip': '_resetTooltipData',
        'resetCrosshair': '_resetCrosshairData',
        'startPanning': '_startPanning',
        'stopPanning': '_stopPanning',
        'reportMouseCoords': '_reportMouseCoords',
        'startLasso': '_startLasso',
        'stopLasso': '_stopLasso',
        'calcPinnedMarkedData': '_calcPinnedMarkedData'
      }
    },
    /**
    * Configuration used to define what actions happen on events.
    * Each key represents an event, each value can be:
    * - a predefined action found in px-vis-interaction-space `actionMapping`
    * - a function, where `this` will be bound to the chart and the function's argument will be the mouse position on the chart
    */
    actionConfig: {
      type: Object,
      notify: true,
      value: function() {
        return {
          'mousedown': 'startZooming',
          'mouseup': 'stopZooming',
          'mouseout': 'resetTooltip',
          'mousemove': 'calcTooltipData'
        };
      }
    },
    _panningStartVal: {
      type: Array,
      value: function() {
        return [];
      }
    },
    /**
     * If false, will pass `hidden: true` in the tooltip data.
     */
    showTooltip: {
      type: Boolean,
      value: true
    },
    _calculatingData: {
      type: Boolean,
      value: false
    },
    /**
     * Whether the scatter plot is using radial coordinates (x=phase, y=amplitude).
     */
    radial: {
      type: Boolean,
      value: false
    },
    /**
     * Whether tooltip data is currently being searched for.
     */
    _calcTooltip: {
      type: Boolean,
      value: false
    },
    /**
     * Whether pinMarker data is currently being searched for.
     */
    _calcPinnedMarker: {
      type: Boolean,
      value: false
    },
    /**
     *  Whether crosshair data is currently being searched for.
     */
    _calcCrosshair: {
      type: Boolean,
      value: false
    },

    /**
     * The search radius for quadtree searches. Only points inside this radius will be returned.
     */
    searchRadius: {
      type: Number
    },
    /**
     * Unique ID of the chart owning this interaction space.
     */
    chartId: {
      type: String
    },

    /**
     * the tooltip/crosshair search: closestPoint, pointPerSeries, allInArea, polygon
     */
    searchType: {
      type: String,
      value: 'closestPoint'
    },

    /**
     * the tooltip search for: `timestamp`, `point`
     */
    searchFor: {
      type: String,
      value: 'timestamp'
    },

    /**
     * Holder for the cursor drawing objects.
     *
     * @property _cursor
     * @type Object
     */
    _cursor:{
      type:Object
    },
    /**
     * Holder for the icon drawing object.
     *
     */
    _icon:{
      type:Object
    },
    /**
     * Holder for the drawing object.
     *
     */
    _cursorGroup: {
      type:Object
    },

    _lastIcon: {
      type: String,
      value: 'none'
    },

    _lastCursor: {
      type: String,
      value: 'none'
    },

    /**
     * Name of the icon type.
     */
    iconType: {
      type: String,
      value: 'none'
    },
    /**
     * Type of cursor drawing to add:
     *  - 'none' : default
     *  - 'crosshair' : draws vertical and horizontal line
     *  - 'circle' : draws circle of size radius
     */
    cursorType: {
      type: String,
      value: 'none'
    },

    /**
     * Boolean specifying if a quadtree should be created and used for searching.
     */
    useQuadtree: {
      type: Boolean,
      value: false
    },

    _originalBoxCoords: {
      type: Object,
      value: function() {
        return {
          x: null,
          y: null,
          ox: null,
          oy: null,
          width: null,
          height: null
        }
      }
    },
    _height: Number,
    _width: Number,
    isBar: {
      type: Boolean,
      value: false
    },
    isHeatmap: {
      type: Boolean,
      value: false
    }
  },

  observers: [
    'drawElement(domainChanged, chartData.*, svg, width, height, completeSeriesConfig, offset.*)',
    '_drawCursorIcon(_cursorGroup, iconType)',
    '_drawCursor(_icon, cursorType)',
    '_updateRadius(searchRadius)',
    '_setupActions(actionConfig.*)',
    '_resetTooltipDataLegacy(completeSeriesConfig.*)',
    '_resetTooltipData(seriesKeys.*, defaultEmptyData.*)',
    '_createQuadtreeData(wwDataSyncCounter, width, height, margin.*, domainChanged, searchType, useQuadtree, counterClockwise, xAxisType, preventWebWorkerSynchronization)',
    '_callCreateQuadtreeData(mutedSeries)',
    '_updateTooltipData(domainChanged)'
  ],

  /**
  * When attached, re-fire set properties for precipitation pattern.
  *
  * @method attached
  */
  attached: function(){
    if(this._doesObjHaveValues(this.tooltipData)){
      this.fire('px-vis-tooltip-updated', { 'dataVar': 'tooltipData', 'data': this.tooltipData, 'method':'set' });
    }

    if(this._doesObjHaveValues(this.mouseRect)){
      this.fire('px-vis-mouse-rect-updated', {'data': this.mouseRect, 'dataVar': 'mouseRect', 'method': 'set'});
    }

  },

  /**
   * Draws the tooltip elements and sets up listeners and callbacks on chart hover.
   * Sets the tooltipData property, which gets passed to the register.
   *
   * @method drawElement
   */
  //drawElement
  drawElement: function() {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    // append the rectangle to capture mouse interactions
    if(!this._rect) {
      if(!this.radial) {
        this._width = Math.max(this.width - this.margin.left - this.margin.right,0);
        this._height = Math.max(this.height - this.margin.bottom - this.margin.top,0);

        this._rect = this.svg.append('rect')
          .attr('id','mouseCapture')
          .attr('width', this._width)
          .attr('height', this._height)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .style('cursor','crosshair');
      } else {
        this._rect = this.svg.append('circle')
          .attr('id','mouseCapture')
          .attr('r', Math.max(this.width,0))
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .style('cursor','crosshair');
      }

      this._rect.on("mousemove.cursor", this._updateCursor.bind(this));
      this._rect.on("mouseout.cursor", this._hideCursor.bind(this));
      this._rect.on("mouseenter", function() { this.dispatchEvent(new CustomEvent('px-vis-tooltip-sizing-request', { bubbles: true, composed: true })); }.bind(this));

      this._drawCursorGroup();

      if(this.actionConfig) {
        this._setupActions();
      }

        this.set('mouseRect', this._rect.node());
        this.fire('px-vis-mouse-rect-updated', {'data': this.mouseRect, 'dataVar': 'mouseRect', 'method': 'set'});
    } else {
      if(!this.radial) {
        this._width = Math.max(this.width - this.margin.left - this.margin.right,0);
        this._height = Math.max(this.height - this.margin.bottom - this.margin.top,0);

        this._rect.attr('width', this._width)
        .attr('height', this._height);
      } else {
        this._rect.attr('r', Math.max(this.width,0));
      }
    }
  },

  _startStriping: function() {
    this.set('extentsAction', 'stripe');
    this._drawActionBox();
  },

  _startZooming: function() {
    this.set('extentsAction', 'zoom');
    this._drawActionBox();
  },

  _drawCursorGroup: function() {
    if(!this._cursorGroup) {
      this._cursorGroup = this.svg.append('g')
        .attr("display", "none")
        .attr('pointer-events', 'none');
    }
  },

  _drawCursor: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(this._doesD3HaveValues(this._cursor)) {
      this._cursor.remove();
    }

    if(this.cursorType === 'circle') {
      this._cursorGroup
        .insert("circle", ":first-child")
        .attr("class", "mouseCursor")
        .attr('fill', this._checkThemeVariable('--px-vis-zoom-brush-fill-color', 'rgb(0,0,0)'))
        .attr('fill-opacity', this._checkThemeVariable('--px-vis-zoom-brush-fill-opacity', 0.15))
        .attr('stroke', this._checkThemeVariable('--px-vis-zoom-brush-outline-color', 'rgb(0,0,0)'))
        .attr("r", this.searchRadius)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr('pointer-events', 'none');
    }

    if(this.cursorType === 'crosshair') {
      this._cursorGroup
        .insert('line', ":first-child")
        .attr('class', 'mouseCursor')
        .attr('stroke', this._checkThemeVariable("--px-vis-cursor-line-color", 'rgb(0,0,0)'))
        .attr('stroke-width', 2)
        .attr('opacity', 1)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('pointer-events', 'none');

      this._cursorGroup
        .insert('line', ":first-child")
        .attr('class', 'mouseCursor')
        .attr('stroke', this._checkThemeVariable("--px-vis-cursor-line-color", 'rgb(0,0,0)'))
        .attr('stroke-width', 2)
        .attr('opacity', 1)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('pointer-events', 'none');

    }

    this._cursor = this._cursorGroup.selectAll('.mouseCursor');
    this._addClipPath(this._cursor);
  },

  _updateRadius: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(this.cursorType !== 'circle') {
      this.cursorType = 'circle';
      this._drawCursor();
    }

    this._cursor.attr("r", this.searchRadius)

  },

  _addClipPath: function(elem) {
    if(this.clipPath) {
      this.addClipPath(elem);
    }
  },

  _updateCursor: function() {
    if(this._isD3Empty(this._cursorGroup) || this._isD3Empty(this._icon)) {
      return;
    }

    var mousePos = Px.d3.mouse(this._rect.node());

    this._cursorGroup
      .attr('display',null);

    this._positionCursorIcon(mousePos);

    if(this.cursorType === 'circle') {
      this._cursor
        .attr("cx", mousePos[0])
        .attr("cy", mousePos[1]);
    }
  },

  _hideCursor: function() {
    this._cursorGroup
      .attr('display', 'none');
  },

  _setupActions: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(this._rect) {
      this._setupRegularActions(this._rect, this._rect.node(), false);
    }
  },

  _resetTooltipDataLegacy: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(!this.seriesKeys){
      this._resetTooltipData();
    }
  },

  _resetTooltipAndCrosshairData: function() {
    this._resetTooltipData();
    this._resetCrosshairData();
  },

  _resetCrosshairData: function() {

    this.set('_calculatingData', false);
    var ttD = {
          'rawData': [],
          'timeStamps': []
        }

    this.set('crosshairData',ttD);
    this.set('_lassoCrosshairData', ttD);
    this.generatingCrosshairData = false;
  },

  _calcTooltipAndCrosshairData: function() {
    this._calcTooltip = true;
    this._calcCrosshair = true;
    this._calcPinnedMarker = false;

    this._calcData();
  },

  _calcTooltipData: function() {
    this._calcTooltip = true;
    this._calcCrosshair = false;
    this._calcPinnedMarker = false;

    this._calcData();
  },

  _calcCrosshairData: function() {
    this._calcTooltip = false;
    this._calcCrosshair = true;
    this._calcPinnedMarker = false;

    this._calcData();
  },

  _calcPinnedMarkedData: function () {
    var mousePos = Px.d3.mouse(this._rect.node());
    this.set('_calculatingData', true);
    this.set('_calcPinnedMarker', true);
    this._calcData();
  },

  /**
   * Helper function called on mousemove.
   * Calculates the mouse position and associated x & y values,
   * then sets the d3 elements and sets tooltipData for consumption elsewhere.
   *
   * @method _calcData
   */
  _calcData: function() {

    if(this.searchType === 'lasso' && !this._isLassoing) {
      return;
    }
    this.set('_calculatingData', true);

    if(!this.mouseDown && this.chartData.length > 0 && this.y) {

      //  d3.mouse: returns the x position on the screen of the mouse
      // must be outside debounce or else the elem wont have the proper info anymore
      var mousePos = Px.d3.mouse(this._rect.node());

      this.debounce('move',function() {
        this._getDataForAllSeries(mousePos);
      }, 10);
    }
  },

  _calcDataFinished: function(dataObj) {
    // now we can set our data that we want to pass out
    if(this._calculatingData) {

      if(this._calcCrosshair) {
        this.generatingCrosshairData = true;

        //when in lasso mode keep adding data
        if(this.searchType === 'lasso' && this.crosshairData) {

          var newData

          if(this._lassoCrosshairData) {
            newData = {
              rawData: this._lassoCrosshairData.rawData || [],
              timeStamps: this._lassoCrosshairData.timeStamps || []
            };
          } else {
            newData = {
              rawData: [],
              timeStamps: []
            };
          }

          newData.rawData = newData.rawData.concat(dataObj.rawData);
          newData.timeStamps = newData.timeStamps.concat(dataObj.timeStamps);
          this.set('crosshairData', newData);

        } else {
          this.set('crosshairData', {'rawData': dataObj.rawData, 'timeStamps': dataObj.timeStamps});
        }

        this.fire('px-vis-crosshair-data-generated', {crosshairData: this.crosshairData});
      }

      delete dataObj.timeStampsTracker;

      if(this._calcTooltip) {

        delete dataObj.rawData;
        delete dataObj.timeStamps;
        this.set('tooltipData',dataObj);
        this.fire('px-vis-tooltip-updated', { 'dataVar': 'tooltipData', 'data': dataObj, 'method':'set' });
      }

      if(this._calcPinnedMarker) {
        delete dataObj.rawData;
        delete dataObj.timeStamps;
        this.set('tooltipData',dataObj);
        this.fire('px-vis-pinnedmarker-updated', { 'dataVar': 'tooltipData', 'data': dataObj, 'method':'set' });
                  this.set('_calcPinnedMarker', false);
      }

      this.set('_calculatingData', false);
    }
  },

  /**
   * Searches through all data series, then compiles and returns the tooltip data object.
   */
  _getDataForAllSeries: function(mousePos) {
    var x1 = this._isOrdinalType(this.xAxisType) ? null : this.x.invert(mousePos[0]),
        dataObj = this._returnTooltipDataStub(mousePos); // setup a holder for our data

    if(this.preventWebWorkerSynchronization || this._isOrdinalType(this.xAxisType)) {
      this._searchLocally(mousePos, dataObj, x1);
      return;
    }

    if(this._isTimeType(this.xAxisType) && this.searchFor !== 'point' && this.lassoType === 'xRect') {
      console.log(this.lassoType)
      dataObj.time = x1;
      this._searchLocally(mousePos, dataObj, x1);
      return;
    }

    this._searchOnWebWorker(mousePos, dataObj);
    return;
  },

  _searchOnWebWorker: function(mousePos, dataObj) {
    var ctx = {};
    ctx.action = 'findQuadtreePoints';
    ctx.originatorName = this.nodeName;
    ctx.chartId = this.chartId;
    ctx.data = this._createBaseDataObjForWebWorker();
    ctx.data.mousePos = mousePos;
    ctx.data.calcCrosshair = this._calcCrosshair;
    ctx.data.radius = this.searchRadius;
    ctx.data.searchType = this.searchType;
    ctx.data.searchFor = this.searchFor;
    ctx.data.polygon = this._lassoCoords;
    ctx.data.mutedSeries = this.mutedSeries;
    ctx.data.hardMute = this.hardMute;
    ctx.successCallback = function(e) {
      if(!e.data) { return; }

      dataObj.series = e.data.series;
      dataObj.seriesObj = e.data.seriesObj;
      dataObj.rawData = e.data.rawData;
      dataObj.timeStamps = e.data.timeStamps;
      dataObj.time =  e.data.time ? e.data.time : dataObj.time;
      dataObj.timeSeriesKey =  e.data.timeSeriesKey ? e.data.timeSeriesKey : dataObj.timeSeriesKey;
      dataObj.additionalPoints = e.data.additionalPoints;

      this._calcDataFinished(dataObj);
    }.bind(this);

    Px.vis.scheduler.process(ctx);
  },

  /**
   * Returns the starter dataObj which data will be added to.
   *
   * @method _returnTooltipDataStub
   */
  _returnTooltipDataStub: function(mousePos) {
    return this._createTooltipDataStub(mousePos, null, !this.showTooltip)
  },

  _searchLocally: function(mousePos, dataObj, x1) {
    if(this._isTimeType(this.xAxisType) || this.isBar || this.isHeatmap) {
      this._findSingleDataset(mousePos, dataObj, x1);

    } else {
      this._findDataPerKey(mousePos, dataObj, x1);
    }

    this._calcDataFinished(dataObj);
  },

  _findSingleDataset: function(mousePos, dataObj, x1) {
    // bar is closer to time in that we just want to return data associated with the ordinal position we are over
    if(this.isBar) {
      this._searchBarData(mousePos, dataObj, x1);

    //time based X axis
    } else if(this.isHeatmap) {
      this._searchHeatmapData(mousePos, dataObj);
    } else {
      this._searchTimeData(mousePos, dataObj, x1);
    }
  },

  _findDataPerKey: function(mousePos, dataObj, x1) {
    var keys = this.seriesKeys && this.seriesKeys.length ?
          this.seriesKeys :
          Object.keys(this.completeSeriesConfig),
        closestTimestamp = { "distance": Number.MAX_VALUE, "time": null };
        //search for timestamp if we don't have it already (non time based chart) and we know the data has some notion of time -- !! --> turn into a bool
        searchTimeStamp = dataObj.time === null && !!this.chartData[0][this.timeData];

    for(var i = 0; i < keys.length; i++) {
      //if we had a request to reset tooltip stop calculating
      if(!this._calculatingData) {
        break;
      }

      if(!this.hardMute || !this.mutedSeries[keys[i]]) {
        //calc this series: returns updated dataObj, xArr, yArr & closestTimestamp
        this._calcSerieData(dataObj, searchTimeStamp, closestTimestamp, x1, keys[i], mousePos);
      } else {
        this._createEmptySeriesEntry(dataObj, keys[i]);
      }
    } //for

    // add the timestamp
    if(searchTimeStamp && closestTimestamp.time) {
      dataObj.time = closestTimestamp.time;
    }
  },

  _createEmptySeriesEntry: function(dataObj, k) {
    //TODO: coord null or [] ?
    dataObj.series.push({'name': k, 'value': null, 'coord': null });
  },

  /**
   * Returns the tooltipData values for a single series.
   *
   * @method _calcSerieData
   */
  _calcSerieData: function(dataObj, searchTimeStamp, closestTimestamp, x1, k, mousePos) {
    var yKey = this.completeSeriesConfig[k]['y'],
        xKey = this.completeSeriesConfig[k]['x'],
        axisKey = (this.completeSeriesConfig[k]['axis'] && this.completeSeriesConfig[k]['axis']['id']) ? this.completeSeriesConfig[k]['axis']['id'] : null,
        result = { "series": {} },
        xCoord,
        yCoord,
        y1,
        isContinuous = false;

    //ordinal are specials...
    if(this._isOrdinalType(this.xAxisType)) {
      //find ordinal value for X
      result.series[xKey] = this._getOrdinalValue(true, mousePos[0], axisKey);

      //now get Y
      if(this._isOrdinalType(this.yAxisType)) {
        result.series[yKey] = this._getOrdinalValue(false, mousePos[1], axisKey);
      } else {
        y1 = this.isMultiY ? this.y[axisKey].invert(mousePos[1]) : this.y.invert(mousePos[1]);
        result.series[yKey] = this._getClosestValue(false, y1, this.chartData, xKey, yKey, result.series[xKey]);
      }

    } else if(this._isOrdinalType(this.yAxisType)) {
      result.series[yKey] = this._getOrdinalValue(false, mousePos[1], axisKey);
      result.series[xKey] = this._getClosestValue(true, x1, this.chartData, xKey, yKey, result.series[yKey]);

    } else  {  //non time based: iterate over points and find the closest
      result = this._searchContinuousData(searchTimeStamp, closestTimestamp, mousePos, xKey, yKey, axisKey, dataObj);
      isContinuous = true;
    }

    //we already got the pixel coords in continuous
    if(!isContinuous) {
      result.coords = this._getCoordsForValues(result.series[xKey], result.series[yKey], axisKey);

      //also keep pixel coords in array
      dataObj.xArr.push(result.coords[0]);
      dataObj.yArr.push(result.coords[1]);
    }

    dataObj.series.push({'name': k, 'value': result.series, 'coord': result.coords });
    dataObj.seriesObj[k] = {'value': result.series, 'coord': result.coords };
    dataObj.rawData = result.rawData;
    // TODO Convert to SET when we can use ES6
    dataObj.timeStamps = result.timeStamps;
  },

  /**
   * Gets the data for timeseries type datasets.
   *
   * @method _searchTimeData
   */
  _searchTimeData: function(mousePos, dataObj, x1) {
    /*
      d3.bisector returns index in our array that corresponds to the horizontal position of the mouse pointer.
      Specifically this returns the date that falls to the left of the mouse cursor.
    */
    var keys = this.seriesKeys && this.seriesKeys.length ?
          this.seriesKeys :
          Object.keys(this.completeSeriesConfig),
        bisectDate = Px.d3.bisector(function(d) {
          return d[this.timeData];
        }.bind(this)).left,
        index,
        yKey,
        d0,
        d1,
        r,
        result = {
          "series": {},
          "rawData": dataObj.rawData,
          'timeStamps': dataObj.timeStamps,
          'timeStampsTracker': dataObj.timeStampsTracker
        };

    if(this.searchType === 'lasso') {

      //find min and max X
      var ext = d3.extent(this._lassoCoords, function(d) {
        return d[0];
      }),
          resultArr = [],
          searching = true,
          timestamp;

      ext[0] = Number(this.x.invert(ext[0]));
      ext[1] = Number(this.x.invert(ext[1]));
      index = bisectDate(this.chartData, ext[0], 1);

      //get point to the right of min and iterate until we reach max
      do {
        timestamp = this.chartData[index][this.timeData];

        if(timestamp < ext[1]) {

          resultArr.push(this.chartData[index]);
          if(!result.timeStampsTracker[timestamp]) {
            //TODO: pixel search? Should the fuzzy time be applied here instead
            result.rawData.push(this.chartData[index]);

            // TODO Convert to SET when we can use ES6
            result.timeStamps.push(timestamp);
            result.timeStampsTracker[timestamp] = true;
          }
          index++;
        } else {
          searching = false;
        }
      } while(searching)
    } else {
      index = bisectDate(this.chartData, x1, 1),
      // get the data values around our cursor timestamp
      d0 = this.chartData[index - 1],
      d1 = (this.chartData[index]) ? this.chartData[index] : this.chartData[index - 1],
      // sets result as the closest date to the mouse
      r = (x1 - d0[this.timeData] > d1[this.timeData] - x1) ? d1 : d0;
      result.series = r;

      if(!result.timeStampsTracker[r[this.timeData]]) {
        //TODO: pixel search? Should the fuzzy time be applied here instead
        result.rawData.push(r);

        // TODO Convert to SET when we can use ES6
        result.timeStamps.push(r[this.timeData]);
        result.timeStampsTracker[r[this.timeData]] = true;
      }
    }

    let coord,
        axisKey;

    for(var i=0; i<keys.length; i++) {
      yKey = this.completeSeriesConfig[keys[i]]['y'];
      axisKey = (this.completeSeriesConfig[keys[i]]['axis'] && this.completeSeriesConfig[keys[i]]['axis']['id']) ? this.completeSeriesConfig[keys[i]]['axis']['id'] : null;

      coord = [this.x(result.series[this.timeData]), this.isMultiY ? this.y[axisKey](result.series[yKey]) : this.y(result.series[yKey])]

      dataObj.series.push({'name': keys[i], 'value': result.series, 'coord': coord });
      dataObj.seriesObj[keys[i]] = {'value': result.series, 'coord': coord };
    }

    dataObj.rawData = result.rawData;
    // TODO Convert to SET when we can use ES6
    dataObj.timeStamps = result.timeStamps;

    dataObj.time = result.series[this.timeData];
  },

  /**
   * Iterates through all the data and returns the closest datapoints
   * for all non-timeseries, non-ordinal data.
   *
   * @method _searchContinuousData
   */
  _searchContinuousData: function(searchTimeStamp, closestTimestamp, mousePos, xKey, yKey, axisKey, dataObj) {

// TODO add option to pick closet point or closest x
    var xDomain = this.x.domain(),
        yDomain = this.isMultiY ? this.y[axisKey].domain() : this.y.domain(),
        yDomainTot = yDomain[1] - yDomain[0],
        yRange = this.isMultiY ? this.y[axisKey].range()[1] - this.y[axisKey].range()[0] : this.y.range()[1] - this.y.range()[0],
        dataX,
        dataY,
        pixelX,
        pixelY,
        pixelXCopy,
        pixelYCopy,
        closestPointIndex,
        d,
        crosshairResultIndices = [],
        minDist = this.searchRadius ? this.searchRadius : Number.MAX_VALUE,
        result = {
          "series": {},
          "rawData": dataObj.rawData,
          'timeStamps': dataObj.timeStamps,
          'timeStampsTracker': dataObj.timeStampsTracker
        };

    for(var i = 0; i < this.chartData.length; i++) {

      //get point values
      dataX = this.chartData[i][xKey];
      dataY = this.chartData[i][yKey];

      // check if data is in our domain
      if(dataX >= xDomain[0] && dataX <= xDomain[1] && dataY >= yDomain[0] && dataY <= yDomain[1]) {

        //get pixel coords
        if(this.radial) {
          var tmp = this._getPixelCoordForRadialData(dataX, dataY, yRange, yDomain, yDomainTot);
          pixelX = tmp[0];
          pixelY = tmp[1];
        } else {
          pixelX = this.x(dataX);
          pixelY = this.isMultiY ? this.y[axisKey](dataY) : this.y(dataY);
        }

        //keep a copy in case we need this point
        pixelXCopy = pixelX;
        pixelYCopy = pixelY;

        //distance between the two points
        //! pixelX and pixelY are changed during this calculation
        d = Math.sqrt( (pixelX-=mousePos[0])*pixelX + (pixelY-=mousePos[1])*pixelY );

        //keep the closest(s) point
        //searching for tt data or crosshair with 0px radius => find closest value
        if(this._calcTooltip || (this._calcCrosshair && this.crosshairPixelSearch === 0)) {
          if(d < minDist) {
            minDist = d;

            crosshairResultIndices = [];
            crosshairResultIndices.push(i);
            closestPointIndex = i;

            //store this point
            result.series[xKey] = dataX;
            result.series[yKey] = dataY;
            result.coords = [pixelXCopy, pixelYCopy]
          } else if(d === minDist) {
            crosshairResultIndices.push(i);
          }
        } else if(this._calcCrosshair) {
          //search crosshair with radius
          if(d < minDist) {
            crosshairResultIndices = [];
            crosshairResultIndices.push(i);
            closestPointIndex = i;
          } else if(d === this.crosshairPixelSearch) {
            crosshairResultIndices.push(i);
          }
        }
      }
    }

    //store the closest timestamp and distance
    if(this._calcTooltip && searchTimeStamp && closestTimestamp.distance > minDist && (closestPointIndex || closestPointIndex === 0)) {
      closestTimestamp.distance = minDist;
      closestTimestamp.time = this.chartData[closestPointIndex][this.timeData];
    }

    if(this._calcCrosshair) {
      //get all rawData data
      for(var i = 0; i < crosshairResultIndices.length; i++) {
        var d = this.chartData[crosshairResultIndices[i]];

        // FIXME we can dedupe datasets with timeData this way. Need to make a way to do it for non-timedata datasets...
        if((this.timeData && !result.timeStampsTracker[d[this.timeData]])) {
          result.rawData.push(d);
          result.timeStamps.push(d[this.timeData]);
          result.timeStampsTracker[d[this.timeData]] = true;
        } else if(!this.timeData) {
          result.rawData.push(d);
        }
      }
    }

    return result
  },

  /**
   * Tries to find the ordinal value for the mouse position on the X (xAxis=true)
   * or Y (xAxis=false) axis. If searching on X axis, mousePos must be the X value;
   * if searching on the Y axis, mousePos must be the Y value.
   *
   * @method _getOrdinalValue
   */
  _getOrdinalValue: function(xAxis, mousePos, axisKey) {

    var domain,
        range;

    if(xAxis) {
      domain = this.x.domain();
      range = this.x.range();
    } else if(this.isMultiY) {
      domain = this.y[axisKey].domain();
      range = this.y[axisKey].range();
    } else {
      domain = this.y.domain();
      range = this.y.range();
    }

    rangeInterval = (range[1] - range[0])/domain.length;

    var axisPos = 0,
        distance = Number.MAX_VALUE,
        minDistance = Number.MAX_VALUE,
        result = -1;
    for(var i=0; i<domain.length; i++) {

      axisPos = (i+0.5)*rangeInterval;
      distance = Math.abs(axisPos - mousePos);

      if(distance < minDistance) {
        minDistance = distance;
        result = i;
      }
    }

    return domain[result];
  },

  /**
   * Gets the range of all ordinal values between from and to (both being values of the axis).
   *
   * @method _getOrdinalRange
   */
  _getOrdinalRange: function(xAxis, from, to) {

    //get the diferent values
    var allValues = xAxis === true ? this.x.domain() : this.y.domain(),
        fromVal = this._getOrdinalValue(xAxis, from),
        toVal = this._getOrdinalValue(xAxis, to),
        fromIndex = allValues.indexOf(fromVal),
        toIndex = allValues.indexOf(toVal),
        result  = [];

    //now add everything between the two values, including those 2 values
    for(var i=fromIndex; i<toIndex+1; i++) {
      result.push(allValues[i]);
    }
    return result;
  },

  /**
   * Gets the closest value on the X (xAxis=true) or Y axis (xAxis=false)
   * for a specific ordinal value defined on the other axis.
   *
   * @method _getClosestValue
   */
  _getClosestValue: function(xAxis, value, data, xKey, yKey, ordValue) {
    var dataIndex = xAxis ? xKey : yKey,
        ordIndex = xAxis ? yKey : xKey,
        minDiff = Number.MAX_VALUE,
        curr,
        currDiff,
        result;

    // FIXME remove forEach
    data.forEach(function(point, index) {
      //only look at points that have the proper ordinal value
      if(point[ordIndex] === ordValue) {
        curr = point[dataIndex];

        currDiff = Math.abs(value - curr);
        if(currDiff < minDiff) {
          minDiff = currDiff;
          result = curr;
        }
      }
    });

    return result;
  },

  _searchBarData: function(mousePos, dataObj, x1) {
    var keys = this.seriesKeys,
        ordVal,
        bandStart,
        bandEnd,
        ordScale,
        linScale,
        mouseIndex,
        ordKey,
        x,
        y,
        result = {
          "series": {},
          "coord": [],
        };

    if(this._isOrdinalType(this.xAxisType)) {
      ordScale = 'x';
      linScale = 'y';
      mouseIndex = 0;
      ordKey = this.completeSeriesConfig[keys[0]]['x'];
    } else {
      ordScale = 'y';
      linScale = 'x';
      mouseIndex = 1;
      ordKey = this.completeSeriesConfig[keys[0]]['y'];
    }

    ordVal = this[ordScale].invert(mousePos[mouseIndex]);
    bandStart = this[ordScale](ordVal);
    bandEnd = bandStart + this[ordScale].bandwidth();

    // our self-created ordScale.invert counts the padding between bands
    // So check if we are in the padding space or actually over the bar
    if(bandStart <= mousePos[mouseIndex] && mousePos[mouseIndex] <= bandEnd) {
      // Assuming small datasets; otherwise we may need to revisit this
      for(var i=0; i< this.chartData.length; i++) {
        if(this.chartData[i][ordKey] === ordVal) {
          result.series = this.chartData[i];
          break;
        }
      }

      x = this[ordScale](ordVal);
      for(var i=0; i<keys.length; i++) {
        y = this[linScale](result.series[this.completeSeriesConfig[keys[i]][linScale]]);
        result.coord = ordScale === 'x' ? [x,y] : [y,x];

        dataObj.series.push({'name': keys[i], 'value': result.series, 'coord': result.coord });
        dataObj.seriesObj[keys[i]] = {'value': result.series, 'coord': result.coord };
        dataObj.ordinalSet = ordVal;
      }
    }
  },

  _searchHeatmapData(mousePos, dataObj) {

    const x = this.x.invert(mousePos[0]),
          y = this.y.invert(mousePos[1]),
          xKey = this.completeSeriesConfig[this.seriesKeys[0]].x,
          yKey = this.completeSeriesConfig[this.seriesKeys[0]].y;

    for(var i=0; i<this.chartData.length; i++) {
      if(this.chartData[i][xKey] === x && this.chartData[i][yKey] === y) {
        dataObj.series.push({
          'name': this.seriesKeys[0],
          'value': this.chartData[i],
          'coord': [this.x(this.chartData[i][xKey]), this.y(this.chartData[i][yKey])]});
        break;
      }
    }
  },

  /**
   * Helper function called on document.mouseup.
   * Assumes the user wanted to 'close' the action box, and calls _finishActionBox.
   *
   * @method _mouseUpOutsideSvg
   */
  _mouseUpOutsideSvg: function() {
    this._finishActionBox();
  },

  /**
   * Initiate Panning action
   */
  _startPanning: function() {
    //only allow left clicks
    if(Px.d3.event.button === 0) {
      this.set('extentsAction', 'pan');
      this.mouseDown = true;

      //this._resetTooltipData();

      //in case the user clicks inside the chart, and mouses out, we are waiting for a mouseup, and closing our action box with the coordinates available on the mouseup.
      Px.d3.select(document).on('mouseup.action', this._stopPanning.bind(this));
      Px.d3.select(document).on('mousemove.action', this._updatePanning.bind(this));

      var mousePos = Px.d3.mouse(this._rect.node());

      if(this.radial){
        this._initializePanningRadial(mousePos);
      } else {
        this._initializePanning(mousePos);
      }

      this.fire('px-vis-interaction-space-start-panning');
    }
  },

  _initializePanningRadial: function(mousePos) {
    this._panningStartVal[0] = mousePos[0];
    this._panningStartVal[1] = mousePos[1];
  },

  _initializePanning: function(mousePos) {
    //for ordinal axis store mouse pos, for others the corresponding value
    if(this.xAxisType === 'ordinal'||this.xAxisType === 'scaleBand') {
      this._panningStartVal[0] = mousePos[0];
    } else {
      this._panningStartVal[0] = this.x.invert(mousePos[0]);
    }

    if(this.yAxisType === 'ordinal'||this.yAxisType === 'scaleBand') {
      this._panningStartVal[1] = mousePos[1];
    } else {
      this._panningStartVal[1] = this._processYValues(function(axis, index) {
        return axis.invert(mousePos[1]);
      });
    }
  },

  _updatePanning: function() {

    var newExtents,
        mousePos = Px.d3.mouse(this._rect.node());

      if(this.radial) {
        newExtents = this._updatePanningCoordsRadial(mousePos);
      } else {
        newExtents = this._updatePanningCoords(mousePos);
      }

      this.set('extentsData', newExtents);
  },

  _updatePanningCoordsRadial: function(mousePos) {
    return {
      x1 : this._panningStartVal[0],
      y1 : this._panningStartVal[1],
      x2 : mousePos[0],
      y2 : mousePos[1]
    }
  },

  _updatePanningCoords: function(mousePos) {
    var newExtents = {},
        currentPanningVal,
        diff,
        xDomain = this.x.domain(),
        yDomain;

    //for now ignore ordinal axis but allow panning along the other axis
    //if it's not ordinal as well

    //X
    if(this.xAxisType !== 'ordinal' && this.xAxisType !== 'scaleBand') {
      currentPanningVal = this.x.invert(mousePos[0]);
      diff = currentPanningVal - this._panningStartVal[0];
      newExtents.eX = [xDomain[0] - diff, xDomain[1] - diff];
    } else {
      newExtents.eX = xDomain;
      this._adjustOrdinalAlign(this.x, mousePos[0], this._panningStartVal[0]);
      //store mouse pos for next update
      this._panningStartVal[0] = mousePos[0];
    }

    //Y
    if(this.yAxisType !== 'ordinal' && this.yAxisType !== 'scaleBand') {

      newExtents.eY = this._processYValues(function(axis, index) {
        currentPanningVal = axis.invert(mousePos[1]);
        diff = (index || index === 0) ? currentPanningVal - this._panningStartVal[1][index] : currentPanningVal - this._panningStartVal[1];
        yDomain = axis.domain();
        return [yDomain[0] - diff, yDomain[1] - diff];
      });
    } else {
      //keep same domain and play on alignment for panning
      newExtents.eY = this._processYValues(function(axis, index) {
        //play on align to simulate panning
        if(index || index === 0) {
          this._adjustOrdinalAlign(axis, mousePos[1], this._panningStartVal[1][index]);
          //store mouse pos for next update
          this._panningStartVal[1][index] = mousePos[1];
        } else {
          this._adjustOrdinalAlign(axis, mousePos[1], this._panningStartVal[1]);
          //store mouse pos for next update
          this._panningStartVal[1] = mousePos[1];
        }
        //keep same domain
        return axis.domain();
      });
    }

    return newExtents;
  },

  _adjustOrdinalAlign: function(axis, mousePos, initialMousePos) {
    var diff = (mousePos - initialMousePos)/2,
        step = axis.step(),
        axisRange = axis.range(),
        outerSize = axis.step() * axis.padding(),
        leftSize = outerSize * axis.align(),
        //rightSize = outerSize * (1 - axis.align()),
        newAlign;

    //adjust sizes with panning
    leftSize = Math.min(Math.max(0, leftSize + diff), step);
    //rightSize = Math.min(Math.max(0, rightSize - diff), step);
    newAlign = Math.max(0, Math.min(leftSize/outerSize, 1));

    axis.align(newAlign);
  },

  _stopPanning: function() {

    this._updatePanning();

    Px.d3.select(document).on('mouseup.action', null);
    Px.d3.select(document).on('mousemove.action', null);

    this.mouseDown = false;

    this.fire('px-vis-interaction-space-stop-panning');
  },

  /**
   * Helper function called on mousedown.action.
   * Draws a rectangle on the chart.
   *
   * @method _drawActionBox
   */
  _drawActionBox: function() {

    //only allow left clicks
    if(Px.d3.event.button === 0) {
      this.mouseDown = true;
      //in case the user clicks inside the chart, and mouses out, we are waiting for a mouseup, and closing our action box with the coordinates available on the mouseup.
      Px.d3.select(document).on('mouseup.action', this._mouseUpOutsideSvg.bind(this));
      Px.d3.select(document).on('mousemove.action', this._updateActionBox.bind(this));

      var mousePos = Px.d3.mouse(this._rect.node());
      // use original svg so it draws under the _rect and does not interfer with our mouse events

      var startX = mousePos[0],
          startY = mousePos[1];

      if(this.selectionType === 'xAxis') {
        startY = 0;
      } else if(this.selectionType === 'yAxis') {
        startX = 0;
      }

      // save this original position for calcs
      this._originalBoxCoords = {
        x: startX,
        y: startY,
        ox: startX,
        oy: startY,
        width: 0,
        height: 0
      };

      this._actionArea = this.svg.append('rect')
        .attr('class', 'action-area')
        .attr('x', startX)
        .attr('y', startY)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('width', 0)
        .attr('height', 0)
        .attr('fill', this._checkThemeVariable('--px-vis-zoom-brush-fill-color', 'rgb(0,0,0)'))
        .attr('fill-opacity', this._checkThemeVariable('--px-vis-zoom-brush-fill-opacity', 0.5))
        .attr('stroke', this._checkThemeVariable('--px-vis-zoom-brush-outline-color', 'rgb(0,0,0)'));
    }
  },

  /**
   * Helper function called on mousedown.action.
   * Updates the size of the action area rectangle.
   *
   * @method _updateActionBox
   */
  _updateActionBox: function() {

    if(this._doesObjHaveValues(this._actionArea)) {

      var mousePos = Px.d3.mouse(this._rect.node()),
          originalX = this._originalBoxCoords.ox,
          originalY = this._originalBoxCoords.oy,
          width = this._originalBoxCoords.width,
          height = this._originalBoxCoords.height,
          newX = mousePos[0],
          newY = mousePos[1],
          newW,
          newH;
      //width and height cannot be negative vals, so reverse to maintain positive vals
      if(originalX > newX) {
        newX = originalX;
        originalX = mousePos[0];
      }
      if(originalY > newY) {
        newY = originalY;
        originalY = mousePos[1];
      }

      if(this.selectionType === 'xAxis') {
        newY = this._height;
      } else if(this.selectionType === 'yAxis') {
        newX = this._width;
      }


      // if current position is greater than the original position
      if(newX >= originalX) {
        // set x to the original position to prevent some drift on crossover. width is equal to the difference between the x and current mouse position
        newW = newX - originalX;
        this._actionArea.attr('x', originalX);
        this._actionArea.attr('width', newW);
        this._originalBoxCoords.x = originalX;
        this._originalBoxCoords.width = newW;
      } else {
        // else, the x is the current pos (because we cant have negative width) and width is the difference
        newW = originalX - newY ;
        this._actionArea.attr('x', newX);
        this._actionArea.attr('width', newW);
        this._originalBoxCoords.x = newX;
        this._originalBoxCoords.width = newW;
      }

      if(newY >= originalY) {
        newH = newY - originalY;
        this._actionArea.attr('y', originalY);
        this._actionArea.attr('height', newH);
        this._originalBoxCoords.y = originalY;
        this._originalBoxCoords.height = newH;
      } else {
        newH = originalY - newY;
        this._actionArea.attr('y', newY);
        this._actionArea.attr('height', newH);
        this._originalBoxCoords.y = newY;
        this._originalBoxCoords.height = newH;
      }

      Px.d3.event.preventDefault();
    }
  },

  /**
   * Helper function called on mouseup.action.
   * Gets the size of the action area rectangle, sets the extents, and removes it.
   *
   * @method _finishActionBox
   */
  _finishActionBox: function() {
    //since we are done drawing our action box, remove the listener from document using d3.
    Px.d3.select(document).on('mouseup.action', null);
    Px.d3.select(document).on('mousemove.action', null);

    if(this.mouseDown) {
      this.mouseDown = false;
      var extents = {};

      if(this._doesD3HaveValues(this._actionArea)) {
        //make sure we have somthing selected
        if(this._originalBoxCoords.width > 0 && this._originalBoxCoords.height > 0) {

          extents.x1 = this._originalBoxCoords.x;
          extents.y1 = this._originalBoxCoords.y;
          extents.w = this._originalBoxCoords.width;
          extents.h = this._originalBoxCoords.height;
          extents.x2 = extents.x1 + extents.w;
          extents.y2 = extents.y1 + extents.h;

          if(this.xAxisType === 'ordinal' || this.xAxisType === 'scaleBand') {
            extents.eX = this._getOrdinalRange(true, extents.x1, extents.x2);

          } else if(this.xAxisType === 'time' || this.xAxisType === 'timeLocal') {
            extents.eX = [this.x.invert(extents.x1).getTime(), this.x.invert(extents.x2).getTime()];

          } else {
            extents.eX = [this.x.invert(extents.x1), this.x.invert(extents.x2)];

          }

          if(this.yAxisType === 'ordinal' || this.yAxisType === 'scaleBand') {
            //Y axis is top to bottom
            extents.eY = this._getOrdinalRange(false, extents.y2, extents.y1);
          } else {
            extents.eY = this._processYValues(function(axis, index) {
              return [axis.invert(extents.y2), axis.invert(extents.y1)];
            });
          }

        //set new extents
        this.set('extentsData', extents);
        this.fire('px-vis-extents-data-updated', {'data': extents, 'dataVar': 'extentsData', 'method': 'set'});
        }
      }

      if(this._actionArea && this._actionArea.remove) {
        this._actionArea.remove();
      }

      this._originalBoxCoords = {
        x: null,
        y: null,
        width: null,
        height: null
      }
    }
  },

  _reportMouseCoords: function() {
    var mousePos = Px.d3.mouse(this._rect.node());

    this.fire("px-vis-interaction-space-mouse-coords", { mouse: mousePos, type: Px.d3.event.type });
  },

  _callCreateQuadtreeData: function() {
    if(this.hardMute) {
      this._createQuadtreeData();
    }
  },

  _createQuadtreeData: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(this.domainChanged && this.useQuadtree && !this.preventWebWorkerSynchronization && this.xAxisType !== 'ordinal' && this.xAxisType !== 'scaleBand') {
      this.debounce('buildQuadtree', function() {
        var w = this.width - this.margin.right - this.margin.left,
            h = this.height - this.margin.top - this.margin.bottom,
            ext = [[0,0], [w, h]],
            data = this._createBaseDataObjForWebWorker(),
            time = window.performance.now();

        data.width = w;
        data.height = h;
        data.extents = ext;
        data.searchType = this.searchType;
        data.hardMute = this.hardMute;
        data.mutedSeries = this.mutedSeries;

        Px.vis.scheduler.process({
          action : 'createQuadtree',
          originatorName: this.nodeName,
          data: data,
          chartId: this.chartId
        });
      }.bind(this), 50);
    }
  },

  _createBaseDataObjForWebWorker: function() {
    var data = {},
        yAxisKeys = this.isMultiY ? Object.keys(this.y) : 'defaultAxis';

    data.completeSeriesConfig = this.completeSeriesConfig;
    data.keys = this.seriesKeys && this.seriesKeys.length ? this.seriesKeys : Object.keys(this.completeSeriesConfig);
    data.timeData = this.timeData;

    data.radial = this.radial;
    data.counterClockwise = this.counterClockwise;
    data.useDegrees = this.useDegrees;

    data.isMultiY = this.isMultiY;
    data.logBase = this.logBase;

    data.x = {};
    data.x.range = this.x.range();
    data.x.domain = this.x.domain();
    data.x.type = this.x._scaleType;

    data.y = {};

    if(this.isMultiY) {
      for(var i=0; i<yAxisKeys.length; i++) {
        data.y[yAxisKeys[i]] = {
          'range': this.y[yAxisKeys[i]].range(),
          'domain': this.y[yAxisKeys[i]].domain(),
          'type': this.y[yAxisKeys[i]]._scaleType
        };
      }
    } else {
      data.y[yAxisKeys] = {
        'range': this.y.range(),
        'domain': this.y.domain(),
        'type': this.y._scaleType
      };
    }

    return data;
  },

  _updateTooltipData: function() {
    if(this.tooltipData && this.tooltipData.seriesObj) {

      let updated = false;

      //update coords in tooltip data because of a scale change
      this.tooltipData.series.forEach(function(item, i) {

        if(item.value && item.coord && this.completeSeriesConfig[item.name]) {
          let axisKey;
          if(this.isMultiY) {
            axisKey = (this.completeSeriesConfig[item.name]['axis'] && this.completeSeriesConfig[item.name]['axis']['id']) ? this.completeSeriesConfig[item.name]['axis']['id'] : null;
          }

          //ask the chart scale to convert those data values to pixels
          //this is synchronous
          this.fire('px-vis-request-pixel-for-data', {callback: function(info) {
              item.coord = info.pixel;
              this.tooltipData.seriesObj[item.name] = item;
            }.bind(this),
              //data values
              data: [item.value[this.completeSeriesConfig[item.name].x], item.value[this.completeSeriesConfig[item.name].y]],
              //seriesName
              series: item.name,
              //charts margin are "outside" of the interaction space itself
              //so we don't want them for this calculation
              margin: {'top': 0, 'bottom':0, 'left':0, 'right': 0},
              //for polar we want those coordinates to be relative to the
              //center, not the top left corner
              relativeToCenter: true}
          );

          updated = true;
        }
      }.bind(this));



      if(updated) {

        //copy all data in a new object
        let newTtData = {},
            keys = Object.keys(this.tooltipData);

        for(var i=0; i<keys.length; i++) {
          newTtData[keys[i]] = this.tooltipData[keys[i]];
        }

        this.set('tooltipData', newTtData);
      }
    }
  },

  _getCoordsForValues(xVal, yVal, axisKey) {
    return [this.x(xVal), this.isMultiY ? this.y[axisKey](yVal) : this.y(yVal)];
  }
});