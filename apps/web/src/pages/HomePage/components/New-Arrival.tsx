import { Link } from 'react-router-dom';
import Card from '../../../components/Card';
import { Product } from '../../../types/Product';
import { Button } from 'antd';

type NewArrivalProps = {
  showtitle?: boolean;
  products: Product[];
}

const New_Arrival = ({ showtitle = true, products }: NewArrivalProps) => {
  return (
    <div className="p-10 text-center mx-auto">
      {showtitle && (
        <div className="text-2xl font-bold text-gray-800 uppercase mb-7">
          NEW ARRIVALS
        </div>
      )}

      {products?.length > 0 && (
        <div className="grid grid-cols-4 gap-x-5 gap-y-7 justify-items-center mb-7 px-8">
          {products?.map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>
      )}

      <Link to="/category">
        <Button type='primary' className=" shadow-none px-7 py-3 bg-gray-800 text-white rounded font-medium text-base">
          View All
        </Button>
      </Link>
    </div>
  );
}

export default New_Arrival;
