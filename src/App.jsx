import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DraftPage from "./pages/DraftPage";
import DataPage from "./pages/DataPage";
import DraftDemoPage from "./pages/DraftDemoPage";
import DraftCalculator from "./pages/DraftCalculator";
function App() {

    return (

        <BrowserRouter>

            <Routes>
                <Route path="/calculator" element={<DraftCalculator/>}/>
                <Route path="/" element={<HomePage />} />
                <Route path="/data" element={<DataPage />} />
                <Route path="/draft" element={<DraftPage />} />
                <Route path="/demo" element={<DraftDemoPage />} />
            </Routes>

        </BrowserRouter>

    );

}

export default App;