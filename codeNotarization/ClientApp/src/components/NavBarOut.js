import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import Web3 from 'web3'
import axios from 'axios';
import { BLOCK_NOTARIZATION_ABI, BLOCK_NOTARIZATION_ADDRESS } from './configWeb3.js'
import logo from './images/logo_blocknotarization.png';
import { REGISTERS_URL } from './api';


export class NavBarOut extends Component {
    static displayName = NavBarOut.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            logged: false,
            account: '',
            dadosConta: []
        };
    }

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
                    //this.props.history.push("/perfil");
                })
                .catch(error => {
                    this.setState({
                        error1:
                            "Houve um problema com o login, verifique as suas senhas."
                    });
                    console.log(error);
                })
        } else {
            alert("The login failed!!!");
        }
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
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
            </>
        );
    }
}
