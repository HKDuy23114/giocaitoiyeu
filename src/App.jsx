import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DraftPage from "./pages/DraftPage";
import DataPage from "./pages/DataPage";
function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<HomePage />} />
                <Route path="/data" element={<DataPage />} />
                <Route path="/draft" element={<DraftPage />} />

            </Routes>

        </BrowserRouter>

    );

}

export default App;