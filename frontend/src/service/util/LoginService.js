import axios from 'axios';
import { ServiceBase } from '../cadastros/ServiceBase';

export class LoginService extends ServiceBase {

    constructor(){
        super("pessoa-gerenciamento");
    }

    login(email, senha, mensagemErro){
        axios.post(this.url+"login",{'email':email, 'senha':senha}).then(res=>{
        console.log(res);
        });
    }


}