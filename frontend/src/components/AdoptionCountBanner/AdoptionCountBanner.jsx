import CountUp from 'react-countup'
import { CtaBanner } from '../CtaBanner/CtaBanner'
import { useAdoptionCount } from '../../hooks/useAdoptionCount'

export function AdoptionCountBanner() {
  const { petsAdotados, loading: loadingBanner } = useAdoptionCount()

  let countComponent
  let adoptionsCountTitle

  if (loadingBanner) {
    countComponent = null
    adoptionsCountTitle =
      'Buscando o total de pets que já encontraram um lar...'
  } else {
    countComponent = (
      <CountUp
        enableScrollSpy={true}
        scrollSpyOnce={true}
        end={petsAdotados}
        duration={2.5}
        separator="."
        start={0}
        key={petsAdotados}
      />
    )

    adoptionsCountTitle = (
      <>
        O Buscar Patas já ajudou{' '}
        <span className="text-principal fw-bold">{countComponent}</span> pets a
        encontrarem um lar
      </>
    )
  }

  const bannerProps = {
    imageUrl: '/mao-humana-segurando-pata.jpg',
    imageAlt: 'Mão segurando patinha',
    buttonText: 'Saiba mais sobre nós',
    buttonHref: '/sobre',
    reversed: true,
  }

  return <CtaBanner {...bannerProps} title={adoptionsCountTitle} />
}
