using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using codeNotarization.Models;
using Newtonsoft.Json;
using System;
using codeNotarization.Backend;
using codeNotarization.Services;

namespace codeNotarization.Controllers
{
    [Produces("application/json")]
    [ApiController]
    [Route("[controller]")]
    [EnableCors("ReactPolicy")]
    public class DocumentsController : ControllerBase
    {
        private BackendAPI model = new BackendAPI();
        private RegisterService service = new RegisterService();

        private readonly ILogger<DocumentsController> _logger;

        public DocumentsController(ILogger<DocumentsController> logger)
        {
            _logger = logger;
        }

        /* GET /documents
         * Obter um documento dado o seu hash
         */
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetDoc([FromQuery] string hash)
        {
            try
            {
                Document d = model.getDocument(hash);
                DocumentModel dModel = new DocumentModel();
                dModel.AddrOwner = d.getaddrOwner();
                dModel.Hash = d.getHash();
                List<MetadataModel> list = new List<MetadataModel>();
                foreach(string key in d.getMetadados().Keys)
                {
                    MetadataModel m = new MetadataModel();
                    m.Nome = key;
                    m.Atributo = d.getMetadados()[key];
                    list.Add(m);
                }
                dModel.Metadata = list;
                return Ok(dModel);
            } catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }


        /* POST /documents
         * Adicao de um novo documento notarizado por parte do registador
         */
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> RegistarDoc([FromBody] DocumentModel doc)
        {
            try
            {
                Dictionary<String, String> dicMeta = new Dictionary<string, string>();
                foreach(MetadataModel m in doc.Metadata)
                {
                    dicMeta.Add(m.Nome, m.Atributo);
                }
                // Adicionar À DB
                this.model.addDocument(doc.Hash, doc.AddrOwner, dicMeta);
                // Resposta
                return Ok();
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }

        /* GET /documents/listaDocs
         * Obter a lista de documentos associados a um determinado register (addr)
         */
        [HttpGet("listaDocs")]
        [Authorize]
        public ActionResult listaDocuments([FromQuery] string addr)
        {
            List<Document> ld = null;
            List<DocumentModel> ldm = new List<DocumentModel>();
            try
            {
                ld = this.model.getDocuments(addr);
                foreach (Document d in ld)
                {
                    DocumentModel dm = new DocumentModel();
                    dm.AddrOwner = d.getaddrOwner();
                    dm.Hash = d.getHash();
                    foreach (string key in d.getMetadados().Keys)
                    {
                        if (key.Equals("Timestamp"))
                        {
                            dm.Timestamp = d.getMetadados()[key];
                        }
                        if (key.Equals("Descricao"))
                        {
                            dm.Descricao = d.getMetadados()[key];
                        }
                    }
                    ldm.Add(dm);
                }
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }

            return Ok(ldm);
        }

        public override NoContentResult NoContent()
        {
            return base.NoContent();
        }
    }
}

