import { ReactNode, createContext } from "react";

interface Props {
    children: ReactNode
}

const AuthContext = createContext({});

export const AuthProvider = (props: Props) => {
    return <AuthContext.Provider value={{}}>
        {props.children}
    </AuthContext.Provider>
}