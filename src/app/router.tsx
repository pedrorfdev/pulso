import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router"
import { RootLayout } from "./root-layout"

// Auth
import { LoginPage } from "@/features/auth/components/login-page"
import { AuthCallbackPage } from "@/features/auth/components/auth-callback-page"

// Org
import { SelectOrganizationPage } from "@/features/organizations/components/select-organization-page"
import { JoinOrganizationPage } from "@/features/organizations/components/join-organization-page"
import { CreateOrganizationPage } from "@/features/organizations/components/create-organization-page"

// Dashboard
import { DashboardPage } from "@/features/dashboard/components/dashboard-page"

// Events
import { CreateEventForm } from "@/features/events/components/create-event-form"
import { ManageEventPage } from "@/features/events/components/manage-event-page"

// Swaps
import { SwapsPage } from "@/features/swaps/components/swaps-page"

// Songs
import { SongLibrary } from "@/features/songs/components/song-library"

// Tech Check
import { TechCheckPage } from "@/features/tech-check/components/tech-check-page"

// Stats
import { StatsPage } from "@/features/stats/components/stats-page"

// Notifications
import { NotificationsPage } from "@/features/notifications/components/notifications-page"

// Guards
import { AuthGuard } from "@/shared/components/auth-guard"

const rootRoute = createRootRoute({ component: RootLayout })

// ── Rotas públicas / auth ─────────────────────────────────────────────────────

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
})

const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/callback",
  component: AuthCallbackPage,
})

// ── Rotas sem AppLayout (full-screen) ────────────────────────────────────────

const joinOrgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/join/$token",
  component: () => <AuthGuard withLayout={false}><JoinOrganizationPage /></AuthGuard>,
})

const selectOrgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/select-organization",
  component: () => <AuthGuard withLayout={false}><SelectOrganizationPage /></AuthGuard>,
})

const createOrgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create-organization",
  component: () => <AuthGuard withLayout={false}><CreateOrganizationPage /></AuthGuard>,
})

// ── Rotas com AppLayout (header + bottom nav) ─────────────────────────────────

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => <AuthGuard><DashboardPage /></AuthGuard>,
})

const createEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/new",
  component: () => <AuthGuard><CreateEventForm /></AuthGuard>,
})

const manageEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId/manage",
  component: () => <AuthGuard><ManageEventPage /></AuthGuard>,
})

const techCheckRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId/tech-check",
  component: () => <AuthGuard><TechCheckPage /></AuthGuard>,
})

const swapsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/swaps",
  component: () => <AuthGuard><SwapsPage /></AuthGuard>,
})

const songsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/songs",
  component: () => <AuthGuard><SongLibrary /></AuthGuard>,
})

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats",
  component: () => <AuthGuard><StatsPage /></AuthGuard>,
})

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: () => <AuthGuard><NotificationsPage /></AuthGuard>,
})

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
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
