import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Web3 from 'web3'
import { Link } from 'react-router-dom';

import { NavBarOut } from './NavBarOut';
import { REGISTERS_URL, DOCUMENTS_URL } from './api';
import logo from './images/logo_blocknotarization.png';
import { Rodape } from './Rodape';

export class InfoDocument extends Component {
    static displayName = InfoDocument.name;

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            notarizationsCount: 0,
            notarizations: [],
            loading: true,
            logged: false,
            dadosDocumento: [],
            dadosConta: [],
            hash: 'sfvdgbffsfdfggfddfgff234e',
            timestamp: '2021-05-30 11:19:20 [UTC]',
            descricao: 'Artigo de opinião sobre BlockChain',
            dono: 'Universidade do Minho',
            metadados: [],
            numPagina: 0,
            tamanhoPag: 9
        };
    }

    componentDidMount() {

        const hashDoc = localStorage.getItem('hash');
        this.setState({ hash: hashDoc });
        localStorage.clear();

        axios.get(`${DOCUMENTS_URL}/${hashDoc}`)
            .then(res => {
                console.log(res);
                this.setState({ dadosDocumento: res.data });
            })
            .catch(error => {
                alert("ERROR! " + error);
                console.log(error);
            });
    }

    mySubmitHandler = (event) => {
        event.preventDefault();
        alert("Falta definir as acoes para os eventos");
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    // LOGIN com o Metamask
    login = async (event) => {

        event.preventDefault();
        /* ABRIR O METAMASK */
        // Modern DApp Browsers
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            try {
                // Request account access if needed
                await window.ethereum.enable();
                this.setState({ logged: true });
                const accounts = await window.web3.eth.getAccounts()
                this.setState({ account: accounts[0] })
                // Acccounts now exposed
                //web3.eth.sendTransaction({/* ... */ });
            } catch (error) {
                // User denied account access...
                alert(error);
                this.setState({ logged: false });
            }
        }
        // Legacy DApp Browsers
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
            this.setState({ logged: true });
        }
        // Non-DApp Browsers
        else {
            alert('Você tem de instalar o Metamask primeiro!!');
            this.setState({ logged: false });
        }

        // Comunicar ao backend
        if (this.state.logged == true) {
            axios.post(`${REGISTERS_URL}/login`, {
                Address: this.state.account,
                Token: null,
                Name: null,
                Email: null,
                Telemovel: null,
                Pais: null,
                Cidade: null
            })
                .then(response => {
                    alert("Login efetuado com sucesso!!!");
                    console.log(response);
                    this.setState({ dadosConta: response.data });
                    localStorage.clear();
                    localStorage.setItem("token", this.state.dadosConta.token);
                    this.props.history.push("/perfil");
                })
                .catch(error => {
                    alert("O seu endereço não é válido, registe-se primeiro!!");
                    this.setState({
                        error1:
                            "Houve um problema com o login, verifique as suas senhas."
                    });
                    this.props.history.push("/registar");
                })
        }
    }

    // Submeter um novo usuario, caso o codigo esteja bem
    handleCheck = (event) => {
        event.preventDefault();

        
    }

    nextPage = () => {
        var num = this.state.numPagina
        if ((this.state.numPagina + 1) < this.state.metadados.length / this.state.tamanhoPag) {
            this.setState({ numPagina: num + 1 })
        }
    }

    previousPage = () => {
        var num = this.state.numPagina
        if (this.state.numPagina != 0) {
            this.setState({ numPagina: num - 1 })
        }
    }

    render() {
        return (
            <>
                <nav
                    className="top-0 absolute z-50 w-full items-center justify-between px-2 py-3 navbar-expand-sm"
                >
                    <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                            <Link tag={Link} className="links" to="/">
                                <a
                                    className="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase"
                                >
                                    <img className="text-gray-800 active:bg-gray-100 text-xs font-bold uppercase px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3"
                                        width={200} src={logo} />
                                </a>
                            </Link>
                        </div>
                        <div
                            className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start"
                            id="example-navbar-warning"
                        >

                            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                                <li className="flex items-center">
                                    <form onSubmit={this.login}>
                                        <button
                                            className="bg-white text-gray-800 active:bg-gray-100 text-s font-bold uppercase px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-8"
                                            type="submit"
                                            style={{ transition: "all .15s ease" }}
                                        >
                                            <i className="fas fa-arrow-alt-circle-down"></i> Login
                                            </button>
                                    </form>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <main>
                    <section class="pb-20 bg-gray-300">
                        <div class="flex flex-wrap container px-4 pt-32 pb-1">
                            <div class="w-full">
                                <h1 className="text-5xl font-semibold leading-normal mb-2 text-gray-800 mb-2"> Registo do Documento </h1>
                            </div>
                                <div class="w-full md:w-1/2">
                                    <div class="flex flex-wrap -mx-3">
                                        <div class="w-full px-3 mb-6 md:mb-0 mt-4">
                                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-name">
                                            <FontAwesomeIcon icon="fingerprint" /> Hash
                                            </label>
                                        <h3 className="text-3xl font-semibold leading-normal mb-2 text-red-800 mb-2">
                                            {this.state.dadosDocumento.hash}
                                            </h3>
                                        </div>
                                        <div class="w-full px-3 mb-6 md:mb-0 mt-4">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-name">
                                                <FontAwesomeIcon icon="clock" /> Timestamp do pedido para este registo
                                                </label>
                                            <h3 className="text-3xl font-semibold leading-normal mb-2 text-pink-800 mb-2">
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
                                        <h3 className="text-3xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                                            {this.state.descricao}
                                        </h3>
                                    </div>
                                    <div class="w-full px-3 mb-6 md:mb-0 mt-4">
                                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-name">
                                            <FontAwesomeIcon icon="server" /> Registador/Proprietário
                                            </label>
                                        <h3 className="text-3xl font-semibold leading-normal mb-2 text-green-800 mb-2">
                                            {this.state.dono}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="container px-4 pt-16 pb-1">
                        <div>
                            <div class="w-full">
                                    <h1 className="text-3xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                                        <FontAwesomeIcon icon="plus-circle" /> Informação adicional sobre o registo (Metadados)
                                    </h1>
                            </div>
                            <table class="border-collapse w-full mr-4">
                                <thead>
                                    <tr>
                                        <th class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Tipo de metadado</th>
                                        <th class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Valor</th>
                                    </tr>
                                </thead>
                                {this.state.metadados.slice(this.state.numPagina * this.state.tamanhoPag, this.state.numPagina * this.state.tamanhoPag + this.state.tamanhoPag - 1).map(metadado =>
                                    <tr>
                                        <td class="p-3 font-semibold border-top border-gray-300 hidden lg:table-cell">{metadado.desc}</td>
                                        <td class="p-3 font-semibold border-top border-gray-300 hidden lg:table-cell">{metadado.valor}</td>
                                    </tr>)}
                            </table>
                        </div>
                        <div class="relative mx-auto h-15 w-50 pb-4 pt-8 -mr-8">
                            <div class="absolute down-0 left-0 h-8 w-30">
                                < button className="bg-blue-500 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none mb-0"
                                    type="button"
                                    onClick={this.previousPage}> Previous
                                    </button>
                            </div>
                            <div class="absolute down-0 right-0 h-8 w-30">
                                < button className="bg-blue-500 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none mb-0"
                                    type="button"
                                    onClick={this.nextPage}> Next </button>
                            </div>
                            </div>
                        </div>
                    </section>
                    <section className="pb-20 relative block bg-gray-900">
                        <div
                            className="bottom-0 top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
                            style={{ height: "80px", transform: "translateZ(0)" }}
                        >
                            <svg
                                className="absolute bottom-0 overflow-hidden"
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                                version="1.1"
                                viewBox="0 0 2560 100"
                                x="0"
                                y="0"
                            >
                                <polygon
                                    className="text-gray-900 fill-current"
                                    points="2560 0 2560 100 0 100"
                                ></polygon>
                            </svg>
                        </div>

                    </section>
                </main>
                <Rodape />
            </>
        );
    }
}
