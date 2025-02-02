import React, { useState } from 'react';
import { Settings, LogOut, User, LockKeyhole, Image, X } from 'lucide-react';
import { AxiosRouter } from '../services/utils/Axios.utis';




const UserModal = ({ isOpen, onClose, user, logout, themes }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profile_picture: null
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      if (formData.profile_picture) {
        form.append('profile_picture', formData.profile_picture);
      }

      const { data } = await AxiosRouter.patch(`/api/users/${user.id}/info`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Información actualizada correctamente');
      setTimeout(() => setSuccess(''), 3000);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AxiosRouter.patch(`/api/users/${user.id}/password`, passwordData);
      setSuccess('Contraseña actualizada correctamente');
      setTimeout(() => setSuccess(''), 3000);
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar contraseña');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box relative bg-base-100 max-w-md">
        <button 
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="avatar relative group">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img 
                src={formData.profile_picture 
                  ? URL.createObjectURL(formData.profile_picture) 
                  : user?.profile_picture || 'https://api.placeholder.com/150'} 
                alt="User avatar"
              />
              <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Image className="w-6 h-6 text-white" />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFormData({...formData, profile_picture: e.target.files[0]})}
                />
              </label>
            </div>
          </div>
          
          <div className="tabs tabs-boxed">
            <button
              className={`tab ${activeTab === 'info' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <User className="w-4 h-4 mr-2" />
              Información
            </button>
            <button
              className={`tab ${activeTab === 'password' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <LockKeyhole className="w-4 h-4 mr-2" />
              Contraseña
            </button>
          </div>

          {(success || error) && (
            <div className={`alert ${success ? 'alert-success' : 'alert-error'} py-2`}>
              <span>{success || error}</span>
            </div>
          )}

          {activeTab === 'info' ? (
            <form className="w-full space-y-4" onSubmit={handleUpdateInfo}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Actualizar Información'}
              </button>
            </form>
          ) : (
            <form className="w-full space-y-4" onSubmit={handleUpdatePassword}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contraseña Actual</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nueva Contraseña</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirmar Contraseña</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </button>
            </form>
          )}

          <div className="divider my-2"></div>

          <div className="w-full space-y-2">
            <div className="dropdown dropdown-top w-full">
              <label tabIndex={0} className="btn btn-ghost w-full justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Tema
                </span>
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mb-2">
                {themes.map((theme) => (
                  <li key={theme.value}>
                    <button 
                      className="flex items-center gap-2"
                      onClick={() => document.documentElement.setAttribute('data-theme', theme.value)}
                    >
                      {theme.icon}
                      {theme.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              className="btn btn-error w-full"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;