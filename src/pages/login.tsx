import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { authToken, isLoggedInVar } from "../apollo";
import { FormError } from "../components/form-error";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { loginMutation, loginMutationVariables } from "../__generated__/loginMutation";

const LOGIN_MUTATION = gql`
    mutation loginMutation($loginInput: LoginInput!){
        login(input:$loginInput){
            ok
            token
            error
        }
    }
`;

interface IForm{
    email : string;
    password : string;
}

export const Login = ()=>{
    const {register, getValues, watch, handleSubmit,errors} = useForm<IForm>();
    const onCompleted = (data: loginMutation)=>{
        const { login : {error, ok, token}} = data;
        if(ok && token){
            localStorage.setItem(LOCALSTORAGE_TOKEN,token)
            authToken(token);
            isLoggedInVar(true);
        }
    }
    //const onError = (error: ApolloError)=>{}
    const [loginMutation,{data:loginMutationResult,loading}] = useMutation<loginMutation,loginMutationVariables>(
        LOGIN_MUTATION, {
        onCompleted,
     //   onError,
       }
   );
    const onSubmit = ()=>{
        if(!loading){
            const {email, password} = getValues();
            loginMutation({
                variables :{
                    loginInput:{
                        email ,
                        password,
                    }
                }
            })
        }
    }
  

    return (
        <div className="h-screen flex items-center flex-col justify-center bg-gray-800 ">
            <div className="w-full w-full max-w-lg py-10 rounded-lg text-center bg-white">
                <h3 className="text-2xl text-gray-800">Log In</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 px-5">
                    <input 
                        ref={register({
                            required:"Email is required",
                          //  validate : (email:string)=>email.includes("@gmail.co")
                        })} 
                        name="email" 
                        type="email" 
                        required 
                        placeholder="email"
                        className="bg-gray-100 shadow-inner  hover:bg-gray-100  mb-3 py-3 px-3 rounded-lg"
                    />    
                    {errors.email?.message && (
                        <FormError errorMessage={errors.email?.message}/>
                    )}

                    <input 
                        ref={register({
                            required:"Password is required", minLength:10,
                        })} 
                        name="password" 
                        type="password" 
                        required 
                        placeholder="password"
                        className="bg-gray-100 shadow-inner  hover:bg-gray-100  mb-3 py-3 px-3 rounded-lg"
                    />
                    {errors.password?.message  && (
                        <FormError errorMessage={errors.password?.message}/>
                    )}
                    {errors.password?.type  && (
                        <FormError errorMessage="Passowrd must be more than 10 chars."/>
                    )}
                
                <button className="py-3 px-5 mt-3 bg-gray-800 text-white font-medium text-lg rounded-lg
                    focus:outline-none hover:opacity-90">
                        {loading ? "Loading..." : "Log In"}
                </button>
                {loginMutationResult?.login.error && 
                    <FormError errorMessage={loginMutationResult.login.error} />
                }
                </form>
            </div>
        </div>
    )
}