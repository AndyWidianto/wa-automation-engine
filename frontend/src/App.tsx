import { BrowserRouter, Routes } from 'react-router'
import { Route } from 'react-router'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Broadcast from './pages/broadcasts/Broadcast'
import AutoReply from './pages/autoreplies/AutoReply'
import Device from './pages/Device'
import { ThemeProvider } from './ThemeProvider'
import CreateAutoReply from './pages/autoreplies/CreateAutoreply'
import ProfileSettings from './pages/Settings'
import Notification from './pages/Notification'
import CreateBroadcast from './pages/broadcasts/CreateBroadcast'
import Knowledge from './pages/Knowledge/Knowledge'
import LoginPage from './pages/Login'
import Authorization from './Authorization'
import CreateKnowledgePage from './pages/Knowledge/CreateKnowledge'
import Home from './pages/Home'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import Products from './pages/products/Product'
import CreateProduct from './pages/products/CreateProduct'


export default function App() {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider>
      <Toaster position='top-right' />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Authorization><Layout /></Authorization>}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/create" element={<CreateProduct />} />
              <Route path="autoreply" element={<AutoReply />} />
              <Route path="autoreply/create" element={<CreateAutoReply />} />
              <Route path="broadcasts" element={<Broadcast />} />
              <Route path="broadcasts/create" element={<CreateBroadcast />} />
              <Route path="devices" element={<Device />} />
              <Route path="knowledge-base" element={<Knowledge />} />
              <Route path="knowledge-base/create" element={<CreateKnowledgePage />} />
              <Route path="tasks" element={<Dashboard />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="notifications" element={<Notification />} />
            </Route>

            <Route path="login" element={<LoginPage />} />

            {/* Test Page */}
            <Route path="/test" element={<h2>Hallo</h2>} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}