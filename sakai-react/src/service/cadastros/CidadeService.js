import axios from 'axios';

export class CidadeService {

    url = process.env.REACT_APP_URL_API;

    listarTodos(){
        return axios.get(this.url+'/cidade/');
    }

    inserir(cidade){
        return axios.post(this.url+'/cidade/', cidade);
    }

    alterar(cidade){
        return axios.put(this.url+'/cidade/', cidade);
    }

    excluir(id){
        return axios.delete(this.url+'/cidade/'+id);
    }
}