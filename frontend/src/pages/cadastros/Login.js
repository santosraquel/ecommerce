import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { LoginService } from '../../service/util/LoginService';

    const Login = () => {

    const [email, setEmail] =  useState("");
    const [senha, setSenha] = useState("");
    const loginService = new LoginService();
    const toast = useRef(null);

    const fazerLogin = () =>{
        console.log(email+" "+senha);
        loginService.login(email, senha);
    }

    // const mostrarMensagemErro = (erro) =>{
    //     toast.current.show({ severity: 'error', summary: 'Erro', detail: erro, life: 3000 });

    // }

        return (
            <div className="surface-ground px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
                <Toast ref={toast}/>
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Login Painel Administrativo</div>
                </div>

                <div>
                    <label htmlFor="email1" className="block text-900 font-medium mb-2">Email</label>
                    <InputText id="email1" type="text" className="w-full mb-3" onChange={(e)=>setEmail(e.target.value)}/>

                    <label htmlFor="password1" className="block text-900 font-medium mb-2">Senha</label>
                    <InputText id="password1" type="password" className="w-full mb-3" onChange={(e)=>setSenha(e.target.value)}/>

                    <div className="flex align-items-center justify-content-between mb-6">
                        <div className="flex align-items-center">
                            <Checkbox inputId="rememberme1" binary className="mr-2"  />
                            <label htmlFor="rememberme1">Lembre-me</label>
                        </div>
                        <button className="p-link font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Esqueceu sua senha?</button>
                    </div>

                    <Button onClick={()=>fazerLogin()} label="Entrar" icon="pi pi-user" className="w-full" />
                </div>
            </div>
        </div>
        );
    }

export default Login;