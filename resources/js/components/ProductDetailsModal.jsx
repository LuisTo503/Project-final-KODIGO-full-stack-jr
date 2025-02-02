import React, { useState, useEffect } from 'react';
import { AxiosRouter } from '../services/utils/Axios.utis';
import StarRating from './StarRating';

const ProductDetailsModal = ({ product, onClose, user }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await AxiosRouter.get(`/api/comentario?producto_id=${product.id}`);
        setComments(response.data.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    };
    
    fetchComments();
  }, [product.id]);

  const handleSubmitComment = async () => {
    try {
      const response = await AxiosRouter.post('/api/comentario', {
        contenido: comment,
        calificacion: rating,
        fecha: new Date().toISOString().split('T')[0],
        producto_id: product.id,
        usuario_id: user.id
      });

      if (response.status === 201) {
        const newComments = await AxiosRouter.get(`/api/comentario?producto_id=${product.id}`);
        setComments(newComments.data.data);
        setComment('');
        setRating(5);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-base-100 rounded-box max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col md:flex-row">
        {/* Sección izquierda - Producto y formulario */}
        <div className="flex-1 p-8 border-r border-base-300 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-base-content">{product.name}</h2>
            <button 
              onClick={onClose} 
              className="btn btn-circle btn-ghost btn-sm text-base-content hover:text-primary"
            >
              ✕
            </button>
          </div>
          
          <figure className="w-full h-96 mb-6 rounded-box overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </figure>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <span className="text-lg text-secondary">
                Stock disponible: {product.stock}
              </span>
            </div>
            
            <p className="text-base-content text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="border-t border-base-300 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-base-content">
              Valora este producto
            </h3>
            
            <StarRating rating={rating} editable={true} onChange={setRating} />
            
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="textarea textarea-bordered w-full mt-4 text-lg placeholder-base-content/50"
              rows="4"
              placeholder="Escribe tu experiencia con este producto..."
            />
            
            <button
              onClick={handleSubmitComment}
              className="btn btn-primary w-full mt-4 py-3 text-lg"
            >
              Publicar valoración
            </button>
          </div>
        </div>

        {/* Sección derecha - Comentarios */}
        <div className="flex-1 p-8 overflow-y-auto bg-base-200">
          <h3 className="text-2xl font-bold mb-6 text-base-content">
            Opiniones de clientes
          </h3>
          
          {isLoadingComments ? (
            <div className="text-center text-base-content">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-base-content/70 text-center">
              Sé el primero en comentar
            </div>
          ) : (
            comments.map((comentario) => (
              <div 
                key={comentario.id} 
                className="mb-6 pb-6 border-b border-base-300 last:border-0"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-lg text-base-content">
                    {comentario.usuario.name}
                  </span>
                  <StarRating rating={comentario.calificacion} />
                </div>
                <p className="text-base-content text-lg">
                  {comentario.contenido}
                </p>
                <time className="text-sm text-base-content/50">
                  {new Date(comentario.fecha).toLocaleDateString()}
                </time>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;