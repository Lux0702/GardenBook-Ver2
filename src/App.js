import './App.css';
import {useEffect} from 'react'
import AppRouter from './routers/Router'
import { useTokenExpirationCheck } from './services/useTokenExpirationCheck';
function App() {
  const { isChange, checkTokenExpiration } = useTokenExpirationCheck();
  useEffect(() => {
    // Kiểm tra token khi component được mount
    checkTokenExpiration();

    // Thiết lập interval để kiểm tra token định kỳ 
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 1500000); 

    return () => clearInterval(interval);
  }, []);
  return (
    <div className='App'>
          <AppRouter />
    </div>
  );
}

export default App;
