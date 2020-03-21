
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
    public class GroupService : IGroupService
    {
        InstanceHttpClient _instance = new InstanceHttpClient();
        private IUserRepository _userRepository;
        private IHostsService _hostsService;

        public GroupService(IUserRepository userRepository, IHostsService hostsService)
        {
            _userRepository = userRepository;
            _hostsService = hostsService;


        }
        public List<GroupDTO> ListarGroups(int idUsuario)
        {
            try
            {
                var user = _userRepository.BuscarPorID(idUsuario);

                if (user.Auth == null || user.Auth == "")
                {
                    throw new Exception("Erro no Login Zabbix! Relogar");
                }

                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, user.Url);
                request.Content = new StringContent("{\"jsonrpc\": \"2.0\",\"method\": \"hostgroup.get\",\"params\":{\"output\":[\"groupid\", \"name\"]},\"auth\": \"" + user.Auth + "\",\"id\": 1}", Encoding.UTF8, "application/json");
                HttpResponseMessage response = _instance.GetHttpClientInstance().SendAsync(request).Result;

                JArray hostGroups = (JArray)JObject.Parse(response.Content.ReadAsStringAsync().Result)["result"];

                List<GroupDTO> lista = new List<GroupDTO>();

                foreach (var item in hostGroups)
                {
                    GroupDTO novoGrupo = new GroupDTO();

                    novoGrupo.Id = (int)item["groupid"];
                    novoGrupo.Nome = item["name"].ToString();

                    lista.Add(novoGrupo);
                }

                return lista;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
        }
    }
}
