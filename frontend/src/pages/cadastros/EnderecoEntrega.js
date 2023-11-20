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
import ColunaOpcoes from '../../components/ColunaOpcoes';
import { EnderecoEntregaService } from '../../service/cadastros/EnderecoEntregaService';
import { PessoaService } from '../../service/cadastros/PessoaService';

const EnderecoEntrega = () => {
    let novoEnderecoEntrega = {
        pessoa: null,
        cep: '',
        numero: '',
        endereco: '',
        complemento: '',
        bairro: '',
    };

    const [enderecos, setEnderecos] = useState(null);
    const [pessoas, setPessoas] = useState(null);
    const [enderecoDialog, setEnderecoDialog] = useState(false);
    const [deleteEnderecoDialog, setDeleteEnderecoDialog] = useState(false);
    const [endereco, setEndereco] = useState(novoEnderecoEntrega);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const enderecoEntregaService = new EnderecoEntregaService();
    const pessoaService = new PessoaService();

    // método para preencher a tabela
    useEffect(() => {
        pessoaService.listarTodos().then(res => {
            setPessoas(res.data)

        });

        if(enderecos == null){
            enderecoEntregaService.listarTodos().then(res => {
                setEnderecos(res.data);
            });
        }
    }, [enderecos]);

    const openNew = () => {
        setEndereco(novoEnderecoEntrega);
        setSubmitted(false);
        setEnderecoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setEnderecoDialog(false);
    }

    const hideDeleteEnderecoDialog = () => {
        setDeleteEnderecoDialog(false);
    }

    const saveEndereco = () => {
        setSubmitted(true);

        if (endereco.cep.trim()) {
            let _endereco = { ...endereco };
            if (endereco.id) {
                enderecoEntregaService.alterar(_endereco).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Endereço de entrega atualizada com sucesso.', life: 3000 });
                    setEnderecos(null);
                });
            }
            else {
                enderecoEntregaService.inserir(_endereco).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Endereço de entrega salva com sucesso.', life: 3000 });
                    setEnderecos(null);
                });
            }

            setEnderecoDialog(false);
            setEndereco(novoEnderecoEntrega);
        }
    }

    const editObjeto = (endereco) => {
        setEndereco({ ...endereco });
        setEnderecoDialog(true);
    }

    const confirmDeleteObjeto = (endereco) => {
        setEndereco(endereco);
        setDeleteEnderecoDialog(true);
    }

    const deleteEndereco = () => {
        enderecoEntregaService.excluir(endereco.id).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Endereço de entrega excluido com sucesso', life: 3000 });
            setEnderecos(null);
            setDeleteEnderecoDialog(false);
        });
       
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _endereco = { ...endereco };
        _endereco[`${name}`] = val;

        setEndereco(_endereco);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo Endereço" icon="pi pi-plus" className="mr-2" style={{backgroundColor:'#ff008d'}} onClick={openNew} />
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

    const cepBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cep</span>
                {rowData.cep}
            </>
        );
    }

    const enderecoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Endereço</span>
                {rowData.endereco}
            </>
        );
    }

    const numeroBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Número</span>
                {rowData.numero}
            </>
        );
    }

    const bairroBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Bairro</span>
                {rowData.bairro}
            </>
        );
    }

    const pessoaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Pessoa</span>
                {rowData.pessoa && (rowData.pessoa.nome)}
            </>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0" style={{color: '#ff008d'}}>Endereços de Entrega Cadastrados</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisar" />
            </span>
        </div>
    );

    const enderecoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveEndereco} />
        </>
    );
    const deleteEnderecoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-danger" onClick={hideDeleteEnderecoDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-success" onClick={deleteEndereco} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={enderecos}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords}"
                        globalFilter={globalFilter} emptyMessage="Não há dados cadastrados." header={header} responsiveLayout="scroll">
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="pessoa" header="Destinatário(a)" sortable body={pessoaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="cep" header="CEP" sortable body={cepBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="endereco" header="Endereço" sortable body={enderecoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="numero" header="Número" sortable body={numeroBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="bairro" header="Bairro" sortable body={bairroBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={rowData => {return <ColunaOpcoes rowData={rowData} editObjeto={editObjeto} confirmDeleteObjeto={confirmDeleteObjeto}/>}}></Column>                    
                    </DataTable>

                    <Dialog visible={enderecoDialog} style={{ width: '450px' }} header="Cadastrar/Editar Endereço de Entrega" modal className="p-fluid" footer={enderecoDialogFooter} onHide={hideDialog}>
                        <div>
                            <span>(*)Campos obrigatórios</span>
                        </div>
                            <br></br>
                        <div className="field">
                            <label htmlFor="pessoa">Destinatário*</label>
                            <Dropdown id="pessoa" name="pessoa" value={endereco.pessoa} onChange={(e) => onInputChange(e, 'pessoa')} options={pessoas} optionLabel="nome" 
        placeholder="Selecione uma pessoa" required autoFocus className={classNames({ 'p-invalid': submitted && !endereco.pessoa })} filter/>
                            {submitted && !endereco.pessoa && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="cep">CEP*</label>
                            <InputText id="cep" value={endereco.cep} onChange={(e) => onInputChange(e, 'cep')} required autoFocus className={classNames({ 'p-invalid': submitted && !endereco.cep })} />
                            {submitted && !endereco.cep && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="numero">Número*</label>
                            <InputText id="numero" value={endereco.numero} onChange={(e) => onInputChange(e, 'numero')} required autoFocus className={classNames({ 'p-invalid': submitted && !endereco.numero })} />
                            {submitted && !endereco.numero && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="endereco">Endereço*</label>
                            <InputText id="endereco" value={endereco.endereco} onChange={(e) => onInputChange(e, 'endereco')} required autoFocus className={classNames({ 'p-invalid': submitted && !endereco.endereco })} />
                            {submitted && !endereco.endereco && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="complemento">Complemento</label>
                            <InputText id="complemento" value={endereco.complemento} onChange={(e) => onInputChange(e, 'complemento')} autoFocus />
                        </div>
                        <div className="field">
                            <label htmlFor="bairro">Bairro*</label>
                            <InputText id="bairro" value={endereco.bairro} onChange={(e) => onInputChange(e, 'bairro')} required autoFocus className={classNames({ 'p-invalid': submitted && !endereco.bairro })} />
                            {submitted && !endereco.bairro && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>
                      
                    </Dialog>

                    <Dialog visible={deleteEnderecoDialog} style={{ width: '450px' }} header="Excluir endereco" modal footer={deleteEnderecoDialogFooter} onHide={hideDeleteEnderecoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {endereco && <span>Tem certeza que deseja excluir a endereço de entrega <b>{endereco.cep}</b>?</span>}
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

export default React.memo(EnderecoEntrega, comparisonFn);