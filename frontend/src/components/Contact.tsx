
import { Button } from './Button'
import { Badge } from './Badge'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useRef, useState } from 'react';
import emailjs from "@emailjs/browser";
import { Bounce, toast } from 'react-toastify';

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [requirement, setRequirement ] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [excutiveMail, setExcutiveMail] = useState("");
  const [number, setNumber] = useState("");
  const [qty, setQty] = useState("");

 
  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!companyName.trim()) {
      toast.error("Company Name is required");
      return; // Save a network request
    }
    if (!excutiveMail.trim()) {
      toast.error("Email is required");
      return; // Save a network request
    }
    if (!number.trim()) {
      toast.error("Contact is required");
      return; // Save a network request
    }
    if (!qty.trim()) {
      toast.error("Quantity is required");
      return; // Save a network request
    }
    if (!requirement.trim() ) {
      toast.error("Specific Requirements & Preferences is required")   
       return; // Save a network request
    }
     
    if (!formRef.current) return;

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,   // your service id
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,  // your template id
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY    // your public key
      );
      
      toast.success("Consultation request sent successfully!", {
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
    } catch (error) {
      toast.error("Failed to send request. Please try again.", {
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
  return (
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Badge classname="bg-amber-100/20 font-extralight  text-sm text-amber-200 px-4 py-2 rounded-full mb-6">Get In Touch</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold my-8">
            Ready to Create{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Memorable
            </span>{" "}
            Celebrations?
          </h2>
          <p className="text-xl mb-10 text-slate-300 font-light leading-relaxed">
            Connect with our luxury gifting consultants for bespoke corporate Diwali solutions, custom hampers, and
            exclusive bulk arrangements.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-medium">+91 8448 455 466</div>
                <div className="text-slate-400 text-sm">Premium Support Line</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-medium">luxury@diwalilux.com</div>
                <div className="text-slate-400 text-sm">Executive Consultations</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-medium">New Delhi, Delhi</div>
                <div className="text-slate-400 text-sm">Luxury Showroom & Atelier</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="p-10">
            <h3 className="text-2xl font-bold mb-8 text-white">Bespoke Consultation</h3>
            <form onSubmit={sendEmail} ref={formRef} className="space-y-6">
              <div>
                <input
                  name="companyName"
                  type="text"
                  placeholder="Company Name"
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  onChange={(e) => {
                    setCompanyName(e.target.value)
                  }}
                />
              </div>
              <div>
                <input
                  name="executiveEmail"
                  type="email"
                  placeholder="Executive Email"
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  onChange={(e) => {
                    setExcutiveMail(e.target.value)
                  }}
                />
              </div>
              <div>
                <input
                  name="contactNumber"
                  type="tel"
                  placeholder="Contact Number"
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  onChange={(e) => {
                    setNumber(e.target.value)
                  }}
                />
              </div>
              <div>
                <input
                  name="estimatedQuantity"
                  type="number"
                  placeholder="Estimated Quantity"
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  onChange={(e) => {
                    setQty(e.target.value)
                  }}
                />
              </div>
              <div>
                <textarea
                  name={"requirements"}
                  placeholder="Specific Requirements & Preferences"
                  rows={4}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  onChange={(e) => {
                    setRequirement(e.target.value)
                  }}
                ></textarea>
              </div>
              <Button type="submit" classname="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                Request Consultation
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
