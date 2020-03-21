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
    public class TriggerService : ITriggerService
    {
        InstanceHttpClient _instance = new InstanceHttpClient();
        private IUserRepository _userRepository;

        public TriggerService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public List<TriggerDTO> BuscarTriggers(Usuarios user, int hostID)
        {

            //var json = "{\"jsonrpc\":\"2.0\",\"method\":\"trigger.get\",\"params\":{\"output\":[\"triggerid\",\"deion\"],\"groupids\":\"" + groupID + "\"},\"auth\":\"" + user.Auth + "\",\"id\":1}";

            try
            {
                //var user = _userRepository.BuscarPorID(userId.id);

                if (user.Auth == null || user.Auth == "")
                {
                    throw new Exception("Erro no Login Zabbix! Relogar");
                }

                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, user.Url);
                request.Content = new StringContent("{\"jsonrpc\":\"2.0\",\"method\":\"trigger.get\",\"params\":{\"output\":\"extend\",\"hostids\":\"" + hostID + "\"},\"auth\":\"" + user.Auth + "\",\"id\":1}", Encoding.UTF8, "application/json");
                HttpResponseMessage response = _instance.GetHttpClientInstance().SendAsync(request).Result;

                JArray triggers = (JArray)JObject.Parse(response.Content.ReadAsStringAsync().Result)["result"];

                List<TriggerDTO> lista = new List<TriggerDTO>();

                foreach (var item in triggers)
                {
                    TriggerDTO novaTrigger = new TriggerDTO();

                    novaTrigger.Id = (int)item["triggerid"];
                    novaTrigger.Mensagem = item["description"].ToString();

                    lista.Add(novaTrigger);
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

