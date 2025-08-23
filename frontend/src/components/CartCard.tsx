import { Minus, Plus } from "lucide-react";
import { Badge } from "./Badge";
import {  type CartItem } from "../hooks";
import { formatPrice } from "../pages/Cart";
import { useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { debounce } from "lodash";
import { useRecoilValue } from "recoil";
import { isAuthenticatedAtom } from "../store/Atom";
import { useNavigate } from "react-router-dom";


export default function CartCard({id, productId ,name, price, originalPrice, inStock, image, quantity} :CartItem ) {
    const quantityRef = useRef(0);
    const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
    const navigate = useNavigate();

    const sendToCart = async () => {
        if (quantityRef.current === 0) return;

        const token = localStorage.getItem("authToken");
        try {
            await axios.post(
                `${BACKEND_URL}/api/v1/cart/add`,
                {
                    productId: productId,
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
        window.location.reload(); // last step
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



    const deleteItemFromCart = async () => {
        if (quantityRef.current === 0) return;

        const token = localStorage.getItem("authToken");
        try {
            await axios.post(
                `${BACKEND_URL}/api/v1/cart/minus`,
                {
                    itemId: id,
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
        window.location.reload(); // last step
    };

    // Debounced API sender
    const debouncedDeleteFromCart = useRef(debounce(deleteItemFromCart, 500)).current;

    const deleteFromCart = () => {
        if (!isAuthenticated) {
            navigate("/signin");
            return;
        }

        // Increase local counter
        quantityRef.current += 1;

        // Trigger (or re-trigger) debounce
        debouncedDeleteFromCart();
    };



    return (
        <div className='mx-4  '>

            <div className='grid grid-cols-1 md:flex md:flex-row px-2 border-b py-4 md:space-x-2'>
                <img
                    // src='https://images.pexels.com/photos/5406476/pexels-photo-5406476.jpeg'
                    src={image}
                    alt={"image"}
                    width={400}
                    height={400}
                    className="w-32  h-20 md:w-60 md:h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="md:flex md:flex-row w-full mt-2 md:mt-0 md:justify-between mb-2 md:mb-0">
                    <div className='text-md md:text-xl font-normal mr-2 text-start w-full'>
                        <p>{name.toLocaleUpperCase()}</p>
                        <span className={`${true ? "text-green-600" : "text-red-600"} text-sm`}>{inStock ? "In stock" : "Currently unavailable."}</span>
                        <span className="hidden md:block ">
                            <span className="flex justify-center items-center w-fit text-md font-bold border-2 border-amber-200 text-amber-800 rounded-full  px-2 ">
                                <button onClick={deleteFromCart} className="hover:bg-slate-100 hover:rounded-full mr-2">
                                    <Minus  />
                                </button> {quantity} 

                                <button onClick={addToCart} className="ml-2 hover:bg-slate-100 hover:rounded-full">
                                    <Plus />
                                </button>
                            </span>
                        </span>
                    </div>
                    <div className='flex flex-col text-xl font-normal w-full md:text-right '>
                        <span>
                            <Badge classname="text-xs rounded-lg bg-gradient-to-r from-orange-500 to-red-500 p-1">
                                {/* {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF */}
                                {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                            </Badge>
                        </span>
                        <span className="text-xl md:text-2xl font-bold text-orange-600">₹{formatPrice(price)}</span>
                        <span className="text-lg md:text-lg text-gray-500 line-through">M.R.P.: ₹{formatPrice(originalPrice)}</span>
                        <span className="block md:hidden ">
                            <span className="flex justify-center items-center w-fit text-md font-bold border-2 border-amber-200 text-amber-800 rounded-full  px-2 ">
                                <button onClick={deleteFromCart} className="hover:bg-slate-200 hover:rounded-full mr-2">
                                    <Minus  />
                                </button> {quantity} 

                                <button onClick={addToCart} className="ml-2 hover:bg-slate-200 hover:rounded-full">
                                    <Plus />
                                </button>
                            </span>
                        </span>
                        
                    </div>
                </div>

            </div>
        </div>
    )
}
