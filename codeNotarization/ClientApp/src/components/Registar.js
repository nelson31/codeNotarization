import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Web3 from 'web3'
import { Link } from 'react-router-dom';

import { NavBarOut } from './NavBarOut';
import { REGISTERS_URL } from './api';
import logo from './images/logo_blocknotarization.png';
import { Rodape } from './Rodape';
import Registry from '../abis/Registry.json'

export class Registar extends Component {
    static displayName = Registar.name;

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            notarizationsCount: 0,
            notarizations: [],
            loading: true,
            logged: false,
            dadosConta: [],
            nome: '',
            email: '',
            cidade: '',
            pais: '',
            telemovel: '',
            registed: false
        };
        this.getAccount();
    }

    getAccount = async () => {
        try {
            const web3 = new Web3(Web3.givenProvider);
            const accounts = await web3.eth.getAccounts();
            this.setState({ account: accounts[0] });
        } catch (error) {
            this.props.history.push("/");
        }
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

    // Registar novo utilizador
    submitNew = async (event) => {
        event.preventDefault();

        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = Registry.networks[networkId]
        // Load account
        const registry = new web3.eth.Contract(Registry.abi, networkData.address)
        await registry.methods.adicionarRegister(this.state.account).send({ from: this.state.account })
            .once('receipt', (receipt) => {
                this.setState({ registed: true })
            })

        if (this.state.registed == true) {
            await axios.post(`${REGISTERS_URL}`, {
                Address: this.state.account,
                Name: this.state.nome,
                Email: this.state.email,
                Telemovel: this.state.telemovel,
                Pais: this.state.pais,
                Cidade: this.state.cidade
            })
                .then(response => {
                    //this.props.addUserToState(conta);
                    //this.props.toggle();
                    alert("Nova Conta Registada");
                    this.setState({ dadosConta: response.data });
                    localStorage.clear();
                    localStorage.setItem("token", this.state.dadosConta.token);
                    this.props.history.push("/perfil");
                })
                .catch(err => {
                    this.props.history.push("/");
                });
        } else {
            alert("Erro ao registar na blockchain!!")
            this.props.history.push("/");
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
                        <div class="flex md:flex-row-reverse flex-wrap container mx-auto px-4 pt-32 mb-auto">
                        <form class="w-full" onSubmit={this.submitNew}>
                            <h1 className="text-black font-semibold text-5xl">
                                  Registar
                            </h1>
                            <div class="flex flex-wrap -mx-3 mt-4">
                                <div class="w-full px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-nome">
                                        Nome
                                    </label>
                                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-nome" name='nome' type="text" placeholder="Nome completo" onChange={this.myChangeHandler} required />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 ">
                                <div class="w-full px-3">
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email">
                                        Email
                                        </label>
                                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email" name='email' type="email" placeholder="exemplo@email.com" onChange={this.myChangeHandler} required />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 ">
                                <div class="w-full px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-telemovel">
                                        Telemóvel
                                        </label>
                                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-telemovel" name='telemovel' type="tel" minlength="9" onChange={this.myChangeHandler} placeholder="9*********" required />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 ">
                                <div class="w-full px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-pais">
                                        País
                                        </label>
                                        <select class="block tracking-wide bg-gray-200 text-gray-700 border border-gray-200 py-3 px-3 mb-3 mt-2 focus:outline-none focus:bg-white focus:border-gray-500" id="grid-pais" type="text" name='pais' onChange={this.myChangeHandler} required>
                                            <option className="block uppercase text-gray-700 text-l font-semibold mb-2" value="Portugal" autofocus>Selecione uma opção</option>
                                            <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Portugal">Portugal</option>
                                        </select>
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-3">
                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-cidade">
                                        Cidade:
                                                    </label>
                                    <select class="block tracking-wide bg-gray-200 text-gray-700 border border-gray-200 py-3 px-3 mb-3 mt-2 focus:outline-none focus:bg-white focus:border-gray-500" id="grid-cidade" type="text" name='cidade' onChange={this.myChangeHandler} required>
                                        <option className="block uppercase text-gray-700 text-l font-semibold mb-2" value="" disabled>Selecione uma opção</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Aveiro">Aveiro</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Beja">Beja</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Braga">Braga</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Bragança">Bragança</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Castelo Branco">Castelo Branco</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Coimbra">Coimbra</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Évora">Évora</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Faro">Faro</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Guarda">Guarda</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Leiria">Leiria</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Lisboa">Lisboa</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Portalegre">Portalegre</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Porto">Porto</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Santarém">Santarém</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Setúbal">Setúbal</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Viana do Castelo">Viana do Castelo</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Vila Real">Vila Real</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Viseu">Viseu</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Angra do Heroísmo">Angra do Heroísmo</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Funchal">Funchal</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Horta">Horta</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Lamego">Lamego</option>
                                        <option className="block uppercase text-gray-700 text-l font-bold mb-2" value="Ponta Delgada">Ponta Delgada</option>
                                    </select>
                                    </div>
                                </div>

                            <button class="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4 rounded mb-10" type="submit">
                                Registar
                                </button>
                            </form>
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
