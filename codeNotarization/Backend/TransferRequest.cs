using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
    }
}
