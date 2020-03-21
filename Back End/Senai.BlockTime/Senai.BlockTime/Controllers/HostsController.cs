//using System;
//using System.Collections.Generic;
//using System.IdentityModel.Tokens.Jwt;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Services.Interfaces;

//namespace Senai.BlockTime.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class HostsController : ControllerBase
//    {
//        private IHostsService _HostsService;

//        public HostsController(IHostsService HostsService)
//        {
//            _HostsService = HostsService;
//        }

//        [HttpGet]
//        public IActionResult ListarHosts([FromQuery] int idGroup)
//        {
            
//            var idUsuario = Convert.ToInt32(HttpContext.User.Claims.First(c => c.Type == JwtRegisteredClaimNames.Jti).Value);

//            var lista = _HostsService.ListarHostsPorIdGroup(idGroup, idUsuario);

//            return Ok(lista);
//        }
//    }
//}