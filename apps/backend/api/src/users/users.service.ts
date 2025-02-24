import {
  BadRequestException,
  Inject,
  Injectable
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { updatePasswordRequest } from "./dto/update-password.request.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserRoleType } from "./enums/user-role.enum";
import { PasswordService } from "src/Utilities/password.service";
import { UserRoles } from "./entities/role.entity";
import { LoginBy } from "./enums/login-by.enum";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserRoles) private userRoleRepo: Repository<UserRoles>,
    @Inject(PasswordService) private passwordService: PasswordService
  ) {}

  async createMainAdministrator(createUserDto: CreateUserDto) {
    const check = await this.findOneUser(createUserDto.email, LoginBy.EMAIL);
    if (check) {
      throw new BadRequestException(
        `Email ${createUserDto.email} already exists`
      );
    }
    const user = this.userRepo.create(createUserDto);
    const roles = this.userRoleRepo.create();
    roles.role = UserRoleType.ADMINISTRATOR;
    user.roles = [roles];
    roles.isDefault = true;
    user.password = await this.passwordService.hashPassword(user.password);
    return this.userRepo.save(user);
  }

  async UpdatePassword(updatePwdDto: updatePasswordRequest) {
    const user = await this.findById(updatePwdDto.id);
    if (!user) {
      throw new BadRequestException("Email doesnt exists");
    }

    user.email = updatePwdDto.email;
    user.password = await this.passwordService.hashPassword(
      updatePwdDto.password
    );
    user.pwd_change_required = false;
    this.userRepo.update({ id: user.id }, user);
    return user;
  }

  async createFromProfile(
    email: string,
    role: UserRoleType,
    password: string,
    saveProfile: boolean = true,
    logInType: LoginBy = LoginBy.EMAIL,
   
  ) {
    const check = await this.findOneUser(email, logInType);
    if (check) {
      throw new BadRequestException(`Email ${email} already exists`);
    }

    //TODO: Create role change logic
    var user = this.userRepo.create({
      email,
      password: await this.passwordService.hashPassword(password ?? "123456789"),
      pwd_change_required: password ? false: true,
    });
    const roles = this.userRoleRepo.create();
    roles.role = role;
    roles.isDefault = true;
    user.roles = [roles];
    if (saveProfile) return this.userRepo.save(user);
    else return user;
  }

  findById(id: string) {
    return this.userRepo.findOneBy({ id });
  }

  async validateUser(login: string, password: string, type: LoginBy) {
    var user = await this.findOneUser(login, type);
    if (user) {
      if (await this.passwordService.comparePasswords(password, user.password))
      {
        return user;
      }
    }
    return null;
  }

  async findOneUser(login: string, type: LoginBy) {
    var user: User;
    switch (type) {
      case LoginBy.EMAIL:
        user = await this.userRepo.findOneBy({ email: login });
        break;
      // case LoginBy.PHONE:
      //   user = await this.userRepo.findOneBy({ phoneNumber: login });
        break;
      case LoginBy.USERNAME:
        user = await this.userRepo.findOneBy({ userName: login });
        break;
    }
    if (user) {
      user.roles = await user.roles;
      return user;
    };
    return null;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.userRepo.softDelete(id);
  }

  getUserRoles(userId: string){
    return this.userRoleRepo.findBy({user: {id: userId}});
  }
}
