import React, { useState } from 'react';
import Image from 'next/image';
import { X, ArrowRight, Package2, Utensils, Grid } from 'lucide-react';

interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  status: string;
  subCategory: {
    _id: string;
    name: string;
  };
}

interface Subcategory {
  name: string;
  _id: string;
  items?: Item[];
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

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSubcategorySelect: (categoryName: string, subcategoryName: string, items?: Item[]) => void;
  menuItems: Item[];
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSubcategorySelect,
  menuItems = []
}) => {
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>('all');
  // const [selectedView, setSelectedView] = useState<'all' | 'subcategory'>('all');
  
  if (!isOpen || !category) return null;

  // Get all items in this category
  const allCategoryItems = menuItems.filter(item => 
    item.subCategory && category.subcategories.some(sub => sub.name === item.subCategory.name)
  );

  // Enhance subcategories with their items
  const subcategoriesWithItems = category.subcategories.map(subcategory => {
    const subcategoryItems = menuItems.filter(item => 
      item.subCategory && item.subCategory.name === subcategory.name
    );
    
    return {
      ...subcategory,
      items: subcategoryItems
    };
  });

  const handleSubcategoryClick = (subcategoryId: string) => {
    setExpandedSubcategory(subcategoryId);
    // setSelectedView(subcategoryId === 'all' ? 'all' : 'subcategory');
  };

  const handleSubcategorySelect = (categoryName: string, subcategoryName: string, items: Item[] = []) => {
    onSubcategorySelect(categoryName, subcategoryName, items);
    onClose();
  };

  const handleViewAllItems = () => {
    onSubcategorySelect(category.name, 'All Items', allCategoryItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 flex flex-col">
        {/* Modal Header */}
        <div className="relative flex-shrink-0">
          <div className="h-48 md:h-56 overflow-hidden">
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
              <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <Utensils size={48} className="text-white opacity-80" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/20 backdrop-blur-md rounded-full p-2 md:p-3 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <X size={20} className="md:size-6" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
            <div className="flex items-center justify-between">
              <div className="max-w-[70%]">
                <h2 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">{category.name}</h2>
                <p className="text-white/95 text-xs md:text-base leading-relaxed drop-shadow-md line-clamp-2">
                  {category.description}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-lg md:rounded-xl p-2 md:p-4 text-center">
                <Package2 className="text-white mx-auto mb-1 size-4 md:size-6" />
                <p className="text-white font-bold text-sm md:text-lg">{allCategoryItems.length}</p>
                <p className="text-white/90 text-[10px] md:text-xs">Total Items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Subcategories Horizontal Grid - Top on Mobile */}
          <div className="bg-gray-50 border-b border-gray-200 p-4 flex-shrink-0">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
              <Utensils className="mr-2 md:mr-3 text-amber-600 size-5 md:size-6" />
              Browse Options
            </h3>
            
            <div className="overflow-x-auto pb-2">
              <div className="flex space-x-3 min-w-max">
                {/* All Items Button */}
                <button
                  onClick={() => handleSubcategoryClick('all')}
                  className={`flex-shrink-0 p-3 rounded-lg text-left transition-all duration-300 min-w-[140px] ${
                    expandedSubcategory === 'all'
                      ? 'bg-amber-100 border-2 border-amber-300 shadow-md'
                      : 'bg-white border border-gray-200 hover:border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* <Grid className="text-amber-600  md:size-6 mb-1" /> */}
                    <span className={`font-bold text-sm ${
                      expandedSubcategory === 'all'
                        ? 'text-amber-700'
                        : 'text-gray-800'
                    }`}>
                      All Items
                    </span>
                    {/* <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium mt-2">
                      {allCategoryItems.length} items
                    </span> */}
                  </div>
                </button>

                {/* Subcategory Buttons */}
                {subcategoriesWithItems && subcategoriesWithItems.length > 0 ? (
                  subcategoriesWithItems.map((subcategory) => (
                    <button
                      key={subcategory._id}
                      onClick={() => handleSubcategoryClick(subcategory._id)}
                      className={`flex-shrink-0 p-3 rounded-lg text-left transition-all duration-300 min-w-[140px] ${
                        expandedSubcategory === subcategory._id
                          ? 'bg-amber-100 border-2 border-amber-300 shadow-md'
                          : 'bg-white border border-gray-200 hover:border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <span className={`font-bold text-sm ${
                          expandedSubcategory === subcategory._id
                            ? 'text-amber-700'
                            : 'text-gray-800'
                        }`}>
                          {subcategory.name}
                        </span>
                        {/* <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium mt-2">
                          {subcategory.items?.length || 0} items
                        </span> */}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4 w-full">
                    <p className="text-gray-500">No subcategories available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items Content - Columns Layout */}
          <div className="flex-1 overflow-y-auto p-4">
            {expandedSubcategory === 'all' ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                    <Grid className="mr-2 text-amber-600" size={24} />
                    All Items
                  </h3>
                  <button
                    onClick={handleViewAllItems}
                    className="bg-amber-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center text-sm md:text-base"
                  >
                    <ArrowRight size={16} className="mr-1 md:mr-2" />
                     Order Online
                  </button>
                </div>

                {allCategoryItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allCategoryItems.map((item) => (
                      <div key={item._id} className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 h-full">
                        <div className="flex items-start mb-3">
                          <div className="relative mr-3 flex-shrink-0">
                            {item.image ? (
                              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden">
                                <Image 
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                                {/* Status badge positioned at top-right of image */}
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
                                <Utensils size={20} className="text-amber-600" />
                                {/* Status badge positioned at top-right of placeholder */}
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
                            {/* Price moved to right side */}
                            <div className="flex justify-end mt-2">
                              <p className="text-amber-600 font-bold text-base md:text-lg">₦{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package2 className="text-gray-400" size={24} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">No Items Available</h4>
                    <p className="text-gray-500">This category does not have any items at the moment.</p>
                  </div>
                )}
              </>
            ) : expandedSubcategory ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                    {subcategoriesWithItems.find(sc => sc._id === expandedSubcategory)?.name}
                  </h3>
                  <button
                    onClick={() => {
                      const subcategory = subcategoriesWithItems.find(sc => sc._id === expandedSubcategory);
                      if (subcategory) {
                        handleSubcategorySelect(category.name, subcategory.name, subcategory.items);
                      }
                    }}
                    className="bg-amber-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center text-sm md:text-base"
                  >
                    <ArrowRight size={16} className="mr-1 md:mr-2" />
                    Order Online
                  </button>
                </div>

                {(() => {
                  const selectedSubcategory = subcategoriesWithItems.find(sc => sc._id === expandedSubcategory);
                  if (selectedSubcategory && selectedSubcategory.items && selectedSubcategory.items.length > 0) {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSubcategory.items.map((item) => (
                          <div key={item._id} className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 h-full">
                            <div className="flex items-start mb-3">
                              <div className="relative mr-3 flex-shrink-0">
                                {item.image ? (
                                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden">
                                    <Image 
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                    {/* Status badge positioned at top-right of image */}
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
                                    <Utensils size={20} className="text-amber-600" />
                                    {/* Status badge positioned at top-right of placeholder */}
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
                                  <p className="text-gray-600 text-xs md:text-sm line-clamp-2">{item.description}</p>
                                </div>
                                {/* Price moved to right side */}
                                <div className="flex justify-end mt-2">
                                  <p className="text-amber-600 font-bold text-base md:text-lg">₦{item.price.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package2 className="text-gray-400" size={24} />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">No Items Available</h4>
                        <p className="text-gray-500">This subcategory does not have any items at the moment.</p>
                      </div>
                    );
                  }
                })()}
              </>
            ) : (
              <div className="text-center py-8 md:py-12">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils size={24} className="text-amber-600" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">Select an Option</h3>
                <p className="text-gray-500 text-sm md:text-base">
                  Choose All Items or a subcategory from above to view items
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;