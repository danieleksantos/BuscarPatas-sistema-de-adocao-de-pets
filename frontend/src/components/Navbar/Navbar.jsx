import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar as BSNavbar, Nav, Button, Dropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserCircle,
  faSignOutAlt,
  faCog,
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'
import './Navbar.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function Navbar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState('Usuário') // Para exibir o nome do usuário

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setUserRole(decodedToken.role)

        // Fetch user profile to get the name
        const fetchUserProfile = async () => {
          try {
            const response = await fetch(`${API_URL}/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            if (response.ok) {
              const data = await response.json()
              setUserName(data.nome || 'Usuário') // Pega o nome ou usa "Usuário"
            }
          } catch (error) {
            console.error('Erro ao buscar perfil do usuário:', error)
          }
        }
        fetchUserProfile()
      } catch (error) {
        console.error('Erro ao decodificar token:', error)
        logout() // Força logout se o token for inválido
      }
    } else {
      setUserRole(null)
      setUserName('Usuário')
    }
  }, [token, logout])

  const handleLogout = () => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: 'Você será desconectado da sua conta.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6b6b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, sair!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
        navigate('/')
        Swal.fire(
          'Desconectado!',
          'Você foi desconectado com sucesso.',
          'success',
        )
      }
    })
  }

  const handleDashboardRedirect = () => {
    if (userRole === 'ADMIN') {
      navigate('/dashboardAdmin')
    } else if (userRole === 'USER') {
      navigate('/dashboardUser')
    }
  }

  return (
    <BSNavbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      className="px-3"
    >
      <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
        <img
          src={'/logo.png'}
          width="40"
          height="40"
          className="d-inline-block align-top me-2"
          alt="BuscarPatas logo"
        />
        <span className="text-light fs-5 fw-bold">BuscarPatas</span>
      </BSNavbar.Brand>
      <BSNavbar.Toggle aria-controls="responsive-navbar-nav" />
      <BSNavbar.Collapse id="responsive-navbar-nav">
        <Nav className="mx-auto text-center">
          <Nav.Link as={Link} to="/" className="nav-link-custom">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/sobre" className="nav-link-custom">
            Sobre
          </Nav.Link>
          <Nav.Link as={Link} to="/buscar" className="nav-link-custom">
            Buscar
          </Nav.Link>
          <Nav.Link as={Link} to="/faq" className="nav-link-custom">
            FAQ
          </Nav.Link>
        </Nav>
        <Nav className="ms-auto d-flex align-items-center justify-content-center justify-content-lg-end">
          {token ? (
            <Dropdown align="end" className="user-dropdown">
              <Dropdown.Toggle
                as={Button}
                variant="link"
                id="dropdown-basic"
                className="text-light nav-link-custom d-flex align-items-center"
              >
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="me-2"
                  size="lg"
                />
                <span className="d-none d-lg-inline">
                  {userName.split(' ')[0]}
                </span>{' '}
                {/* Exibe só o primeiro nome em telas maiores */}
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-dark">
                <Dropdown.Item onClick={handleDashboardRedirect}>
                  <FontAwesomeIcon icon={faCog} className="me-2" /> Meu Painel
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Sair
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Button
                as={Link}
                to="/cadastro"
                variant="outline-light"
                className="me-lg-3 btn-custom"
              >
                Cadastre-se
              </Button>
              <Button
                as={Link}
                to="/login"
                variant="light"
                className="btn-custom mt-2 mt-lg-0"
              >
                Entrar
              </Button>
            </>
          )}
        </Nav>
      </BSNavbar.Collapse>
    </BSNavbar>
  )
}
