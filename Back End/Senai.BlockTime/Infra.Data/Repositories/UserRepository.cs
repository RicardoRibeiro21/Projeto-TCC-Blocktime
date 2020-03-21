
using Domains.DTO;
using Domains.Models;
using Infra.Data.Context;
using Infra.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Infra.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        public Usuarios AlterarUsuario(Usuarios user)
        {
            try
            {
                using (ContextBlockTime ctx = new ContextBlockTime())
                {
                    ctx.Entry<Usuarios>(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    ctx.SaveChanges();
                    return user;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public Usuarios BuscarPorID(int id)
        {
            try
            {
                using (ContextBlockTime ctx = new ContextBlockTime())
                {
                    return ctx.Usuarios.FirstOrDefault(x => x.Id == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao buscar usuário.");
            }
        }

        public Usuarios InserindoAuth(Usuarios user)
        {
            try
            {
                using (ContextBlockTime ctx = new ContextBlockTime())
                {
                    ctx.Entry<Usuarios>(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    ctx.SaveChanges();
                    return user;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public Usuarios Login(LoginDTO userLogin)
        {

            try
            {
                using (ContextBlockTime ctx = new ContextBlockTime())
                {
                    return ctx.Usuarios.FirstOrDefault(x => x.Login == userLogin.Login && x.Senha == userLogin.Senha);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public Usuarios RemovendoAuth(Usuarios user)
        {
            try
            {
                user.Auth = null;

                using (ContextBlockTime ctx = new ContextBlockTime())
                {
                    ctx.Entry<Usuarios>(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    ctx.SaveChanges();
                    return user;
                }

            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao deslogar");
            }
        }
    }
}
