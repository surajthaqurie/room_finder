import { Status } from "@prisma/client";
import { CreatePostDto } from "./create-post.dto";
import { IsEnum, IsOptional } from "class-validator";

export class UpdatePostDto extends CreatePostDto {
    @IsEnum(Status)
    @IsOptional()
    status: Status;
}
