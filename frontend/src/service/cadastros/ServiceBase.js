import axios from 'axios';
import { config } from 'react-transition-group';
import { LoginService } from '../util/LoginService';

export class ServiceBase {

    constructor(urlBase){
        this.url = urlBase + '/';
        this.inicializarAxios();
    }

    inicializarAxios() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_URL_API,
        });

        this.axiosInstance.interceptors.request.use((config) => {
            const token = new LoginService().getToken();
            const authRequestToken = token ? `Bearer ${token}` : '';
            config.headers.common['Authorization'] = authRequestToken;
            return config;
        },
            (error) => Promise.reject(error)
        );
    }

    listarTodos(){
        return this.axiosInstance.get(this.url);
    }

    buscarId(id){
        return this.axiosInstance.get(this.url+id);
    }

    inserir(cidade){
        return this.axiosInstance.post(this.url, cidade);
    }

    alterar(cidade){
        return this.axiosInstance.put(this.url, cidade);
    }

    excluir(id){
        return this.axiosInstance.delete(this.url+id);
    }
}