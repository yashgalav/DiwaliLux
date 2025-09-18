import { useEffect } from "react";
import LabelledInput from "./LabelledInput";
import { useRecoilState } from "recoil";
import { deliveryDistrictAtom, deliveryPersonAddressAtom, deliveryPersonNameAtom, deliveryPersonNumberAtom, deliveryPincodeAtom, deliveryStateAtom, isDeliveryPolicyCheckedAtom } from "../store/Atom";
import { Bounce, toast } from "react-toastify";


interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCloseX: () => void;
}

export default function AdressPopup({ isOpen, onClose, onCloseX, onConfirm }: PopupProps) {
  const [, setAddress] = useRecoilState(deliveryPersonAddressAtom);
  const [, setName] = useRecoilState(deliveryPersonNameAtom);
  const [, setNumber] = useRecoilState(deliveryPersonNumberAtom);
  const [, setPincode] = useRecoilState(deliveryPincodeAtom);
  const [state, setState] = useRecoilState(deliveryStateAtom);
  const [district, setDistrict] = useRecoilState(deliveryDistrictAtom);
  const [isChecked, setIsChecked] = useRecoilState(isDeliveryPolicyCheckedAtom);


  
  const handlePincodeChange = async (value: string) => {

    if (/^\d{6}$/.test(value)) {
      try {

        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await response.json();

        if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
          setState(data[0].PostOffice[0].State);
          console.log(data[0].PostOffice[0].State);

          setDistrict(data[0].PostOffice[0].District);
        } else {
          setState("");
          setDistrict("");
          const errorMessage = "Invalid Pincode!";
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
      } catch (err: any) {
        console.error("Error fetching location data:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch location!";
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


        setState("");
        setDistrict("");
      }
    } else {
      // Reset when pincode is not 6 digits
      setState("");
      setDistrict("");
    }
  };


//   const handlePincodeChange = async (value: string) => {
//   if (/^\d{6}$/.test(value)) {
//     try {
//       // ✅ Lookup from offline pincode data
//       const details = pincodeDirectory[value];

//       if (details) {
//         setState(details.stateName);
//         setDistrict(details.district);
//         console.log("State:", details.stateName, "District:", details.district);
//       } else {
//         // If pincode not found
//         setState("");
//         setDistrict("");
//         toast.error("Invalid Pincode!", {
//           position: "top-center",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//           transition: Bounce,
//         });
//       }
//     } catch (err: any) {
//       console.error("Error fetching location data:", err);
//       toast.error("Failed to fetch location!", {
//         position: "top-center",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: false,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         transition: Bounce,
//       });

//       setState("");
//       setDistrict("");
//     }
//   } else {
//     // Reset when pincode is not 6 digits
//     setState("");
//     setDistrict("");
//   }
// };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseX();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCloseX]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 ">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn mx-4">
        {/* Close button */}
        <button
          onClick={onCloseX}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-orange-500">Delivery Details:</h2>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <LabelledInput label="Name" placeholder="Ram"
            onChange={(e) =>
              setName(
                e.target.value.toLocaleUpperCase()
              )}
          />
          <LabelledInput max={10} type="number" label="Phone no." placeholder="+91 9833X XXXXX"
            onChange={(e) =>
              setNumber(
                e.target.value
              )}
          />
          <LabelledInput label="Address" placeholder="Bulding no.1 XXXXXX "
            onChange={(e) =>
              setAddress(
                e.target.value
              )}
          />
          <LabelledInput max={6} type="number" label="PinCode" placeholder="Search Pincode"
            onChange={(e) => {
              setPincode(e.target.value)
              handlePincodeChange(e.target.value)
            }}
          />

          <LabelledInput label="District" placeholder="New Delhi"
            onChange={(e) =>
              setDistrict(
                e.target.value
              )}
            value={district}
          />
          <LabelledInput label="State" placeholder="Delhi"
            onChange={(e) =>
              setState(
                e.target.value
              )}
            value={state}
          />
        </div>


        <label className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
          <input
            type="checkbox"
            name="deliveryPolicy"
            value="accepted"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span>
            I understand delivery charges are not included; I’ve read the{" "}
            <a
              className="underline text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
              href="https://ik.imagekit.io/1fitxmo7x/Delivery%20&%20Shipping%20Policy.pdf?updatedAt=1757256005179"
            >
              Delivery Policy
            </a>
            . <span className="text-red-600">*</span>
          </span>
        </label>


        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

