import { StrictMode } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
  Routes,
  useLocation,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { ApolloProvider } from '@/apollo/components/ApolloProvider';
import { AuthProvider } from '@/auth/components/AuthProvider';
import { VerifyEffect } from '@/auth/components/VerifyEffect';
import { ChromeExtensionSidecarEffect } from '@/chrome-extension-sidecar/components/ChromeExtensionSidecarEffect';
import { ChromeExtensionSidecarProvider } from '@/chrome-extension-sidecar/components/ChromeExtensionSidecarProvider';
import { ClientConfigProvider } from '@/client-config/components/ClientConfigProvider';
import { ClientConfigProviderEffect } from '@/client-config/components/ClientConfigProviderEffect';
import { billingState } from '@/client-config/states/billingState';
import { PromiseRejectionEffect } from '@/error-handler/components/PromiseRejectionEffect';
import indexAppPath from '@/navigation/utils/indexAppPath';
import { ApolloMetadataClientProvider } from '@/object-metadata/components/ApolloMetadataClientProvider';
import { ObjectMetadataItemsProvider } from '@/object-metadata/components/ObjectMetadataItemsProvider';
import { PrefetchDataProvider } from '@/prefetch/components/PrefetchDataProvider';
import { AppPath } from '@/types/AppPath';
import { SettingsPath } from '@/types/SettingsPath';
import { DialogManager } from '@/ui/feedback/dialog-manager/components/DialogManager';
import { DialogManagerScope } from '@/ui/feedback/dialog-manager/scopes/DialogManagerScope';
import { SnackBarProvider } from '@/ui/feedback/snack-bar-manager/components/SnackBarProvider';
import { BlankLayout } from '@/ui/layout/page/BlankLayout';
import { DefaultLayout } from '@/ui/layout/page/DefaultLayout';
import { AppThemeProvider } from '@/ui/theme/components/AppThemeProvider';
import { PageTitle } from '@/ui/utilities/page-title/PageTitle';
import { UserProvider } from '@/users/components/UserProvider';
import { UserProviderEffect } from '@/users/components/UserProviderEffect';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { CommandMenuEffect } from '~/effect-components/CommandMenuEffect';
import { GotoHotkeysEffect } from '~/effect-components/GotoHotkeysEffect';
import { PageChangeEffect } from '~/effect-components/PageChangeEffect';
import { Authorize } from '~/pages/auth/Authorize';
import { Invite } from '~/pages/auth/Invite';
import { PasswordReset } from '~/pages/auth/PasswordReset';
import { SignInUp } from '~/pages/auth/SignInUp';
import { ImpersonateEffect } from '~/pages/impersonate/ImpersonateEffect';
import { NotFound } from '~/pages/not-found/NotFound';
import { RecordIndexPage } from '~/pages/object-record/RecordIndexPage';
import { RecordShowPage } from '~/pages/object-record/RecordShowPage';
import { ChooseYourPlan } from '~/pages/onboarding/ChooseYourPlan';
import { CreateProfile } from '~/pages/onboarding/CreateProfile';
import { CreateWorkspace } from '~/pages/onboarding/CreateWorkspace';
import { InviteTeam } from '~/pages/onboarding/InviteTeam';
import { PaymentSuccess } from '~/pages/onboarding/PaymentSuccess';
import { SyncEmails } from '~/pages/onboarding/SyncEmails';
import { SettingsAccounts } from '~/pages/settings/accounts/SettingsAccounts';
import { SettingsAccountsCalendars } from '~/pages/settings/accounts/SettingsAccountsCalendars';
import { SettingsAccountsEmails } from '~/pages/settings/accounts/SettingsAccountsEmails';
import { SettingsNewAccount } from '~/pages/settings/accounts/SettingsNewAccount';
import { SettingsCRMMigration } from '~/pages/settings/crm-migration/SettingsCRMMigration';
import { SettingsNewObject } from '~/pages/settings/data-model/SettingsNewObject';
import { SettingsObjectDetailPage } from '~/pages/settings/data-model/SettingsObjectDetailPage';
import { SettingsObjectEdit } from '~/pages/settings/data-model/SettingsObjectEdit';
import { SettingsObjectFieldEdit } from '~/pages/settings/data-model/SettingsObjectFieldEdit';
import { SettingsObjectNewFieldStep1 } from '~/pages/settings/data-model/SettingsObjectNewField/SettingsObjectNewFieldStep1';
import { SettingsObjectNewFieldStep2 } from '~/pages/settings/data-model/SettingsObjectNewField/SettingsObjectNewFieldStep2';
import { SettingsObjectOverview } from '~/pages/settings/data-model/SettingsObjectOverview';
import { SettingsObjects } from '~/pages/settings/data-model/SettingsObjects';
import { SettingsDevelopersApiKeyDetail } from '~/pages/settings/developers/api-keys/SettingsDevelopersApiKeyDetail';
import { SettingsDevelopersApiKeysNew } from '~/pages/settings/developers/api-keys/SettingsDevelopersApiKeysNew';
import { SettingsDevelopers } from '~/pages/settings/developers/SettingsDevelopers';
import { SettingsDevelopersWebhooksDetail } from '~/pages/settings/developers/webhooks/SettingsDevelopersWebhookDetail';
import { SettingsDevelopersWebhooksNew } from '~/pages/settings/developers/webhooks/SettingsDevelopersWebhooksNew';
import { SettingsIntegrationDatabase } from '~/pages/settings/integrations/SettingsIntegrationDatabase';
import { SettingsIntegrationEditDatabaseConnection } from '~/pages/settings/integrations/SettingsIntegrationEditDatabaseConnection';
import { SettingsIntegrationNewDatabaseConnection } from '~/pages/settings/integrations/SettingsIntegrationNewDatabaseConnection';
import { SettingsIntegrations } from '~/pages/settings/integrations/SettingsIntegrations';
import { SettingsIntegrationShowDatabaseConnection } from '~/pages/settings/integrations/SettingsIntegrationShowDatabaseConnection';
import { SettingsAppearance } from '~/pages/settings/profile/appearance/components/SettingsAppearance';
import { Releases } from '~/pages/settings/Releases';
import { SettingsServerlessFunctionDetailWrapper } from '~/pages/settings/serverless-functions/SettingsServerlessFunctionDetailWrapper';
import { SettingsServerlessFunctions } from '~/pages/settings/serverless-functions/SettingsServerlessFunctions';
import { SettingsServerlessFunctionsNew } from '~/pages/settings/serverless-functions/SettingsServerlessFunctionsNew';
import { SettingsBilling } from '~/pages/settings/SettingsBilling';
import { SettingsProfile } from '~/pages/settings/SettingsProfile';
import { SettingsWorkspace } from '~/pages/settings/SettingsWorkspace';
import { SettingsWorkspaceMembers } from '~/pages/settings/SettingsWorkspaceMembers';
import { WorkflowShowPage } from '~/pages/workflows/WorkflowShowPage';
import { getPageTitleFromPath } from '~/utils/title-utils';

const ProvidersThatNeedRouterContext = () => {
  const { pathname } = useLocation();
  const pageTitle = getPageTitleFromPath(pathname);

  return (
    <>
      <ApolloProvider>
        <ClientConfigProviderEffect />
        <ClientConfigProvider>
          <ChromeExtensionSidecarEffect />
          <ChromeExtensionSidecarProvider>
            <UserProviderEffect />
            <UserProvider>
              <AuthProvider>
                <ApolloMetadataClientProvider>
                  <ObjectMetadataItemsProvider>
                    <PrefetchDataProvider>
                      <AppThemeProvider>
                        <SnackBarProvider>
                          <DialogManagerScope dialogManagerScopeId="dialog-manager">
                            <DialogManager>
                              <StrictMode>
                                <PromiseRejectionEffect />
                                <CommandMenuEffect />
                                <GotoHotkeysEffect />
                                <PageTitle title={pageTitle} />
                                <Outlet />
                              </StrictMode>
                            </DialogManager>
                          </DialogManagerScope>
                        </SnackBarProvider>
                      </AppThemeProvider>
                    </PrefetchDataProvider>
                    <PageChangeEffect />
                  </ObjectMetadataItemsProvider>
                </ApolloMetadataClientProvider>
              </AuthProvider>
            </UserProvider>
          </ChromeExtensionSidecarProvider>
        </ClientConfigProvider>
      </ApolloProvider>
    </>
  );
};

const createRouter = (
  isBillingEnabled?: boolean,
  isCRMMigrationEnabled?: boolean,
  isServerlessFunctionSettingsEnabled?: boolean,
  isWorkflowEnabled?: boolean,
) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={<ProvidersThatNeedRouterContext />}
        // To switch state to `loading` temporarily to enable us
        // to set scroll position before the page is rendered
        loader={async () => Promise.resolve(null)}
      >
        <Route element={<DefaultLayout />}>
          <Route path={AppPath.Verify} element={<VerifyEffect />} />
          <Route path={AppPath.SignInUp} element={<SignInUp />} />
          <Route path={AppPath.Invite} element={<Invite />} />
          <Route path={AppPath.ResetPassword} element={<PasswordReset />} />
          <Route path={AppPath.CreateWorkspace} element={<CreateWorkspace />} />
          <Route path={AppPath.CreateProfile} element={<CreateProfile />} />
          <Route path={AppPath.SyncEmails} element={<SyncEmails />} />
          <Route path={AppPath.InviteTeam} element={<InviteTeam />} />
          <Route path={AppPath.PlanRequired} element={<ChooseYourPlan />} />
          <Route
            path={AppPath.PlanRequiredSuccess}
            element={<PaymentSuccess />}
          />
          <Route path={indexAppPath.getIndexAppPath()} element={<></>} />
          <Route path={AppPath.Impersonate} element={<ImpersonateEffect />} />
          <Route path={AppPath.RecordIndexPage} element={<RecordIndexPage />} />
          <Route path={AppPath.RecordShowPage} element={<RecordShowPage />} />

          {isWorkflowEnabled === true ? (
            <Route
              path={AppPath.WorkflowShowPage}
              element={<WorkflowShowPage />}
            />
          ) : null}

          <Route
            path={AppPath.SettingsCatchAll}
            element={
              <Routes>
                <Route
                  path={SettingsPath.ProfilePage}
                  element={<SettingsProfile />}
                />
                <Route
                  path={SettingsPath.Appearance}
                  element={<SettingsAppearance />}
                />
                <Route
                  path={SettingsPath.Accounts}
                  element={<SettingsAccounts />}
                />
                <Route
                  path={SettingsPath.NewAccount}
                  element={<SettingsNewAccount />}
                />
                <Route
                  path={SettingsPath.AccountsCalendars}
                  element={<SettingsAccountsCalendars />}
                />
                <Route
                  path={SettingsPath.AccountsEmails}
                  element={<SettingsAccountsEmails />}
                />
                {isBillingEnabled && (
                  <Route
                    path={SettingsPath.Billing}
                    element={<SettingsBilling />}
                  />
                )}
                <Route
                  path={SettingsPath.WorkspaceMembersPage}
                  element={<SettingsWorkspaceMembers />}
                />
                <Route
                  path={SettingsPath.Workspace}
                  element={<SettingsWorkspace />}
                />
                <Route
                  path={SettingsPath.Objects}
                  element={<SettingsObjects />}
                />
                <Route
                  path={SettingsPath.ObjectOverview}
                  element={<SettingsObjectOverview />}
                />
                <Route
                  path={SettingsPath.ObjectDetail}
                  element={<SettingsObjectDetailPage />}
                />
                <Route
                  path={SettingsPath.ObjectEdit}
                  element={<SettingsObjectEdit />}
                />
                <Route
                  path={SettingsPath.NewObject}
                  element={<SettingsNewObject />}
                />
                <Route
                  path={SettingsPath.Developers}
                  element={<SettingsDevelopers />}
                />
                {isCRMMigrationEnabled && (
                  <Route
                    path={SettingsPath.CRMMigration}
                    element={<SettingsCRMMigration />}
                  />
                )}
                <Route
                  path={AppPath.DevelopersCatchAll}
                  element={
                    <Routes>
                      <Route
                        path={SettingsPath.DevelopersNewApiKey}
                        element={<SettingsDevelopersApiKeysNew />}
                      />
                      <Route
                        path={SettingsPath.DevelopersApiKeyDetail}
                        element={<SettingsDevelopersApiKeyDetail />}
                      />
                      <Route
                        path={SettingsPath.DevelopersNewWebhook}
                        element={<SettingsDevelopersWebhooksNew />}
                      />
                      <Route
                        path={SettingsPath.DevelopersNewWebhookDetail}
                        element={<SettingsDevelopersWebhooksDetail />}
                      />
                    </Routes>
                  }
                />
                {isServerlessFunctionSettingsEnabled && (
                  <>
                    <Route
                      path={SettingsPath.ServerlessFunctions}
                      element={<SettingsServerlessFunctions />}
                    />
                    <Route
                      path={SettingsPath.NewServerlessFunction}
                      element={<SettingsServerlessFunctionsNew />}
                    />
                    <Route
                      path={SettingsPath.ServerlessFunctionDetail}
                      element={<SettingsServerlessFunctionDetailWrapper />}
                    />
                  </>
                )}
                <Route
                  path={SettingsPath.Integrations}
                  element={<SettingsIntegrations />}
                />
                <Route
                  path={SettingsPath.IntegrationDatabase}
                  element={<SettingsIntegrationDatabase />}
                />
                <Route
                  path={SettingsPath.IntegrationNewDatabaseConnection}
                  element={<SettingsIntegrationNewDatabaseConnection />}
                />
                <Route
                  path={SettingsPath.IntegrationEditDatabaseConnection}
                  element={<SettingsIntegrationEditDatabaseConnection />}
                />
                <Route
                  path={SettingsPath.IntegrationDatabaseConnection}
                  element={<SettingsIntegrationShowDatabaseConnection />}
                />
                <Route
                  path={SettingsPath.ObjectNewFieldStep1}
                  element={<SettingsObjectNewFieldStep1 />}
                />
                <Route
                  path={SettingsPath.ObjectNewFieldStep2}
                  element={<SettingsObjectNewFieldStep2 />}
                />
                <Route
                  path={SettingsPath.ObjectFieldEdit}
                  element={<SettingsObjectFieldEdit />}
                />
                <Route path={SettingsPath.Releases} element={<Releases />} />
              </Routes>
            }
          />
          <Route path={AppPath.NotFoundWildcard} element={<NotFound />} />
        </Route>
        <Route element={<BlankLayout />}>
          <Route path={AppPath.Authorize} element={<Authorize />} />
        </Route>
      </Route>,
    ),
  );

export const App = () => {
  const billing = useRecoilValue(billingState);
  const isFreeAccessEnabled = useIsFeatureEnabled('IS_FREE_ACCESS_ENABLED');
  const isCRMMigrationEnabled = useIsFeatureEnabled('IS_CRM_MIGRATION_ENABLED');
  const isServerlessFunctionSettingsEnabled = useIsFeatureEnabled(
    'IS_FUNCTION_SETTINGS_ENABLED',
  );
  const isWorkflowEnabled = useIsFeatureEnabled('IS_WORKFLOW_ENABLED');

  const isBillingPageEnabled =
    billing?.isBillingEnabled && !isFreeAccessEnabled;

  return (
    <RouterProvider
      router={createRouter(
        isBillingPageEnabled,
        isCRMMigrationEnabled,
        isServerlessFunctionSettingsEnabled,
        isWorkflowEnabled,
      )}
    />
  );
};
