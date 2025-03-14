import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
// biome-ignore lint/style/useImportType: <explanation>
import { PaginatedResponseDto } from "@shega/Utilities/models/paginated.response";
import { PasswordService } from "@shega/Utilities/password.service";
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from "typeorm";
// biome-ignore lint/style/useImportType: <explanation>
import { CreateUserDto } from "./dto/create-user.dto";
import { GetPaginatedUsersResponseDto } from "./dto/response/get-all-user.paginated.response.dto";
// biome-ignore lint/style/useImportType: <explanation>
import { updatePasswordRequest } from "./dto/update-password.request.dto";
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRoles } from "./entities/role.entity";
import { User } from "./entities/user.entity";
import { LoginBy } from "./enums/login-by.enum";
import { UserRoleType } from "./enums/user-role.enum";
import {
  type EntityParam,
  entityParamDeserializer,
  entityParamSerializer,
} from "shared/schema";
import { QueryBuilderService } from "shared/query-builder.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserRoles)
    private userRoleRepo: Repository<UserRoles>,
    @Inject(PasswordService) private passwordService: PasswordService,
    @Inject(QueryBuilderService)
    private queryBuilderService: QueryBuilderService
  ) {}

  async createMainAdministrator(createUserDto: CreateUserDto) {
    const check = await this.findOneUser(createUserDto.email, LoginBy.EMAIL);
    if (check) {
      throw new BadRequestException(
        `Email ${createUserDto.email} already exists`
      );
    }
    const user = this.userRepo.create(createUserDto);
    user.email = user.email.toLowerCase();
    const roles = this.userRoleRepo.create();
    roles.role = UserRoleType.Administrator;
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
    saveProfile = true,
    logInType: LoginBy = LoginBy.EMAIL,
    pwdChangeRequired = false
  ) {
    const check = await this.findOneUser(email, logInType);
    if (check) {
      throw new BadRequestException(`Email ${email} already exists`);
    }

    const user = this.userRepo.create({
      email: email.toLowerCase(),
      password: await this.passwordService.hashPassword(
        password ?? "123456789"
      ),
      pwd_change_required: !password || pwdChangeRequired,
    });
    const roles = this.userRoleRepo.create();
    roles.role = role;
    roles.isDefault = true;
    user.roles = [roles];
    if (saveProfile) {
      return await this.userRepo.save(user);
    }
    return user;
  }

  findById(id: string) {
    return this.userRepo.findOneBy({ id });
  }

  async validateUser(login: string, password: string, type: LoginBy) {
    const user = await this.findOneUser(login, type);
    if (
      user &&
      (await this.passwordService.comparePasswords(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  async findOneUser(login: string, type: LoginBy) {
    let user: User;
    switch (type) {
      case LoginBy.EMAIL:
        user = await this.userRepo.findOneBy({
          email: login.toLowerCase(),
        });
        break;
      case LoginBy.ID:
        user = await this.userRepo.findOneBy({ id: login });
        break;
      case LoginBy.USERNAME:
        user = await this.userRepo.findOneBy({ userName: login });
        break;
    }
    if (user) {
      return user;
    }
    return null;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.userRepo.softDelete(id);
  }

  getUserRoles(userId: string) {
    return this.userRoleRepo.findBy({ user: { id: userId } });
  }

  async getUsersByUserType(payload: string) {
    const { p, pp, s, f, o } = entityParamDeserializer(payload);

    const queryParams: EntityParam = {
      p,
      pp,
      s,
      f,
      o: o || [{ f: "createdAt", d: "desc" }],
    };

    const queryString = entityParamSerializer(queryParams);

    const searchableColumns = [
      "entity.email",
      "profile.firstName",
      "profile.lastName",
    ];

    const joinOptions = [
      {
        relation: "entity.profile",
        alias: "profile",
      },
      {
        relation: "entity.roles",
        alias: "roles",
      },
    ];

    const { data: users, total } = await this.queryBuilderService.buildQuery(
      this.userRepo,
      queryString,
      joinOptions,
      searchableColumns
    );

    return new PaginatedResponseDto(
      users.map((user) => new GetPaginatedUsersResponseDto(user)),
      total,
      p,
      pp
    );
  }
}
