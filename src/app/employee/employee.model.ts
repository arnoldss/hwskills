import { Skill } from '../shared/models/skill.model';
import { Study } from '../shared/models/study.model';
import { Project } from '../shared/models/project.model';

export class Employee {
    docId: string;
    email: string;
    idEmployee: string;
    livingCity: string;
    livingCountry: string;
    mainRole: string;
    name: string;
    projects: Project[];
    lastStudy: Study;
    skills: Skill[];
    employeeUid: string;
    authorUid: string;
    workLocation: string;
}
