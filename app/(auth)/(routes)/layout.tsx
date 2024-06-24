import React, { ReactNode } from 'react';


// Define the type for the props
interface LayoutProps {
  children: ReactNode;
}

// Define the layout component with props typed
const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='auth-page'>
      {children}
    </div>
  );
};

export default AuthLayout;
