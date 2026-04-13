import { useAsyncRetry } from 'react-use';
import ClientProductApi from '../../api/ClientProductApi';
import { Product } from '../../types/Product';
import Brand from './components/Brand';
import Introduction from './components/Introduction';
import New_Arrival from './components/New-Arrival';
import Sale from './components/Sale';

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

  const fetchActiveSale = async () => {
    const response = await ClientProductApi.getActiveFlashSale();
    return response.success ? response.data : null;
  };

  const { loading: loadingProducts, value: products = [] } = useAsyncRetry(fetchProducts, []);
  const { loading: loadingSale, value: activeSales = [] } = useAsyncRetry(fetchActiveSale, []);

  const loading = loadingProducts || loadingSale;

  return (
    <div className="flex flex-col justify-start">
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 right-[-10%] h-64 w-64 rounded-full bg-emerald-100 blur-3xl opacity-60" />
        <div className="absolute top-32 left-[-5%] h-56 w-56 rounded-full bg-amber-100 blur-3xl opacity-60" />
        <div className="absolute bottom-[-120px] right-[20%] h-72 w-72 rounded-full bg-sky-100 blur-3xl opacity-60" />
        <div className="relative">
          <Introduction />
        </div>
      </section>
      <Brand />
      {activeSales && activeSales.length > 0 && <Sale sales={activeSales} />}
      {loading ? (
        <div className="mx-auto w-full max-w-screen-xl px-6 py-10">
          <div className="mb-4 h-6 w-48 animate-pulse rounded-full bg-white/70" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-64 rounded-2xl border border-white/60 bg-white/70 shadow-[var(--shadow-soft)] backdrop-blur"
              />
            ))}
          </div>
        </div>
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
