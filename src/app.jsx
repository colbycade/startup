import React from 'react';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Login from './login/login';
import Home from './home/home';
import About from './about/about';


export default function App() {
    return (
        <BrowserRouter>
            <div className='body'>
                <header>
                    <div className="logotitle">
                        <img src="assets/favicon.ico" alt="logo" width="100" height="100" />
                        <h1>Family Tracker</h1>
                    </div>
                    <nav>
                        <div className="menu">
                            <li><NavLink className='nav-link' to=''>Login</NavLink></li>
                            <li><NavLink className='nav-link' to='home'>Home</NavLink></li>
                            <li><NavLink className='nav-link' to='about'>About</NavLink></li>
                        </div>
                        <div className="log-out">
                            <button id="log-out-button">Logout</button>
                            {/* onClick={logout} */}
                        </div>
                    </nav>
                </header>
                <Routes>
                    <Route path='/' element={<Login />} exact />
                    <Route path='/home' element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
                <footer>
                    <hr />
                    <span> Made by Colby Wright</span>
                    <br />
                    <a href="https://github.com/colbycade/startup">GitHub</a>
                </footer>
            </div>
        </BrowserRouter >
    );
}

function NotFound() {
    return <main>404: Return to sender. Address unknown.</main>;
}