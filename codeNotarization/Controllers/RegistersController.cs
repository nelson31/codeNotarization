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
        private ContaService service = new ContaService();

        private readonly ILogger<RegistersController> _logger;

        public RegistersController(ILogger<RegistersController> logger)
        {
            _logger = logger;
        }


        public override NoContentResult NoContent()
        {
            return base.NoContent();
        }
    }
}





