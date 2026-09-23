import Header from './components/Header'
import About from './components/About'
import Contact from './components/Contact'
import './App.css'

function App() {
  return (
    <div className="container">
      <svg className="blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path
          transform="translate(100 100)"
          d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-1C87,14.4,81.4,28.7,73.1,41.4C64.8,54.1,53.7,65.1,40.6,72.6C27.5,80.1,13.7,84,-0.6,85C-14.9,86,-29.8,84,-42.2,77C-54.6,70,-64.5,57.9,-72.3,44.6C-80.1,31.3,-85.8,15.6,-85.4,0.2C-85,-15.2,-78.5,-30.4,-69.1,-43C-59.7,-55.6,-47.4,-65.6,-34,-73.4C-20.6,-81.2,-10.3,-86.8,2.3,-90.7C14.9,-94.6,30.6,-83.6,44.7,-76.4Z"
        />
      </svg>
      <Header />
      <About />
      <Contact />
    </div>
  )
}

export default App