/* ***** BEGIN LICENSE BLOCK *****
 *  Web Font Downloader, a Firefox Extension for downloading libre web fonts
 *  Copyright (C) 2011 Felipe C. da S. Sanches <juca@members.fsf.org>
 *  Copyright (C) 2011 Understanding Limited <dave@understandingfonts.com>
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

function ask_download(variants){
  let info = variants[0];
  let reply = confirm("This will copy " + info.fontfamily + " to your Downloads directory.\n\nPlease inspect the font to ensure it is free software or you are otherwise legally permitted to use this font on your computer. If it is not free software you may not be permitted to do so without a proprietary software license.");
  if (reply){
    for (let v in variants){
      FontsDownloader.download_it(variants[v])
    }
  }
}

function add_fontface_rule(info){
	//preview the webfont in the fonts list menuitem
	const HTML_NS = "http://www.w3.org/1999/xhtml";
	var sheet = document.createElementNS(HTML_NS, "style");
	sheet.innerHTML = '@font-face {\n\tfont-family: "'+info.fontfamily+'";\n\tsrc: url("'+info.url+'") format("'+info.format+'");\n}\n\n';

  var statusbar = document.getElementById("status-bar");  
  if(statusbar && statusbar.parentNode){
		statusbar.parentNode.appendChild(sheet);
	}
}

function FontMenuItem(info, downloader){
	let listfonts = document.getElementById("listfonts_contextmenu");
	listfonts.hidden = false;

	var nofonts = document.getElementById("nowebfonts");
	if (nofonts)
		nofonts.parentNode.removeChild(nofonts);

  const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
  var item = document.createElementNS(XUL_NS, "menuitem");
	item.addEventListener("click", function(){ ask_download(detected_fonts[info.fontfamily.toLowerCase()]); }, false);

  item.setAttribute("label", info.fontfamily+" AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz");
	item.setAttribute("style", "font-family: \""+info.fontfamily+"\";");

	//alert("sheet.innerHTML:\n"+sheet.innerHTML+"\ninfo.fontfamily:\n"+info.fontfamily);

  return item;
}

var detected_fonts = {};
function OpenFontSelector(){
	var w = window.open("chrome://fontsdownloader/content/fontselector.xul", "Web Font Downloader", "chrome,width=720,height=720");
	w.detected_fonts = detected_fonts;
  w.FontsDownloader = FontsDownloader;
}

function WebFontsShowHideItems(event){
	let thiswebfont = document.getElementById("thiswebfont_contextmenu");
	let style = window.getComputedStyle(document.popupNode, null);
	let families = style.getPropertyValue("font-family").split(",");

	for (let f in families){
		let variants = detected_fonts[families[f].toLowerCase()];
		if (variants && variants.length>0){
			thiswebfont.onclick = function(){ ask_download(variants); };
			thiswebfont.hidden = false;
			return;
		}
	}
	thiswebfont.hidden = true;
}

var FontsDownloader = {
  init : function () {
		Components.utils.import("resource://gre/modules/ctypes.jsm")

    var appcontent = document.getElementById("appcontent");   // browser  
    if(appcontent)  
      appcontent.addEventListener("DOMContentLoaded", FontsDownloader.onPageLoad, true);

      FontsDownloader.create_fonts_dir();
      document.getElementById("listfonts").addEventListener("click", OpenFontSelector, false);
      document.getElementById("listfonts_contextmenu").addEventListener("click", OpenFontSelector, false);

			var contextMenu = document.getElementById("contentAreaContextMenu");
			if (contextMenu)
    		contextMenu.addEventListener("popupshowing", WebFontsShowHideItems, false);
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

  suffix_for_format: function (f) {
    switch(f){
      case "woff": return "woff";
      case "truetype":
      case "truetype-aat": return "ttf";
      case "opentype": return "otf";
      case "embedded-opentype": return "eot";
      case "svg": return "svg";
      default:
        return "webfont";
    }
  },

  guess_format_from_url: function (url) {
		if (url.indexOf(".woff")>=0) return "woff";
		if (url.indexOf(".ttf")>=0) return "truetype";
		if (url.indexOf(".otf")>=0) return "opentype";
		if (url.indexOf(".eot")>=0) return "embedded-opentype";
		if (url.indexOf(".svg")>=0) return "svg";
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

          var _src = rule.style.getPropertyValue("src");
          var url;
          var format;

					let srcs = _src.split(",");
					for (s in srcs){
						let src = srcs[s];
		        try{
		          format = src.split("format(\"")[1].split("\"")[0];
		        } catch(err){/*ignore*/}

		        try{
		          url = src.split("url(\"")[1].split("\"")[0];
							if (url.indexOf("base64")<0 && url.indexOf("http://")<0){
								url = css_path + url;
							}
		        } catch(err){continue;}

		        try{
							if (!format) format = FontsDownloader.guess_format_from_url(url)

              let filename = "";
              let original_filename = url;
              if (url.indexOf("/")>=0){
                original_filename = url.split("/");
                original_filename = original_filename[original_filename.length-1];
              }

              if (fontfamily.toLowerCase().indexOf(original_filename.toLowerCase())<0)
                filename += fontfamily + "_";

							filename += original_filename;

              if (original_filename.indexOf(FontsDownloader.suffix_for_format(format))<0)
                filename += "." + FontsDownloader.suffix_for_format(format);

							//do we need to sanitize the filename?
		          //filename = filename.replace( new RegExp( " ", "g" ), "_" )

							var font_info = {
								"url": url,
								"format": format,
                "format_suffix": FontsDownloader.suffix_for_format(format),
								"fontfamily": fontfamily,
                "filename": filename,
                "from_page": doc.location
							};

              add_fontface_rule(font_info);

							if (!detected_fonts[fontfamily.toLowerCase()]){
								detected_fonts[fontfamily.toLowerCase()] = new Array();
								var fmi = FontMenuItem(font_info, FontsDownloader);
								var bottom = document.getElementById("bottom_of_fonts_list");
								bottom.parentNode.insertBefore(fmi, bottom);
              }

              let variants = detected_fonts[fontfamily.toLowerCase()];
              let found = false;
							let i;
              for (i in variants){
                if (variants[i]==font_info){
                  found = true;
                  break;
                }
              }
              if (!found){
                variants.push(font_info);
							}
            } catch(err){/*ignore*/}
          }
        }
      }
    }
  },
}

window.addEventListener("load", function() { FontsDownloader.init(); }, false);
