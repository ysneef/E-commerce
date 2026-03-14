import { useAsyncRetry } from 'react-use';
import ClientProductApi from '../../api/ClientProductApi';
import { Product } from '../../types/Product';
import Brand from './components/Brand';
import Introduction from './components/Introduction';
import New_Arrival from './components/New-Arrival';

const HomePage = () => {

  const fetchProducts = async (): Promise<Product[]> => {
    try {
      const response = await ClientProductApi.getClientProducts({
        page: 1,
        pageSize: 8,
      })
      return response.data;
    } catch (error) {
      return []
    }
  };
  
  const { loading, value: products = [] } = useAsyncRetry(fetchProducts, []);

  return (
    <div className="flex flex-col justify-start">
      <Introduction />
      <Brand />
      {loading ? (
        <div>Loading products...</div>
      ) : (
        <>
          <New_Arrival
            products={products}
            showtitle={true}
          />
        </>
      )}
    </div>
  );
}

export default HomePage;
