import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

import { Rodape } from './Rodape';
import LogoS from './images/logo.png';
import { NavBarOut } from './NavBarOut';

export class Privacy extends Component {
    static displayName = Privacy.name;

    render() {
        return (
            <>
                <NavBarOut />
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
                            <h1 className="text-4xl font-semibold leading-normal mb-4 text-gray-800 mb-2"> Privacy </h1>
                            <ol class="list-decimal">
                                <li className="text-black font-semibold text-5xl">
                                    <h3 className="text-black font-semibold text-5xl"> Questões</h3>
                                    <p className="mt-4 text-lg text-black-300">Caso tenha qualquer questão relacionada com o tratamento dos seus dados pessoais
                                            e com o exercício dos direitos que lhe são conferidos pela legislação aplicável
                                            contacte-nos através dos seguintes contactos:
                                </p>
                                    <p className="mt-4 text-lg text-black-300">E-mail 1: <a className="text-blue-300" href="mailto:a84727@alunos.uminho.pt">a84727@alunos.uminho.pt</a></p>
                                    <p className="mt-4 text-lg text-black-300">E-mail 2: <a className="text-blue-300" href="mailto:a83819@alunos.uminho.pt">a83819@alunos.uminho.pt</a></p>
                                </li>

                                <li className="text-black font-semibold text-5xl">
                                    <h3 className="text-black font-semibold text-5xl"> O que são dados pessoais?</h3>
                                    <p className="mt-4 text-lg text-black-300">Dados pessoais são qualquer informação, de qualquer natureza e independentemente
                                       do respetivo suporte, incluindo som e imagem, relativa a uma pessoa singular identificada
                                   ou identificável.</p>
                                    <p className="mt-4 text-lg text-black-300"> É considerada identificável a pessoa singular que possa ser identificada,
                                        direta ou indiretamente, designadamente por referência a um nome, número de identificação,
                                        dados de localização, identificadores por via eletrónica ou a um ou mais elementos específicos
                                        da sua identidade física, fisiológica, genética, mental, económica, cultural ou social.
                                </p>
                                </li>

                                <li className="text-black font-semibold text-5xl">
                                    <h3 className="text-black font-semibold text-5xl"> No que consiste o tratamento de dados pessoais?</h3>
                                    <p className="mt-4 text-lg text-black-300"> O tratamento de dados pessoais consiste numa operação ou conjunto
                                       de operações efetuadas sobre dados pessoais ou conjuntos de dados pessoais,
                                       através de meios automatizados, ou não, nomeadamente a recolha, o registo,
                                       a organização, a estruturação, a conservação, a adaptação, a recuperação,
                                       a consulta, a utilização, a divulgação, difusão, comparação, interconexão,
                                   a limitação, o apagamento ou a destruição. </p>
                                </li>
                            </ol>
                        </div>
                    </section>
                </main>
                <Rodape />
            </>
        );
    }
}
