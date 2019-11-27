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
import '../px-vis-line-canvas.js';
import '../px-vis-svg-canvas.js';
import '../px-vis-behavior-renderer.js';
import '../px-vis-behavior-colors.js';
import 'px-buttons-design/css/px-buttons-design-demo-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="px-buttons-design-demo-styles" is="custom-style"></style>
    <px-vis-multi-axis id="multiAxis" svg="[[svg]]" dimensions="[[dimensions]]" axes="[[axes]]" prevent-series-bar="" x="[[x]]" y="[[y]]" redraw-series="true" stroke-width="2" match-ticks="" outer-tick-size="6" label-type-size="10" title-type-size="12" displayed-values="{{displayedValues}}" append-unit-in-title="" domain-changed="[[domainChanged]]" axis-groups="{{axisGroups}}" width="[[width]]" height="[[height]]" margin="[[margin]]" chart-data="[[chartData]]" complete-series-config="[[completeSeriesConfig]]" series-key="x">
    </px-vis-multi-axis>
    <px-vis-svg-canvas id="svg" width="[[width]]" height="[[height]]" svg="{{svg}}" canvas-context="{{canvasContext}}" canvas-layers="{{canvasLayers}}" canvas-layers-config="[[canvasLayersConfig]]" margin="[[margin]]">
    </px-vis-svg-canvas>

    <px-vis-line-canvas id="lineSVG" canvas-context="[[canvasContext]]" parallel-coordinates="" multi-path="" series-id="x" chart-data="[[chartData]]" complete-series-config="[[completeSeriesConfig]]" x="[[x]]" y="[[y]]" domain-changed="[[domainChanged]]" selected-domain="[[selectedDomain]]" muted-series="[[_combinedMutedSeries]]" prevent-initial-drawing="[[_preventInitialDrawing]]">
    </px-vis-line-canvas>

    <px-vis-highlight-line-canvas id="linehighlight" canvas-context="[[canvasLayers.highlighter]]" canvas-layers-config="{{canvasLayersConfig}}" layers-to-mask="[[canvasContext]]" width="[[width]]" height="[[height]]" margin="[[margin]]" x="[[x]]" y="[[y]]" parallel-coordinates="" dimensions="[[dimensions]]" domain-changed="[[domainChanged]]" time-data="x" complete-series-config="[[completeSeriesConfig]]" crosshair-data="[[crosshairData]]" series-id="x" chart-data="[[chartData]]">
    </px-vis-highlight-line-canvas>

    <div style="margin-top:15px;">
      <button on-click="highlightData" class="btn">Toggle Highlight Data</button>
    </div>
`,

  is: 'px-vis-highlight-line-canvas-demo-component',

  behaviors: [
    PxColorsBehavior.getSeriesColors,
    PxColorsBehavior.dataVisColorTheming,
    PxVisBehaviorRenderer.base,
    PxVisBehaviorD3.axes,
    PxVisBehaviorD3.domainUpdate,
    PxVisBehaviorScale.scaleMultiAxis,
    PxVisBehaviorD3.canvasContext
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
          }
        ]
      }
    },
    completeSeriesConfig: {
      type: Object
    },
    dimensions: {
      type :Array,
      value: function() {
        return ['y','y1','y2']
      }
    },
    axes: {
      type :Array,
      value: function() {
        return ['y','y1','y2']
      }
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

    crosshairData: {
      type: Object,
      value: function() {
        return {
          "rawData":[],
          "timeStamps":[]
        }
      }
    },

     _crosshairData: {
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
    '_renderChartData(domainChanged, canvasContext, chartData.*, completeSeriesConfig.*)',
    '_renderHighlight(domainChanged, canvasLayers.highlighter, completeSeriesConfig.*, crosshairData.timeStamps.*)',
    '_setXScale(width,margin)',
    '_setYScale(height,margin,axes)',
    '_generateDataExtents(chartExtents)',
    '_setDomain(x, y, dataExtents)'
  ],

  highlightData: function() {
    if(this.crosshairData && this.crosshairData.timeStamps.length) {
      this.set('crosshairData', {rawData: [], timeStamps: []});
    } else {
      this.set('crosshairData', this._crosshairData);
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