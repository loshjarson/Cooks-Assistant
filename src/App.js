import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

//Views
import Login from './views/login';
import Home from './views/home';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' Component={Login}/>
        <Route path='/home' Component={Home}/>
      </Routes>
    </Router>
  );
}

export default App;
