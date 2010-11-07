#include "Woff2sfnt.h"

NS_IMPL_ISUPPORTS1(Woff2sfnt, IWoff2sfnt)

Woff2sfnt::Woff2sfnt()
{
  /* member initializers and constructor code */
}

Woff2sfnt::~Woff2sfnt()
{
  /* destructor code */
}

/* long Add (in long a, in long b); */
NS_IMETHODIMP
Woff2sfnt::Add(PRInt32 a, PRInt32 b, PRInt32 *_retval NS_OUTPARAM)
{
	*_retval = a + b;
	return NS_OK;
}

