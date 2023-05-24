import { Router, Routes, Route } from 'react-router-dom';
import './App.css';

//Views
import Landing from './views/Landing';
import Home from './views/Home';
import history from './history';


function App() {
  return (
    <Router history={history}>
      <Routes>
        <Route exact path='/' Component={Landing}/>
        <Route path='/home' Component={Home}/>
      </Routes>
    </Router>
  );
}

export default App;
