import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Platforms from './components/Platforms'
import Configurator from './components/Configurator'
import SavedBuildsDrawer from './components/SavedBuildsDrawer'
import ShopTickets from './components/ShopTickets'
import useSavedBuilds from './hooks/useSavedBuilds'
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

export default function App() {
  // Active configurator and role-view state
  const [activeVehicleId, setActiveVehicleId] = useState(DEFAULT_VEHICLE_ID)
  const [selectedPartIds, setSelectedPartIds] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [buildName, setBuildName] = useState('')
  const [activeBuildId, setActiveBuildId] = useState(null) // Build currently in the workbench (saved or draft)
  const [activeTicketId, setActiveTicketId] = useState(null) // Shop-floor ticket linked to that build
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [technicianMode, setTechnicianMode] = useState(false) // false = Customer View, true = Technician View
  const [customerName, setCustomerName] = useState('')

  // Saved garage builds and the single shared shop-floor ticket store
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

  // Filter catalog parts to only those verified compatible with the active JDM chassis
  const compatibleParts = useMemo(
    () => getCompatibleParts(activeVehicleId),
    [activeVehicleId],
  )

  // Map selected part IDs back to full part objects
  const selectedParts = useMemo(
    () => selectedPartIds.map((partId) => getPartById(partId)).filter(Boolean),
    [selectedPartIds],
  )

  // Calculate live total price (vehicle base price + sum of selected part modifiers)
  const total = useMemo(
    () =>
      selectedParts.reduce((sum, part) => sum + part.priceModifier, activeVehicle.basePrice),
    [activeVehicle, selectedParts],
  )

  const resolvedBuildName = buildName.trim() || `${activeVehicle.name} Custom`
  const resolvedTotal = Number(total.toFixed(2))

  // Read the linked ticket live, so a bay advance locks the loaded build
  // without reloading it.
  const activeTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === activeTicketId) ?? null,
    [activeTicketId, tickets],
  )
  const queuedTicket = activeTicket?.status === TICKET_STATUS.PENDING ? activeTicket : null
  const isLocked = Boolean(activeTicket && isLockedTicketStatus(activeTicket.status))

  // Auto-dismiss status toast notifications after 3 seconds
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const notify = useCallback((message) => {
    setToast({ id: Date.now(), message })
  }, [])

  // Smooth-scroll helper for navbar and CTA buttons
  const scrollToSection = useCallback((sectionId) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Switch active vehicle and automatically drop any parts incompatible with the new chassis
  const handleSelectVehicle = useCallback(
    (vehicleId, { scroll = false } = {}) => {
      if (isLocked) return
      if (!VEHICLES.some((vehicle) => vehicle.id === vehicleId)) return

      setActiveVehicleId(vehicleId)
      setSelectedPartIds((previous) =>
        previous.filter((partId) => isPartCompatible(vehicleId, partId)),
      )
      setActiveCategory('all')

      if (scroll) scrollToSection('configurator')
    },
    [isLocked, scrollToSection],
  )

  // Toggle a compatible part on or off in the current build
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

  // Save the current build to the Garage, keeping its id (and linked ticket) stable
  const handleSave = useCallback(() => {
    if (isLocked) return

    const buildId = activeBuildId ?? makeId()
    const existingBuild = activeBuildId
      ? builds.find((build) => build.id === activeBuildId)
      : null
    const patch = {
      name: resolvedBuildName,
      vehicleId: activeVehicle.id,
      partIds: [...selectedPartIds],
      totalPrice: resolvedTotal,
    }

    if (existingBuild) {
      updateBuild(existingBuild.id, patch)
    } else {
      addBuild({ id: buildId, ...patch, createdAt: new Date().toISOString() })
      setActiveBuildId(buildId)
    }

    setDrawerOpen(true)
    notify(existingBuild ? 'Build updated in your garage' : 'Build saved to your garage')
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

  // Submit the current workbench configuration directly to the Shop Floor Queue
  const handleSubmitTicket = useCallback(() => {
    if (isLocked) return

    const buildId = activeBuildId ?? makeId()
    setActiveBuildId(buildId)

    const enteredCustomer = customerName.trim()
    const spec = {
      buildName: resolvedBuildName,
      vehicleId: activeVehicle.id,
      partIds: [...selectedPartIds],
      totalPrice: resolvedTotal,
    }

    const existingTicket = findTicketForBuild(tickets, buildId)

    if (existingTicket) {
      // A ticket that already left the queue is locked; never duplicate it.
      if (existingTicket.status !== TICKET_STATUS.PENDING) {
        notify(`Ticket #${existingTicket.id} is already on the shop floor`)
        return
      }
      // Keep the customer already on the ticket unless a new name was typed.
      updateTicket(
        existingTicket.id,
        enteredCustomer ? { ...spec, customerName: enteredCustomer } : spec,
      )
      setActiveTicketId(existingTicket.id)
      notify('Shop floor ticket updated')
    } else {
      const ticket = {
        id: nextTicketNumber(tickets),
        buildId,
        ...spec,
        customerName: enteredCustomer || 'Walk-in customer',
        status: TICKET_STATUS.PENDING,
        createdAt: new Date().toISOString(),
      }
      addTicket(ticket)
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

  // Submit a previously saved build from the Saved Builds drawer to the Shop Floor Queue
  const handleSubmitSavedBuild = useCallback(
    (build) => {
      const existingTicket = findTicketForBuild(tickets, build.id)

      if (existingTicket && existingTicket.status !== TICKET_STATUS.PENDING) {
        setDrawerOpen(false)
        notify(`Ticket #${existingTicket.id} is already on the shop floor — locked`)
        return
      }

      const enteredCustomer = customerName.trim()
      const spec = {
        buildName: build.name,
        vehicleId: build.vehicleId,
        partIds: [...(build.partIds ?? [])],
        totalPrice: Number(build.totalPrice.toFixed(2)),
      }

      if (existingTicket) {
        updateTicket(
          existingTicket.id,
          enteredCustomer ? { ...spec, customerName: enteredCustomer } : spec,
        )
        if (activeBuildId === build.id) setActiveTicketId(existingTicket.id)
        setDrawerOpen(false)
        notify(`Queued Ticket #${existingTicket.id} updated with the saved build`)
        scrollToSection('shop')
        return
      }

      const ticket = {
        id: nextTicketNumber(tickets),
        buildId: build.id,
        ...spec,
        customerName: enteredCustomer || 'Walk-in customer',
        status: TICKET_STATUS.PENDING,
        createdAt: new Date().toISOString(),
      }

      addTicket(ticket)
      if (activeBuildId === build.id) setActiveTicketId(ticket.id)
      setDrawerOpen(false)
      notify(`Ticket #${ticket.id} queued in bay 01`)
      scrollToSection('shop')
    },
    [
      activeBuildId,
      addTicket,
      customerName,
      notify,
      scrollToSection,
      tickets,
      updateTicket,
    ],
  )

  // Toggle between Customer View and Technician View and scroll to top
  const handleToggleTechnician = useCallback(() => {
    setTechnicianMode((previous) => !previous)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Load a saved garage build back into the Configurator workbench for editing
  const handleLoad = useCallback(
    (build) => {
      const vehicle = VEHICLES.find((item) => item.id === build.vehicleId)
      if (!vehicle) {
        notify('That build’s chassis is no longer available')
        return
      }

      const ticket = findTicketForBuild(tickets, build.id)

      setActiveBuildId(build.id)
      setActiveTicketId(ticket?.id ?? null)
      setActiveVehicleId(vehicle.id)
      setBuildName(build.name)
      setSelectedPartIds(
        (build.partIds ?? []).filter((partId) => isPartCompatible(vehicle.id, partId)),
      )
      setActiveCategory('all')
      setDrawerOpen(false)
      scrollToSection('configurator')

      if (ticket && isLockedTicketStatus(ticket.status)) {
        notify(`${build.name} is on the shop floor — modifications locked`)
      } else {
        notify(`${build.name} loaded into workbench`)
      }
    },
    [notify, scrollToSection, tickets],
  )

  const handleDelete = useCallback(
    (build) => {
      removeBuild(build.id)
      notify('Build removed from garage')
    },
    [notify, removeBuild],
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
        {/* Technician Mode displays only the interactive bay board; Customer Mode displays the builder */}
        {technicianMode ? (
          <ShopTickets
            tickets={tickets}
            technicianMode={technicianMode}
            onToggleTechnician={handleToggleTechnician}
            onAdvance={advanceTicket}
            onRemove={removeTicket}
            onClearCompleted={clearCompletedTickets}
          />
        ) : (
          <>
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

            {/* Read-only customer tracker at the bottom of Customer View */}
            <ShopTickets
              tickets={tickets}
              technicianMode={false}
              onToggleTechnician={handleToggleTechnician}
              onAdvance={advanceTicket}
              onRemove={removeTicket}
              onClearCompleted={clearCompletedTickets}
            />
          </>
        )}
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
        onSubmitBuild={handleSubmitSavedBuild}
        onDelete={handleDelete}
        onStart={handleDrawerStart}
      />

      {/* Floating confirmation toast */}
      {toast && (
        <div className="toast" role="status" key={toast.id}>
          <span className="toast-dot" aria-hidden="true" />
          {toast.message}
        </div>
      )}
    </div>
  )
}
