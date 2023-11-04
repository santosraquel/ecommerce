import React, { useState, useEffect, useRef } from 'react';
import '../../assets/layout/ProdutoImagens.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useParams } from 'react-router-dom';
import { FileUpload } from 'primereact/fileupload';
import { DataView } from 'primereact/dataview';
import { ProdutoService } from '../../service/cadastros/ProdutoService';
import { ProdutoImagensService } from '../../service/cadastros/ProdutoImagensService';

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
    const [produto, setProduto] = useState({});
    const toast = useRef(null);
    const dt = useRef(null);
    const produtoService = new ProdutoService();
    const produtoImagensService = new ProdutoImagensService();

    useEffect(() => {
        if(imagens == null){
            produtoService.buscarId(parametros.id).then(result => {
                setProduto(result.data);
                buscarPorProduto(result.data.id);
            });
        }
    }, [imagens]);

    const buscarPorProduto = (idProduto) => {
        produtoImagensService.buscarPorProduto(idProduto).then(result => {
            setImagens(result.data);
        })
    }

    const hideDeleteImagemDialog = () => {
        setImagemDeleteDialog(false);
    }

    const confirmDeleteImagem = (imagem) => {
        setImagem(imagem);
        setImagemDeleteDialog(true);
    }

    const deleteImagem = () => {
        produtoImagensService.excluir(imagem.id).then(data => {
             toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Imagem excluida com sucesso', life: 3000 });
             setImagens(null);
             setImagemDeleteDialog(false);    
         }); 
    }

    const uploadImagens = (event) => {
        produtoImagensService.uploadImagens({ file: event.files[0], idProduto: produto.id }).then(data => {
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Imagem inserida', life: 3000 });
            setImagens(null);
        });
        event.options.clear();
    }

    const renderGridItem = (data) => {
        return (
            <div className="col-12 md:col-4">
                <div className="product-grid-item card">
                    <div className="product-grid-item-content">
                        <img src={'data:image;base64, '+data.arquivo} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
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
                    <FileUpload customUpload auto uploadHandler={uploadImagens} chooseLabel="Adicionar Imagem" mode="basic" accept="image/*" maxFileSize={1000000} />
                </div>
                <div className="col-6" style={{ textAlign: 'right' }}>
                    <h4>{produto.descricaoCurta}</h4>
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