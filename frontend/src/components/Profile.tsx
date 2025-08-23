import { ListOrdered,  LogOutIcon, ShoppingCart, User2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { isAuthenticatedAtom, loggedInUserNameAtom } from "../store/Atom";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Button } from "./Button";

// import order from "../assets/order.png"

export default function Profile() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthenticatedAtom);
    const name = useRecoilValue(loggedInUserNameAtom);



    const handleLogout = async () => {
        // Clear app state
        setIsAuthenticated(false);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");

        // Logout from Google OAuth
        googleLogout();

        // Disable auto-select so the button doesn't remember last account
        if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.disableAutoSelect();
        }

        // Revoke Google access token (optional but removes cached account name)
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                await axios.get(
                    `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
                    { withCredentials: false }
                );
            } catch (err) {
                console.error("Error revoking Google token", err);
            }
        }

        navigate("/signin");
    };
    const openWhatsApp = () => {
        window.open('https://wa.me/918448455466?text=Hello!', '_blank');
    };

    const jumpToOrders= ()=>{
        if(isAuthenticated)
            navigate("/orders")
    }

    const jumpToCart= ()=>{
        if(isAuthenticated)
            navigate("/cart")
    }

    const toggleDropdown = () => setIsOpen(!isOpen);


    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left">

            <div className="flex items-center space-x-3 ">
                <button onClick={toggleDropdown} className="p-1 rounded-full hover:bg-amber-300">
                    <div className="px-4 py-2 text-2xl border-2 rounded-full font-bold border-amber-200 bg-amber-100 text-orange-400 flex items-center justify-center">
                        {name[0].toLocaleUpperCase()}
                    </div>
                </button>
            </div>


            {/* <!-- Dropdown menu --> */}
            {isOpen && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 ">
                    <ul className=" shadow-xl hover:shadow-2xl text-sm text-gray-700  ">
                        <li className="px-2 py-2 border-b  hover:bg-gray-100" role="none">
                            <p className="text-sm flex gap-2 items-center flex-shrink text-gray-900 " role="none">
                                <User2Icon className="  text-red-400"/>
                                {name}
                            </p>
                        </li>
                        <li className=" border-b hover:bg-gray-100 ">
                            <Button onClick={openWhatsApp} classname="h-10 flex justify-center gap-2 items-center px-2 rounded-lg py-1  text-sm">
                                <FontAwesomeIcon icon={faWhatsapp} size="xl" style={{ color: "#04d294", }} />
                                <span>Whatsapp</span>
                            </Button>
                        </li>
                        <li className=" border-b hover:bg-gray-100 ">
                            <Button onClick={jumpToOrders} classname="h-10 flex justify-center gap-2 items-center px-2 rounded-lg py-1  text-sm">
                                <ListOrdered className="h-5 w-5 text-orange-400"   />
                                <span>Orders</span>
                            </Button>
                        </li>
                        <li className=" border-b hover:bg-gray-100 ">
                            <Button onClick={jumpToCart} classname="h-10 flex justify-center gap-2 items-center px-2 rounded-lg py-1  text-sm">
                                <ShoppingCart className="h-5 w-5 text-orange-400"   />
                                <span>Cart</span>
                            </Button>
                        </li>
                        
                        <li>
                            <a onClick={handleLogout} className="px-2 py-2 gap-2 flex items-center flex-shrink hover:cursor-pointer hover:bg-gray-100 hover:rounded-lg">
                                <LogOutIcon className="text-orange-500"/>
                                Sign out
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}