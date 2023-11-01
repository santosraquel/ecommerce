import axios from 'axios';

export class ServiceBase {

    constructor(urlBase){
        this.url = process.env.REACT_APP_URL_API+'/'+urlBase+'/';
    }

    listarTodos(){
        return axios.get(this.url);
    }

    buscarId(id){
        return axios.get(this.url+id);
    }

    inserir(cidade){
        return axios.post(this.url, cidade);
    }

    alterar(cidade){
        return axios.put(this.url, cidade);
    }

    excluir(id){
        return axios.delete(this.url+id);
    }
}