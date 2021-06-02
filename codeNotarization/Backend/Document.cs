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

        /**
         * Método que retorna os metadados do 
         * documento em formato json
         */
        public String jsonifyMetadata()
        {
            StringBuilder sb = new StringBuilder();

            sb.Append("[");
            int count = 0;
            foreach (String key in this.metadados.Keys)
            {
                sb.Append("{\"nome\":\"");
                sb.Append(key);
                sb.Append("\",\"atributo\":\"");
                sb.Append(this.metadados[key]);
                if (count == this.metadados.Count - 1)
                    sb.Append("\"}");
                else
                    sb.Append("\"},");
                count++;
            }
            sb.Append("]");
            return sb.ToString();
        }
    }
}

