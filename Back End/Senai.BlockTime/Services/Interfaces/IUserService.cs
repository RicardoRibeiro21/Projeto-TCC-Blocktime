
using Domains.DTO;
using Domains.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface IUserService
    {
        Usuarios Login(LoginDTO userLogin);

        string LoginZabbix(Usuarios userLogin);

        void Logoff(int id);

        Usuarios EditarUsuario(Usuarios user);

        Usuarios GetUserByID(int id);
    }
}
