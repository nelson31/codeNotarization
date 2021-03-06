using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using codeNotarization.Backend;
using codeNotarization.Exceptions;

namespace codeNotarization.DataBase
{
	class RegisterDAO
	{
		private static RegisterDAO inst = null;

		private static DocumentDAO documentDAO = DocumentDAO.getInstance();

		private String connectionstring;
		/**
		 * Construtor para objetos da classe RegisterDAO. 
		 * É de notar que este construtor é privado
		 */
		private RegisterDAO()
		{
			string server = "localhost";
			string database = "notarization_db";
			string uid = "root";
			string password = Settings.passMySQL;
			this.connectionstring = "SERVER=" + server + ";" + "DATABASE=" +
			database + ";" + "UID=" + uid + ";" + "PASSWORD=" + password + ";";
		}

		/**
		 * Método que permite obter um único 
		 * objeto da classe RegisterDAO
		 */
		public static RegisterDAO getInstance()
		{
			if (RegisterDAO.inst == null)
				RegisterDAO.inst = new RegisterDAO();
			return RegisterDAO.inst;
		}

		/**
		 * Método que nos diz se determinado user já se 
		 * encontra registado na base de dados
		 */
		public bool contains(String address)
		{
			MySqlConnection connection = new MySqlConnection(this.connectionstring);
			connection.Open();
			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("select * from registers where addrRegister='");
			sb.Append(address);
			sb.Append("'");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			msda.Fill(dt);

			connection.Close();

			return dt.Rows.Count == 1;
		}

		/**
		 * Método que nos diz qual o número de 
		 * contas contidas num objeto da classe 
		 * RegisterDAO
		 */
		public int size()
		{
			MySqlConnection connection = new MySqlConnection(this.connectionstring);
			connection.Open();
			DataTable dt = new DataTable();

			MySqlDataAdapter msda = new MySqlDataAdapter("select * from registers", connection);

			msda.Fill(dt);

			int ret = dt.Rows.Count;

			/* Fechamos a conexão */
			connection.Close();
			return ret;
		}

		/**
		 * Método que permite ler da base de dados um objeto da classe Register
		 */
		public Register get(String address)
		{
			String name = "", email = "", telemovel = "", pais = "", cidade = "";
			int numDocs = 0;
			MySqlConnection connection = new MySqlConnection(this.connectionstring);
			connection.Open();
			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("select * from registers where addrRegister='");
			sb.Append(address);
			sb.Append("'");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			msda.Fill(dt);

			if (dt.Rows.Count == 1)
			{
				name = dt.Rows[0].Field<String>("nome");
				email = dt.Rows[0].Field<String>("email");
				telemovel = dt.Rows[0].Field<String>("telemovel");
				pais = dt.Rows[0].Field<String>("pais");
				cidade = dt.Rows[0].Field<String>("cidade");
				numDocs = dt.Rows[0].Field<int>("numeroDocs");
			}
			else
			{
				connection.Close();
				throw new UserNotRegistedException("[Error] address '" + address + "' não existe na BD");
			}

			connection.Close();

			List<Document> docs = documentDAO.getOwnerDocuments(address);

			return new Register(address, name, email, telemovel, docs, pais, cidade, numDocs);
		}

		/**
		 * Método que permite registar um novo 
		 * register na base de dados
		 */
		public void put(String address, Register register)
		{
			MySqlConnection connection = new MySqlConnection(this.connectionstring);
			connection.Open();
			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("insert into registers (addrRegister,nome,email,telemovel,numeroDocs,pais,cidade) values ('");
			sb.Append(address);
			sb.Append("','");
			sb.Append(register.getName());
			sb.Append("','");
			sb.Append(register.getEmail());
			sb.Append("','");
			sb.Append(register.getTelemovel());
			sb.Append("',");
			sb.Append(register.getDocumentos().Count);
			sb.Append(",'");
			sb.Append(register.getPais());
			sb.Append("','");
			sb.Append(register.getCidade());
			sb.Append("')");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			msda.Fill(dt);
			connection.Close();

			foreach (Document d in register.getDocumentos())
			{
				documentDAO.put(d.getHash(), d);
			}
		}

		/**
		 * Método que incrementa o número de documentos de um determinado register
		 */
		public void increaseNumDocs(String address)
		{
			MySqlConnection connection = new MySqlConnection(this.connectionstring);
			connection.Open();
			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("select numeroDocs from registers where addrRegister='");
			sb.Append(address);
			sb.Append("'");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			msda.Fill(dt);

			if (dt.Rows.Count == 1)
			{
				int numDocs = dt.Rows[0].Field<int>("numeroDocs");
				sb.Clear();
				sb.Append("update registers set numeroDocs=");
				sb.Append(numDocs + 1);
				sb.Append(" where addrRegister='");
				sb.Append(address);
				sb.Append("'");

				msda = new MySqlDataAdapter(sb.ToString(), connection);
				msda.Fill(dt);
			}
			connection.Close();
		}

		/**
		 * Método que incrementa o número de documentos de um determinado register
		 */
		public void decreaseNumDocs(String address)
		{
			MySqlConnection connection = new MySqlConnection(this.connectionstring);
			connection.Open();
			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("select numeroDocs from registers where addrRegister='");
			sb.Append(address);
			sb.Append("'");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			msda.Fill(dt);

			if (dt.Rows.Count == 1)
			{
				int numDocs = dt.Rows[0].Field<int>("numeroDocs");
				sb.Clear();
				sb.Append("update registers set numeroDocs=");
				sb.Append(numDocs - 1);
				sb.Append(" where addrRegister='");
				sb.Append(address);
				sb.Append("'");

				msda = new MySqlDataAdapter(sb.ToString(), connection);
				msda.Fill(dt);
			}
			connection.Close();
		}

		/**
		 * Metodo que serve para verificar se um pedido de transferencia ja pertence a DB
		 */
		public bool containsTransferRequest(TransferRequest tr)
		{
			MySqlConnection connection = new MySqlConnection(this.connectionstring);
			connection.Open();
			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("select * from transferrequests where addrNewProp='");
			sb.Append(tr.getaddrNewProp());
			sb.Append("' and addrRequester='");
			sb.Append(tr.getaddrRequester());
			sb.Append("' and hashDocument='");
			sb.Append(tr.getHashDoc());
			sb.Append("'");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			msda.Fill(dt);
			connection.Close();

			return dt.Rows.Count == 1;
		}

		/**
		 * Método que permite adicionar um novo pedido de transferencia
		 * de documento a um determinado Register
		 */
		public void putTransferRequest(TransferRequest tr)
		{
			MySqlConnection connection = new MySqlConnection(this.connectionstring);
			connection.Open();
			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("insert into transferrequests (addrNewProp,addrRequester,hashDocument) values ('");
			sb.Append(tr.getaddrNewProp());
			sb.Append("','");
			sb.Append(tr.getaddrRequester());
			sb.Append("','");
			sb.Append(tr.getHashDoc());
			sb.Append("')");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			msda.Fill(dt);
			connection.Close();
		}

		/**
		 * Método que permite ler da base de dados todos os pedidos de transferencia 
		 * de propriedade de documento de um determinado Register
		 */
		public List<TransferRequest> getTransferRequests(String address)
		{
			List<TransferRequest> result = new List<TransferRequest>();
			MySqlConnection connection = new MySqlConnection(this.connectionstring);
			connection.Open();
			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("select * from transferrequests where addrNewProp='");
			sb.Append(address);
			sb.Append("'");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			msda.Fill(dt);

			foreach (DataRow dr in dt.Rows)
			{
				result.Add(new TransferRequest(dr.Field<String>("addrRequester"), dr.Field<String>("addrNewProp"), dr.Field<String>("hashDocument")));
			}
			connection.Close();

			return result;
		}

		/**
		 * Metodo que serve para apagar um determinado pedido de transferencia de propriedade
		 */
		 public void deleteTransferRequest(TransferRequest tr)
		{
			// delete from transferrequests where addrNewProp = '' and addrRequester='' and hashDocument='';

			MySqlConnection connection = new MySqlConnection(this.connectionstring);
			connection.Open();
			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("delete from transferrequests where addrNewProp='");
			sb.Append(tr.getaddrNewProp());
			sb.Append("' and addrRequester='");
			sb.Append(tr.getaddrRequester());
			sb.Append("' and hashDocument='");
			sb.Append(tr.getHashDoc());
			sb.Append("'");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			msda.Fill(dt);
			connection.Close();
		}
	}
}

