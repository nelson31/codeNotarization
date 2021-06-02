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

        public override NoContentResult NoContent()
        {
            return base.NoContent();
        }
    }
}

