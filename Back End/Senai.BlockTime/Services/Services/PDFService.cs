
using Domains.DTO;
using Domains.Models;
using Infra.Data.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Services.Services
{
    public class PDFService : IPDFService
    {
        private IHostsService _hostService;

        private ITriggerService _triggerService;

        private IUserRepository _userRepository;

        private IEventService _eventService;


        public PDFService(IHostsService hostService, ITriggerService triggerService, IUserRepository userRepository, IEventService eventService)
        {
            _hostService = hostService;
            _triggerService = triggerService;
            _userRepository = userRepository;
            _eventService = eventService;
        }

        /// <summary>
        /// method for converting a System.DateTime value to a UNIX Timestamp
        /// </summary>
        /// <param name = "value" > date to convert/// <returns></returns>
        //private static double ConvertToTimestamp(DateTime value)
        ////{
        ////    create Timespan by subtracting the value provided from
        ////    the Unix Epoch
        //    TimeSpan span = (value - new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime());

        //    return (double)span.TotalSeconds;

        //}


        public List<HostDTO> InformacoesPDF(FormDTO form, int userID)
        {
            Usuarios user = _userRepository.BuscarPorID(userID);
            var listaHosts = _hostService.ListarHostsPorIdGroup(form.GroupID, user.Id);

            //var dataInicio = ConvertToTimestamp(form.DataInicial);
            //var dataFinal = ConvertToTimestamp(form.DataFinal);

            foreach (var item in listaHosts)
            {
                var listaTrigger = _triggerService.BuscarTriggers(user, item.Id);

                var listaEvents = _eventService.ListarEvents(user, form, item.Id);

                //foreach (var events in listaEvents.Where(x => x.data > form.DataInicial && x.data < form.DataFinal))
                    foreach (var events in listaEvents)
                    {
                        var triggerEvent = listaTrigger.FirstOrDefault(x => x.Id == events.IdTrigger);

                        events.Mensagem = triggerEvent.Mensagem;

                    }

                item.listaEvent = listaEvents;
            }
            List<HostDTO> listaHost = new List<HostDTO>();
            return listaHost;
        }
    }
}
