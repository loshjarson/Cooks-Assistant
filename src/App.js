import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

//Views
import Landing from './Views/Landing';
import Home from './Views/Home';
import history from './App/history';


function App() {
  return (
    <Router history={history}>
      <Routes>
        <Route exact path='/' Component={Landing}/>
        <Route path='/*' Component={Home}/>
      </Routes>
    </Router>
  );
}

export default App;
