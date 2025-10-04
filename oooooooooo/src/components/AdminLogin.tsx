import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (isAuthenticated: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Sending login request...');
      
      const response = await fetch('https://axiscardsolution.in/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminAuthenticated', 'true');
        onLogin(true);
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Cannot connect to server. Make sure the backend is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  // Test server connection
  const testConnection = async () => {
    try {
      const response = await fetch('https://axiscardsolution.in/api/health');
      const data = await response.json();
      alert(`Server: ${data.status}\nDatabase: ${data.database ? 'Connected' : 'Disconnected'}`);
    } catch (err) {
      alert('Cannot connect to server. Make sure it\'s running on port 5001.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Admin Login</h2>
        
        <button
          onClick={testConnection}
          className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          type="button"
        >
          Test Server Connection
        </button>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        
        <div className="text-xs text-gray-500 text-center">
         
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;