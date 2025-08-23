
import type { ReactNode } from "react"

interface cardType{
    icon : ReactNode,
    title : string,
    description: string
}

export function Card({icon , title, description}: cardType) {
    return (
        <div className="border-0 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm hover:-translate-y-2 group">
            <div className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-8 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold mb-6 text-slate-800">{title}</h3>
                <p className="text-slate-600 leading-relaxed font-extralight">{description}</p>
            </div>
        </div>
    )
}
