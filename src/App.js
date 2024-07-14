import './App.css';
import {useEffect} from 'react'
import AppRouter from './routers/Router'
import { useTokenExpirationCheck } from './services/useTokenExpirationCheck';


function App() {
  const { isChange, checkAllTokenExpirations } = useTokenExpirationCheck();
  const user = JSON.parse(localStorage.getItem('userInfo') || '""');

  useEffect(() => {
    // Kiểm tra token khi component được mount
    checkAllTokenExpirations();
    // Thiết lập interval để kiểm tra token định kỳ 
    const interval = setInterval(() => {
      checkAllTokenExpirations();
    }, 1740000); //29p

    return () => clearInterval(interval);
  }, []);
  return (
    <div className='App'>
          <AppRouter />
    </div>
  );
}

export default App;
