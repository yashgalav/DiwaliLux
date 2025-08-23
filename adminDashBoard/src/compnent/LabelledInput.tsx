import type { ChangeEvent } from "react"

interface LabelledInputType{
    label : string;
    placeholder: string;
    onChange: (e :ChangeEvent<HTMLInputElement>) => void;
    type? : string;
}


export default function LabelledInput({label, placeholder, onChange, type}: LabelledInputType) {
  return (
    <div>
        <div>
            <label className="block mb-2 text-sm font-medium text-orange-500 ">{label}</label>
            <input onChange={onChange} type={type || "text"} className="bg-amber-50 border border-amber-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-2 focus:border-amber-500 outline-none block w-full p-2.5 " placeholder={placeholder} aria-required={true}/>
        </div>
        
    </div>
  )
}
