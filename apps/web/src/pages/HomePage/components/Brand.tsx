import { useNavigate } from "react-router-dom";

const Brand = () => {

  const navigate = useNavigate();

  const handleBrandClick = (brand: string) => {
    navigate(`/brand/${brand}`);
  };

  return(
    <div className="sticky top-16 z-40 w-full flex justify-center items-center gap-12 bg-black p-5 flex-wrap *:text-white *:text-2xl *:font-bold *:uppercase *:whitespace-nowrap">

      <div
        className="cursor-pointer hover:text-gray-300"
        onClick={() => handleBrandClick("nike")}
      >
        NIKE
      </div>

      <div
        className="cursor-pointer hover:text-gray-300"
        onClick={() => handleBrandClick("adidas")}
      >
        ADIDAS
      </div>

      <div
        className="cursor-pointer hover:text-gray-300"
        onClick={() => handleBrandClick("puma")}
      >
        PUMA
      </div>

      <div
        className="cursor-pointer hover:text-gray-300"
        onClick={() => handleBrandClick("new balance")}
      >
        NEW BALANCE
      </div>

      <div
        className="cursor-pointer hover:text-gray-300"
        onClick={() => handleBrandClick("reebok")}
      >
        REEBOK
      </div>

      <div
        className="cursor-pointer hover:text-gray-300"
        onClick={() => handleBrandClick("skechers")}
      >
        SKECHERS
      </div>

      <div
        className="cursor-pointer hover:text-gray-300"
        onClick={() => handleBrandClick("asics")}
      >
        ASICS
      </div>

    </div>
  );
};

export default Brand;
