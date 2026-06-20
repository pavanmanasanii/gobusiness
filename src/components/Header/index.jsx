import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link, Navigate} from 'react-router-dom'
import './index.css'

class Header extends Component {
    state = {
    logout: false,
}

    onLogout = () => {
        Cookies.remove('jwt_token')
        this.setState({logout: true})
    }

    render() {
        const {logout} = this.state

        if (logout) {
            return <Navigate to="/login" />
        }

        return (
            <header className="headercontainer">
                <Link to="/" className="logolink">
                <h1 className="logo">Go Business</h1>
                </Link>
                <div className="headerright">
                <button type="button" className="trybutton">
                    Try for free
                </button>
                <button
                    type="button"
                    className="logoutbutton"
                    onClick={this.onLogout}
                >
                    Log out
                </button>
                </div>
            </header>
        )
    }
}

export default Header