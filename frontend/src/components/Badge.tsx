
import type { ReactNode } from 'react';

interface buttontype {
  classname : string
  children : ReactNode
}
export  function Badge({ classname, children }: buttontype) {
  return (
     <span className={`${classname}`}>
        {children}
      </span>
  )
}
