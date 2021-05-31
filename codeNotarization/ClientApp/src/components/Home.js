import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3'
import axios from 'axios';
import { BLOCK_NOTARIZATION_ABI, BLOCK_NOTARIZATION_ADDRESS } from './configWeb3.js'
import { REGISTERS_URL } from './api';

import LogoS from './images/logo.png';
import logo from './images/logo_blocknotarization.png';
import { Rodape } from './Rodape.js';
import { NavBarOut } from './NavBarOut.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export class Home extends Component {
    static displayName = Home.name;

    componentWillMount() {
        this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const blocknotarization = new web3.eth.Contract(BLOCK_NOTARIZATION_ABI, BLOCK_NOTARIZATION_ADDRESS)
        this.setState({ blocknotarization })
        const notarizationsCount = await blocknotarization.methods.notarizationsCount().call()
        this.setState({ notarizationsCount })
        for (var i = 1; i <= notarizationsCount; i++) {
            const task = await blocknotarization.methods.notarizations(i).call()
            this.setState({
                notarizations: [...this.state.notarizations, task]
            })
        }
        this.setState({ loading: false })
    }

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            notarizationsCount: 0,
            notarizations: [],
            loading: true,
            logged: false,
            dadosConta: []
        };
    }

    mySubmitHandler = (event) => {
        event.preventDefault();


        this.props.history.push("/info");
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
                    alert("Successfully logged in!!!");
                    console.log(response);
                    this.setState({ dadosConta: response.data });
                    localStorage.clear();
                    localStorage.setItem("token", this.state.dadosConta.token);
                    this.props.history.push("/perfil");
                })
                .catch(error => {
                    alert("Your address isn't valid!!!");
                    this.setState({
                        error1:
                            "Houve um problema com o login, verifique as suas senhas."
                    });
                    console.log(error);
                })
        }
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    myFunction = () => {
        var x = document.getElementById("myInput");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
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
                    <div className="relative pt-16 pb-32 flex content-center items-center justify-center"
                        style={{
                            minHeight: "60vh"
                        }}>
                        <div className="absolute top-0 w-full h-full bg-center bg-cover"
                            style={{
                                backgroundImage: "url('https://www.autoescolaonline.net/wp-content/uploads/2018/11/post-desburocratizacao.jpg')"
                            }}>
                            <span id="blackOverlay" className="w-full h-full absolute opacity-75 bg-black"></span>
                        </div>
                        <div className="container relative mx-auto">
                            <div className="items-center flex flex-wrap">
                                <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                                    <div className="pr-12">
                                        <img
                                            alt="..."
                                            src={LogoS}
                                            className=" rounded-full mx-auto"
                                            style={{ maxWidth: "60px" }}
                                        />
                                        <h1 className="text-white font-semibold text-5xl">
                                            BlockNotarization
                                        </h1>
                                        <p className="mt-4 text-lg text-gray-300">
                                            Seja bem vindo à nossa plataforma de notarização de documentos usando a tecnologia BlockChain!
                                            Use o Metamask para efetuar login na aplicação e começe já a notarizar os seus documentos!
                                            Ou então verifique a integridade de documentos sem necessidade de login na aplicação!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
                            style={{ height: "70px", transform: "translateZ(0)" }}
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
                                    className="text-gray-300 fill-current"
                                    points="2560 0 2560 100 0 100"
                                ></polygon>
                            </svg>
                        </div>
                    </div>

                    <section className="pb-20 bg-gray-300 -mt-24">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-wrap">
                                <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                        <div className="px-4 py-5 flex-auto">
                                            <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-500">
                                                <FontAwesomeIcon icon="file-contract" />
                                            </div>
                                            <h6 className="text-xl font-semibold">Os Nossos Serviços</h6>
                                            <p className="mt-2 mb-4 text-gray-600">
                                                Notarização de documentos, nomeadamente provas relacionadas com a 
                                                existência ou propriedade de um documento, bem como transferências de propriedade.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-4/12 px-4 text-center">
                                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                        <div className="px-4 py-5 flex-auto">
                                            <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                                                <FontAwesomeIcon icon="users" />
                                            </div>
                                            <h6 className="text-xl font-semibold">
                                                Quem Somos?
                                            </h6>
                                            <p className="mt-2 mb-4 text-gray-600">
                                                Somos uma plataforma de Notarização de documentos tendo por base a 
                                                tecnologia Blockchain que foi desenvolvida na Universidade do Minho 
                                                por um grupo de 2 estudantes de Engenharia Informática.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                        <div className="px-4 py-5 flex-auto">
                                            <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-500">
                                                <FontAwesomeIcon icon="fingerprint" />
                                            </div>
                                            <h6 className="text-xl font-semibold">
                                                O que fazemos?
                                            </h6>
                                            <p className="mt-2 mb-4 text-gray-600">
                                                O nosso objetivo é garantir que alguém que queira verificar a 
                                                autenticidade de um documento ou então autenticar os seus próprios
                                                documentos tenha uma forma segura e rápida de o fazer.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full px-4 mr-auto ml-auto my-6">
                                <div className="text-gray-600 p-8 text-center inline-flex items-center justify-center w-20 h-20 mb-8 shadow-lg rounded-full bg-gray-100">
                                    <FontAwesomeIcon icon="file-signature" />
                                </div>
                                <h3 className="text-3xl mb-2 font-bold items-center justify-center leading-normal">
                                    Notarize e verifique a autenticidade de um documento com poucos cliques, usando BlockNotarization.
                                </h3>
                                <form onSubmit={this.mySubmitHandler}>
                                    <div class="flex flex-wrap -mx-3 my-3 ">
                                        <div class="w-full px-3 mb-6 md:mb-0">
                                            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-name" name='name' type="text" placeholder="Insira aqui o Hash do documento a procurar..." onChange={this.myChangeHandler} required />
                                        </div>
                                        <div className="text-center mt-6">
                                            <button
                                                class="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4 rounded mb-10 mx-3 my-3"
                                                type="submit"
                                                style={{ transition: "all .15s ease" }}
                                            >
                                                    Verificar
                                            </button>
                                        </div>
                                    </div>
                                </form>
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
