import { Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LabelledInput from "../components/LabelledInput";
import Heading from "../components/Heading";
import GoogleLoginWrapper from "../components/GoogleLoginWrapper";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../config";
import type { signinInputType } from "@yashxdev/diwalilux-common";
import { useRecoilState } from "recoil";
import { isAuthenticatedAtom, loggedInUserNameAtom } from "../store/Atom";
import { useState } from "react";
import ButtonLogin from "../components/ButtonLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Button } from "../components/Button";


export default function Login() {
    const [, setUserName] = useRecoilState(loggedInUserNameAtom);
    const navigate = useNavigate();
    const [, setIsAuthenticated] = useRecoilState(isAuthenticatedAtom);
    const [signinInput, setSigninInput] = useState<signinInputType>({
        email: "",
        password: ""
    })
    async function sendRequest() {
        try {

            if (!signinInput.email.trim()) {
                toast.error("Email is required");
                return; // Save a network request
            }
            if (!signinInput.password.trim()) {
                toast.error("Password is required");
                return; // Save a network request
            }


            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, signinInput);
            const jwt = response.data;
            localStorage.setItem("authToken", jwt.jwt);
            setUserName(jwt.name?.toLocaleUpperCase() || "Guest User")
            localStorage.setItem("userId", jwt.userId)
            setIsAuthenticated(true);
            navigate("/")

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

    const openWhatsApp = () => {
        window.open('https://wa.me/918448455466?text=Hello!', '_blank');
    };

    return (
        <div>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-200">
                <div className="container mx-auto px-4 py-4 ">
                    <div className="flex items-center justify-between ">
                        <div className="flex items-center space-x-4 justify-between">
                            <Link to={"/"} className="flex items-center space-x-3 ">
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
                        <Button onClick={openWhatsApp} classname="h-10  flex justify-center gap-2 items-center px-2 rounded-lg py-1 border text-sm">
                            <FontAwesomeIcon icon={faWhatsapp} size="xl" style={{ color: "#04d294", }} />
                            <span className="hidden md:block">WhatsApp</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="h-screen flex flex-col justify-center items-center">
                <div className=" bg-amber-50 py-8 px-4 mx-2 rounded-xl shadow-lg hover:shadow-2xl">
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
                                        password: e.target.value
                                    })}
                            />

                            <div className="pb-5">
                                <ButtonLogin onclick={sendRequest} label="Sign in" type="submit" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center">
                        <Heading customClassname="text-center text-sm 2xl:text-3xl mt-5 font-light text-slate-400" label="" links={{ text: "Forget Password?", to: "/forget" }} />

                        <GoogleLoginWrapper />
                    </div>
                </div>
            </div>
        </div >
    )
}
