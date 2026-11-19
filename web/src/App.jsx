import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Platforms from './components/Platforms'
import Configurator from './components/Configurator'
import SavedBuildsDrawer from './components/SavedBuildsDrawer'
import ShopTickets from './components/ShopTickets'
import useSavedBuilds, { getBuildId } from './hooks/useSavedBuilds'
import useTickets, {
  TICKET_STATUS,
  findTicketForBuild,
  isLockedTicketStatus,
  nextTicketNumber,
} from './hooks/useTickets'
import {
  VEHICLES,
  getCompatibleParts,
  getPartById,
  isPartCompatible,
} from './data/catalog'
import { makeId } from './lib/format'

const DEFAULT_VEHICLE_ID = VEHICLES[0].id

const LOCKED_MESSAGE =
  'This vehicle is currently IN THE BAY on the shop floor. Modifications are locked while technicians are working on it.'

const samePartIds = (left = [], right = []) => {
  if (left.length !== right.length) return false
  const leftSet = new Set(left)
  return right.every((partId) => leftSet.has(partId))
}

export default function App() {
  const [activeVehicleId, setActiveVehicleId] = useState(DEFAULT_VEHICLE_ID)
  const [selectedPartIds, setSelectedPartIds] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [buildName, setBuildName] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [technicianMode, setTechnicianMode] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [activeBuildId, setActiveBuildId] = useState(null)
  const [activeTicketId, setActiveTicketId] = useState(null)

  const { builds, addBuild, updateBuild, removeBuild } = useSavedBuilds()
  const {
    tickets,
    addTicket,
    updateTicket,
    advanceTicket,
    removeTicket,
    clearCompletedTickets,
  } = useTickets()

  const activeVehicle = VEHICLES.find((vehicle) => vehicle.id === activeVehicleId) ?? VEHICLES[0]

  const compatibleParts = useMemo(
    () => getCompatibleParts(activeVehicleId),
    [activeVehicleId],
  )

  const selectedParts = useMemo(
    () => selectedPartIds.map((partId) => getPartById(partId)).filter(Boolean),
    [selectedPartIds],
  )

  const total = useMemo(
    () =>
      selectedParts.reduce((sum, part) => sum + part.priceModifier, activeVehicle.basePrice),
    [activeVehicle, selectedParts],
  )

  const resolvedBuildName = buildName.trim() || `${activeVehicle.name} Custom`
  const resolvedTotal = Number(total.toFixed(2))

  // The ticket status is read live so a bay advance locks the loaded build
  // without reloading it.
  const activeTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === activeTicketId) ?? null,
    [activeTicketId, tickets],
  )

  const queuedTicket = activeTicket?.status === TICKET_STATUS.QUEUED ? activeTicket : null
  const isLocked = Boolean(activeTicket && isLockedTicketStatus(activeTicket.status))

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  // Live sync: every edit on a build whose ticket is still queued is written
  // straight onto that ticket card.
  useEffect(() => {
    if (!queuedTicket) return
    const unchanged =
      queuedTicket.vehicleId === activeVehicle.id &&
      queuedTicket.buildName === resolvedBuildName &&
      queuedTicket.totalPrice === resolvedTotal &&
      samePartIds(queuedTicket.partIds ?? [], selectedPartIds)
    if (unchanged) return

    updateTicket(queuedTicket.id, {
      vehicleId: activeVehicle.id,
      buildName: resolvedBuildName,
      partIds: [...selectedPartIds],
      totalPrice: resolvedTotal,
    })
  }, [activeVehicle, queuedTicket, resolvedBuildName, resolvedTotal, selectedPartIds, updateTicket])

  const notify = useCallback((message) => {
    setToast({ id: Date.now(), message })
  }, [])

  const scrollToSection = useCallback((sectionId) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleSelectVehicle = useCallback(
    (vehicleId, { scroll = false } = {}) => {
      if (isLocked) return
      if (!VEHICLES.some((vehicle) => vehicle.id === vehicleId)) return

      setActiveVehicleId(vehicleId)
      // Any part that is not mapped to the new chassis is dropped before the
      // total is recalculated.
      setSelectedPartIds((previous) =>
        previous.filter((partId) => isPartCompatible(vehicleId, partId)),
      )
      setActiveCategory('all')

      if (scroll) scrollToSection('configurator')
    },
    [isLocked, scrollToSection],
  )

  const handleTogglePart = useCallback(
    (partId) => {
      if (isLocked) return
      if (!isPartCompatible(activeVehicleId, partId)) return
      setSelectedPartIds((previous) =>
        previous.includes(partId)
          ? previous.filter((id) => id !== partId)
          : [...previous, partId],
      )
    },
    [activeVehicleId, isLocked],
  )

  const handleSave = useCallback(() => {
    if (isLocked) return

    const activeBuild = activeBuildId
      ? builds.find((build) => getBuildId(build) === activeBuildId)
      : null

    if (activeBuild) {
      updateBuild(activeBuild.id, {
        name: resolvedBuildName,
        vehicleId: activeVehicle.id,
        partIds: [...selectedPartIds],
        totalPrice: resolvedTotal,
      })
      notify('Build updated in your garage')
    } else {
      const buildId = activeBuildId ?? makeId()
      addBuild({
        id: makeId(),
        buildId,
        name: resolvedBuildName,
        vehicleId: activeVehicle.id,
        partIds: [...selectedPartIds],
        totalPrice: resolvedTotal,
        createdAt: new Date().toISOString(),
      })
      setActiveBuildId(buildId)
      notify('Build saved to your garage')
    }

    setDrawerOpen(true)
  }, [
    activeBuildId,
    activeVehicle,
    addBuild,
    builds,
    isLocked,
    notify,
    resolvedBuildName,
    resolvedTotal,
    selectedPartIds,
    updateBuild,
  ])

  const handleSubmitTicket = useCallback(() => {
    if (isLocked) return

    const buildId = activeBuildId ?? makeId()
    const spec = {
      customerName: customerName.trim() || 'Walk-in customer',
      buildName: resolvedBuildName,
      vehicleId: activeVehicle.id,
      partIds: [...selectedPartIds],
      totalPrice: resolvedTotal,
    }

    const queued = findTicketForBuild(tickets, buildId)

    if (queued && queued.status === TICKET_STATUS.QUEUED) {
      updateTicket(queued.id, spec)
      setActiveBuildId(buildId)
      setActiveTicketId(queued.id)
      notify(`Ticket #${queued.id} updated with your latest spec`)
    } else {
      const ticket = {
        id: nextTicketNumber(tickets),
        buildId,
        ...spec,
        status: TICKET_STATUS.QUEUED,
        createdAt: new Date().toISOString(),
      }
      addTicket(ticket)
      setActiveBuildId(buildId)
      setActiveTicketId(ticket.id)
      notify(`Ticket #${ticket.id} queued in bay 01`)
    }

    setCustomerName('')
    scrollToSection('shop')
  }, [
    activeBuildId,
    activeVehicle,
    addTicket,
    customerName,
    isLocked,
    notify,
    resolvedBuildName,
    resolvedTotal,
    scrollToSection,
    selectedPartIds,
    tickets,
    updateTicket,
  ])

  const handleToggleTechnician = useCallback(() => {
    setTechnicianMode((previous) => !previous)
  }, [])

  const handleLoad = useCallback(
    (build) => {
      const vehicle = VEHICLES.find((item) => item.id === build.vehicleId)
      if (!vehicle) {
        notify('That build’s chassis is no longer available')
        return
      }

      const buildId = getBuildId(build)
      const ticket = findTicketForBuild(tickets, buildId)

      setActiveBuildId(buildId)
      setActiveTicketId(ticket?.id ?? null)
      setActiveVehicleId(vehicle.id)
      setSelectedPartIds(
        (build.partIds ?? []).filter((partId) => isPartCompatible(vehicle.id, partId)),
      )
      setBuildName(build.name)
      setActiveCategory('all')
      setDrawerOpen(false)
      scrollToSection('configurator')

      if (ticket && isLockedTicketStatus(ticket.status)) {
        notify(`${build.name} loaded — locked, technicians have the car`)
      } else {
        notify(`${build.name} loaded`)
      }
    },
    [notify, scrollToSection, tickets],
  )

  const handleDelete = useCallback(
    (build) => {
      removeBuild(build.id)
      if (activeBuildId && getBuildId(build) === activeBuildId) {
        setActiveBuildId(null)
        setActiveTicketId(null)
      }
      notify('Build removed from garage')
    },
    [activeBuildId, notify, removeBuild],
  )

  const handleClearParts = useCallback(() => {
    if (isLocked) return
    setSelectedPartIds([])
  }, [isLocked])

  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), [])

  const handleDrawerStart = useCallback(() => {
    setDrawerOpen(false)
    scrollToSection('configurator')
  }, [scrollToSection])

  return (
    <div className="app">
      <Navbar
        savedCount={builds.length}
        ticketCount={tickets.length}
        technicianMode={technicianMode}
        onToggleTechnician={handleToggleTechnician}
        onNavigate={scrollToSection}
        onOpenSaved={() => setDrawerOpen(true)}
      />

      <main>
        <Hero vehicle={activeVehicle} onStart={() => scrollToSection('configurator')} />

        <div className="trust-strip">
          <div className="trust-inner">
            <span><strong>Green-light fitment</strong> only verified parts appear</span>
            <span><strong>Live dyno totals</strong> recalculated per chassis</span>
            <span><strong>Garage log</strong> saved in this browser</span>
          </div>
        </div>

        <Platforms
          activeVehicleId={activeVehicleId}
          disabled={isLocked}
          onSelect={(vehicleId) => handleSelectVehicle(vehicleId, { scroll: true })}
        />

        <Configurator
          vehicles={VEHICLES}
          activeVehicle={activeVehicle}
          compatibleParts={compatibleParts}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          selectedPartIds={selectedPartIds}
          onTogglePart={handleTogglePart}
          onSelectVehicle={(vehicleId) => handleSelectVehicle(vehicleId)}
          total={total}
          buildName={buildName}
          onBuildNameChange={setBuildName}
          onSave={handleSave}
          onClearParts={handleClearParts}
          customerName={customerName}
          onCustomerNameChange={setCustomerName}
          onSubmitTicket={handleSubmitTicket}
          locked={isLocked}
          lockedMessage={LOCKED_MESSAGE}
          syncedTicketId={queuedTicket?.id ?? null}
        />

        <ShopTickets
          tickets={tickets}
          technicianMode={technicianMode}
          onToggleTechnician={handleToggleTechnician}
          onAdvance={advanceTicket}
          onRemove={removeTicket}
          onClearCompleted={clearCompletedTickets}
        />
      </main>

      <footer className="site-foot">
        <div className="foot-inner">
          <span className="foot-brand">
            <span className="brand-bolt" aria-hidden="true">🔧</span> AUTOTORIUM // TUNING BAY
          </span>
          <p>
            JDM pit-bay configurator · strict fitment engine ·{' '}
            <a className="foot-link" href="/cars/CREDITS.md" target="_blank" rel="noreferrer">
              Photo credits
            </a>
          </p>
          <span className="foot-meta">© 2026 AUTOTORIUM</span>
        </div>
      </footer>

      <SavedBuildsDrawer
        open={drawerOpen}
        builds={builds}
        onClose={handleCloseDrawer}
        onLoad={handleLoad}
        onDelete={handleDelete}
        onStart={handleDrawerStart}
      />

      {toast && (
        <div className="toast" role="status" key={toast.id}>
          <span className="toast-dot" aria-hidden="true" />
          {toast.message}
        </div>
      )}
    </div>
  )
}
