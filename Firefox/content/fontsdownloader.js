/* ***** BEGIN LICENSE BLOCK *****
 *  Web Font Downloader, a Firefox Extension for downloading libre web fonts
 *  Copyright (C) 2010 Felipe C. da S. Sanches <jucablues@users.sourceforge.net>
 *  Copyright (C) 2010 Understanding Limited <dave@understandingfonts.com>
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
 *
 * ***** END LICENSE BLOCK ***** */

function ask_download(info){
  var reply = confirm("This will copy " + info.fontfamily + " to your fonts directory.\n\nPlease inspect the font to ensure it is free software or you are otherwise legally permitted to use this font on your computer. If it is not free software you may not be permitted to do so without paying for a license.");
  if (reply){
    FontsDownloader.download_it(info)
  }
}

function FontMenuItem(info, downloader){
	var nofonts = document.getElementById("nowebfonts");
	if (nofonts)
		nofonts.parentNode.removeChild(nofonts);

	//preview the webfont in the fonts list menuitem
	const HTML_NS = "http://www.w3.org/1999/xhtml";
	var sheet = document.createElementNS(HTML_NS, "style");
	sheet.innerHTML = '@font-face {\n\tfont-family: "'+info.fontfamily+'";\n\tsrc: url("'+info.url+'") format("'+info.format+'");\n}\n\n';

  var statusbar = document.getElementById("status-bar");  
  if(statusbar && statusbar.parentNode){
		statusbar.parentNode.appendChild(sheet);
	}

  const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
  var item = document.createElementNS(XUL_NS, "menuitem");
	item.addEventListener("click", function(){ ask_download(info); }, false);

  item.setAttribute("label", info.fontfamily+" AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz");
	item.setAttribute("style", "font-family: \""+info.fontfamily+"\";");

	//alert("sheet.innerHTML:\n"+sheet.innerHTML+"\ninfo.fontfamily:\n"+info.fontfamily);

  return item;
}

var detected_fonts = {};
var FontsDownloader = {
  init : function () {
		Components.utils.import("resource://gre/modules/ctypes.jsm")

    var appcontent = document.getElementById("appcontent");   // browser  
    if(appcontent)  
      appcontent.addEventListener("DOMContentLoaded", FontsDownloader.onPageLoad, true);

      FontsDownloader.create_fonts_dir();
      document.getElementById("listfonts").addEventListener("click", function(){ var w = window.open("chrome://fontsdownloader/content/fontselector.xul", "Web Font Downloader", "chrome,width=720,height=720"); w.detected_fonts = detected_fonts; }, false);
  },

  create_fonts_dir : function (){
  /* TODO: fix-me!
    var dirService = Components.classes["@mozilla.org/file/directory_service;1"].
                      getService(Components.interfaces.nsIProperties);
    var fontsDirFile = dirService.get("Home", Components.interfaces.nsIFile);
    fontsDirFile.append(this.FONTS_DIR);

    if( !fontsDirFile.exists() || !fontsDirFile.isDirectory() ) {
        // if it doesn't exist, create
      //alert("Creating fonts directory: "+fontsDirFile.path);
      fontsDirFile.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);  
    }
    */
  },

  download_it: function (font_info) {
    var file = Components.classes["@mozilla.org/file/local;1"]  
            .createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(getPref("installfolder", getDownloadsDir) + "/" + font_info.filename);

    var wbp = Components.classes['@mozilla.org/embedding/browser/nsWebBrowserPersist;1']  
          .createInstance(Components.interfaces.nsIWebBrowserPersist);  
    var ios = Components.classes['@mozilla.org/network/io-service;1']  
          .getService(Components.interfaces.nsIIOService);  
    var uri = ios.newURI(font_info.url, null, null);  
    wbp.persistFlags &= ~Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_NO_CONVERSION; // don't save gzipped  
    wbp.saveURI(uri, null, null, null, null, file);
  },

  onPageLoad: function (aEvent) {
    var doc = aEvent.originalTarget;	

    for (var ss in doc.styleSheets){
      var rules = doc.styleSheets[ss].cssRules;
      var css_path = doc.styleSheets[ss].href;

      for (var r in rules){
        var rule = rules[r];
        if (rule instanceof CSSFontFaceRule){
          if (!css_path){
            css_path = new String(doc.location);
					}
          css_path = css_path.split("/");
          css_path.pop()
          css_path = css_path.join("/") + "/";

          var fontfamily = rule.style.getPropertyValue("font-family").split("\"")[1];
          var src = rule.style.getPropertyValue("src");
          var url;
          var format;

          try{
            format = src.split("format(\"")[1].split("\"")[0];
          } catch(err){/*ignore*/}

          try{
            url = src.split("url(\"")[1].split("\"")[0];
						if (url.indexOf("base64")<0){
							url = css_path + url;
						}
          } catch(err){/*ignore*/}

          try{
						var filename = fontfamily;
            //filename = filename.replace( new RegExp( " ", "g" ), "_" )  //do we need to sanitize?
            //filename += "." + FONT_FORMAT_EXTENSION;

						var font_info = {
							"url": url,
							"filename": filename,
							"format": format,
							"fontfamily": fontfamily
						};

						if (!font_info.format){
							if (url.indexOf(".woff")>=0) font_info.format = "woff";
							if (url.indexOf(".ttf")>=0) font_info.format = "truetype";
							if (url.indexOf(".otf")>=0) font_info.format = "opentype";
							if (url.indexOf(".eot")>=0) font_info.format = "embedded-opentype";
							if (url.indexOf(".svg")>=0) font_info.format = "svg";
						}

						if (!detected_fonts[[fontfamily, format]]){
							detected_fonts[[fontfamily, format]] = font_info;
							var fmi = FontMenuItem(font_info, FontsDownloader);
							var bottom = document.getElementById("bottom_of_fonts_list");
							bottom.parentNode.insertBefore(fmi, bottom);
						}
          } catch(err){/*ignore*/}
        } 
      }
    }
  },
}

window.addEventListener("load", function() { FontsDownloader.init(); }, false);
