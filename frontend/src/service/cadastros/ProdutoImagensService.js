import axios from 'axios';
import { ServiceBase } from './ServiceBase';

export class ProdutoImagensService extends ServiceBase {

    constructor(){
        super("produtoImagens");
    }

    uploadImagens(obj){
        const formData = new FormData();
        formData.append('idProduto', obj.idProduto);
        formData.append('file', obj.file);
        const config ={
            headers :{
                'content-type':'multipart/form-data'
            }
        }
        return axios.post(this.url, formData, config);
    }
}