import { LOCALSTORAGE_TOKEN } from './constants';
import {ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token))
export const authToken = makeVar(token);

export const client = new ApolloClient({
     uri : "https://podcast-kjm.herokuapp.com/graphql",
  //  uri : "http://localhost:4000/graphql",
    cache : new InMemoryCache({
        typePolicies:{
            Query:{
                fields:{
                    isLoggedIn:{
                        read(){
                            return isLoggedInVar();
                        }
                    },
                    token: {
                        read(){
                            return authToken();
                        }
                    }
                }
            }
        }
    })
})