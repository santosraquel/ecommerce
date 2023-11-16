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
import { CategoriaService } from '../../service/cadastros/CategoriaService';
import ColunaOpcoes from '../../components/ColunaOpcoes';


const Categoria = () => {
    let novaCategoria = {
        name: '',
    };

    const [categorias, setCategorias] = useState(null);
    const [categoriaDialog, setCategoriaDialog] = useState(false);
    const [deleteCategoriaDialog, setDeleteCategoriaDialog] = useState(false);
    const [categoria, setCategoria] = useState(novaCategoria);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const categoriaService = new CategoriaService();

    // método para preencher a tabela
    useEffect(() => {
        if(categorias == null){
            categoriaService.listarTodos().then(res => {
                setCategorias(res.data);
            });
        }
    }, [categorias]);

    const openNew = () => {
        setCategoria(novaCategoria);
        setSubmitted(false);
        setCategoriaDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCategoriaDialog(false);
    }

    const hideDeleteCategoriaDialog = () => {
        setDeleteCategoriaDialog(false);
    }

    const saveCategoria = () => {
        setSubmitted(true);

        if (categoria.nome.trim()) {
            let _categoria = { ...categoria };
            if (categoria.id) {
                categoriaService.alterar(_categoria).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Categoria atualizada com sucesso.', life: 3000 });
                    setCategorias(null);
                });
            }
            else {
                categoriaService.inserir(_categoria).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Categoria salva com sucesso.', life: 3000 });
                    setCategorias(null);
                });
            }

            setCategoriaDialog(false);
            setCategoria(novaCategoria);
        }
    }

    const editObjeto = (categoria) => {
        setCategoria({ ...categoria });
        setCategoriaDialog(true);
    }

    const confirmDeleteObjeto = (categoria) => {
        setCategoria(categoria);
        setDeleteCategoriaDialog(true);
    }

    const deleteCategoria = () => {
        categoriaService.excluir(categoria.id).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successo', detail: 'Categoria excluida com sucesso', life: 3000 });
            setCategorias(null);
            setDeleteCategoriaDialog(false);
        });
       
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _categoria = { ...categoria };
        _categoria[`${name}`] = val;

        setCategoria(_categoria);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova Categoria" icon="pi pi-plus" className="mr-2" style={{backgroundColor:'#ff008d'}} onClick={openNew} />
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
            <h4 className="m-0" style={{color: '#ff008d'}}>Categorias Cadastradas</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisar" />
            </span>
        </div>
    );

    const categoriaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveCategoria} />
        </>
    );
    const deleteCategoriaDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-danger" onClick={hideDeleteCategoriaDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-success" onClick={deleteCategoria} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={categorias}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords}"
                        globalFilter={globalFilter} emptyMessage="Não há dados cadastrados." header={header} responsiveLayout="scroll">
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={rowData => {return <ColunaOpcoes rowData={rowData} editObjeto={editObjeto} confirmDeleteObjeto={confirmDeleteObjeto}/>}}></Column>                    
                    </DataTable>

                    <Dialog visible={categoriaDialog} style={{ width: '450px' }} header="Cadastrar/Editar Categoria" modal className="p-fluid" footer={categoriaDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={categoria.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !categoria.nome })} />
                            {submitted && !categoria.nome && <small className="p-invalid">Campo obrigatório.</small>}
                        </div>
                      
                    </Dialog>

                    <Dialog visible={deleteCategoriaDialog} style={{ width: '450px' }} header="Excluir Categoria" modal footer={deleteCategoriaDialogFooter} onHide={hideDeleteCategoriaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {categoria && <span>Tem certeza que deseja excluir a categoria <b>{categoria.nome}</b>?</span>}
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

export default React.memo(Categoria, comparisonFn);