#ifndef _WOFF2SFNT_H_
#define _WOFF2SFNT_H_

#include "IWoff2sfnt.h"

#define MY_COMPONENT_CONTRACTID "@fontsdownloader.net/woff2sfnt;1"
#define MY_COMPONENT_CLASSNAME "A Simple XPCOM Sample"
#define MY_COMPONENT_CID  { 0x597a60b0, 0x5272, 0x4284, { 0x90, 0xf6, 0xe9, 0x6c, 0x24, 0x2d, 0x74, 0x6 } }

/* Header file */
class Woff2sfnt : public IWoff2sfnt
{
public:
  NS_DECL_ISUPPORTS
  NS_DECL_IWOFF2SFNT

  Woff2sfnt();

private:
  ~Woff2sfnt();

protected:
  /* additional members */
};

#endif //_WOFF2SFNT_H_
