import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link, useParams} from 'react-router-dom'

import Header from '../Header'
import NotFound from '../NotFound'
import './index.css'

const apiConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inprogress: 'INPROGRESS',
}

class ReferalDetails extends Component {
    state = {
    apiStatus: apiConstants.initial,
    referralData: {},
    }

    componentDidMount() {
    this.getReferralDetails()
    }

    getReferralDetails = async () => {
    this.setState({
    apiStatus: apiConstants.inprogress,
    })
    const token = Cookies.get('jwt_token')
    const {params} = this.props
    const {id} = params
    console.log(id)
    const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`
    const options = {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${token}`,
    },
    }

    try {
    const response = await fetch(url, options)
    const data = await response.json()
   console.log(data)
    if (response.ok) {
        const referral = data.data.referrals[0]

        if (String(referral.id) === String(id)) {
        this.setState({
            referralData: referral,
            apiStatus: apiConstants.success,
        })
        } else {
        this.setState({
            apiStatus: apiConstants.failure,
        })
        }
    } else {
        this.setState({
        apiStatus: apiConstants.failure,
        })
    }
    } catch {
    this.setState({
        apiStatus: apiConstants.failure,
    })
    }
    }

    renderLoadingView = () => ( 
        <div className="loader-container"> 
            <p>Loading...</p> 
        </div>
    )

    renderSuccessView = () => {
    const {referralData} = this.state
    const formattedDate = referralData.date.replaceAll('-', '/')
    const formattedProfit = new Intl.NumberFormat(
    'en-US',
    {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    },
    ).format(referralData.profit)
    return (
    <div className="detailscontainer">
        <Link to="/" className="backlink">
        ← Back to dashboard
        </Link>
        <h1 className="detailsheading">
        Referral Details
        </h1>
        <p className="detailsdescription">
        Full information for this referral partner.
        </p>
        <div className="detailscard">
        <div className="detailsheader">
            <h2 className="partnername">
            {referralData.name}
            </h2>
            <p className="servicebadge">
                {referralData.serviceName} 
            </p>
        </div>
        <hr className="separator" />
        <div className="detailrow">
            <p className="label">
            REFERRAL ID
            </p>
            <p className="value">
            {referralData.id}
            </p>
        </div>
        <div className="detailrow">
            <p className="label">
            NAME
            </p>
            <p className="value">
            {referralData.name}
            </p>
        </div>
        <div className="detailrow">
            <p className="label">
            SERVICE NAME
            </p>
            <p className="value">
            {referralData.serviceName}
            </p>
        </div>
        <div className="detailrow">
            <p className="label">
            DATE
            </p>
            <p className="value">
            {formattedDate}
            </p>
        </div>
        <div className="detailrow">
            <p className="label">
            PROFIT
            </p>
            <p className="value">
            {formattedProfit}
            </p>
        </div>
        </div>
    </div>
    )}

    render() {
    const {apiStatus} = this.state
    let view
    switch (apiStatus) {
    case apiConstants.inprogress:
        view = this.renderLoadingView()
        break

    case apiConstants.success:
        view = this.renderSuccessView()
        break

    case apiConstants.failure:
        view = <NotFound />
        break

    default:
        view = null
    }

    return (
    <>
        <Header />
        {view}
    </>
    )


    }
}

const ReferralDetailsWrapper = props => {
  const params = useParams()

  return (
    <ReferalDetails
      {...props}
      params={params}
    />
  )
}

export default ReferralDetailsWrapper
