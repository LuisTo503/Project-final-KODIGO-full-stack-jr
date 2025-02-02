import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Github, Chrome, User, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function FormLogin() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { user, login, register } = useAuth();
  const { register: registerField, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    if (isLoginMode) {
      const result = await login({ email: data.email, password: data.password });
      if (!result.success) {
        console.error('Login failed:', result.error);
      }
    } else {
      const result = await register({
        name: data.name,
        email: data.email,
        password: data.password,
        profile_picture: data.profile_picture?.[0]
      });
      if (!result.success) {
        console.error('Registration failed:', result.error);
      }
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    reset();
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="card w-96 shadow-xl bg-white/80 backdrop-blur-sm">
        <div className="card-body">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-pink-200 to-purple-200">
              <Lock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLoginMode && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-600 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`input input-bordered bg-white/50 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                    errors.name ? 'input-error' : ''
                  }`}
                  {...registerField('name', { required: !isLoginMode })}
                />
                {errors.name && <span className="text-red-500 text-sm mt-1">Name is required</span>}
              </div>
            )}
            
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </span>
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                className={`input input-bordered bg-white/50 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                  errors.email ? 'input-error' : ''
                }`}
                {...registerField('email', { 
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                })}
              />
              {errors.email && <span className="text-red-500 text-sm mt-1">Valid email is required</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-600 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered bg-white/50 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                  errors.password ? 'input-error' : ''
                }`}
                {...registerField('password', { 
                  required: true,
                  minLength: 6
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  Password must be at least 6 characters
                </span>
              )}
            </div>

            {!isLoginMode && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-600 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Profile Picture
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="file-input file-input-bordered w-full bg-white/50 rounded-xl"
                  {...registerField('profile_picture')}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-block rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 border-none text-white hover:opacity-90 transition-all mt-6"
            >
              {isLoginMode ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button 
              onClick={toggleMode}
              className="text-sm text-gray-500 hover:text-purple-400 transition-colors"
            >
              {isLoginMode ? 'Create new account' : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="divider my-6">or continue with</div>
          <div className="flex justify-center gap-4">
            <button className="btn btn-circle btn-outline hover:bg-pink-50 hover:border-pink-300">
              <Chrome className="w-5 h-5" />
            </button>
            <button className="btn btn-circle btn-outline hover:bg-purple-50 hover:border-purple-300">
              <Github className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}