import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Grid, List } from 'lucide-react';

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

interface MenuProps {
  filteredItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
}

const Menu: React.FC<MenuProps> = ({ filteredItems, addToCart }) => {
  const [viewMode, setViewMode] = useState<'card' | 'modal'>('card');

  // Card View (Original)
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filteredItems.map(item => (
        <div key={item._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="relative h-56 overflow-hidden">
            {item.image ? (
              <Image src={item.image}  alt={item.name} width={400} height={224} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" style={{ width: '100%', height: '100%' }} unoptimized />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span className="text-amber-600 text-2xl">🍽️</span>
              </div>
            )}
                                  
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
        
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              <span className="font-bold">₦{item.price.toLocaleString()}</span>
            </div>
            
          
            <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm text-xs font-bold">
              {item.stock}
            </div>
            
           
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={() => addToCart(item)}
                className="bg-white/90 backdrop-blur-sm text-amber-600 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-3">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                {item.name}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
              
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">
              {item.description}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-amber-600">₦{item.price.toLocaleString()}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                item.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.status === 'active' ? 'Available' : 'Unavailable'}
              </span>
            </div>
            
            <button
              onClick={() => addToCart(item)}
              disabled={item.status !== 'active'}
              className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                item.status === 'active'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus size={18} />
              <span>{item.status === 'active' ? 'Add to Cart' : 'Unavailable'}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Modal Style View (New)
  const ModalView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredItems.map(item => (
        <div key={item._id} className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 h-full">
          <div className="flex items-start mb-3">
            <div className="relative mr-3 flex-shrink-0">
              {item.image ? (
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden">
                  <Image 
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover"
                    unoptimized
                  />
                 
                  <span className={`absolute top-1 right-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    item.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.status === 'active' ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              ) : (
                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600 text-xl">🍽️</span>
              
                  <span className={`absolute top-1 right-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    item.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.status === 'active' ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                <h4 className="font-bold text-gray-800 text-base md:text-lg mb-1 line-clamp-2">{item.name}</h4>
                <p className="text-gray-600 text-xs md:text-sm mb-1 line-clamp-2">{item.description}</p>
                
                <p className="text-xs text-gray-500">
                  {item.subCategory?.name || 'No subcategory'}
                </p>
              </div>
           
              <div className="flex justify-end mt-2">
                <p className="text-amber-600 font-bold text-base md:text-lg">₦{item.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-medium">
              {item.stock}
            </span>
            <button
              onClick={() => addToCart(item)}
              disabled={item.status !== 'active'}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-1 ${
                item.status === 'active'
                  ? 'bg-amber-600 text-white hover:bg-amber-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus size={16} />
              <span className="text-sm">{item.status === 'active' ? 'Add' : 'Unavailable'}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* View Toggle */}
      <div className="flex justify-end mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setViewMode('card')}
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              viewMode === 'card' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid size={18} className="mr-2" />
            <span className="text-sm font-medium">List View</span>
          </button>
          <button
            onClick={() => setViewMode('modal')}
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              viewMode === 'modal' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List size={18} className="mr-2" />
            <span className="text-sm font-medium">Card View</span>
          </button>
        </div>
      </div>
      {viewMode === 'card' ? <ModalView /> : <CardView />}
    </div>
  );
};

export default Menu;