// main.tsx
import ReactDOM from "react-dom/client";
import AppRoutes from "./routing/AppRoutes";
import "./index.css"; // Tailwind or global CSS
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ToastContainer } from "react-toastify";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  </BrowserRouter>,
);
