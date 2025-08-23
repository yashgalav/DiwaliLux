import { Star } from 'lucide-react'

import placeholder from '../assets/placeholder-user.jpg'
 
interface FeedBackCardType{
    rating:Number,
    text: string,
    avatar: string,
    name: string,
    companyName: string
}
export default function FeedBackCard({rating, name, text, avatar, companyName}: FeedBackCardType) {
    return (
        <div className="rounded-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
            <div className="p-8">
                <div className="flex items-center mb-6">
                    {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-amber-500 fill-current" />
                    ))}
                </div>
                <p className="text-slate-600 mb-8 italic leading-relaxed font-light">"{text}"</p>
                <div className="flex items-center space-x-4">
                    <img
                        src={avatar || placeholder}
                        alt={name}
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-amber-200"
                    />
                    <div>
                        <div className="font-bold text-slate-800">{name}</div>
                        <div className="text-sm text-slate-600">{companyName}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
