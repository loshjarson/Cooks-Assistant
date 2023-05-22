import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

//Views
import Landing from './views/Landing';
import Home from './views/Home';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' Component={Landing}/>
        <Route path='/home' Component={Home}/>
      </Routes>
    </Router>
  );
}

export default App;
