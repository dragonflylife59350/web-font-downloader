function getDownloadsDir(){
  var dirService = Components.classes["@mozilla.org/file/directory_service;1"].
                  getService(Components.interfaces.nsIProperties);
  var fontsDirFile = dirService.get("Home", Components.interfaces.nsIFile);
  fontsDirFile.append("Downloads");
  return fontsDirFile.path;
}

function getPref(prefname, default_method){
  var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                              .getService(Components.interfaces.nsIPrefBranch);
  var pref = prefManager.getCharPref("extensions.webfontdownloader."+prefname);
  if (pref=="")
    pref = default_method();
  return pref;
}

function setPref(prefname, value){
    var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                                    .getService(Components.interfaces.nsIPrefBranch);
    return prefManager.setCharPref("extensions.webfontdownloader."+prefname, value); 
}

