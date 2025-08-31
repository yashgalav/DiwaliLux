import { Badge } from './Badge'
import { Button } from './Button'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import placeholder from '../assets/placeholder.svg'
import { useRecoilState, useRecoilValue } from 'recoil'
import { isAuthenticatedAtom, quickViewAtom, sliderAtom } from '../store/Atom'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { debounce } from "lodash";

interface ProductCardFullType {
    id: string,
    popular: boolean
    image: string
    name: string
    inStock: boolean
    rating: number
    reviews: number
    description: string
    price: number
    originalPrice: number
    features: Array<string>
}

export default function ProductCardFull({ id, image, features, inStock, popular, rating,  price, originalPrice, description, name }: ProductCardFullType) {

    const [, setQuickView] = useRecoilState(quickViewAtom);
    const [, setImages] = useRecoilState(sliderAtom);
    const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
    const navigate = useNavigate();


   const quantityRef = useRef(0);

    const sendToCart = async () => {
        if (quantityRef.current === 0) return;

        const token = localStorage.getItem("authToken");
        try {
            await axios.post(
                `${BACKEND_URL}/api/v1/cart/add`,
                {
                    productId: id,
                    quantity: quantityRef.current
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );
            console.log(`Added ${quantityRef.current} items to cart`);
        } catch (err) {
            console.error(err);
        }
        quantityRef.current = 0;
    };

    // Debounced API sender
    const debouncedSendToCart = useRef(debounce(sendToCart, 500)).current;

    const addToCart = () => {
        if (!isAuthenticated) {
            navigate("/signin");
            return;
        }

        // Increase local counter
        quantityRef.current += 1;

        // Trigger (or re-trigger) debounce
        debouncedSendToCart();
    };

    const clickedQuickView = async () => {

        await axios.get(`${BACKEND_URL}/api/v1/product/images/${id}`)
            .then(response => {
                const items = response.data?.data?.image
                    ?? response.data?.image
                    ?? response.data?.data
                    ?? [];
                setImages(items);
                console.log("Fetched images:", items);
            })
            .catch(error => {
                console.error("Error fetching images:", error);
            });
        setQuickView(true)
    }


    return (
        <div className="rounded-xl relative overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
            {popular && (
                <Badge classname="rounded-lg px-2 text-sm font-light absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    Popular
                </Badge>
            )}
            {!inStock && <Badge classname="rounded-lg px-2 text-sm font-light absolute top-4 text-white right-4 z-10 bg-gray-500">Out of Stock</Badge>}
            <div className="p-0">
                <div className="relative group">
                    <img
                        src={image || placeholder}
                        alt={name}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button onClick={clickedQuickView} classname="rounded-lg px-1 bg-white text-black hover:bg-gray-100">Quick View</Button>
                    </div>
                    <Button classname="border rounded-lg px-3 py-2 absolute top-4 right-4 bg-white/80 backdrop-blur-sm">
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold">{name}</h3>
                        <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            {/* <span className="text-sm text-gray-600">{rating}</span> */}
                            {/* <span className="text-sm text-gray-400">({reviews})</span> */}
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{description}</p>
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl font-bold text-orange-600">₹{price}</span>
                        <span className="text-lg text-gray-500 line-through">₹{originalPrice}</span>
                        <Badge classname="text-xs">
                            {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                        </Badge>
                    </div>
                    <ul className="space-y-1 mb-6">
                        {features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600">
                                <Star className="h-3 w-3 text-orange-500 mr-2" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-2">
                        <Button
                            onClick={addToCart}
                            classname="flex justify-center w-full h-10 rounded-lg items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            disabledBool={!inStock}
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                        <Button classname='border rounded-lg px-3 py-2' >
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}
