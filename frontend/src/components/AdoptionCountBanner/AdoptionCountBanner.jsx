import { CtaBanner } from '../CtaBanner/CtaBanner'
import { useAdoptionCount } from '../../hooks/useAdoptionCount'

export function AdoptionCountBanner() {
  const { petsAdotados, loading: loadingBanner } = useAdoptionCount()

  const adoptionsCountTitle = loadingBanner
    ? 'Buscando o total de pets que já encontraram um lar...'
    : `O Buscar Patas já ajudou ${petsAdotados} pets a encontrarem um lar`

  const bannerProps = {
    imageUrl: '/mao-humana-segurando-pata.jpg',
    imageAlt: 'Mão segurando patinha',
    buttonText: 'Saiba mais sobre nós',
    buttonHref: '/sobre',
    reversed: true,
  }

  return <CtaBanner {...bannerProps} title={adoptionsCountTitle} />
}
