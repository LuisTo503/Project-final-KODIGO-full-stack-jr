import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProductModal from './ProductModal';

const AddProductButton = ({ onProductAdded }) => {
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = (newProduct) => {
    if (newProduct) {
      onProductAdded(newProduct);
    }
  };

  return (
    <>
      <button
        className="btn btn-primary mb-4"
        onClick={() => setShowModal(true)}
      >
        <Plus className="w-4 h-4" />
        Agregar Producto
      </button>

      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default AddProductButton;