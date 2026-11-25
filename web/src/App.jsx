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
  const [activeVehicleId, setActiveVehicleId] = useState(DEFAULT_VEHICLE_ID)
  const [selectedPartIds, setSelectedPartIds] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [buildName, setBuildName] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [technicianMode, setTechnicianMode] = useState(false)
  const [customerName, setCustomerName] = useState('')

  const { builds, addBuild, removeBuild } = useSavedBuilds()
  const { tickets, addTicket, advanceTicket, removeTicket, clearCompletedTickets } = useTickets()

  const activeVehicle = VEHICLES.find((vehicle) => vehicle.id === activeVehicleId) ?? VEHICLES[0]

  const compatibleParts = useMemo(
    () => getCompatibleParts(activeVehicleId),
    [activeVehicleId],
  )

   selectedParts = useMemo(
    () => selectedPartIds.map((partId) => getPartById(partId)).filter(Boolean),
    [selectedPartIds],
  )

  const total = useMemo(
    () =>
      selectedParts.reduce((sum, part) => sum + part.priceModifier, activeVehicle.basePrice),
    [activeVehicle, selectedParts],
  )

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

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
    [scrollToSection],
  )

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

  const handleSave = useCallback(() => {
    const build = {
      id: makeId(),
      name: buildName.trim() || `${activeVehicle.name} Custom`,
      vehicleId: activeVehicle.id,
      partIds: [...selectedPartIds],
      totalPrice: Number(total.toFixed(2)),
      createdAt: new Date().toISOString(),
    }

    addBuild(build)
    setBuildName('')
    setDrawerOpen(true)
    notify('Build saved to your garage')
  }, [activeVehicle, addBuild, buildName, notify, selectedPartIds, total])

  const handleSubmitTicket = useCallback(() => {
    const ticket = {
      id: nextTicketNumber(tickets),
      customerName: customerName.trim() || 'Walk-in customer',
      buildName: buildName.trim() || `${activeVehicle.name} Custom`,
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
    notify,
    scrollToSection,
    selectedPartIds,
    tickets,
    total,
  ])

  const handleSubmitSavedBuild = useCallback(
    (build) => {
      const ticket = {
        id: nextTicketNumber(tickets),
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
    [addTicket, customerName, notify, scrollToSection, tickets],
  )

  const handleToggleTechnician = useCallback(() => {
    setTechnicianMode((previous) => !previous)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  
  const handleLoad = useCallback(
    (build) => {
      const vehicle = VEHICLES.find((item) => item.id === build.vehicleId)
      if (!vehicle) {
        notify('That build’s chassis is no longer available')
        return
      }

      setActiveVehicleId(vehicle.id)
      setSelectedPartIds(
        (build.partIds ?? []).filter((partId) => isPartCompatible(vehicle.id, partId)),
      )
      setActiveCategory('all')
      setDrawerOpen(false)
      scrollToSection('configurator')
      notify(`${build.name} loaded`)
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

      {toast && (
        <div className="toast" role="status" key={toast.id}>
          <span className="toast-dot" aria-hidden="true" />
          {toast.message}
        </div>
      )}
    </div>
  )
}
