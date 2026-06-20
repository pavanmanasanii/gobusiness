import {Link} from "react-router-dom"
import "./index.css"

const NotFound = () => (
  <div className="notfoundcontainer">
    <div className="notfoundcard">
      <h1 className="notfoundheading">404</h1>
      <p className="notfoundtext">Page not found</p>
      <Link to="/" className="backlink">
        Back to dashboard
      </Link>
    </div>
  </div>
)

export default NotFound