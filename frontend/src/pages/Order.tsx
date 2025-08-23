import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ShoppingCart, Sparkles, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

import Profile from '../components/Profile'
import { useRecoilValue } from 'recoil'
import { isAuthenticatedAtom } from '../store/Atom'
import {  useOrderItems } from '../hooks'
import OrderCard from '../components/OrderCard'
import Popup from '../components/Popup'
import { useState } from 'react'
import { BACKEND_URL } from '../config'
import axios from 'axios'
import { Bounce, toast } from 'react-toastify'

export default function Order() {

    const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
    const { orderItems } = useOrderItems()
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const handleCancelClick = (id: string) => {
        console.log(id);
        
        setSelectedOrderId(id);
        setIsOpen(true);
    };

    const handleConfirm = async () => {
        if (!selectedOrderId) return;
        console.log("Cancelling order:", selectedOrderId);
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(`${BACKEND_URL}/api/v1/order/cancel/${selectedOrderId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            const message = response?.data?.message
            window.location.reload();
            toast.success(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            })

        } catch (ex: any) {
            const errorMessage = ex.response?.data?.message || ex.message || "Something went wrong!";
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            })
        }
        setIsOpen(false);
        setSelectedOrderId(null);
    };

    const openWhatsApp = () => {
        window.open('https://wa.me/918448455466?text=Hello!', '_blank');
    };





    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to={"/"} className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Sparkles className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent">
                                        DiwaliLux
                                    </span>
                                    <div className="text-xs text-amber-600/70 font-medium tracking-wider">PREMIUM GIFTING</div>
                                </div>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button onClick={openWhatsApp} classname="h-10  flex justify-center gap-2 items-center px-2 rounded-lg py-1 border text-sm">
                                <FontAwesomeIcon icon={faWhatsapp} size="xl" style={{ color: "#04d294", }} />
                                <span className="hidden md:block">WhatsApp</span>
                            </Button>

                            <Profile />

                        </div>
                    </div>
                </div>
            </header>

            <div className='mt-16  flex flex-col space-y-5 justify-center container mx-auto px-4 '>
                <div className='bg-white'>
                    <div className='flex justify-between border-b m-4 pb-4'>
                        <div className=' text-3xl '>
                            Orders
                        </div>

                    </div>

                    {orderItems?.map((x, index) => {
                        return (
                            <div key={index} className="border-b mb-10">
                                <div className="flex justify-between mx-4">
                                    <div>
                                        <div className="text-xl">Order : {x.date}</div>
                                        <span className={`${x.isDeliver ? "text-green-600" : "text-yellow-500"} text-sm`}>
                                            {x.status}
                                        </span>
                                    </div>

                                    {x.isApplicableForCancel && <button
                                        onClick={() => handleCancelClick(x.id)}
                                        className={`${!isAuthenticated ? "hidden" : "block"} px-4 bg-yellow-400 hover:bg-yellow-300 rounded-full text-sm`}
                                    >
                                        <X />
                                    </button>}
                                    <Popup
                                        isOpen={isOpen}
                                        onClose={() => setIsOpen(false)}
                                        onConfirm={handleConfirm}
                                        title="Are you sure?"
                                    >
                                        <p>Do you really want to cancel this Order?</p>
                                    </Popup>
                                </div>

                                {x.items.map((i, idx) => (
                                    <OrderCard
                                        key={idx}
                                        price={i.price}
                                        name={i.name}
                                        quantity={i.quantity}
                                        image={i.image}
                                        productId={i.productId}
                                    />
                                ))}
                            </div>
                        );
                    })}




                </div>
            </div>
            {false
                && (
                    <div className='h-screen flex justify-center items-center'>
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <ShoppingCart className="h-16 w-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your DiwaliLux Cart is empty</h3>
                            <p className="text-gray-500">Start exploring our festive collection and add your favorites to make this Diwali even more special!</p>
                        </div>
                    </div>

                )
            }
        </div>
    )
}


export const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};