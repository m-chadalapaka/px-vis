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
/* Common imports */
/* Import peer demo pages */
/* Demo DOM module */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '../css/px-vis-demo-catalog-styles.js';
import 'px-demo/px-demo-header.js';
import './px-vis-area-svg-demo-component.js';
import './px-vis-axis-demo-component.js';
import './px-vis-axis-interaction-space-demo-component.js';
import './px-vis-bar-svg-demo-component.js';
import './px-vis-brush-demo-component.js';
import './px-vis-cursor-demo-component.js';
import './px-vis-chart-navigator-demo-component.js';
import './px-vis-canvas-demo-component.js';
import './px-vis-clip-path-complex-area-demo-component.js';
import './px-vis-clip-path-demo-component.js';
import './px-vis-cursor-line-demo-component.js';
import './px-vis-data-converter-demo-component.js';
import './px-vis-dynamic-menu-demo-component.js';
import './px-vis-event-demo-component.js';
import './px-vis-gridlines-demo-component.js';
import './px-vis-highlight-line-canvas-demo-component.js';
import './px-vis-highlight-line-demo-component.js';
import './px-vis-highlight-point-canvas-demo-component.js';
import './px-vis-highlight-point-demo-component.js';
import './px-vis-interactive-axis-demo-component.js';
import './px-vis-interaction-space-demo-component.js';
import './px-vis-line-svg-demo-component.js';
import './px-vis-line-canvas-demo-component.js';
import './px-vis-multi-axis-demo-component.js';
import './px-vis-pie-demo-component.js';
import './px-vis-radar-grid-demo-component.js';
import './px-vis-radial-gridlines-demo-component.js';
import './px-vis-svg-canvas-demo-component.js';
import './px-vis-toolbar-demo-component.js';
import './px-vis-register-demo-component.js';
import './px-vis-scale-demo-component.js';
import './px-vis-scatter-demo-component.js';
import './px-vis-scatter-canvas-demo-component.js';
import './px-vis-striping-demo-component.js';
import './px-vis-svg-demo-component.js';
import './px-vis-threshold-demo-component.js';
import './px-vis-tooltip-demo-component.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="px-vis-demo-catalog-styles" is="custom-style"></style>

    <!-- Header -->
    <px-demo-header module-name="px-vis framework" parent-name="px-vis" description="px-vis is a Predix UI data visualization framework. It is the foundation for all vis charts.">
    </px-demo-header>

    <div class="layout component--layout">

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-area-svg" class="actionable actionable--secondary" data-module="px-vis-area-svg" on-tap="_loadPage">px-vis-area-svg</a></p>
        <px-vis-area-svg-demo-component width="318" height="265" margin="{&quot;top&quot;: 0, &quot;right&quot;: 0, &quot;bottom&quot;: 0, &quot;left&quot;: 0}"></px-vis-area-svg-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-axis" class="actionable actionable--secondary" data-module="px-vis-axis" on-tap="_loadPage">px-vis-axis</a></p>
        <px-vis-axis-demo-component height="265" axis="x" margin="{&quot;top&quot;: 5, &quot;right&quot;: 0, &quot;bottom&quot;: 10, &quot;left&quot;: 165}" orientation="left"></px-vis-axis-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-axis-interaction-space" class="actionable actionable--secondary" data-module="px-vis-axis-interaction-space" on-tap="_loadPage">px-vis-axis-interaction-space</a></p>
        <px-vis-axis-interaction-space-demo-component></px-vis-axis-interaction-space-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-bar-svg" class="actionable actionable--secondary" data-module="px-vis-bar-svg" on-tap="_loadPage">px-vis-bar-svg</a></p>
        <px-vis-bar-svg-demo-component width="318" dataset="multi" type="column"></px-vis-bar-svg-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-brush" class="actionable actionable--secondary" data-module="px-vis-brush" on-tap="_loadPage">px-vis-brush</a></p>
        <px-vis-brush-demo-component width="318"></px-vis-brush-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-canvas" class="actionable actionable--secondary" data-module="px-vis-canvas" on-tap="_loadPage">px-vis-canvas</a></p>
        <px-vis-canvas-demo-component></px-vis-canvas-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-chart-navigator" class="actionable actionable--secondary" data-module="px-vis-chart-navigator" on-tap="_loadPage">px-vis-chart-navigator</a></p>
        <px-vis-chart-navigator-demo-component width="318" height="100" x-axis-config="{&quot;ticks&quot;:3}"></px-vis-chart-navigator-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-clip-path" class="actionable actionable--secondary" data-module="px-vis-clip-path" on-tap="_loadPage">px-vis-clip-path</a></p>
        <px-vis-clip-path-demo-component width="318" height="225"></px-vis-clip-path-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-clip-path-complex-area" class="actionable actionable--secondary" data-module="px-vis-clip-path-complex-area" on-tap="_loadPage">px-vis-clip-path-complex-area</a></p>
        <px-vis-clip-path-complex-area-demo-component width="318" height="225"></px-vis-clip-path-complex-area-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-cursor" class="actionable actionable--secondary" data-module="px-vis-cursor" on-tap="_loadPage">px-vis-cursor</a></p>
        <px-vis-cursor-demo-component width="318"></px-vis-cursor-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-cursor-line" class="actionable actionable--secondary" data-module="px-vis-cursor-line" on-tap="_loadPage">px-vis-cursor-line</a></p>
        <px-vis-cursor-line-demo-component width="318" margin="{ &quot;top&quot;: 5, &quot;right&quot;: 0, &quot;bottom&quot;: 5, &quot;left&quot;: 0}"></px-vis-cursor-line-demo-component>
      </div>

      <div class="layout__item component overflow">
        <p><a href="#/modules/px-vis-data-converter" class="actionable actionable--secondary" data-module="px-vis-data-converter" on-tap="_loadPage">px-vis-data-converter</a></p>
        <px-vis-data-converter-demo-component></px-vis-data-converter-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-dynamic-menu" class="actionable actionable--secondary" data-module="px-vis-dynamic-menu" on-tap="_loadPage">px-vis-dynamic-menu</a></p>
        <px-vis-dynamic-menu-demo-component></px-vis-dynamic-menu-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-event" class="actionable actionable--secondary" data-module="px-vis-event" on-tap="_loadPage">px-vis-event</a></p>
        <px-vis-event-demo-component width="330"></px-vis-event-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-gridlines" class="actionable actionable--secondary" data-module="px-vis-gridlines" on-tap="_loadPage">px-vis-gridlines</a></p>
        <px-vis-gridlines-demo-component width="318"></px-vis-gridlines-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-highlight-line-canvas" class="actionable actionable--secondary" data-module="px-vis-highlight-line-canvas" on-tap="_loadPage">px-vis-highlight-line-canvas</a></p>
        <px-vis-highlight-line-canvas-demo-component width="318" height="225" margin="{ &quot;top&quot;: 5, &quot;right&quot;: 0, &quot;bottom&quot;: 5, &quot;left&quot;: 0}"></px-vis-highlight-line-canvas-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-highlight-line" class="actionable actionable--secondary" data-module="px-vis-highlight-line" on-tap="_loadPage">px-vis-highlight-line</a></p>
        <px-vis-highlight-line-demo-component width="318" height="220" margin="{ &quot;top&quot;: 5, &quot;right&quot;: 0, &quot;bottom&quot;: 5, &quot;left&quot;: 0}"></px-vis-highlight-line-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-highlight-point-canvas" class="actionable actionable--secondary" data-module="px-vis-highlight-point-canvas" on-tap="_loadPage">px-vis-highlight-point-canvas</a></p>
        <px-vis-highlight-point-canvas-demo-component width="318" height="225" ticks="{&quot;interval&quot;:4}" margin="{ &quot;top&quot;: 0, &quot;right&quot;: 15, &quot;bottom&quot;: 20, &quot;left&quot;: 40}"></px-vis-highlight-point-canvas-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-highlight-point" class="actionable actionable--secondary" data-module="px-vis-highlight-point" on-tap="_loadPage">px-vis-highlight-point</a></p>
        <px-vis-highlight-point-demo-component width="318" height="220" ticks="{&quot;interval&quot;:4}" margin="{ &quot;top&quot;: 0, &quot;right&quot;: 15, &quot;bottom&quot;: 20, &quot;left&quot;: 40}"></px-vis-highlight-point-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-interactive-axis" class="actionable actionable--secondary" data-module="px-vis-interactive-axis" on-tap="_loadPage">px-vis-interactive-axis</a></p>
        <px-vis-interactive-axis-demo-component width="250" height="225" margin="{ &quot;top&quot;: 5, &quot;right&quot;: 10, &quot;bottom&quot;: 25, &quot;left&quot;: 70 }"></px-vis-interactive-axis-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-interaction-space" class="actionable actionable--secondary" data-module="px-vis-interaction-space" on-tap="_loadPage">px-vis-interaction-space</a></p>
        <px-vis-interaction-space-demo-component></px-vis-interaction-space-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-line-svg" class="actionable actionable--secondary" data-module="px-vis-line-svg" on-tap="_loadPage">px-vis-line-svg</a></p>
        <px-vis-line-svg-demo-component width="318"></px-vis-line-svg-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-line-canvas" class="actionable actionable--secondary" data-module="px-vis-line-canvas" on-tap="_loadPage">px-vis-line-canvas</a></p>
        <px-vis-line-canvas-demo-component width="318"></px-vis-line-canvas-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-multi-axis" class="actionable actionable--secondary" data-module="px-vis-multi-axis" on-tap="_loadPage">px-vis-multi-axis</a></p>
        <px-vis-multi-axis-demo-component width="318" margin="{ &quot;top&quot;: 5, &quot;right&quot;: 0, &quot;bottom&quot;: 5, &quot;left&quot;: 0}"></px-vis-multi-axis-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-pie" class="actionable actionable--secondary" data-module="px-vis-pie" on-tap="_loadPage">px-vis-pie</a></p>
        <px-vis-pie-demo-component width="318" height="260" radius="125" offset="[159,129]"></px-vis-pie-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-radar-grid" class="actionable actionable--secondary" data-module="px-vis-radar-grid" on-tap="_loadPage">px-vis-radar-grid</a></p>
        <px-vis-radar-grid-demo-component width="318" height="260" radius="100" offset="[159,129]"></px-vis-radar-grid-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-radial-gridlines" class="actionable actionable--secondary" data-module="px-vis-radial-gridlines" on-tap="_loadPage">px-vis-radial-gridlines</a></p>
        <px-vis-radial-gridlines-demo-component width="318" height="260" radius="100" offset="[159,129]"></px-vis-radial-gridlines-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-register" class="actionable actionable--secondary" data-module="px-vis-register" on-tap="_loadPage">px-vis-register</a></p>
        <px-vis-register-demo-component width="318" height="160" type="vertical"></px-vis-register-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-scale" class="actionable actionable--secondary" data-module="px-vis-scale" on-tap="_loadPage">px-vis-scale</a></p>
        <px-vis-scale-demo-component></px-vis-scale-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-scatter" class="actionable actionable--secondary" data-module="px-vis-scatter" on-tap="_loadPage">px-vis-scatter</a></p>
        <px-vis-scatter-demo-component width="318"></px-vis-scatter-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-scatter-canvas" class="actionable actionable--secondary" data-module="px-vis-scatter-canvas" on-tap="_loadPage">px-vis-scatter-canvas</a></p>
        <px-vis-scatter-canvas-demo-component width="318"></px-vis-scatter-canvas-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-striping" class="actionable actionable--secondary" data-module="px-vis-striping" on-tap="_loadPage">px-vis-striping</a></p>
        <px-vis-striping-demo-component width="318" height="225" ticks="{&quot;interval&quot;:4}" margin="{ &quot;top&quot;: 5, &quot;right&quot;: 15, &quot;bottom&quot;: 20, &quot;left&quot;: 40}"></px-vis-striping-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-svg" class="actionable actionable--secondary" data-module="px-vis-svg" on-tap="_loadPage">px-vis-svg</a></p>
        <px-vis-svg-demo-component></px-vis-svg-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-svg-canvas" class="actionable actionable--secondary" data-module="px-vis-svg-canvas" on-tap="_loadPage">px-vis-svg-canvas</a></p>
        <px-vis-svg-canvas-demo-component></px-vis-svg-canvas-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-threshold" class="actionable actionable--secondary" data-module="px-vis-threshold" on-tap="_loadPage">px-vis-threshold</a></p>
        <px-vis-threshold-demo-component width="318"></px-vis-threshold-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-toolbar" class="actionable actionable--secondary" data-module="px-vis-toolbar" on-tap="_loadPage">px-vis-toolbar</a></p>
        <px-vis-toolbar-demo-component></px-vis-toolbar-demo-component>
      </div>

      <div class="layout__item component">
        <p><a href="#/modules/px-vis-tooltip" class="actionable actionable--secondary" data-module="px-vis-tooltip" on-tap="_loadPage">px-vis-tooltip</a></p>
        <px-vis-tooltip-demo-component width="318"></px-vis-tooltip-demo-component>
      </div>

    </div>
`,

  is: 'px-vis-catalog',

  properties: {
 },

  _loadPage: function (evt) {
    /**
     * Until the new version of the predix ui site - that has the children in
     * its nav - is released, we need a way for the pages to be able to link to
     * the children pages that live under the dropdown at the top.
     * We need to support both ways.
     */
    if (window.location.hash.slice(0, 10) !== "#/elements") {
      evt.preventDefault();

      var module = dom(evt).rootTarget.getAttribute("data-module");
      this.fire('px-demo-active-should-change', { name: module });
    }
  }
});