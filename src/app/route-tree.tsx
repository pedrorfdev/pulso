/**
 * route-tree.tsx
 *
 * Declara e exporta a árvore de rotas SEM importar `router` —
 * isso quebra o ciclo de dependência de tipos que fazia os parâmetros
 * dinâmicos ($eventId, $memberId, $token) perderem sua tipagem estrita.
 *
 * O `router.tsx` importa `routeTree` daqui e registra o tipo globalmente.
 * Os componentes importam apenas de @tanstack/react-router, que resolve
 * os tipos a partir do Register global — sem ciclo.
 */
import React from "react";
import { createRootRoute, createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { RootLayout } from "./root-layout";
import { AuthGuard } from "@/shared/components/auth-guard";

const LoginPage = lazyRouteComponent(() => import("@/features/auth/components/login-page"), "LoginPage");
const AuthCallbackPage = lazyRouteComponent(() => import("@/features/auth/components/auth-callback-page"), "AuthCallbackPage");
const SelectOrganizationPage = lazyRouteComponent(() => import("@/features/organizations/components/select-organization-page"), "SelectOrganizationPage");
const JoinOrganizationPage = lazyRouteComponent(() => import("@/features/organizations/components/join-organization-page"), "JoinOrganizationPage");
const CreateOrganizationPage = lazyRouteComponent(() => import("@/features/organizations/components/create-organization-page"), "CreateOrganizationPage");
const DashboardPage = lazyRouteComponent(() => import("@/features/dashboard/components/dashboard-page"), "DashboardPage");
const CreateEventForm = lazyRouteComponent(() => import("@/features/events/components/create-event-form"), "CreateEventForm");
const ManageEventPage = lazyRouteComponent(() => import("@/features/events/components/manage-event-page"), "ManageEventPage");
const EventViewPage = lazyRouteComponent(() => import("@/features/events/components/event-view-page"), "EventViewPage");
const SwapsPage = lazyRouteComponent(() => import("@/features/swaps/components/swaps-page"), "SwapsPage");
const SongLibrary = lazyRouteComponent(() => import("@/features/songs/components/song-library"), "SongLibrary");
const OrgStatsPage = lazyRouteComponent(() => import("@/features/stats/components/org-stats-page"), "OrgStatsPage");
const NotificationsPage = lazyRouteComponent(() => import("@/features/notifications/components/notifications-page"), "NotificationsPage");
const TeamPage = lazyRouteComponent(() => import("@/features/organizations/components/team-page"), "TeamPage");
const SchedulesPage = lazyRouteComponent(() => import("@/features/events/components/schedules-page"), "SchedulesPage");
const MyProfilePage = lazyRouteComponent(() => import("@/features/profile/components/profile-page"), "MyProfilePage");
const MemberProfilePage = lazyRouteComponent(() => import("@/features/profile/components/profile-page"), "MemberProfilePage");

const rootRoute = createRootRoute({ component: RootLayout });

function withAuth(Component: React.ComponentType, withLayout = true) {
  return function AuthenticatedRoute() {
    return (
      <AuthGuard withLayout={withLayout}>
        <Component />
      </AuthGuard>
    );
  };
}

// ── Públicas ──────────────────────────────────────────────────────────────────

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/callback",
  component: AuthCallbackPage,
});

// ── Sem AppLayout ─────────────────────────────────────────────────────────────

const joinOrgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/join/$token",
  component: withAuth(JoinOrganizationPage, false),
});
const selectOrgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/select-organization",
  component: withAuth(SelectOrganizationPage, false),
});
const createOrgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create-organization",
  component: withAuth(CreateOrganizationPage, false),
});

// ── Com AppLayout ─────────────────────────────────────────────────────────────

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: withAuth(DashboardPage),
});
const createEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/new",
  component: withAuth(CreateEventForm),
});
const manageEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId/manage",
  component: withAuth(ManageEventPage),
});
const eventViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId/view",
  component: withAuth(EventViewPage),
});
const swapsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/swaps",
  component: withAuth(SwapsPage),
});
const songsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/songs",
  component: withAuth(SongLibrary),
});
const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats",
  component: withAuth(OrgStatsPage),
});
const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: withAuth(NotificationsPage),
});
const teamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/team",
  component: withAuth(TeamPage),
});
const schedulesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedules",
  component: withAuth(SchedulesPage),
});

// ── Perfil ────────────────────────────────────────────────────────────────────

const myProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: withAuth(MyProfilePage),
});
const memberProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/team/$memberId/profile",
  component: withAuth(MemberProfilePage),
});

// ── Árvore ────────────────────────────────────────────────────────────────────

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  authCallbackRoute,
  joinOrgRoute,
  selectOrgRoute,
  createOrgRoute,
  dashboardRoute,
  createEventRoute,
  manageEventRoute,
  eventViewRoute,
  swapsRoute,
  songsRoute,
  statsRoute,
  notificationsRoute,
  teamRoute,
  schedulesRoute,
  myProfileRoute,
  memberProfileRoute,
]);


