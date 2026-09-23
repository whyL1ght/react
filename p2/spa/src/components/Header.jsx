import photo from '../assets/photo.jpeg'

function Header() {
  return (
    <header className="header">
      <img src={photo} alt="My photo" className="avatar" />
      <h1 className="main-title">Toleutayev Alisher</h1>
      <p className="second-title">KBTU student</p>
    </header>
  )
}

export default Header