import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { NavBarOut } from './NavBarOut';
import { CONTAS_URL } from './api';
import { Rodape } from './Rodape';

const InitialState = {
    hash: 'sfvdgbffsfdfggfddfgff234e',
    timestamp: '2021-05-30 11:19:20 [UTC]',
    descricao: 'Artigo de opinião sobre BlockChain',
    dono: 'Universidade do Minho',
    metadados: [],
    numPagina: 0,
    tamanhoPag: 9
};

export class InfoDocument extends Component {
    static displayName = InfoDocument.name;

    constructor(props) {
        super(props);
        this.state = InitialState;
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

    // Enviar um mail e receber um codigo
    submitNew = (event) => {
        event.preventDefault();

        axios.get(`${CONTAS_URL}/email`, {
            params: {
                Email: this.state.email
            }
        })
            .then(conta => {
                this.setState({ codR: conta.data });
                (this.state.isRegistarOn) ? this.setState({ isRegistarOn: false }) : this.setState({ isRegistarOn: true });
            })
            .catch(err => {
                console.log(err)
                alert("Email já existente!")
            });
    }

    // Submeter um novo usuario, caso o codigo esteja bem
    handleCheck = (event) => {
        event.preventDefault();

        let codReg = this.state.codR;
        let codIns = this.state.codI;

        if ((parseInt(codReg.toString()) - parseInt(codIns.toString())) == 0) {
            axios.post(`${CONTAS_URL}`, {
                type: this.state.type,
                Nome: this.state.name,
                Email: this.state.email,
                Password: this.state.password,
                DataNascimento: this.state.dataNascimento,
                Morada: this.state.morada,
                Nif: this.state.nif,
                Codigo_postal: this.state.codigo_postal,
                Contactos: this.state.contactos,
                Localidade: this.state.localidade
            })
                .then(conta => {
                    //this.props.addUserToState(conta);
                    //this.props.toggle();
                    alert("Nova Conta Registada");
                })
                .catch(err => console.log(err));
        } else { alert("Código Inserido Inválido"); }
        this.setState(InitialState);
        (this.state.isRegistarOn) ? this.setState({ isRegistarOn: false }) : this.setState({ isRegistarOn: true });
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
                <NavBarOut />
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
                                                {this.state.hash}
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
