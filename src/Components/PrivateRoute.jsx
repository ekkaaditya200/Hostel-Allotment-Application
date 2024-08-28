import { Navigate } from 'react-router-dom';
import { useStateContext } from '../Contexts/ContextProvider';

const PrivateRoute = ({ element, roles }) => {
  const { user } = useStateContext();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/signin" />;
  }

  return element;
};

export default PrivateRoute;
