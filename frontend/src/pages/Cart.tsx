import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ShoppingCart, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import CartCard from '../components/CartCard'
import Profile from '../components/Profile'
import { useRecoilValue } from 'recoil'
import { deliveryDistrictAtom, deliveryPersonAddressAtom, deliveryPersonNameAtom, deliveryPersonNumberAtom, deliveryPincodeAtom, deliveryStateAtom, isAuthenticatedAtom, isDeliveryPolicyCheckedAtom } from '../store/Atom'
import { useCartItems } from '../hooks'
import * as Tooltip from '@radix-ui/react-tooltip';

import { useState } from 'react'
import AdressPopup from '../components/AddressPopup'
import type { OrderBuyType, orderItemType, deliveryAddressType } from '@yashxdev/diwalilux-common'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { Bounce, toast } from 'react-toastify'
import OrderPlacePopup from '../components/OrderPlacePopup'

export default function Cart() {
    
    const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
    const { subTotal, subTotalPrice, item, hasOutOfStock } = useCartItems()
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenOrderPlacePopup, setIsOpenOrderPlacePopup] = useState(false);
    const address = useRecoilValue(deliveryPersonAddressAtom);
    const name = useRecoilValue(deliveryPersonNameAtom);
    const number = useRecoilValue(deliveryPersonNumberAtom);
    const pinCode = useRecoilValue(deliveryPincodeAtom);
    const state = useRecoilValue(deliveryStateAtom);
    const district = useRecoilValue(deliveryDistrictAtom);
    const isDeliveryPolicyChecked = useRecoilValue(isDeliveryPolicyCheckedAtom);

    const closeAddressPopup = () => {
        if (!name.trim()) {
            toast.error("Name is required");
            return; // Save a network request
        }
        if (!number.trim()) {
            toast.error("Contact is required");
            return; // Save a network request
        }
        if (number.length !== 10) {
            toast.error("Contact must be exactly 10 digits");
            return;
        }
        if (!address.trim()) {
            toast.error("Address is required");
            return;
        }
        if (!pinCode.trim()) {
            toast.error("Pincode is required");
            return;
        }
        if (!district.trim()) {
            toast.error("District is required");
            return;
        }
        if (!state.trim()) {
            toast.error("State is required");
            return;
        }
        if (!isDeliveryPolicyChecked) {
            toast.error("⚠️ Please read and check the delivery policy before proceeding.");
            return;
        }

        setIsOpen(false)
    }

    const checkOutOpen = () =>{
        if(subTotal < 10 ){
            toast.error("The minimum order quantity is 10 pieces. Please contact us on WhatsApp!");
            setIsOpen(false)
            return
        }else{
            setIsOpen(true)
        }
    }

    const handleConfirm = async () => {
        if (!name.trim() || !number.trim() || !address.trim() || !district.trim() 
            || !state.trim() || !pinCode.trim() || !isDeliveryPolicyChecked) {
            return;
        }

        setIsOpenOrderPlacePopup(true)

        // Example: if you already have an array `item`
        const newItems: orderItemType[] = item.map((i) => ({
            cartId: i.id,
            price: i.price,
            productId: i.productId,
            quantity: i.quantity,
        }));
        const userId = localStorage.getItem("userId") ?? "";

        const deliveryDetails: deliveryAddressType = {
            fullName: name,
            phoneNo: number,
            Address: address,
            district: district,
            state: state,
            pincode: pinCode,
        }

        const order: OrderBuyType = {
            userId: userId,
            items: newItems,
            totalAmount: subTotalPrice,
            delivery: deliveryDetails,
            status: "PENDING",
        };

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/order/request`,
                order,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );
            const paymentLink = response.data.paymentLink
            window.location.href = paymentLink;
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
            });
        }

    };


    const openWhatsApp = () => {
        window.open('https://wa.me/918448455466?text=Hello!', '_blank');
    };

    let isCartEmpty = false;
    if (!item || item.length === 0) {
        isCartEmpty = true
    }


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

            {isCartEmpty ?
                (
                    <div className='h-screen flex justify-center items-center'>
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <ShoppingCart className="h-16 w-16 mx-auto text-orange-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your DiwaliLux Cart is empty</h3>
                            <p className="text-gray-500">Start exploring our festive collection and add your favorites to make this Diwali even more special!</p>
                            <Link to={"/products"}>
                            <button className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition">
                                Shop Now
                            </button>
                        </Link>
                        </div>
                    </div>
                )
                :
                <div className='mt-16  flex flex-col space-y-5 justify-center container mx-auto px-4 '>
                    <div className='bg-white'>
                        <div className='flex justify-between border-b m-4 pb-4'>
                            <div className=' text-3xl '>
                                Shopping Cart
                            </div>

                            {hasOutOfStock && <Tooltip.Provider delayDuration={150}>
                                <Tooltip.Root>
                                    <Tooltip.Trigger asChild>

                                        <button disabled className={`${!isAuthenticated ? "md:hidden" : "md:block"} disabled:bg-gray-400 hidden md:block px-4 bg-yellow-400 hover:bg-yellow-300 rounded-full text-sm`}>
                                            Checkout
                                        </button>

                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content
                                            side="top"
                                            className="z-50 rounded bg-gray-900 px-2 py-1 text-xs text-white data-[state=delayed-open]:animate-in data-[state=closed]:animate-out"
                                        >
                                            Out of stock — adjust quantities
                                            <Tooltip.Arrow className="fill-gray-900" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                            }

                            {!hasOutOfStock && <button onClick={checkOutOpen} className={`${!isAuthenticated ? "md:hidden" : "md:block"}  hidden md:block px-4 bg-yellow-400 hover:bg-yellow-300 rounded-full text-sm`}>
                                Checkout
                            </button>}

                            <AdressPopup
                                isOpen={isOpen}
                                onClose={closeAddressPopup}
                                onConfirm={handleConfirm}
                                onCloseX={() => (setIsOpen(false))}
                            />

                        </div>
                        {item.map((i, idx) => (
                            <CartCard
                                key={i.id || idx}
                                id={i.id}
                                name={i.name}
                                quantity={i.quantity}
                                inStock={i.inStock}
                                price={i.price}
                                originalPrice={i.originalPrice}
                                image={i.image}
                                productId={i.productId}
                            />
                        ))}

                        <div className="mb-8 mt-1 text-right mx-4 text-lg ">
                            Subtotal ({subTotal} items): <span className='font-bold'>₹{formatPrice(subTotalPrice)}</span>

                            {hasOutOfStock && <Tooltip.Provider delayDuration={150}>
                                <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                        <span className="inline-block">
                                            <button disabled={hasOutOfStock} className={`${!isAuthenticated ? "hidden" : "block"} disabled:bg-gray-400 md:hidden px-4 py-1 bg-yellow-400 hover:bg-yellow-300 rounded-full text-sm`}>
                                                Checkout
                                            </button>
                                        </span>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content
                                            side="top"
                                            className="z-50 rounded bg-gray-900 px-2 py-1 text-xs text-white data-[state=delayed-open]:animate-in data-[state=closed]:animate-out"
                                        >
                                            Out of stock — adjust quantities
                                            <Tooltip.Arrow className="fill-gray-900" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </Tooltip.Provider>}

                            {!hasOutOfStock &&
                                <span className="inline-block">
                                    <button onClick={checkOutOpen} className={`${!isAuthenticated ? "hidden" : "block"}  md:hidden px-4 py-1 bg-yellow-400 hover:bg-yellow-300 rounded-full text-sm`}>
                                        Checkout
                                    </button>
                                </span>
                            }

                            {isOpenOrderPlacePopup && <OrderPlacePopup isOpen={isOpenOrderPlacePopup}/>}
                        </div>
                    </div>
                </div>
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