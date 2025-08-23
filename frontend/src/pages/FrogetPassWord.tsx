import { Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LabelledInput from "../components/LabelledInput";
import Heading from "../components/Heading";
import GoogleLoginWrapper from "../components/GoogleLoginWrapper";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../config";
import {  type forgetPasswordType, type sendOtpType,  type signupInputType } from "@yashxdev/diwalilux-common";
import { useRecoilState } from "recoil";
import { isAuthenticatedAtom, loggedInUserNameAtom } from "../store/Atom";
import ButtonLogin from "../components/ButtonLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Button } from "../components/Button";



export default function ForgetPassword() {
    const [, setUserName] = useRecoilState(loggedInUserNameAtom);
    const navigate = useNavigate();
    const [, setIsAuthenticated] = useRecoilState(isAuthenticatedAtom);
    const [signinInputs, setSigninInput] = useState<signupInputType>({
        email: "",
        password: "",
    })
    const [forgetSignin, setForgetSignin] = useState<forgetPasswordType>({
        otp: 0,
        email: "",
        otpSigninInput: signinInputs
    })
    const [sendOtpInput, setSendOtpInput] = useState<sendOtpType>({
        email: ""
    })
    const [isOtpSent, setIsOtpSent] = useState(false);

    async function sendRequest() {
        try {

            if (!signinInputs.email.trim()) {
                toast.error("Email is required");
                return; // Save a network request
            }
            if (!signinInputs.password.trim()) {
                toast.error("Password is required");
                return; // Save a network request
            }
            if (!forgetSignin.otp) {
                toast.error("OTP is required");
                return; // Save a network request
            }

            const updatedForgetSignin = {
                ...forgetSignin,
                otpSigninInput: signinInputs
            };

            setForgetSignin(updatedForgetSignin); // still update state if needed


            const response = await axios.post(`${BACKEND_URL}/api/v1/user/forget-password`, updatedForgetSignin);
            const jwt = response.data;
            localStorage.setItem("authToken", jwt.jwt);
            setUserName(jwt.name?.toLocaleUpperCase() || "Guest User")
            localStorage.setItem("userId", jwt.userId)
            setIsAuthenticated(true);
            navigate("/")
            const message = response?.data?.message;

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
            });

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

    const sendOtp = async () => {
        try {
            if (!sendOtpInput.email.trim()) {
                toast.error("Email is required");
                return; // Save a network request
            }
            if (!signinInputs.password.trim()) {
                toast.error("Password is required");
                return; // Save a network request
            }
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/send-otp`, sendOtpInput);

            setIsOtpSent(true);
            console.log(isOtpSent);
            const message = response?.data?.message;
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
            });
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
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 justify-between">
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
                            <Heading customClassname="text-center mb-1 text-3xl 2xl:text-5xl font-extrabold text-orange-600 " label="Trouble logging in?" />
                            <Heading customClassname="text-center text-sm 2xl:text-3xl font-light text-orange-400" label="Create new password." links={{ text: "Sign in", to: "/signin" }} />
                        </div>

                        <div className=" grid gap-5 mt-4">

                            <LabelledInput label="Email" placeholder="ram@diwalilux.com" onChange={(e) => {
                                setSendOtpInput({
                                    ...sendOtpInput,
                                    email: e.target.value
                                })
                                setForgetSignin({
                                    ...forgetSignin,
                                    email: e.target.value
                                })
                                setSigninInput({
                                    ...signinInputs,
                                    email: e.target.value
                                })
                            }} />
                            <LabelledInput label="New Password" type="password" placeholder="@#jhdfd(.ds" onChange={(e) => {
                                setSigninInput({
                                    ...signinInputs,
                                    password: e.target.value
                                })
                            }} />

                            {isOtpSent && <LabelledInput
                                label="OTP"
                                placeholder="Enter OTP"
                                type="number"
                                max={6}
                                digitsOnly
                                onChange={(e) => {
                                    const cleanValue = e.target.value.replace(/\D/g, ""); // filter here
                                    setForgetSignin({
                                        ...forgetSignin,
                                        otp: parseInt(cleanValue)
                                    })
                                }}
                            // value={otp} // controlled value
                            />}
                            {!isOtpSent && <div className="pb-5">
                                <ButtonLogin onclick={sendOtp} label="Send Otp" type="button" />
                            </div>}
                            {isOtpSent && <div className="pb-5">
                                <ButtonLogin onclick={sendRequest} label="Confirm & Proceed" type="button" />
                                <Heading customClassname="text-center text-sm 2xl:text-3xl  font-light text-slate-400" label="Didn't receive code?" links={{ text: "Resend", to: "", onclick: sendOtp }} />

                            </div>}
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <GoogleLoginWrapper />
                    </div>
                </div>
            </div>
        </div>
    )
}
