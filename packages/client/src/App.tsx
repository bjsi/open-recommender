import "./App.css";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { VideosPage } from "./components/VideosPage";
import { Homepage } from "./components/Homepage";
import { NoPage } from "./components/NoPage";
import { ProfilePage } from "./components/ProfilePage";
import { useAuth } from "./lib/useAuth";
import { TermsOfService } from "./components/TermsOfService";
import { Privacy } from "./components/Privacy";
import { AdminPage } from "./components/AdminPage";

function App() {
  const auth = useAuth();
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage auth={auth} />} />
          <Route path="user/:user/feed" element={<VideosPage auth={auth} />} />
          <Route
            path="user/:user/profile"
            element={<ProfilePage auth={auth} />}
          />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
