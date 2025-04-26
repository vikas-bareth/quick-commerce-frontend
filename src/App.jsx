import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
import { appStore } from "./utils/appStore";
import PageNotFound from "./components/PageNotFound";
import { BadgeProvider } from "./context/BadgeContext";
import Signup from "./components/Signup";

function App() {
  return (
    <Provider store={appStore}>
      <BadgeProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </BadgeProvider>
    </Provider>
  );
}

export default App;
