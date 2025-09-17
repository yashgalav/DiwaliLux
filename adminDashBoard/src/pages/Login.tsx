import { Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LabelledInput from "../compnent/LabelledInput";
import Heading from "../compnent/Heading";
import Button from "../compnent/Button";
import { useState } from "react";
import type {  signinInputType } from "@yashxdev/diwalilux-common";
import { Bounce, toast } from "react-toastify";
import { BACKEND_URL } from "../config";
import axios from "axios";



export default function Login() {
    const navigate = useNavigate();
    const [signinInput, setSigninInput] = useState<signinInputType>({
        email: "",
        password: ""
    })
    async function sendRequest() {
        try {

            if (!signinInput.email.trim()) {
                toast.error("Email is required");
                return; 
            }
            if (!signinInput.password.trim()) {
                toast.error("Password is required");
                return; 
            }


            const response = await axios.post(`${BACKEND_URL}/api/v1/user/admin/signin`, signinInput);
            const jwt = response.data;
            localStorage.setItem("adminAuthToken", jwt.jwt);
            localStorage.setItem("adminUserId", jwt.userId)
            navigate("/admin");
            
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
    }



    return (
        <div>
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
                                        DiwaliLux | Admin
                                    </span>
                                    <div className="text-xs text-amber-600/70 font-medium tracking-wider">PREMIUM GIFTING</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="h-screen flex flex-col justify-center items-center">
                <div className="flex-col  items-center border-b ">

                    <div className="px-8">
                        <Heading customClassname="text-center mb-1 text-3xl 2xl:text-5xl font-extrabold text-orange-600 " label="Sign in with Email " />
                        <Heading customClassname="text-center text-sm 2xl:text-3xl font-light text-orange-400" label="Don't have an account?" links={{ text: "Sign up", to: "/signup" }} />
                    </div>

                    <div className=" grid gap-5 mt-4">

                        <LabelledInput label="Email" placeholder="ram@diwalilux.com"
                            onChange={(e) =>
                                setSigninInput({
                                    ...signinInput,
                                    email: e.target.value.toLowerCase()
                                })}
                        />
                        <LabelledInput label="Password" type="password" placeholder="@#jhdfd(.ds"
                            onChange={(e) =>
                                setSigninInput({
                                    ...signinInput,
                                    password: e.target.value.toLowerCase()
                                })}
                        />

                        <div className="pb-5">
                            <Button onclick={sendRequest} label="Sign in" type="submit" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
