"use client";
import React, { useState } from 'react';
import { initializePayment } from '@/libs/api';

interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  subCategory: {
    _id: string;
    name: string;
  };
  status: string;
  stock: string;
  image: string;
  quantity: number;
}

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  onPaymentSuccess: () => void;
  onBackToCategory: () => void; // New prop for back to category functionality
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  onPaymentSuccess,
  onBackToCategory,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',        
    address: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    address: false,
    email: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.email) {
      setError('Please fill in all fields.');
      return false;
    }
    if (!/^(\+234|0)[789][01]\d{8}$/.test(formData.phone)) {
      setError('Please enter a valid Nigerian phone number.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
        }
      )),
        email: formData.email,
        phone: formData.phone,
        amount: totalAmount,
        address: formData.address
      };

      console.log(orderData, "order data before payment initialization");
      const response = await initializePayment(orderData);
      console.log(response, "response from payment initialization");
      if (response.data?.authorization_url) {
        window.location.href = response.data.authorization_url; // Redirect to Paystack
      } else {
        onPaymentSuccess();
      }  
    } catch (error: any) {
      console.error('Error submitting order:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };  

  const getInputClass = (fieldName: string) => {
    const isError = touched[fieldName as keyof typeof touched] && !formData[fieldName as keyof typeof formData];
    return `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
      isError ? 'border-red-500' : 'border-gray-300'
    }`;
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-all duration-300 flex items-center justify-center p-4 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-transform duration-300 scale-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Complete Your Order</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 cursor-pointer transition-colors"
              aria-label="Close checkout"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <p className="mt-2 opacity-90">Total: <span className="font-semibold">N{totalAmount.toFixed(2)}</span></p>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-start">
              <i className="fas fa-exclamation-circle mt-1 mr-2"></i>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={getInputClass('name')}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={getInputClass('email')}
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={getInputClass('phone')}
                placeholder="e.g., 08012345678 or +2348012345678"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Format: 08012345678 or +2348012345678</p>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  touched.address && !formData.address ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
                placeholder="Enter your complete delivery address"
                required
              ></textarea>
            </div>
            
            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'shadow-md hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z" />
                    </svg>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>
                    <span>Pay N{totalAmount.toFixed(2)} Securely</span>
                  </>
                )}
              </button>
              
                <button
                type="button"
                onClick={onBackToCategory}
                disabled={isSubmitting}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                <i className="fas fa-arrow-left"></i>
                <span>Back to Category</span>
                </button>
            </div>
          </form>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <i className="fas fa-shield-alt mr-2 text-blue-500"></i>
              <span>Your payment information is securely encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;