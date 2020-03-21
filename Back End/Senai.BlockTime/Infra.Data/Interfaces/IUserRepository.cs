using Domains.DTO;
using Domains.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infra.Data.Interfaces
{
    public interface IUserRepository
    {
        Usuarios Login(LoginDTO userLogin);

        Usuarios InserindoAuth(Usuarios user);

        Usuarios BuscarPorID(int id);

        Usuarios RemovendoAuth(Usuarios user);

        Usuarios AlterarUsuario(Usuarios user);
    }
}
