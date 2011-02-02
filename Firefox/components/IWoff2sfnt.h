/*
 * DO NOT EDIT.  THIS FILE IS GENERATED FROM IWoff2sfnt.idl
 */

#ifndef __gen_IWoff2sfnt_h__
#define __gen_IWoff2sfnt_h__


#ifndef __gen_nsISupports_h__
#include "nsISupports.h"
#endif

/* For IDL files that don't want to include root IDL files. */
#ifndef NS_NO_VTABLE
#define NS_NO_VTABLE
#endif

/* starting interface:    IWoff2sfnt */
#define IWOFF2SFNT_IID_STR "90758a97-a6f3-4ea4-8953-16bd2ee3a977"

#define IWOFF2SFNT_IID \
  {0x90758a97, 0xa6f3, 0x4ea4, \
    { 0x89, 0x53, 0x16, 0xbd, 0x2e, 0xe3, 0xa9, 0x77 }}

class NS_NO_VTABLE NS_SCRIPTABLE IWoff2sfnt : public nsISupports {
 public: 

  NS_DECLARE_STATIC_IID_ACCESSOR(IWOFF2SFNT_IID)

  /* long Add (in long a, in long b); */
  NS_SCRIPTABLE NS_IMETHOD Add(PRInt32 a, PRInt32 b, PRInt32 *_retval NS_OUTPARAM) = 0;

};

  NS_DEFINE_STATIC_IID_ACCESSOR(IWoff2sfnt, IWOFF2SFNT_IID)

/* Use this macro when declaring classes that implement this interface. */
#define NS_DECL_IWOFF2SFNT \
  NS_SCRIPTABLE NS_IMETHOD Add(PRInt32 a, PRInt32 b, PRInt32 *_retval NS_OUTPARAM); 

/* Use this macro to declare functions that forward the behavior of this interface to another object. */
#define NS_FORWARD_IWOFF2SFNT(_to) \
  NS_SCRIPTABLE NS_IMETHOD Add(PRInt32 a, PRInt32 b, PRInt32 *_retval NS_OUTPARAM) { return _to Add(a, b, _retval); } 

/* Use this macro to declare functions that forward the behavior of this interface to another object in a safe way. */
#define NS_FORWARD_SAFE_IWOFF2SFNT(_to) \
  NS_SCRIPTABLE NS_IMETHOD Add(PRInt32 a, PRInt32 b, PRInt32 *_retval NS_OUTPARAM) { return !_to ? NS_ERROR_NULL_POINTER : _to->Add(a, b, _retval); } 

#if 0
/* Use the code below as a template for the implementation class for this interface. */

/* Header file */
class _MYCLASS_ : public IWoff2sfnt
{
public:
  NS_DECL_ISUPPORTS
  NS_DECL_IWOFF2SFNT

  _MYCLASS_();

private:
  ~_MYCLASS_();

protected:
  /* additional members */
};

/* Implementation file */
NS_IMPL_ISUPPORTS1(_MYCLASS_, IWoff2sfnt)

_MYCLASS_::_MYCLASS_()
{
  /* member initializers and constructor code */
}

_MYCLASS_::~_MYCLASS_()
{
  /* destructor code */
}

/* long Add (in long a, in long b); */
NS_IMETHODIMP _MYCLASS_::Add(PRInt32 a, PRInt32 b, PRInt32 *_retval NS_OUTPARAM)
{
    return NS_ERROR_NOT_IMPLEMENTED;
}

/* End of implementation class template. */
#endif


#endif /* __gen_IWoff2sfnt_h__ */
