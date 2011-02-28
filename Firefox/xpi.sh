#!/bin/bash
zip web-font-downloader-devel.xpi \
		content/overlay.xul \
		content/configure.xul \
		content/fontpreview.xul \
		content/fontselector.xul \
		content/fontsdownloader.js \
		content/utils.js \
		defaults/preferences/webfontdownloader.js \
		skin/fontpreview.css \
		skin/fontselector.css \
		skin/statusbarOverlay.css \
		skin/font-icon.png \
		skin/webfontdownloader-16x16.png \
		skin/webfontdownloader-16x16-unchecked.png \
		skin/webfontdownloader-32x32.png \
		skin/webfontdownloader-16x16.svg \
		skin/webfontdownloader-16x16-unchecked.svg \
		skin/webfontdownloader-32x32.svg \
		icon.png \
		install.rdf \
		LICENSE.TXT \
		chrome.manifest

