import axios from 'axios';

export class EstadoService {

    url = process.env.REACT_APP_URL_API;

    estados(){
        return axios.get(this.url+'/estado/');
    }

    inserir(estado){
        return axios.post(this.url+'/estado/', estado);
    }

    alterar(estado){
        return axios.put(this.url+'/estado/', estado);
    }

    excluir(id){
        return axios.delete(this.url+'/estado/'+id);
    }
}