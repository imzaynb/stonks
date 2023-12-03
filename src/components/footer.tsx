import Link from "next/link"
import { Button } from "./ui/button"

const Footer = () => {
  return (
    <p>
      Data provided by
      <Button variant="link">
        <Link href="https://www.alphavantage.co/">AlphaVantage</Link>
      </Button>.
    </p>
  )
}

export default Footer;