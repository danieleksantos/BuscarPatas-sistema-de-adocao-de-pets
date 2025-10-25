import { useState } from 'react'
import {
  Navbar,
  Container,
  Nav,
  Button,
  Dropdown,
  Badge,
} from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'
import { NavLinks } from './NavLinks'
import './Header.css'
import '../../styles/global.css'

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <Navbar
        className="custom-header"
        variant="dark"
        expand="lg"
        sticky="top"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              className="header-logo"
              src="/logo.png"
              alt="logo Buscar Patas"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="nav-container">
            <Nav className="mx-auto">
              <NavLinks onNavLinkClick={() => setExpanded(false)} />
            </Nav>

            <Nav className="justify-content-center">
              {isAuthenticated && user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle as="div" className="user-avatar-toggle">
                    <div className="user-avatar">
                      {user.role === 'ADMIN' && (
                        <Badge bg="info" className="admin-badge">
                          <FontAwesomeIcon icon={faShieldHalved} />
                        </Badge>
                      )}
                      {user.nome ? user.nome.charAt(0).toUpperCase() : '?'}
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.ItemText className="fw-bold">
                      {user.nome}
                    </Dropdown.ItemText>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      as={Link}
                      to={
                        user.role === 'ADMIN'
                          ? '/dashboardAdmin'
                          : '/dashboardUser'
                      }
                    >
                      Meu Painel
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Sair</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <div className="d-flex flex-column flex-lg-row align-items-center">
                    <Button
                      as={Link}
                      to="/cadastro"
                      className={`btn-principal me-lg-2 mb-2 mb-lg-0 ${location.pathname === '/cadastro' ? 'active' : ''}`}
                      onClick={() => setExpanded(false)}
                    >
                      Cadastre-se
                    </Button>

                    <Button
                      as={Link}
                      to="/login"
                      className={`btn-principal ${location.pathname === '/login' ? 'active' : ''}`}
                      onClick={() => setExpanded(false)}
                    >
                      Entrar
                    </Button>
                  </div>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {expanded && (
        <div
          className="navbar-overlay d-lg-none"
          onClick={() => setExpanded(false)}
        ></div>
      )}
    </>
  )
}
