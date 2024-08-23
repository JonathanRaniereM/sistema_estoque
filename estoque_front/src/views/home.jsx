import React, { Component,useState,useEffect,useCallback } from 'react';
import axios from 'axios';
import { Dropdown, Form, Button,Table, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { ChevronDown, ChevronUp, Search, Plus, Eye, Trash } from 'react-bootstrap-icons';
import LogoImage from "./assets/images/logoNortti.svg";



const Home = () => {
    const [activeHeader, setActiveHeader] = useState("Produtos");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [products, setProducts] = useState([]);
    const [quantidadeTotal, setQuantidadeTotal] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);
    const [selectedVenda, setSelectedVenda] = useState(null);

    const toggleDropdown = (e) => {
        // Impede que o evento de clique propague de forma inadequada
        e.stopPropagation();
        setShowDropdown(prev => !prev);
    };

    const handleChangeActiveHeader = (header) => {
        setActiveHeader(header);
        setShowDropdown(false);
    };

    const handleAddProduct = () => {
        const newProduct = {
            produto: "Produto Exemplo",
            quantidade: 2,
            valor: 100.0,
        };
        setProducts([...products, newProduct]);
        setQuantidadeTotal(quantidadeTotal + newProduct.quantidade);
        setValorTotal(valorTotal + newProduct.quantidade * newProduct.valor);
    };

    const openVendaModal = (venda) => {
        setSelectedVenda(venda);
        setShowModalInfo(true);
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
                    <th>View</th>
                    <th></th>
                </tr>
            );
        }
    };




    const renderTableBody = () => {
        // Exemplo de dados estáticos, substitua pelos seus dados reais
        const vendasData = [
            { codVenda: "001", qtdTotal: 15, valorTotal: 1500.0, produtos: [{ nome: "Produto 1", quantidade: 10 }, { nome: "Produto 2", quantidade: 5 }] },
            { codVenda: "002", qtdTotal: 20, valorTotal: 2000.0, produtos: [{ nome: "Produto 3", quantidade: 10 }, { nome: "Produto 4", quantidade: 10 }] }
        ];

        return vendasData.map((venda, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                {activeHeader === "Vendas" && <>
                    <td>{venda.codVenda}</td>
                    <td>{venda.qtdTotal}</td>
                    <td>R$ {venda.valorTotal}</td>
                    <td>
                        <Eye color="#15387f" style={{ cursor: 'pointer' }} onClick={() => openVendaModal(venda)} />
                    </td>
                    <td><Trash color="red" /></td>
                </>}
            </tr>
        ));
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
                                    <td>{produto.quantidade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };



    const renderModalBody = () => {
        if (activeHeader === "Produtos") {
            return (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" placeholder="Nome do Produto" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Foto</Form.Label>
                        <Form.Control type="file" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Valor</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>R$</InputGroup.Text>
                            <FormControl type="number" placeholder="Valor do Produto" />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Select>
                            <option>Categoria 1</option>
                            <option>Categoria 2</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control type="number" placeholder="Quantidade" />
                    </Form.Group>
                </>
            );
        } else if (activeHeader === "Categorias") {
            return (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" placeholder="Nome da Categoria" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Código</Form.Label>
                        <Form.Control type="text" placeholder="Código da Categoria" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ícone</Form.Label>
                        <Form.Select>
                            <option>Ícone 1</option>
                            <option>Ícone 2</option>
                            <option>Ícone 3</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Descrição da Categoria" />
                    </Form.Group>
                </>
            );
        } else if (activeHeader === "Vendas") {
            return (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>Produto</Form.Label>
                        <Form.Control type="text" placeholder="Nome do Produto" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control type="number" placeholder="Quantidade" />
                    </Form.Group>
                    <Button variant="success" onClick={handleAddProduct} className="mb-3">Adicionar Mais</Button>
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
                        <input type="text" className="form-control " placeholder="Pesquisar" aria-label="Pesquisar" aria-describedby="search-icon" />
                    </div>
                </Form>

                <Button variant="primary" className="d-flex align-items-center" style={{ backgroundColor: '#15387f', borderColor: '#15387f' }} onClick={() => setShowModal(true)}>
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

            {/* Modal de Venda */}
            {renderVendaModal()}



            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Adicionar ${activeHeader}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderModalBody()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => setShowModal(false)}>
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

