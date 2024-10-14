
import React from 'react'

import dynamic from 'next/dynamic'

const NoSsr = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <React.Fragment>{children}</React.Fragment>
)

export default dynamic(() => Promise.resolve(NoSsr), {
  ssr: false
})