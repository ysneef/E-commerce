import { useNavigate } from "react-router-dom";

const Introduction = () => {
  const navigate = useNavigate()
  return (
    <section className="w-full min-h-screen flex items-center justify-center px-5">
      <div className="w-[90%] grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-7xl font-extrabold leading-tight">
            FIND SHOES <br />THAT MATCHES <br />YOUR STYLE
          </h1>
          <p className="my-5 text-lg">
            Browse through our diverse range of high-quality sneakers,
            designed to match your personality and unique style.
          </p>
          <button className="bg-black text-white py-3 px-6 text-xl rounded-full hover:bg-gray-800 transition-colors" onClick={() => navigate("/category")}>
            Shop Now
          </button>

          <div className="flex gap-10 mt-7">
            <div>
              <p className="text-3xl font-bold">200+</p>
              <p className="text-sm text-gray-600">International Brands</p>
            </div>
            <div>
              <p className="text-3xl font-bold">2,000+</p>
              <p className="text-sm text-gray-600">High-Quality Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold">30,000+</p>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </div>
          </div>
        </div>

        <div className="relative text-center">
          <img
            src='../../../../assets/images/products/trendy-fashionable-couple-posing_155003-3401-removebg-preview.png'
            alt="Fashion Models"
            className="w-[150%] max-h-[4000px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export default Introduction;
