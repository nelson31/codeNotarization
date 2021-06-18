import React, { Component } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import decode from 'jwt-decode';
import Logo from './images/logo_blocknotarization.png';
import api from './api';
import axios from 'axios';
import { DOCUMENTS_URL } from './api';

const borderColor = 'black'

const styles = StyleSheet.create({
    image: { textAlign: 'center', marginVertical: 4, marginHorizontal: 10, top: 30 },
    image1: { textAlign: 'center', top: 30, width: 150, height: 150, left: 180 },
    textImage: { fontSize: 60, textAlign: 'left' },
    certificado: { fontSize: 20, fontFamily: 'Times-Bold', left: 280, top: -50 },
    page: { padding: 45 },
    box: { width: '100%', marginBottom: 30 },
    register: { width: '100%', marginBottom: 30, borderRadius: 5, top: -100 },
    info: { fontSize: 16, fontFamily: 'Times-Bold', textAlign: 'justify', paddingTop: 30, color: 'black' },
    valor: { fontSize: 16, textAlign: 'right', color: 'black' },
    descricaoT: { fontSize: 20, fontFamily: 'Times-Bold', paddingTop: 30, paddingBottom: 20, textAlign: 'center', color: 'black', left: 20 },
    descricao: { fontSize: 20, fontFamily: 'Times-Bold', top: -90, textAlign: 'center', color: 'black', left: 20 },
    pageNumbers: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    },
    container: {
        flexDirection: 'row',
        borderTopColor: borderColor,
        borderTopWidth: 1,
        borderDownColor: borderColor,
        borderDownWidth: 1,
        height: 20,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
        top: 40,
    },
    qrcode: {
        flexDirection: 'row',
        height: 20,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
        top: 100,
    },
    row: {
        flexDirection: 'row',
        borderTopColor: borderColor,
        borderTopWidth: 1,
        alignItems: 'top',
        fontStyle: 'bold',
        fontSize: 16,
        minHeight: 50,
    },
    row1: {
        flexDirection: 'row',
        borderTopColor: borderColor,
        borderTopWidth: 1,
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
        alignItems: 'top',
        fontStyle: 'bold',
        fontSize: 16,
        minHeight: 50,
    },
    descriptionrow: {
        width: '32%',
        textAlign: 'center',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        borderLeftColor: borderColor,
        borderLeftWidth: 1,
        paddingTop: 5,
        fontSize: 16,
    },
    qtyrow: {
        width: '70%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 2,
        paddingTop: 4,
        fontSize: 16,
    },
});

export class Certificado extends Component {
    static displayName = Certificado.name;

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            proprietario: '',
            email: '',
            pais: '',
            data: '',
            hash: '',
            descricao: '',
            timestamp: '',
            linkQRCode: ''
        };
    }

    componentDidMount() {

        const token = localStorage.getItem('token');
        var decoded = decode(token);
        this.setState({ email: decoded.Email });
        this.setState({ pais: decoded.Pais });
        // Buscar o hash do documento
        this.setState({ hash: this.props.hash });
        // Link para o QRCode
        const linkQRCode = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + this.props.hash;
        this.setState({ linkQRCode: linkQRCode });

        // Data
        this.setState({ data: new Date().toLocaleString() });

        axios.get(`${DOCUMENTS_URL}`, {
            params: {
                hash: this.props.hash
            }
        })
            .then(res => {
                console.log(res);
                this.setState({ dadosDocumento: res.data });
                var i = 0;
                while (i < res.data.metadata.length) {
                    if (res.data.metadata[i].nome == "Timestamp") {
                        this.setState({ timestamp: res.data.metadata[i].atributo });
                        res.data.metadata = res.data.metadata.filter((item) => item.nome !== "Timestamp");
                    }
                    if (res.data.metadata[i].nome == "Descricao") {
                        this.setState({ descricao: res.data.metadata[i].atributo });
                        res.data.metadata = res.data.metadata.filter((item) => item.nome !== "Descricao");
                    }
                    if (res.data.metadata[i].nome == "Proprietario") {
                        this.setState({ proprietario: res.data.metadata[i].atributo });
                        res.data.metadata = res.data.metadata.filter((item) => item.nome !== "Proprietario");
                    }
                    i++;
                }
            })
            .catch(error => {
                alert("ERROR! " + error);
            });
    }

    render() {
        return (
            <Document>
                <Page style={styles.page} size="A4" fixed>
                    <View style={[styles.box, { width: 200, height: 80 }]} >
                        <Image
                            style={styles.image}
                            src={Logo}
                        />
                    </View>
                    <View style={[styles.box, { height: 80 }]} >
                        <Text style={styles.certificado} fixed>
                            Certificado de Notarização
                        </Text>
                    </View>

                    <Text style={styles.descricao}>
                        Informações do Proprietário
                  </Text>

                    <View style={[styles.register, { height: 0 }]} >
                            <Text style={styles.info} >
                                Nome:
                            </Text>
                            <Text style={styles.valor} >
                                {this.state.proprietario}
                            </Text>
                            <Text style={styles.info} >
                                Email:
                            </Text>
                            <Text style={styles.valor} >
                                {this.state.email}
                            </Text>
                            <Text style={styles.info} >
                                País:
                            </Text>
                            <Text style={styles.valor} >
                                {this.state.pais}
                            </Text>
                            <Text style={styles.info} >
                                Data de emissão deste certificado: 
                            </Text>
                            <Text style={styles.valor} >
                                {this.state.data}
                            </Text>
                        </View>

                    <Text style={styles.descricaoT}>
                        Informações do Documento
                  </Text>

                    <View style={styles.row} >
                        <Text style={styles.descriptionrow}>Hash do documento</Text>
                        <Text style={styles.qtyrow}>{this.state.hash}</Text>
                    </View>
                    <View style={styles.row} >
                        <Text style={styles.descriptionrow}>Descrição do documento</Text>
                        <Text style={styles.qtyrow}>{this.state.descricao}</Text>
                    </View>
                    <View style={styles.row1} >
                        <Text style={styles.descriptionrow}>Timestamp do registo</Text>
                        <Text style={styles.qtyrow}>{this.state.timestamp}</Text>
                    </View>

                    <Image
                        style={styles.image1}
                        src={this.state.linkQRCode}
                    />

                    <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </Page>
                </Document>
        )
    }
}


