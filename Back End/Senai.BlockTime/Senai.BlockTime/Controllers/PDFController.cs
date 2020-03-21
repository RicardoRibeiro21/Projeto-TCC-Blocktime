using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Domains.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace Senai.BlockTime.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PDFController : ControllerBase
    {

        private IPDFService _pdfService;

        public PDFController(IPDFService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpGet]

        public IActionResult solicitarPDF([FromQuery] FormDTO form)
        {

            try
            {
                var idUsuario = Convert.ToInt32(HttpContext.User.Claims.First(c => c.Type == JwtRegisteredClaimNames.Jti).Value);

                var result = _pdfService.InformacoesPDF(form, idUsuario);

                return Ok(result);

            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }


        }

    }
}