import Navbar from "./navbar";
import "./styles.css"; // Import custom styles

export default function Home() {
  return (
    <div className="min-h-screen w-screen justify-between bg-white">
      <Navbar />
      <header className="flex px-10 py-7">
        <p className="flex text-black text-6xl w-1/4">Make any template yours with ease.</p>
        <p className="flex text-black text-3xl w-3/4">Whether you need a portfolio website, an online store, or a personal blog, you can use Squarespace's customizable and responsive website templates to get started.</p>
      </header>
      <main className="flex px-10">
        <aside className="w-64 h-screen overflow-y-auto bg-gray-100 custom-scrollbar ">
          <h2 className="text-xl font-bold mb-4 text-black">Types</h2>
          <ul>
            <li className="mb-2"><button className="text-blue-500">Option 1</button></li>
            <li className="mb-2"><button className="text-blue-500">Option 2</button></li>
            <li className="mb-2"><button className="text-blue-500">Option 3</button></li>
            <li className="mb-2"><button className="text-blue-500">Option 4</button></li>
          </ul>
        </aside>
        <section className="w-3/4 h-screen overflow-y-auto p-5 bg-white custom-scrollbar">
          <h2 className="text-xl font-bold mb-4">Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Repeat this block for multiple templates */}
            <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-bold">Template 1</h3>
              <p className="text-sm">Description of Template 1</p>
            </div>
            <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-bold">Template 2</h3>
              <p className="text-sm">Description of Template 2</p>
            </div>
            {/* ...more templates... */}
          </div>
        </section>
      </main>
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
    </div>
  );
}
