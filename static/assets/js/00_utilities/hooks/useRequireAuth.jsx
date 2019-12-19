import {useEffect} from "react";
import {useAuth} from "./useAuth";
import {useRouter} from "./useRouter";

const useRequireAuth = (redirectUrl = '/signup') => {
    const authentication = useAuth();
    const {auth: {isAuthenticated, isLoading}} = authentication;
    const router = useRouter();

    // If auth.user is false that means we're not
    // logged in and should redirect.
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            router.push(redirectUrl);
        }
    }, [isAuthenticated]);

    return authentication;
};

export default useRequireAuth;