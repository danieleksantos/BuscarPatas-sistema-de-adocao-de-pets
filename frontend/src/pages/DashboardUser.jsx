import { DashboardLayout } from '../components/DashboardLayout/DashboardLayout'
import { MinhasAdocoes } from '../components/DashboardContentUser/MinhasAdocoes'
import { MinhasInformacoes } from '../components/DashboardContentUser/MinhasInformacoes'
import { BuscarPets } from '../components/DashboardContentUser/BuscarPets'

const userMenuItems = [
  { key: 'minhas-adocoes', label: 'MINHAS ADOÇÕES' },
  { key: 'minhas-informacoes', label: 'MINHAS INFORMAÇÕES' },
  { key: 'buscar-pets', label: 'BUSCAR PETS' },
]

const userContentMap = {
  'minhas-adocoes': MinhasAdocoes,
  'minhas-informacoes': MinhasInformacoes,
  'buscar-pets': BuscarPets,
}

export function DashboardUser() {
  return (
    <DashboardLayout
      menuItems={userMenuItems}
      contentMap={userContentMap}
      initialPanel="minhas-adocoes"
    />
  )
}
