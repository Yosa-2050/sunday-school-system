import { BaseModel } from "@shega/Utilities/entities/base-model.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Applicants } from "./applicants.entity";

@Entity()
export class ApplicantSkills extends BaseModel{
     @ManyToOne(() => Applicants, {
               eager: true,
               nullable: false,
           })
        applicant: Applicants;
    @Column()
        skill: string;
}