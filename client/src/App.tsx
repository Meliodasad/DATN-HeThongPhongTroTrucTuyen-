
import './App.css'
import Footer from './components/Footer';
import Header from './components/Header';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'  
    }}>
      <Header />

      <main style={{ flex: 1 }}>
       <HomePage />
      </main>
      

      <Footer />
    </div>
  );
}

export default App
