import React, { useEffect, useState } from 'react';
import { Product } from '../../../types/Product';
import { formatNumber } from '@repo/ui';
import { Link } from 'react-router-dom';

interface SaleProps {
  sale: {
    _id: string;
    name: string;
    endTime: string;
    products: Array<{
      productId: Product;
      flashSalePercent: number;
    }>;
  };
}

const Sale: React.FC<SaleProps> = ({ sale }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(sale.endTime) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sale.endTime]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 shadow-lg min-w-[70px]">
      <span className="text-2xl font-bold text-white leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase font-bold text-white/80 mt-1">
        {label}
      </span>
    </div>
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8e00e8] via-[#a633ff] to-[#ff33e6] p-8 my-10 shadow-2xl mx-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left: Info & Timer */}
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block bg-white/30 backdrop-blur-sm text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Limited Time Offer
          </span>
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight uppercase italic underline decoration-white/30 underline-offset-8">
            {sale.name}
          </h2>
          
          <div className="flex justify-center md:justify-start gap-4 mb-4">
            <TimeBlock value={timeLeft.days} label="Days" />
            <TimeBlock value={timeLeft.hours} label="Hours" />
            <TimeBlock value={timeLeft.minutes} label="Mins" />
            <TimeBlock value={timeLeft.seconds} label="Secs" />
          </div>
        </div>

        {/* Right: Products */}
        <div className="w-full md:w-[60%] overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex gap-6">
            {sale.products.map((item, index) => {
              const p = item.productId;
              if (!p) return null;
              return (
                <Link
                  key={index}
                  to={`/product?id=${p._id}`}
                  className="group flex-none w-56 bg-white rounded-2xl p-4 shadow-xl hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative bg-[#F0EEED] rounded-xl mb-3 overflow-hidden aspect-square flex items-center justify-center">
                    <img
                      src={p.image[0]}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
                      FLASH SALE
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-1 mb-2">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-red-600">
                      {formatNumber(p.price - (p.price * (item.flashSalePercent || 0) / 100))} $
                    </span>
                    <span className="text-[10px] text-gray-400 line-through">
                      {formatNumber(p.price)} $
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Sale;
