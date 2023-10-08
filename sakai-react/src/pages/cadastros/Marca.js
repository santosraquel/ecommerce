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
import { MarcaService } from '../../service/cadastros/MarcaService';

const Marca = () => {
    let novaMarca = {
        name: '',
    };

    const [marcas, setMarcas] = useState(null);
    const [marcaDialog, setMarcaDialog] = useState(false);
    const [deleteMarcaDialog, setDeleteMarcaDialog] = useState(false);
    const [marca, setMarca] = useState(novaMarca);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const marcaService = new MarcaService();

    // método para preencher a tabela
    useEffect(() => {
        if(marcas == null){
            marcaService.listarTodos().then(res => {
                setMarcas(res.data);
            });
        }
    }, [marcas]);

    const openNew = () => {
        setMarca(novaMarca);
        setSubmitted(false);
        setMarcaDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setMarcaDialog(false);
    }

    const hideDeleteMarcaDialog = () => {
        setDeleteMarcaDialog(false);
    }

    const saveMarca = () => {
        setSubmitted(true);

        if (marca.nome.trim()) {
            let _marca = { ...marca };
            if (marca.id) {
                marcaService.alterar(_marca).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Marca atualizada com sucesso.', life: 3000 });
                    setMarcas(null);
                });
            }
            else {
                marcaService.inserir(_marca).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Marca salva com sucesso.', life: 3000 });
                    setMarcas(null);
                });
            }

            setMarcaDialog(false);
            setMarca(novaMarca);
        }
    }

    const editMarca = (marca) => {
        setMarca({ ...marca });
        setMarcaDialog(true);
    }

    const confirmDeleteMarca = (marca) => {
        setMarca(marca);
        setDeleteMarcaDialog(true);
    }

    const deleteMarca = () => {
        marcaService.excluir(marca.id).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Marca excluida com sucesso', life: 3000 });
            setMarcas(null);
            setDeleteMarcaDialog(false);
        });
       
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _marca = { ...marca };
        _marca[`${name}`] = val;

        setMarca(_marca);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova Marca" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-primary mr-2" onClick={() => editMarca(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteMarca(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Marcas Cadastradas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const marcaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveMarca} />
        </>
    );
    const deleteMarcaDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-danger" onClick={hideDeleteMarcaDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-success" onClick={deleteMarca} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={marcas}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} marcas"
                        globalFilter={globalFilter} emptyMessage="No marcas found." header={header} responsiveLayout="scroll">
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column header="Ações" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={marcaDialog} style={{ width: '450px' }} header="Cadastrar/Editar Marca" modal className="p-fluid" footer={marcaDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={marca.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !marca.nome })} />
                            {submitted && !marca.nome && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>
                      
                    </Dialog>

                    <Dialog visible={deleteMarcaDialog} style={{ width: '450px' }} header="Excluir Marca" modal footer={deleteMarcaDialogFooter} onHide={hideDeleteMarcaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {marca && <span>Tem certeza que deseja excluir a marca <b>{marca.nome}</b>?</span>}
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

export default React.memo(Marca, comparisonFn);