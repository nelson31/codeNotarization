using System;

namespace codeNotarization.Backend
{
    public class TransferRequest
    {
        /**
         * Variavel que guarda o endereço do proprietario do documento que efetua o pedido de 
         * transferencia de propriedade
         */
        private String addrRequester;

        /**
         * Variavel que guarda o endereço do Register a que se destina o pedido de transferencia
         */
        private String addrNewProp;

        /**
         * Variável que guarda o hash do documento ao qual se pretende transferir a propriedade
         */
        private String hashDoc;

        /**
         * Variavel que guarda a descricao de um documento
         */
        private String descricao;

        /**
         * Variavel que guarda o nome do requester
         */
        private String requester;


        public TransferRequest(String addrRequester, String addrNewProp, String hashDoc)
        {
            this.addrRequester = addrRequester;
            this.addrNewProp = addrNewProp;
            this.hashDoc = hashDoc;
        }

        public String getHashDoc()
        {
            return this.hashDoc;
        }

        public String getaddrRequester()
        {
            return this.addrRequester;
        }

        public String getaddrNewProp()
        {
            return this.addrNewProp;
        }

        public String getDescricao()
        {
            return this.descricao;
        }

        public String getRequester()
        {
            return this.requester;
        }

        public void setDescricao(string descricao)
        {
            this.descricao = descricao;
        }

        public void setaddrRequester(string requester)
        {
            this.addrRequester = requester;
        }

        public void setRequester(string requester)
        {
            this.requester = requester;
        }
    }
}
