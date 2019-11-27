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

    <px-vis-svg
        ...
        svg="{{svg}}">
    </px-vis-svg>
    <px-vis-scale
        ...
        x="{{x}}"
        y="{{y}}"
        domain-changed="{{domainChanged}}">
    </px-vis-scale>
    <px-vis-interaction-space
        ...
        generating-crosshair-data="{{generatingCrosshairData}}"
        crosshair-data="{{crosshairData}}">
    </px-vis-interaction-space>

    <px-vis-highlight-line
        id="highlighter"
        margin="[[margin]]"
        svg="[[layer.1]]"
        layers-to-mask="[[layer.0]]"
        x="[[x]]"
        y="[[y]]"
        parallel-coordinates
        dimensions="[[dimensions]]"
        domain-changed="[[domainChanged]]"
        time-data="[[seriesKey]]"
        complete-series-config="[[completeSeriesConfig]]"
        series-id="[[seriesKey]]"
        category-key="[[categoryKey]]"
        categories="[[categories]]"
        chart-data="[[chartData]]"
        generating-crosshair-data="[[generatingCrosshairData]]"
        crosshair-data="[[crosshairData]]"
        default-empty-data="{{defaultEmptyData}}">
    </px-vis-highlight-line>

@element px-vis-highlight-line
@blurb Element which highlight specific line datasets
@homepage index.html
@demo demo/index.html


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

      <px-vis-line-svg id="myHighlighter" svg="[[svg]]" parallel-coordinates="[[parallelCoordinates]]" radial-line="[[radialLine]]" multi-path="" clip-path="[[clipPath]]" disable-pointer-events="" series-id="[[seriesId]]" category-key="[[categoryKey]]" categories="[[categories]]" chart-data="[[_highlightData]]" complete-series-config="[[completeSeriesConfig]]" stroke-width="2" x="[[x]]" y="[[y]]" domain-changed="[[domainChanged]]" interpolation-function="[[interpolationFunction]]">
      </px-vis-line-svg>
`,

  is: 'px-vis-highlight-line',

  behaviors: [
    PxVisBehaviorD3.svg,
    PxVisBehaviorD3.axes,
    PxVisBehavior.dataset,
    PxVisBehavior.commonMethods,
    PxVisBehavior.crosshairData,
    PxVisBehavior.completeSeriesConfig,
    PxVisBehavior.seriesId,
    PxVisBehavior.categories,
    PxVisBehaviorD3.clipPath,
    PxVisBehavior.mutedSeries,
    PxVisBehavior.dimensions,
    PxVisBehaviorD3.domainUpdate,
    PxVisBehavior.dynamicConfigProperties,
    PxVisBehavior.highlightSvgShared,
    PxVisBehavior.highlightLineShared,  //core functionality
    PxVisBehavior.tooltipData,
    PxVisBehaviorD3.interpolationFunction
  ],

  reDrawElement: function() {
    this.$.myHighlighter.drawElement();
  }
});