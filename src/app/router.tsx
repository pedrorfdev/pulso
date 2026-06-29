import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { RootLayout } from "./root-layout";

import { LoginPage } from "@/features/auth/components/login-page";
import { AuthCallbackPage } from "@/features/auth/components/auth-callback-page";
import { SelectOrganizationPage } from "@/features/organizations/components/select-organization-page";
import { JoinOrganizationPage } from "@/features/organizations/components/join-organization-page";
import { CreateOrganizationPage } from "@/features/organizations/components/create-organization-page";
import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import { CreateEventForm } from "@/features/events/components/create-event-form";
import { ManageEventPage } from "@/features/events/components/manage-event-page";
import { SwapsPage } from "@/features/swaps/components/swaps-page";
import { SongLibrary } from "@/features/songs/components/song-library";
import { TechCheckPage } from "@/features/tech-check/components/tech-check-page";
import { OrgStatsPage } from "@/features/stats/components/org-stats-page";
import { NotificationsPage } from "@/features/notifications/components/notifications-page";
import { TeamPage } from "@/features/organizations/components/team-page";
import { SchedulesPage } from "@/features/events/components/schedules-page";
import {
  MyProfilePage,
  MemberProfilePage,
} from "@/features/profile/components/profile-page";
import { AuthGuard } from "@/shared/components/auth-guard";

const rootRoute = createRootRoute({ component: RootLayout });

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
  component: () => (
    <AuthGuard withLayout={false}>
      <JoinOrganizationPage />
    </AuthGuard>
  ),
});
const selectOrgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/select-organization",
  component: () => (
    <AuthGuard withLayout={false}>
      <SelectOrganizationPage />
    </AuthGuard>
  ),
});
const createOrgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create-organization",
  component: () => (
    <AuthGuard withLayout={false}>
      <CreateOrganizationPage />
    </AuthGuard>
  ),
});

// ── Com AppLayout ─────────────────────────────────────────────────────────────

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  ),
});
const createEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/new",
  component: () => (
    <AuthGuard>
      <CreateEventForm />
    </AuthGuard>
  ),
});
const manageEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId/manage",
  component: () => (
    <AuthGuard>
      <ManageEventPage />
    </AuthGuard>
  ),
});
const techCheckRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId/tech-check",
  component: () => (
    <AuthGuard>
      <TechCheckPage />
    </AuthGuard>
  ),
});
const swapsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/swaps",
  component: () => (
    <AuthGuard>
      <SwapsPage />
    </AuthGuard>
  ),
});
const songsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/songs",
  component: () => (
    <AuthGuard>
      <SongLibrary />
    </AuthGuard>
  ),
});
const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats",
  component: () => (
    <AuthGuard>
      <OrgStatsPage />
    </AuthGuard>
  ),
});
const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: () => (
    <AuthGuard>
      <NotificationsPage />
    </AuthGuard>
  ),
});
const teamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/team",
  component: () => (
    <AuthGuard>
      <TeamPage />
    </AuthGuard>
  ),
});
const schedulesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedules",
  component: () => (
    <AuthGuard>
      <SchedulesPage />
    </AuthGuard>
  ),
});

// ── Perfil ────────────────────────────────────────────────────────────────────

const myProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <AuthGuard>
      <MyProfilePage />
    </AuthGuard>
  ),
});
const memberProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/team/$memberId/profile",
  component: () => (
    <AuthGuard>
      <MemberProfilePage />
    </AuthGuard>
  ),
});

// ── Árvore ────────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  authCallbackRoute,
  joinOrgRoute,
  selectOrgRoute,
  createOrgRoute,
  dashboardRoute,
  createEventRoute,
  manageEventRoute,
  techCheckRoute,
  swapsRoute,
  songsRoute,
  statsRoute,
  notificationsRoute,
  teamRoute,
  schedulesRoute,
  myProfileRoute,
  memberProfileRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
