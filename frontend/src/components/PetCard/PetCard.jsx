import { Card, Button, Badge } from 'react-bootstrap'
import './PetCard.css'
import '../PetManagementPanel/PetManagementPanel.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirstLetter } from '../../utils/formatters'
import logoBuscarPatas from '../../assets/logo.png'

export function PetCard({
  pet,
  onDetailClick,
  isAdminView = false,
  onEditClick,
  onDeleteClick,
}) {
  const imageUrl = pet.imagem_url1 || logoBuscarPatas
  const petNome = capitalizeFirstLetter(pet.nome)
  const statusVariant =
    pet.status === 'ADOTADO'
      ? 'success'
      : pet.status === 'DISPONIVEL'
        ? 'primary'
        : 'secondary'
  const imageFit = pet.imagem_url1 ? 'cover' : 'contain'

  return (
    <Card className="h-100 shadow-sm pet-card">
      <Card.Img
        variant="top"
        src={imageUrl}
        className="pet-card-img"
        alt={pet.imagem_url1 ? `Foto de ${petNome}` : 'Logo Buscar Patas'}
        style={{ objectFit: imageFit }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{petNome}</Card.Title>

        <hr className="my-1" />

        <Card.Text className="text-secondary flex-grow-1 pet-card-description">
          {pet.descricao?.substring(0, 80)}
          {pet.descricao?.length > 80 ? '...' : ''}
        </Card.Text>

        <div className="d-flex flex-wrap gap-1 pet-card-attributes mb-auto">
          {pet.tamanho && (
            <Badge bg="info" text="dark" className="me-1 badge-attribute">
              {pet.tamanho}
            </Badge>
          )}
          {pet.personalidade && (
            <Badge bg="warning" text="dark" className="badge-attribute">
              {pet.personalidade}
            </Badge>
          )}
        </div>

        {isAdminView && pet.status && (
          <div className="pet-status-container-admin mt-2">
            <Badge
              bg={statusVariant}
              className="w-100 pet-status-badge-fullwidth"
            >
              {pet.status}
            </Badge>
          </div>
        )}

        {!isAdminView && onDetailClick && (
          <Button
            variant="primary"
            className="btn-principal mt-2"
            onClick={() => onDetailClick(pet)}
          >
            Ver Detalhes
          </Button>
        )}
      </Card.Body>
      {isAdminView && onEditClick && onDeleteClick && (
        <Card.Footer className="pet-card-admin-footer">
          <div className="action-buttons-group">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="action-btn-card edit"
              onClick={() => onEditClick(pet)}
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="action-btn-card delete"
              onClick={() => onDeleteClick(pet)}
            />
          </div>
        </Card.Footer>
      )}
    </Card>
  )
}
