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

### Usage

    <px-vis-radar-grid
        svg="[[svg]]"
        x="[[x]]"
        y="[[y]]"
        axis-color="[[axisColor]]"
        tick-values="[[drawnTickValues]]"
        dimensions="[[dimensions]]"
        margin="[[margin]]"
        domain-changed="[[domainChanged]]">
    </px-vis-radar-grid>

### Styling
The following custom properties are available for styling:

Custom property | Description
:----------------|:-------------
  `--px-vis-gridlines-color` | The color for the gridlines


@element px-vis-radar-grid
An element which draws polygonal grid lines.
@homepage index.html
@demo demo.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import './px-vis-behavior-common.js';
import './px-vis-behavior-d3.js';
import './px-vis-line-svg.js';
import './css/px-vis-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="px-vis-styles"></style>

    <px-vis-line-svg id="line" radial-line="" multi-path="" svg="[[svg]]" series-id="[[_seriesKey]]" chart-data="[[_gridData]]" complete-series-config="[[_completeSeriesConfig]]" x="[[x]]" y="[[y]]" domain-changed="[[domainChanged]]" stroke-width="[[strokeWidth]]" clip-path="[[clipPath]]" interpolation-function="[[_returnInterpolation()]]">
    </px-vis-line-svg>
`,

  is: 'px-vis-radar-grid',

  behaviors: [
    PxVisBehavior.observerCheck,
    PxVisBehaviorD3.svg,
    PxVisBehaviorD3.axes,
    PxVisBehavior.commonMethods,
    PxVisBehaviorD3.clipPath,
    PxVisBehavior.updateStylesOverride
  ],

  /**
   * Properties block, expose attribute values to the DOM via 'reflect'
   *
   * @property properties
   * @type Object
   */
  properties: {
    /**
     * The calculated grid data.
     *
     */
    _gridData: {
      type: Array,
      notify: true
    },
    /**
     * The color for the grid lines.
     *
     */
    axisColor: {
      type: String,
      value: "rgb(0,0,0)"
    },
    /**
     * A configuration object for the gridlines.
     *
     */
    _completeSeriesConfig: {
      type: Object,
      notify: true
    },
    /**
     * The access key for the seriesConfig.
     *
     */
    _seriesKey: {
      type: String,
      value: "radarGrids"
    },
    /**
     * The values obtained from the axis to place gridlines on.
     *
     */
    tickValues: {
      type: Array,
      notify: true
    },
    /**
     * The dimensions of the chart.
     *
     */
    dimensions: {
      type: Array,
      notify: true
    },
    /**
     * The stroke width for the grid.
     *
     */
    strokeWidth: {
      type: Number,
      value: 1
    }
  },

  observers: [
    'createGridData(dimensions.*,tickValues.*, _stylesUpdated)'
  ],

  /**
   * Draws the gridlines.
   *
   * @method createGridData
   */
  createGridData: function() {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    this.debounce('radarGrids', function(){
      if(this.tickValues && this.dimensions && this.tickValues.length > 0 && this.dimensions.length > 0) {
        var data = [],
            config = {},
            domain = this.y.domain(),
            c;

        if(domain[0] !== this.tickValues[0]){
          this.tickValues.push(domain[0]);
        }

        if(domain[1] !== this.tickValues[this.tickValues.length - 1]){
          this.tickValues.push(domain[1]);
        }

        for(var i = 0; i < this.tickValues.length; i++) {
          data.push({});
          for(var j = 0; j < this.dimensions.length; j++) {
            data[i][this.dimensions[j]] = this.tickValues[i];
          }
        }

        //get the color
        c = this._checkThemeVariable("--px-vis-gridlines-color", this.axisColor);
        //make sure it is RGB
        c = c[0] === '#' ? this._hexToRgb(c) : c;

        config[this._seriesKey] = {
          "color" : c,
          'x' : this.dimensions
        };

        this.set('_completeSeriesConfig', config);
        this.set('_gridData', data);
      }
    },10);
  },

  /**
   * Helper function to return a d3 interpolation function.
   *
   * @method _returnInterpolation
   */
  _returnInterpolation: function(){
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    return Px.d3.curveLinearClosed;
  }
});