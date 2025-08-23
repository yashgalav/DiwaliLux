import { Link } from "react-router-dom";

interface headingInput{
    label: string;
    customClassname:string;
    links?: {
    text: string;
    to: string ;
    onclick? : () => void
  }
}

export default function Heading({label,customClassname, links}:headingInput) {
  return (
    <div className={`${customClassname}`} >
        {label}   {links && <Link className="pl-2 underline" onClick={links.onclick} to={links.to}>{links.text}</Link>}
    </div>
  )
}