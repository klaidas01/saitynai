using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.Constants
{
    public class Authorization
    {
        public enum Roles
        {
            Administrator,
            Employee,
            User
        }

        public const Roles default_role = Roles.User;
        public const string admin_username = "administrator";
        public const string admin_email = "admin@library.com";
    }
}
