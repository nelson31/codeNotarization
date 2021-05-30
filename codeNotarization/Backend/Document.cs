using System;
using System.Collections.Generic;
using System.Text;

namespace codeNotarization.Backend
{
    public class Document
    {
        /**
         * Variável que guarda o hash do 
         * documento notarizado
         */
        private String hash;

        /**
         * Variável que guarda o endereço do 
         * owner do ficheiro
         */
        private String addrOwner;

        /**
         * Variável que guarda os metadados 
         * associados ao documento em questão
         */
        private Dictionary<String, String> metadados;

        public Document(String hash, String addrOwner, Dictionary<String, String> metadados)
        {
            this.hash = hash;
            this.addrOwner = addrOwner;
            this.metadados = metadados;
        }

        public String getHash()
        {
            return this.hash;
        }

        public String getaddrOwner()
        {
            return this.addrOwner;
        }

        public Dictionary<String, String> getMetadados()
        {
            return this.metadados;
        }
    }
}

