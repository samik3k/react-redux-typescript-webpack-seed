import { EffectsService, IEffectsAction } from 'redux-effects-promise';

import {
  buildEntityRoute,
  provideInSingleton,
  ListActionBuilder,
  BaseEffects,
  effectsBy,
  makeFilteredListEffectsProxy,
  makeUntouchedListEffectsProxy,
  makeFailedListLoadEffectsProxy,
  makeEditedListEffectsProxy,
} from 'react-application-core';

import { IApi } from '../../api/api.interface';
import { ROUTER_PATHS } from '../../app.routes';
import { ROLES_SECTION } from './roles.interface';
import { IRoleEntity } from '../permission.interface';
import { IAppState } from '../../app.interface';
import { ROLE_SECTION } from './role';

@provideInSingleton(RolesEffects)
@effectsBy(
  makeUntouchedListEffectsProxy<IAppState>({
    section: ROLES_SECTION,
    resolver: (state) => state.roles,
  }),
  makeEditedListEffectsProxy<IRoleEntity, IAppState>({
    listSection: ROLES_SECTION,
    formSection: ROLE_SECTION,
    pathResolver: (role) => buildEntityRoute<IRoleEntity>(ROUTER_PATHS.ROLE, role),
  }),
  makeFilteredListEffectsProxy({ section: ROLES_SECTION }),
  makeFailedListLoadEffectsProxy(ROLES_SECTION)
)
class RolesEffects extends BaseEffects<IApi> {

  @EffectsService.effects(ListActionBuilder.buildLoadActionType(ROLES_SECTION))
  public $onRolesSearch(_: IEffectsAction, state: IAppState): Promise<IRoleEntity[]> {
    return this.api.searchRoles(state.roles.filter.query);
  }
}
