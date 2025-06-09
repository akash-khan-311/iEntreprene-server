import config from '../config';
import { USER_ROLE } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';
import bcrypt from 'bcrypt';
const superUser = {
  name: {
    firstName: 'Super',
    lastName: 'Admin',
  },
  email: 'info@ientreprene.org',
  password: config.super_admin_password,
  country: 'Bangladesh', 
  gender: 'other',
  role: USER_ROLE.superAdmin,
  status: 'active',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });
  if (!isSuperAdminExists) {
     const hashedPassword = await bcrypt.hash(superUser.password ?? '', 10);
      superUser.password = hashedPassword;
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
