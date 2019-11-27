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
import 'px-moment-imports/px-moment-imports.js';

var PxVisBehaviorTime = window.PxVisBehaviorTime = (window.PxVisBehaviorTime || {});

/*
    Name:
    PxVisBehaviorTime.datetime

    Description:
    Polymer behavior that provides the momentjs, moment-timezone, and a variety of datetime formating options and methods to px-vis and associated sub components.

    Docs to Momentjs: http://momentjs.com/docs/

    Docs to Moment-Timezone: http://momentjs.com/timezone/

    Dependencies:
    - momentjs
    - moment-timezone

    @polymerBehavior PxVisBehaviorTime.datetime
*/
PxVisBehaviorTime.datetime = {
  properties: {
    /**
     * Defines the format for the first datetime string. The first datetime is shown in normal font weight.
     *
     * Default is the first datetime string is TIME presented as "15:00:00 +0000"
     *
     * For valid string formats, see: http://momentjs.com/docs/#/displaying/
     *
    */
    firstDateTimeFormat: {
      type: String,
      value: 'HH:mm:ss ZZ'
    },
    /**
     * Defines the format for the second datetime string. The second datetime is shown in bold font weight.
     *
     * Default is the second datetime string is DATE presented as "12 Feb 2016"
     *
     * For valid string formats, see: http://momentjs.com/docs/#/displaying/
     *
     * @property secondDateTimeFormat
     * @type string
     * @default DD MMM YYYY
    */
    secondDateTimeFormat:{
      type:String,
      value:'DD MMM YYYY'
    },

    /**
     * Defines a separator character between the two datetime strings.
     *
     * @property separator
     * @type string
     * @default |
    */
    separator:{
      type:String,
      value:'|'
    },
    /**
     * Sets what timezone the event time should display in.
     *
     * Timezone defaults to UTC time. If a valid timezone is specified, then times include daylight savings time if applicable.
     *
     * For a list of valid timezones, see: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
     *
     * For more details on timezones, see: http://momentjs.com/timezone/
     *
     * @property timezone
     * @type String
     * @default utc
     */
    timezone:{
      type:String,
      value:"utc"
    },
  },
  /**
   * Method that takes a datetime string, timezone string, and a formatting string. Returns a formated datetime string.
   *
   * @method formatTimestamp
   * @param {datetime}
   * @param {timezone}
   * @param {format}
   * @return {formatedDatetimeString}
   */
  formatTimestamp: function(datetime,timezone,format){
    if(timezone.toLowerCase() !== 'utc'){
      if(Px.moment.tz.zone(timezone)){
        return Px.moment.tz(datetime, timezone).format(format);
      } else {
        console.warn("(づ｡◕‿‿◕｡)づ Invalid timezone specified; defaulting to UTC");
      }
    }

    return Px.moment.utc(datetime).format(format);
  }
}