
using Domains.DTO;
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
    public class HostsService : IHostsService
    {
        InstanceHttpClient _instance = new InstanceHttpClient();
        private IUserRepository _userRepository;
        private ITriggerService _triggerService;



        public HostsService(IUserRepository userRepository, ITriggerService triggerService)
        {
            _userRepository = userRepository;
            _triggerService = triggerService;
        }

        public List<HostDTO> ListarHostsPorIdGroup(int idGroup, int userID)
        {

            var user = _userRepository.BuscarPorID(userID);

            if (user.Auth == null || user.Auth == "")
            {
                throw new Exception("Erro no Login Zabbix! Relogar");
            }


            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, user.Url);
            request.Content = new StringContent("{\"jsonrpc\": \"2.0\",\"method\": \"host.get\",\"params\": {\"output\":[\"hostid\", \"host\"],\"groupids\": \"" + idGroup + "\"},\"auth\": \"" + user.Auth + "\", \"id\": 1}", Encoding.UTF8, "application/json");
            HttpResponseMessage response = _instance.GetHttpClientInstance().SendAsync(request).Result;

            JArray hostGroups = (JArray)JObject.Parse(response.Content.ReadAsStringAsync().Result)["result"];

            List<HostDTO> lista = new List<HostDTO>();

            foreach (var item in hostGroups)
            {
                HostDTO novoGrupo = new HostDTO();

                novoGrupo.Id = (int)item["hostid"];
                novoGrupo.Nome = item["host"].ToString();

                lista.Add(novoGrupo);
            }

            return lista;
        }
    }
}
