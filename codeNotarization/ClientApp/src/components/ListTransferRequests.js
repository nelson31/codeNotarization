import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import decode from 'jwt-decode';
import Web3 from 'web3'
import sha256 from 'crypto-js/sha256';
import axios from 'axios';
import Base64 from 'crypto-js/enc-base64';
import { NavBarIn } from './NavBarIn';
import { RodapePerfil } from './RodapePerfil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from './images/logo_blocknotarization.png';
import { DOCUMENTS_URL } from './api';
import Registry from '../abis/Registry.json'

import api from './api';

export class ListTransferRequests extends Component {
    static displayName = ListTransferRequests.name;

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            account: '',
            nome: '',
            email: '',
            telemovel: '',
            pais: '',
            cidade: '',
            numDocs: '',
            listaTrans: [],
            addrOwner: '',
            metadados: [],
            transfered: false
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        var decoded = decode(token);
        this.setState({ account: decoded.Address });
        this.setState({ firstName: decoded.Nome.trim().split(' ', 1) });

        // Buscar a lista de documentos registados de um dado register
        api.get(`registers/transferrequests`, {
            params: {
                addr: decoded.Address
            }
        })
            .then(res => {
                console.log(res);
                this.setState({ listaTrans: res.data.reverse() });
            })
            .catch(error => {
                alert("ERROR! " + error);
                console.log(error);
            });
    }

    aceitar = async (event) => {

        let hashDoc = event.target.dataset.id;

        event.preventDefault();

        // Buscar os dados do documento
        await axios.get(`${DOCUMENTS_URL}`, {
            params: {
                hash: hashDoc
            }
        })
            .then(res => {
                console.log(res);
                var i = 0;
                while (i < res.data.metadata.length) {
                    if (res.data.metadata[i].nome == "Proprietario") {
                        res.data.metadata[i].atributo = this.state.nome;
                    }
                    i++;
                }
                this.setState({ addrOwner: res.data.addrOwner });
                this.setState({ metadados: res.data.metadata });
            })
            .catch(error => {
                alert("ERROR! " + error);
            });

        const hashDigest = sha256(JSON.stringify(this.state.metadados));
        const hashMetadata = Base64.stringify(hashDigest);

        try {
            // Efetua a transferencia de propriedade na BlockChain
            const web3 = window.web3
            const networkId = await web3.eth.net.getId()
            const networkData = Registry.networks[networkId]
            if (networkData) {
                // Load account
                const registry = new web3.eth.Contract(Registry.abi, networkData.address)
                await registry.methods.transferirPropriedade(hashMetadata, hashDoc).send({ from: this.state.account })
                    .once('receipt', (receipt) => {
                        this.setState({ transfered: true })
                    })

                // Efetuar transferencia na DB
                if (this.state.transfered == true) {
                    await api.post(`registers/aceitatransferrequest`, {
                        HashDoc: hashDoc,
                        AddrNewProp: this.state.account,
                        AddrRequester: this.state.addrOwner,
                        HashMetadata: hashMetadata
                    })
                        .then(response => {
                            alert("Transferência de propriedade efetuada com sucesso!!!");
                            this.props.history.push("/perfil");
                        })
                        .catch(error => {
                            alert("Não foi possível registar a transferência na base de dados!!!");
                            this.props.history.push("/perfil");
                        })
                } else {
                    alert("Não foi possível registar a transferência na blockchain!!!")
                    this.props.history.push("/perfil");
                }
            } else {
                window.alert('Marketplace contract not deployed to detected network.')
            }

        } catch (error) {
            alert("Argumento inválido!")
        }

    }

    rejeitar = async (event) => {

        let hashDoc = event.target.dataset.id;

        event.preventDefault();

        // Buscar os dados do documento
        await axios.get(`${DOCUMENTS_URL}`, {
            params: {
                hash: hashDoc
            }
        })
            .then(res => {
                console.log(res);
                this.setState({ addrOwner: res.data.addrOwner });
            })
            .catch(error => {
                alert("ERROR! " + error);
            });

        // Rejeitar o pedido
        await api.post(`registers/rejeitatransferrequest`, {
            HashDoc: hashDoc,
            AddrNewProp: this.state.account,
            AddrRequester: this.state.addrOwner
        })
            .then(response => {
                alert("Pedido de transferência de propriedade rejeitado!!!");
                this.props.history.push("/perfil");
            })
            .catch(error => {
                alert("Erro ao rejeitar o pedido de transferência de propriedade!!!");
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
                                                    Pedidos de Transferência de documentos
                                                </h1>
                                                <div>
                                                    <table class="border-collapse w-full mb-32">
                                                        <thead>
                                                            <tr>
                                                                <th class="p-3 font-bold uppercase bg-gray-200 text-gray-700 border border-gray-300 hidden lg:table-cell">Hash</th>
                                                                <th class="p-3 font-bold uppercase bg-gray-200 text-gray-700 border border-gray-300 hidden lg:table-cell">Descricao</th>
                                                                <th class="p-3 font-bold uppercase bg-gray-200 text-gray-700 border border-gray-300 hidden lg:table-cell">Proprietário</th>
                                                                <th class="p-3 font-bold uppercase bg-gray-200 text-gray-700 border-top border-gray-300 hidden lg:table-cell"></th>
                                                                <th class="p-3 font-bold uppercase bg-gray-200 text-gray-700 border-right border-top border-gray-300 hidden lg:table-cell"></th>
                                                            </tr>
                                                        </thead>
                                                        {this.state.listaTrans.map(pedido =>
                                                            <tr class="border border-gray-300">
                                                                <td class="p-3 font-semibold border-top border-gray-300 hidden lg:table-cell">{pedido.hashDoc}</td>
                                                                <td class="p-3 font-semibold border-top border-gray-300 hidden lg:table-cell">{pedido.descricao}</td>
                                                                <td class="p-3 font-semibold border-top border-gray-300 hidden lg:table-cell">{pedido.requester}</td>
                                                                <td class="p-3 font-semibold border-top border-gray-300 hidden lg:table-cell"> <button class="hover:bg-green-500 bg-green-400 text-blue-dark font-semibold text-white py-2 px-3 border rounded" key={pedido.hashDoc} data-id={pedido.hashDoc} onClick={this.aceitar}> Aceitar </button> </td>
                                                                <td class="p-3 font-semibold border-top border-gray-300 hidden lg:table-cell"><button class="hover:bg-red-500 bg-red-400 text-blue-dark font-semibold text-white py-2 px-3 border rounded" key={pedido.hashDoc} data-id={pedido.hashDoc} onClick={this.rejeitar}> Rejeitar </button> </td>
                                                            </tr>)
                                                        }
                                                    </table>
                                                </div>
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


