import { Search, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProductCardFull from "../components/ProductCardFull";
import { useRecoilState, useRecoilValue } from "recoil";
import { inputAtom, isAuthenticatedAtom, quickViewAtom, sliderAtom } from "../store/Atom";
import PhotoSilder from "../components/PhotoSilder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useProducts } from "../hooks";
import ProductSkeleton from "../skeleton/ProductSkeleton";

export default function Products() {
    const [searchTerm, setSearchTerm] = useRecoilState(inputAtom)
    const [sortBy, setSortBy] = useState("featured")
    const [filterCategory, setFilterCategory] = useState("all")
    const navigate = useNavigate();
    const { loading, products } = useProducts();
    const images = useRecoilValue(sliderAtom);
    const isAuthenticated = useRecoilValue(isAuthenticatedAtom);

    const quickView = useRecoilValue(quickViewAtom);
   

    const loginAndVisitCart = async () => {
        if (!isAuthenticated) {
            navigate("/signin")
        } else {
            navigate("/cart");
        }
    };
    

    
    // const filteredProducts = (products ?? []).filter((product) => {
    //     const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    //     const matchesCategory = filterCategory === "all" 
    //     return matchesSearch && matchesCategory
    // })

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === "all" || product.name.toLowerCase().includes(filterCategory.toLowerCase())
        return matchesSearch && matchesCategory
    })

    const openWhatsApp = () => {
        window.open('https://wa.me/918448455466?text=Hello!', '_blank');
    };


    const sortedProducts = [...filteredProducts ?? []].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price
            case "price-high":
                return b.price - a.price
            case "rating":
                return b.rating - a.rating
            case "popular":
                return b.popular ? 1 : -1
            default:
                return 0
        }
    })


    const sliders = images
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

                            <Button onClick={loginAndVisitCart} classname="h-10 flex justify-center items-center text-white px-2  rounded-lg py-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                <span className="hidden md:block">Cart </span>
                            </Button>

                        </div>
                    </div>
                </div>
            </header>

            {/* Page Header */}
            <section className="py-12 bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Luxury Diwali Collections</h1>
                        <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                            Explore our curated selection of exquisite diyas and gourmet delights, crafted to elevate your Diwali
                            gifting experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters and Search */}
            <section className="py-8 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="relative border py-1.5 rounded-lg focus-within:border-2 focus-within:border-black ">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 outline-none font-extralight"
                                />
                            </div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-48 border rounded-lg p-2 font-light text-sm"
                            >
                                <option value="all">All Categories</option>
                                {/* <option value="combo">Diya & Dry Fruits Combo</option> */}
                                <option value="Premium">Premium Hampers</option>
                                <option value="Round & Flower">Luxury Collections</option>
                                <option value="matki">Matki Diyas Only</option>
                                <option value="diya">Diyas Only</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-48 border rounded-lg p-2 font-light text-sm"
                            >
                                <option value="featured">Featured</option>
                                <option value="popular">Most Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <div>
                {!quickView ?
                    <section className="py-12">
                        <div className="container mx-auto px-4">
                            <div className="mb-8">
                                <p className="text-gray-600">
                                    Showing {sortedProducts.length} of {(products ?? []).length} products
                                </p>
                            </div>

                            {loading ?
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                                    <ProductSkeleton />
                                    <ProductSkeleton />
                                    <ProductSkeleton />
                                </div>


                                :
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {sortedProducts.map((product, index) => (
                                        <ProductCardFull
                                            key={index}
                                            id={product.id}
                                            popular={product.popular}
                                            image={product.image}
                                            name={product.name}
                                            inStock={product.inStock}
                                            rating={product.rating}
                                            reviews={product.reviews}
                                            description={product.description}
                                            price={product.price}
                                            originalPrice={product.originalPrice}
                                            features={product.features}
                                        />
                                    ))}
                                </div>
                            }

                            {
                                sortedProducts.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 mb-4">
                                            <Search className="h-16 w-16 mx-auto" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                    </div>
                                )
                            }
                        </div>
                    </section>
                    :
                    <PhotoSilder Sliders={sliders} />
                }
            </div>


            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Bespoke Luxury Collections</h2>
                    <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                        Elevate your corporate gifting with our bespoke service, creating unique Diwali collections tailored to your
                        brand and discerning clientele.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/" className="flex justify-center items-center bg-white text-sm rounded-lg h-10 px-4 text-orange-600 hover:bg-gray-100">
                            Get Custom Quote
                        </Link>
                        <Button onClick={openWhatsApp} classname="border-white text-sm rounded-lg h-10 px-4 border text-white hover:bg-white/10 bg-transparent">
                            Contact Sales Team
                        </Button>
                    </div>
                </div>
            </section>
        </div>

    )
}
