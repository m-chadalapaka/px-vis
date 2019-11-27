const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="px-vis-central-tooltip-content-styles">
<template>
<style>
.btn,.btn--bare{height:var(--px-btn-height,2em)}.btn{display:inline-block;overflow:visible;min-width:var(--px-btn-min-width,4.66667em);margin:0;border:1px solid var(--px-btn-border-color,transparent);border-radius:0!important;padding:0 calc(var(--px-btn-height,2em)/ 2);box-shadow:var(--px-btn-shadow--light,none);font:inherit;line-height:calc(var(--px-btn-height,2em) - 2px);-webkit-font-smoothing:antialiased;cursor:pointer;text-align:center;text-decoration:none;text-transform:none;white-space:nowrap;background-color:var(--px-btn-background,#d8e0e5);transition:background .4s,border-color .4s,color .4s}.heading--section,.heading--subsection,.label{text-transform:uppercase}.btn,.btn:active,.btn:hover,.btn:link,.btn:visited{color:var(--px-btn-color,#2c404c)}.btn:focus,.btn:hover{border-color:var(--px-btn-border-color--hover,transparent);box-shadow:var(--px-btn-shadow,none);background-color:var(--px-btn-background--hover,#a3b5bf)}.btn:active{border-color:var(--px-btn-border-color--pressed,transparent);box-shadow:none;background-color:var(--px-btn-background--pressed,#889aa5);outline:0}@-moz-document url-prefix(){.btn:not(button){line-height:1.8em}}button.btn{-webkit-appearance:button}.btn+.btn{margin-left:.66667rem}.btn--bare{border:0!important;border-radius:0!important;line-height:inherit;padding-left:0;padding-right:0}.btn--bare,.btn--bare:active,.btn--bare:focus,.btn--bare:hover,.btn--bare:link,.btn--bare:visited{box-shadow:none;background:0 0;outline:0}.btn--bare,.btn--bare:link,.btn--bare:visited{color:var(--px-btn-bare-color,#2c404c)}.btn--bare:focus,.btn--bare:hover{color:var(--px-btn-bare-color--hover,#007acc)}.btn--bare:active{color:var(--px-btn-bare-color--pressed,#003d66)}.btn--disabled,.btn--disabled:active,.btn--disabled:focus,.btn--disabled:hover,.btn--disabled:link,.btn--disabled:visited,.btn[disabled],.btn[disabled]:active,.btn[disabled]:focus,.btn[disabled]:hover,.btn[disabled]:link,.btn[disabled]:visited{color:var(--px-btn-disabled-color,rgba(0,0,0,.2));border:1px solid;border-color:var(--px-btn-disabled-border-color,rgba(0,0,0,.2));box-shadow:none;background-color:var(--px-btn-disabled-background,transparent);pointer-events:none}.alpha{font-size:5rem;line-height:1.06667;font-weight:400}.beta{font-size:4rem;line-height:1;font-weight:400}.delta,.gamma{line-height:1.33333;font-weight:400}.gamma{font-size:3rem}.delta{font-size:2rem}.epsilon{font-size:1.33333rem;line-height:1;font-weight:400}.zeta{font-size:.8rem;line-height:1.66667;font-weight:400}.heading--page{font-size:2rem;line-height:1.33333;color:var(--px-headings-heading-page-color,#2c404c)}.heading--section{font-size:1.33333rem;line-height:1;color:var(--px-headings-heading-section-color,#677e8c)}.heading--subsection{font-size:1rem;line-height:1.33333;color:var(--px-headings-heading-subsection-color,#2c404c);background-color:var(--px-headings-heading-subsection-background,rgba(136,154,165,.15));letter-spacing:var(--px-headings-letter-spacing,.3px);display:flex;padding-left:5px;padding-right:5px}.label{font-size:.8rem;line-height:1.66667;color:var(--px-headings-label-color,#677e8c);letter-spacing:var(--px-headings-letter-spacing,.3px)}.value{font-size:1rem;line-height:1.33333;color:var(--px-headings-value-color,#2c404c)}.flex{display:flex}.inline--flex{display:inline-flex}.flex--row{flex-direction:row}.flex--row--rev{flex-direction:row-reverse}.flex--col{flex-direction:column}.flex--col--rev{flex-direction:column-reverse}.flex--nowrap{flex-wrap:nowrap}.flex--wrap{flex-wrap:wrap}.flex--wrap--rev{flex-wrap:wrap-reverse}.flex--left{justify-content:flex-start}.flex--center{justify-content:center}.flex--right{justify-content:flex-end}.flex--justify{justify-content:space-between}.flex--spaced{justify-content:space-around}.flex--top{align-items:flex-start}.flex--middle{align-items:center}.flex--bottom{align-items:flex-end}.flex--stretch{align-items:stretch}.flex--baseline{align-items:baseline}.flex--top--multi{align-content:flex-start}.flex--middle--multi{align-content:center}.flex--bottom--multi{align-content:flex-end}.flex--stretch--multi{align-content:stretch}.flex--justify--multi{align-content:space-between}.flex--spaced--multi{align-content:space-around}.flex__item{flex:1}.flex__item--msfix{flex:1 1 auto}.flex__item--top{align-self:flex-start}.flex__item--middle{-ms-grid-row-align:center;align-self:center}.flex__item--bottom{align-self:flex-end}.flex__item--baseline{align-self:baseline}:host{pointer-events:all}h1{margin-top:0;margin-bottom:0}.u-mt--,.u-mv--{margin-top:.33333rem!important}.u-mb--,.u-mv--{margin-bottom:.33333rem!important}.no-min-width{min-width:0!important}.button--nav-right{margin-left:1rem}.u-mh--,.u-ml--{margin-left:.33333rem!important}.button--nav-left{margin-right:1rem}.u-mh--,.u-mr--{margin-right:.33333rem!important}.u-m--{margin:.33333rem!important}.u-mh-,.u-mr-{margin-right:.66667rem!important}.u-mh-,.u-ml-{margin-left:.66667rem!important}.u-mt-,.u-mv-{margin-top:.66667rem!important}.u-mb-,.u-mv-{margin-bottom:.66667rem!important}.u-m-{margin:.66667rem!important}
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