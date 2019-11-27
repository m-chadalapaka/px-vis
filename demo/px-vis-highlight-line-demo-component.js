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
import '@polymer/polymer/polymer-legacy.js';

import '../px-vis-multi-axis.js';
import '../px-vis-behavior-d3.js';
import '../px-vis-behavior-scale-multi-axis.js';
import '../px-vis-highlight-line-canvas.js';
import '../px-vis-highlight-line.js';
import '../px-vis-line-svg.js';
import '../px-vis-svg.js';
import '../px-vis-behavior-colors.js';
import 'px-buttons-design/css/px-buttons-design-demo-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="px-buttons-design-demo-styles" is="custom-style"></style>
    <px-vis-multi-axis id="multiAxis" dimensions="[[dimensions]]" axes="[[axes]]" prevent-series-bar="" x="[[x]]" y="[[y]]" redraw-series="true" stroke-width="2" match-ticks="" outer-tick-size="6" label-type-size="10" title-type-size="12" displayed-values="{{displayedValues}}" append-unit-in-title="" domain-changed="[[domainChanged]]" axis-groups="{{axisGroups}}" width="[[width]]" height="[[height]]" margin="[[margin]]" chart-data="[[chartData]]" complete-series-config="[[completeSeriesConfig]]" series-key="x">
    </px-vis-multi-axis>
    <px-vis-svg id="svg" width="[[width]]" height="[[height]]" svg="{{svg}}" margin="[[margin]]">
    </px-vis-svg>

    <px-vis-line-svg id="lineSVG" parallel-coordinates="" multi-path="" series-id="x" chart-data="[[chartData]]" complete-series-config="[[completeSeriesConfig]]" x="[[x]]" y="[[y]]" domain-changed="[[domainChanged]]" selected-domain="[[selectedDomain]]" muted-series="[[_combinedMutedSeries]]" prevent-initial-drawing="[[_preventInitialDrawing]]">
    </px-vis-line-svg>

    <px-vis-highlight-line id="linehighlight" margin="[[margin]]" x="[[x]]" y="[[y]]" parallel-coordinates="" dimensions="[[dimensions]]" domain-changed="[[domainChanged]]" time-data="[[seriesKey]]" complete-series-config="[[completeSeriesConfig]]" series-id="x" chart-data="[[chartData]]">
    </px-vis-highlight-line>

    <div style="margin-top:15px;">
      <button on-click="highlightData" class="btn">Toggle Highlight Data</button>
    </div>
`,

  is: 'px-vis-highlight-line-demo-component',

  behaviors: [
    PxColorsBehavior.getSeriesColors,
    PxColorsBehavior.dataVisColorTheming,
    PxVisBehaviorD3.axes,
    PxVisBehaviorD3.domainUpdate,
    PxVisBehaviorScale.scaleMultiAxis
  ],

  properties: {
    description: {
      type: String,
      value: "d3 element which highlights data"
    },
    chartData: {
      type: Array,
      value: function() {
        return [{
          "x": 1397102460000,
          "y": 1,
          "y1": 1,
          "y2": 1
        },{
          "x": 1397131620000,
          "y": 6,
          "y1": 15,
          "y2": 21
        },{
          "x": 1397160780000,
          "y": 10,
          "y1": 8,
          "y2": 3
        },{
          "x": 1397189940000,
          "y": 4,
          "y1": 10,
          "y2": 10
        },{
          "x": 1397219100000,
          "y": 6,
          "y1": 20,
          "y2": 27
        }]
      }
    },
    completeSeriesConfig: {
      type: Object
    },
    dimensions: {
      type :Array,
      value: function() { return ['y','y1','y2']}
    },
    axes: {
      type :Array,
      value: function() { return ['y','y1','y2'] }
    },
    width: {
      type: Number,
      value: 500
    },
    height: {
      type: Number,
      value: 250
    },
    chartExtents: {
      type: Object,
      value: function() {
        return {
          'x': ['y','y1','y2'],
          'y':[1,10],
          'y1':[1,20],
          'y2':[1,27]
        }
      }
    },
    margin: {
      type: Object,
      value: function() {
        return {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        }
      }
    },

    layers: {
      type: Array,
      value: function() { return []; }
    },

    crosshairData: {
      type: Object,
      value: function() {
        return {
          "rawData":[{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3
          }],
          "timeStamps":[ 1397131620000, 1397160780000 ]
        }
      }
    }

  },

  listeners:{
    'px-data-vis-colors-applied': '_genCSC'
  },

  observers: [
    'generateLayers(svg)',
    '_setXScale(width,margin)',
    '_setYScale(height,margin,axes)',
    '_generateDataExtents(chartExtents)',
    '_setDomain(x, y, dataExtents)'
  ],

  generateLayers: function() {
    var div = document.createElement('div');

    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var layer = Px.d3.select(dom(this.svg.node()).appendChild(g));

    this.layers.push(this.svg.append('g'));
    this.layers.push(layer);
    this.layers.push(this.svg.append('g'));

    this.$.multiAxis.set('svg', this.layers[0]);
    this.$.lineSVG.set('svg', this.layers[1]);
    this.$.linehighlight.set('svg', this.layers[2]);
    this.$.linehighlight.set('layersToMask', this.layers[1]);
  },

  highlightData: function() {
    if(this.$.linehighlight.crosshairData && this.$.linehighlight.crosshairData.timeStamps.length) {
      this.$.linehighlight.set('crosshairData', {rawData: [], timeStamps: []});
    } else {
      this.$.linehighlight.set('crosshairData', this.crosshairData);
    }
  },

  _genCSC: function() {
    this.set('completeSeriesConfig', {
      "x":{
        "type":"line",
        "name":"mySeries",
        "x":['y','y1','y2'],
        "y":['y','y1','y2'],
        "color": this._getColor(0)
        },
      "y": {
        "title": " "
      },
      "y1": {
        "title": " "
      },
      "y2": {
        "title": " "
      }
    });
  }
});