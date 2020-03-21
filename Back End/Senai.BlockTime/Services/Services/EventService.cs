
using Domains.DTO;
using Domains.Models;
using Newtonsoft.Json.Linq;
using Services.Interfaces;
using Services.Uteis;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Services.Services
{
    public class EventService : IEventService
    {

        InstanceHttpClient _instance = new InstanceHttpClient();
        //public List<Events> ListarEvents(int id)
        //{
        //    var json = "{\"jsonrpc\":\"2.0\",\"method\":\"event.get\",\"params\":{\"output\":[\"objectid\",\"value\",\"clock\"],\"hostids\":\"11239\",\"time_from\":\"1534164025\",\"time_till\":\"1568378425\",\"value\":\"1\",\"sortfield\":\"clock\"},\"auth\":\"be636b57000b0b67527890d5cbd4a5a3\",\"id\":1}";
        //}
        public List<EventDTO> ListarEvents(Usuarios user, FormDTO form, int hostID)
        {
            try
            {
                //var user = _userRepository.BuscarPorID(userId.id);

                if (user.Auth == null || user.Auth == "")
                {
                    throw new Exception("Erro no Login Zabbix! Relogar");
                }

                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, user.Url);
                request.Content = new StringContent("{\"jsonrpc\":\"2.0\",\"method\":\"event.get\",\"params\":{\"output\":\"extend\",\"hostids\":\"" + hostID + "\",\"time_from\":\"" + form.DataInicial + "\",\"time_till\":\"" + form.DataFinal + "\",\"value\":\"1\",\"sortfield\":\"clock\"},\"auth\":\"" + user.Auth + "\",\"id\":1}", Encoding.UTF8, "application/json");
                HttpResponseMessage response = _instance.GetHttpClientInstance().SendAsync(request).Result;

                JArray events = (JArray)JObject.Parse(response.Content.ReadAsStringAsync().Result)["result"];

                List<EventDTO> lista = new List<EventDTO>();

                foreach (var item in events)
                {
                    EventDTO novoEvent = new EventDTO();

                    novoEvent.data = (long)item["clock"];
                    novoEvent.Id = (int)item["eventid"];
                    novoEvent.IdTrigger = (int)item["objectid"];


                    lista.Add(novoEvent);
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

