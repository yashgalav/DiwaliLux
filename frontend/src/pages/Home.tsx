import { Button } from "../components/Button"
// import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "../components/Badge"
import { Sparkles, Star, ArrowRight, Crown, Award, Shield, LogInIcon } from "lucide-react"
// import Image from "next/image"

import { Card } from "../components/Card"
import ProductCard from "../components/ProductCard";
import FeedBackCard from "../components/FeedBackCard";
import Contact from "../components/Contact";
import { Link } from "react-router-dom";
import { Link as LinkScroll } from 'react-scroll';

import Profile from "../components/Profile";
import { useRecoilValue } from "recoil";
import { isAuthenticatedAtom } from "../store/Atom";
import Hero from "../assets/hero-diya.jpg";



export default function HomePage() {
  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
  const openWhatsApp = () => {
    window.open('https://wa.me/918448455466?text=Hello!', '_blank');
  };

  const features = [
    {
      icon: <Crown className="h-8 w-8" />,
      title: "Luxury Corporate Gifts",
      description:
        "Exquisitely handcrafted diyas and premium dry fruits curated for distinguished corporate celebrations",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Bespoke Bulk Solutions",
      description: "Tailored pricing and custom packaging solutions for prestigious corporate bulk orders",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Premium Quality Assurance",
      description: "Meticulously crafted collections with elegant gift presentation and custom branding excellence",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Tech Solutions Ltd",
      rating: 5,
      text: "Exceptional quality and presentation. Our executives were thoroughly impressed with the premium Diwali hampers.",
      avatar: "",
    },
    {
      name: "Priya Sharma",
      company: "Marketing Pro Inc",
      rating: 5,
      text: "Unparalleled service and exquisite packaging. The perfect choice for our corporate Diwali celebrations.",
      avatar: "",
    },
    {
      name: "Amit Patel",
      company: "Finance Corp",
      rating: 5,
      text: "Sophisticated presentation and premium quality. Our employees appreciated the thoughtful Diwali gesture.",
      avatar: "",
    },
  ]

  const product = [
    {
      name: "Heritage Diya & Nuts Ensemble",
      price: "₹899",
      originalPrice: "₹1,299",
      image: "/placeholder.svg?height=400&width=400",
      features: ["12 Artisan Diyas", "Premium Mixed Nuts 350g", "Silk-Lined Gift Box"],
      badge: "Bestseller",
      badgeColor: "from-emerald-500 to-teal-500",
    },
    {
      name: "Executive Diwali Hamper",
      price: "₹1,599",
      originalPrice: "₹2,199",
      image: "/placeholder.svg?height=400&width=400",
      features: ["18 Designer Diyas", "Gourmet Dry Fruits 500g", "Corporate Branding"],
      badge: "Most Popular",
      badgeColor: "from-amber-500 to-orange-500",
    },
    {
      name: "Maharaja Collection",
      price: "₹2,499",
      originalPrice: "₹3,299",
      image: "/placeholder.svg?height=400&width=400",
      features: ["24 Gold-Accent Diyas", "Exotic Dry Fruits 750g", "Handcrafted Wooden Box"],
      badge: "Exclusive",
      badgeColor: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <div className=" min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-amber-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
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
            <nav className="hidden md:flex items-center space-x-10">
              <LinkScroll
                to="home"
                className="text-slate-700 hover:text-amber-600 transition-all duration-300 cursor-pointer "
              >
                Home
              </LinkScroll>
              <Link
                to="/products"
                className="text-slate-700 hover:text-amber-600 transition-all duration-300  "
              >
                Collections
              </Link>
              <LinkScroll
                to="about"
                className="text-slate-700 hover:text-amber-600 transition-all duration-300 cursor-pointer "
              >
                About
              </LinkScroll>
              <Button
                onClick={openWhatsApp}
                classname="text-slate-700 border-green-400 border px-2 py-1 hover:shadow-2xl rounded-lg hover:text-white hover:bg-green-400 transition-all duration-300 cursor-pointer "
              >
                WhatsApp
              </Button>
            </nav>
            <div className="flex justify-center items-center gap-2">
              <LinkScroll to="contact" className="hidden md:block bg-gradient-to-r cursor-pointer text-sm from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white  px-6 py-2.5  rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ">
                Bespoke Quote
              </LinkScroll>
              {!isAuthenticated && <Link to={"/signin"} className="p-1 rounded-full hover:bg-amber-300">
                <div className="p-4 border-2 border-amber-200 bg-amber-100 text-orange-400 rounded-full flex items-center justify-center">
                  <LogInIcon />
                </div>
              </Link>}
              
              {isAuthenticated && <Profile />}

            </div>

          </div>

        </div>

      </header>
      {/* <LogoutBox/> */}


      {/* Hero Section */}
      <section id="home" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-orange-100/10 to-red-100/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side */}
            <div className="space-y-10">
              <div className="space-y-6">
                <Badge classname="bg-gradient-to-r text-sm font-extralight from-amber-100 to-orange-100 text-amber-800 border border-amber-200 px-4 py-2 rounded-full ">
                  ✨ Luxury Diwali Collections 2025
                </Badge>
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                    <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent">
                      Exquisite
                    </span>
                    <br />
                    <span className="text-slate-800">Corporate</span>
                    <br />
                    <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                      Diwali Gifts
                    </span>
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed max-w-xl font-light">
                    Meticulously curated collections of handcrafted diyas and premium dry fruits,
                    designed for distinguished corporate celebrations and executive gifting.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 ">

                <Link to={"/products"} className="flex justify-center items-center bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 h-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ">
                  Explore Collections
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>

                <LinkScroll to="contact" className=" cursor-pointer flex justify-center items-center border-2 text-lg h-10 border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-4 rounded-xl  bg-white/50 backdrop-blur-sm transition-all duration-300">
                  Custom Consultation
                </LinkScroll>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    500+
                  </div>
                  <div className="text-sm text-slate-600 font-medium">Premium Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    50K+
                  </div>
                  <div className="text-sm text-slate-600 font-medium">Gifts Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    4.9★
                  </div>
                  <div className="text-sm text-slate-600 font-medium">Excellence Rating</div>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-3xl blur-3xl transform rotate-6"></div>
              <div className="relative  bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse"></div>

                {/* Replace Next.js Image with normal img */}
                <img
                  src={Hero}
                  alt="Luxury Diwali Collection"
                  className="w-full h-[640px] rounded-2xl"
                />

                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-4 border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">Premium Collection</div>
                      <div className="text-sm text-slate-600">Handcrafted Excellence</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 space-y-8">
            <Badge classname="bg-gradient-to-r text-sm font-extralight from-amber-100 to-orange-100 text-amber-800 border border-amber-200 px-4 py-2 rounded-full ">Why Choose DiwaliLux</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-800">
              Crafted for{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              Every piece in our collection represents the pinnacle of craftsmanship and quality, designed specifically
              for discerning corporate clients.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <Card
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section
        id="collections"
        className="py-24 bg-gradient-to-br from-slate-50 to-amber-50/30 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-100/10 via-transparent to-orange-100/10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 space-y-8">
            <Badge classname="bg-gradient-to-r font-extralight border border-amber-200 text-sm from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-full mb-6">
              Signature Collections
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-800">
              Our{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Masterpieces
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light">
              Meticulously curated for the most distinguished celebrations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            {product.map((product, index) => (
              <ProductCard
                key={index}
                name={product.name}
                imageUrl={product.image}
                price={product.price}
                originalPrice={product.originalPrice}
                badge={product.badge}
                badgeColor={product.badgeColor}
                features={product.features}


              />

            ))}
          </div>

          <div className="flex justify-center">
            <Link to={"/products"}
              className="flex justify-center items-center border-2 border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-2 rounded-xl text-lg font-medium bg-white/70 backdrop-blur-sm"
            >
              View Complete Collection
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-8">
            <Badge classname="bg-amber-100 text-sm font-extralight border border-amber-200 text-amber-800 px-4 py-2 rounded-full mb-6">Client Testimonials</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-800">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light">Hear from our distinguished clientele</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <FeedBackCard
                name={testimonial.name}
                rating={testimonial.rating}
                text={testimonial.text}
                companyName={testimonial.company}
                avatar={testimonial.avatar}
                key={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 bg-gradient-to-br from-slate-900 via-amber-900/20 to-orange-900/30 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-amber-900/40"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>

        <Contact />
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">DiwaliLux</span>
                  <div className="text-xs text-amber-400 font-medium tracking-wider">PREMIUM GIFTING</div>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed font-light max-w-md">
                Curating exceptional Diwali experiences through meticulously handcrafted diyas and premium dry fruits
                collections for distinguished corporate celebrations.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Collections</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <Link to="#" className="hover:text-amber-400 transition-colors duration-300">
                    Heritage Ensembles
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-amber-400 transition-colors duration-300">
                    Executive Hampers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-amber-400 transition-colors duration-300">
                    Maharaja Collections
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-amber-400 transition-colors duration-300">
                    Bespoke Solutions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Services</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <Link to="#" className="hover:text-amber-400 transition-colors duration-300">
                    Corporate Gifting
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-amber-400 transition-colors duration-300">
                    Custom Branding
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-amber-400 transition-colors duration-300">
                    Bulk Solutions
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-amber-400 transition-colors duration-300">
                    White Glove Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              &copy; 2025 DiwaliLux. All rights reserved. Crafted with excellence for premium celebrations.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">
                Privacy
              </Link>
              <Link to="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">
                Terms
              </Link>
              <Link to="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
