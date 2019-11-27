const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="px-vis-styles">
<template>
<style>
@charset "UTF-8";/*! normalize.css v3.0.2 | MIT License | git.io/normalize */html{background-color:var(--px-base-background-color,#fff);font-size:15px;overflow-y:scroll;min-height:100%;box-sizing:border-box}:host,html{color:var(--px-base-text-color,#2c404c);line-height:1.33333;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;text-size-adjust:100%;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased}body,figure{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}address,blockquote,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,ol,p,pre,table,ul{margin-bottom:1rem}li>ol,li>ul{margin-bottom:0}dd,ol,ul{margin-left:2rem}img{max-width:100%;border:0}svg:not(:root){overflow:hidden}hr{box-sizing:content-box;height:0}pre{overflow:auto}*,:after,:before{box-sizing:inherit}:host{/*! Comment to prevent cssmin munging this rule with html above and borking Safari */box-sizing:border-box}*,text{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.primaryDataMask{opacity:var(--px-vis-data-mask-opacity,.4)}.primaryOverlayMask{opacity:var(--px-vis-overlay-mask-opacity,.5)}.secondaryDataMask{opacity:var(--px-vis-data-mask-opacity,.4)}.secondaryOverlayMask{opacity:var(--px-vis-overlay-mask-opacity,.5)}.hoverTransition,g.seriesGroups,rect.series-bar{transition:opacity .2s}a{background-color:transparent}a:link,a:visited{color:#007acc}a:hover{color:#005c99}a:active{color:#003d66}a:active,a:hover{outline:0}.float--right{float:right!important}.float--left{float:left!important}.float--none{float:none!important}.text--left{text-align:left!important}.text--center{text-align:center!important}.proceed,.text--right{text-align:right!important}.full-height{height:100%!important}.informative{cursor:help!important}.pointer{cursor:pointer!important}.muted{opacity:.5!important}.caps{text-transform:uppercase!important}.hidden{display:none!important;visibility:hidden}.a11y,.visuallyhidden{position:absolute!important;overflow:hidden!important;width:1px!important;height:1px!important;margin:-1px!important;border:0!important;padding:0!important;clip:rect(0 0 0 0)!important}.a11y.focusable:active,.a11y.focusable:focus,.visuallyhidden.focusable:active,.visuallyhidden.focusable:focus{position:static;overflow:visible;width:auto;height:auto;margin:0;clip:auto}@media screen and (min-width:45em) and (max-width:63.9375em){.a11y-lap,.visuallyhidden-lap{position:absolute!important;overflow:hidden!important;width:1px!important;height:1px!important;margin:-1px!important;border:0!important;padding:0!important;clip:rect(0 0 0 0)!important}}@media screen and (max-width:63.9375em){.a11y-portable,.visuallyhidden-portable{position:absolute!important;overflow:hidden!important;width:1px!important;height:1px!important;margin:-1px!important;border:0!important;padding:0!important;clip:rect(0 0 0 0)!important}}@media screen and (max-width:44.9375em){.a11y-palm,.visuallyhidden-palm{position:absolute!important;overflow:hidden!important;width:1px!important;height:1px!important;margin:-1px!important;border:0!important;padding:0!important;clip:rect(0 0 0 0)!important}}@media screen and (min-width:45em){.a11y-lap-and-up,.visuallyhidden-lap-and-up{position:absolute!important;overflow:hidden!important;width:1px!important;height:1px!important;margin:-1px!important;border:0!important;padding:0!important;clip:rect(0 0 0 0)!important}}@media screen and (min-width:64em){.a11y-desk,.a11y-desk-and-up,.visuallyhidden-desk,.visuallyhidden-desk-and-up{position:absolute!important;overflow:hidden!important;width:1px!important;height:1px!important;margin:-1px!important;border:0!important;padding:0!important;clip:rect(0 0 0 0)!important}}@media screen and (min-width:120em){.a11y-large-and-up,.visuallyhidden-large-and-up{position:absolute!important;overflow:hidden!important;width:1px!important;height:1px!important;margin:-1px!important;border:0!important;padding:0!important;clip:rect(0 0 0 0)!important}}@media (-webkit-min-device-pixel-ratio:2),(min-resolution:192dpi),(min-resolution:2dppx){.a11y-retina,.visuallyhidden-retina{position:absolute!important;overflow:hidden!important;width:1px!important;height:1px!important;margin:-1px!important;border:0!important;padding:0!important;clip:rect(0 0 0 0)!important}}.u-mh,.u-mr{margin-right:1rem!important}.u-mh,.u-ml{margin-left:1rem!important}.u-mt,.u-mv{margin-top:1rem!important}.u-mb,.u-mv{margin-bottom:1rem!important}.invisible{visibility:hidden!important}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.u-m{margin:1rem!important}
</style>
</template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);

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
;