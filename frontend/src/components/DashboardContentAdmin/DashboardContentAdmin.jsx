import 'bootstrap/dist/css/bootstrap.min.css'
import './DashboardContentAdmin.css'
import { DashboardNumerosPanel } from '../DashboardNumeros/DashboardNumerosPanel.jsx'
import { AdocoesPanel } from '../AdocoesPanel/AdocoesPanel.jsx'
import { PetManagementPanel } from '../PetManagementPanel/PetManagementPanel.jsx'
import { AdotantesPanel } from '../AdotantesPanel/AdotantesPanel.jsx'

export function DashboardNumeros() {
  return <DashboardNumerosPanel />
}

export function DashboardPets() {
  return <PetManagementPanel />
}

export function DashboardAdotantes() {
  return <AdotantesPanel />
}

export function DashboardAdocoes() {
  return <AdocoesPanel />
}
