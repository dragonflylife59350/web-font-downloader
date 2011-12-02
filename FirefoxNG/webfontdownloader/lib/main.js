// Import the APIs we need.
var data = require("self").data
var contextMenu = require("context-menu");
var panel = require("panel");
var pageMod = require("page-mod");
 
var webfontsPanel = require("panel").Panel({
  width:215,
  height:160,
  contentURL: data.url("webfonts-panel.html")
});
 
require("widget").Widget({
  id: "open-webfont-menu-btn",
  label: "WebFontDownloader",
  contentURL: data.url("webfontdownloader-16x16.png"),
  panel: webfontsPanel
});
 
pageMod.PageMod({
  include: "*",
  contentScriptWhen: 'end',
  contentScriptFile: data.url("detect-webfonts.js"),
  onAttach: function onAttach(worker) {
    worker.on('message', function(data) {
      for (var i in data){
        var ff = data[1];
        console.log("fontfamily: " + ff["fontfamily"]);
        console.log("src: " + ff["src"]);
        console.log("css_path: " + ff["css_path"]);
      }
    });
  }
});

exports.main = function(options, callbacks) {
  console.log(options.loadReason);
 
  // Create a new context menu item.
  var menuItem = contextMenu.Item({
    label: "Download this webfont",
    // Show this item when a selection exists.
    context: contextMenu.SelectionContext(),
    // When this item is clicked, post a message back with the selection
    contentScript: 'self.on("click", function () {' +
                   '  var text = window.getSelection().toString();' +
                   '  self.postMessage(text);' +
                   '});',
    // When we receive a message, look up the item
    onMessage: function (item) {
      console.log('looking up "' + item + '"');
      lookup(item);
    }
  });
};
 
function lookup(item) {
  wikipanel = panel.Panel({
    width: 240,
    height: 320,
    contentURL: "http://en.wikipedia.org/w/index.php?title=" +
                item + "&useformat=mobile"
  });
  wikipanel.show();
}
