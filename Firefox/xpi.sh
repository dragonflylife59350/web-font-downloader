#!/bin/bash
zip fontsdownloader-svn.xpi \
		content/overlay.xul \
		content/configure.xul \
		content/fontpreview.xul \
		content/fontsdownloader.js \
		content/utils.js \
		defaults/preferences/webfontdownloader.js \
		skin/fontpreview.css \
		install.rdf \
		LICENSE.TXT \
		chrome.manifest

