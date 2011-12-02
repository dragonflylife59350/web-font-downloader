//var webfonts = require("webfonts");
//webfonts.get_families(document);

function get_fontface_rules (document){
  var ffrules = [];
  for (var ss in document.styleSheets){
    var sheet = document.styleSheets[ss];
    try{
      var rules = sheet.cssRules;
    } catch(err){/*ignore*/}
    var css_path = sheet.href;

    for (var r in rules){
      var rule = rules[r];
      if (rule.type == 5){ //FONT_FACE_RULE
        if (!css_path){
          css_path = new String(document.location);
			  }
        css_path = css_path.split("/");
        css_path.pop()
        css_path = css_path.join("/") + "/";

        ffrules.push([css_path, rule]);
      } 
    }
  }

  return ffrules;
}

function get_families (document){
  var families = [];
  var ffrules = get_fontface_rules(document);
  for (var r in ffrules){
    var css_path = ffrules[r][0];
    var rule = ffrules[r][1];
    var fontfamily = rule.style.getPropertyValue("font-family").split("\"")[1];
    if (fontfamily)
      families.push(fontfamily);
    }

  return families;
}

function get_fontface_data (document){
  var data = [];
  var ffrules = get_fontface_rules(document);
  for (var r in ffrules){
    var css_path = ffrules[r][0];
    var rule = ffrules[r][1];
    var fontfamily = rule.style.getPropertyValue("font-family").split("\"")[1];
    var src = rule.style.getPropertyValue("src");

    alert(src);
    alert(src.url);
    alert(src.split("url")[1]);

    data.push({"fontfamily": fontfamily, "src":src, "css_path": css_path})
  }
  return data;
}

postMessage(get_fontface_data(document));  

