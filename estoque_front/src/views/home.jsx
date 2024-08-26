import React, { Component,useState,useEffect,useCallback } from 'react';
import axios from 'axios';
import { Dropdown, Form, Button,Table, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { ChevronDown, ChevronUp, Search, Plus, Eye, Trash,PencilSquare,InfoCircle,PcDisplay, Display, Android2, Apple, RouterFill, PrinterFill  } from 'react-bootstrap-icons';
import LogoImage from "./assets/images/logoNortti.svg";



const Home = () => {
    const [activeHeader, setActiveHeader] = useState("Produtos");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [selectedVenda, setSelectedVenda] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [quantidade, setQuantidade] = useState(0);
    const [quantidadeTotal, setQuantidadeTotal] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);
    const [vendaProdutos, setVendaProdutos] = useState([]);
    const [vendasData, setVendasData] = useState([]);
    const [vendaId, setVendaId] = useState(null);  
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filteredVendas, setFilteredVendas] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaData, setCategoriaData] = useState({
        nome: '',
        codigo: '',
        icone: '',
        descricao: ''
    });

    const [produtoData, setProdutoData] = useState({
        nome: '',
        foto: null, 
        valor: '',
        categoria_id: '',
        quantidade: ''
    });
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [showQuantityError, setShowQuantityError] = useState(false);
    const [messagePopUp, setMessagePopUp] = useState('');
    const [titlePopUp, seTtitlePopUp] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [cancelAction, setCancelAction] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    
    

    const imagesUrl = process.env.REACT_APP_IMAGES_URL;
  
    const handleChangeActiveHeader = (header) => {
        setActiveHeader(header);
        setShowDropdown(false);
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm, produtos, categories, vendasData]);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        if (activeHeader === "Produtos") {
            if (searchTerm === '') {
                setFilteredProducts(produtos);
            } else {
                const filtered = produtos.filter(product =>
                    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredProducts(filtered);
            }
        } else if (activeHeader === "Categorias") {
            if (searchTerm === '') {
                setFilteredCategories(categories);
            } else {
                const filtered = categories.filter(category =>
                    category.nome.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredCategories(filtered);
            }
        } else if (activeHeader === "Vendas") {
            if (searchTerm === '') {
                setFilteredVendas(vendasData);
            } else {
                const filtered = vendasData.filter(venda =>
                    venda.codVenda.toString().toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredVendas(filtered);
            }
        }
    };


    const handleDeleteCategory = async (id) => {
        seTtitlePopUp("Confirmação de Exclusão");
        setMessagePopUp("Tem certeza que deseja excluir esta categoria?");
        const confirmed = await openConfirmModal(); 
    
        if (confirmed) {
            try {
                await axios.delete(`${apiUrl}/categorias/${id}`);
                seTtitlePopUp("Exclusão Bem-Sucedida");
                setMessagePopUp("A categoria foi excluída com sucesso!");
                setShowDeleteSuccess(true);
                setTimeout(() => {
                    setShowDeleteSuccess(false);
                }, 3000);
                fetchCategories(); 
            } catch (error) {
                console.error('Erro ao excluir categoria:', error);
            }
        }
    };

    const openConfirmModal = () => {
        return new Promise((resolve) => {
            setShowConfirmModal(true);
    
            const handleConfirm = () => {
                setShowConfirmModal(false); 
                resolve(true); 
            };
    
            const handleCancel = () => {
                setShowConfirmModal(false); 
                resolve(false); 
            };
    
     
            setConfirmAction(() => handleConfirm);
            setCancelAction(() => handleCancel);
        });
    };

    const renderConfirmDeleteModal = () => (
        <Modal show={showConfirmModal} onHide={cancelAction}>
            <Modal.Header closeButton>
                <Modal.Title>{titlePopUp}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{messagePopUp}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={cancelAction}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={confirmAction}>
                    Excluir
                </Button>
            </Modal.Footer>
        </Modal>
    );
    
    
    
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${apiUrl}/categorias`);
            setCategories(response.data);
            setFilteredCategories(response.data)
        } catch (error) {
            console.error('Erro ao buscar categorias:', error.response ? error.response.data : error.message);
        }
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setCategoriaData({
            nome: category.nome,
            codigo: category.codigo,
            icone: category.icone,
            descricao: category.descricao
        });
        setShowModal(true);
    };


    const handleInputChangeProduto = (e) => {
        const { name, value } = e.target;
        setProdutoData({
            ...produtoData,
            [name]: value
        });
    };
    const handleEditProduct = (product) => {
        setProdutoData({
            nome: product.nome || '',
            foto: null,
            valor: product.valor || '',
            categoria_id: product.categoria_id || '',
            quantidade: product.quantidade || ''
        });
        setEditingProductId(product.id);
        setShowModal(true);
    };

    const handleSubmitProduto = async () => {
        try {
            const formData = new FormData();
            Object.keys(produtoData).forEach(key => {
                formData.append(key, produtoData[key] !== null ? produtoData[key] : '');
            });
    
            let response;
            const selectedCategoryName = categories.find(categoria => categoria.id === parseInt(produtoData.categoria_id))?.nome || 'Sem Categoria';
    
            if (editingProductId) {
               
                response = await axios.post(`${apiUrl}/produtos/${editingProductId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-HTTP-Method-Override': 'PUT' 
                    }
                });
    
                
                setProdutos(prevProducts => 
                    prevProducts.map(product => 
                        product.id === editingProductId 
                        ? { ...response.data, categoria: { nome: selectedCategoryName } } 
                        : product
                    )
                );
                setFilteredProducts(prevProducts =>
                    prevProducts.map(product =>
                        product.id === editingProductId 
                        ? { ...response.data, categoria: { nome: selectedCategoryName } } 
                        : product
                    )
                );
            } else {

                response = await axios.post(`${apiUrl}/produtos`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
             
                setProdutos(prevProducts => [...prevProducts, { ...response.data, categoria: { nome: selectedCategoryName } }]);
                setFilteredProducts(prevProducts => [...prevProducts, { ...response.data, categoria: { nome: selectedCategoryName } }]);
            }
    
            seTtitlePopUp("Atualização Bem-Sucedida");
            setMessagePopUp("O registro foi salvo com sucesso!");
            setShowDeleteSuccess(true); 
            setTimeout(() => {
                setShowDeleteSuccess(false);
            }, 3000);
    
            setShowModal(false);
            setEditingProductId(null); 
            setProdutoData({
                nome: '',
                foto: null,
                valor: '',
                categoria_id: '',
                quantidade: ''
            });
            handleSearch();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const messagePopUp = error.response.data.message;
                const errors = error.response.data.errors;
    
                if (errors.nome) {
                    alert(`Erro: ${errors.nome[0]}`);
                } else if (errors.valor) {
                    alert(`Erro: ${errors.valor[0]}`);
                } else if (errors.quantidade) {
                    alert(`Erro: ${errors.quantidade[0]}`);
                } else {
                    alert(`Erro ao salvar produto: ${messagePopUp}`);
                }
            } else {
                console.error('Erro ao salvar produto:', error.response ? error.response.data : error.message);
            }
        }
    };
    


    const handleFileChangeProduto = (e) => {
        setProdutoData({
            ...produtoData,
            foto: e.target.files[0]
        });
    };

    const handleDeleteProduct = async (id) => {
        seTtitlePopUp("Confirmação de Exclusão");
        setMessagePopUp("Tem certeza que deseja excluir este produto?");
        const confirmed = await openConfirmModal(); 
    
        if (confirmed) {
            try {
                await axios.delete(`${apiUrl}/produtos/${id}`);
                setProdutos(produtos.filter(product => product.id !== id));
                setFilteredProducts(filteredProducts.filter(product => product.id !== id));

                seTtitlePopUp("Exclusão Bem-Sucedida")
                setMessagePopUp("O produto foi excluído com sucesso!")
                setShowDeleteSuccess(true); 
                setTimeout(() => {
                    setShowDeleteSuccess(false);
                }, 3000);
            } catch (error) {
                console.error('Erro ao excluir produto:', error.response ? error.response.data : error.message);
            }
        }
    };

    const handleAddProductToVendaSubmit = async () => {

        const produtoEncontrado = produtos.find(prod => prod.nome === produtoSelecionado);
        if (!produtoEncontrado) return;
    
        const valorProduto = produtoEncontrado.valor * quantidade;
    
        try {
            if (!vendaId) {
              
                const novaVenda = {
                    produtos: [],
                };
                const responseVenda = await axios.post(`${apiUrl}/vendas`, novaVenda);
                const vendaCriadaId = responseVenda.data.id;
                setVendaId(vendaCriadaId);
    
               
                await axios.post(`${apiUrl}/vendas/${vendaCriadaId}/produtos`, {
                    produto_id: produtoEncontrado.id,
                    quantidade: quantidade,
                });
            } else {
            
                await axios.post(`${apiUrl}/vendas/${vendaId}/produtos`, {
                    produto_id: produtoEncontrado.id,
                    quantidade: quantidade,
                });
            }
    
            const novoProduto = {
                nome: produtoSelecionado,
                quantidade,
                valor: valorProduto,
            };



    
            setVendaProdutos([...vendaProdutos, novoProduto]);
            setQuantidadeTotal(quantidadeTotal + quantidade);
            setValorTotal(valorTotal + valorProduto);
    
       
            setProdutoSelecionado("");
            setQuantidade(0);
    
        } catch (error) {
            if (error.response && error.response.status === 422) {
          
                seTtitlePopUp("Erro de Quantidade")
                setMessagePopUp(error.response.data.error);
                setShowQuantityError(true);
                setTimeout(() => setShowQuantityError(false), 4000);
            } else {
                console.error("Erro ao adicionar produto à venda existente:", error);
            }
        }
    };


    
    const renderQuantityErrorModal = () => (
        <Modal show={showQuantityError} onHide={() => setShowQuantityError(false)} contentClassName="bg-danger text-white">
            <Modal.Header closeButton>
                <Modal.Title>{titlePopUp}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ whiteSpace: 'pre-wrap' }}>
                {messagePopUp}
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="light" onClick={() => setShowQuantityError(false)}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
    


    
    
    const openVendaModal = async (venda) => {
        try {
            const response = await axios.get(`${apiUrl}/vendas/${venda.codVenda}`);
            const vendaDetalhada = response.data;
    
            setSelectedVenda({
                ...venda,
                produtos: vendaDetalhada.produtos
            });
            setShowModalInfo(true);
        } catch (error) {
            console.error("Erro ao buscar detalhes da venda:", error);
        }
    };
    

    const renderTableHeader = () => {
        if (activeHeader === "Produtos") {
            return (
                <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Quantidade</th>
                    <th>Valor</th>
                    <th>Foto</th>
                    <th></th>
                </tr>
            );
        } else if (activeHeader === "Categorias") {
            return (
                <tr>
                    <th>Nome</th>
                    <th>Código</th>
                    <th>Ícone</th>
                    <th>Descrição</th>
                    <th></th>
                </tr>
            );
        } else if (activeHeader === "Vendas") {
            return (
                <tr>
                    <th>CodVendas</th>
                    <th>Qtd total</th>
                    <th>Valor total</th>
                    <th>Info</th>
                    <th></th>
                </tr>
            );
        }
    };

    const fetchProdutos = async () => {
        try {
            const response = await axios.get(`${apiUrl}/produtos`);
            setProdutos(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };




    const handleSubmitVendas = async () => {


        if(quantidadeTotal > 0){
            setShowModal(false);
            setVendaProdutos([]);
            setQuantidadeTotal(0);
            setValorTotal(0);
            setVendaId(null); 
            seTtitlePopUp("Atualização Bem-Sucedida")
            setMessagePopUp("O registro foi salvo com sucesso!")
            setShowDeleteSuccess(true); 
            setTimeout(() => {
                setShowDeleteSuccess(false);
            }, 3000);
            fetchVendas();

        }else{
            seTtitlePopUp("Erro ao salvar")
            setMessagePopUp("Primeiro adicione o registro");
            setShowQuantityError(true);
            setTimeout(() => setShowQuantityError(false), 4000);
            
        }

        



    };


    const fetchVendas = async () => {
        try {
            const response = await axios.get(`${apiUrl}/vendas-detalhadas`);
            setVendasData(response.data);
            setFilteredVendas(response.data)
            
        } catch (error) {
            console.error("Erro ao buscar vendas:", error);
        }
    };
    

    const handleUpdateVenda = async (venda) => {
     
        try {
            const response = await axios.get(`${apiUrl}/vendas/${venda}`);
            
            setSelectedVenda(response.data);
            setVendaProdutos(response.data.produtos);
            setShowEditModal(true);
    
    
            const produtosResponse = await axios.get(`${apiUrl}/produtos`);
            setProdutos(produtosResponse.data);
        } catch (error) {
            console.error("Erro ao buscar detalhes da venda:", error);

        }
    };
    
    const handleAddProductToVendaEdit = () => {
        if (!produtoSelecionado || quantidade < 1) {
            alert("Selecione um produto e uma quantidade válida.");
            return;
        }
    
        const produtoExistente = vendaProdutos.find(prod => prod.id === parseInt(produtoSelecionado));
    
        if (produtoExistente) {
    
            const updatedProdutos = vendaProdutos.map(prod => {
                if (prod.id === parseInt(produtoSelecionado)) {
                    return { ...prod, pivot: { quantidade: prod.pivot.quantidade + quantidade } };
                }
                return prod;
            });
            setVendaProdutos(updatedProdutos);
        } else {
            
            const produto = produtos.find(prod => prod.id === parseInt(produtoSelecionado));
            setVendaProdutos([...vendaProdutos, { ...produto, pivot: { quantidade: quantidade } }]);
        }
    
    
        setProdutoSelecionado('');
        setQuantidade(1);
        setShowAddProductModal(false);
    };


    const handleSaveVendaChangesEdit = async () => {
        try {
            const payload = {
                produtos: vendaProdutos.map(prod => ({
                    produto_id: prod.id,
                    quantidade: prod.pivot.quantidade
                }))
            };

        
    
            await axios.put(`${apiUrl}/vendas/${selectedVenda.id}`, payload);
    
            seTtitlePopUp("Atualização Bem-Sucedida")
            setMessagePopUp("O registro foi editado com sucesso!")
            setShowDeleteSuccess(true); 
            setTimeout(() => {
                setShowDeleteSuccess(false);
            }, 3000);
            fetchVendas();
            setShowEditModal(false);
            setSelectedVenda(null);
            setVendaProdutos([]);
        } catch (error) {
            
            if (error.response && error.response.status === 422) {
           
                setMessagePopUp(error.response.data.error);
                setShowQuantityError(true);
                setTimeout(() => setShowQuantityError(false), 4000);
            } else {
                console.error("Erro ao adicionar produto à venda existente:", error);
            }
        }
    };

    const handleQuantityChangeProductsToVenda = (index, value) => {
        const updatedProdutos = [...vendaProdutos];
        updatedProdutos[index].pivot.quantidade = parseInt(value);
        setVendaProdutos(updatedProdutos);
    };

    const handleRemoveProductToVenda = async (produtoId,vendaId) => {
        try {
          
            const response = await axios.delete(`${apiUrl}/vendas/${vendaId}/produtos/${produtoId}`);
            
       
            if (response.status === 200) {
                const updatedProdutos = vendaProdutos.filter(prod => prod.id !== produtoId);
                setVendaProdutos(updatedProdutos);
                seTtitlePopUp("Exclusão Bem-Sucedida")
                setMessagePopUp("Produto removido com sucesso");
                setShowDeleteSuccess(true); 
                setTimeout(() => {
                    setShowDeleteSuccess(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Erro ao remover produto da venda:', error);
            seTtitlePopUp("Erro ao remover")
            setMessagePopUp("O produto precisa ser salvo antes de ser removido");
            setShowQuantityError(true);
            setTimeout(() => setShowQuantityError(false), 4000);
        }
    };
    
    

    const renderEditVendaModal = () => {
        if (!selectedVenda) return null;
        
    
        return (
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Editar Informações da Venda</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendaProdutos.map((produto, index) => (
                                <tr key={index}>
                                    <td>{produto.nome}</td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={produto.pivot ? produto.pivot.quantidade : 0}
                                            onChange={(e) => handleQuantityChangeProductsToVenda(index, e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Trash
                                            color="red"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleRemoveProductToVenda(produto.id,selectedVenda.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button variant="primary" onClick={() => setShowAddProductModal(true)}>
                        <Plus /> Adicionar Produto
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleSaveVendaChangesEdit}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const renderAddProductModal = () => {
        return (
            <Modal show={showAddProductModal} onHide={() => setShowAddProductModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProduto">
                            <Form.Label>Produto</Form.Label>
                            <Form.Select
                                value={produtoSelecionado}
                                onChange={(e) => setProdutoSelecionado(e.target.value)}
                            >
                                <option value="">Selecione um Produto</option>
                                {produtos.map((produto) => (
                                    <option key={produto.id} value={produto.id}>
                                        {produto.nome}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formQuantidade" className="mt-3">
                            <Form.Label>Quantidade</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={quantidade}
                                onChange={(e) => setQuantidade(parseInt(e.target.value))}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddProductModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleAddProductToVendaEdit}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
    

    const handleDeleteVenda = async (codVenda) => {
        seTtitlePopUp("Confirmação de Exclusão");
        setMessagePopUp("Tem certeza que deseja excluir esta venda?");
        const confirmed = await openConfirmModal(); 
    
        if (confirmed) {
            try {
                await axios.delete(`${apiUrl}/vendas/${codVenda}`);
                setVendasData(vendasData.filter(venda => venda.codVenda !== codVenda));
                setFilteredVendas(filteredVendas.filter(venda => venda.codVenda !== codVenda));
                
                seTtitlePopUp("Exclusão Bem-Sucedida")
                setMessagePopUp("A venda foi excluída com sucesso!")
                setShowDeleteSuccess(true); 
                setTimeout(() => {
                    setShowDeleteSuccess(false);
                }, 3000);
            } catch (error) {
                console.error("Erro ao excluir venda:", error);
            }
    }
    };

    const renderDeleteSuccessModal = () => {
        return (
            <Modal show={showDeleteSuccess} onHide={() => setShowDeleteSuccess(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{titlePopUp}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {messagePopUp}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setShowDeleteSuccess(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
    
    const renderIcon = (iconName) => {
        console.log("Ícone atual:", iconName);
        switch (iconName) {
            case "Computador":
                return <PcDisplay />;
            case "Monitor":
                return <Display />;
            case "Smartphone (Android)":
                return <Android2 />;
            case "Iphone (IOS)":
                return <Apple />;
            case "Roteador":
                return <RouterFill />;
            case "Impressora":
                return <PrinterFill />;
            default:
                return null;
        }
    };

    const formatCurrency = (value) => {
        const formatter = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      
        return formatter.format(value);
      };
      
      
    


    const renderTableBody = () => {
        if (activeHeader === "Produtos") {
            return filteredProducts.map((product, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td>{product.nome}</td>
                    <td>{product.categoria ? product.categoria.nome : 'Sem Categoria'}</td>
                    <td>{product.quantidade}</td>
                    <td>{formatCurrency(product.valor)}</td>

                    <td>
                    <Eye  style={{ cursor: 'pointer'}}  onClick={() => renderModalViewFoto(product)} />

                </td>
                <td>
                        <Trash color="red" style={{ cursor: 'pointer' }} onClick={() => handleDeleteProduct(product.id)} />
                        <PencilSquare color="#15387f" style={{ cursor: 'pointer', marginLeft: '10px' }}  onClick={() => handleEditProduct(product)} />
                    </td>
                </tr>
            ));
        } else if (activeHeader === "Categorias") {
            return categories.map((category, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td>{category.nome}</td>
                    <td>{category.codigo}</td>
                    <td>{renderIcon(category.icone)}</td> 

                    <td>{category.descricao}</td>
                    <td>
                        <Trash color="red" style={{ cursor: 'pointer' }} onClick={() => handleDeleteCategory(category.id)} />
                        <PencilSquare color="#15387f" style={{ cursor: 'pointer', marginLeft: '10px' }}  onClick={() => handleEditCategory(category)} />
                    </td>
                </tr>
            ));
        }else if (activeHeader === "Vendas") {
            return filteredVendas.map((venda, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    {activeHeader === "Vendas" && <>
                        <td>{venda.codVenda}EAN</td> 
                        <td>{venda.qtdTotal} itens</td> 
                        <td>{formatCurrency(venda.valorTotal)}</td> 
                        <td>
                            <InfoCircle color="#15387f" style={{ cursor: 'pointer' }} onClick={() => openVendaModal(venda)} />
                        </td>
                        <td>
                            <Trash color="red" style={{ cursor: 'pointer' }} onClick={() => handleDeleteVenda(venda.codVenda)} />
                            <PencilSquare color="#15387f" style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => handleUpdateVenda(venda.codVenda)} />
                        </td>
                    </>}
                </tr>
            ));
        }
    };

    const [showFotoModal, setShowFotoModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const renderModalViewFoto = (product) => {
        setSelectedProduct(product);
        setShowFotoModal(true);
    };

    const renderFotoModal = () => {
        if (!selectedProduct) return null;

    
        return (
            <Modal
                show={showFotoModal}
                onHide={() => setShowFotoModal(false)}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Imagem do Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                    <img
                         src={selectedProduct.foto ? `${imagesUrl}/${selectedProduct.foto}` : 'fallback_image_url'}
                        alt="Imagem do Produto"
                        style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '10px' }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFotoModal(false)}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
    
    

    

    const renderVendaModal = () => {
        if (!selectedVenda) return null;

        return (
            <Modal show={showModalInfo} onHide={() => setShowModalInfo(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Informações da Venda</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table hover className="table-borderless">
                        <thead style={{ backgroundColor: 'transparent', borderBottom: '1px solid #ddd' }}>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedVenda.produtos.map((produto, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td>{produto.nome}</td>
                                    <td>{produto.pivot.quantidade}</td> {/* Usar pivot para acessar a quantidade */}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalInfo(false)}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoriaData({ ...categoriaData, [name]: value });
    };

    const handleSubmitCategoria = async () => {
        try {
         
            const existingCategory = categories.find(category => category.codigo === categoriaData.codigo && (!selectedCategory || category.id !== selectedCategory.id));
            if (existingCategory) {
                alert('Código já existe, escolha outro.');
                return;
            }

            if (selectedCategory) {
   
                const response = await axios.put(`${apiUrl}/categorias/${selectedCategory.id}`, categoriaData);
                console.log('Categoria atualizada com sucesso:', response.data);
                setCategories(categories.map(category => category.id === selectedCategory.id ? response.data : category));
            } else {
              
                const response = await axios.post(`${apiUrl}/categorias`, categoriaData);
                console.log('Categoria criada com sucesso:', response.data);
                setCategories([...categories, response.data]);
            }

            setShowModal(false);
            setSelectedCategory(null);

            seTtitlePopUp("Atualização Bem-Sucedida")
            setMessagePopUp("O registro foi salvo com sucesso!")
            setShowDeleteSuccess(true); 
            setTimeout(() => {
                setShowDeleteSuccess(false);
            }, 3000);

            setCategoriaData({
                nome: '',
                codigo: '',
                icone: '',
                descricao: ''
            });

        } catch (error) {
            if (error.response && error.response.status === 422) {
                const messagePopUp = error.response.data.message;
                const errors = error.response.data.errors;

                if (errors.codigo) {
                    alert(`Erro: ${errors.codigo[0]}`);
                } else {
                    alert(`Erro ao criar categoria: ${messagePopUp}`);
                }
            } else {
                console.error('Erro ao salvar categoria:', error.response ? error.response.data : error.message);
            }
        }
    };




    const renderModalSubmitBody = () => {
        if (activeHeader === "Produtos") {
            return (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nome do Produto"
                            name="nome"
                            value={produtoData.nome}
                            onChange={handleInputChangeProduto}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Foto</Form.Label>
                        <Form.Control
                            type="file"
                            name="foto"
                            onChange={handleFileChangeProduto}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Valor</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>R$</InputGroup.Text>
                            <FormControl
                                type="number"
                                placeholder="Valor do Produto"
                                name="valor"
                                value={produtoData.valor}
                                onChange={handleInputChangeProduto}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Select
                            name="categoria_id"
                            value={produtoData.categoria_id}
                            onChange={handleInputChangeProduto}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map(categoria => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Quantidade"
                            name="quantidade"
                            value={produtoData.quantidade}
                            onChange={handleInputChangeProduto}
                        />
                    </Form.Group>
                </>
            );
        } else if (activeHeader === "Categorias") {
            return (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nome da Categoria"
                            name="nome"
                            value={categoriaData.nome}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Código</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Código da Categoria"
                            name="codigo"
                            value={categoriaData.codigo}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ícone</Form.Label>
                        <Form.Select
                            name="icone"
                            value={categoriaData.icone}
                            onChange={handleInputChange}
                        >
                            <option value="">Selecione um Ícone</option>
                            <option value="Computador">Computador</option>
                            <option value="Monitor">Monitor</option>
                            <option value="Smartphone (Android)">Smartphone (Android)</option>
                            <option value="Iphone (IOS)">Iphone (IOS)</option>
                            <option value="Roteador">Roteador</option>
                            <option value="Impressora">Impressora</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Descrição da Categoria"
                            name="descricao"
                            value={categoriaData.descricao}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </>
            );
        } else if (activeHeader === "Vendas") {
            return (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>Produto</Form.Label>
                        <Form.Select
                            value={produtoSelecionado}
                            onChange={(e) => setProdutoSelecionado(e.target.value)}
                        >
                            <option value="">Selecione um Produto</option>
                            {produtos.map((produto, index) => (
                                <option key={index} value={produto.nome}>
                                    {produto.nome}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control
                            type="number"
                            value={quantidade}
                            onChange={(e) => setQuantidade(parseInt(e.target.value))}
                            placeholder="Quantidade"
                        />
                    </Form.Group>
                    <Button variant="success" onClick={handleAddProductToVendaSubmit} className="mb-3">
                        Adicionar Registro
                    </Button>
                    <div className="d-flex justify-content-between">
                        <div>
                            <Form.Label>Quantidade Total de Produtos:</Form.Label>
                            <p>{quantidadeTotal}</p>
                        </div>
                        <div>
                            <Form.Label>Valor Total:</Form.Label>
                            <p>R$ {valorTotal}</p>
                        </div>
                    </div>
                </>
            );
        }
    };



    useEffect(() => {
        if (activeHeader === "Vendas") {
            fetchProdutos();
            fetchVendas();
        }else if (activeHeader === "Produtos") {
            fetchCategories();
            fetchProdutos();
        }else if (activeHeader === "Categorias") {
            fetchCategories();
        }
    }, [activeHeader]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center p-3 ">
                <h2>{activeHeader}</h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={LogoImage} alt="Logo" style={{ width: 140, marginRight: 10 }} />
                    <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}>
                            {showDropdown ? <ChevronUp color="#15387f" /> : <ChevronDown color="#15387f" />}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {["Produtos", "Categorias", "Vendas"].filter(item => item !== activeHeader).map(item => (
                                <Dropdown.Item key={item} onClick={() => handleChangeActiveHeader(item)}>
                                    {item}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            {/* Sub-Header */}
            <div className="sub-header-container p-3 my-3 mx-auto bg-white rounded shadow-sm d-flex justify-content-between align-items-center" style={{ maxWidth: '95%' }}>
                <Form className="d-flex align-items-center" style={{ width: '30%' }}>
                    <div className="input-group">
                        <span className="input-group-text bg-white " id="search-icon">
                            <Search color="#999" />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pesquisar"
                            aria-label="Pesquisar"
                            aria-describedby="search-icon"
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                        />
                    </div>
                </Form>

                <Button 
                        variant="primary" 
                        className="d-flex align-items-center" 
                        style={{ backgroundColor: '#15387f', borderColor: '#15387f' }} 
                        onClick={() => {
                            setProdutoSelecionado("");
                            setQuantidade(0);
                            setShowModal(true);
                            setCategoriaData({
                                nome: '',
                                codigo: '',
                                icone: '',
                                descricao: ''
                            });
                            setProdutoData({
                                nome: '',
                                foto: null,
                                valor: '',
                                categoria_id: '',
                                quantidade: ''
                            }); 

                        }}
                >
                    <Plus className="me-2" /> Adicionar
                </Button>
            </div>
             {/* Tabela */}
             <div className="table-responsive" style={{ maxWidth: '95%', margin: '0 auto' }}>
                <Table hover className="table-borderless">
                    <thead style={{ backgroundColor: 'transparent', borderBottom: '1px solid #ddd' }}>
                        {renderTableHeader()}
                    </thead>
                    <tbody>
                        {renderTableBody()}
                    </tbody>
                </Table>
            </div>

       
            {renderVendaModal()}
            {renderConfirmDeleteModal()}

            {renderEditVendaModal()}
            {renderAddProductModal()}
            {renderDeleteSuccessModal()}
            {renderQuantityErrorModal()}
            {renderFotoModal()}  {/* Renderiza o modal de foto */}


           
             <Modal show={showModal}  onHide={() => {
                            setProdutoSelecionado("");
                            setQuantidade(0);
                            setShowModal(false);
                            
                
                        }}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Adicionar ${activeHeader}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderModalSubmitBody()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => {
                            if (activeHeader === "Produtos") {
                                handleSubmitProduto();
                            } else if (activeHeader === "Categorias") {
                                handleSubmitCategoria();
                            } else if (activeHeader === "Vendas"){
                                handleSubmitVendas();
                            }
                        }}
                    >
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};



function HomeScreen() {

    


    return (

        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Home  />

            </div>
 

        
    );
}

export default HomeScreen;

