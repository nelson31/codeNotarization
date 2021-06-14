import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from './images/logo_blocknotarization.png';

import api from './api';
import decode from 'jwt-decode';
import { NavBarIn } from './NavBarIn';
import { RodapePerfil } from './RodapePerfil';


export class Perfil extends Component {
    static displayName = Perfil.name;

    constructor(props) {
        super(props);
        const token = localStorage.getItem('token')

        let loggedIn = true
        if (token == null) {
            loggedIn = false
        }
        this.state = {
            loggedIn,
            firstName: '',
            notificacoes: [],
            dadosPerfil: [],
            consultasAgendadas: [],
            account: '',
            nome: '',
            email: '',
            telemovel: '',
            pais: '',
            cidade: '',
            numDocs: ''
        };
    }

    
    componentDidMount() {
        const token = localStorage.getItem('token');
        var decoded = decode(token);
        // Buscar os dados ao servidor
        api.get(`registers`, {
            params: {
                addr: decoded.Address
            }
        })
            .then(res => {
                this.setState({ account: res.data.address });
                this.setState({ nome: res.data.name });
                this.setState({ email: res.data.email });
                this.setState({ telemovel: res.data.telemovel });
                this.setState({ cidade: res.data.cidade });
                this.setState({ pais: res.data.pais });
                this.setState({ numDocs: res.data.numDocs });
                this.setState({ firstName: res.data.name.trim().split(' ', 1) });
            })
            .catch(error => {
                alert("Erro ao obter os dados do Register!!!");
                this.props.history.push("/perfil");
            })
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

                    </ul>
                    {/* Divider */}
                    <hr className="my-4 md:min-w-full" />
                </nav>
                <main className="relative md:ml-64 profile-page">
                    <NavBarIn />
                    <section className="relative block" style={{ height: "400px" }}>
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
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                                <div className="px-6">
                                    <div className="flex flex-wrap justify-center">
                                        <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center pb-32">
                                            <div className="relative">
                                                <img
                                                    alt="..."
                                                    src={require("./images/profile-placeholder.jpg")}
                                                    className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                                                    style={{ maxWidth: "150px" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center mt-0">
                                        <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                                            Perfil
                                        </h3>
                                    </div>

                                    <div className="mt-10 py-10 border-t border-gray-300 text-center">
                                        <div className="flex flex-wrap justify-center">
                                            <div className="w-full lg:w-9/12 px-4">
                                                <p className="mb-4 text-xl text-bold leading-relaxed text-gray-800">
                                                    <b className="mb-4 text-xl text-bold leading-relaxed text-gray-900"> Nome:</b> {this.state.nome}
                                                </p>
                                                <p className="mb-4 text-xl text-bold leading-relaxed text-gray-800">
                                                    <b className="mb-4 text-xl text-bold leading-relaxed text-gray-900"> Endereço da Conta:</b> {this.state.account}
                                                </p>
                                                <p className="mb-4 text-xl text-bold leading-relaxed text-gray-800">
                                                    <b className="mb-4 text-xl text-bold leading-relaxed text-gray-900"> Email:</b> {this.state.email}
                                                </p>
                                                <p className="mb-4 text-xl text-bold leading-relaxed text-gray-800">
                                                    <b className="mb-4 text-xl text-bold leading-relaxed text-gray-900"> Telemóvel:</b> {this.state.telemovel}
                                                </p>
                                                <p className="mb-4 text-xl text-bold leading-relaxed text-gray-800">
                                                    <b className="mb-4 text-xl text-bold leading-relaxed text-gray-900"> Número de Documentos Registados:</b> {this.state.numDocs}
                                                </p>
                                                <p className="mb-4 text-xl text-bold leading-relaxed text-gray-800">
                                                    <b className="mb-4 text-xl text-bold leading-relaxed text-gray-900"> País e Cidade:</b> {this.state.pais} - {this.state.cidade}
                                                </p>
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