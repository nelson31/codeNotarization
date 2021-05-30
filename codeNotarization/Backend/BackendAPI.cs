using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using codeNotarization.DataBase;

namespace codeNotarization.Backend
{
    public class BackendAPI
    {

		/**
		 * Coleção na qual guardamos os registers que 
		 * se inscrevem na plataforma. Essa coleção 
		 * tem por base uma base de dados do tipo Relacional
		 */
		private RegisterDAO registers;


		/**
		 * Construtor para objetos da classe BackendAPI, 
		 * classe essa que representa a classe principal 
		 * da aplicação
		 */
		public BackendAPI()
		{
			this.registers = RegisterDAO.getInstance();
		}


		/**
		 * Método que permite fazer login na aplicação. Throws Exception
		 */
		public Register Login(string address)
		{
			Register r = this.registers.get(address);

			/*if (!r.getEmail().Equals(email))
				throw new MailNaoRegistado("[Error] email '" + email + "' não corresponde ao seu id");

			if (!PasswordHasher.VerificaHash(password, c.getPassword()))
			{
				Console.WriteLine("erro na pw;");
				throw new PasswordErrada("[Error] password errada");
			}
			*/

			return r;
		}
	}
}
