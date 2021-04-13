/* tslint:disable */
import { Injectable } from '@angular/core';
import { AccessToken } from '../../models/AccessToken';
import { ACL } from '../../models/ACL';
import { RoleMapping } from '../../models/RoleMapping';
import { Role } from '../../models/Role';
import { User } from '../../models/User';
import { UserAppMapping } from '../../models/UserAppMapping';
import { Site } from '../../models/Site';
import { Plant } from '../../models/Plant';
import { Project } from '../../models/Project';
import { App } from '../../models/App';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    AccessToken: AccessToken,
    ACL: ACL,
    RoleMapping: RoleMapping,
    Role: Role,
    User: User,
    UserAppMapping: UserAppMapping,
    Site: Site,
    Plant: Plant,
    Project: Project,
    App: App,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
