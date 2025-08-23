import { LogOut, Sparkles } from 'lucide-react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';

type createProductInputType = {
    productName: string;
    description: string;
    price: number;  // keep string for inputs, convert to number when sending
    originalPrice: number;
    point1: string;
    point2: string;
    point3: string;
    main: File | null;
    left: File | null;
    top: File | null;
    quantity: number
};
export default function Admin() {
    const navigate = useNavigate()
    const [productId, setProductId] = useState("");

    const [product, setProduct] = useState<createProductInputType>({
        productName: "",
        description: "",
        price: 0,
        originalPrice: 0,
        point1: "",
        point2: "",
        point3: "",
        main: null,
        left: null,
        quantity: 0,
        top: null,
    });
    const token = localStorage.getItem("adminAuthToken");


    const sendData = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            

            // ✅ build multipart form data
            const formData = new FormData();
            formData.append("productName", product.productName);
            formData.append("description", product.description);
            formData.append("price", product.price.toString());
            formData.append("originalPrice", product.originalPrice.toString());
            formData.append("point1", product.point1);
            formData.append("point2", product.point2);
            formData.append("point3", product.point3);
            formData.append("quantity", product.quantity.toString());
            // Append files only if not null
            if (product.main) formData.append("main", product.main);
            if (product.left) formData.append("left", product.left);
            if (product.top) formData.append("top", product.top);
           
            const res = await axios.post(`${BACKEND_URL}/api/v1/product/admin/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success(res.data.message)
        } catch (error: any) {
            console.error("Product creation failed:", error);
            throw error.response?.data || { message: "Something went wrong" };
        }
    }
    const handleLogout = async () => {

        localStorage.removeItem("adminAuthToken");
        localStorage.removeItem("adminUserId");

        navigate("/");
    };

    const deleteProduct = async () => {
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/product/admin/delete/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Product deleted successfully");
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
    };


    return (
        <div className=" bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
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
                        <div className="flex items-center space-x-4">

                            <button onClick={handleLogout} className="h-10  flex justify-center gap-2 items-center px-2 rounded-lg py-1 border text-sm">
                                <LogOut className='h-5 text-amber-600' />
                                <span className="hidden md:block">Logout</span>
                            </button>

                        </div>
                    </div>
                </div>
            </header>



            <div className='h-screen flex   justify-center items-center'>

                <form onSubmit={sendData} className='flex flex-col justify-center items-center   h-10 w-full'>
                    <div className='space-y-2 bg-slate-400 rounded-lg px-4 py-8' >
                        <h1 className='text-3xl font-bold mb-10 underline'>
                            Please Enter the Product Detail
                        </h1>
                        <div>
                            <label className='text-xl' htmlFor="right">Product Name : </label>
                            <input type='text' className=' px-1' id="Name"
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        productName: e.target.value
                                    })}
                            />
                        </div>
                        <div>
                            <label className='text-xl' htmlFor="main">Main Photo : </label>
                            <input type='file' className='outline ' id="main"
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        main: e.target.files ? e.target.files[0] : null
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className='text-xl' htmlFor="left"> Left Photo : </label>
                            <input type='file' className='outline ' id="left"
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        left: e.target.files ? e.target.files[0] : null
                                    })
                                }
                            />
                        </div>
                        
                        <div>
                            <label className='text-xl' htmlFor="top">Top Photo : </label>
                            <input type='file' className='outline ' id="top"
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        top: e.target.files ? e.target.files[0] : null
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className='text-xl' htmlFor="price">price : </label>
                            <input type='number' className='outline px-1' id="price"
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        price: parseInt(e.target.value)
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className='text-xl' htmlFor="originalPrice">original price : </label>
                            <input type='number' className='outline px-1' id="originalPrice"
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        originalPrice: parseInt(e.target.value)
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className='text-xl' htmlFor="originalPrice">Quantity : </label>
                            <input type='number' className='outline px-1' id="originalPrice"
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        quantity: parseInt(e.target.value)
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className='text-xl' htmlFor="desc">Description : </label>
                            <textarea className='outline px-1' id="desc"
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        description: e.target.value
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className='text-xl' htmlFor="bulletPoints">Bullet Point 1 : </label>
                            <input type='text' className='outline px-1' id="bulletPoint"
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        point1: e.target.value
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className='text-xl' htmlFor="bulletPoints">Bullet Point 2 : </label>
                            <input type='text' className='outline px-1' id="bulletPoint"
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        point2: e.target.value
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className='text-xl' htmlFor="bulletPoints">Bullet Point 3 : </label>
                            <input type='text' className='outline px-1' id="bulletPoint"
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        point3: e.target.value
                                    })
                                }
                            />
                        </div>
                        <button className='bg-amber-500 px-2 px-y rounded-lg w-full' type='submit'>
                            submit
                        </button>
                    </div>

                </form>

            </div>

            <div className='flex items-center justify-center pb-20 gap-2'>
                <input type='text' className='border-black border-2' onChange={e => (setProductId(e.target.value))} />
                <button onClick={deleteProduct} className='bg-red-400 px-2 py-1 rounded-lg hover:bg-red-500'>delete product</button>
            </div>

        </div>
    )
}
