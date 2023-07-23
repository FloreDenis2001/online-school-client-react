import React, { useContext, useEffect, useState } from 'react'
import { ContextLogin } from '../context/LoginProvider'
import LoginContextType from '../models/LoginContextType'
import StudentService from '../services/StudentService';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import StudentLogin from '../dtos/StudentLogin';
import { eventNames } from 'process';
import LoginRequest from '../dtos/LoginRequest';
import HttpResponse from '../models/HttpResponse';
import useRefreshAction from './useRefreshAction';

type FormData = {
    name: string;
    email: string;
    password: string;
}

const Login: React.FC = () => {
    let { studentLogin, setStudent } = useContext(ContextLogin) as LoginContextType;

    const handleRefresh = () => {
        // Put your refresh logic here, for example, fetching new data from the server
        console.log('Refreshing...');
      };
    
      // Use the custom hook to add the refresh action to the component
      useRefreshAction(handleRefresh);
    
    

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    let studentService = new StudentService();

    let navigate = useNavigate();

    let goSingUp = (): void => {
        navigate("/singup");
    }
    let handleNavHome = (): void => {
        if(studentLogin!==undefined && studentLogin!==null){
        navigate("/home");
    }
    }

    let onSubmit = async (data: FormData) => {


        try {
            let rez = await studentService.logInn({ email: data.email, password: data.password });
            setStudent({
                studentId: rez['studentId'],
                email: rez['email'],
                token: rez['token'],
                firstName: rez['firstName'],
                lastName: rez['lastName'],
                userRole:rez['userRole']
            } as StudentLogin)
          
            console.log(studentLogin);
           Cookies.set("authentificatedUser",JSON.stringify(studentLogin));
           handleNavHome();
        } catch (err) {
            let result = (err as Error).message;


            console.log(result);
        }
    }


    return (
        <main className="login-container">
            <div className="main-login">

                <div className="login">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label>Login</label>
                        <input type="email" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
                        {errors.email && <span>Please enter a valid email address</span>}

                        <input type="password" {...register('password', { required: true, minLength: 6 })} />
                        {errors.password && <span>Password must be at least 6 characters long</span>}

                        <button type="submit" >Login</button>
                        <button onClick={goSingUp}>Sing Up</button>
                    </form>

                </div>
            </div>
        </main>
    )
}

export default Login


