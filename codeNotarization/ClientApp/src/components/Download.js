import React, { Component } from 'react';
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import { Certificado } from './Certificado'
import { Link, Redirect } from 'react-router-dom';

const Download = ({ hash }) => {

    localStorage.setItem("hashDoc", hash);
    return (
        <div className="bg-blue-400 uppercase text-white font-semibold hover:shadow-md shadow text-l py-2 px-3 cursor-pointer border rounded outline-none focus:outline-none ">
            <PDFDownloadLink document={<Certificado />} fileName="certificado.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Gerar Certificado!')}
            </PDFDownloadLink>
        </div>
    )
};

export default Download;
