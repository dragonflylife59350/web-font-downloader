#!/bin/bash
zip fontsdownloader-svn.xpi \
		content/overlay.xul \
		content/configure.xul \
		content/fontpreview.xul \
		content/fontselector.xul \
		content/fontsdownloader.js \
		content/utils.js \
		defaults/preferences/webfontdownloader.js \
		skin/fontpreview.css \
		skin/statusbarOverlay.css \
		skin/font-icon.png \
		install.rdf \
		LICENSE.TXT \
		chrome.manifest

