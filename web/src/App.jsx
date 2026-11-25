import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Platforms from './components/Platforms'
import Configurator from './components/Configurator'
import SavedBuildsDrawer from './components/SavedBuildsDrawer'
import ShopTickets from './components/ShopTickets'
import useSavedBuilds from './hooks/useSavedBuilds'
import useTickets, { TICKET_STATUS, nextTicketNumber } from './hooks/useTickets'
import {
  VEHICLES,
  getCompatibleParts,
  getPartById,
  isPartCompatible,
} from './data/catalog'
import { makeId } from './lib/format'

const DEFAULT_VEHICLE_ID = VEHICLES[0].id

export default function App() {
  // Active configurator and role-view state
  const [activeVehicleId, setActiveVehicleId] = useState(DEFAULT_VEHICLE_ID)
  const [selectedPartIds, setSelectedPartIds] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [buildName, setBuildName] = useState('')
  const [editingBuildId, setEditingBuildId] = useState(null) // Tracks a loaded garage build being edited
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [technicianMode, setTechnicianMode] = useState(false) // false = Customer View, true = Technician View
  const [customerName, setCustomerName] = useState('')

  // Custom localStorage hooks for saved garage builds and shop floor work-order tickets
  const { builds, addBuild, removeBuild } = useSavedBuilds()
  const { tickets, addTicket, syncBuildTicket, advanceTicket, removeTicket, clearCompletedTickets } = useTickets()

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
      if (!VEHICLES.some((vehicle) => vehicle.id === vehicleId)) return

      setActiveVehicleId(vehicleId)
      setEditingBuildId(null)
      setSelectedPartIds((previous) =>
        previous.filter((partId) => isPartCompatible(vehicleId, partId)),
      )
      setActiveCategory('all')

      if (scroll) scrollToSection('configurator')
    },
    [scrollToSection],
  )

  // Toggle a compatible part on or off in the current build
  const handleTogglePart = useCallback(
    (partId) => {
      if (!isPartCompatible(activeVehicleId, partId)) return
      setSelectedPartIds((previous) =>
        previous.includes(partId)
          ? previous.filter((id) => id !== partId)
          : [...previous, partId],
      )
    },
    [activeVehicleId],
  )

  // Save the current build to the Garage and update any matching ticket still waiting in the Queue
  const handleSave = useCallback(() => {
    const resolvedName = buildName.trim() || `${activeVehicle.name} Custom`
    const buildId = editingBuildId ?? makeId()

    const build = {
      id: buildId,
      name: resolvedName,
      vehicleId: activeVehicle.id,
      partIds: [...selectedPartIds],
      totalPrice: Number(total.toFixed(2)),
      createdAt: new Date().toISOString(),
    }

    // Replace existing entry if editing a previously loaded build
    if (editingBuildId) {
      removeBuild(editingBuildId)
    }
    addBuild(build)

    // Sync updated parts and total price to the Shop Floor if this build is still PENDING in the queue
    const syncedTicketId = syncBuildTicket ? syncBuildTicket(build) : null

    setEditingBuildId(null)
    setBuildName('')
    setDrawerOpen(true)

    if (syncedTicketId) {
      notify(`Build saved & Queued Ticket #${syncedTicketId} updated on shop floor`)
    } else {
      notify('Build saved to your garage')
    }
  }, [
    activeVehicle,
    addBuild,
    buildName,
    editingBuildId,
    notify,
    removeBuild,
    selectedPartIds,
    syncBuildTicket,
    total,
  ])

  // Submit the current workbench configuration directly to the Shop Floor Queue
  const handleSubmitTicket = useCallback(() => {
    const resolvedName = buildName.trim() || `${activeVehicle.name} Custom`
    const draftBuild = {
      id: editingBuildId ?? makeId(),
      name: resolvedName,
      vehicleId: activeVehicle.id,
      partIds: [...selectedPartIds],
      totalPrice: Number(total.toFixed(2)),
    }

    // If a queued ticket already exists for this build, update it in place instead of creating a duplicate
    const syncedTicketId = syncBuildTicket ? syncBuildTicket(draftBuild) : null
    if (syncedTicketId) {
      notify(`Queued Ticket #${syncedTicketId} updated with latest workbench parts`)
      scrollToSection('shop')
      return
    }

    const ticket = {
      id: nextTicketNumber(tickets),
      buildId: draftBuild.id,
      customerName: customerName.trim() || 'Walk-in customer',
      buildName: resolvedName,
      vehicleId: activeVehicle.id,
      partIds: [...selectedPartIds],
      totalPrice: Number(total.toFixed(2)),
      status: TICKET_STATUS.PENDING,
      createdAt: new Date().toISOString(),
    }

    addTicket(ticket)
    setCustomerName('')
    notify(`Ticket #${ticket.id} queued in bay 01`)
    scrollToSection('shop')
  }, [
    activeVehicle,
    addTicket,
    buildName,
    customerName,
    editingBuildId,
    notify,
    scrollToSection,
    selectedPartIds,
    syncBuildTicket,
    tickets,
    total,
  ])

  // Submit a previously saved build from the Saved Builds drawer to the Shop Floor Queue
  const handleSubmitSavedBuild = useCallback(
    (build) => {
      const syncedTicketId = syncBuildTicket ? syncBuildTicket(build) : null
      if (syncedTicketId) {
        setDrawerOpen(false)
        notify(`Queued Ticket #${syncedTicketId} updated with latest build`)
        scrollToSection('shop')
        return
      }

      const ticket = {
        id: nextTicketNumber(tickets),
        buildId: build.id,
        customerName: customerName.trim() || 'Walk-in customer',
        buildName: build.name,
        vehicleId: build.vehicleId,
        partIds: [...(build.partIds ?? [])],
        totalPrice: Number(build.totalPrice.toFixed(2)),
        status: TICKET_STATUS.PENDING,
        createdAt: new Date().toISOString(),
      }

      addTicket(ticket)
      setDrawerOpen(false)
      notify(`Ticket #${ticket.id} queued in bay 01`)
      scrollToSection('shop')
    },
    [addTicket, customerName, notify, scrollToSection, syncBuildTicket, tickets],
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

      setActiveVehicleId(vehicle.id)
      setEditingBuildId(build.id)
      setBuildName(build.name)
      setSelectedPartIds(
        (build.partIds ?? []).filter((partId) => isPartCompatible(vehicle.id, partId)),
      )
      setActiveCategory('all')
      setDrawerOpen(false)
      scrollToSection('configurator')
      notify(`${build.name} loaded into workbench`)
    },
    [notify, scrollToSection],
  )

  const handleDelete = useCallback(
    (build) => {
      removeBuild(build.id)
      notify('Build removed from garage')
    },
    [notify, removeBuild],
  )

  const handleClearParts = useCallback(() => {
    setSelectedPartIds([])
  }, [])

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
        {/* Technician Mode displays only the interactive Kanban bay board; Customer Mode displays the builder */}
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
