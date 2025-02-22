"use client";

interface FooterProps {
  className?: string;
}

export default function BananaFooter({ className = "" }: FooterProps) {
  return (
    <footer className={`size-full bg-gray-800 p-8 ${className}`}>
      <div className="flex h-full justify-between">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Company Name</h3>
          <p className="text-sm text-gray-400">
            123 Street Name
            <br />
            City, State 12345
            <br />
            contact@company.com
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>About Us</li>
            <li>Services</li>
            <li>Contact</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Follow Us</h3>
          <div className="flex space-x-4 text-gray-400">
            <span>Twitter</span>
            <span>Facebook</span>
            <span>Instagram</span>
          </div>
        </div>
      </div>
      <div className="flex h-full justify-between">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Company Name</h3>
          <p className="text-sm text-gray-400">
            123 Street Name
            <br />
            City, State 12345
            <br />
            contact@company.com
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>About Us</li>
            <li>Services</li>
            <li>Contact</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Follow Us</h3>
          <div className="flex space-x-4 text-gray-400">
            <span>Twitter</span>
            <span>Facebook</span>
            <span>Instagram</span>
          </div>
        </div>
      </div>
      <div className="flex h-full justify-between">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Company Name</h3>
          <p className="text-sm text-gray-400">
            123 Street Name
            <br />
            City, State 12345
            <br />
            contact@company.com
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>About Us</li>
            <li>Services</li>
            <li>Contact</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Follow Us</h3>
          <div className="flex space-x-4 text-gray-400">
            <span>Twitter</span>
            <span>Facebook</span>
            <span>Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
