import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Splash from "./pages/Splash";
import RelatorioAnalitico from "./pages/RelatorioAnalitico";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/relatorio-igrejas-analitico"
            element={<RelatorioAnalitico />}
          />
          <Route
            path="/relatorio-igrejas-sintetico"
            element={<RelatorioAnalitico />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
