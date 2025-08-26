import React from 'react';
import Image from 'next/image';
import { ChevronRight, Package } from 'lucide-react';

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
  image: CategoryImage | null; // Updated to object with url
  subcategoryCount: number;
  subcategories: Subcategory[];
}

interface CategoryGridProps {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
  activeCategory: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onCategoryClick,
  activeCategory,
}) => {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <div className="text-center mt-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Browse Our Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our variety of delicious food categories, each carefully curated with premium ingredients and authentic flavors
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => onCategoryClick(category)}
            className={`group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:scale-105 ${
              activeCategory === category.name ? 'ring-4 ring-amber-400 shadow-2xl scale-105' : ''
            } relative flex flex-col`}
          >
            {/* Category Image and overlays */}
            <div className="relative w-full h-56">
              {category.image?.url ? (
                <Image
                  src={category.image.url}
                  alt={category.name}
                  width={400}
                  height={224}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  style={{ width: '100%', height: '100%' }}
                  unoptimized
                />
              ) : (
                // Fallback UI when no image is available
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <Package size={48} className="text-amber-600 opacity-50" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Subcategory Count Badge */}
              {category.subcategoryCount > 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                  <Package size={12} className="inline mr-1" />
                  {category.subcategoryCount}
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-white/25 backdrop-blur-md rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                  <ChevronRight className="text-white drop-shadow-lg" size={28} />
                </div>
              </div>

              {/* Category Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-white font-bold text-lg mb-1">{category.name}</h3>
                <p className="text-white/90 text-sm">Click to explore</p>
              </div>
            </div>

            {/* Category Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                {category.description}
              </p>

              {/* Status and Action */}
              <div className="flex items-center justify-between">
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                  category.status === 'active'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {category.status === 'active' ? '● Available' : '○ Unavailable'}
                </span>
                <span className="text-amber-600 text-sm font-bold group-hover:text-amber-700 flex items-center">
                  Explore
                  <ChevronRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;