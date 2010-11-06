/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Initial Developer of the Original Code is Felipe C. da S. Sanches.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Felipe C. da S. Sanches <jucablues@users.sourceforge.net>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

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
	item.addEventListener("click", function(){ var w = window.open("chrome://fontsdownloader/content/fontpreview.xul", "configure", "chrome,fullscreen=yes"); w.info = info; w.FontsDownloader = FontsDownloader}, false);


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

						if (!detected_fonts[[fontfamily, format]]){
							detected_fonts[[fontfamily, format]] = font_info;
							var fmi = FontMenuItem(font_info, FontsDownloader);
							var popup = document.getElementById("webfonts-popup");
							popup.appendChild(fmi);
						}

          } catch(err){/*ignore*/}
        } 
      }
    }
  },
}

window.addEventListener("load", function() { FontsDownloader.init(); }, false);
