import { BrowserRouter, Routes, Route } from "react-router"
import { BrowseProvider } from "./contexts/BrowseContext"
import { Home } from "./screens/Home"
import { PageView } from "./screens/PageView"
import { Settings } from "./screens/Settings"
import { BrowseGlasses } from "./glass/BrowseGlasses"
import { Shell } from "./layouts/shell"

export function App() {
  return (
    <BrowseProvider>
      <BrowserRouter>
        <BrowseGlasses />
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<PageView />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BrowseProvider>
  )
}
