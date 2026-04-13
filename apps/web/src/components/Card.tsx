import { formatNumber } from '@repo/ui';
import { Rate } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/Product';

interface CardProps {
  product: Product
  link?: string;
}

const Card: React.FC<CardProps> = ({
  product,
  link
}) => {
  return (
    <div className="flex flex-col w-full">
      <Link
        to={
          link
            ? link
            : `/product?id=${encodeURIComponent(product?._id)}`
        }
      >
        <div className="rounded-lg p-4 mb-4 relative bg-[#F0EEED]">
          {product.flashSaleInfo && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1 rounded shadow-md z-10 animate-pulse uppercase tracking-wider">
              ⚡ Flash Sale
            </span>
          )}

          {product.discountPercent > 0 && !product.flashSaleInfo && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">
              -{product.discountPercent}%
            </span>
          )}

          <img src={product?.image[0]} alt={product?.name} className="w-full h-56 object-contain" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 text-left line-clamp-1">
            {product?.name}
          </h3>
          <div className="flex items-center mt-1">
            <Rate
              disabled
              defaultValue={product?.rating}
              allowHalf
              className="text-yellow-400 text-base"
            />
            <span className="text-gray-600 ml-3">
              {Number.isInteger(product?.rating) ? product?.rating : product?.rating?.toFixed(1)}/5
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-nowrap overflow-hidden">
            <p className="text-base font-bold text-gray-900 truncate">
              {formatNumber(product.flashSaleInfo ? product.flashSaleInfo.price : (product.discountPrice ?? product.price))} $
            </p>
            {((product.discountPercent && product.discountPercent > 0) || product.flashSaleInfo) && (
              <p className="text-xs text-red-500 line-through bg-red-100 px-2 py-1 rounded truncate">
                {formatNumber(product?.price)} $
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
