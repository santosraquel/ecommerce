import axios from 'axios';

export class EstadoService {

    getEstadosSmall() {
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
    }

    getEstados() {
        return axios.get('assets/demo/data/products.json').then(res => res.data.data);
    }

    getEstadosWithOrdersSmall() {
        return axios.get('assets/demo/data/products-orders-small.json').then(res => res.data.data);
    }
}