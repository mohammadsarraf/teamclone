export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-bold">About Us</h3>
            <p className="text-sm">We provide customizable and responsive website templates to help you create your perfect website.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Contact</h3>
            <p className="text-sm">Email: support@example.com</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-500">Facebook</a>
              <a href="#" className="text-blue-400">Twitter</a>
              <a href="#" className="text-pink-500">Instagram</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm">&copy; 2023 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
