import { BrowserRouter, Routes, Route } from "react-router"
import { BrowseProvider } from "./contexts/BrowseContext"
import { Home } from "./screens/Home"
import { PageView } from "./screens/PageView"
import { Settings } from "./screens/Settings"
import { BrowseGlasses } from "./glass/BrowseGlasses"

export function App() {
  return (
    <BrowseProvider>
      <BrowserRouter>
        <BrowseGlasses />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<PageView />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </BrowseProvider>
  )
}
