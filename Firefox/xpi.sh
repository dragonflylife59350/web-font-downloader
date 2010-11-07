#!/bin/bash
zip web-font-downloader-svn.xpi \
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
		skin/webfontdownloader-16x16.png \
		skin/webfontdownloader-32x32.png \
		skin/webfontdownloader-16x16.svg \
		skin/webfontdownloader-32x32.svg \
		install.rdf \
		LICENSE.TXT \
		chrome.manifest

