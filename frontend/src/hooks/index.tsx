import { useEffect, useState } from "react";
import { inputAtom } from "../store/Atom";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { BACKEND_URL } from "../config";


interface products {
    id: string,
    name: string,
    description: string,
    price: number,
    originalPrice: number,
    features: string[],
    inStock: boolean,
    image: string,
    rating: number,
    reviews: number,
    popular: boolean
}
export const useProducts = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<products[]>([]);
    const inputValue = useRecoilValue(inputAtom);

    const debouncedValue = useDebounce(inputValue, 500);


    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/product/products?search=${debouncedValue || ""}&page=1&limit=5`)
            .then(response => {

                const items = response.data?.data?.items
                    ?? response.data?.items
                    ?? response.data?.data
                    ?? [];
                setProducts(items);

                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    }, [debouncedValue]);

    return {
        loading,
        products
    }
}

export default function useDebounce(inputValue: string, timeout: number) {
    const [debouncedValue, setDebouncedValue] = useState(inputValue);

    useEffect(() => {
        let timeOutNumber = setInterval(() => {
            setDebouncedValue(inputValue);
        }, timeout)

        // clearing the old clock for the for we can start new clock and once we 
        // reached at that point where no key was pressed untill 500 ms
        return () => {
            clearInterval(timeOutNumber);
        }

    }, [inputValue, timeout])

    return debouncedValue
}

export interface CartItem {
    id: string;          // UUID string
    name: string;        // Product name
    quantity: number;    // 0 or more
    inStock: boolean;    // Availability
    price: number;       // Price in smallest unit (e.g., paise)
    originalPrice: number;
    image: string;       // Valid URL
    productId : string;
}

export interface Cart {
    subTotal: number;       // Total quantity of items
    subTotalPrice: number;  // Total price in smallest unit
    items: CartItem[];      // List of cart items
    hasOutOfStock: boolean;
}
export const useCartItems = () => {
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState<Cart | null>(null);
    const [item, setItem] = useState<CartItem[]>([]);
    const [subTotal, setSubTotal] = useState(0);
    const [hasOutOfStock, setHasOutOfStock] = useState(true)
    const [subTotalPrice, setSubTotalPrice] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const token = localStorage.getItem("authToken");
        axios.get(`${BACKEND_URL}/api/v1/cart/my`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (cancelled) return;
                const data =
                    response.data?.data?.items ??
                    response.data?.items ??
                    response.data?.data ??
                    [];
                if (Array.isArray(data)) {
                    const items: CartItem[] = data;
                    const subTotal = items.reduce((acc, it) => acc + (it.quantity ?? 0), 0);
                    const subTotalPrice = items.reduce((acc, it) => acc + (it.price ?? 0) * (it.quantity ?? 0), 0);
                    const hasOutOfStock =
                        response.data?.hasOutOfStock ??
                        items.some(it => (it.inStock === false || (it.quantity ?? 0) <= 0));
                    setCartItems({ items, subTotal, subTotalPrice, hasOutOfStock });
                } else {
                    setCartItems(data as Cart);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!cartItems) {
            setItem([]);
            setSubTotal(0);
            setSubTotalPrice(0);
            setHasOutOfStock(false);
            return;
        }
        setItem(cartItems.items ?? []);
        setSubTotal(cartItems.subTotal ?? 0);
        setSubTotalPrice(cartItems.subTotalPrice ?? 0);
        setHasOutOfStock(cartItems.hasOutOfStock ?? true)
    }, [cartItems]);

    return { loading, item, subTotal, subTotalPrice, hasOutOfStock };
};

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  image: string;
  name: string;
}

export interface Order {
  id: string;
  date: string;       // e.g. "Today"
  status: "PENDING" | "DELIVERED" | "CANCELLED" | string; // if you know all possible statuses, make it a union
  totalAmount: number;
  items: OrderItem[];
  isDeliver: boolean,
  isApplicableForCancel: boolean,
  address: string,
  pincode: string,
  district: string,
  state: string
}

export const useOrderItems = () => {

    const [orderItems, setOrderItems] = useState<Order[] | null>(null);


    useEffect(() => {
        
        const token = localStorage.getItem("authToken");
        axios.get(`${BACKEND_URL}/api/v1/order/my`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                setOrderItems(response.data.orders)
            });
    }, []);

    
    return {orderItems };
};
