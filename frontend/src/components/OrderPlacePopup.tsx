import Lottie from "lottie-react";
import loadingAnimation from "../assets/Loading.json";

type OrderPlacePopupProps = {
    isOpen: boolean;
};

export default function OrderPlacePopup({ isOpen }: OrderPlacePopupProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
                <div className="flex flex-col items-center text-center">
                    <Lottie animationData={loadingAnimation} loop />
                    <p className="text-lg font-medium mt-4">Placing your order...</p>
                </div>
            </div>
        </div>
    )
}
