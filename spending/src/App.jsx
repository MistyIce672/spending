import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home, Login,Account } from "./pages";



const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/account" element={<Account />}/>
            
          </Routes>
      </HashRouter>
    </QueryClientProvider>
  )
}

export default App
