import React from 'react';
import { Criteria } from '..';
import { Slider, Select, Button } from 'antd';
import { formatNumber } from '@repo/ui';
const { Option } = Select;

interface FilterProps {
  onFilterChange: (filters: Criteria) => void;
  criteria: Criteria
  resetCritia: () => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, criteria, resetCritia }) => {

  const category = [
    { "id": 1, "name": "Men", "value": "Men" },
    { "id": 2, "name": "Women", "value": "Women" },
    { "id": 3, "name": "Kids", "value": "Kids" },
  ]

  const filterOptions = {
    categories: category.map(c => c.value),
    sizes: [
      'EU 35.5','EU 36','EU 36.5','EU 37','EU 37.5',
      'EU 38','EU 38.5','EU 39','EU 39.5','EU 40',
      'EU 40.5','EU 41','EU 41.5','EU 42','EU 42.5',
      'EU 43','EU 43.5','EU 44','EU 44.5','EU 45','EU 45.5','EU 46'
    ],
  minPrice: 500000,
  maxPrice: 10000000,
  };
  
  const updateFilters = (newFilters: Partial<Criteria>) => {
    const updated = {
      ...criteria,
      ...newFilters,
      page: 1
    };
    onFilterChange(updated);
  };

  const toggleSize = (size: string) => {
    const currentSizes = criteria.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    updateFilters({ sizes: newSizes });
  };

  return (
    <div className="w-64 p-4 border bg-white h-full rounded-xl mt-3">
      <h3 className="text-lg font-bold mb-4">Filter</h3>
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Category</h4>
        <Select
          className="w-full"
          placeholder="Select category"
          value={criteria.category || undefined}
          onChange={(value) => updateFilters({ category: value })}
          allowClear
        >
          {category.map((cat) => (
            <Option key={cat.id} value={cat.value}>
              {cat.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Price</h4>
        <Slider
          range
          min={filterOptions.minPrice}
          max={filterOptions.maxPrice}
          step={50000}
          value={[
            criteria.priceMin ?? filterOptions.minPrice,
            criteria.priceMax ?? filterOptions.maxPrice,
          ]}
          onChange={([min, max]) => {
            updateFilters({ priceMin: min, priceMax: max });
          }}
        />
        <div className="text-sm text-gray-600 mt-1">
          {formatNumber(criteria.priceMin ?? filterOptions.minPrice)} -{' '}
          {formatNumber(criteria.priceMax ?? filterOptions.maxPrice)}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Size</h4>
        <div className="grid grid-cols-3 gap-2">
          {filterOptions.sizes.map((size) => (
            <button
              key={size}
              className={`text-sm px-2 py-1 rounded-full border transition ${
                criteria.sizes?.includes(size)
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => toggleSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Sort By</h4>
        <Select
          className="w-full"
          value={`${criteria.sortBy || ''}_${criteria.sortOrder || ''}`}
          onChange={(value) => {
            const [sortBy, sortOrder] = value.split('_');
            updateFilters({
              sortBy: sortBy || null,
              sortOrder: (sortOrder as 'asc' | 'desc') || null,
            });
          }}
        >
          <Option value="createdAt_desc">Newest</Option>
          <Option value="createdAt_asc">Oldest</Option>
        </Select>
      </div>

      <Button
        type='primary'
        className="w-full bg-black rounded-full py-2 "
        onClick={resetCritia}
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default Filter;