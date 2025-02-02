import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AxiosRouter } from '../services/utils/Axios.utis';
import { Package, DollarSign, Box, Sun, Moon, Building2, Ghost, Cake, Coffee, AlarmCheck, Music2 } from 'lucide-react';
import UserModal from './UserModal';
import ProductsTable from './ProductsTable';
import AddProductButton from './AddProductButton';
import UserProductView from './UserProductView';
import Sidebar from './Sidebar';
import UsersTable from './UsersTable';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [currentView, setCurrentView] = useState('products');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const themes = [
    { name: 'Light', icon: <Sun className="w-4 h-4" />, value: 'light' },
    { name: 'Dark', icon: <Moon className="w-4 h-4" />, value: 'dark' },
    { name: 'Cupcake', icon: <Cake className="w-4 h-4" />, value: 'cupcake' },
    { name: 'Corporate', icon: <Building2 className="w-4 h-4" />, value: 'corporate' },
    { name: 'Dracula', icon: <Ghost className="w-4 h-4" />, value: 'dracula' },
    { name: 'Coffee', icon: <Coffee className="w-4 h-4" />, value: 'coffee' },
    { name: 'Synthwave', icon: <Music2 className="w-4 h-4" />, value: 'synthwave' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await AxiosRouter.get('/api/products');
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Error cargando productos');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleProductUpdate = (updatedProducts) => {
    setProducts(updatedProducts);
  };

  const isAdminOrEditor = user?.role_id === 1 || user?.role_id === 2;

  const renderContent = () => {
    if (!isAdminOrEditor) {
      return (
        <UserProductView 
          products={products}
          isLoading={isLoadingProducts}
          error={error}
        />
      );
    }

    if (currentView === 'users' && user?.role_id === 1) {
      return <UsersTable />;
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats bg-base-100 shadow-lg">
            <div className="stat">
              <div className="stat-figure text-purple-400">
                <Package className="w-8 h-8" />
              </div>
              <div className="stat-title">Productos totales</div>
              <div className="stat-value text-purple-400">{products.length}</div>
              <div className="stat-desc">Disponibles en inventario</div>
            </div>
          </div>
          
          <div className="stats bg-base-100 shadow-lg">
            <div className="stat">
              <div className="stat-figure text-pink-400">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Valor total</div>
              <div className="stat-value text-pink-400">
                ${products.reduce((acc, product) => acc + parseFloat(product.price*product.stock), 0).toFixed(2)}
              </div>
              <div className="stat-desc">En inventario</div>
            </div>
          </div>
          
          <div className="stats bg-base-100 shadow-lg">
            <div className="stat">
              <div className="stat-figure text-blue-400">
                <Box className="w-8 h-8" />
              </div>
              <div className="stat-title">Stock total</div>
              <div className="stat-value text-blue-400">
                {products.reduce((acc, product) => acc + parseInt(product.stock), 0)}
              </div>
              <div className="stat-desc">Unidades disponibles</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
                Inventario de Productos
              </h2>
              <AddProductButton onProductAdded={(newProduct) => setProducts([...products, newProduct])} />
            </div>
            <ProductsTable 
              products={products}
              isLoading={isLoadingProducts}
              error={error}
              onProductUpdate={handleProductUpdate}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-base-200">
      {isAdminOrEditor && (
        <Sidebar 
          onNavigate={setCurrentView}
          currentView={currentView}
          isOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />
      )}

      {/* Contenedor principal modificado */}
      <div className="min-h-screen lg:ml-64">
        <div className={`navbar bg-base-100 shadow-lg fixed top-0 w-full ${
          isAdminOrEditor ? 'lg:w-[calc(100%-16rem)]' : ''
        } right-0 z-50`}>
          <div className="flex-1">
            {isAdminOrEditor && (
              <button 
                className="lg:hidden btn btn-ghost btn-circle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>
            )}
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
              {isAdminOrEditor ? 'Mi Dashboard' : 'Catálogo de Productos'}
            </span>
          </div>
          <div className="flex-none">
            <button 
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setShowUserModal(true)}
            >
              <div className="w-10 rounded-full ring ring-purple-200">
                <img 
                  alt="User avatar" 
                  src={user?.profile_picture}
                  onError={(e) => {
                    e.target.src = 'https://api.placeholder.com/150';
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        <UserModal 
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          user={user}
          logout={logout}
          themes={themes}
        />

        <div className="p-8 pt-20">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
              Bienvenido, {user?.name}
            </h1>
            
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}