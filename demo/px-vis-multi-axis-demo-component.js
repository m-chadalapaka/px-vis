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
import '../px-vis-svg.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <px-vis-multi-axis id="multiAxis" svg="[[svg]]" width="[[width]]" height="[[height]]" margin="[[margin]]" complete-series-config="[[completeSeriesConfig]]" chart-data="[[chartData]]" x="[[x]]" y="[[y]]" dimensions="[[dimensions]]" axes="[[axes]]" match-ticks="" append-unit-in-title="" displayed-values="{{displayedValues}}" domain-changed="[[domainChanged]]" axis-groups="{{axisGroups}}" title-type-size="12" label-type-size="10" action-config="{}" prevent-series-bar="" redraw-series="" stroke-width="2" outer-tick-size="6">
    </px-vis-multi-axis>
    <px-vis-svg width="[[width]]" height="[[height]]" svg="{{svg}}" margin="[[margin]]">
    </px-vis-svg>
`,

  is: 'px-vis-multi-axis-demo-component',

  behaviors: [
    PxVisBehaviorD3.axes,
    PxVisBehaviorD3.domainUpdate,
    PxVisBehaviorScale.scaleMultiAxis
  ],

  properties: {
    description: {
      type: String,
      value: "d3 element creating an axis for the chart"
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
      type: Object,
      value: function() {
        return {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2'],
            "y":['y','y1','y2'],
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          }
        }
      }
    },
    dimensions: {
      type : Array,
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
    length: {
      type: Number,
      value: 5
    }
  },

  observers: [
    '_setXScale(width,margin)',
    '_setYScale(height,margin,axes)',
    '_generateDataExtents(chartExtents)',
    '_setDomain(x, y, dataExtents)'
  ]
});