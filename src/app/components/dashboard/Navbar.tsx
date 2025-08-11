"use client";
import Image from "next/image";
interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <Image src="/images/Logo.png" alt="Logo" className="logo" />
        <h1 className="uni-name">The University of Abdullah (TUA)</h1>
      </div>
      <button className="signout-btn" onClick={onLogout}>
        🔒 Log out
      </button>
    </header>
  );
}
