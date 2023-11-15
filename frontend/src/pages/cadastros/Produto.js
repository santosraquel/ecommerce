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
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';
import { MarcaService } from '../../service/cadastros/MarcaService';
import { CategoriaService } from '../../service/cadastros/CategoriaService';
import { FornecedorService } from '../../service/cadastros/FornecedorService';
import { ProdutoService } from '../../service/cadastros/ProdutoService';
import { Link } from 'react-router-dom';

const Produto = () => {
    let novoProduto = {
        nome: '',
        descricaoCurta: '',
        descricaoDetalhada: '',
        valorCusto: '',
        valorVenda: '',
        tamanho: '',
        quantidadeEstoque: '',
        marca: null,
        categoria: null,
        fornecedor: null,
    };

    const [produtos, setProdutos] = useState(null);
    const [marcas, setMarcas] = useState(null);
    const [categorias, setCategorias] = useState(null);
    const [fornecedores, setFornecedores] = useState(null);
    const [produtoDialog, setProdutoDialog] = useState(false);
    const [deleteProdutoDialog, setDeleteProdutoDialog] = useState(false);
    const [produto, setProduto] = useState(novoProduto);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const produtoService = new ProdutoService();
    const marcaService = new MarcaService();
    const categoriaService = new CategoriaService();
    const fornecedorService = new FornecedorService();

    useEffect(() => {
            marcaService.listarTodos().then(res => {
                setMarcas(res.data);
            });

            categoriaService.listarTodos().then(res => {
                setCategorias(res.data);
            });

            fornecedorService.listarTodos().then(res => {
                setFornecedores(res.data);
            });
    }, []);

    // método para preencher a tabela
    useEffect(() => {
        if(produtos == null){
            produtoService.listarTodos().then(res => {
                setProdutos(res.data);
            });
        }
    }, [produtos]);

    const openNew = () => {
        setProduto(novoProduto);
        setSubmitted(false);
        setProdutoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProdutoDialog(false);
    }

    const hideDeleteProdutoDialog = () => {
        setDeleteProdutoDialog(false);
    }

    const saveProduto = () => {
        setSubmitted(true);

        if (produto.descricaoCurta.trim()) {
            let _produto = { ...produto };
            if (produto.id) {
                produtoService.alterar(_produto).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Produto atualizado com sucesso.', life: 3000 });
                    setProdutos(null);
                });
            }
            else {
                produtoService.inserir(_produto).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Produto salvo com sucesso.', life: 3000 });
                    setProdutos(null);
                });
            }

            setProdutoDialog(false);
            setProduto(novoProduto);
        }
    }

    const editProduto = (produto) => {
        setProduto({ ...produto });
        setProdutoDialog(true);
    }

    const confirmDeleteProduto = (produto) => {
        setProduto(produto);
        setDeleteProdutoDialog(true);
    }

    const deleteProduto = () => {
        produtoService.excluir(produto.id).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Produto excluido com sucesso', life: 3000 });
            setProdutos(null);
            setDeleteProdutoDialog(false);
        });
       
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _produto = { ...produto };
        _produto[`${name}`] = val;

        setProduto(_produto);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo Produto" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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

    const descricaoCurtaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descrição Curta</span>
                {rowData.descricaoCurta}
            </>
        );
    }

    const tamanhoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tamanho</span>
                {rowData.tamanho}
            </>
        );
    }

    const valorVendaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Valor</span>
                {rowData.valorVenda}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                 <Link to={{pathname:"/produtoImagens/"+rowData.id}}>
                 <Button icon="pi pi-image" className="p-button-rounded p-button-info mr-2" />
                 </Link>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-primary mr-2" onClick={() => editProduto(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteProduto(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Produtos Cadastrados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const produtoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveProduto} />
        </>
    );
    const deleteProdutoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-danger" onClick={hideDeleteProdutoDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-success" onClick={deleteProduto} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={produtos}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} produtos"
                        globalFilter={globalFilter} emptyMessage="No produtos found." header={header} responsiveLayout="scroll">
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="descricaoCurta" header="Descrição Curta" sortable body={descricaoCurtaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="tamanho" header="Tamanho" sortable body={tamanhoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="valorVenda" header="Valor Venda" sortable body={valorVendaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column header="Ações" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={produtoDialog} style={{ width: '450px' }} header="Cadastrar/Editar Produto" modal className="p-fluid" footer={produtoDialogFooter} onHide={hideDialog}>
                      
                        <div className="field">
                            <label htmlFor="descricaoCurta">Descrição Curta</label>
                            <InputText id="descricaoCurta" value={produto.descricaoCurta} onChange={(e) => onInputChange(e, 'descricaoCurta')} required autoFocus className={classNames({ 'p-invalid': submitted && !produto.descricaoCurta })} />
                            {submitted && !produto.descricaoCurta && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="descricaoDetalhada">Descrição Detalhada</label>
                            <InputText id="descricaoDetalhada" value={produto.descricaoDetalhada} onChange={(e) => onInputChange(e, 'descricaoDetalhada')} required autoFocus className={classNames({ 'p-invalid': submitted && !produto.descricaoDetalhada })} />
                            {submitted && !produto.descricaoDetalhada && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="valorCusto">Valor Custo</label>
                            <InputNumber mode="currency" currency="BRL" locale="pt-BR" id="valorCusto" value={produto.valorCusto} onChange={(e) => onInputChange(e, 'valorCusto')} required autoFocus className={classNames({ 'p-invalid': submitted && !produto.valorCusto })} />
                            {submitted && !produto.valorCusto && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="valorVenda">Valor Venda</label>
                            <InputNumber mode="currency" currency="BRL" locale="pt-BR" id="valorVenda" value={produto.valorVenda} onChange={(e) => onInputChange(e, 'valorVenda')} required autoFocus className={classNames({ 'p-invalid': submitted && !produto.valorVenda })} />
                            {submitted && !produto.valorVenda && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="tamanho">Tamanho</label>
                            <InputText id="tamanho" value={produto.tamanho} onChange={(e) => onInputChange(e, 'tamanho')} required autoFocus className={classNames({ 'p-invalid': submitted && !produto.tamanho })} />
                            {submitted && !produto.tamanho && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="quantidadeEstoque">Qtd. Estoque</label>
                            <InputText id="quantidadeEstoque" value={produto.quantidadeEstoque} onChange={(e) => onInputChange(e, 'quantidadeEstoque')} required autoFocus className={classNames({ 'p-invalid': submitted && !produto.quantidadeEstoque })} />
                            {submitted && !produto.quantidadeEstoque && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="marca">Marca</label>
                            <Dropdown value={produto.marca} onChange={(e) => onInputChange(e, 'marca')} options={marcas} optionLabel="nome" 
    placeholder="Selecione uma marca" filter/>
                        </div>

                        <div className="field">
                            <label htmlFor="categoria">Categoria</label>
                            <Dropdown value={produto.categoria} onChange={(e) => onInputChange(e, 'categoria')} options={categorias} optionLabel="nome" 
    placeholder="Selecione uma categoria" filter/>
                        </div>

                        <div className="field">
                            <label htmlFor="fornecedor">Fornecedor</label>
                            <Dropdown value={produto.fornecedor} onChange={(e) => onInputChange(e, 'fornecedor')} options={fornecedores} optionLabel="nome" 
    placeholder="Selecione uma fornecedor" filter/>
                        </div>
                      
                    </Dialog>

                    <Dialog visible={deleteProdutoDialog} style={{ width: '450px' }} header="Excluir Produto" modal footer={deleteProdutoDialogFooter} onHide={hideDeleteProdutoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {produto && <span>Tem certeza que deseja excluir a produto <b>{produto.nome}</b>?</span>}
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

export default React.memo(Produto, comparisonFn);