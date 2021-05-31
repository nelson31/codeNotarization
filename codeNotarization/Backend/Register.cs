using System;
using System.Collections.Generic;
using System.Text;

namespace codeNotarization.Backend
{
    public class Register
    {
        /**
         * Variável que guarda o endereço 
         * do novo register
         */
        private String address;

        /**
         * Variável que guarda o nome 
         * do novo register
         */
        private String name;

        /**
         * Variável que guarda o email 
         * do novo register
         */
        private String email;

        /**
         * Variável que guarda o telemovel 
         * do novo register
         */
        private String telemovel;
        /**
         * Variável que guarda o numero de documentos 
         * presentes no documentos
         */
        private int numDocs;
        /**
         * Variável que guarda o numero de documentos 
         * do novo register
         */
        private List<Document> documentos;

        /**
         * Variável que guarda o pais 
         * do novo register
         */
        private String pais;

        /**
         * Variável que guarda a cidade
         * do novo register
         */
        private String cidade;

        public Register(String address, String name, String email, String telemovel, List<Document> documentos, String pais, String cidade, int numDocs)
        {
            this.address = address;
            this.name = name;
            this.email = email;
            this.telemovel = telemovel;
            this.documentos = documentos;
            this.pais = pais;
            this.cidade = cidade;
            this.numDocs = numDocs;
        }

        public String getAddress()
        {
            return this.address;
        }

        public String getName()
        {
            return this.name;
        }

        public String getEmail()
        {
            return this.email;
        }
        public int getNumDocs()
        {
            return this.numDocs;
        }

        public String getTelemovel()
        {
            return this.telemovel;
        }

        public List<Document> getDocumentos()
        {
            return this.documentos;
        }

        public String getPais()
        {
            return this.pais;
        }

        public String getCidade()
        {
            return this.cidade;
        }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(this.address);
            sb.Append(";");
            sb.Append(this.name);
            sb.Append(";");
            sb.Append(this.email);
            sb.Append(";");
            sb.Append(this.telemovel);
            sb.Append(";");
            sb.Append(this.pais);
            sb.Append(";");
            sb.Append(this.cidade);
            return sb.ToString();
        }
    }
}
