import { Component } from "react";
import {useNavigate} from 'react-router-dom'
import Cookies from "js-cookie";
import './index.css'
import Header from "../Header";

const apiConstants = {
    initial: 'INITIAL',
    inprogress: 'INPROGRESS',
    failure: 'FAILURE',
    success: 'SUCCESS'
}

class Dashboard extends Component{
    state = {
        apiStatus: apiConstants.initial,
        metrics: [],
        serviceSummary: {},
        referral: {},
        referrals: [],
        search: '',
        sort: 'desc',
        currentPage: 1,
        errorMsg: '',      
    }
    
    componentDidMount = () => {
      this.getDashboardData()
    }

    onChangeSearch = event => {
        this.setState({
            search: event.target.value,
            currentPage: 1,
        },
    )}

    onSearchEnter = event => {
        if (event.key === 'Enter') {
            this.setState(
            {
                currentPage: 1,
            },
            this.getDashboardData,
            )
        }
    }
    
    onChangeSort = event => {
        this.setState({
            sort: event.target.value,
            currentPage: 1,
        },
        this.getDashboardData,
    )}

    getDashboardData = async () => {
        this.setState({apiStatus: apiConstants.inprogress})
        const token = Cookies.get('jwt_token')
        const {search, sort} = this.state
        let url ='https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'
        const params = []
        if (search !== '') {
            params.push(`search=${search}`)
        }
        if (sort !== '') {
            params.push(`sort=${sort}`)
        }
        if (params.length > 0) {
            url += `?${params.join('&')}`
        }
        const options = {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }

        const response = await fetch(url, options)
        const data = await response.json()
        //console.log(data)
        if (response.ok) {
            const responseData = data.data || data
            this.setState({
            metrics: responseData.metrics || [],
            serviceSummary: responseData.serviceSummary || {},
            referral: responseData.referral || {},
            referrals: responseData.referrals || [],
            apiStatus: apiConstants.success,
            })
        } else {
            this.setState({
            apiStatus: apiConstants.failure,
            errorMsg: `${response.status} ${data.message || ''}`,
            })
        }
        
    }
    render() {
        const {
        metrics,
        serviceSummary,
        referral,
        referrals,
        search,
        sort,
        currentPage,
        apiStatus,
        errorMsg,
        } = this.state

    if (apiStatus === apiConstants.inprogress) {
        return <p>Loading...</p>
    }
    if (apiStatus === apiConstants.failure) {
        return <p role="alert">{errorMsg}</p>
    }
    const startIndex = (currentPage - 1) * 10
    const endIndex = startIndex + 10
    const currentRows = referrals.slice(startIndex, endIndex)
    const totalPages = Math.ceil(referrals.length / 10)

    return (
        <div className="dashboard-container">
             <Header />
        <h1>Referral Dashboard</h1>
        <p>
            Track your referrals, earnings, and partner activity in one place.
        </p>
        <section aria-label="Overview metrics">
            <h2>Overview</h2>
            <div>
            {metrics.map(each => (
                <div key={each.id}>
                <h3>{each.value}</h3>
                <p>{each.label}</p>
                </div>
            ))}
            </div>
        </section>
        <section aria-label="Service summary">
            <h2>Service summary</h2>
            <div>
            <div>
                <p>Service</p>
                <p>{serviceSummary.service}</p>
            </div>
            <div>
                <p>Your Referrals</p>
                <p>{serviceSummary.yourReferrals}</p>
            </div>
            <div>
                <p>Active Referrals</p>
                <p>{serviceSummary.activeReferrals}</p>
            </div>
            <div>
                <p>Total Ref. Earnings</p>
                <p>{serviceSummary.totalRefEarnings}</p>
            </div>
            </div>
        </section>
        <section aria-label="Share referral">
            <h2>Refer friends and earn more</h2>
          <div>
            <p>Your Referral Link</p>
            <input value={referral.link || ''} readOnly />
            <button type="button">Copy</button>
            </div>
            <div>
            <p>Your Referral Code</p>
            <input value={referral.code || ''} readOnly />
            <button type="button">Copy</button>
            </div>
        </section>
        <section>
            <h2>All referrals</h2>
            <input
            type="search"
            placeholder="Name or service…"
            value={search}
            onChange={this.onChangeSearch}
            onKeyDown={this.onSearchEnter}
            aria-label="Search referrals"
            />
            <label>
            Sort by date
            <select value={sort} onChange={this.onChangeSort}>
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
            </select>
            </label>
            <table>
            <thead>
                <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Date</th>
                <th>Profit</th>
                </tr>
            </thead>
            <tbody>
                {currentRows.length === 0 ? (
                <tr>
                    <td colSpan="4">No matching entries</td>
                </tr>
                ) : (
                currentRows.map(each => (
                    <tr
                    key={each.id}
                    onClick={() =>
                        this.props.navigate(`/referral/${each.id}`)
                    }
                    >
                    <td>{each.name}</td>
                    <td>{each.serviceName}</td>
                    <td>{each.date.replaceAll('-', '/')}</td>
                    <td>
                        {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                        }).format(each.profit)}
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
            <p>
            Showing {referrals.length === 0 ? 0 : startIndex + 1}–
            {Math.min(endIndex, referrals.length)} of {referrals.length}
            entries
            </p>
            <div>
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                this.setState({currentPage: currentPage - 1})
                }
            >
                Previous
            </button>
            {Array.from(
                {length: totalPages},
                (_, index) => index + 1,
            ).map(page => (
                <button
                key={page}
                type="button"
                onClick={() =>
                    this.setState({currentPage: page})
                }
                >
                {page}
                </button>
            ))}
            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                this.setState({currentPage: currentPage + 1})
                }
            >
                Next
            </button>
            </div>
        </section>
        <footer>
            <p>Go Business</p>
            <nav aria-label="Footer">
            <a href="/">About</a>
            <a href="/">Contact</a>
            <a href="/">Privacy</a>
            <a href="/">Terms</a>
            </nav>
            <p>© 2024 Go Business</p>
        </footer>
        </div>
  ) 
}   
}

const DashboardWrapper = props => {
  const navigate = useNavigate()

  return (
    <Dashboard
      {...props}
      navigate={navigate}
    />
  )
}
export default DashboardWrapper