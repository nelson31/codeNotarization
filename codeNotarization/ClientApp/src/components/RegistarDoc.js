﻿import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import decode from 'jwt-decode';
import Web3 from 'web3'
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

import { NavBarIn } from './NavBarIn';
import { RodapePerfil } from './RodapePerfil';
import ListItem from './ListItem'
import NewTaskInput from './NewTaskInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from './images/logo_blocknotarization.png';
import Registry from '../abis/Registry.json'

import api from './api';

export class RegistarDoc extends Component {
    static displayName = RegistarDoc.name;

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            nome: '',
            account: '',
            metadados: [],
            descricao: '',
            file: '',
            registed: false
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        var decoded = decode(token);
        this.setState({ account: decoded.Address });
        this.setState({ nome: decoded.Nome });
        this.setState({ firstName: decoded.Nome.trim().split(' ', 1) });
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async componentWillMount() {
        await this.loadWeb3()
    }

    // Submeter o registo
    submitNew = async (event) => {
        event.preventDefault();

        let nam = event.target.name;
        if (nam == "registar") {

            const itensCopy = Array.from(this.state.metadados);
            const d = new Date(Date.now());
            const date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " [UTC]";
            itensCopy.push({ nome: "Timestamp", atributo: date });
            itensCopy.push({ nome: "Descricao", atributo: this.state.descricao });
            itensCopy.push({ nome: "Proprietario", atributo: this.state.nome });
            this.setState({ metadados: itensCopy });

            const hashDigest = sha256(JSON.stringify(this.state.metadados));
            const hashMetadata = Base64.stringify(hashDigest);

            const web3 = window.web3
            const networkId = await web3.eth.net.getId()
            const networkData = Registry.networks[networkId]
            if (networkData) {
                // Load account
                const registry = new web3.eth.Contract(Registry.abi, networkData.address)
                await registry.methods.adicionarNotarization(hashMetadata, this.state.file).send({ from: this.state.account })
                    .once('receipt', (receipt) => {
                        this.setState({ registed: true })
                    })

                if (this.state.registed == true) {
                    await api.post(`documents`, {
                        AddrOwner: this.state.account,
                        Hash: this.state.file,
                        HashMetadata: hashMetadata,
                        Metadata: this.state.metadados
                    })
                        .then(response => {
                            alert("Documento registado com sucesso!!!");
                            this.props.history.push("/perfil");
                        })
                        .catch(error => {
                            alert("Erro ao registar o documento na base de dados!!!");
                            this.props.history.push("/perfil");
                        })
                } else {
                    alert("Não foi possível registar na blockchain!!!")
                    this.props.history.push("/perfil");
                }
            } else {
                window.alert('Marketplace contract not deployed to detected network.')
            }
        }
    }

    onSubmitHandler = (e) => {
        e.preventDefault()
    }

    showFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = (e.target.result)
            const hashDigest = sha256(text);
            this.setState({ file: Base64.stringify(hashDigest) })
        };
        reader.readAsText(e.target.files[0])
    }

    addNewTask = (task, task1) => {
        const itensCopy = Array.from(this.state.metadados);
        itensCopy.push({ nome: task, atributo: task1 });
        this.setState({ metadados: itensCopy });
    }

    updateTask = ({ target }, index) => {
        const itensCopy = Array.from(this.state.metadados);
        itensCopy.splice(index, 1, { nome: target.value, atributo: target.value1 });
        this.setState({ metadados: itensCopy });
    }

    deleteTask = (index) => {
        const itensCopy = Array.from(this.state.metadados);
        itensCopy.splice(index, 1);
        this.setState({ metadados: itensCopy });
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
                                            <div className="w-full px-4">
                                                <h1 className="text-4xl font-semibold leading-normal mb-4 text-gray-800 mb-2">
                                                    Registar Novo Documento
                                                </h1>

                                                <form class="w-full" onSubmit={this.submitNew} name="registar">
                                                    <div class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                                                        <input id="button" type="file" name='file' class="text-2xl mt-2 rounded-sm px-6 py-2 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none" placeholder="Insira o ficheiro" onChange={(e) => this.showFile(e)} required />
                                                    </div>
                                                    <div class="px-3 mb-6 md:mb-0 mt-4">
                                                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-descricao" name='descricao' type="text" onChange={this.myChangeHandler} pattern="[^'\x22]+" placeholder="Descrição do ficheiro" required />
                                                    </div>
                                                        <div>
                                                        <div className="text-2xl font-semibold leading-normal mb-4 text-gray-800 mb-2">
                                                            <br />
                                                            <h3> Adicionar Metadados </h3>
                                                        </div>
                                                            <div>
                                                            <div className="w-full font-semibold leading-normal text-gray-800">
                                                                <NewTaskInput onSubmit={this.addNewTask} />
                                                                <form onSubmit={this.onSubmitHandler} name="adicionar">
                                                                    {this.state.metadados.map(({ nome, atributo }, index) => (
                                                                        <ListItem
                                                                            value={nome}
                                                                            value1={atributo}
                                                                            onChange={(event) => this.updateTask(event, index)}
                                                                            onDelete={() => this.deleteTask(index)}
                                                                        />
                                                                    ))}
                                                                    <br />
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button class="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4 rounded mb-10" type="submit">
                                                        Registar Documento
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