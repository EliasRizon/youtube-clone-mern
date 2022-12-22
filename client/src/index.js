import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import GlobalStyles from './components/GlobalStytes'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { reducers } from './reducers'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') disableReactDevTools()

const store = configureStore({ reducer: reducers })

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <GoogleOAuthProvider clientId="36544663310-pcqsqlhvlllbf1msfi532jda281o613t.apps.googleusercontent.com">
      <GlobalStyles>
        <App />
      </GlobalStyles>
    </GoogleOAuthProvider>
    {/* </React.StrictMode> */}
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
