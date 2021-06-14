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
using codeNotarization.Exceptions;

namespace codeNotarization.Controllers
{
    [Produces("application/json")]
    [ApiController]
    [Route("[controller]")]
    [EnableCors("ReactPolicy")]
    public class RegistersController : ControllerBase
    {
        private BackendAPI model = new BackendAPI();
        private RegisterService service = new RegisterService();

        private readonly ILogger<RegistersController> _logger;

        public RegistersController(ILogger<RegistersController> logger)
        {
            _logger = logger;
        }


        /* /registers/login
         * Login
         */
        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] RegisterModel register)
        {
            Register r = null;
            try
            {
                r = this.model.Login(register.Address);
                RegisterModel rmodel = new RegisterModel();
                rmodel.Address = r.getAddress();
                rmodel.Email = r.getEmail();
                rmodel.Name = r.getName();
                rmodel.Pais = r.getPais();
                rmodel.Cidade = r.getCidade();
                rmodel.Telemovel = r.getTelemovel();
                rmodel.NumDocs = r.getNumDocs().ToString();
                RegisterModel reg = service.Authenticate(rmodel);
                if (reg == null)
                {
                    return BadRequest("Erro ao processar login!");
                }
                return Ok(reg);
            }
            catch (UserNotRegistedException e)
            {
                return NotFound(e.Message);
            }
            catch (Exception e)
            {
                return BadRequest("Erro ao processar o Login!");
            }
        }


        /* POST /registers
         * Criacao de uma nova conta
         */
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> RegistarConta([FromBody] RegisterModel conta)
        {
            try
            {
                // Adicionar À DB
                this.model.addRegister(conta.Address, conta.Name, conta.Email, conta.Telemovel, conta.Pais, conta.Cidade);
                // Resposta
                RegisterModel rmodel = new RegisterModel();
                rmodel.Address = conta.Address;
                rmodel.Name = conta.Name;
                rmodel.Email = conta.Email;
                rmodel.Telemovel = conta.Telemovel;
                rmodel.Pais = conta.Pais;
                rmodel.Cidade = conta.Cidade;
                rmodel.NumDocs = "0";
                RegisterModel reg = service.Authenticate(rmodel);
                if (reg == null)
                {
                    return BadRequest("Erro ao processar login!");
                }
                return Ok(reg);
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }


        /* GET /registers
         * Obter um register dado o seu endereço
         */
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetReg([FromQuery] string addr)
        {
            try
            {
                Register r = model.getRegister(addr);
                RegisterModel rModel = new RegisterModel();
                rModel.Address = r.getAddress();
                rModel.Name = r.getName();
                rModel.NumDocs = r.getNumDocs().ToString();
                rModel.Email = r.getEmail();
                rModel.Telemovel = r.getTelemovel();
                rModel.Cidade = r.getCidade();
                rModel.Pais = r.getPais();
                return Ok(rModel);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }

        /* POST /registers/transferrequest
         * Criacao de um novo pedido de transferencia
         */
        [HttpPost("transferrequest")]
        [Authorize]
        public async Task<IActionResult> TransferRequest([FromBody] TransferRequestModel trm)
        {
            try
            {
                // Adicionar À DB
                this.model.addTransferRequest(trm.HashDoc, trm.AddrNewProp, trm.AddrRequester);
                // Resposta
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }

        /* GET /registers/transferrequests
         * Obtencao da lista de pedidos de transferencia de um dado Register
         */
        [HttpGet("transferrequests")]
        [Authorize]
        public async Task<IActionResult> GetTransferRequests([FromQuery] string addr)
        {
            List<TransferRequest> trs = null;
            List<TransferRequestModel> trsm = new List<TransferRequestModel>();
            try
            {
                // Obter a lista de transferencias
                trs = this.model.getTransferRequests(addr);
                foreach (TransferRequest tr in trs)
                {
                    TransferRequestModel trm = new TransferRequestModel();
                    trm.AddrNewProp = tr.getaddrNewProp();
                    trm.AddrRequester = tr.getaddrRequester();
                    trm.Descricao = tr.getDescricao();
                    trm.HashDoc = tr.getHashDoc();
                    trm.Requester = tr.getRequester();

                    trsm.Add(trm);
                }
                // Resposta
                return Ok(trsm);
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }

        /* POST /registers/aceitatransferrequest
         * Acontece quando um register aceita a transferencia de propriedade
         */
        [HttpPost("aceitatransferrequest")]
        [Authorize]
        public async Task<IActionResult> AceitaTransferRequest([FromBody] TransferRequestModel trm)
        {
            try
            {
                // Adicionar À DB
                this.model.aceitaTransferRequest(trm.HashDoc, trm.HashMetadata, trm.AddrNewProp, trm.AddrRequester);
                // Resposta
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }

        /* POST /registers/rejeitatransferrequest
         * Acontece quando um register rejeita a transferencia de propriedade
         */
        [HttpPost("rejeitatransferrequest")]
        [Authorize]
        public async Task<IActionResult> RejeitaTransferRequest([FromBody] TransferRequestModel trm)
        {
            try
            {
                // Adicionar À DB
                this.model.rejeitaTransferRequest(trm.HashDoc, trm.AddrNewProp, trm.AddrRequester);
                // Resposta
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }


        public override NoContentResult NoContent()
        {
            return base.NoContent();
        }
    }
}





