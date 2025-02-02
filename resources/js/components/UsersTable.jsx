import React, { useState, useEffect } from 'react';
import { AxiosRouter } from '../services/utils/Axios.utis';
import { Pencil, Trash2, X, Check } from 'lucide-react';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const roles = {
    1: 'Admin',
    2: 'Editor',
    3: 'Usuario'
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data } = await AxiosRouter.get('/api/users');
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Error cargando usuarios');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateRole = async () => {
    try {
      await AxiosRouter.patch(`/api/users/${editingUser.id}/role`, {
        role_id: editingUser.role_id
      });
      const updatedUsers = users.map(user => 
        user.id === editingUser.id ? editingUser : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
    } catch (err) {
      setError('Error actualizando rol');
      console.error('Error updating role:', err);
    }
  };

  const handleDelete = async (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await AxiosRouter.delete(`/api/users/${userToDelete.id}`);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Error eliminando usuario');
      console.error('Error deleting user:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
          Gestión de Usuarios
        </h2>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Avatar</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <div className="avatar">
                      <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                          src={user.profile_picture || 'https://api.placeholder.com/150'}
                          alt={user.name}
                          onError={(e) => {
                            e.target.src = 'https://api.placeholder.com/150';
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {editingUser?.id === user.id ? (
                      <select
                        className="select select-bordered select-sm"
                        value={editingUser.role_id}
                        onChange={(e) => setEditingUser({...editingUser, role_id: e.target.value})}
                      >
                        {Object.entries(roles).map(([id, name]) => (
                          <option key={id} value={id}>{name}</option>
                        ))}
                      </select>
                    ) : (
                      roles[user.role_id]
                    )}
                  </td>
                  <td className="flex gap-2">
                    {editingUser?.id === user.id ? (
                      <>
                        <button
                          className="btn btn-circle btn-sm btn-success"
                          onClick={handleUpdateRole}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          className="btn btn-circle btn-sm btn-ghost"
                          onClick={() => setEditingUser(null)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-circle btn-sm btn-ghost"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="btn btn-circle btn-sm btn-ghost text-error"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmar Eliminación</h3>
            <p className="py-4">
              ¿Estás seguro de que deseas eliminar al usuario {userToDelete?.name}?
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={confirmDelete}
              >
                Eliminar
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;