import { useState } from 'react';
import { login } from '../../services/auth.service';

const LoginForm = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!form.email) {   
      newErrors.email = 'Email is required ';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear field error on change
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await login({
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('token', response.data.token);
      window.location.href = '/task';
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <h3 className="text-center mb-3">Login</h3>

      {serverError && (
        <div className="alert alert-danger">{serverError}</div>
      )}

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          // type="email"
          name="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
