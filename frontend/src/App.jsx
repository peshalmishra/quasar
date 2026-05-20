import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext.jsx';
import Login from './components/Login';
import Register from './components/Register';
import First from './components/First';
import ProtectedRoute from './components/ProtectedRoute';
import Show from './components/Show';
import Editor from './components/Editor';

const appRouter = createBrowserRouter([
  { path: '/', element: <First /> },
  {
    path: '/showtask/:id/:projectId?',
    element: (
      <ProtectedRoute>
        <Show />
      </ProtectedRoute>
    ),
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/editor', element: <Editor /> },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;