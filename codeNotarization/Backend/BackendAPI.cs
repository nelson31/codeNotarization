using System;
using System.Collections.Generic;
using System.Linq;  
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using codeNotarization.DataBase;
using codeNotarization.Exceptions;

namespace codeNotarization.Backend
{
    public class BackendAPI
    {
        /**
         * Declaração e inicialização dos diferentes 
         * Data Access Objects para aceder à base de dados
         */
        private readonly RegisterDAO rDAO = RegisterDAO.getInstance();
        private readonly DocumentDAO dDAO = DocumentDAO.getInstance();


        /**
		 * Construtor para objetos da classe BackendAPI, 
		 * classe essa que representa a classe principal 
		 * da aplicação
		 */
        public BackendAPI()
		{
		}


		/**
		 * Método que permite fazer login na aplicação. Throws Exception
		 */
		public Register Login(string address)
		{
			Register r = null;
			try
			{
				r = this.rDAO.get(address);

			} catch(UserNotRegistedException e)
			{
				throw new UserNotRegistedException("O seu endereço não é válido, registe-se primeiro!!");
			}

			return r;
		}

        /**
         * Método que permite adicionar um novo 
         * register à base de dados
         */
        public void addRegister(String address, String name, String email, String telemovel, String pais, String cidade)
        {
            Register r = new Register(address, name, email, telemovel, new List<Document>(), pais, cidade, 0);
            if (rDAO.contains(address))
                throw new RegisterExistsException("Já existe um register com este endereço atribuido...");
            rDAO.put(address, r);
        }

        /**
         * Método que permite adicionar um novo documento 
         * à base de dados
         */
        public void addDocument(String hash, String hashMetadata, String addrOwner, Dictionary<String, String> metadados)
        {
            Document d = new Document(hash, hashMetadata, addrOwner, metadados);
            if (dDAO.contains(hash))
                throw new DocumentExistsException("Este documento já existe na base de dados...");
            dDAO.put(hash, d);
            rDAO.increaseNumDocs(addrOwner);
        }

        /*
         * Método que obtem o documento dado o seu hash
         */
         public Document getDocument(String hash)
        {
            Document d = null;
            if (dDAO.contains(hash))
            {
                d = dDAO.get(hash);
            }
            else
            {
                throw new DocumentExistsException("O Documento nao existe na DB!");
            }
            return d;
        }

        /*
         * Método que obtem o register dado o seu endereço
         */
        public Register getRegister(String addr)
        {
            Register r = null;
            if (rDAO.contains(addr))
            {
                r = rDAO.get(addr);
            }
            else
            {
                throw new RegisterExistsException("O Register nao existe na DB!");
            }
            return r;
        }

        /*
         * Método que dado um endereço de um Register nos devolve a lista de documentos que 
         * este possui
         */
         public List<Document> getDocuments(String addr)
        {
            Register r = null;
            if (rDAO.contains(addr))
            {
                r = rDAO.get(addr);
            }
            else
            {
                throw new RegisterExistsException("O Register nao existe na DB!");
            }
            return r.getDocumentos(); ;
        }

        /*
         * Método que serve para adicionar um pedido de transferencia de propriedade de um documento
         */
        public void addTransferRequest(String hashDoc, String addrNewProp, String addrRequester)
        {
            TransferRequest tr = new TransferRequest(addrRequester, addrNewProp, hashDoc);
            if (!rDAO.contains(addrNewProp))
                throw new RegisterExistsException("O Register ao qual pretende transferir a propriedade de um doc. nao existe na DB!");
            if (!rDAO.contains(addrRequester))
                throw new RegisterExistsException("O Register que pretende transferir propriedade de um doc. nao existe na DB!");
            if (!dDAO.contains(hashDoc))
                throw new DocumentExistsException("O documento nao existe na DB!");
            if (rDAO.containsTransferRequest(tr))
            {
                throw new TransferRequestExistsException("O pedido de transferencia já foi efetuado anteriormente!!");
            }
            rDAO.putTransferRequest(tr);
        }

        /**
         * Metodo que nos devolve a lista de pedidos de transferencia de um dado register
         */
         public List<TransferRequest> getTransferRequests(string addr)
        {
            if (!rDAO.contains(addr))
                throw new RegisterExistsException("O Register não existe na DB!");
            List<TransferRequest> trs = rDAO.getTransferRequests(addr);
            // Juntar as descricoes de ficheiros
            foreach (TransferRequest tr in trs)
            {
                Document d = dDAO.get(tr.getHashDoc());
                Register r = rDAO.get(tr.getaddrRequester());
                tr.setDescricao(d.getMetadados()["Descricao"]);
                tr.setRequester(r.getName());
            }
            return trs;
        }

        /*
         * Método que serve para aceitar um pedido de transferencia de propriedade de um documento
         */
        public void aceitaTransferRequest(String hashDoc, String hashMetadata, String addrNewProp, String addrRequester)
        {
            TransferRequest tr = new TransferRequest(addrRequester, addrNewProp, hashDoc);
            if (!rDAO.contains(addrNewProp))
                throw new RegisterExistsException("O Register ao qual pretende transferir a propriedade de um doc. nao existe na DB!");
            if (!rDAO.contains(addrRequester))
                throw new RegisterExistsException("O Register que pretende transferir propriedade de um doc. nao existe na DB!");
            if (!dDAO.contains(hashDoc))
                throw new DocumentExistsException("O documento nao existe na DB!");

            // Vai buscar a base de dados o documento
            Document document = dDAO.get(hashDoc);
            // Vai buscar os dados do novo register
            Register newProp = rDAO.get(addrNewProp);
            // Altera os campos necessarios do docuemnto
            document.setaddrOwner(newProp.getAddress());
            // Vai buscar os metadados
            Dictionary<string,string> meta = document.getMetadados();
            if (meta["Proprietario"] != null)
            {
                meta["Proprietario"] = newProp.getName();
            }
            // Alterar o hashMetadata
            document.setHashMetadata(hashMetadata);
            // Timestamp?
            // Efetua a mudança de propriedade do docuemnto
            dDAO.changeOwner(document);
            // Altera os numeros de docs
            rDAO.increaseNumDocs(addrNewProp);
            rDAO.decreaseNumDocs(addrRequester);

            // Apaga o pedido de transferencia
            rDAO.deleteTransferRequest(tr);
        }

        /*
         * Método que serve para rejeitar um pedido de transferencia de propriedade de um documento
         */
        public void rejeitaTransferRequest(String hashDoc, String addrNewProp, String addrRequester)
        {
            TransferRequest tr = new TransferRequest(addrRequester, addrNewProp, hashDoc);
            Console.WriteLine(addrRequester);
            if (!rDAO.contains(addrNewProp))
                throw new RegisterExistsException("O Register ao qual pretende transferir a propriedade de um doc. nao existe na DB!");
            if (!rDAO.contains(addrRequester))
                throw new RegisterExistsException("O Register que pretende transferir propriedade de um doc. nao existe na DB!");
            if (!dDAO.contains(hashDoc))
                throw new DocumentExistsException("O documento nao existe na DB!");
            rDAO.deleteTransferRequest(tr);
        }
    }
}
