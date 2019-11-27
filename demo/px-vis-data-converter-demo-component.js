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

import '../px-vis-scale.js';
import '../px-vis-svg.js';
import '../px-vis-data-converter.js';
import '../css/px-vis-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="px-vis-styles"></style>
    <style>
    :host {
      width: 100%;
    }
    </style>

    <px-vis-data-converter data-key="series" id-key="id" name-key="name" original-data="[[originalData]]" series-config="{{seriesConfig}}" chart-data="{{chartData}}">
    </px-vis-data-converter>

    <div class="flex flex--row flex--spaced flex--top" style="width: 100%;">
      <div>
        <strong>input: original-data</strong>
        <pre>[[_formatName(originalData)]]</pre>
      </div>

      <div>
        <strong>output:  chart-data</strong>
        <pre>[[_formatName(chartData)]]</pre>
      </div>

      <div>
        <strong>output: series-config</strong>
        <pre>[[_formatName(seriesConfig)]]</pre>
      </div>
    </div>
`,

  is: "px-vis-data-converter-demo-component",

  //end properties
  properties:{
    originalData : {
      type : Array,
      value: function() {
        return [{
          "series": [
            [ 1397102460000, 11.4403 ],
            [ 1397139660000, 13.1913 ],
            [ 1427813520000, 17.1241 ],
            [ 1427839740000, 34.1624 ],
            [ 1427920920000, 17.9158 ],
            [ null, null ]
          ],
          "max": 35.4784,
          "min": 7.6531,
          "mean": 15.330657585139331,
          "id": "px-elliot",
          "name": "elliot"
        }, {
          "series": [
          [ 1397102460000, 96.5 ],
          [ 1397139660000, 96.5 ],
          [ 1427813520000, 79 ],
          [ 1427839740000, 48.2 ],
          [ 1427920920000, 96.5 ],
          [ null, null ]
          ],
          "max": 96.5,
          "min": 10,
          "mean": 91.5203170028819,
          "id": "px-benoit",
          "name": "benoit"
        }]
      }
    },
    aggregatedData : {
      type : Array
    },
  },

  /*
   * stringify data to be printed out
   */
  _formatName: function(data) {
    return JSON.stringify(data, null, ' ');
  }
});