import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';
import ProductDetailsModal from './ProductDetailsModal';
import StarRating from './StarRating'; 

const UserProductView = ({ products, isLoading, error }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user } = useAuth();

  if (isLoading) return <Loader />;
  if (error) return <div className="alert alert-error">{error}</div>;

  const ProductCard = ({ product }) => (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <figure className="px-4 pt-4">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-xl h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <div className="flex justify-between items-center">
          <StarRating rating={product.average_rating} /> {/* Asume que el backend provee este campo */}
          <span className="text-pink-500 font-bold text-xl">
            ${parseFloat(product.price).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-500">Stock: {product.stock}</span>
        </div>
        <button
          className="btn btn-primary mt-2"
          onClick={() => setSelectedProduct(product)}
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          user={user}
        />
      )}
    </>
  );
};

export default UserProductView;