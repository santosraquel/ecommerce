import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { CidadeService } from '../../service/cadastros/CidadeService';
import {EstadoService} from '../../service/cadastros/EstadoService';
import ColunaOpcoes from '../../components/ColunaOpcoes';

const Cidade = () => {
    let novaCidade = {
        name: '',
        estado: '',
    };

    const [cidades, setCidades] = useState(null);
    const [estados, setEstados] = useState(null);
    const [cidadeDialog, setCidadeDialog] = useState(false);
    const [deleteCidadeDialog, setDeleteCidadeDialog] = useState(false);
    const [cidade, setCidade] = useState(novaCidade);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const cidadeService = new CidadeService();
    const estadoService = new EstadoService();

    useEffect(() => {
            estadoService.listarTodos().then(res => {
                setEstados(res.data);
            });
    }, []);

    // método para preencher a tabela
    useEffect(() => {
        if(cidades == null){
            cidadeService.listarTodos().then(res => {
                setCidades(res.data);
            });
        }
    }, [cidades]);

    const openNew = () => {
        setCidade(novaCidade);
        setSubmitted(false);
        setCidadeDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCidadeDialog(false);
    }

    const hideDeleteCidadeDialog = () => {
        setDeleteCidadeDialog(false);
    }

    const saveCidade = () => {
        setSubmitted(true);

        if (cidade.nome.trim()) {
            let _cidade = { ...cidade };
            if (cidade.id) {
                cidadeService.alterar(_cidade).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Cidade atualizada com sucesso.', life: 3000 });
                    setCidades(null);
                });
            }
            else {
                cidadeService.inserir(_cidade).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Cidade salva com sucesso.', life: 3000 });
                    setCidades(null);
                });
            }

            setCidadeDialog(false);
            setCidade(novaCidade);
        }
    }

    const editObjeto = (cidade) => {
        setCidade({ ...cidade });
        setCidadeDialog(true);
    }

    const confirmDeleteObjeto = (cidade) => {
        setCidade(cidade);
        setDeleteCidadeDialog(true);
    }

    const deleteCidade = () => {
        cidadeService.excluir(cidade.id).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Cidade excluida com sucesso', life: 3000 });
            setCidades(null);
            setDeleteCidadeDialog(false);
        });
       
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _cidade = { ...cidade };
        _cidade[`${name}`] = val;

        setCidade(_cidade);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova Cidade" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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

    const estadoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                {rowData.estado && (rowData.estado.nome+'/'+rowData.estado.sigla)}
            </>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Cidades Cadastradas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const cidadeDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveCidade} />
        </>
    );
    const deleteCidadeDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-danger" onClick={hideDeleteCidadeDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-success" onClick={deleteCidade} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={cidades}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} cidades"
                        globalFilter={globalFilter} emptyMessage="No cidades found." header={header} responsiveLayout="scroll">
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="estado" header="Estado" sortable body={estadoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={rowData => {return <ColunaOpcoes rowData={rowData} editObjeto={editObjeto} confirmDeleteObjeto={confirmDeleteObjeto}/>}}></Column>                    
                    </DataTable>

                    <Dialog visible={cidadeDialog} style={{ width: '450px' }} header="Cadastrar/Editar Cidade" modal className="p-fluid" footer={cidadeDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={cidade.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !cidade.nome })} />
                            {submitted && !cidade.nome && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="estado">Estado</label>
                            <Dropdown value={cidade.estado} onChange={(e) => onInputChange(e, 'estado')} options={estados} optionLabel="nome" 
    placeholder="Selecione um Estado" filter/>
                        </div>
                      
                    </Dialog>

                    <Dialog visible={deleteCidadeDialog} style={{ width: '450px' }} header="Excluir Cidade" modal footer={deleteCidadeDialogFooter} onHide={hideDeleteCidadeDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {cidade && <span>Tem certeza que deseja excluir a cidade <b>{cidade.nome}</b>?</span>}
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

export default React.memo(Cidade, comparisonFn);