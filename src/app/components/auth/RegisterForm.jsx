import { useState } from 'react';
import { register } from '../../services/auth.service';
import { EMAIL_REGEX, PASSWORD_REGX } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);


  const validate = () => {
    const newErrors = {};

    form.name = form.name.trim() ;
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!(EMAIL_REGEX).test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (!PASSWORD_REGX.test(form.password)) {
      newErrors.password =
        'Password must be at least 6 characters and include a letter, number, and special character';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });


    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
     setSuccess(false);

    if (!validate()) return;

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword
      });
       setSuccess(true); 

      setSuccess('Registration successful. You can now login.');
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
const goToLogin = () => {
    navigate('/login');
};
 return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <h3 className="text-center mb-3">Register</h3>

      {serverError && <div className="alert alert-danger">{serverError}</div>}

      {success && (
        <>
          <div className="alert alert-success d-flex justify-content-between align-items-center">
          <span>Registration successful! You can now login.</span>
         
        </div>
         <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={goToLogin}
          >
            Go to Login
          </button>
        
     
        </>
       )}

      {!success && (
        <>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </>
      )}
    </form>
  );
  
};

export default RegisterForm;