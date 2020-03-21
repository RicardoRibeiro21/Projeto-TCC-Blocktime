using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Services.Uteis
{
    public class InstanceHttpClient
    {
        private static HttpClient hhtpClientInstance;

        public HttpClient GetHttpClientInstance()
        {
            if (hhtpClientInstance == null)
            {
                hhtpClientInstance = new HttpClient();
                hhtpClientInstance.DefaultRequestHeaders.ConnectionClose = false;
            }
            return hhtpClientInstance;
        }


    }
}
