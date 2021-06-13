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
         * Variavel que guarda o hash dos metadados
         */
        private String hashMetadata;

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

        public Document(String hash, String hashMetadata, String addrOwner, Dictionary<String, String> metadados)
        {
            this.hash = hash;
            this.hashMetadata = hashMetadata;
            this.addrOwner = addrOwner;
            this.metadados = metadados;
        }

        public String getHash()
        {
            return this.hash;
        }

        public String getHashMetadata()
        {
            return this.hashMetadata;
        }

        public String getaddrOwner()
        {
            return this.addrOwner;
        }

        public Dictionary<String, String> getMetadados()
        {
            return this.metadados;
        }

        public void setHash(String hash)
        {
            this.hash = hash;
        }

        public void setHashMetadata(String hashMetadata)
        {
            this.hashMetadata = hashMetadata;
        }

        public void setaddrOwner(String addrOwner)
        {
            this.addrOwner = addrOwner;
        }

        public void setMetadados(Dictionary<String, String> metadados)
        {
            this.metadados = metadados;
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

