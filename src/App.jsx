import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DraftPage from "./pages/DraftPage";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<HomePage />} />

                <Route path="/draft" element={<DraftPage />} />

            </Routes>

        </BrowserRouter>

    );

}

export default App;