import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white text-center py-3">
        <p className="mb-0">
          © {new Date().getFullYear()} CiviCore | Smart City Platform
        </p>
      </footer>
  );
};

export default Footer;