import React, { useEffect, useState } from 'react';
import { Product } from '../../../types/Product';
import { formatNumber } from '@repo/ui';
import { Link } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface TFlashSale {
  _id: string;
  name: string;
  endTime: string;
  products: Array<{
    productId: Product;
    flashSalePercent: number;
  }>;
}

interface SaleProps {
  sales: TFlashSale[];
}

const Sale: React.FC<SaleProps> = ({ sales }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentSale = sales[currentIndex];

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!currentSale) return;
    
    const calculateTimeLeft = () => {
      const difference = +new Date(currentSale.endTime) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [currentSale?._id, currentSale?.endTime]);

  const handleSwitchCampaign = (index: number) => {
    if (index === currentIndex || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 400); // Dynamic transition duration
  };

  const nextCampaign = () => {
    handleSwitchCampaign((currentIndex + 1) % sales.length);
  };

  const prevCampaign = () => {
    handleSwitchCampaign((currentIndex - 1 + sales.length) % sales.length);
  };

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

  if (!currentSale) return null;

  return (
    <div className="relative group mx-4 md:mx-10 my-10">
      {/* Background with multiple gradient layers for depth */}
      <div 
        className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#8e00e8] via-[#a633ff] to-[#ff33e6] p-8 md:p-12 shadow-2xl transition-all duration-500 ${isAnimating ? 'opacity-50 scale-[0.98] blur-sm' : 'opacity-100 scale-100 blur-0'}`}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className={`relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 transition-all duration-500 ${isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
          
          {/* Left: Info & Timer */}
          <div className="flex-1 text-center lg:text-left w-full">
            <div className="flex flex-col items-center lg:items-start gap-4 mb-4">
              <span className="inline-block bg-white/30 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm">
                Active Campaign {currentIndex + 1}/{sales.length}
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-tight drop-shadow-lg">
                {currentSale.name}
              </h2>
            </div>
            
            <div className="flex justify-center lg:justify-start gap-3 md:gap-4 mb-8">
              <TimeBlock value={timeLeft.days} label="Days" />
              <TimeBlock value={timeLeft.hours} label="Hours" />
              <TimeBlock value={timeLeft.minutes} label="Mins" />
              <TimeBlock value={timeLeft.seconds} label="Secs" />
            </div>

            <div className="hidden lg:flex gap-4 items-center">
               <button 
                onClick={prevCampaign}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 border border-white/20 text-white transition-all flex items-center justify-center backdrop-blur-md shadow-lg"
              >
                <LeftOutlined />
              </button>
              <button 
                onClick={nextCampaign}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 border border-white/20 text-white transition-all flex items-center justify-center backdrop-blur-md shadow-lg"
              >
                <RightOutlined />
              </button>
            </div>
          </div>

          {/* Right: Products Scrollable area */}
          <div className="w-full lg:w-[65%] overflow-hidden">
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 custom-scrollbar px-2 snap-x">
              {currentSale.products.map((item, index) => {
                const p = item.productId;
                if (!p) return null;
                const salePrice = p.price - (p.price * (item.flashSalePercent || 0) / 100);
                
                return (
                  <Link
                    key={`${currentSale._id}-${index}`}
                    to={`/product?id=${p._id}`}
                    className="group flex-none w-56 bg-white/95 rounded-3xl p-5 shadow-2xl hover:bg-white transition-all duration-300 snap-start"
                  >
                    <div className="relative bg-[#F0EEED] rounded-2xl mb-4 overflow-hidden aspect-square flex items-center justify-center">
                      <img
                        src={p.image[0]}
                        alt={p.name}
                        className="w-[85%] h-[85%] object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-rose-500 text-white text-[9px] font-black px-2.5 py-1.5 rounded-full shadow-lg brightness-110 tracking-widest uppercase">
                        -{item.flashSalePercent}%
                      </div>
                    </div>
                    <h3 className="text-sm font-extrabold text-gray-900 line-clamp-1 mb-2 group-hover:text-[#8e00e8] transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-red-600">
                        {formatNumber(salePrice)} $
                      </span>
                      <span className="text-xs text-gray-400 line-through font-medium">
                        {formatNumber(p.price)} $
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dots for navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {sales.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSwitchCampaign(index)}
              className={`h-2 underline-offset-4 rounded-full transition-all duration-500 ${currentIndex === index ? 'w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'w-2 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </div>

      {/* CSS For Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Sale;
