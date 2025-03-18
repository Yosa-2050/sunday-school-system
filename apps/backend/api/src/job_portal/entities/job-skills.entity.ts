import { BaseModel } from "@shega/Utilities/entities/base-model.entity";
import { Entity, ManyToOne } from "typeorm";
import { Jobs } from "./jobs.entity";
import { Skills } from "./skills.entity";

@Entity()
export class JobSkills extends BaseModel{
    @ManyToOne(() => Jobs, {
                eager: true,
                nullable: false
            })
    job: Jobs;

    @ManyToOne(() => Skills, {
                eager: true,
                nullable: false
            })
    skill: Skills;
}