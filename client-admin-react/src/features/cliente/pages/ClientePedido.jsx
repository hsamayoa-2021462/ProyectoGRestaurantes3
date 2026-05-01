// src/features/cliente/pages/ClientePedido.jsx
import { useParams } from 'react-router-dom'
export default function ClientePedido() {
  const { id } = useParams()
  return <div style={{ padding: 40, color: '#f0ead8', fontFamily: 'Outfit, sans-serif' }}>Pedido #{id} — próximamente</div>
}