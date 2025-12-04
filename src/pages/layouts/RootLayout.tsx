import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

const RootLayout: React.FC = () => {
  return (
    <div className="app-container min-vh-100 d-flex flex-column bg-dark text-light">
      <Header />
      <div className="flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
