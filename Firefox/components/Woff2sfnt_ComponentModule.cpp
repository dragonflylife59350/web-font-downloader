#include "nsIGenericFactory.h"
#include "Woff2sfnt.h"

NS_GENERIC_FACTORY_CONSTRUCTOR(Woff2sfnt)

static nsModuleComponentInfo components[] =
{
    {
       MY_COMPONENT_CLASSNAME, 
       MY_COMPONENT_CID,
       MY_COMPONENT_CONTRACTID,
       Woff2sfntConstructor,
    }
};

NS_IMPL_NSGETMODULE("Woff2sfntsComponentModule", components)

