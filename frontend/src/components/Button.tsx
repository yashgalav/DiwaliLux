
import type { ReactNode } from 'react';
interface ButtonType {
  classname: string;
  children: ReactNode;
  disabledBool?: boolean; // optional
  onClick? : () =>void
  type?: "button" | "submit" ;
}

const Button = ({ classname, children, disabledBool = false , onClick, type}: ButtonType) => {
  return (
    <button onClick={onClick} type={type  || "button"} className={classname} disabled={disabledBool}>
      {children}
    </button>
  );
};

Button.displayName = "Button"

export { Button }

