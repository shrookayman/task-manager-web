const AuthLayout = ({ children }) => (
  <div className="container">
    <div className="row justify-content-center align-items-center vh-100">
      <div className="col-md-4">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
