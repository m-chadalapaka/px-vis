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
import 'px-d3-imports/px-d3-imports.js';

import './px-vis-imports.js';
import './px-vis-behavior-common.js';
import './px-vis-scheduler.js';
import '@polymer/iron-meta/iron-meta.js';
import { flush, dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { Base } from '@polymer/polymer/polymer-legacy.js';

var PxVisBehaviorD3 = window.PxVisBehaviorD3 = (window.PxVisBehaviorD3 || {});

/*
    Name:
    PxVisBehaviorD3.svg

    Description:
    Polymer behavior that provides the svg property and core methods for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.svg
*/
PxVisBehaviorD3.svg = [{
  properties: {
    /**
    * svg is a holder for the d3 instantiated svg container to draw to.
    * Must be set in ready and passed to all components so they know whom to draw to.
    *
    * @property svg
    * @type Object
    */
    svg: {
      type: Object,
      notify: true
    },
    /*
    *
    * The SVG element inside the chart - not a D3 selected element.
    */
    pxSvgElem: {
      type: Object,
      notify:true
    }
  },

  /**
   * Generates a random id string.
   *
   * Takes a string prefix, then adds 10 random chars
   *
   * @param {string}
   * @return {id string}
   */
  generateRandomID: function(baseStr) {

    var id = baseStr,
        abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        len = abc.length;

    for(var i = 0; i < 10; i++){
      id += abc.charAt(Math.floor(Math.random() * len));
    }

    Px.uniqueIds = Px.uniqueIds || [];
    if(Px.uniqueIds.indexOf(id) !== -1) {
      //id exists, recreate it.
      return this.generateRandomID(baseStr);
    } else {
      Px.uniqueIds.push(id);
    }

    return id;
  },
  /*
   * Clones a SVG elem and sets a component property with the d3 instance of that clone.
   *
   * The intent of this is to clone the high level 'g' elem we draw to and attach it.
   * The draw order matters  in SVG and we want the some stuff to appear on top of everything else
   * Since we cannot easily ensure it draw order with components, we can stick top level items in a different 'g' that we know is drawn after the main 'g'
   *
   * @param {element}
   * @param {string}
  */
  cloneSVGElem: function(svg,prop,onBottom) {
    var tempSVG = svg,
        clone = tempSVG.cloneNode();

    if(!onBottom || tempSVG.parentNode.childNodes.length === 0) {
      tempSVG.parentNode.appendChild(clone);
    } else {

      tempSVG.parentNode.insertBefore(clone, tempSVG.parentNode.firstChild );
    }

    this.set(prop,Px.d3.select(clone));
  },

  /**
   * Draws the current svg into a canvas
   */
  _drawSVGOnCanvas: function(canvas, elem, callback, x, y) {
    var svgData = elem.outerHTML,
        opacity = getComputedStyle(elem).getPropertyValue('opacity'),
        oldAlpha = canvas.globalAlpha,
        canvasContext = canvas.getContext('2d');
    x = x ? x : 0;
    y = y ? y : 0;

    canvasContext.globalAlpha = opacity;

    //stupid IE can't get outerHTML of svg even though it's now a W3C spec
    if(!svgData) {
      svgData = this._getSVGOuterHtml(elem);
    }

    //check if drawing an svg on canvas is ok
    var smallSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><div></div></svg>',
        testCanvas = document.createElement('canvas'),
        successLoadImage,
        failureLoadImage;

    failureLoadImage = function() {

      //fallback on canvg
      this._drawCanvg(canvas, svgData, x, y, function() {
        canvasContext.globalAlpha = oldAlpha;
        callback(this.resultCanvas);
      });
    }.bind(this);

    successLoadImage = function(testedCanvas) {

      //image has been loaded successfully on canvas, now test if it has been tainted
      try {
        testedCanvas.toDataURL();

        //ok no error were thrown, we can proceed
        this._nativeDrawSvgOnCanvas(canvas, svgData, x, y, function() {
          canvasContext.globalAlpha = oldAlpha;
          callback(canvas);
        }, function() {
          //fallback on canvg
          this._drawCanvg(canvas, svgData, x, y, function() {
            canvasContext.globalAlpha = oldAlpha;
            callback(this.resultCanvas);
          });
        }.bind(this));
      } catch(err) {

        //fallback on canvg
        this._drawCanvg(canvas, svgData, x, y, function() {
          canvasContext.globalAlpha = oldAlpha;
          callback(this.resultCanvas);
        });
      }
    }.bind(this);

    this._nativeDrawSvgOnCanvas(testCanvas, smallSvg, x, y, successLoadImage, failureLoadImage);
  },
  /**
   * Uses canvg third party to "translate" svg to javascript instructions
   * for the canvas, and draw on the canvas
   */
  _drawCanvg: function(canvas, svgData, x, y, callback) {
    var options = {ignoreDimensions: true,
                  ignoreClear: true,
                  renderCallback: callback,
                  offsetX: x,
                  offsetY: y,
                  resultCanvas: canvas};
    canvg(canvas, svgData, options);
  },

  /**
   * Tries to draw the SVG to canvas and if that doesnt work, falls back on a failure callback
   */
  _nativeDrawSvgOnCanvas: function(canvas, svgData, x, y, sucessCallback, failureCallback) {
    //detect canvas tainting failures

      var DOMURL = window.URL || window.webkitURL || window,
          blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'}),
          url = DOMURL.createObjectURL(blob),
          img = new Image();

      //once svg has been loaded
      img.onload = function() {

        //catching error for IE 11 here:
        //http://stackoverflow.com/questions/25214395/unexpected-call-to-method-or-property-access-while-drawing-svg-image-onto-canvas
        try {
          canvas.getContext('2d').drawImage(img, x, y);
          DOMURL.revokeObjectURL(url);
        } catch(err) {
          failureCallback(canvas);
          return;
        }

        sucessCallback(canvas);
      };

      //Safari...
      img.onerror = function(err) {
        failureCallback(canvas);
      }.bind(this);

      img.src = url;
  },
  /**
   * fix for IE to get outer HTML
   */
  _getSVGOuterHtml: function(svg) {
    var serializeXML = function(node, output) {
      var nodeType = node.nodeType;
      if (nodeType == 3) { // TEXT nodes.
        // Replace special XML characters with their entities.
        output.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'));
      } else if (nodeType == 1) { // ELEMENT nodes.
        // Serialize Element nodes.
        output.push('<', node.tagName);
        if (node.hasAttributes()) {
          var attrMap = node.attributes;
          for (var i = 0, len = attrMap.length; i < len; ++i) {
            var attrNode = attrMap.item(i);
            output.push(' ', attrNode.name, '=\'', attrNode.value, '\'');
          }
        }
        if (node.hasChildNodes()) {
          output.push('>');
          var childNodes = node.childNodes;
          for (var i = 0, len = childNodes.length; i < len; ++i) {
            serializeXML(childNodes.item(i), output);
          }
          output.push('</', node.tagName, '>');
        } else {
          output.push('/>');
        }
      } else if (nodeType == 8) {
        // TODO(codedread): Replace special characters with XML entities?
        output.push('<!--', node.nodeValue, '-->');
      } else {
        // TODO: Handle CDATA nodes.
        // TODO: Handle ENTITY nodes.
        // TODO: Handle DOCUMENT nodes.
        throw 'Error serializing XML. Unhandled node of type: ' + nodeType;
      }
    }

    var output = [];
    var childNode = svg.firstChild;
    while (childNode) {
      serializeXML(childNode, output);
      childNode = childNode.nextSibling;
    }

    return '<svg xmlns="' + svg.attributes.xmlns.value + '" width="' +
      svg.attributes.width.value + '" height="' + svg.attributes.height.value +
      '">' + output.join('') + '</svg>';
  }
}, PxVisBehavior.svgDefinition, PxVisBehavior.uniqueIds];

/*
    Name:
    PxVisBehaviorD3.svg

    Description:
    Polymer behavior that provides the svg properties when there are two svgs in a chart.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.svgLower
*/
PxVisBehaviorD3.svgLower = [{
  properties: {
    /*
    *
    * The SVG element inside the chart - not a D3 selected element. Used when there are two svgs in a chart
    */
    pxSvgElemLower: {
      type: Object,
      notify:true
    }
  }
}, PxVisBehavior.svgLowerDefinition];

/*
    Name:
    PxVisBehaviorD3.canvasContext

    Description:
    Polymer behavior that provides the canvasContext property.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.canvasContext
*/
PxVisBehaviorD3.canvasContext = [{
  properties: {
    /**
     * canvasContext is a holder for the instantiated canvas context to draw to.
     * Must be set in ready and passed to all components so they know whom to draw to.
     *
     */
    canvasContext: {
      type: Object,
      notify:true
    },

    /**
     * An array of the generated layers
     *
     */
    canvasLayers: {
      type: Object,
      notify: true,
      value: function() { return {}; }
    }
  }
}, PxVisBehavior.canvasLayersConfig];

/*
    Name:
    PxVisBehaviorD3.canvas

    Description:
    Polymer behavior that provides the canvasContext and renderToSvg properties

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.canvas
*/
PxVisBehaviorD3.canvas = [{
  properties: {
    /**
    * Boolean to specify if drawings should render to svg instead of canvas
    *
    */
    renderToSvg: {
      type: Boolean,
      value: false
    }
  },
  observers: [
    '_renderToSvgChanged(renderToSvg)'
  ],
  _renderToSvgChanged: function(renderToSvg) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    if(this.renderToSvg && this.canvasContext && this.canvasContext.pxClearCanvas) {
      //make sure the canvas cleans itself
      this.canvasContext.pxClearCanvas();
    }

    //flush so that the dom if are processed and make the switch
    //between svg and canvas components
    if(this._isAttached) {
      flush();
    }
  }
}, PxVisBehavior.observerCheck, PxVisBehaviorD3.canvasContext, PxVisBehavior.isAttached]

/*
    Name:
    PxVisBehaviorD3.renderToCanvas

    Description:
    Polymer behavior that provides the renderToCanvas property

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.renderToCanvas
*/
PxVisBehaviorD3.renderToCanvas = [{
  properties: {
    /**
    * Boolean to specify if drawings should render to canvas instead of svg
    */
    renderToCanvas: {
      type: Boolean,
      value: false,
      observer: '_renderToCanvasChanged'
    }
  },
  _renderToCanvasChanged: function(renderToCanvas) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    if(!this.renderToCanvas && this.canvasContext && this.canvasContext.pxClearCanvas) {
      //make sure the canvas cleans itself
      this.canvasContext.pxClearCanvas();
    }

    //flush so that the dom if are processed and make the switch
    //between svg and canvas components
    if(this._isAttached) {
      flush();
    }
  }
}, PxVisBehavior.observerCheck, PxVisBehavior.isAttached];

/*
    Name:
    PxVisBehaviorD3.axes

    Description:
    Polymer behavior that provides the x,y and isMultiY properties for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.axes
*/
PxVisBehaviorD3.axes = [{
  properties: {
    /**
     * x is a holder for the d3 instantiated scale object
     * Must be set in the svg component and passed to all components so they know the drawing scale.
     * This can be set declaratively
     *
     * See: https://github.com/d3/d3/blob/master/API.md#scales-d3-scale
     *
     * @property x
     * @type Function
     */
    x: {
      type: Function,
      notify:true
    },
    /**
     * y is a holder for the d3 instantiated scale object
     * Must be set in the svg component and passed to all components so they know the drawing scale.
     * This can be set declaratively
     *
     * See: https://github.com/d3/d3/blob/master/API.md#scales-d3-scale
     *
     * @property y
     * @type {Object|Function}
     */
    y: {
      type: Object,
      notify:true
    },
    isMultiY: {
      type: Boolean,
      readOnly: true,
      computed: '_getIsMultiY(y.*)'
    }
  },
  _getIsMultiY: function() {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    return typeof this.y === 'object';
  },
  /**
   * This functions process Y axis and applies the result to some variable.
   * If in single Y it just run the function and assign the result to `result`, if multi Y
   * it runs the function for each axis and stores the result against the axis key
   * on `result`
   */
  _processYValues: function(callback) {

    callback = callback.bind(this);

    if(this.isMultiY) {
      var result = {},
          keys = Object.keys(this.y);

      for(var i=0; i<keys.length; i++) {
        result[keys[i]] = callback(this.y[keys[i]], keys[i]);
      }

      return result;
    } else {
      result = callback(this.y);
    }

    return result;
  }
}, PxVisBehavior.observerCheck];

/*
    Name:
    PxVisBehaviorD3.domainUpdate

    Description:
    Polymer behavior that provides domain update property

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.domainUpdate
*/
PxVisBehaviorD3.domainUpdate = {
  properties: {
    /**
     * Number which increments up when the domain(s) has(have) changed.
     *
     * 0 (false) indicates that domains have not been set.
     *
     * Serves as a trigger for many elements to redraw.
     *
     * @property domainChanged
     * @type Number
     */
    domainChanged: {
      type: Number,
      notify: true,
      value: 0
    }
  }
};

/*
    Name:
    PxVisBehaviorD3.axisOrientation

    Description:
    Polymer behavior that provides the orientation property for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.axisOrientation
*/
PxVisBehaviorD3.axisOrientation = {
  properties: {
    /**
     * Defines which side the axis should be on.
     *  - 'left'
     *  - 'right'
     *  - 'bottom'
     *  - 'top'
     *
     * @property orientation
     * @type String
     * @default bottom
     */
    orientation: {
      type: String,
      value: 'left'
    }
  }
};

/*
    Name:
    PxVisBehaviorD3.axis

    Description:
    Polymer behavior that provides the axis and orientation properties for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.axis
*/
PxVisBehaviorD3.axis = [{
  properties: {
    /**
     * axis is a general holder for the d3 instantiated scale object
     * Can pass any type of instantiated scale object, IE pass in either your x or your y depending which this axis is for.
     * This can be set declaratively
     *
     * See: https://github.com/d3/d3/blob/master/API.md#scales-d3-axis
     *
     * @property axis
     * @type Object
     */
    axis: {
      type: Object
    },
    /**
     * Defines which side the axis should be on.
     *  - 'left'
     *  - 'right'
     *  - 'bottom'
     *  - 'top'
     *
     * @property orientation
     * @type String
     * @default bottom
     */
    orientation: {
      type: String,
      value: 'bottom',
    }
  }
}, PxVisBehaviorD3.axisOrientation];

/*
    Name:
    PxVisBehaviorD3.selectedDomain

    Description:
    Polymer behavior that provides the an object to hold user selected domains for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.selectedDomain
*/
PxVisBehaviorD3.selectedDomain = {
  properties: {
    /**
     * New chart extents selected by the user
     *
     * Serves as a trigger for the scale component to redefine the chart extents
     *
     * @property selectedDomain
     * @type Object
     */
    selectedDomain: {
      type:Object,
      value: function() {
        return {x:[], y:[]};
      },
      notify:true
    }
  }
};

/*
    Name:
    PxVisBehaviorD3.selectedTimeDomain

    Description:
    Polymer behavior that provides the ability to use px-datetime (px-rangepicker) to drive the selection
    of a time domain in a px-vis time based chart

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.selectedTimeDomain
*/
PxVisBehaviorD3.selectedTimeDomain = [{
  properties: {
    /**
     * Range object defining the time span
     *   * Format ISO8601 strings
     * ```
     * {
     *    "from": "2013-01-07T22:44:30.652Z",
     *    "to" : "2013-02-04T22:44:30.652Z"
     * }
     * ```
     *
     * Updates and is updated by SelectedDomain
     *
     */
    range: {
      type: Object,
      notify: true
    },
    _preventDomainUpdate: {
      type: Boolean,
      value: false
    },
    _preventRangeUpdate: {
      type: Boolean,
      value: false
    }
  },
  observers: [
    '_rangeChanged(range)'
  ],
  attached: function() {
    this._isAttached = true;
  },
  _rangeChanged: function(range) {
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    if(this._isAttached && !this._preventRangeUpdate) {
      //update selectedDomain with those new values
      //make sure we don't trigger a domain update when changing it from here
      this._preventDomainUpdate = true;

      var newDomain = {},
          dataExtents = {};
      // newDomain.y = this.selectedDomain.y;
      newDomain.x = [];
      newDomain.x[0] = Number(Px.moment(this.range.from, Px.moment.ISO_8601).format('x'));
      newDomain.x[1] = Number(Px.moment(this.range.to, Px.moment.ISO_8601).format('x'));

      if(this.dataExtents && this.dataExtents.y.length > 0) {
        dataExtents["y"] = this.dataExtents.y;
      } else {
        dataExtents.y = [Infinity, -Infinity];
      }

      dataExtents.x = newDomain.x;

      // this.set('selectedDomain', newDomain);
      this.set('dataExtents', dataExtents);

      this._preventDomainUpdate = false;
    }

  },
  // _selectedDomainChanged: function(selectedDomain) {
  //   if(this._isAttached && !this._preventDomainUpdate) {
  //     //update selectedDomain with those new values
  //     //make sure we don't trigger a domain update when changing it from here
  //     this._preventRangeUpdate = true;
  //
  //     var newRange = {};
  //     newRange.from = Px.moment(this.selectedDomain.x[0]).toISOString();
  //     newRange.to = Px.moment(this.selectedDomain.x[1]).toISOString();
  //
  //     this.set('range', newRange);
  //
  //     this._preventRangeUpdate = false;
  //   }
  // }

}, PxVisBehavior.observerCheck, PxVisBehaviorD3.selectedDomain];

/*
    Name:
    PxVisBehaviorD3.clipPathBoolean

    Description:
    Polymer behavior that provides a clipPath boolean to determine
    if clip path should be used or not.
    !!Do not confuse with PxVisBehaviorD3.clipPath!!
    rule fo thumbis this behavior is for canvas element and
    PxVisBehaviorD3.clipPath for svg elements

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.clipPathBoolean
*/
PxVisBehaviorD3.clipPathBoolean = {
  properties: {
    /**
     * Whether to use the clipPath to avoid drawing outside of the axes.
     */
      clipPath: {
      type: Boolean,
      value: false
    },
  }
};

/*
    Name:
    PxVisBehaviorD3.clipPath

    Description:
    Polymer behavior that provides the clipPath object for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.clipPath
*/
PxVisBehaviorD3.clipPath = {
  properties: {
    /**
     * Holder for a clipping path ID
     *
     */
    clipPath: {
      type:String,
      notify:true
    },
    /**
     * A more restricting clip path used to limit where the series are being drawn
     *
     */
    seriesClipPath: {
      type:String,
      notify: true
    }
  },
  /**
   * Add the clip-path attr to the element
   *
   * @method addClipPath
   */
  addClipPath: function(elem) {
    if(typeof(this.clipPath) !== 'undefined' && this._doesD3HaveValues(elem)){
      elem.attr("clip-path", 'url(#' + this.clipPath + ')');
    }
  }
};

/*
    Name:
    PxVisBehaviorD3.dynamicRedraw

    Description:
    Polymer behavior that provides the dynamicRedraw objects for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.dynamicRedraw
*/
PxVisBehaviorD3.dynamicRedraw = {
  properties: {
    /**
     * Boolean to specify if we should redraw the chart series when we move an axis. More of a chart type by chart type configuration rather than a developer configuration. IE, for charts such as multi-y timeseries, it is unnessary. For charts such as parallel coordinates, it is necessary.
     */
    redrawSeries: {
      type: Boolean,
      value: false
    },
    /**
     * The accompanying array of series elements required to redraw.
     */
    redrawElems: {
      type: Array,
      value: function() { return [] }
    },
    /**
     * Boolean specifing if the lines should redraw as you move the axis or just at the end.
     */
    dynamicRedraw: {
      type: Boolean,
      value: false
    }
  }
};


/*
    Name:
    PxVisBehaviorD3.labelTypeSize

    Description:
    Polymer behavior that provides the labelTypeSize objects for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.labelTypeSize
*/
PxVisBehaviorD3.labelTypeSize = {
  properties: {
    /**
     * Defines the base label type size
     *
     * @property labelTypeSize
     * @type Number
     * @default 12
     */
    labelTypeSize: {
      type: Number,
      value: 12,
    }
  }
};

/*
    Name:
    PxVisBehaviorD3.axisConfig

    Description:
    Polymer behavior that provides the axisConfig objects for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.axisConfig
*/
PxVisBehaviorD3.axisConfig = [{
  properties: {
    /**
     * The displayed title for the axis
     *
     * @property title
     * @type String
     * @default ''
     */
    title: {
      type:String,
      value: ''
    },
    /**
     * Defines on which side the tick mark the label should sit.
     *  - 'center'
     *  - 'before'
     *  - 'after'
     *
     * @property labelPosition
     * @type String
     * @default center
     */
    labelPosition: {
      type: String,
      value: 'center'
    },
    /**
     * Defines how the label should be rotated. Number is the degree of rotation
     *
     * @property labelRotation
     * @type Number
     * @default 0
     */
    labelRotation: {
      type: Number,
      value: 0,
    },
    /**
     * Defines how the label should be moved in x,y. Array is an x,y pair and coresponds to the number of pixels to move the label
     *
     * @property labelTranslation
     * @type Array
     * @default [0,0]
     */
    labelTranslation: {
      type: Array,
      value: function() {return [0,0];},
    },
    /**
     * Array of the series which belong to this axis
     *
     * @property series
     * @type Array
     */
    series: {
      type: Array,
      value: function() {return[];}
    },
    /**
     * An x,y amount to move the axis to allow for labels and titles
     *
     * @property translateAmt
     * @type Array
     */
    translateAmt: {
      type: Array,
      value:function(){ return [0,0]; }
    },
    /**
     * Optional object to specify placement of the title. If none is supplied, then it uses `orientation` to determine title location.
     *
     *```
     *    {
     *      x: Number, // a x number of pixels
     *      y: Number, // a y number of pixels
     *      r: Number, // a number of degrees to rotate
     *      anchor: String, // middle, start, end
     *    }
     *```
     */
    titleLocation: {
      type: Object,
      value: function(){ return {} }
    },

    /**
     * Defines the Title type size
     *
     */
    titleTypeSize: {
      type: Number,
      value: 15,
    },

    /**
     * Defines the axis stroke width
     *
     */
    strokeWidth: {
      type: Number,
      value: 1
    },
    /**
     * Defines the axis tickSizeOuter. Default is to hide them
     *
     * See: https://github.com/d3/d3-axis#axis_tickSizeOuter
     */
     tickSizeOuter: {
      type: Number,
      value: 0
    },
    tickSizeInner: Number,
    tickPadding: Number,
    /**
     * Defines the what values the axis should use
     *
     * See: https://github.com/d3/d3-axis#axis_tickValues
     */
    tickValues: {
      type: Array
    },
    /**
     * Defines the tick number and format
     *
     * See: https://github.com/d3/d3-axis#axis_ticks
     *
     * Can be either a Number or an Object
     *
     * Obj format:
     * ```
     *    {
     *         "interval": Number,
     *         "format": String or d3 object,
     *    }
     * ```
     * @type {Object|Number|Function}
     *
     */
    ticks: {
      type: Object
    },
    /**
    * A string that specifies the format of the ticks
    *
    * https://github.com/d3/d3-format
    *
    * https://github.com/d3/d3-time-format
    *
    * @type {String|Function}
    *
    */
    tickFormat: {
      type: String
    },
    /**
     * Defines the color for axis lines, ticks, labels, and title
     *
     */
    axisColor: {
      type: String,
      value: ""
    },
    /**
     * Defines the color for axis lines (overrides axisColor)
     *
     */
     axisLineColor: {
      type: String,
      value: ""
    },
    /**
     * Defines the color for axis ticks (overrides axisColor)
     *
     */
     axisTickColor: {
      type: String,
      value: ""
    },
    /**
     * Defines the color for axis labels (overrides axisColor)
     *
     */
     axisLabelColor: {
      type: String,
      value: ""
    },
    /**
     * Defines the color for axis title (overrides axisColor)
     *
     */
     axisTitleColor: {
      type: String,
      value: ""
    },
    /**
     * Returned tick values from the axis
     *
     */
    drawnTickValues: {
      type: Array,
      notify: true
    }
  }
}, PxVisBehaviorD3.labelTypeSize];

/*
    Name:
    PxVisBehaviorD3.labelTypeSize

    Description:
    Polymer behavior that provides the labelTypeSize objects for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.labelTypeSize
*/
PxVisBehaviorD3.labelTypeSize = {
  properties: {
    /**
     * Defines the base label type size
     *
     * @property labelTypeSize
     * @type Number
     * @default 12
     */
    labelTypeSize: {
      type: Number,
      value: 12,
    }
  }
};

/*
    Name:
    PxVisBehaviorD3.advAxisConfig

    Description:
    Polymer behavior that provides the advAxisConfig objects for d3 components.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.advAxisConfig
*/
PxVisBehaviorD3.advAxisConfig = {
  properties: {

  }
};


/*
    Name:
    PxVisBehaviorD3.radialAxisConfig

    Description:
    Polymer behavior that provides shared behaviors for radial axes elements.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.radialAxisConfig
*/
PxVisBehaviorD3.radialAxisConfig = {
  properties: {
    /**
    * Used in a radial chart to provide a hole in the center of the chart
    *
    */
    centerOffset: {
      type: Number,
      value: 0,
      notify: true
    },
  }
};

/*
    Name:
    PxVisBehaviorD3.interpolationFunction

    Description:
    Polymer behavior that provides definition for interpolationFunction and method to check for an interpolationFunction

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.interpolationFunction
*/
PxVisBehaviorD3.interpolationFunction = {
  properties: {
    /**
    * A d3 function used to interpolate the series lines.
    *
    * Can also be a string referencing simple, built in d3 functions:
    * - `"curveBasis"`
    * - `"curveBasisClosed"`
    * - `"curveBasisOpen"`
    * - `"curveLinear"`
    * - `"curveLinearClosed"`
    * - `"curveMonotoneX"`
    * - `"curveMonotoneY"`
    * - `"curveNatural"`
    * - `"curveStep"`
    * - `"curveStepAfter"`
    * - `"curveStepBefore"`
    *
    * See: https://github.com/d3/d3-shape/blob/master/README.md#curves
    */
    interpolationFunction: {
      type: Function
    },

    _basicInterpolators: {
      type: Object,
      value: function() {
        return {
          "curveBasis" : Px.d3.curveBasis,
          "curveBasisClosed" : Px.d3.curveBasisClosed,
          "curveBasisOpen" : Px.d3.curveBasisOpen,
          "curveLinear" : Px.d3.curveLinear,
          "curveLinearClosed" : Px.d3.curveLinearClosed,
          "curveMonotoneX" : Px.d3.curveMonotoneX,
          "curveMonotoneY" : Px.d3.curveMonotoneY,
          "curveNatural" : Px.d3.curveNatural,
          "curveStep" : Px.d3.curveStep,
          "curveStepAfter" : Px.d3.curveStepAfter,
          "curveStepBefore" : Px.d3.curveStepBefore
        }
      }
    }
  },

  _checkInterpolation: function() {
    var interpolate = null;
    //see if there is a universal interpolationFunction
    // is it a reference to _basicInterpolators?
    interpolate = typeof this.interpolationFunction === 'string' && this._basicInterpolators[this.interpolationFunction] ? this._basicInterpolators[this.interpolationFunction] : interpolate;
    // is it a function
    interpolate = typeof this.interpolationFunction === 'function' ? this.interpolationFunction : interpolate;

    //see if there is a series specific reference to _basicInterpolators; fallback to previous value if not
    interpolate = this.completeSeriesConfig[this.seriesId]['interpolationFunction'] &&
                  typeof this.completeSeriesConfig[this.seriesId]['interpolationFunction'] === 'string' &&
                  this._basicInterpolators[this.completeSeriesConfig[this.seriesId]['interpolationFunction']] ?
                  this._basicInterpolators[this.completeSeriesConfig[this.seriesId]['interpolationFunction']] : interpolate;

    //see if there is a series specific function; fallback to previous value if not
    interpolate = this.completeSeriesConfig[this.seriesId]['interpolationFunction'] &&
                  typeof this.completeSeriesConfig[this.seriesId]['interpolationFunction'] === 'function' ?
                  this.completeSeriesConfig[this.seriesId]['interpolationFunction'] : interpolate;

    return interpolate;
  }
};

/*
    Name:
    PxVisBehaviorD3.lineRadiusLimit

    Description:
    Polymer behavior that provides the lineRadiusLimit property

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.lineRadiusLimit
*/
PxVisBehaviorD3.lineRadiusLimit = {
  properties: {
    /**
    * sets a minimum value for the line amplitude. Points less than the lineRadiusLimit will be set to the limit
    *
    */
    lineRadiusLimit: {
      type: Number
    }
  }
};

/*
    Name:
    PxVisBehaviorD3.radialLineGenerator

    Description:
    Polymer behavior that provides function to create a radial line generator

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.radialLineGenerator
*/
PxVisBehaviorD3.radialLineGenerator = [{

  properties: {
    /**
    * A holder object for the line generator
    *
    */
    line: {
      type: Object
    },

    /**
    * sets a minimum value for the line amplitude. Points less than the lineRadiusLimit will be set to the limit
    *
    * Essentially, it moves a point that is past the center into the visible axis area on the opposite side to terminating inside the clip path area, thereby also changing the angle of those connecting lines
    *
    * Note: radius on a radialLine is equivelent to y on a cartesean line.
    */
    lineRadiusLimit: {
      type: Number
    }
  },

  /**
   * Defines a multi-scale d3 line generator and its attrs
   *
   */
  _defineRadialLine: function(toCanvas, multiLine, counterClockwise, useDegrees) {
    //get our dimensions
    var _this = this,
        renderToCanvas = (typeof(toCanvas) !== 'undefined') ? toCanvas : false,
        //omg; need to make a copy or else completing the circle breaks dragging.
        dims = JSON.parse(JSON.stringify(this.completeSeriesConfig[this.seriesId]['x'])),
        path,
        line,
        clockwiseFactor = counterClockwise ? -1 : 1;

    if(multiLine) {

      if(this.interpolationFunction === 'bofCompleteManually') {
        //manually complete the circle.
        // if we use a d3 interpolator, it adds 'Z' to the path which cause all broken paths to complete. We want to keep broken paths broken
        dims.push(dims[0]);
      }

      path = Px.d3.radialLine()
      .angle(function(d) {
        return _this.x(d[0]) * clockwiseFactor;
      })
      .radius(function(d) {

        var radius = Math.floor(_this.y(Number(d[1])));

        if(typeof _this.lineRadiusLimit === 'number' && radius < _this.lineRadiusLimit) {
          return _this.lineRadiusLimit;
        }
        return radius
      }).defined(function(d) {
        return _this._isValidData(_this.x(d[0])) && _this._isValidData(_this.y(Number(d[1])));
      });

      //be sneaky: iterate through the data like normal
      line = function(d) {
        //for each datapoint, iterate through the dimensions
        return path(dims.map(function(p) {
          //check that we have data; if not, return false so it doesnt draw a line
          if(!d || typeof(d[p]) === 'undefined' || d[p] === null) {
            return false
          }
          //return [x,y] to path: x is ordinal based on dim; get the y-scale for the dim and use that particular scale on the data
          return [p,d[p]];
        }));
      };
    } else {
      var xId = this.completeSeriesConfig[this.seriesId]['x'],
          yId = this.completeSeriesConfig[this.seriesId]['y'],
          processAngle;

      if(useDegrees) {
        processAngle = function(d) {
          return d[xId]/180 * Math.PI * clockwiseFactor;
        };
      } else {
        processAngle = function(d) {
          return d[xId] * clockwiseFactor;
        };
      }

      path = Px.d3.radialLine()
      .angle(function(d) {
        return processAngle(d);
      })
      .radius(function(d) {
        return _this.y(d[yId]);
      }).defined( function(d) {
        return _this._isValidData(d[xId]) && _this._isValidData(d[yId]);
      });

      line = function(d) {
        return path(d);
      }
    }

    var interpolate = this._checkInterpolation();

    if(interpolate) {
      path.curve(interpolate);
    }

    // add the canvas context if relevant
    if(renderToCanvas) {
      path.context(this.canvasContext);
    }
    this.set('line', line);
  }
}, PxVisBehavior.completeSeriesConfig, PxVisBehavior.dataset, PxVisBehaviorD3.interpolationFunction, PxVisBehaviorD3.lineRadiusLimit];


/*
    Name:
    PxVisBehaviorD3.lineGaps

    Description:
    Polymer behavior that provides definition for showGaps

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.lineGaps
*/
PxVisBehaviorD3.lineGaps = {
  properties: {
    /**
     * A boolean spcifying if the line should show gaps on undefined data.
     *
     */
    showGaps: {
      type: Boolean,
      value: false
    }
  }
};

/*
    Name:
    PxVisBehaviorD3.lineShared

    Description:
    Polymer behavior that provides shared behaviors for line elements.

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.lineShared
*/
PxVisBehaviorD3.lineShared = [{
  properties: {
    /**
    * A dev set boolean specifying if the chart is for a parallel coordinates chart
    *
    */
    parallelCoordinates: {
      type: Boolean,
      value: false
    },
    /**
    * A dev set boolean specifying if the line is using radial(polar) data
    *
    */
    radialLine: {
      type: Boolean,
      value: false
    },
    /**
    * A boolean spceifying if a opacity gradient should get applied to the line
    *
    */
    gradientLine: {
      type: Boolean,
      value: false
    },
    /**
    * Gets and saves the rgb so we can make an rgba to apply to the line
    *
    */
    _colorArr: {
      type: Array,
      computed: '_computeColorArr(categories,completeSeriesConfig,seriesId)'
    },

    /**
     * A boolean spcifying if multiple paths get drawn by the line
     *
     */
    multiPath: {
      type: Boolean,
      value: false
    },
    /**
     * Object used to store various info about current rendering state
     */
    _currentDrawingOptions: {
      type: Object,
      value: function() {
        return {
          'lastPointRenderedIndex': null,
          'currentBatchStartIndex': 0
        };
      }
    }
  },

  observers: [
    '_computeGradientRange(timeDomain)'
  ],

  _resetRenderingContext: function() {
    this._currentDrawingOptions.lastPointRenderedIndex = null;
    this._currentDrawingOptions.currentBatchStartIndex = 0;
  },

  _computeColorArr: function(categories, completeSeriesConfig, seriesId){
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    var colors = {};

    //save each color individually for use later
    colors[seriesId] = this.createGradientFunction(completeSeriesConfig[seriesId].color);

    // if coloring by category
    if(categories.length > 0) {
      for(var i = 0; i < categories.length; i++) {
        if(completeSeriesConfig[categories[i]]) {
          colors[categories[i]] = this.createGradientFunction(completeSeriesConfig[categories[i]].color);
        }
      }
    }

    return colors;
  },

  /**
   * Returns the correct color to use for the line.
   */
    _getLineColor:function(data) {
    // figure out if we are using a category or the seriesID
    var key = this.categoryKey ? data[this.categoryKey] : this.seriesId;
    // check that we want to draw that category
    if(this._colorArr[key]) {
      // return the appropriate rgba
      return this._colorArr[key](data[this.seriesId]);
    }
    return null;
  },

  /**
   * Defines the d3 line generator and its attrs
   *
   */
  _defineSingleLine: function(toCanvas) {
    var _this = this,
        renderToCanvas = (typeof(toCanvas) !== 'undefined') ? toCanvas : false,
        xKey = _this.completeSeriesConfig[_this.seriesId]['x'],
        yKey = _this.completeSeriesConfig[_this.seriesId]['y'],
        line;

    if(this.showGaps) {
      line = Px.d3.line()
        .x(function(d, i) {
          // round pixels values to optimize svg perfs
          return Math.floor(_this.x(d[xKey]));
        })
        .y(function(d) {

          return Math.floor(_this.y(d[yKey]));
        })
        .defined(function(d,i) {
          return _this._isValidData(d[yKey]);
        });
    } else {
      line = Px.d3.line()
        .x(function(d,i) {
          if((d[xKey] || d[xKey] === 0) && (d[yKey] || d[yKey] === 0)) {
            return Math.floor(_this.x(d[xKey]));
          } else if(!renderToCanvas) {

            //svg needs to have a point defined where canvas will just ignore this point if no value
            return Math.floor(_this.x(_this.chartData[_this._currentDrawingOptions.lastPointRenderedIndex][xKey]));
          }
        })
        .y(function(d,i) {
          if((d[xKey] || d[xKey] === 0) && (d[yKey] || d[yKey] === 0 )) {
            _this._currentDrawingOptions.lastPointRenderedIndex = _this._currentDrawingOptions.currentBatchStartIndex + i;
            return Math.floor(_this.y(d[yKey]));
          } else if(!renderToCanvas) {

            //svg needs to have a point defined where canvas will just ignore this point if no value
            return Math.floor(_this.y(_this.chartData[_this._currentDrawingOptions.lastPointRenderedIndex][yKey]));
          }
        })
        .defined(function(d,i) {
          //at first don't accept undefined since we don't have a previous point
          //to attach to
          return _this._currentDrawingOptions.lastPointRenderedIndex === null ? _this._isValidData(d[yKey]) : _this._isDataNotNull(d[yKey]);
        });
    }

    var interpolate = this._checkInterpolation();

    if(interpolate) {
      line.curve(interpolate);
    }

    // If using canvas, tell it the context to draw to.
    if(renderToCanvas) {
      line.context(this.canvasContext);
    }

    this.set('line',line);
  },

  /**
   * Defines a multi-scale d3 line generator and its attrs
   *
   */
  _defineMultiLine: function(toCanvas) {
    //get our dimensions
    var renderToCanvas = (typeof(toCanvas) !== 'undefined') ? toCanvas : false,
        dims = this.completeSeriesConfig[this.seriesId]['x'],
        //define a normal d3 line generator
        path = Px.d3.line().defined(function(d) {
          //only draw a line through the axis if we have data
          return d;
        }),
        //be sneaky: iterate through the data like normal
        line = function(d) {
          //for each datapoint, iterate through the dimensions
          return path(dims.map(function(p) {
            //check that we have data; if not, return false so it doesnt draw a line
            if(!d || (!d[p] && d[p] !== 0 || !this.y[p])) {
              return false
            }
            //return [x,y] to path: x is ordinal based on dim; get the y-scale for the dim and use that particular scale on the data
            return [Math.floor(this.x(p)), Math.floor(this.y[p](d[p]))];
          }.bind(this)));
        }.bind(this);

    var interpolate = this._checkInterpolation();

    if(interpolate) {
      path.curve(interpolate);
    }

    // add the canvas context if relevant
    if(renderToCanvas){
      path.context(this.canvasContext);
    }

    this.set('line',line);
  }
},
PxVisBehavior.observerCheck,
PxVisBehaviorD3.radialLineGenerator,
PxVisBehavior.seriesId,
PxVisBehaviorD3.lineGaps,
PxVisBehaviorD3.interpolationFunction,
PxVisBehavior.timeDomain,
PxVisBehavior.gradientColorsFunction];

/*
    Name:
    PxVisBehaviorD3.serieToRedrawOnTopSVG

    Description:
    Polymer behavior that provides the mechanism to redraw a serie on top for SVG

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.serieToRedrawOnTopSVG
*/
PxVisBehaviorD3.serieToRedrawOnTopSVG = [{
  _drawSVGOnTop: function(idToRedraw, selfId, d3Selection) {
    //is this scatter involved in redraw?
    if(idToRedraw === selfId) {
      d3Selection.raise();
    }
  }
}, PxVisBehavior.serieToRedrawOnTop, PxVisBehaviorD3.svg];

/*
    Name:
    PxVisBehaviorD3.radialPixelCalc

    Description:
    Polymer behavior that provides the mechanism to calculate pixel space vals for polar charts

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.radialPixelCalc
*/
PxVisBehaviorD3.radialPixelCalc = {
  calcPixelCoordForRadial: function(angle, amp, yRange, yDomain, whichVal) {
    var yDomainTot = yDomain[1] - yDomain[0],
        pixelAmplitude = yRange * (amp - yDomain[0])/yDomainTot;

    angle = this.adjustAngleForPolarChart(angle, false);

    //sin * pixel range * percentage of data range
    if(whichVal === 'x') {
      return Math.sin(angle) * pixelAmplitude;
    }
    // else
    return Math.cos(angle) * pixelAmplitude;
  },

  adjustAngleForPolarChart: function(angle, toDegrees) {
    //add 180 deg to offset chart 0 being on top
    var offset = toDegrees ? 180 : Math.PI;

    if((!this.counterClockwise && !toDegrees) ||
        (this.counterClockwise && toDegrees)) {
      angle *= -1;
    }

    //convert to appropriate unit and
    if(this.useDegrees) {
      if(toDegrees) {
        return angle + offset;
      } else {
        return angle / 360 * 2 * Math.PI + offset;
      }
    } else {
      if(toDegrees) {
        return angle / (2 * Math.PI) * 360 + offset;
      } else {
        return angle + offset;
      }
    }
  }
};


/*
    Name:
    PxVisBehaviorD3.scatterMarkers

    Description:
    Polymer behavior that provides the definition for scatter markers

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.scatterMarkers
*/
PxVisBehaviorD3.scatterMarkers = {
  properties: {
    /**
     * Maps dev input marker string to d3 symbols.
     *
     * To add additional, custom icons, provide a draw function wrapped in an object and draw your shape using canvas drawing methods. See 'bar' or 'x' as examples
     */
    markerMapping: {
      type: Object,
      readOnly: true,
      value: {
        'circle': Px.d3.symbolCircle,
        'cross': Px.d3.symbolCross,
        'diamond': Px.d3.symbolDiamond,
        'square': Px.d3.symbolSquare,
        'triangle-up': Px.d3.symbolTriangle,
        'star': Px.d3.symbolStar,
        'wye': Px.d3.symbolWye,
        'bar': {
          draw: function(context, size) {
            var w = Math.sqrt(size),
                t = w/4;
            context.rect(-w, -t, w, t);
          }
        },
        'caret': {
          draw: function(context, size) {
            var sqrt3 = Math.sqrt(3),
                y = -Math.sqrt(size / (sqrt3 * 3));
            context.moveTo(0, y * 2);
            context.lineTo(-sqrt3 * y, -y);
            // context.lineTo(-sqrt3 * y + 1, -y);
            context.lineTo(0, y * 2);
            // context.lineTo(sqrt3 * y - 1, -y);
            context.lineTo(sqrt3 * y, -y);
            context.closePath();
          }
        },
        'thin-bar': {
          draw: function(context, size) {
            var w = Math.sqrt(size),
                t = w/16;
            context.rect(-w, -t, w, t);
          }
        },
        'thick-bar': {
          draw: function(context, size) {
            var w = Math.sqrt(size),
                t = w/2;
            context.rect(-w, -t, w, t);
          }
        },
        'x': {
          draw: function(context, size) {
            var t = 0.5,
                c = 0.01,
                l = Math.sqrt(size) / 2;
            context.moveTo(0, -c);
            context.lineTo(l - t, -l + t);
            context.lineTo(l + t, -l - t);
            context.lineTo(c, 0);
            context.lineTo(l + t, l + t);
            context.lineTo(l - t, l - t);
            context.lineTo(0, c);
            context.lineTo(-l + t, l - t);
            context.lineTo(-l - t, l + t);
            context.lineTo(-c, 0);
            context.lineTo(-l - t, -l - t);
            context.lineTo(-l + t, -l + t);
            context.closePath();
          }
        },
        'ring': {
          draw: function(context, size) {
            var t = Math.sqrt(size) / 16,
              r = Math.sqrt(size / Math.PI);
            context.moveTo(r, 0);
            context.arc(0, 0, r, 0, 2 * Math.PI);
            context.moveTo(r - t, 0);
            context.arc(0, 0, r - t, 0, 2 * Math.PI, true);
            context.closePath();
          }
        },
        'kite': {
          draw: function(context, size) {
            var w = Math.sqrt(size);
            context.moveTo(0, w);
            context.lineTo(w, -w/2);
            context.lineTo(0, -w);
            context.lineTo(-w, -w/2);
            context.closePath();
          }
        },
        'scalene': {
          draw: function(context, size) {
            var w = Math.sqrt(size);
            context.moveTo(w, 0);
            context.lineTo(w, -w);
            context.lineTo(-w, w/2);
            context.closePath();
          }
        }
      }
    },
    /**
     * The symbol used for the marker. Supported symbols:
     * - 'circle'
     * - 'cross'
     * - 'diamond'
     * - 'square'
     * - 'triangle-up'
     * - 'star'
     * - 'wye'
     * more info at https://github.com/d3/d3-shape/blob/master/README.md#symbols
     * This property will be read from the completeSeriesConfig
     *
     * Some additional "custom" types are also available:
     * - 'bar'
     * - 'thin-bar'
     * - 'thick-bar'
     * - 'x'
     */
    markerSymbol: {
      type: String
    },
    /**
     * Scales the size of the scatter marker
     * This property will be read from the completeSeriesConfig
     */
    markerScale: {
      type: Number
    },
    /**
     * the size of the markers
     * This property will be read from the completeSeriesConfig
     */
    markerSize: {
      type: Number
    },
    /**
     * The opacity of the fill (inside) of the marker
     * This property will be read from the completeSeriesConfig
     */
    markerFillOpacity: {
      type: Number
    },
    /**
     * The opacity of the stroke (outside) of the marker
     * This property will be read from the completeSeriesConfig
     */
    markerStrokeOpacity: {
      type: Number
    },
    /**
     * the opacity value of the fill to be used when muting a serie (stroke is not drawn on mute)
     * This property will be read from the completeSeriesConfig
     */
    mutedOpacity: {
      type: Number
    },
  }
};

/*
    Name:
    PxVisBehaviorD3.icons

    Description:
    Polymer behavior that provides the mechanism to get icons

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.icons
*/
PxVisBehaviorD3.icons = {
  properties: {
    /**
      * @type {!Polymer.IronMeta}
      */
    _meta: {
      value: Base.create('iron-meta', {type: 'iconset'})
    },

    _iconSize: {
      type: Number,
      value: 16
    },

    _iconScale: {
      type: Number,
      value: 16
    },
    /*
      A list of methods that should be called in order to load the icon, position it, etc
    */
    _iconCallbackQueue: {
      type: Array,
      value: function() { return []; }
    },
    _debugIconWarning: {
      type: Boolean,
      value: false
    },
    _iconsLoadedBound: Function,

  },

  ready: function() {
    this._iconsLoadedBound = this._iconsLoaded.bind(this);
  },

  _iconsLoaded: function() {
    window.removeEventListener('iron-iconset-added', this._iconsLoadedBound);
    console.warn("New iconset loaded. Trying again.");

    this._iconCallbackQueue.forEach(function(cb) {
      cb.bind(this)();
    }.bind(this));
  },

  _waitForIconsLoaded: function() {
    // iron-iconset fires this event on the window when loaded
    window.addEventListener('iron-iconset-added',this._iconsLoadedBound);
  },

  _getPxIcon: function(iconName, targetSize, defaultKey, defaultName) {
    const split = iconName.split(':');
    let key = split[0] && split[1] ? split[0] : defaultKey,
        name = split[0] && split[1] ? split[1] : defaultName,
        iconSet = this._meta.byKey(key),
        icon;

    if(!iconSet) {
      console.warn(`Cant find set named: ${key}. Waiting for set to load...`);
      this._debugIconWarning = true;
      this._waitForIconsLoaded();
      return null;
    }

    if(this._debugIconWarning) {
      this._debugIconWarning = false;
      console.warn(`Set ${key} successfully loaded`);
    }

    icon = dom(iconSet).querySelector(`[id="${name}"]`);

    if(!icon) {
      console.warn(`Cant find icon named: ${name}`);
      icon = dom(iconSet).querySelector(`[id="${defaultName}"]`);
    }

    this._iconSize = iconSet.size;
    const iconScale = this._calcIconScale(this._iconSize, targetSize);
    const copy = icon.cloneNode(true);

    return {
      icon: copy,
      size: iconSet.size,
      scale: iconScale
    };
  },

  _calcIconScale: function(size, targetSize) {
    return targetSize / size;
  }
};

/*
    Name:
    PxVisBehaviorD3.cursorIcon

    Description:
    Polymer behavior that provides the mechanism to draw cursor icons

    Dependencies:
    - D3.js

    @polymerBehavior PxVisBehaviorD3.cursorIcon
*/
PxVisBehaviorD3.cursorIcon = [{

  ready: function() {
    this._iconCallbackQueue = [this._drawCursorIcon];
  },

  _drawCursorIcon: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }
    if(!this.iconType || this.iconType === 'none') {
      return;
    }

    if(this._doesD3HaveValues(this._icon)) {
      this._icon.remove();
    }

    var icon = this._getPxIcon(this.iconType, 12, 'px-utl', 'information');

    if(!icon) {
      return;
    }

    this._iconSize = icon.size;
    this._iconScale = icon.scale;

    this._icon = Px.d3.select(this._cursorGroup.node().appendChild(icon.icon))
      .attr('fill', 'transparent')
      .attr('stroke', this._checkThemeVariable("--px-vis-cursor-line-color", 'rgb(0,0,0)'))
      .attr('pointer-events', 'none');
  },

  _positionCursorIcon: function(mousePos) {
    var x = mousePos[0] + 5, //such magic, so wow
        y = mousePos[1] - this._iconSize,
        t = "translate(" + x + "," + y + ")",
        s = " scale(" + this._iconScale + ")";

    this._icon
      .attr("transform", (t + s));
  }

}, PxVisBehavior.observerCheck, PxVisBehaviorD3.icons];


/*
  Name:
  PxVisBehaviorD3.scatterArrow

  Description:
  Polymer behavior that provides the properties for the arrow option on scatter.

  Dependencies:
  - D3.js

  @polymerBehavior PxVisBehaviorD3.scatterArrow
*/
PxVisBehaviorD3.scatterArrow = {
  properties: {
    /*
    * Boolean to indicate if arrows should be drawn
    */
    showArrows: {
      type: Boolean,
      value: false
    },
    /*
    * Configuration options for the arrow
    * - `symbol`: the symbol name from `markerMapping`. Default: `caret
    * - `size`: the size of the symbol.
    * - `scale`: the scale of the symbol (another way to size). Default: 1
    * - `minLength`: the minimum segment length between points which should get an arrow. Lengths below this min value will not get an arrow. Default: 10
    *
    */
    arrowConfig: {
      type: Boolean,
      value: function() {
        return {
          symbol: 'caret',
          size: 24,
          scale: 1,
          minLength: 10
        }
      }
    }
  }
};