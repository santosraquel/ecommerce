import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useFormik } from 'formik';
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
import ColunaOpcoes from '../../components/ColunaOpcoes';

const Pessoa = () => {
    let novaPessoa = {
        nome: '',
        cidade: null,
        cpf: '',
        email: '',
        endereco: '',
        cep: '',
        permissaoPessoas: []
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

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: pessoa,
        validate: (data) => {
            let errors = {};

            if (!data.nome) {
                errors.nome = 'Nome é obrigatório';
            }

            if (!data.email) {
                errors.email = 'Email é obrigatório';
            }
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
                errors.email = 'E-mail é inválido. Exemplo: jose@gmail.com';
            }

            return errors;
        },
        onSubmit: (data) => {
            setPessoa(data);
            savePessoa();
            formik.resetForm();
        }
    });


    useEffect(() => {
        cidadeService.listarTodos().then(res => {
            setCidades(res.data)

        });

        permissaoService.listarTodos().then(res => {
            let permissoesTemporarias = [];
            res.data.forEach(element => {
                permissoesTemporarias.push({ permissao: element });
            });
            setPermissoes(permissoesTemporarias);
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
            let _pessoa = formik.values;
            if (pessoa.id) {
                pessoaService.alterar(_pessoa).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Pessoa alterada com Sucesso', life: 3000 });
                    setPessoas(null);
                });
            }
            else {
                pessoaService.inserir(_pessoa).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Pessoa salva com Sucesso', life: 3000 });
                    setPessoas(null);
                });

            }
            setPessoaDialog(false);
            setPessoa(novaPessoa);
        }
    }

    const editObjeto = (pessoa) => {
        setPessoa({ ...pessoa });
        setPessoaDialog(true);
    }

    const confirmDeleteObjeto = (pessoa) => {
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

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova Pessoa" icon="pi pi-plus" className="mr-2" style={{backgroundColor:'#ff008d'}} onClick={openNew} />
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

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0" style={{color: '#ff008d'}}>Pessoas Cadastradas</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisar" />
            </span>
        </div>
    );

    const pessoaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button type="submit" form="formularioPessoa" label="Salvar" icon="pi pi-check" className="p-button-success" />
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
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords}"
                        globalFilter={globalFilter} emptyMessage="Não há dados cadastrados." header={header} responsiveLayout="scroll">
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="email" header="E-mail" sortable body={emailBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={rowData => {return <ColunaOpcoes rowData={rowData} editObjeto={editObjeto} confirmDeleteObjeto={confirmDeleteObjeto}/>}}></Column>                    
                    </DataTable>

                    <Dialog visible={pessoaDialog} style={{ width: '450px' }} header="Cadastrar/Editar Pessoa" modal className="p-fluid" footer={pessoaDialogFooter} onHide={hideDialog}>
                        <form id="formularioPessoa" onSubmit={formik.handleSubmit}>
                            <div className="field">
                                <label htmlFor="nome">Nome</label>
                                <InputText id="nome" value={formik.values.nome} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('nome') })} />
                                {getFormErrorMessage('nome')}
                            </div>

                            <div className="field">
                                <label htmlFor="cpf">CPF</label>
                                <InputMask mask="999.999.999-99" id="cpf" value={formik.values.cpf} onChange={formik.handleChange} autoFocus />
                            </div>

                            <div className="field">
                                <label htmlFor="email">E-mail</label>
                                <InputText id="email" value={formik.values.email} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
                                {getFormErrorMessage('email')}
                            </div>

                            <div className="field">
                                <label htmlFor="cidade">Cidade</label>
                                <Dropdown id="cidade" name="cidade" value={formik.values.cidade} onChange={formik.handleChange} options={cidades} optionLabel="nome" 
        placeholder="Selecione uma Cidade" filter/>
                            </div>

                            <div className="field">
                                <label htmlFor="cep">CEP</label>
                                <InputMask mask="99999-999" id="cep" name="cep" value={formik.values.cep} onChange={formik.handleChange} autoFocus />
                            </div>

                            <div className="field">
                                <label htmlFor="endereco">Endereço</label>
                                <InputText id="endereco" value={formik.values.endereco} onChange={formik.handleChange} autoFocus />
                            </div>

                            <div className="field">
                                <label htmlFor="permissaoPessoas">Permissões</label>
                                <MultiSelect dataKey="permissao.id" id="permissaoPessoas" value={formik.values.permissaoPessoas} options={permissoes} onChange={formik.handleChange} optionLabel="permissao.nome" placeholder="Selecione as Permissões" />
                            </div>
                      </form>
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