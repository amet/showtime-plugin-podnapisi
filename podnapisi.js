/*
 *  podnapisi plugin
 *
 *  Copyright (C) 2015 amet
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var XML = require('showtime/xml');

var langTranslate = {

    "alb":"29",
    "ara":"12",
    "arm":"0",
    "bos":"10",
    "bul":"33",
    "cat":"53",
    "chi":"17",
    "hrv":"38",
    "cze":"7",
    "dan":"24",
    "dut":"23",
    "eng":"2",
    "est":"20",
    "per":"52",
    "fin":"31",
    "fre":"8",
    "ger":"5",
    "ell":"16",
    "heb":"22",
    "hin":"42",
    "hun":"15",
    "ice":"6",
    "ind":"0",
    "ita":"9",
    "jpn":"11",
    "kor":"4",
    "lav":"21",
    "lit":"0",
    "mac":"35",
    "may":"0",    
    "nor":"3",
    "pol":"26",
    "por":"32",
    "pob":"48",
    "rum":"13",
    "rus":"27",
    "scc":"36",
    "slo":"37",
    "slv":"1",
    "spa":"28",
    "swe":"25",
    "tha":"0",
    "tur":"30",
    "ukr":"46",
    "vie":"51",
    "bos":"10",
    "per":"52",
    "ser":"36"
};

(function(plugin) {

  var APIURL       = "http://beta.podnapisi.net/ppodnapisi/search?tbsl=1&sK={0}&sJ={1}&sY={2}&sTS={3}&sTE={4}&sMH={5}&sXML=1&lang=0";
  var DOWNLOAD_URL = "http://beta.podnapisi.net/subtitles/{0}/download";
  var myXML        = "";

  String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
  };

  function trace(str) {
    showtime.trace(str, 'podnapisi');
  }

  function downloadXML(url) {
    var v = showtime.httpReq(unescape(url));
    return XML.parse(v);
  }

  plugin.addSubtitleProvider(function(req) {

    var lang = [];
    var languages = showtime.getSubtitleLanguages();
    for(var l = 0; l < languages.length; l++) {
      lang.push(langTranslate[languages[l]]);
      break; // break here for one language, API issue on podnapisi
    }

    season  = "";
    episode = "";
    year    = "";

    if(req.season > 0 && req.episode > 0) {
      season = req.season;
      episode = req.episode;
    }

    trace('year: ' + req.year);
    if (req.year > 0) {
      year = req.year;
    }

    var url = APIURL.format(req.title,lang.join(','),year,season,episode,req.opensubhash);

    trace(url);
    trace(req.opensubhash);
    myXML = downloadXML(url);

    var subs = myXML.results.filterNodes('subtitle');
    for(var i = 0; i < subs.length; i++) {
      var sub = subs[i];
      var score = 0;
      var hash = "Not Matched";

      if (sub.exactHashes == req.opensubhash || sub.exactHashes == "osh:" + req.opensubhash) {
        hash = "Hash Matched";
        score++; // matches by file hash is better        
      }

      req.addSubtitle(DOWNLOAD_URL.format(subs[i].pid),
                      sub.title,
                      sub.languageName,
                      sub.format,
                      'podnapisi (' + hash + ')',
                      score);
    }
  });

})(this);
