﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using MySql.Data.MySqlClient;
using codeNotarization.Backend;

namespace codeNotarization.DataBase
{
	class DocumentDAO
	{
		private static DocumentDAO inst = null;

		private String connectionstring;
		/**
		 * Construtor para objetos da classe DocumentDAO. 
		 * É de notar que este construtor é privado
		 */
		private DocumentDAO()
		{
			string server = "localhost";
			string database = "notarization_db";
			string uid = "root";
			string password = "pass12345";
			this.connectionstring = "SERVER=" + server + ";" + "DATABASE=" +
			database + ";" + "UID=" + uid + ";" + "PASSWORD=" + password + ";";
		}

		/**
		 * Método que permite obter um único 
		 * objeto da classe DocumentDAO
		 */
		public static DocumentDAO getInstance()
		{
			if (DocumentDAO.inst == null)
				DocumentDAO.inst = new DocumentDAO();
			return DocumentDAO.inst;
		}

		/**
		 * Método que nos diz qual o número de 
		 * contas contidas num objeto da classe 
		 * ContaDAO
		 */
		public int size()
		{
			MySqlConnection connection = new MySqlConnection(this.connectionstring);
			connection.Open();
			DataTable dt = new DataTable();

			MySqlDataAdapter msda = new MySqlDataAdapter("select * from documents", connection);

			msda.Fill(dt);

			int ret = dt.Rows.Count;

			/* Fechamos a conexão */
			connection.Close();
			return ret;
		}

		/**
		 * Método que é usado para obter os metadados 
		 * associados a um ficheiro em específico
		 */
		private Dictionary<String, String> getDocumentMetadata(MySqlConnection conn, String hash)
		{
			Dictionary<String, String> metadata = new Dictionary<string, string>();

			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("select * from metadata where hashDocumento='");
			sb.Append(hash);
			sb.Append("'");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), conn);

			msda.Fill(dt);

			foreach (DataRow dr in dt.Rows)
			{
				metadata.Add(dr.Field<String>("nome"), dr.Field<String>("atributo"));
			}

			return metadata;
		}

		/**
		 * Método que permite obter um objeto da classe documento, dado o seu hash
		 */
		public Document get(String hash)
		{
			MySqlConnection connection = new MySqlConnection(this.connectionstring);

			/* Abrimos a conexão */
			connection.Open();

			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("select * from document where hash='");
			sb.Append(hash);
			sb.Append("'");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			Document d = null;
			msda.Fill(dt);
			if (dt.Rows.Count == 1)
			{
				d = new Document(dt.Rows[0].Field<String>("hash"), dt.Rows[0].Field<String>("addrOwner"), this.getDocumentMetadata(connection, hash));
			}
			connection.Close();

			return d;
		}

		/**
		 * Método que permite obter um objeto da classe documento, dado o seu hash e o owner do documento
		 */
		public List<Document> getOwnerDocuments(String addrOwner)
		{
			List<Document> list = new List<Document>();

			MySqlConnection connection = new MySqlConnection(this.connectionstring);

			/* Abrimos a conexão */
			connection.Open();

			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("select * from documents where addrOwner='");
			sb.Append(addrOwner);
			sb.Append("'");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			Document d = null;
			msda.Fill(dt);
			foreach (DataRow dr in dt.Rows)
			{
				list.Add(new Document(dr.Field<String>("hash"), dr.Field<String>("addrOwner"), this.getDocumentMetadata(connection, dr.Field<String>("hash"))));
			}
			connection.Close();

			return list;
		}

		/**
		 * Método que adiciona todos os metadados associados a um documento à base de dados
		 */
		public void putDocumentMetadata(MySqlConnection conn, String hash, Document document)
		{
			DataTable dt = new DataTable();
			String atributo;
			StringBuilder sb = new StringBuilder();
			Dictionary<String, String> metadados = document.getMetadados();

			foreach (String name in metadados.Keys)
			{
				sb.Append("insert into metadata (hashDocumento,nome,atributo) values ('");
				sb.Append(hash);
				sb.Append("','");
				metadados.TryGetValue(name, out atributo);
				sb.Append(name);
				sb.Append("','");
				sb.Append(atributo);
				sb.Append("')");
				atributo = "";

				MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), conn);

				msda.Fill(dt);
			}
		}

		/**
		 * Método que permite adicionar um novo documento à base de dados
		 */
		public void put(String hash, Document document)
		{
			MySqlConnection connection = new MySqlConnection(this.connectionstring);

			/* Abrimos a conexão */
			connection.Open();

			DataTable dt = new DataTable();

			StringBuilder sb = new StringBuilder();
			sb.Append("insert into document (hash,addrOwner) values ('");
			sb.Append(hash);
			sb.Append("','");
			sb.Append(document.getaddrOwner());
			sb.Append("')");

			MySqlDataAdapter msda = new MySqlDataAdapter(sb.ToString(), connection);

			msda.Fill(dt);

			this.putDocumentMetadata(connection, hash, document);

			connection.Close();
		}
	}
}