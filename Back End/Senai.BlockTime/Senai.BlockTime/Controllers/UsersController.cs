
using Domains.DTO;
using Domains.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Senai.BlockTime.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUserService _UserService;

        public UsersController(IUserService UserService)
        {
            _UserService = UserService;
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Login(LoginDTO userLogin)
        {
            try
            {
                Usuarios user = _UserService.Login(userLogin);

                if (user == null)
                {
                    throw new Exception("Senha ou Login inválido!");
                }

                var claims = new[]
                    {
                        new Claim("Login", user.Login),
                        new Claim(JwtRegisteredClaimNames.Jti, user.Id.ToString())
                    };

                var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("Senai-BlockTime-chave-autenticacao"));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                issuer: "SenaiBlockTime.WebApi",
                audience: "SenaiBlockTime.WebApi",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
                );

                var usuarioZabbix = _UserService.LoginZabbix(user);

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    chaveZabbix = usuarioZabbix
                });
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        [HttpGet]
        [Route("logoff")]
        public IActionResult Logoff()
        {
            var idUsuario = Convert.ToInt32(HttpContext.User.Claims.First(c => c.Type == JwtRegisteredClaimNames.Jti).Value);

            _UserService.Logoff(idUsuario);

            return Ok();
        }


        [HttpPut]
        [Route("Editar")]
        public IActionResult Editar(Usuarios usuario)
        {
            var user = _UserService.EditarUsuario(usuario);

            return Ok(user);
        }



        [HttpGet]
        [Route("UsuarioLogado")]
        public IActionResult UsuarioLogado()
        {
            try
            {
                var idUsuario = Convert.ToInt32(HttpContext.User.Claims.First(c => c.Type == JwtRegisteredClaimNames.Jti).Value);

               var user =  _UserService.GetUserByID(idUsuario);

                return Ok(user);

            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao buscar Usuário logado!");
            }
            
        }

    }
}
