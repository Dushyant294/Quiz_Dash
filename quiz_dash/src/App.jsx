import { HashRouter, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";

function App() {
  
  return (
     <HashRouter>
      
        <Route element={<AuthLayout />}>
         <Route path="/login" element={<Login />} />
        </Route>
      
    </HashRouter>
  );
}

export default App;
