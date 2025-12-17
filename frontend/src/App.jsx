import {Toaster} from "react-hot-toast";
import {Navigate, Route, Routes} from "react-router";
import {CallPage, ChatPage, HomePage, NotificationPage, OnboardingPage, SignInPage, SignUpPage} from "./pages/index.js";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

const App =() => {
    const {authUser,isLoading} = useAuthUser();
    const {theme} = useThemeStore();
    const isAuthenticated = Boolean(authUser);
    const isOnboarded = authUser?.isOnboarded;

    if(isLoading) {
        return <PageLoader/>
    }
    return (
      <div className="h-screen" data-theme={theme}>
          <Routes>
            <Route path="/"
                   element={
                            isAuthenticated && isOnboarded
                                ?
                                <Layout showSidebar={true}>
                                    <HomePage />
                                </Layout>
                                :
                                <Navigate to={!isAuthenticated ? "/signin" : "/onboarding" } />
                            }
            />
            <Route path="/signin" element={!isAuthenticated ? <SignInPage/> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
            <Route path="/signup" element={!isAuthenticated ? <SignUpPage/> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
            <Route path="/onboarding" element={isAuthenticated ? (!isOnboarded ?(<OnboardingPage/>):(<Navigate to="/" />)) : <Navigate to="/signin" />} />
            <Route path="/notifications" element={isAuthenticated ? (
                <Layout showSidebar={true}>
                    <NotificationPage/>
                </Layout>
            ) : <Navigate to="/signin" /> } />
              <Route path="/chat/:id" element={isAuthenticated && isOnboarded ? (
                  <Layout showSidebar={false}>
                    <ChatPage/>
                  </Layout>) :
                  <Navigate to={isAuthenticated ? "/signin": "/onboarding"} /> } />
              <Route path="/call/:id" element={isAuthenticated && isOnboarded ? <Layout showSidebar={true}>
                  <CallPage />
              </Layout> : <Navigate to={isAuthenticated ? "/signin": "/onboarding"} /> } />
          </Routes>
          <Toaster/>
      </div>
  )
}
export default App
