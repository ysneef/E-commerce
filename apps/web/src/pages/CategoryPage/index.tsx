import { Breadcrumb, Pagination } from 'antd';
import { useState, useEffect } from 'react';
import { useAsyncRetry } from "react-use";
import { ProductApi } from '../../api/productApi';
import Card from '../../components/Card';
import Filter from './components/Filter';
import { Link, useParams } from "react-router-dom";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";


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

export const initCriteria: Criteria = {
  page: 1,
  pageSize: 8,
  sizes: [],
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const Category = () => {

  const { brand } = useParams();

  const [criteria, setCriteria] = useState<Criteria>({
    ...initCriteria,
    brand: brand || null
  });

  useEffect(() => {
    setCriteria((prev) => ({
      ...prev,
      brand: brand || null,
      page: 1
    }));
  }, [brand]);

  const fetchFilterOptions = async () => {
    try {
      const products = await ProductApi.searchProducts(criteria);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        data: [],
        totalItems: 0,
        currentPage: 1
      };
    }
  };

  const { loading, error, value } = useAsyncRetry(fetchFilterOptions, [criteria]);

  const handleFilterChange = (newFilters: Criteria) => {
    setCriteria({
      ...criteria,
      ...newFilters,
      page: 1
    });
  };

  return (
    <>
      <Header />

      <div className="max-w-screen-xl mx-auto pt-24 pb-7">

        {/* Breadcrumb */}
        <div className="mb-5">
          <Breadcrumb
            separator=">"
            items={[
              {
                title: <Link to="/">Home</Link>
              },
              {
                title: (
                  <Link
                    to={`/brand/${brand}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    {brand?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Link>
                )
              }
            ]}
          />
        </div>


        <div className='flex gap-4'>

          <Filter
            criteria={criteria}
            onFilterChange={handleFilterChange}
            resetCritia={() =>
              setCriteria({
                ...initCriteria,
                brand: brand || null
              })
            }
          />

          <div className="flex-1">

            {!loading && !error && value?.data?.length > 0 ? (

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
                        page
                      }));
                    }}
                  />
                </div>

              </div>

            ) : (

              <div className="text-center py-10">
                <p>No products found</p>
                <p className="text-gray-600 mt-2">
                  Try a different keyword or change the filters.
                </p>
              </div>

            )}

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default Category;
