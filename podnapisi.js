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

(function(plugin) {

  var APIURL = "http://beta.podnapisi.net/ppodnapisi/search?tbsl=1&sK={0}&sJ={1}&sY={2}&sTS={3}&sTE={4}&sMH={5}&sXML=1&lang=0";
  var XML = require('showtime/xml');
  var myXML = "";

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

    var testURL = "http://www.podnapisi.net/ppodnapisi/search?tbsl=1&sK=Everly&sJ=2,36&sY=2014&sTS=&sTE=&sMH=9193fa582c8ba47f,sublight:020000b25c675a26b71e868aebc2f37d8ebb8ed0,sublight:375d5fc33ca4eb9d576683ec785119eb&sXML=1&lang=0";
    var v = showtime.httpReq(unescape(testURL)).toString();
    var out = v.replace(/\<\!DOCTYPE[^\>\[]+(\[[^\]]+)+[^>]+\>/g, '');
    trace(out);
    myXML = XML.parse(out);

    for(i in myXML.subtitle) {
     print(v + " = " + myXML.subtitle[i]);
    }
    // var items = XML.('subtitle');

    trace(myXML.results.subtitle);

  }



  plugin.addSubtitleProvider(function(req) {

    var queries = [];

    // Get list of user preferred languages for subs
    var lang = showtime.getSubtitleLanguages().join(',');


    season  = "";
    episode = "";
    year    = "";

    if(req.season > 0 && req.episode > 0) {
      season = req.season;
      episode = req.episode;
    }

    if (req.year > 0) {
    year = req.year;
    }

    lang = 2; // testing only
    var url = APIURL.format(req.title,lang,year,season,episode,req.opensubhash);

    trace(url);
    downloadXML(url);
    trace(myXML);

 //    // Build a opensubtitle query based on request from Showtime

 //    if(req.filesize > 0 && req.opensubhash !== undefined) {
 //      queries.push({
	// sublanguageid: lang,
	// moviehash: req.opensubhash,
	// moviebytesize: req.filesize.toString()
 //      });
 //    }
      
 //    if(req.imdb && req.imdb.indexOf('tt') == 0) {
 //      queries.push({
	// sublanguageid: lang,
	// imdbid: req.imdb.substring(2)
 //      });
 //    } else if(req.title) {
 //      var q = {
	// sublanguageid: lang,
	// query: req.title
 //      };

 //      if(req.season > 0 && req.episode > 0) {
	// q.season = req.season;
	// q.episode = req.episode;
 //      }

 //      queries.push(q);
 //    }

 //    // Loop so we can retry once (relogin) if something fails
 //    // This typically happens if the token times out

 //    for(var retry = 0; retry < 2; retry++) {
 //      login(retry);

 //      var r = showtime.xmlrpc(APIURL, "SearchSubtitles", token, queries);
    
 //      if(r[0].status == '200 OK' && typeof(r[0].data == 'object')) {
	// var set = {}; // We can get same subtitle multiple times, so keep track
	// var cnt = 0;
 //        var len = r[0].data.length;
	// for(var i = 0; i < len; i++) {

	//   var sub = r[0].data[i];
	//   var url = sub.SubDownloadLink;
	//   if(url in set)
	//     continue;

	//   set[url] = true;

	//   var score = 0;
	//   if (sub.MatchedBy == 'moviehash') 
	//     score++; // matches by file hash is better
	  
	//   req.addSubtitle(url, sub.SubFileName, sub.SubLanguageID,
	// 		  sub.SubFormat,
	// 		  'podnapisi (' + sub.MatchedBy + ')',
	// 		  score);
	//   cnt++;
	// }
 //      	trace('Added ' + cnt + ' subtitles');

	// return;
 //      } else {
 //      	trace('Query failed: ' + r[0].status);
 //      }
 //    }
  });

})(this);
