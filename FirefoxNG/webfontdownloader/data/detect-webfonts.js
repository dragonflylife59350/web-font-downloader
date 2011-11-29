var families = [];
for (var ss in document.styleSheets){
  var sheet = document.styleSheets[ss];
  try{
    var rules = sheet.cssRules;
  } catch(err){/*ignore*/}
  var css_path = sheet.href;

  for (var r in rules){
    var rule = rules[r];
    if (rule.type == 5){ //FONT_FACE_RULE
      alert(rule);
      alert(rule.cssText);
      alert(rule.style);

      if (!css_path){
        css_path = new String(document.location);
			}
      css_path = css_path.split("/");
      css_path.pop()
      css_path = css_path.join("/") + "/";

      var fontfamily = rule.style.getPropertyValue("font-family").split("\"")[1];
      if (fontfamily)
        families.push(fontfamily);
    }
  }
}

alert(families);

/*
          var _src = rule.style.getPropertyValue("src");
          var url = undefined;
          var format = undefined;

					let srcs = _src.split(",");
					for (s in srcs){
						let src = srcs[s];
		        try{
		          format = src.split("format(\"")[1].split("\"")[0];
		        } catch(err){}

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
                "from_page": doc.location,
                "unique_id": "webfontdownloader_"+(unique_counter++)
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
            } catch(err){}
          }
        }
      }
    }
  },
}
*/

