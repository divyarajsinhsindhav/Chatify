import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import CreateRoom from './components/CreateRoom';
import FindRoom from './components/Search';
import ProtectedRoute from './utils/ProtectedRoute';
import PublicRoute from './utils/PublicRoute';
import Profile from './components/Profile';
import RoomInfo from './components/RoomInfo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<Layout />}>
        {
          /**
           * Public routes 
           */
        }
        <Route element={<PublicRoute />}>
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Route>
        {
          /**
           * Protected routes 
           */
        }
        <Route element={<ProtectedRoute />}>
          <Route path="chatroom/create" element={<CreateRoom />} />
          <Route path="chatroom/find" element={<FindRoom />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chatroom/info/:id" element={<RoomInfo />} />
        </Route>
        {
          /**
           * 404 Error
           */
        }
        <Route path="*" element={<h1 className="text-center text-4xl h-screen m-4">404 Error!❌</h1>} />
      </Route>
      <Route element={< ProtectedRoute/>}>
        <Route path="chatroom" element={<ChatRoom />} />
        <Route path="chatroom/:id" element={<ChatRoom />} />
      </Route>
    </Routes>
  );
}

export default App;
