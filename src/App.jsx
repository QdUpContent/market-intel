import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./theme";
import { PlayerProvider } from "./components/AudioPlayer";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Episodes from "./pages/Episodes";
import Glossary from "./pages/Glossary";
import Platforms from "./pages/Platforms";
import Tools from "./pages/Tools";

export default function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="episodes" element={<Episodes />} />
              <Route path="glossary" element={<Glossary />} />
              <Route path="platforms" element={<Platforms />} />
              <Route path="tools" element={<Tools />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </ThemeProvider>
  );
}
