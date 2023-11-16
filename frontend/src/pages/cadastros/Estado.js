import React, { useState, useEffect, useRef } from 'react';
import '../../assets/layout/TitleDialog.css';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { EstadoService } from '../../service/cadastros/EstadoService';
import ColunaOpcoes from '../../components/ColunaOpcoes';


const Estado = () => {
    let novoEstado = {
        name: '',
        sigla: '',
    };

    const [estados, setEstados] = useState(null);
    const [estadoDialog, setEstadoDialog] = useState(false);
    const [deleteEstadoDialog, setDeleteEstadoDialog] = useState(false);
    const [estado, setEstado] = useState(novoEstado);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const estadoService = new EstadoService();

    // método para preencher a tabela
    useEffect(() => {
        if(estados == null){
            estadoService.listarTodos().then(res => {
                setEstados(res.data);
            });
        }
    }, [estados]);

    const openNew = () => {
        setEstado(novoEstado);
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

        if (estado.nome.trim()) {
            let _estado = { ...estado };
            if (estado.id) {
                estadoService.alterar(_estado).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Estado atualizado com sucesso.', life: 3000 });
                    setEstados(null);
                });
            }
            else {
                estadoService.inserir(_estado).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Estado salvo com sucesso.', life: 3000 });
                    setEstados(null);
                });
            }

            setEstadoDialog(false);
            setEstado(novoEstado);
        }
    }

    const editObjeto = (estado) => {
        setEstado({ ...estado });
        setEstadoDialog(true);
    }

    const confirmDeleteObjeto = (estado) => {
        setEstado(estado);
        setDeleteEstadoDialog(true);
    }

    const deleteEstado = () => {
        estadoService.excluir(estado.id).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Estado excluido com sucesso', life: 3000 });
            setEstados(null);
            setDeleteEstadoDialog(false);
        });
       
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
                    <Button label="Novo Estado" icon="pi pi-plus" className="mr-2" onClick={openNew} style={{backgroundColor:'#ff008d'}}/>
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

    const siglaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Sigla</span>
                {rowData.sigla}
            </>
        );
    }


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0" style={{color: '#ff008d'}}>Estados Cadastrados</h4>
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

                    <DataTable ref={dt} value={estados}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords}"
                        globalFilter={globalFilter} emptyMessage="Não há dados cadastrados." header={header} responsiveLayout="scroll">
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="sigla" header="Sigla" sortable body={siglaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={rowData => {return <ColunaOpcoes rowData={rowData} editObjeto={editObjeto} confirmDeleteObjeto={confirmDeleteObjeto}/>}}></Column>                    
                    </DataTable>

                    <Dialog visible={estadoDialog} style={{ width: '450px' }} header="Cadastrar/Editar Estado" modal className="p-fluid title-dialog" footer={estadoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={estado.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !estado.nome })} />
                            {submitted && !estado.nome && <small className="p-invalid">Campo obrigatório.</small>}
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
                            {estado && <span>Tem certeza que deseja excluir o Estado <b>{estado.nome}</b>?</span>}
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

export default React.memo(Estado, comparisonFn);