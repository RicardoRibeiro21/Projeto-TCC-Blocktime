
using Domains.DTO;
using Domains.Models;
using Infra.Data.Interfaces;
using Newtonsoft.Json.Linq;
using Services.Interfaces;
using Services.Uteis;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Services.Services
{
    public class UserService : IUserService
    {
        InstanceHttpClient _instance = new InstanceHttpClient();
        private IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public Usuarios EditarUsuario(Usuarios user)
        {
            try
            {
                return _repository.AlterarUsuario(user);
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao tentar atualizar usuári!");
            }
        }

        public Usuarios GetUserByID(int id)
        {
           return _repository.BuscarPorID(id);
        }

        public Usuarios Login(LoginDTO userLogin)
        {
            var user = _repository.Login(userLogin);
            return user;
        }

        public string LoginZabbix(Usuarios userLogin)
        {
            try
            {
                if (userLogin.Auth == null || userLogin.Auth == "")
                {

                    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, userLogin.Url);
                    request.Content = new StringContent("{\"jsonrpc\": \"2.0\",\"method\": \"user.login\",\"params\": {\"user\": \"" + userLogin.Login + "\",\"password\": \"" + userLogin.Senha + "\"},\"id\": 1,\"auth\": null}", Encoding.UTF8, "application/json");
                    HttpResponseMessage response = _instance.GetHttpClientInstance().SendAsync(request).Result;

                    var userLogado = JObject.Parse(response.Content.ReadAsStringAsync().Result)["result"].ToString();

                    userLogin.Auth = userLogado;

                    _repository.InserindoAuth(userLogin);

                    return userLogado;

                }
                else
                {

                    return userLogin.Auth;
                }

            }
            catch (Exception ex)
            {
                throw new Exception("Erro no Login Zabbix.");
            }
        }

        public void Logoff(int id)
        {
            var user = _repository.BuscarPorID(id);

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, user.Url);
            request.Content = new StringContent("{\"jsonrpc\":\"2.0\",\"method\":\"user.logout\",\"params\":[],\"id\":1,\"auth\":\"" + user.Auth + "\"}", Encoding.UTF8, "application/json");
            HttpResponseMessage response = _instance.GetHttpClientInstance().SendAsync(request).Result;
            var status = response.StatusCode;

            if (status == System.Net.HttpStatusCode.OK)
            {
                _repository.RemovendoAuth(user);
            }
            else
            {
                throw new Exception("Erro ao fazer logoff");
            }
        }
    }
}
