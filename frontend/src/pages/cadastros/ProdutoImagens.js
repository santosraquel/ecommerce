import React, { useState, useEffect, useRef } from 'react';
import '../../assets/layout/ProdutoImagens.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useParams } from 'react-router-dom';
import { Image } from 'primereact/image';
import { FileUpload } from 'primereact/fileupload';
import { DataView } from 'primereact/dataview';

const ProdutoImagens = () => {
    let novaImagem = {
        file: null,
        idProduto: null,
        nome: null
    };

    let parametros = useParams();
    const [imagens, setImagens] = useState(null);
    const [ImagemDeleteDialog, setImagemDeleteDialog] = useState(false);
    const [imagem, setImagem] = useState(novaImagem);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        console.log(parametros);
        setImagens([{}]);
        //setObjetos([{},{}])
    }, []);

    const hideDeleteImagemDialog = () => {
        setImagemDeleteDialog(false);
    }

    const confirmDeleteImagem = (imagem) => {
        setImagem(imagem);
        setImagemDeleteDialog(true);
    }

    const deleteImagem = () => {

        // produtoImagensService.excluir(imagem.id).then(data => {
        //      toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Removido', life: 3000 });
        //      setObjetos(null);
        //      setObjetoDeleteDialog(false);    
        //  }); 
    }

    const renderGridItem = (data) => {
        return (
            <div className="col-12 md:col-4">
                <div className="product-grid-item card">
                    <div className="product-grid-item-content">
                        <img src={`images/product/${data.imagem}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                        <Button icon="pi pi-times" className="p-button-danger" label="Remover" onClick={() => confirmDeleteImagem(data)}></Button>
                    </div>
                </div>
            </div>
        );
    }

    const renderHeader = () => {
        return (
            <div className="grid grid-nogutter">
                <div className="col-6" style={{ textAlign: 'left' }}>
                    <FileUpload chooseLabel="Adicionar Imagem" mode="basic" accept="image/*" maxFileSize={1000000} />
                </div>
                <div className="col-6" style={{ textAlign: 'right' }}>
                    <h4>Descrição do Produto</h4>
                </div>

            </div>
        );
    }

    const deleteImagemDialogFooter = (
        <>
            <Button label="Não"  icon="pi pi-times" className="p-button-danger" onClick={hideDeleteImagemDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-success" onClick={deleteImagem} />
        </>
    );

    const header = renderHeader();
        
    return (
        <div className="dataview-demo">
            <Toast ref={toast} />

            <div className="card">
                <DataView value={imagens} layout={'grid'} header={header}
                    itemTemplate={renderGridItem} />
            </div>

            <Dialog visible={ImagemDeleteDialog} style={{ width: '450px' }} header="Excluir Imagem" modal footer={deleteImagemDialogFooter} onHide={hideDeleteImagemDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {imagem && <span>Tem certeza que deseja excluir esta imagem?</span>}
                </div>
            </Dialog>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ProdutoImagens, comparisonFn);