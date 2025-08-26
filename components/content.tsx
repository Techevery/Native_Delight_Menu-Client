"use client";

import React, { useState, useEffect } from 'react';
import { getCategories, getMenuItems } from '../libs/api';
import Menu from './menu';
import Cart from './cartPage';
import CategoryGrid from './CategoryGrid';
import CategoryModal from './CategoryModal';
import SubcategoryHeader from './SubcategoryHeader';
import Carousel from '../components/Carousel';
import { MapPin, MessageCircle,Phone, Mail } from 'lucide-react';


interface MenuItemsResponse {
  success: boolean;
  products: MenuItem[];
  summary?: {
    totalProducts: number;
    totalActive: number;
    totalInStock: number;
    totalOutOfStock: number;
  };
}

interface CategoriesResponse {
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
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Subcategory {
  name: string;
  _id: string;
}

interface CategoryImage {
  url: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  status: string;
  image: CategoryImage | null;
  subcategoryCount: number;
  subcategories: Subcategory[];
}

const Foodmenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'categories' | 'subcategory'>('categories');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubcategoryItems, setSelectedSubcategoryItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsResponse, categoriesResponse] = await Promise.all([ 
          getMenuItems(),
          getCategories(),
        ]);
        
        console.log("categories response", categoriesResponse);
        console.log("items response", itemsResponse); 
        
        let menuItemsData: MenuItem[] = [];

        if (Array.isArray(itemsResponse)) {
          menuItemsData = (itemsResponse as any[]).map((item: any) => ({
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            subCategory: item.subCategory,
            status: item.status,
            stock: item.stock,
            image: item.image,
          }));
        } else if (itemsResponse && typeof itemsResponse === 'object' && 'success' in itemsResponse) {
          menuItemsData = (itemsResponse as MenuItemsResponse).success
            ? (itemsResponse as MenuItemsResponse).products.map((item: any) => ({
                _id: item._id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                subCategory: item.subCategory,
                status: item.status,
                stock: item.stock,
                image: item.image,
              }))
            : [];
        }
        
        let categoriesData: Category[] = [];
        
        if (Array.isArray(categoriesResponse)) {
          categoriesData = categoriesResponse.map((cat: any) => ({
            ...cat,
            image: typeof cat.image === 'string'
              ? { url: cat.image }
              : cat.image || null,
          }));
        } else if (categoriesResponse && typeof categoriesResponse === 'object' && 'success' in categoriesResponse) {
          categoriesData = (categoriesResponse as CategoriesResponse).success 
            ? (categoriesResponse as CategoriesResponse).categories.map((cat: any) => ({
                ...cat,
                image: typeof cat.image === 'string'
                  ? { url: cat.image }
                  : cat.image || null,
              }))
            : [];
        }
        
        setMenuItems(menuItemsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load menu or categories. Please try again later.');
        setLoading(false);
        console.error('Error fetching menu items or categories:', err);
      }
    };

    fetchData();
  }, []);

  const filteredItems = selectedSubcategoryItems.length > 0 
    ? selectedSubcategoryItems 
    : menuItems.filter(item => {
        if (viewMode === 'subcategory' && activeSubcategory) {
          return item.category.name === activeCategory && item.subCategory.name === activeSubcategory; 
        }
        return item.category.name === activeCategory;
      });

  useEffect(() => {
    if (cartItems.length === 0) {  
      setIsCartOpen(false);
    }
  }, [cartItems]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleSubcategorySelect = (categoryName: string, subcategoryName: string, items: MenuItem[] = []) => {
    setActiveCategory(categoryName);
    setActiveSubcategory(subcategoryName);
    setSelectedSubcategoryItems(items);
    setViewMode('subcategory');
  };

  const handleBackToCategories = () => {
    setViewMode('categories');
    setActiveCategory('');
    setActiveSubcategory('');
    setSelectedSubcategoryItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    if (getTotalItems() === 0) {
      setIsCartOpen(false);
    }
  }, [cartItems]);

  // Carousel effect
  const totalItems = getTotalItems();
  useEffect(() => {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    slides[0].classList.add('opacity-100');

    const interval = setInterval(() => {
      slides[currentSlide].classList.remove('opacity-100');
      const nextSlide = (currentSlide + 1) % slides.length;
      slides[nextSlide].classList.add('opacity-100');
      setCurrentSlide(nextSlide);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, totalItems]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
        <i className="fas fa-utensils text-amber-600 text-2xl mr-2"></i>
        <h1 className="text-2xl font-bold text-gray-800">Native Delight Plus</h1>
        </div>
        <button
        onClick={() => setIsCartOpen(true)}
        className="relative !rounded-button whitespace-nowrap bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer hover:bg-amber-700 transition-colors"
        >
        <i className="fas fa-shopping-cart mr-2"></i>
        <span>Cart</span>
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {getTotalItems()}
          </span>
        )}
        </button>
      </div>
      </header>

      <main className="container mx-auto px-4 py-8">
      {viewMode === 'categories' ? (
        <>
        {/* Hero Section with Carousel Background */}
        <Carousel/>
        {/* Loading and Error States */}
        {loading ? (
          <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto "></div>
          <p className="text-gray-600">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600">{error}</p>
          </div>
          </div>
        ) : (
          <CategoryGrid
          categories={categories}
          onCategoryClick={handleCategoryClick}
          activeCategory={activeCategory}
          />
        )}
        </>
      ) : (
        <>
        {/* Subcategory View */}
        <SubcategoryHeader
          categoryName={activeCategory}
          subcategoryName={activeSubcategory}
          itemCount={filteredItems.length}
          onBack={handleBackToCategories}
        />

        {/* Menu Items for Subcategory */}
        {filteredItems.length > 0 ? (
          <Menu filteredItems={filteredItems} addToCart={addToCart} />
        ) : (
          <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">🍽️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Items Found</h3>
            <p className="text-gray-600">
            No menu items available in this subcategory at the moment.
            </p>
          </div>
          </div>
        )}
        </>
      )}
      </main>

      {/* Cart Component */}
      <Cart
      cartItems={cartItems}
      setCartItems={setCartItems}
      isCartOpen={isCartOpen}
      setIsCartOpen={setIsCartOpen}
      orderPlaced={orderPlaced}
      setOrderPlaced={setOrderPlaced}
      onBackToCategory={handleBackToCategories}
      />

      {/* Category Modal */}
      <CategoryModal
      isOpen={isCategoryModalOpen}
      onClose={() => setIsCategoryModalOpen(false)}
      category={selectedCategory}
      onSubcategorySelect={handleSubcategorySelect as any}
      menuItems={menuItems}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Native Delight Plus</h3>
          <p className="text-gray-300">
            Serving exquisite delicacies since 2020. Our passion is to create memorable dining experiences.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Hours</h3>
          <ul className="text-gray-300">
            <li>Monday - Friday: 8am - 12pm</li>
            <li>Saturday: 10am - 11pm</li>
            <li>Sunday: 10am - 9pm</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-center mb-2">
          <MapPin className="w-5 h-5 mr-2 text-red-400" />
          <a
            rel="ugc"
            href="https://www.google.com/maps/search/?api=1&query=Native+Delight,+John+Great+Court,+1+Femi+Bamgbelu+Street,+10+Alternative+Rte,+Chevron+Dr,+opposite+Cromwell+Estate,+Eti-Osa,+Lagos+105102,+Lagos"
            target="_blank"
            className="underline text-amber-400"
          >
            Lagos&nbsp;
          </a>
            </li>
            <li className="flex items-center mb-2">
          <Phone className="w-5 h-5 mr-2 text-orange-400" />
          <a href="tel:+2348142809371" className="underline text-amber-400">
            +234 806 235 6647
          </a>
            </li>
            <li className="flex items-center mb-2">
          <MessageCircle className="w-5 h-5 mr-2 text-green-400" />
          <a
            href="https://api.whatsapp.com/message/ROMUWTYUJ5YLJ1?autoload=1&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-amber-400"
          >
            +234 814 280 9371
          </a>
            </li>
          
            <li className="flex items-center mb-2">
            
          {/* Facebook SVG icon from Simple Icons */}
          <svg className="w-5 h-5 mr-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 10.995 10.125 11.854v-8.385H7.078v-3.47h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.953.926-1.953 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.068 24 18.092 24 12.073z"/>
          </svg><br />
          <a
            href="https://web.facebook.com/profile.php?id=61572401940381"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-amber-400"
          >
             Native Delight Plus
          </a>
            </li>
            
            <li className="flex items-center">
          {/* Instagram SVG icon from Simple Icons */}
      
          <svg className="w-5 h-5 mr-2 text-red-950" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.659.388 3.678 1.37 2.697 2.351 2.437 3.463 2.379 4.744 2.321 6.024 2.309 6.433 2.309 12c0 5.567.012 5.976.07 7.256.058 1.281.318 2.393 1.299 3.374.981.981 2.093 1.241 3.374 1.299 1.28.058 1.689.07 7.256.07s5.976-.012 7.256-.07c1.281-.058 2.393-.318 3.374-1.299.981-.981 1.241-2.093 1.299-3.374.058-1.28.07-1.689.07-7.256s-.012-5.976-.07-7.256c-.058-1.281-.318-2.393-1.299-3.374-.981-.981-2.093-1.241-3.374-1.299C15.667.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>
          <a
            href="https://www.instagram.com/native_delightpl5?igsh=YzljYTk1ODg3Zg=="
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-amber-400"
          >
            Native Delight Plus
          </a>
            </li>
            <li className="flex items-center mt-2">
          <Mail className="w-5 h-5 mr-2 text-amber-400" />
          <a
            href="mailto:info@nativedelightplus.com"
            className="underline text-amber-400"
          >
            info@nativedelightplus.com
          </a>
            </li>
          </ul>
        </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Native Delight Plus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Foodmenu;