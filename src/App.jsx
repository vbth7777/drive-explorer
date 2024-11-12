import { GoogleApiProvider } from "react-gapi";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";

function App() {
  return (
    <GoogleApiProvider clientId="281696086517-19d7gtmglok4j61ml5vesrfnmg2j1f2e.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/*" element={<Home />}></Route>
        </Routes>
      </Router>
    </GoogleApiProvider>
  );
}
export default App;
