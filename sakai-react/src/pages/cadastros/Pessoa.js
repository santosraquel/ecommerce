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
import { MultiSelect } from 'primereact/multiselect';
import { InputMask } from 'primereact/inputmask';
import axios from 'axios';
import { PessoaService } from '../../service/cadastros/PessoaService';
import { CidadeService } from '../../service/cadastros/CidadeService';
import { PermissaoService } from '../../service/cadastros/PermissaoService';

const Pessoa = () => {
    let novaPessoa = {
        nome: '',
        cidade: null,
        cpf: '',
        email: '',
        endereco: '',
        cep: '',
        permissaoPessoas: ''
    };

    const [pessoas, setPessoas] = useState(null);
    const [cidades, setCidades] = useState(null);
    const [permissoes, setPermissoes] = useState(null);
    const [pessoaDialog, setPessoaDialog] = useState(false);
    const [deletePessoaDialog, setDeletePessoaDialog] = useState(false);
    const [pessoa, setPessoa] = useState(novaPessoa);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const pessoaService = new PessoaService();
    const cidadeService = new CidadeService();
    const permissaoService = new PermissaoService();

    useEffect(() => {
            cidadeService.listarTodos().then(res => {
                setCidades(res.data);
            });

            permissaoService.listarTodos().then(res => {
                setPermissoes(res.data);
            });
    }, []);

    // método para preencher a tabela
    useEffect(() => {
        if(pessoas == null){
            pessoaService.listarTodos().then(res => {
                setPessoas(res.data);
            });
        }
    }, [pessoas]);

    const openNew = () => {
        setPessoa(novaPessoa);
        setSubmitted(false);
        setPessoaDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setPessoaDialog(false);
    }

    const hideDeletePessoaDialog = () => {
        setDeletePessoaDialog(false);
    }

    const savePessoa = () => {
        setSubmitted(true);

        if (pessoa.nome.trim()) {
            let _pessoa = { ...pessoa };
            if (pessoa.id) {
                pessoaService.alterar(_pessoa).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Pessoa atualizada com sucesso.', life: 3000 });
                    setPessoas(null);
                });
            }
            else {
                pessoaService.inserir(_pessoa).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Pessoa salva com sucesso.', life: 3000 });
                    setPessoas(null);
                });
            }

            setPessoaDialog(false);
            setPessoa(novaPessoa);
        }
    }

    const editPessoa = (pessoa) => {
        setPessoa({ ...pessoa });
        setPessoaDialog(true);
    }

    const confirmDeletePessoa = (pessoa) => {
        setPessoa(pessoa);
        setDeletePessoaDialog(true);
    }

    const deletePessoa = () => {
        pessoaService.excluir(pessoa.id).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Pessoa excluida com sucesso', life: 3000 });
            setPessoas(null);
            setDeletePessoaDialog(false);
        });
       
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _pessoa = { ...pessoa };
        _pessoa[`${name}`] = val;

        setPessoa(_pessoa);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova Pessoa" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">E-mail</span>
                {rowData.email}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-primary mr-2" onClick={() => editPessoa(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeletePessoa(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Pessoas Cadastradas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const pessoaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={savePessoa} />
        </>
    );
    const deletePessoaDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-danger" onClick={hideDeletePessoaDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-success" onClick={deletePessoa} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={pessoas}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} pessoas"
                        globalFilter={globalFilter} emptyMessage="No pessoas found." header={header} responsiveLayout="scroll">
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="email" header="E-mail" sortable body={emailBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column header="Ações" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={pessoaDialog} style={{ width: '450px' }} header="Cadastrar/Editar Pessoa" modal className="p-fluid" footer={pessoaDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={pessoa.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !pessoa.nome })} />
                            {submitted && !pessoa.nome && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="cpf">CPF</label>
                            <InputMask mask="999.999.999-99" id="cpf" value={pessoa.cpf} onChange={(e) => onInputChange(e, 'cpf')} required autoFocus className={classNames({ 'p-invalid': submitted && !pessoa.cpf })} />
                            {submitted && !pessoa.cpf && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <InputText id="email" value={pessoa.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !pessoa.email })} />
                            {submitted && !pessoa.email && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="cidade">Cidade</label>
                            <Dropdown value={pessoa.cidade} onChange={(e) => onInputChange(e, 'cidade')} options={cidades} optionLabel="nome" 
    placeholder="Selecione uma Cidade" filter/>
                        </div>

                        <div className="field">
                            <label htmlFor="cep">CEP</label>
                            <InputMask mask="99999-999" value={pessoa.cep} onChange={(e) => onInputChange(e, 'cep')} required autoFocus className={classNames({ 'p-invalid': submitted && !pessoa.cep })} />
                            {submitted && !pessoa.cep && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="endereco">Endereço</label>
                            <InputText id="endereco" value={pessoa.endereco} onChange={(e) => onInputChange(e, 'endereco')} required autoFocus className={classNames({ 'p-invalid': submitted && !pessoa.endereco })} />
                            {submitted && !pessoa.endereco && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="permissaoPessoas">Permissões</label>
                            <MultiSelect value={pessoa.permissaoPessoas} onChange={(e) => onInputChange(e, 'permissaoPessoas')} options={permissoes} optionLabel="nome" display="chip"
    placeholder="Selecione as permissões"/>
                        </div>
                      
                    </Dialog>

                    <Dialog visible={deletePessoaDialog} style={{ width: '450px' }} header="Excluir Pessoa" modal footer={deletePessoaDialogFooter} onHide={hideDeletePessoaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {pessoa && <span>Tem certeza que deseja excluir a pessoa <b>{pessoa.nome}</b>?</span>}
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

export default React.memo(Pessoa, comparisonFn);