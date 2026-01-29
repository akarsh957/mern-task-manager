const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <div className="stars" />
      <div className="stars2" />
      <div className="stars3" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Layout;
