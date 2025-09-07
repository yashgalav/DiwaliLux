import { atom} from "recoil";
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'appPersist',            // storage key
  storage: localStorage,        // or sessionStorage
});


export const quickViewAtom = atom({
    key: "quickViewAtom",
    default: false
})

export const inputAtom = atom({
    key: "inputAtom",
    default: ""
})

export const sliderAtom = atom({
    key: "sliderAtom",
    default: []
})

export const isAuthenticatedAtom = atom({
    key:"isAuthenticatedAtom",
    default: false,
    effects_UNSTABLE: [persistAtom],
})

export const loggedInUserNameAtom = atom({
    key:"loggedInUserNameAtom",
    default: "Guest User",
    effects_UNSTABLE: [persistAtom],
})


export const deliveryPersonNameAtom = atom({
    key: "deliveryPersonNameAtom",
    default: ""
})

export const deliveryPersonNumberAtom = atom({
    key: "deliveryPersonNumberAtom",
    default: ""
})

export const deliveryPersonAddressAtom = atom({
    key: "deliveryPersonAddressAtom",
    default: ""
})

export const deliveryPincodeAtom = atom({
    key: "deliveryPincodeAtom",
    default: ""
})

export const deliveryDistrictAtom = atom({
    key: "deliveryDistrictrAtom",
    default: ""
})

export const deliveryStateAtom = atom({
    key: "deliveryStateAtom",
    default: ""
})

export const isDeliveryPolicyCheckedAtom = atom({
    key: "isDeliveryPolicyCheckedAtom",
    default: false
})