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
            catch (Exception e)
            {
                return BadRequest(e.Message);
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

        public override NoContentResult NoContent()
        {
            return base.NoContent();
        }
    }
}





