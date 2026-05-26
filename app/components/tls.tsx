import { useSelector } from "react-redux"
import type { RootState } from "../lib/store"

export default function Tls() {
  const tls = useSelector((s: RootState) => s.order.tlsVolumes)

  return (
    <div>
      <h3>TLS Volumes</h3>
      <ul>
        <li>TLS1: {tls.tls1} L / 11000 L</li>
        <li>TLS2: {tls.tls2} L / 5200 L</li>
        <li>TLS3: {tls.tls3} L / 5200 L</li>
      </ul>
    </div>
  )
}
