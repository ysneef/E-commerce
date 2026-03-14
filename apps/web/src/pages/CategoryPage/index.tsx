import { Breadcrumb, Pagination } from 'antd';
import { useState } from 'react';
import { useAsyncRetry } from "react-use";
import { ProductApi } from '../../api/productApi';
import Card from '../../components/Card';
import Filter from './components/Filter';
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export interface Criteria {
  page?: number;
  pageSize?: number;
  category?: string | null;
  brand?: string | null;
  priceMin?: number;
  priceMax?: number;
  sizes?: string[];
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  status?: boolean;
}

export const innitCriteria: Criteria = {
  page: 1,
  pageSize: 8,
  sizes: [],
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const Category = () => {

  const { brand } = useParams();
    useEffect(() => {
      setCriteria((prev) => ({
        ...prev,
        brand: brand || null,
        page: 1
      }));
    }, [brand]);

  const [criteria, setCriteria] = useState<Criteria>({
    ...innitCriteria,
    brand: brand || null
  });

  const fetchFilterOptions = async () => {
    try {
      const products = await ProductApi.searchProducts(criteria);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('');
    }
  };

  const { loading, error, value } = useAsyncRetry(fetchFilterOptions, [criteria]);

  const handleFilterChange = (newFilters: Criteria) => {
    const newCriteria = {
      ...criteria,
      ...newFilters,
      page: 1
    };
    setCriteria(newCriteria);
  };

  return (
    <div className="max-w-screen-xl mx-auto pt-20 pb-7">


      <div className='mb-5'>
        <Breadcrumb
          separator=">"
          items={[
            { title: 'Home', href: '/' },
            { title: 'Category' }
          ]}
        />
      </div>

      <div className='flex gap-4'>

        <Filter
          criteria={criteria}
          onFilterChange={handleFilterChange}
          resetCritia={() =>
            setCriteria({
              ...innitCriteria,
              brand: brand || null
            })
          }
        />

        <div className="flex-1">

          {!loading && !error && value?.data?.length > 0 ? (
            <div>

              <div className="flex flex-col p-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 flex-grow">
                  {value?.data.map((product: any) => (
                    <Card
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>

                <div className="flex justify-center mt-10">
                  <Pagination
                    current={value?.currentPage}
                    pageSize={criteria.pageSize}
                    total={value?.totalItems}
                    onChange={(page: number) => {
                      setCriteria((prev) => ({
                        ...prev,
                        page: page
                      }));
                    }}
                  />
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center">
              <p>No products found</p>
              <p className="text-gray-600 mt-2">
                Try a different keyword or change the filters.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Category;
