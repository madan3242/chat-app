import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { UserInterface } from "../interfaces";
import { LocalStorage, requestHandler } from "../utils";
import { loginUser, logoutUser, signupUser } from "../api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const AuthContext = createContext<{
    user: UserInterface | null;
    token: string | null;
    login: (data: {username: string, password: string}) => Promise<void>;
    signup: (data: {username: string, email: string, password: string }) => Promise<void>;
    logout: () => Promise<void>;
}>({
    user: null,
    token: null,
    login: async () => {},
    signup: async () => {},
    logout: async () => {}
});

// Create a hook to access the AuthContext
const useAuth = () => useContext(AuthContext);

//Create a component that provides authentication related data and functions
const AuthProvider: React.FC<{ children: ReactNode}> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<UserInterface | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const navigate = useNavigate();

    // Function to handle user login
    const login = async (data: { username: string, password: string}) => {
        await requestHandler(
            async () => await loginUser(data),
            setLoading,
            (res) => {
                const { data } = res;                
                setUser(data.user);
                setToken(data.token);
                LocalStorage.set("user", data.user);
                LocalStorage.set("token", data.token);
                navigate("/chat"); //Redirect to the chat page after successful login
            },
            alert //Display error alerts on request failure
        )
    }

    // Function to handle user signup
    const signup = async (data: {
        username: string,
        email: string,
        password: string
    }) => {        
        await requestHandler(
            async () => await signupUser(data),
            setLoading,
            () => {
                alert("Account created successfully! Go ahead and login");
                navigate("/login"); //Redirect to the login page after successful signup
            },
            alert //Display error alerts on request failure
        )
    }

    // Function to handle user logout
    const logout = async () => {        
        await requestHandler(
            async () => await logoutUser(),
            setLoading,
            () => {
                setUser(null);
                setToken(null);
                LocalStorage.clear();
                navigate("/login") //Redirect to the login page after logout 
            },
            alert //Display error alerts on request failure
        )
    }

    useEffect(() => {
      setLoading(true);
      const _token = LocalStorage.get("token");
      const _user = LocalStorage.get("user");
      if (_token && _user?._id) {
        setUser(_user);
        setToken(_token);
      }
      setLoading(false)
    }, [])
    
    return <AuthContext.Provider value={{ user, token, login, signup, logout}}>
        {loading ? <Loader /> : children}
    </AuthContext.Provider>
}

export {
    useAuth,
    AuthProvider
}