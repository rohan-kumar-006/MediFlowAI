import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";                     
import Dashboard from "./components/Dashboard";  
import Assistant from "./components/Assistant";
import UserContext from "./context/UserContext";
import Recommendation from "./components/Recommendation";
import Payment from "./components/Payment";
import Success from "./components/Success";

const App = () => {
  return (
    <Router>
      <UserContext>
       
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Home/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </UserContext>
    </Router>
  );
};

export default App;
