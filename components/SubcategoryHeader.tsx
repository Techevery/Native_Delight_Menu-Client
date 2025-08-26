import React from 'react';
import { ArrowLeft, Tag, Package } from 'lucide-react';

interface SubcategoryHeaderProps {
  categoryName: string;
  subcategoryName: string;
  itemCount: number;
  onBack: () => void;
}

const SubcategoryHeader: React.FC<SubcategoryHeaderProps> = ({
  categoryName,
  subcategoryName,
  itemCount,
  onBack,
}) => {
  return (
    <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-all duration-300 bg-gray-100 hover:bg-amber-50 px-4 py-2 rounded-lg font-medium"
          >
            <ArrowLeft size={18} />
            <span>Back to Categories</span>
          </button>
          <div className="hidden sm:block h-8 w-px bg-gray-300" />
          <div className="flex items-center space-x-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Tag className="text-amber-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                {subcategoryName}
              </h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <span>in <span className="font-semibold text-amber-600">{categoryName}</span></span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Package size={14} />
                  <span className="font-semibold">{itemCount}</span>
                  <span>items available</span>
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Item Count Badge */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full shadow-lg">
          <span className="font-bold text-lg">{itemCount}</span>
          <span className="text-sm ml-1">Items</span>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryHeader;