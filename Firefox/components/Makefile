CXX   = c++
CPPFLAGS +=     -fno-rtti              \
		-fno-exceptions        \
		-shared  
 
# Change this to point at your Gecko SDK directory. 
#GECKO_SDK_PATH = /usr/lib/xulrunner-devel-1.9.2.9
#XPIDL = ../../../xulrunner-sdk/sdk/bin/xpidl
#IDL_DIR = $(GECKO_SDK_PATH)/idl/

GECKO_SDK_PATH = ../../../xulrunner-sdk
XPIDL = $(GECKO_SDK_PATH)/sdk/bin/xpidl
IDL_DIR = $(GECKO_SDK_PATH)/idl/
 
# GCC only define which allows us to not have to #include mozilla-config 
# in every .cpp file.  If your not using GCC remove this line and add 
# #include "mozilla-config.h" to each of your .cpp files. 
GECKO_CONFIG_INCLUDE = -include xpcom-config.h 

#GECKO_DEFINES  = -DXPCOM_GLUE_USE_NSPR
GECKO_DEFINES  = -DXPCOM_GLUE

GECKO_INCLUDES = -I $(GECKO_SDK_PATH)/include 

#GECKO_LDFLAGS =  -L $(GECKO_SDK_PATH)/lib -lxpcomglue_s -lnspr4 -lplds4
GECKO_LDFLAGS = -L $(GECKO_SDK_PATH)/lib -L $(GECKO_SDK_PATH)/bin -Wl,-rpath-link,$(GECKO_SDK_PATH)/bin -lxpcomglue_s -lxpcom -lnspr4

FILES = Woff2sfnt.cpp Woff2sfnt_ComponentModule.cpp 

TARGET = Woff2sfnt.so

build:
	$(XPIDL) -m header -I $(IDL_DIR) IWoff2sfnt.idl
	$(XPIDL) -m typelib -I $(IDL_DIR) IWoff2sfnt.idl
	$(CXX) -Os -o $(TARGET) $(GECKO_CONFIG_INCLUDE) $(GECKO_DEFINES) $(GECKO_INCLUDES) $(GECKO_LDFLAGS) $(CPPFLAGS) $(CXXFLAGS) $(FILES)
	chmod +x $(TARGET)
	strip $(TARGET)
 
clean: 
	rm $(TARGET)
