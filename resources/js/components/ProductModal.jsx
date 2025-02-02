import React, { useState, useEffect } from 'react';
import { X, Upload, Pencil } from 'lucide-react';
import { AxiosRouter } from '../services/utils/Axios.utis';

const ProductModal = ({ isOpen, onClose, product, onSuccess, mode, onModeChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        image: null
      });
      setPreview(product.image || null);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: null
      });
      setPreview(null);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formPayload = new FormData();
      
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description);
      formPayload.append('price', formData.price);
      formPayload.append('stock', formData.stock);
      
      if (formData.image instanceof File) {
        formPayload.append('image', formData.image);
      }

      let response;
      if (product?.id) {
        formPayload.append('_method', 'PUT');
        response = await AxiosRouter.post(`/api/products/${product.id}`, formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await AxiosRouter.post('/api/products', formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      onSuccess(response.data);
      onClose();
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product?.id || !window.confirm('¿Está seguro de eliminar este producto?')) return;
    
    setLoading(true);
    try {
      await AxiosRouter.delete(`/api/products/${product.id}`);
      onSuccess(null, 'delete');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-base-300 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h2 className="text-xl font-semibold text-base-content">
            {mode === 'view' ? 'Detalles del Producto' : 
             mode === 'edit' ? 'Editar Producto' : 
             'Agregar Nuevo Producto'}
          </h2>
          <div className="flex gap-2">
            {mode === 'view' && product && (
              <button
                onClick={() => onModeChange('edit')}
                className="btn btn-ghost btn-sm"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {error && (
            <div className="alert alert-error mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
                readOnly={mode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <label className="label">
                <span className="label-text">Descripción</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full"
                required
                readOnly={mode === 'view'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text">Precio</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  step="0.01"
                  required
                  readOnly={mode === 'view'}
                />
              </div>

              <div className="space-y-2">
                <label className="label">
                  <span className="label-text">Stock</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                  readOnly={mode === 'view'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label">
                <span className="label-text">Imagen</span>
              </label>
              <div className="flex items-center gap-4">
                {preview && (
                  <div className="w-24 h-24 relative">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                {mode !== 'view' && (
                  <label className="btn btn-outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Imagen
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              {mode === 'edit' && product && (
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Eliminar
                </button>
              )}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
                disabled={loading}
              >
                {mode === 'view' ? 'Cerrar' : 'Cancelar'}
              </button>
              {mode !== 'view' && (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : (product ? 'Actualizar' : 'Crear')}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;