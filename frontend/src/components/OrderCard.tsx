
import {  type OrderItem } from "../hooks";
import { formatPrice } from "../pages/Cart";



export default function OrderCard({ name, price, image, quantity} :OrderItem ) {


    return (
        <div className='mx-4  '>

            <div className='grid grid-cols-1 md:flex md:flex-row px-2  py-4 md:space-x-2'>
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
                        <span className="hidden md:block ">
                            <span className="flex justify-center items-center w-fit text-sm  border-2 border-amber-200 text-amber-800 rounded-full  px-2 ">
                                Qty: {quantity} 
                            </span>
                        </span>
                        
                    </div>
                    <div className='flex flex-col text-xl font-normal w-full md:text-right '>
                        
                        <span className="text-xl md:text-2xl font-bold text-orange-600">₹{formatPrice(price)}</span>
                        <span className="block md:hidden ">
                            <span className="flex justify-center items-center w-fit text-sm  border-2 border-amber-200 text-amber-800 rounded-full  px-2 ">
                                Qty: {quantity}
                            </span>
                        </span>    
                    </div>
                </div>

            </div>
        </div>
    )
}
