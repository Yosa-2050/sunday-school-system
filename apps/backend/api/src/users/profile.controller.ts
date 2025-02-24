import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  BadRequestException,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { NewProfileDto } from "./dto/new-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileService } from "./profile.service";

@ApiBearerAuth()
@ApiTags("Profile")
@Controller("profile")
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiOperation({ deprecated: true })
  @Post("/new/:userId")
  newProfle(@Param("userId") userId: string, @Body() body: NewProfileDto) {
    //this.profileService.create(userId, body);
    throw new BadRequestException(
      "This API is deprecated please contact you administrator"
    );
  }

  @Get()
  findAll() {
    return this.profileService.find();
  }

  @Get("/getByEmail")
  getByEmail(@Query("email") email: string) {
    return this.profileService.findByEmail(email);
  }

  @Get("/getByPhone")
  getByPhone(@Query("phone") phone: string) {
    return this.profileService.findbyPhone(phone);
  }

  @Post("/profilepicture/:profileId")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  ProfilePicture(
    @Param("profileId") profileId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    this.profileService.createProfilePic(profileId, file);
  }

  @Get("/myprofile")
  getMyProfile(@Request() req) {
    var userId = req.user.userId;

    return this.profileService.findByUserId(userId);
  }

  @Get("/:id")
  findProfile(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.profileService.findOne(id);
  }

  @Delete("/:id")
  deleteProfile(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.profileService.remove(id);
  }

  @Patch("/:id")
  updateProfile(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProfileDto
  ) {
    return this.profileService.update(id, dto);
  }
}
