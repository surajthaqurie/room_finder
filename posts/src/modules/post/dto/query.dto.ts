import { Status } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class PostQueryDto {
    @IsEnum(Status)
    // @IsOptional()
    status: Status;
}
