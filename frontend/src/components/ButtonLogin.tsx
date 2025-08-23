
interface ButtonType {
  type?: "button" | "submit" ;
  label: string;
  onclick: () => void
}

export default function ButtonLogin({type, label, onclick} : ButtonType) {
  return (
    <div>
        <button onClick={onclick} type={type  || "button"} className="text-white w-full bg-orange-600 hover:bg-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 :ring-orange-700 ">
            {label}
        </button>
    </div>
  )
}