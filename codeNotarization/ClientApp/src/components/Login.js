import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import Web3 from 'web3'

export class Login extends Component {
    static displayName = Login.name;

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            loading: false
        };
    }

    login = async () => {

        let numAc = -1;
        try {
            numAc = window.web3.eth.getAccounts().length;
        } catch (e) {
        }

        /* ABRIR O METAMASK */
        // Modern DApp Browsers
        if (numAc > 0) {
            return true;
        }
        else if (window.ethereum) {
            await window.ethereum.send('eth_requestAccounts');
            window.web3 = new Web3(window.ethereum);
            return true;
        }
        // Legacy DApp Browsers
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
            return true;
        }
        // Non-DApp Browsers
        else {
            alert('Você tem de instalar o Metamask primeiro!!');
            return false;
        }
    }

    render() {
        return (
            <>
                {(this.login() == true) ?
                    < Redirect push to="/perfil" />
                    : 
                    < Redirect push to="/" />
                }
            </>
            );
    }
}


