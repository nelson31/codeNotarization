import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import decode from 'jwt-decode';
import Web3 from 'web3'
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import axios from 'axios';

import { NavBarIn } from './NavBarIn';
import { RodapePerfil } from './RodapePerfil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from './images/logo_blocknotarization.png';
import Registry from '../abis/Registry.json'
import { DOCUMENTS_URL } from './api';

import api from './api';

export class TransferRequest extends Component {
    static displayName = TransferRequest.name;

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            addrNewProp: '',
            notarizationsCount: 0,
            notarizations: [],
            loading: true,
            logged: false,
            dadosDocumento: [],
            dadosConta: [],
            hash: '',
            timestamp: '',
            descricao: '',
            dono: '',
            nome: '',
            firstName: ''
        };
    }

    componentDidMount() {

        // Buscar o token
        const token = localStorage.getItem('token');
        var decoded = decode(token);
        this.setState({ account: decoded.Address });
        this.setState({ nome: decoded.Nome });
        this.setState({ firstName: decoded.Nome.trim().split(' ', 1) });
        // Buscar o hash do documento
        const hashDoc = localStorage.getItem('hashDoc');
        this.setState({ hash: hashDoc });
        localStorage.removeItem('hashDoc');

        axios.get(`${DOCUMENTS_URL}`, {
            params: {
                hash: hashDoc
            }
        })
            .then(res => {
                console.log(res);
                this.setState({ dadosDocumento: res.data });
                var i = 0;
                while (i < res.data.metadata.length) {
                    if (res.data.metadata[i].nome == "Timestamp") {
                        this.setState({ timestamp: res.data.metadata[i].atributo });
                        res.data.metadata = res.data.metadata.filter((item) => item.nome !== "Timestamp");
                    }
                    if (res.data.metadata[i].nome == "Descricao") {
                        this.setState({ descricao: res.data.metadata[i].atributo });
                        res.data.metadata = res.data.metadata.filter((item) => item.nome !== "Descricao");
                    }
                    if (res.data.metadata[i].nome == "Proprietario") {
                        this.setState({ dono: res.data.metadata[i].atributo });
                        res.data.metadata = res.data.metadata.filter((item) => item.nome !== "Proprietario");
                    }
                    i++;
                }
            })
            .catch(error => {
                alert("ERROR! " + error);
            });
    }

    efetuaTransf = async (e) => {
        e.preventDefault()

        try {
            // Verificar se o endereço inserido existe na base de dados
            const web3 = new Web3("http://localhost:8545")
            const blocknotarization = new web3.eth.Contract(Registry.abi, Registry.networks[5777].address)
            const regist = await blocknotarization.methods.isRegister(this.state.addrNewProp).call()

            if (regist == false) {
                alert("Endereço inserido não se encontra registado!")
                this.props.history.push("/perfil")
            } else {
                // Registar o pedido na DB
                await api.post(`registers/transferrequest`, {
                    HashDoc: this.state.hash,
                    AddrRequester: this.state.account,
                    AddrNewProp: this.state.addrNewProp
                })
                    .then(response => {
                        alert("Pedido de transferência efetuado com sucesso!!!");
                        this.props.history.push("/perfil");
                    })
                    .catch(error => {
                        alert("Erro ao efetuar o pedido de transferência na base de dados!!!");
                        this.props.history.push("/perfil");
                    })
            }
        } catch (error) {
            alert("Argumento inválido!")
        }
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    render() {
        return (
            <>
                <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl bg-indigo-300 bg-opacity-75 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">

                    {/* Brand */}
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <Link tag={Link} className="links" to="/perfil">
                            <a
                                className="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase"
                            >
                                <img className="text-gray-800 text-xs font-bold uppercase px-1 py-1 hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3"
                                    width={180} src={logo} />
                            </a>
                        </Link>
                    </div>

                    <div
                        className="md:block text-left text-xl md:pb-2 text-gray-800 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-3 px-0"
                    >
                        Bem Vindo(a) <br /> {this.state.firstName}
                    </div>

                    {/* Navigation */}
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                        <li className="items-center">
                            <Link
                                className="text-gray-800 hover:text-gray-600 text-xs uppercase py-3 font-bold block"
                                to="/perfil"
                            >
                                <FontAwesomeIcon icon="user" /><i className="text-gray-500 mr-2 text-sm"></i> Perfil
                                </Link>
                        </li>

                        <li className="items-center">
                            <Link
                                className="text-gray-800 hover:text-gray-600 text-xs uppercase py-3 font-bold block"
                                to="/documentos"
                            >
                                <FontAwesomeIcon icon="folder-open" /> <i className="opacity-75 mr-2 text-sm"></i> Documentos
                                    </Link>
                        </li>

                        <li className="items-center">
                            <Link
                                className="text-gray-800 hover:text-gray-600 text-xs uppercase py-3 font-bold block"
                                to="/registarDoc"
                            >
                                <FontAwesomeIcon icon="file-signature" /><i className="text-gray-500 mr-2 text-sm"></i> Registar Documento
                                    </Link>
                        </li>

                        <li className="items-center">
                            <Link
                                className="text-gray-800 hover:text-gray-600 text-xs uppercase py-3 font-bold block"
                                to="/listTransProp"
                            >
                                <FontAwesomeIcon icon="list-alt" /><i className="text-gray-500 mr-2 text-sm"></i> Pedidos Transferência
                                    </Link>
                        </li>

                    </ul>
                    {/* Divider */}
                    <hr className="my-4 md:min-w-full" />
                </nav>
                <main className="relative md:ml-64 historico-page">
                    <NavBarIn />
                    <section className="relative block" style={{ height: "450px" }}>
                        <div
                            className="absolute top-0 w-full h-full bg-center bg-cover"
                            style={{
                                backgroundImage:
                                    "url('https://3.bp.blogspot.com/-h_8GHsmL54U/WLi4kB05S0I/AAAAAAAAAME/tDK4ZmQ1reAWV5T9IKzGtw2mNGhGDYGWgCLcB/s1600/Acto-notarial-685x254.jpg')"
                            }}
                        >
                            <span
                                id="blackOverlay"
                                className="w-full h-full absolute opacity-50 bg-black"
                            ></span>
                        </div>
                        <div
                            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
                            style={{ height: "70px", transform: "translateZ(0)" }}
                        >
                            <svg
                                className="absolute bottom-0 overflow-hidden"
                                preserveAspectRatio="none"
                                version="1.1"
                                viewBox="0 0 2560 100"
                                x="0"
                                y="0"
                            >
                                <polygon
                                    className="text-gray-300 fill-current"
                                    points="2560 0 2560 100 0 100"
                                ></polygon>
                            </svg>
                        </div>
                    </section>
                    <section className="relative py-16 bg-gray-300">
                        <div className="container mx-auto px-4">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-32 shadow-xl rounded-lg -mt-64">
                                <div className="px-6">
                                    <div className=" py-10 border-t border-gray-300 text-center">
                                        <div className="flex flex-wrap justify-center">
                                            <div class="flex flex-wrap container px-4 pb-2">
                                                <div class="w-full pb-2">
                                                    <h1 className="text-4xl font-semibold leading-normal mb-4 text-gray-800 mb-2"> Transferência de Propriedade </h1>
                                                </div>
                                                <div class="w-full md:w-1/2">
                                                    <div class="flex flex-wrap -mx-3">
                                                        <div class="w-full px-3 mb-6 md:mb-0 mt-4">
                                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-name">
                                                                <FontAwesomeIcon icon="fingerprint" /> Hash
                                                                </label>
                                                            <h3 className="text-2xl font-semibold leading-normal mb-2 text-red-800 mb-2">
                                                                {this.state.dadosDocumento.hash}
                                                            </h3>
                                                        </div>
                                                        <div class="w-full px-3 mb-6 md:mb-0 mt-4">
                                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-name">
                                                                <FontAwesomeIcon icon="clock" /> Timestamp do pedido para este registo
                                                                </label>
                                                            <h3 className="text-2xl font-semibold leading-normal mb-2 text-pink-800 mb-2">
                                                                {this.state.timestamp}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="w-full md:w-1/2">
                                                    <div class="flex flex-wrap -mx-3 ">
                                                        <div class="w-full px-3 mb-6 md:mb-0 mt-4">
                                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-name">
                                                                <FontAwesomeIcon icon="info-circle" /> Descrição
                                                                </label>
                                                            <h3 className="text-2xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                                                                {this.state.descricao}
                                                            </h3>
                                                        </div>
                                                        <div class="w-full px-3 mb-6 md:mb-0 mt-4">
                                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-name">
                                                                <FontAwesomeIcon icon="server" /> Registador/Proprietário
                                                                </label>
                                                            <h3 className="text-2xl font-semibold leading-normal mb-2 text-green-800 mb-2">
                                                                {this.state.dono}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <form class="w-full pt-4" onSubmit={this.efetuaTransf}>
                                                    <div class="flex flex-wrap -mx-3 mt-4 mb-4">
                                                        <div class="w-full px-3 mb-6 md:mb-0">
                                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-nome">
                                                                <FontAwesomeIcon icon="address-book" /> Inserir o endereço do Novo Proprietário para este documento:
                                                                </label>
                                                            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-addrNewProp" name='addrNewProp' type="text" placeholder="Address" pattern="[^'\x22]+" onChange={this.myChangeHandler} required />
                                                        </div>
                                                    </div>

                                                    <button class="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4 rounded mb-10" type="submit">
                                                        Efetuar Pedido Transferência
                                                        </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <RodapePerfil />
                </main>
            </>
        )
    }

}

