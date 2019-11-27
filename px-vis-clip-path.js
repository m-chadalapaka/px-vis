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

    <px-vis-clip-path
        clip-path="{{clipPath}}"
        series-clip-path="{{serieClipPath}}"
        svg="[[svg]]"
        width="[[width]]"
        height="[[height]]"
        margin="[[margin]]">
    </px-vis-clip-path>

## MDN Spec
https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath

@element px-vis-clip-path
@blurb The clipping path restricts the region to which paint can be applied.
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
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`

`,

  is: 'px-vis-clip-path',

  behaviors: [
    PxVisBehavior.observerCheck,
    PxVisBehaviorD3.svg,
    PxVisBehavior.sizing,
    PxVisBehavior.commonMethods,
    PxVisBehaviorD3.clipPath
  ],

  /**
   * Properties block, expose attribute values to the DOM via 'reflect'
   *
   * @property properties
   * @type Object
   */
  properties: {
    /**
     * Holder for the bigger clip path intended for other chart objects such as events
     */
    _clipPathSvg: {
      type: Object
    },
    /**
     * Holder for smaller clip path intended for the chart series
     */
    _seriesClipPathSvg: {
      type: Object
    },
    /**
     * Top offset to be applied to the series clip path
     */
    seriesClipPathYOffset: {
      type: Number,
      value: 0
    }
  },

  observers: [
    '_drawElement(svg,width,height, margin.*)'
  ],

  /**
   * Creates and sets two clipping paths.
   *
   * @method _drawElement
   */
  _drawElement: function() {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }


    //if the clip path has not been set, create it
    if(!this._clipPathSvg) {

      this.set('clipPath', this.generateRandomID('cp_'));
      this.fire('px-vis-clip-path-updated', { 'dataVar': 'clipPath', 'data': this.clipPath, 'method':'set' });

      this.svg
        .append('clipPath')
        .attr('id',this.clipPath)
        .append('rect');

      this._clipPathSvg = this.svg.select('clipPath#'+this.clipPath+' rect');
    }
    //update the clip path
    this._clipPathSvg
      .attr('y',-this.margin.top)
      .attr('width', Math.max(this.width - this.margin.left - this.margin.right, 0))
      .attr('height', Math.max(this.height - this.margin.bottom, 0));

    //if the second clip path has not been set, create it
    if(!this._seriesClipPathSvg) {

      this.set('seriesClipPath', this.generateRandomID('cps_'));
      this.fire('px-vis-series-clip-path-updated', { 'dataVar': 'seriesClipPath', 'data': this.seriesClipPath, 'method':'set' });

      this.svg
        .append('clipPath')
        .attr('id',this.seriesClipPath)
        .append('rect');

      this._seriesClipPathSvg = this.svg.select('clipPath#'+this.seriesClipPath + ' rect');
    }
    //update the second clip path
    this._seriesClipPathSvg
      .attr('y', this.seriesClipPathYOffset)
      .attr('width', Math.max(this.width - this.margin.left - this.margin.right,0))
      .attr('height', Math.max(this.height - this.margin.bottom  -
                      this.margin.top - this.seriesClipPathYOffset,0));

  }
});