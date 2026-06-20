import {Component} from "react"
import {Routes,BrowserRouter, Route,Navigate} from "react-router-dom"

import Login from "./components/Login/Login"
import DashboardWrapper from "./components/Dashboard/index"
import ReferralDetailsWrapper from "./components/ReferalDetails/index"
import ProtectedRoute from "./components/ProtectedRoute/index"
import NotFound from "./components/NotFound/index"
import "./App.css"




class App extends Component {
  
    render() {
      return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardWrapper />
                </ProtectedRoute>
                }
                />
          <Route
                path="/referral/:id"
                element={
                <ProtectedRoute>
                  <ReferralDetailsWrapper />
                </ProtectedRoute>}
              />
          
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />}/>
        </Routes>
      </BrowserRouter>
      )
    }
}

export default App