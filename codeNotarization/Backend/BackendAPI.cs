using System;
using System.Collections.Generic;
using System.Linq;
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
				throw new UserNotRegistedException(e.Message);
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
        public void addDocument(String hash, String addrOwner, Dictionary<String, String> metadados)
        {
            Document d = new Document(hash, addrOwner, metadados);
            if (dDAO.contains(hash))
                throw new DocumentExistsException("Este documento já existe na base de dados...");
            dDAO.put(hash, d);
            rDAO.increaseNumDocs(addrOwner);
        }

        /**
         * Método que permite alterar a propriedade de um 
         * documento já existente
         */
        public void changeProperty(String hashDocument, String addrOwner, String addrNewOwner)
        {
            if (!dDAO.contains(hashDocument))
                throw new DocumentExistsException("Está a tentar alterar propriedade de um documento inexistente");
            if (!rDAO.contains(addrOwner))
                throw new RegisterExistsException("Está a tentar alterar propriedade de um documento cujo proprietário não existe");
            if (!rDAO.contains(addrNewOwner))
                throw new RegisterExistsException("Está a tentar alterar propriedade de um documento cujo novo proprietário não existe");

            rDAO.increaseNumDocs(addrNewOwner);
            rDAO.decreaseNumDocs(addrOwner);
            dDAO.changeOwner(hashDocument, addrOwner, addrNewOwner);
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
    }
}
