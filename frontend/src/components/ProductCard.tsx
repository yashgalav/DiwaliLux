
import { Badge } from './Badge'
import { Button } from './Button'
import placeholder from '../assets/placeholder.svg'
import { Link } from 'react-router-dom'

interface productType {
    name: string,
    price: string,
    originalPrice: string,
    imageUrl: string,
    features: Array<string>,
    badge: string,
    badgeColor: string,
}

export default function ProductCard({ name, price, originalPrice, imageUrl, features, badge, badgeColor }: productType) {
    return (
        <div
            className="relative rounded-lg overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group bg-white/90 backdrop-blur-sm"
        >
            <Badge
                classname={`absolute top-6 left-6 z-10 bg-gradient-to-r ${badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg`}
            >
                {badge}
            </Badge>

            <div className="p-0">
                <div className="relative overflow-hidden">
                    <img
                        src={imageUrl || placeholder}
                        alt={name}
                        width={400}
                        height={400}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>

                <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">{name}</h3>
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            {price}
                        </span>
                        <span className="text-lg text-slate-500 line-through">{originalPrice}</span>
                        <Badge classname="rounded-xl px-2 py-1 font-medium bg-red-100 text-red-700 text-xs">
                            {Math.round(
                                ((Number.parseInt(originalPrice.replace("₹", "").replace(",", "")) -
                                    Number.parseInt(price.replace("₹", "").replace(",", ""))) /
                                    Number.parseInt(originalPrice.replace("₹", "").replace(",", ""))) *
                                100,
                            )}
                            % OFF
                        </Badge>
                    </div>

                    <ul className="space-y-3 mb-8">
                        {features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-slate-600">
                                <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-3"></div>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <Link to={"/products"}>
                        <Button classname=" w-full  bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                        Select This Collection
                        </Button>
                    </Link>
                    
                </div>
            </div>
        </div>
    )
}
