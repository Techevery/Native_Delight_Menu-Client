import axios, { AxiosInstance } from 'axios';

interface Category {
  _id: string;
  name: string;
  description: string;
  status: string;
  image: string;
  subcategoryCount: number;
  subcategories: any[];
  success: boolean;
  categories: Category[];
  totalCategories?: number;
  totalActiveCategories?: number;
  mostOrderedCategory?: any;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {name: string, subcategory: string};
  image: string;
  success: boolean;
  products: MenuItem[];
  summary?: {
    totalProducts: number;
    totalActive: number;
    totalInStock: number;
    totalOutOfStock: number;
  };
}

interface OrderItem {
    productId: string;
    quantity: number;
}

interface PaymentData {
    items: OrderItem[];
    amount: number;
    email: string;
    address: string;
    phone: string;
}


interface Banner {
  _id: string;
  name: string;
  image: {
    id: string;
    url: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all menu items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const response = await api.get('/product');
    return response.data.products;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

// Fetch all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/category');
    return response.data?.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Fetch all banners
export const getBanners = async (): Promise<Banner[]> => {
  try {
    const response = await api.get('/banner');
    return response.data?.banner || [];
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

// paymeent to paystack
export const initializePayment = async (items: PaymentData) => {
  console.log(items, "items in payment initialization");
  try {
    const response = await api.post('/order/checkout', items );
    console.log(response, "response from payment initialization");
    return response.data;
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
}

export default api;