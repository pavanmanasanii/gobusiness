import {Component} from 'react'
import {Navigate} from 'react-router-dom'
import Cookie from "js-cookie"
import './index.css'

const apiconstants = {
    success: 'SUCCESS',
    failure: 'FAILURE',
    initial: 'INITIAL',
    inprogress: 'INPROGRESS'
}

class Login extends Component{
    state = {
        loginapistatus: apiconstants.initial,
        email: '',
        password: '',
        showErr: false,
        errMsg: '',
    }
    
    onFormsubmit = async (event) => {
        event.preventDefault()
        const {email,password} = this.state
        this.setState({loginapistatus: apiconstants.inprogress,showErr: false,errMsg: ""})
       
            
        
        const loginUrl=`https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin`
        const userdata ={
            email: email,
            password: password
        }
        const options ={
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(userdata) 
        }
        try{
            const response = await fetch(loginUrl,options)
            const data = await response.json() 
            if(response.ok === true){
                this.setState({loginapistatus: apiconstants.success,showErr: false,errMsg: ""})
                const token = data.data.token;
                Cookie.set("jwt_token", token, { expires: 1 })
            }  
            else{
                this.setState({loginapistatus: apiconstants.failure,showErr: true,errMsg: data.message})
            }
        }
        catch(e){
          this.setState({
          loginapistatus: apiconstants.failure
        })
        }
    }

    render(){
        const {showErr,errMsg,password,email} = this.state
        const token = Cookie.get("jwt_token")
        if(token){
           return <Navigate to={'/'} />
        }
        return(
            <div className='maincontainer'>
                <div className='logincontainer'>
                   <form className="loginform" onSubmit={this.onFormsubmit}>
                     <h1 className='logo'>Go Business</h1>
                     <p className='tagline'>Sign in to open your referral dashboard.</p>
                     <div className='inputcontainer'>
                     <label htmlFor="email">Email</label>
                     <input type="text" id="email" placeholder="you@example.com" value={email} onChange={(event) => this.setState({email: event.target.value})}/>
                     </div>
                     <div className='inputcontainer'>
                     <label htmlFor="password">Password</label>
                     <input type="password" id="password" placeholder=".........." value={password} onChange={(event) => this.setState({password: event.target.value})}/>
                     </div>
                     <button className='signin' type="submit">Sign in</button>
                     {showErr && <p className='errormessage'>{errMsg}</p>}
                    </form>  
                </div> 
            </div>
        )
    }
}


export default Login