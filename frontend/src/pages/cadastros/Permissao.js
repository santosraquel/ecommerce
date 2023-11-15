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
import { PermissaoService } from '../../service/cadastros/PermissaoService';
import ColunaOpcoes from '../../components/ColunaOpcoes';

const Permissao = () => {
    let novaPermissao = {
        name: '',
    };

    const [permissoes, setPermissoes] = useState(null);
    const [permissaoDialog, setPermissaoDialog] = useState(false);
    const [deletePermissaoDialog, setDeletePermissaoDialog] = useState(false);
    const [permissao, setPermissao] = useState(novaPermissao);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const permissaoService = new PermissaoService();

    // método para preencher a tabela
    useEffect(() => {
        if(permissoes == null){
            permissaoService.listarTodos().then(res => {
                setPermissoes(res.data);
            });
        }
    }, [permissoes]);

    const openNew = () => {
        setPermissao(novaPermissao);
        setSubmitted(false);
        setPermissaoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setPermissaoDialog(false);
    }

    const hideDeletePermissaoDialog = () => {
        setDeletePermissaoDialog(false);
    }

    const savePermissao = () => {
        setSubmitted(true);

        if (permissao.nome.trim()) {
            let _permissao = { ...permissao };
            if (permissao.id) {
                permissaoService.alterar(_permissao).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Permissãao atualizada com sucesso.', life: 3000 });
                    setPermissoes(null);
                });
            }
            else {
                permissaoService.inserir(_permissao).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Permissão salva com sucesso.', life: 3000 });
                    setPermissoes(null);
                });
            }

            setPermissaoDialog(false);
            setPermissao(novaPermissao);
        }
    }

    const editObjeto = (permissao) => {
        setPermissao({ ...permissao });
        setPermissaoDialog(true);
    }

    const confirmDeleteObjeto = (permissao) => {
        setPermissao(permissao);
        setDeletePermissaoDialog(true);
    }

    const deletePermissao = () => {
        permissaoService.excluir(permissao.id).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Permissão excluida com sucesso', life: 3000 });
            setPermissoes(null);
            setDeletePermissaoDialog(false);
        });
       
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _permissao = { ...permissao };
        _permissao[`${name}`] = val;

        setPermissao(_permissao);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova Permissão" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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
            <h5 className="m-0">Permissões Cadastradas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const permissaoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={savePermissao} />
        </>
    );
    const deletePermissaoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-danger" onClick={hideDeletePermissaoDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-success" onClick={deletePermissao} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={permissoes}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} permissões"
                        globalFilter={globalFilter} emptyMessage="No permissões found." header={header} responsiveLayout="scroll">
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={rowData => {return <ColunaOpcoes rowData={rowData} editObjeto={editObjeto} confirmDeleteObjeto={confirmDeleteObjeto}/>}}></Column>                    
                    </DataTable>

                    <Dialog visible={permissaoDialog} style={{ width: '450px' }} header="Cadastrar/Editar Permissão" modal className="p-fluid" footer={permissaoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={permissao.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !permissao.nome })} />
                            {submitted && !permissao.nome && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>
                      
                    </Dialog>

                    <Dialog visible={deletePermissaoDialog} style={{ width: '450px' }} header="Excluir Permissão" modal footer={deletePermissaoDialogFooter} onHide={hideDeletePermissaoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissao && <span>Tem certeza que deseja excluir a permissão <b>{permissao.nome}</b>?</span>}
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

export default React.memo(Permissao, comparisonFn);