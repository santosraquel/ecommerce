import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { EstadoService } from '../service/EstadoService';
import axios from 'axios';

const Estados = () => {
    let emptyEstado = {
        id: null,
        name: '',
        sigla: '',
    };

    const [estados, setEstados] = useState(null);
    const [estadoDialog, setEstadoDialog] = useState(false);
    const [deleteEstadoDialog, setDeleteEstadoDialog] = useState(false);
    const [estado, setEstado] = useState(emptyEstado);
    const [selectedEstados, setSelectedEstados] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const estadoService = new EstadoService();
        estadoService.getEstados().then(data => setEstados(data));
    }, []);

    const openNew = () => {
        setEstado(emptyEstado);
        setSubmitted(false);
        setEstadoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setEstadoDialog(false);
    }

    const hideDeleteEstadoDialog = () => {
        setDeleteEstadoDialog(false);
    }

    const saveEstado = () => {
        setSubmitted(true);

        if (estado.name.trim()) {
            let _estados = [...estados];
            let _estado = { ...estado };
            if (estado.id) {
                const index = findIndexById(estado.id);

                _estados[index] = _estado;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Estado atualizado', life: 3000 });
            }
            else {
                _estado.id = createId();
                _estado.image = 'estado-placeholder.svg';
                // _estados.push(_estado);
                axios.post("http://localhost:8080/api/estado/", _estados).then(result =>{
                    console.log(result);
                });
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Estado salvo com sucesso.', life: 3000 });
            }

            // setEstados(_estados);
            setEstadoDialog(false);
            setEstado(emptyEstado);
        }
    }

    const editEstado = (estado) => {
        setEstado({ ...estado });
        setEstadoDialog(true);
    }

    const confirmDeleteEstado = (estado) => {
        setEstado(estado);
        setDeleteEstadoDialog(true);
    }

    const deleteEstado = () => {
        let _estados = estados.filter(val => val.id !== estado.id);
        setEstados(_estados);
        setDeleteEstadoDialog(false);
        setEstado(emptyEstado);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Estado excluido', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < estados.length; i++) {
            if (estados[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _estado = { ...estado };
        _estado[`${name}`] = val;

        setEstado(_estado);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo Estado" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        )
    }

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.code}
            </>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.name}
            </>
        );
    }

    const siglaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Sigla</span>
                {rowData.sigla}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-primary mr-2" onClick={() => editEstado(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteEstado(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Estados Cadastrados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisar" />
            </span>
        </div>
    );

    const estadoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveEstado} />
        </>
    );
    const deleteEstadoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-danger" onClick={hideDeleteEstadoDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-success" onClick={deleteEstado} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={estados} selection={selectedEstados} onSelectionChange={(e) => setSelectedEstados(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords} páginas"
                        globalFilter={globalFilter} emptyMessage="No estados found." header={header} responsiveLayout="scroll">
                        <Column field="code" header="ID" sortable body={codeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="sigla" header="Sigla" sortable body={siglaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column header="Ações" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={estadoDialog} style={{ width: '450px' }} header="Novo Estado" modal className="p-fluid" footer={estadoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nome</label>
                            <InputText id="name" value={estado.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !estado.name })} />
                            {submitted && !estado.name && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="sigla">Sigla</label>
                            <InputText id="sigla" value={estado.sigla} onChange={(e) => onInputChange(e, 'sigla')} required autoFocus className={classNames({ 'p-invalid': submitted && !estado.sigla })} />
                            {submitted && !estado.sigla && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>
                      
                    </Dialog>

                    <Dialog visible={deleteEstadoDialog} style={{ width: '450px' }} header="Excluir Estado" modal footer={deleteEstadoDialogFooter} onHide={hideDeleteEstadoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {estado && <span>Tem certeza que deseja excluir o Estado <b>{estado.name}</b>?</span>}
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

export default React.memo(Estados, comparisonFn);