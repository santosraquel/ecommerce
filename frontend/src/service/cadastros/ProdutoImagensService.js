import axios from 'axios';
import { ServiceBase } from './ServiceBase';

export class ProdutoImagensService extends ServiceBase {

    constructor(){
        super("produtoImagens");
    }
}