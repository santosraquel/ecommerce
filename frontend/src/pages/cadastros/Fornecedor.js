import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { FornecedorService } from '../../service/cadastros/FornecedorService';
import ColunaOpcoes from '../../components/ColunaOpcoes';

const Fornecedor = () => {
    let novoFornecedor = {
        name: '',
    };

    const [fornecedores, setFornecedores] = useState(null);
    const [fornecedorDialog, setFornecedorDialog] = useState(false);
    const [deleteFornecedorDialog, setDeleteFornecedorDialog] = useState(false);
    const [fornecedor, setFornecedor] = useState(novoFornecedor);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const fornecedorService = new FornecedorService();

    // método para preencher a tabela
    useEffect(() => {
        if(fornecedores == null){
            fornecedorService.listarTodos().then(res => {
                setFornecedores(res.data);
            });
        }
    }, [fornecedores]);

    const openNew = () => {
        setFornecedor(novoFornecedor);
        setSubmitted(false);
        setFornecedorDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setFornecedorDialog(false);
    }

    const hideDeleteFornecedorDialog = () => {
        setDeleteFornecedorDialog(false);
    }

    const saveFornecedor = () => {
        setSubmitted(true);

        if (fornecedor.nome.trim()) {
            let _fornecedor = { ...fornecedor };
            if (fornecedor.id) {
                fornecedorService.alterar(_fornecedor).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Fornecedor atualizado com sucesso.', life: 3000 });
                    setFornecedores(null);
                });
            }
            else {
                fornecedorService.inserir(_fornecedor).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Fornecedor salvo com sucesso.', life: 3000 });
                    setFornecedores(null);
                });
            }

            setFornecedorDialog(false);
            setFornecedor(novoFornecedor);
        }
    }

    const editObjeto = (fornecedor) => {
        setFornecedor({ ...fornecedor });
        setFornecedorDialog(true);
    }

    const confirmDeleteObjeto = (fornecedor) => {
        setFornecedor(fornecedor);
        setDeleteFornecedorDialog(true);
    }

    const deleteFornecedor = () => {
        fornecedorService.excluir(fornecedor.id).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Fornecedor excluido com sucesso', life: 3000 });
            setFornecedores(null);
            setDeleteFornecedorDialog(false);
        });
       
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _fornecedor = { ...fornecedor };
        _fornecedor[`${name}`] = val;

        setFornecedor(_fornecedor);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo Fornecedor" icon="pi pi-plus" className="mr-2" onClick={openNew} style={{backgroundColor:'#ff008d'}}/>
                </div>
            </React.Fragment>
        )
    }

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    }

    const nomeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0" style={{color: '#ff008d'}}>Fornecedores Cadastrados</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisar" />
            </span>
        </div>
    );

    const fornecedorDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveFornecedor} />
        </>
    );
    const deleteFornecedorDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-danger" onClick={hideDeleteFornecedorDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-success" onClick={deleteFornecedor} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={fornecedores}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords}"
                        globalFilter={globalFilter} emptyMessage="Não há dados cadastrados." header={header} responsiveLayout="scroll">
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={rowData => {return <ColunaOpcoes rowData={rowData} editObjeto={editObjeto} confirmDeleteObjeto={confirmDeleteObjeto}/>}}></Column>                    
                    </DataTable>

                    <Dialog visible={fornecedorDialog} style={{ width: '450px' }} header="Cadastrar/Editar Fornecedor" modal className="p-fluid" footer={fornecedorDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={fornecedor.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !fornecedor.nome })} />
                            {submitted && !fornecedor.nome && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>
                      
                    </Dialog>

                    <Dialog visible={deleteFornecedorDialog} style={{ width: '450px' }} header="Excluir fornecedor" modal footer={deleteFornecedorDialogFooter} onHide={hideDeleteFornecedorDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {fornecedor && <span>Tem certeza que deseja excluir o fornecedor <b>{fornecedor.nome}</b>?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Fornecedor, comparisonFn);