import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BadgeWatcher, StampDefs, StickersScreen } from './components/Badges'
import { EditProfileScreen } from './components/EditProfile'
import { ToastHost } from './components/UI'
import { BecomeHostIntro, BecomeHostOrg, BecomeHostSent } from './screens/BecomeHost'
import { EventScreen } from './screens/Event'
import { Home } from './screens/Home'
import { Joined } from './screens/Joined'
import { EventMap, MapTab } from './screens/Maps'
import { ConnectionsScreen, OrgScreen, PersonScreen } from './screens/People'
import { Plans } from './screens/Plans'
import { MyPost, PostDetails, PostPreview, PostSent, PostStart, PostWhat, PostWhen, PostWhere } from './screens/Post'
import { Profile, SettingsScreen } from './screens/Profile'
import { Search } from './screens/Search'
import { Updates } from './screens/Updates'
import {
  AboutStep,
  CodeStep,
  DoneStep,
  InterestsStep,
  LanguageStep,
  AreaStep,
  PreviewStep,
  PhoneStep,
  PhotoStep,
  Welcome,
} from './screens/onboarding/Onboarding'
import { HostDoneStep, HostLoginStep, HostProfileStep, RoleStep } from './screens/onboarding/Roles'
import { AppProvider, useApp } from './state/AppState'
import { HowOthersSee } from './screens/HowOthersSee'
export function NeedsAccount({ children }) {
  const { onboarded } = useApp()
  const location = useLocation()
  return !onboarded && !location.pathname.startsWith('/signup') ? <Navigate to="/" replace /> : <>{children}</>
}
export function AppRoutes() {
  const { onboarded } = useApp()
  const location = useLocation()
  return (
    <div className="shell">
      <div className="phone">
        <Routes key={location.pathname} location={location}>
          <Route path="/" element={onboarded ? <Navigate to="/home" replace /> : <Welcome />} />
          <Route path="/signup/role" element={<RoleStep />} />
          <Route path="/signup/host" element={<HostLoginStep />} />
          <Route path="/signup/host-profile" element={<HostProfileStep />} />
          <Route path="/signup/host-done" element={<HostDoneStep />} />
          <Route path="/signup/phone" element={<PhoneStep />} />
          <Route path="/signup/code" element={<CodeStep />} />
          <Route path="/signup/language" element={<LanguageStep />} />
          <Route path="/signup/photo" element={<PhotoStep />} />
          <Route path="/signup/name" element={<Navigate to="/signup/photo" replace />} />
          <Route path="/signup/area" element={<AreaStep />} />
          <Route path="/signup/about" element={<AboutStep />} />
          <Route path="/signup/interests" element={<InterestsStep />} />
          <Route path="/signup/preview" element={<PreviewStep />} />
          <Route path="/signup/done" element={<DoneStep />} />
          <Route
            path="/home"
            element={
              <NeedsAccount>
                <Home />
              </NeedsAccount>
            }
          />
          <Route
            path="/search"
            element={
              <NeedsAccount>
                <Search />
              </NeedsAccount>
            }
          />
          <Route
            path="/updates"
            element={
              <NeedsAccount>
                <Updates />
              </NeedsAccount>
            }
          />
          <Route
            path="/event/:id"
            element={
              <NeedsAccount>
                <EventScreen />
              </NeedsAccount>
            }
          />
          <Route
            path="/event/:id/joined"
            element={
              <NeedsAccount>
                <Joined />
              </NeedsAccount>
            }
          />
          <Route
            path="/event/:id/map"
            element={
              <NeedsAccount>
                <EventMap />
              </NeedsAccount>
            }
          />
          <Route
            path="/plans"
            element={
              <NeedsAccount>
                <Plans />
              </NeedsAccount>
            }
          />
          <Route
            path="/map"
            element={
              <NeedsAccount>
                <MapTab />
              </NeedsAccount>
            }
          />
          <Route
            path="/profile/preview"
            element={
              <NeedsAccount>
                <HowOthersSee />
              </NeedsAccount>
            }
          />
          <Route
            path="/profile"
            element={
              <NeedsAccount>
                <Profile />
              </NeedsAccount>
            }
          />
          <Route path="/become-host" element={<Navigate to="/profile" replace />} />
          <Route path="/become-host/org" element={<Navigate to="/profile" replace />} />
          <Route path="/become-host/sent" element={<Navigate to="/profile" replace />} />
          <Route
            path="/person/:id"
            element={
              <NeedsAccount>
                <PersonScreen />
              </NeedsAccount>
            }
          />
          <Route path="/org/:id" element={<Navigate to="/connections" replace />} />
          <Route
            path="/connections"
            element={
              <NeedsAccount>
                <ConnectionsScreen />
              </NeedsAccount>
            }
          />
          <Route
            path="/post/start"
            element={
              <NeedsAccount>
                <PostStart />
              </NeedsAccount>
            }
          />
          <Route
            path="/settings"
            element={
              <NeedsAccount>
                <SettingsScreen />
              </NeedsAccount>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <NeedsAccount>
                <EditProfileScreen />
              </NeedsAccount>
            }
          />
          <Route
            path="/stickers"
            element={
              <NeedsAccount>
                <StickersScreen />
              </NeedsAccount>
            }
          />
          <Route
            path="/post"
            element={
              <NeedsAccount>
                <PostWhat />
              </NeedsAccount>
            }
          />
          <Route
            path="/post/when"
            element={
              <NeedsAccount>
                <PostWhen />
              </NeedsAccount>
            }
          />
          <Route
            path="/post/where"
            element={
              <NeedsAccount>
                <PostWhere />
              </NeedsAccount>
            }
          />
          <Route
            path="/post/details"
            element={
              <NeedsAccount>
                <PostDetails />
              </NeedsAccount>
            }
          />
          <Route
            path="/post/preview"
            element={
              <NeedsAccount>
                <PostPreview />
              </NeedsAccount>
            }
          />
          <Route
            path="/post/sent"
            element={
              <NeedsAccount>
                <PostSent />
              </NeedsAccount>
            }
          />
          <Route
            path="/post/mine/:id"
            element={
              <NeedsAccount>
                <MyPost />
              </NeedsAccount>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastHost />
        <StampDefs />
        <BadgeWatcher />
      </div>
    </div>
  )
}
export function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  )
}
